import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import HeroVideo from "@/components/shared/HeroVideo";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string;
  firstName?: string | null;
  markCompleted?: boolean;
}

export default function WelcomeDialog({ open, onOpenChange, userId, firstName, markCompleted }: Props) {
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !userId) return;
    // mark video-viewed timestamp when opened
    supabase.from("profiles").update({ welcome_video_viewed_at: new Date().toISOString() }).eq("user_id", userId);
  }, [open, userId]);

  const handleClose = async () => {
    if (markCompleted && userId) {
      setSaving(true);
      await supabase
        .from("profiles")
        .update({ onboarding_completed_at: new Date().toISOString() })
        .eq("user_id", userId);
      setSaving(false);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); else onOpenChange(true); }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {firstName ? `Welcome, ${firstName}!` : "Welcome to your portal"}
          </DialogTitle>
          <DialogDescription>
            A quick intro from Jessie so you know exactly how to get the most from your plan.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-xl overflow-hidden bg-secondary/5 aspect-video">
          <HeroVideo
            storagePath="public/welcome-dashboard.mp4"
            captionsPath="public/welcome-dashboard.vtt"
            alt="Welcome video from Jessie Hunter"
            className="rounded-xl"
          />
        </div>
        <DialogFooter>
          <Button onClick={handleClose} disabled={saving} className="w-full sm:w-auto">
            {markCompleted ? "Take me to my dashboard" : "Close"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}