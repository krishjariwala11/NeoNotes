import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/components/AuthProvider';
import { Zap, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "[ACCESS_DENIED]",
        description: "All neural interface fields are required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        toast({
          title: "[AUTHENTICATION_ERROR]",
          description: error.message,
          variant: "destructive",
        });
      } else if (isSignUp) {
        toast({
          title: "[NEURAL_LINK_ESTABLISHED]",
          description: "Account created successfully. Check your email for verification.",
        });
      }
    } catch (error) {
      toast({
        title: "[SYSTEM_ERROR]",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-terminal-green hover:text-neon-green transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            [RETURN_TO_MAINFRAME]
          </Link>
          
          <div className="w-20 h-20 bg-gradient-to-br from-neon-green to-neon-cyan rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap className="w-10 h-10 text-black" />
          </div>
          
          <h1 className="text-3xl font-bold text-terminal-green mb-2">Welcome to NeoNote</h1>
          <p className="text-terminal-green-dim">
            {isSignUp ? 'Initialize neural interface' : 'Sign in to continue'}
          </p>
        </div>

        {/* Auth Form */}
        <Card className="card-cyber">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-terminal-green mb-2">
                  [EMAIL_ADDRESS]
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-terminal-green-dim" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@neural.net"
                    className="input-cyber pl-12"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-terminal-green mb-2">
                  [ACCESS_CODE]
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-terminal-green-dim" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-cyber pl-12"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="btn-cyber w-full py-3"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-pulse">[CONNECTING...]</span>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  {isSignUp ? '[CREATE_NEURAL_LINK]' : '[ESTABLISH_CONNECTION]'}
                </>
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-terminal-green-dim hover:text-neon-green transition-colors"
                disabled={loading}
              >
                {isSignUp ? 'Already have an interface? Sign in' : 'Need a neural interface? Sign up'}
              </button>
            </div>
          </form>
        </Card>

        {/* Terminal Footer */}
        <div className="text-center mt-8 text-xs text-terminal-green-dim font-mono">
          <p>&gt; SECURE_NEURAL_AUTHENTICATION_v2.1</p>
          <p>&gt; ALL_TRANSMISSIONS_ENCRYPTED</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;