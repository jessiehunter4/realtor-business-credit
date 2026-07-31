import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, ArrowLeft, Trash2, Video } from "lucide-react";

const STORAGE_PATH = "public/hero-jessie.mp4";
const CAPTIONS_PATH = "public/hero-jessie.vtt";
const BUCKET = "site-videos";
const PUBLIC_FOLDER = "public";
const VIDEO_FILE = "hero-jessie.mp4";
const CAPTIONS_FILE = "hero-jessie.vtt";

// Convert SRT subtitle text to WebVTT format
const srtToVtt = (srt: string): string => {
  const body = srt
    .replace(/\r+/g, "")
    .replace(/^\uFEFF/, "")
    .replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2");
  return `WEBVTT\n\n${body.trim()}\n`;
};

const AdminVideoUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [exists, setExists] = useState(false);

  const [captionsFile, setCaptionsFile] = useState<File | null>(null);
  const [captionsUploading, setCaptionsUploading] = useState(false);
  const [captionsExists, setCaptionsExists] = useState(false);
  const [captionsUrl, setCaptionsUrl] = useState<string | null>(null);

  const refresh = async () => {
    const { data: files } = await supabase.storage
      .from(BUCKET)
      .list(PUBLIC_FOLDER, { search: VIDEO_FILE });
    const found = files?.some((f) => f.name === VIDEO_FILE) ?? false;
    setExists(found);
    if (found) {
      const { data } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(STORAGE_PATH, 60 * 60);
      setCurrentUrl(data?.signedUrl ?? null);
    } else {
      setCurrentUrl(null);
    }

    const { data: capFiles } = await supabase.storage
      .from(BUCKET)
      .list(PUBLIC_FOLDER, { search: CAPTIONS_FILE });
    const capFound = capFiles?.some((f) => f.name === CAPTIONS_FILE) ?? false;
    setCaptionsExists(capFound);
    if (capFound) {
      const { data } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(CAPTIONS_PATH, 60 * 60);
      setCaptionsUrl(data?.signedUrl ?? null);
    } else {
      setCaptionsUrl(null);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      toast.error("Please choose a video file (MP4, WebM, MOV).");
      return;
    }
    setUploading(true);
    setProgress(10);
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(STORAGE_PATH, file, {
        upsert: true,
        contentType: file.type,
        cacheControl: "3600",
      });
    setProgress(100);
    setUploading(false);
    if (error) {
      console.error(error);
      toast.error(`Upload failed: ${error.message}`);
      return;
    }
    toast.success("Hero video uploaded. It's live on the homepage.");
    setFile(null);
    await refresh();
  };

  const handleDelete = async () => {
    if (!confirm("Remove current hero video? The page will fall back to the image.")) return;
    const { error } = await supabase.storage.from(BUCKET).remove([STORAGE_PATH]);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Video removed.");
    await refresh();
  };

  const handleCaptionsUpload = async () => {
    if (!captionsFile) return;
    const name = captionsFile.name.toLowerCase();
    if (!name.endsWith(".vtt") && !name.endsWith(".srt")) {
      toast.error("Captions must be a .vtt or .srt file.");
      return;
    }
    setCaptionsUploading(true);
    try {
      const raw = await captionsFile.text();
      const vtt = name.endsWith(".srt") ? srtToVtt(raw) : raw;
      const blob = new Blob([vtt], { type: "text/vtt" });
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(CAPTIONS_PATH, blob, {
          upsert: true,
          contentType: "text/vtt",
          cacheControl: "3600",
        });
      if (error) {
        toast.error(`Captions upload failed: ${error.message}`);
        return;
      }
      toast.success("Captions uploaded. They'll show in the hero video player.");
      setCaptionsFile(null);
      await refresh();
    } finally {
      setCaptionsUploading(false);
    }
  };

  const handleCaptionsDelete = async () => {
    if (!confirm("Remove captions? The video will play without subtitles.")) return;
    const { error } = await supabase.storage.from(BUCKET).remove([CAPTIONS_PATH]);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Captions removed.");
    await refresh();
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to admin
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              Hero Video — Heygen / Founder Intro
            </CardTitle>
            <CardDescription>
              Upload an MP4/WebM/MOV. It replaces the hero image on the homepage. Use a tight,
              landscape-oriented clip (under ~50 MB recommended).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm font-semibold mb-2">Current hero video</p>
              {exists && currentUrl ? (
                <div className="space-y-3">
                  <video src={currentUrl} controls className="w-full rounded-lg border border-border bg-secondary" />
                  <Button variant="outline" size="sm" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4" /> Remove video
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No video uploaded yet. The site is showing the fallback hero image.
                </p>
              )}
            </div>

            <div className="border-t border-border pt-6">
              <p className="text-sm font-semibold mb-2">
                {exists ? "Replace video" : "Upload video"}
              </p>
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime,video/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                disabled={uploading}
              />
              {file && (
                <p className="text-xs text-muted-foreground mt-2">
                  Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)
                </p>
              )}
              {uploading && (
                <div className="mt-3 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
              <Button
                className="mt-4"
                onClick={handleUpload}
                disabled={!file || uploading}
              >
                <Upload className="h-4 w-4" />
                {uploading ? "Uploading…" : exists ? "Replace video" : "Upload video"}
              </Button>
            </div>

            <div className="border-t border-border pt-6">
              <p className="text-sm font-semibold mb-2">Captions / Subtitles</p>
              <p className="text-xs text-muted-foreground mb-3">
                Upload the caption file Heygen exports alongside the video. Both <code>.vtt</code> and{" "}
                <code>.srt</code> are accepted — SRT is auto-converted to WebVTT so it shows inside
                the video's CC button.
              </p>

              {captionsExists && captionsUrl ? (
                <div className="space-y-2 mb-4">
                  <p className="text-xs text-success">
                    ✓ Captions uploaded — viewers can toggle them on in the player.
                  </p>
                  <div className="flex gap-2">
                    <a
                      href={captionsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs underline text-primary"
                    >
                      Preview .vtt
                    </a>
                    <button
                      onClick={handleCaptionsDelete}
                      className="text-xs text-destructive underline"
                    >
                      Remove captions
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic mb-3">
                  No captions uploaded yet.
                </p>
              )}

              <input
                type="file"
                accept=".vtt,.srt,text/vtt,application/x-subrip"
                onChange={(e) => setCaptionsFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-sky file:text-sky-foreground hover:file:bg-sky/90"
                disabled={captionsUploading}
              />
              {captionsFile && (
                <p className="text-xs text-muted-foreground mt-2">
                  Selected: {captionsFile.name} ({(captionsFile.size / 1024).toFixed(1)} KB)
                </p>
              )}
              <Button
                className="mt-4"
                variant="outline"
                onClick={handleCaptionsUpload}
                disabled={!captionsFile || captionsUploading}
              >
                <Upload className="h-4 w-4" />
                {captionsUploading
                  ? "Uploading…"
                  : captionsExists
                  ? "Replace captions"
                  : "Upload captions"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminVideoUpload;