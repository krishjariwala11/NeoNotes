import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, Edit3, Zap } from 'lucide-react';

const Landing = () => {
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setIsTyping(true);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-border-secondary">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-neon-green to-neon-cyan rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-black" />
          </div>
          <span className="text-2xl font-bold text-terminal-green">NeoNote</span>
        </div>
        <Link to="/auth">
          <Button className="btn-cyber">
            [LOGIN]
          </Button>
        </Link>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className={`text-6xl md:text-8xl font-bold mb-8 leading-tight ${isTyping ? 'typing' : ''}`}>
            <span className="block gradient-text">YOUR THOUGHTS.</span>
            <span className="block gradient-text">ENCRYPTED.</span>
            <span className="block gradient-text">IMMORTALIZED.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-terminal-green-dim mb-12 max-w-3xl mx-auto leading-relaxed">
            NeoNote is a retro-futuristic, cyberpunk-themed notes application designed for privacy and style. 
            Your data is yours alone, secured with next-generation encryption.
          </p>
          
          <Link to="/auth">
            <Button className="btn-cyber text-lg px-12 py-4 mb-20">
              <Zap className="w-5 h-5 mr-2" />
              [INITIATE_SESSION]
            </Button>
          </Link>
        </div>

        {/* Features Section */}
        <section className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neon-green mb-4">
              &gt; SYSTEM_FEATURES
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Quantum Encryption */}
            <Card className="card-cyber group hover:glow-green transition-all duration-300">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-neon-green to-neon-cyan rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-neon-green mb-4">QUANTUM_ENCRYPTION</h3>
              </div>
              <p className="text-terminal-green-dim leading-relaxed">
                Your notes are secured with end-to-end encryption. Only you can access your neural data streams. 
                Privacy is not a feature; it's the foundation.
              </p>
            </Card>

            {/* Cyberpunk Aesthetics */}
            <Card className="card-cyber group hover:glow-cyan transition-all duration-300">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-neon-cyan to-neon-blue rounded-lg flex items-center justify-center mb-4">
                  <Edit3 className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-neon-cyan mb-4">CYBERPUNK_AESTHETICS</h3>
              </div>
              <p className="text-terminal-green-dim leading-relaxed">
                Immerse yourself in a retro-futuristic UI. With monospace fonts, glitch effects, and neon accents, 
                writing has never felt more stylish.
              </p>
            </Card>

            {/* Real-time Sync */}
            <Card className="card-cyber group hover:shadow-[0_0_30px_hsl(var(--neon-blue)_/_0.3)] transition-all duration-300">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-neon-blue to-neon-purple rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-neon-blue mb-4">REAL-TIME_SYNC</h3>
              </div>
              <p className="text-terminal-green-dim leading-relaxed">
                Your thoughts are saved and synchronized across all your terminals instantly. Never lose an idea 
                with our seamless auto-save protocol.
              </p>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center mt-32 pt-12 border-t border-border-secondary">
          <p className="text-terminal-green-dim">© 2025 Krish Jariwala. All Rights Reserved.</p>
          <p className="text-sm text-terminal-green-dim mt-2">
            Unauthorized access is strictly prohibited. Violators will be prosecuted to the fullest extent of intergalactic law.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Landing;