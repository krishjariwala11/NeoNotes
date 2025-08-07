import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { 
  X, 
  Save, 
  Type, 
  Hash, 
  Clock,
  Maximize2,
  Minimize2,
  Upload
} from 'lucide-react';
import FileUpload from './FileUpload';

interface Note {
  id: string;
  title: string;
  content: string;
  attachments: any[];
  created_at: string;
  updated_at: string;
}

interface FullScreenEditorProps {
  note: Note;
  onSave: (title: string, content: string, attachments: any[]) => void;
  onClose: () => void;
  isOpen: boolean;
}

const FullScreenEditor = ({ note, onSave, onClose, isOpen }: FullScreenEditorProps) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [attachments, setAttachments] = useState(note.attachments || []);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setAttachments(note.attachments || []);
  }, [note]);

  const handleSave = () => {
    onSave(title, content, attachments);
  };

  const getWordCount = () => {
    return content.split(' ').filter(word => word.length > 0).length;
  };

  const getCharCount = () => {
    return content.length;
  };

  const getReadingTime = () => {
    const words = getWordCount();
    return Math.max(1, Math.ceil(words / 200));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className={`h-full flex flex-col transition-all duration-300 ${isMinimized ? 'scale-95 opacity-90' : ''}`}>
        {/* Header */}
        <div className="border-b border-border-secondary p-4 bg-surface/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold gradient-text">
                &gt; NEURAL_EDITOR_FULLSCREEN
              </h2>
              <div className="flex items-center space-x-4 text-sm text-terminal-green-dim">
                <div className="flex items-center space-x-1">
                  <Type className="w-4 h-4" />
                  <span>{getWordCount()} words</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Hash className="w-4 h-4" />
                  <span>{getCharCount()} chars</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{getReadingTime()} min read</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setShowFileUpload(!showFileUpload)}
                className={`btn-cyber-secondary text-sm ${showFileUpload ? 'bg-neon-cyan bg-opacity-20' : ''}`}
              >
                <Upload className="w-4 h-4 mr-2" />
                [FILES]
              </Button>
              <Button
                onClick={() => setIsMinimized(!isMinimized)}
                className="btn-cyber-secondary text-sm"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button onClick={handleSave} className="btn-cyber text-sm">
                <Save className="w-4 h-4 mr-2" />
                [SAVE]
              </Button>
              <Button onClick={onClose} className="btn-cyber-secondary text-sm">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex">
          {/* File Upload Sidebar */}
          {showFileUpload && (
            <div className="w-80 border-r border-border-secondary p-6 bg-surface/30 overflow-y-auto">
              <h3 className="text-lg font-bold text-neon-cyan mb-4">
                &gt; FILE_ATTACHMENTS
              </h3>
              <FileUpload
                noteId={note.id}
                attachments={attachments}
                onAttachmentsUpdate={setAttachments}
              />
            </div>
          )}

          {/* Editor */}
          <div className="flex-1 flex flex-col p-6">
            {/* Title */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-terminal-green mb-2">
                [NEURAL_ENTRY_TITLE]
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter neural entry title..."
                className="input-cyber text-xl font-bold"
              />
            </div>

            {/* Content Editor */}
            <div className="flex-1 flex flex-col">
              <label className="block text-sm font-medium text-terminal-green mb-2">
                [NEURAL_CONTENT_STREAM]
              </label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Begin neural data stream input..."
                className="flex-1 min-h-0 input-cyber font-mono resize-none"
                style={{ minHeight: '400px' }}
              />
            </div>

            {/* Auto-save indicator */}
            <div className="mt-4 text-xs text-terminal-green-dim">
              Real-time synchronization enabled • Last modified: {new Date(note.updated_at).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="border-t border-border-secondary p-4 bg-surface/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm text-terminal-green-dim">
              <span>&gt; STATUS: EDITING</span>
              <span>&gt; SYNC: ENABLED</span>
              <span>&gt; MODE: FULLSCREEN</span>
            </div>
            <div className="text-sm text-terminal-green-dim">
              ESC to exit • Ctrl+S to save
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullScreenEditor;