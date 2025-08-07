import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, X, File, Image, FileVideo, FileAudio, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  noteId: string;
  attachments: any[];
  onAttachmentsUpdate: (attachments: any[]) => void;
}

interface FileAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

const FileUpload = ({ noteId, attachments, onAttachmentsUpdate }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (type.startsWith('video/')) return <FileVideo className="w-5 h-5" />;
    if (type.startsWith('audio/')) return <FileAudio className="w-5 h-5" />;
    if (type.includes('text') || type.includes('document')) return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const uploadFile = async (file: File) => {
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('note-attachments')
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from('note-attachments')
      .getPublicUrl(filePath);

    return {
      id: data.path,
      name: file.name,
      url: urlData.publicUrl,
      type: file.type,
      size: file.size
    };
  };

  const handleFileSelect = async (files: FileList) => {
    if (!files.length) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(uploadFile);
      const uploadedFiles = await Promise.all(uploadPromises);
      
      const validFiles = uploadedFiles.filter(file => file !== null) as FileAttachment[];
      const updatedAttachments = [...attachments, ...validFiles];
      
      onAttachmentsUpdate(updatedAttachments);
      
      toast({
        title: "[UPLOAD_COMPLETE]",
        description: `${validFiles.length} file(s) uploaded successfully`,
      });
    } catch (error: any) {
      toast({
        title: "[UPLOAD_ERROR]",
        description: error.message || "Failed to upload files",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const removeAttachment = async (attachment: FileAttachment) => {
    try {
      const { error } = await supabase.storage
        .from('note-attachments')
        .remove([attachment.id]);

      if (error) throw error;

      const updatedAttachments = attachments.filter(att => att.id !== attachment.id);
      onAttachmentsUpdate(updatedAttachments);

      toast({
        title: "[FILE_REMOVED]",
        description: "Attachment deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "[DELETE_ERROR]",
        description: error.message || "Failed to delete attachment",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card 
        className={`card-cyber p-6 border-2 border-dashed transition-colors cursor-pointer ${
          dragOver ? 'border-neon-green bg-neon-green bg-opacity-10' : 'border-border-secondary hover:border-border-primary'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="text-center space-y-4">
          <Upload className={`w-12 h-12 mx-auto ${dragOver ? 'text-neon-green' : 'text-terminal-green-dim'}`} />
          <div>
            <p className="text-terminal-green font-medium">
              {uploading ? '[UPLOADING...]' : dragOver ? '[DROP_FILES_HERE]' : '[DRAG_OR_CLICK_TO_UPLOAD]'}
            </p>
            <p className="text-terminal-green-dim text-sm mt-2">
              All file types supported • Max 50MB per file
            </p>
          </div>
          {uploading && (
            <div className="w-full bg-surface-elevated rounded-full h-2">
              <div className="bg-neon-green h-2 rounded-full animate-pulse w-1/2"></div>
            </div>
          )}
        </div>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
      />

      {/* Attachments List */}
      {attachments.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-neon-green">&gt; ATTACHED_FILES ({attachments.length})</h4>
          {attachments.map((attachment) => (
            <Card key={attachment.id} className="card-cyber p-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 text-neon-cyan">
                  {getFileIcon(attachment.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-terminal-green truncate">
                    {attachment.name}
                  </p>
                  <p className="text-xs text-terminal-green-dim">
                    {formatFileSize(attachment.size)} • {attachment.type}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => window.open(attachment.url, '_blank')}
                    className="text-xs bg-transparent border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black"
                  >
                    [VIEW]
                  </Button>
                  <Button
                    onClick={() => removeAttachment(attachment)}
                    className="text-xs bg-transparent border border-destructive text-destructive hover:bg-destructive hover:text-black"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;