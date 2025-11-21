import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Upload, FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";

interface ImportBatch {
  id: string;
  filename: string;
  status: string;
  uploaded_at: string;
  rows_processed: number | null;
  agents_created: number | null;
  agents_updated: number | null;
  transactions_created: number | null;
  error_message: string | null;
}

export default function MLSImport() {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importHistory, setImportHistory] = useState<ImportBatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchImportHistory();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roles) {
      navigate("/admin");
    }
  };

  const fetchImportHistory = async () => {
    try {
      const { data, error } = await supabase
        .from("import_batches")
        .select("*")
        .order("uploaded_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setImportHistory(data || []);
    } catch (error) {
      console.error("Error fetching import history:", error);
      toast.error("Failed to load import history");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['.csv', '.zip'];
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validTypes.includes(fileExt)) {
      toast.error("Please select a CSV or ZIP file");
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        
        const { data, error } = await supabase.functions.invoke('process-mls-import', {
          body: {
            filename: selectedFile.name,
            content: content,
          }
        });

        if (error) {
          console.error("Import error:", error);
          toast.error("Failed to process import");
          return;
        }

        toast.success("Import completed successfully!");
        setSelectedFile(null);
        fetchImportHistory();
      };

      reader.readAsText(selectedFile);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", icon: any }> = {
      completed: { variant: "default", icon: CheckCircle },
      failed: { variant: "destructive", icon: XCircle },
      processing: { variant: "secondary", icon: Clock },
      pending: { variant: "outline", icon: Clock },
    };

    const config = variants[status] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/admin")}>
              ← Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold">MLS Import</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload MLS Data</CardTitle>
            <CardDescription>
              Upload a CSV or ZIP file containing just-closed transaction data from your MLS export
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file-upload">Select File</Label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".csv,.zip"
                    onChange={handleFileSelect}
                    disabled={uploading}
                  />
                </div>
                <Button 
                  onClick={handleUpload} 
                  disabled={!selectedFile || uploading}
                  className="min-w-32"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
            </div>

            {selectedFile && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Import History</CardTitle>
            <CardDescription>
              View past MLS data imports and their results
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : importHistory.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No imports yet. Upload your first MLS file to get started.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Filename</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead className="text-right">Rows</TableHead>
                    <TableHead className="text-right">Agents Created</TableHead>
                    <TableHead className="text-right">Agents Updated</TableHead>
                    <TableHead className="text-right">Transactions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {importHistory.map((batch) => (
                    <TableRow key={batch.id}>
                      <TableCell className="font-medium">{batch.filename}</TableCell>
                      <TableCell>{getStatusBadge(batch.status)}</TableCell>
                      <TableCell>{format(new Date(batch.uploaded_at), 'MMM d, yyyy HH:mm')}</TableCell>
                      <TableCell className="text-right">{batch.rows_processed ?? '-'}</TableCell>
                      <TableCell className="text-right">{batch.agents_created ?? '-'}</TableCell>
                      <TableCell className="text-right">{batch.agents_updated ?? '-'}</TableCell>
                      <TableCell className="text-right">{batch.transactions_created ?? '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
