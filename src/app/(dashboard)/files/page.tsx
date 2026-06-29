import { prisma } from "@/lib/db";
import { FolderOpen, Upload, Search, FileText, Music, Image, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

async function getFiles() {
  return prisma.file.findMany({
    orderBy: { createdAt: "desc" },
    include: { uploadedBy: true },
    take: 50,
  });
}

export default async function FilesPage() {
  const files = await getFiles();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">File Manager</h1>
          <p className="text-muted-foreground">
            All uploaded files — audio, video, images, documents
          </p>
        </div>
        <Button className="gap-2">
          <Upload className="h-4 w-4" /> Upload File
        </Button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search files..." className="pl-9" />
        </div>
        <Button variant="outline" size="sm">All</Button>
        <Button variant="outline" size="sm">Audio</Button>
        <Button variant="outline" size="sm">Video</Button>
        <Button variant="outline" size="sm">Images</Button>
        <Button variant="outline" size="sm">Documents</Button>
      </div>

      {files.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FolderOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-medium mb-1">No Files Yet</h3>
            <p className="text-sm text-muted-foreground">
              Upload audio files, videos, thumbnails, agreements, and documents.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Supported: MP3, WAV, MP4, JPG, PNG, PDF, DOCX, ZIP
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">File</th>
                  <th className="text-left p-3 font-medium">Type</th>
                  <th className="text-left p-3 font-medium">Tags</th>
                  <th className="text-left p-3 font-medium">Uploaded By</th>
                  <th className="text-left p-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr key={file.id} className="border-b hover:bg-muted/30">
                    <td className="p-3 flex items-center gap-2">
                      <FileIcon type={file.fileType || ""} />
                      <span className="truncate max-w-[200px]">{file.fileName}</span>
                    </td>
                    <td className="p-3 text-muted-foreground">{file.fileType || "-"}</td>
                    <td className="p-3">
                      <div className="flex gap-1 flex-wrap">
                        {file.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground">{file.uploadedBy?.name || "-"}</td>
                    <td className="p-3 text-muted-foreground text-xs">
                      {new Date(file.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function FileIcon({ type }: { type: string }) {
  if (type.includes("audio") || type.includes("mp3") || type.includes("wav"))
    return <Music className="h-4 w-4 text-purple-500" />;
  if (type.includes("video") || type.includes("mp4"))
    return <Video className="h-4 w-4 text-blue-500" />;
  if (type.includes("image") || type.includes("jpg") || type.includes("png"))
    return <Image className="h-4 w-4 text-green-500" />;
  return <FileText className="h-4 w-4 text-gray-500" />;
}
