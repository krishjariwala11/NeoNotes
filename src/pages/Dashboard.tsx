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
  Home,
  Settings,
  User
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface Note {
  id: string;
  title: string;
  content: string;
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

  useEffect(() => {
    fetchNotes();
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

  const saveNote = async () => {
    if (!selectedNote) return;

    try {
      const { error } = await supabase
        .from('notes')
        .update({
          title: editTitle,
          content: editContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedNote.id);

      if (error) throw error;

      const updatedNote = {
        ...selectedNote,
        title: editTitle,
        content: editContent,
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

  const getReadingTime = (content: string) => {
    const words = content.split(' ').filter(word => word.length > 0).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <div className="w-80 bg-surface border-r border-border-secondary flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border-secondary">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-neon-green to-neon-cyan rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-black" />
            </div>
            <div>
              <div className="text-lg font-bold text-terminal-green">NeoNote</div>
              <div className="text-xs text-terminal-green-dim">[RETRO-FUTURE_NOTES_v2.1]</div>
            </div>
          </div>

          {/* System Time */}
          <div className="flex items-center text-sm text-terminal-green mb-4">
            <Zap className="w-4 h-4 mr-2" />
            SYSTEM_TIME: {getCurrentTime()}
          </div>
        </div>

        {/* Navigation */}
        <div className="p-6 border-b border-border-secondary">
          <div className="text-sm text-neon-green mb-4">&gt; NAVIGATION_MODULE</div>
          <div className="space-y-2">
            <div className="flex items-center px-3 py-2 bg-neon-green bg-opacity-20 border border-neon-green rounded text-neon-green">
              <Home className="w-4 h-4 mr-3" />
              [DASHBOARD]
            </div>
            <button 
              onClick={createNote}
              className="flex items-center px-3 py-2 text-terminal-green-dim hover:text-neon-green hover:bg-surface-elevated rounded transition-colors w-full"
            >
              <Plus className="w-4 h-4 mr-3" />
              [NEW NOTE]
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="p-6 border-b border-border-secondary">
          <div className="text-sm text-neon-green mb-4">&gt; SYSTEM_STATUS</div>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-terminal-green">
              <div className="w-2 h-2 bg-neon-green rounded-full mr-3"></div>
              ONLINE
            </div>
            <div className="flex items-center text-sm text-terminal-green-dim">
              <FileText className="w-4 h-4 mr-3" />
              AUTO_SYNC: ON
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="mt-auto p-6 border-t border-border-secondary">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-neon-purple rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="text-sm font-medium text-terminal-green">
                {user?.email?.split('@')[0] || 'neural_user'}
              </div>
              <div className="text-xs text-terminal-green-dim">
                {user?.email}
              </div>
            </div>
          </div>
          <Button 
            onClick={signOut}
            className="w-full text-xs py-2 bg-transparent border border-destructive text-destructive hover:bg-destructive hover:text-black"
          >
            <LogOut className="w-4 h-4 mr-2" />
            [LOGOUT]
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border-secondary p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">NEURAL_DASHBOARD</h1>
              <p className="text-terminal-green-dim">
                &gt; Welcome, {user?.email?.split('@')[0]}. All neural data is encrypted and synchronized in real-time.
              </p>
            </div>
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                        className="text-destructive hover:text-red-400 ml-2"
                      >
                        ×
                      </button>
                    </div>
                    <p className="text-terminal-green-dim text-sm mb-3 line-clamp-2">
                      {note.content || 'Empty neural stream...'}
                    </p>
                    <div className="flex justify-between items-center text-xs text-terminal-green-dim">
                      <div className="flex items-center space-x-4">
                        <span>T {note.content?.split(' ').filter(w => w.length > 0).length || 0} words</span>
                        <span># {note.content?.length || 0} chars</span>
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
                        <Button onClick={saveNote} className="btn-cyber text-sm">
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
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="mb-4 text-xs text-terminal-green-dim">
                    Real-time synchronization enabled
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <Card className="card-cyber">
                    <div className="flex items-center space-x-2">
                      <Type className="w-4 h-4 text-neon-cyan" />
                      <span className="text-sm text-terminal-green-dim">WORDS</span>
                    </div>
                    <div className="text-xl font-bold text-neon-cyan">
                      {(isEditing ? editContent : selectedNote.content)?.split(' ').filter(w => w.length > 0).length || 0}
                    </div>
                  </Card>

                  <Card className="card-cyber">
                    <div className="flex items-center space-x-2">
                      <Hash className="w-4 h-4 text-neon-purple" />
                      <span className="text-sm text-terminal-green-dim">CHARACTERS</span>
                    </div>
                    <div className="text-xl font-bold text-neon-purple">
                      {(isEditing ? editContent : selectedNote.content)?.length || 0}
                    </div>
                  </Card>

                  <Card className="card-cyber">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-neon-orange" />
                      <span className="text-sm text-terminal-green-dim">READING_TIME</span>
                    </div>
                    <div className="text-xl font-bold text-neon-orange">
                      {getReadingTime(isEditing ? editContent : selectedNote.content)} min
                    </div>
                  </Card>
                </div>

                {isEditing ? (
                  <div className="flex-1 flex flex-col space-y-4">
                    <div>
                      <label className="block text-sm text-neon-green mb-2">&gt; TITLE_INPUT</label>
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Enter note title..."
                        className="input-cyber"
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <label className="block text-sm text-neon-green mb-2">&gt; CONTENT_BUFFER</label>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        placeholder="Begin neural data entry..."
                        className="flex-1 input-cyber resize-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-2xl font-bold text-terminal-green mb-4">
                      {selectedNote.title || 'Untitled Neural Entry'}
                    </h3>
                    <div className="flex-1 text-terminal-green-dim whitespace-pre-wrap">
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
    </div>
  );
};

export default Dashboard;