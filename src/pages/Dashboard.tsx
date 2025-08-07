import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  LogOut, 
  Search, 
  FileText, 
  Type, 
  Hash, 
  Zap,
  Maximize2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import FullScreenEditor from '@/components/FullScreenEditor';

interface Note {
  id: string;
  title: string;
  content: string;
  attachments: any[];
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [fullScreenNote, setFullScreenNote] = useState<Note | null>(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchNotes();
    
    // Real-time clock update
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      toast({
        title: "[DATABASE_ERROR]",
        description: "Failed to load neural archives",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createNote = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([{
          title: 'New Neural Entry',
          content: '',
          attachments: [],
          user_id: user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      setNotes([data, ...notes]);
      setSelectedNote(data);
      setIsEditing(true);
      setEditTitle(data.title);
      setEditContent(data.content);
      
      toast({
        title: "[NEURAL_ENTRY_CREATED]",
        description: "New thought stream initialized",
      });
    } catch (error) {
      toast({
        title: "[CREATION_ERROR]",
        description: "Failed to initialize neural entry",
        variant: "destructive",
      });
    }
  };

  const saveNote = async (title: string, content: string, attachments: any[] = []) => {
    if (!selectedNote) return;

    try {
      const { error } = await supabase
        .from('notes')
        .update({
          title,
          content,
          attachments,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedNote.id);

      if (error) throw error;

      const updatedNote = {
        ...selectedNote,
        title,
        content,
        attachments,
        updated_at: new Date().toISOString()
      };

      setNotes(notes.map(note => 
        note.id === selectedNote.id ? updatedNote : note
      ));
      setSelectedNote(updatedNote);
      setIsEditing(false);

      toast({
        title: "[NEURAL_DATA_SAVED]",
        description: "Thought stream synchronized",
      });
    } catch (error) {
      toast({
        title: "[SYNC_ERROR]",
        description: "Failed to synchronize neural data",
        variant: "destructive",
      });
    }
  };

  const saveFullScreenNote = async (title: string, content: string, attachments: any[] = []) => {
    if (!fullScreenNote) return;

    try {
      const { error } = await supabase
        .from('notes')
        .update({
          title,
          content,
          attachments,
          updated_at: new Date().toISOString()
        })
        .eq('id', fullScreenNote.id);

      if (error) throw error;

      const updatedNote = {
        ...fullScreenNote,
        title,
        content,
        attachments,
        updated_at: new Date().toISOString()
      };

      setNotes(notes.map(note => 
        note.id === fullScreenNote.id ? updatedNote : note
      ));
      setFullScreenNote(updatedNote);

      toast({
        title: "[NEURAL_DATA_SAVED]",
        description: "Thought stream synchronized",
      });
    } catch (error) {
      toast({
        title: "[SYNC_ERROR]",
        description: "Failed to synchronize neural data",
        variant: "destructive",
      });
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;

      setNotes(notes.filter(note => note.id !== noteId));
      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
        setIsEditing(false);
      }

      toast({
        title: "[NEURAL_ENTRY_DELETED]",
        description: "Thought stream purged from system",
      });
    } catch (error) {
      toast({
        title: "[DELETION_ERROR]",
        description: "Failed to purge neural entry",
        variant: "destructive",
      });
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalWords = notes.reduce((acc, note) => 
    acc + (note.content?.split(' ').filter(word => word.length > 0).length || 0), 0
  );

  const totalChars = notes.reduce((acc, note) => acc + (note.content?.length || 0), 0);

  const getCurrentTime = () => {
    return currentTime.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex">
        <AppSidebar 
          onCreateNote={createNote}
          onNavigate={setActiveSection}
          activeSection={activeSection}
        />
        
        <SidebarInset className="flex-1">
          <div className="flex flex-col min-h-screen">
            {/* Header */}
            <div className="border-b border-border-secondary p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <SidebarTrigger />
                  <div>
                    <h1 className="text-4xl font-bold gradient-text mb-2">NEURAL_DASHBOARD</h1>
                    <p className="text-terminal-green-dim">
                      &gt; Welcome, {user?.email?.split('@')[0]}. Live system time: {getCurrentTime()}
                    </p>
                  </div>
                </div>
                
                <Button 
                  onClick={signOut}
                  className="text-xs py-2 bg-transparent border border-destructive text-destructive hover:bg-destructive hover:text-black"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  [LOGOUT]
                </Button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card className="card-cyber">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-neon-green rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <div className="text-sm text-terminal-green-dim">NOTES_STORED</div>
                      <div className="text-2xl font-bold text-neon-green">{notes.length}</div>
                    </div>
                  </div>
                </Card>

                <Card className="card-cyber">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-neon-cyan rounded-lg flex items-center justify-center">
                      <Type className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <div className="text-sm text-terminal-green-dim">WORDS_PROCESSED</div>
                      <div className="text-2xl font-bold text-neon-cyan">{totalWords}</div>
                    </div>
                  </div>
                </Card>

                <Card className="card-cyber">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-neon-purple rounded-lg flex items-center justify-center">
                      <Hash className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <div className="text-sm text-terminal-green-dim">CHARS_INDEXED</div>
                      <div className="text-2xl font-bold text-neon-purple">{totalChars}</div>
                    </div>
                  </div>
                </Card>

                <Card className="card-cyber">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-neon-orange rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <div className="text-sm text-terminal-green-dim">STATUS</div>
                      <div className="text-lg font-bold text-neon-green">ONLINE</div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Search and Create */}
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-terminal-green-dim" />
                  <Input
                    placeholder="SEARCH_NEURAL_DATABASE..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-cyber pl-12"
                  />
                </div>
                <Button onClick={createNote} className="btn-cyber">
                  <Plus className="w-5 h-5 mr-2" />
                  [CREATE_NEW_NOTE]
                </Button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex">
              {/* Notes List */}
              <div className="w-1/2 border-r border-border-secondary p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <FileText className="w-5 h-5 text-neon-green" />
                  <h2 className="text-xl font-bold text-neon-green">
                    &gt; NEURAL_ARCHIVE ({filteredNotes.length})
                  </h2>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="text-terminal-green animate-pulse">
                      [LOADING_NEURAL_STREAMS...]
                    </div>
                  </div>
                ) : filteredNotes.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-terminal-green-dim mb-4">
                      {searchTerm ? 'No matching neural entries found' : 'No neural entries detected'}
                    </div>
                    {!searchTerm && (
                      <Button onClick={createNote} className="btn-cyber">
                        [INITIALIZE_FIRST_ENTRY]
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredNotes.map((note) => (
                      <Card
                        key={note.id}
                        className={`card-cyber cursor-pointer transition-all duration-200 ${
                          selectedNote?.id === note.id ? 'border-neon-green glow-green' : 'hover:border-border-primary'
                        }`}
                        onClick={() => {
                          setSelectedNote(note);
                          setIsEditing(false);
                        }}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-terminal-green truncate flex-1">
                            {note.title || 'Untitled Neural Entry'}
                          </h3>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setFullScreenNote(note);
                              }}
                              className="text-neon-cyan hover:text-cyan-400"
                              title="Open in fullscreen"
                            >
                              <Maximize2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNote(note.id);
                              }}
                              className="text-destructive hover:text-red-400"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                        <p className="text-terminal-green-dim text-sm mb-3 line-clamp-2">
                          {note.content || 'Empty neural stream...'}
                        </p>
                        <div className="flex justify-between items-center text-xs text-terminal-green-dim">
                          <div className="flex items-center space-x-4">
                            <span>T {note.content?.split(' ').filter(w => w.length > 0).length || 0} words</span>
                            <span># {note.content?.length || 0} chars</span>
                            {note.attachments && note.attachments.length > 0 && (
                              <span>📎 {note.attachments.length}</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Zap className="w-3 h-3 text-neon-orange" />
                            <span>LAST_MOD: {new Date(note.updated_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Editor */}
              <div className="w-1/2 p-6">
                {selectedNote ? (
                  <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-5 h-5 text-neon-cyan" />
                        <h2 className="text-xl font-bold text-neon-cyan">
                          &gt; {isEditing ? 'NEURAL_EDITOR' : 'NEURAL_VIEWER'}
                        </h2>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isEditing ? (
                          <>
                            <Button onClick={() => saveNote(editTitle, editContent)} className="btn-cyber text-sm">
                              [SAVE & EXIT]
                            </Button>
                            <Button 
                              onClick={() => setIsEditing(false)}
                              className="text-sm bg-transparent border border-border-secondary text-terminal-green-dim hover:border-border-primary"
                            >
                              [CANCEL]
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button 
                              onClick={() => setFullScreenNote(selectedNote)}
                              className="btn-cyber text-sm"
                            >
                              <Maximize2 className="w-4 h-4 mr-2" />
                              [FULLSCREEN]
                            </Button>
                            <Button 
                              onClick={() => {
                                setIsEditing(true);
                                setEditTitle(selectedNote.title);
                                setEditContent(selectedNote.content);
                              }}
                              className="btn-cyber-secondary text-sm"
                            >
                              [EDIT_MODE]
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="flex-1 flex flex-col space-y-4">
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Enter note title..."
                          className="input-cyber"
                        />
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          placeholder="Begin neural data entry..."
                          className="flex-1 input-cyber resize-none min-h-0"
                        />
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col">
                        <h3 className="text-2xl font-bold text-terminal-green mb-4">
                          {selectedNote.title || 'Untitled Neural Entry'}
                        </h3>
                        <div className="flex-1 text-terminal-green-dim whitespace-pre-wrap overflow-auto">
                          {selectedNote.content || 'Empty neural stream...'}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-terminal-green-dim mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-terminal-green-dim mb-2">
                        No Neural Entry Selected
                      </h3>
                      <p className="text-terminal-green-dim mb-6">
                        Select an entry from the archive or create a new one
                      </p>
                      <Button onClick={createNote} className="btn-cyber">
                        [CREATE_NEW_ENTRY]
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </SidebarInset>

        {/* Full Screen Editor */}
        {fullScreenNote && (
          <FullScreenEditor
            note={fullScreenNote}
            onSave={saveFullScreenNote}
            onClose={() => setFullScreenNote(null)}
            isOpen={!!fullScreenNote}
          />
        )}
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;