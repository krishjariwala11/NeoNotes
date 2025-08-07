import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/components/AuthProvider';
import { Zap, Mail, Lock, ArrowLeft, User, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, signIn, signUp, resetPassword } = useAuth();
  const { toast } = useToast();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isForgotPassword) {
      if (!email) {
        toast({
          title: "[ACCESS_DENIED]",
          description: "Email address is required",
          variant: "destructive",
        });
        return;
      }

      setLoading(true);
      try {
        const { error } = await resetPassword(email);
        if (error) {
          toast({
            title: "[RESET_ERROR]",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "[RESET_INITIATED]",
            description: "Password reset email sent. Check your inbox.",
          });
          setIsForgotPassword(false);
        }
      } catch (error) {
        toast({
          title: "[SYSTEM_ERROR]",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
      setLoading(false);
      return;
    }

    if (!email || !password || (isSignUp && !displayName)) {
      toast({
        title: "[ACCESS_DENIED]",
        description: "All required neural interface fields must be completed",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = isSignUp 
        ? await signUp(email, password, displayName, phoneNumber)
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
            {isForgotPassword ? 'Reset access credentials' : isSignUp ? 'Initialize neural interface' : 'Sign in to continue'}
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

              {!isForgotPassword && (
                <>
                  {isSignUp && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-terminal-green mb-2">
                          [DISPLAY_NAME] *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-terminal-green-dim" />
                          <Input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Neural User"
                            className="input-cyber pl-12"
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-terminal-green mb-2">
                          [PHONE_NUMBER] (optional)
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-terminal-green-dim" />
                          <Input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="+1234567890"
                            className="input-cyber pl-12"
                            disabled={loading}
                          />
                        </div>
                      </div>
                    </>
                  )}

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
                </>
              )}
            </div>

            <Button
              type="submit"
              className="btn-cyber w-full py-3"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-pulse">[PROCESSING...]</span>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  {isForgotPassword ? '[RESET_PASSWORD]' : isSignUp ? '[CREATE_NEURAL_LINK]' : '[ESTABLISH_CONNECTION]'}
                </>
              )}
            </Button>

            <div className="text-center space-y-2">
              {!isForgotPassword ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-terminal-green-dim hover:text-neon-green transition-colors block w-full"
                    disabled={loading}
                  >
                    {isSignUp ? 'Already have an interface? Sign in' : 'Need a neural interface? Sign up'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-terminal-green-dim hover:text-neon-green transition-colors text-sm"
                    disabled={loading}
                  >
                    Forgot your access code?
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setEmail('');
                  }}
                  className="text-terminal-green-dim hover:text-neon-green transition-colors"
                  disabled={loading}
                >
                  Back to sign in
                </button>
              )}
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