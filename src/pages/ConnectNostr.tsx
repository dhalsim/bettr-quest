import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, UserPlus, Link as LinkIcon, AlertTriangle, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useNostrAuth } from '@/hooks/useNostrAuth';
import { pages } from '@/lib/pages';

const ConnectNostr = () => {
  const [nsec, setNsec] = useState('');
  const [bunkerUrl, setBunkerUrl] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionMethod, setConnectionMethod] = useState<'nsec' | 'bunker'>('nsec');
  const navigate = useNavigate();
  const bunkerUrlRef = useRef<HTMLInputElement>(null);
  const { isLoggedIn, login } = useNostrAuth();

  useEffect(() => {
    if (isLoggedIn) {
      navigate(pages.timeline.location);
    }
  }, [isLoggedIn, navigate]);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (connectionMethod === 'bunker') {
        if (!bunkerUrl) {
          setError('Please enter a valid Bunker URL');
          setIsLoading(false);
          return;
        }
        localStorage.setItem('nostr_bunker_url', bunkerUrl);
      } else {
        if (!nsec) {
          setError('Please enter a valid private key');
          setIsLoading(false);
          return;
        }
        localStorage.setItem('nostr_private_key', nsec);
      }
      
      login();
      toast.success("Successfully connected to Nostr!");
      navigate(pages.timeline.location);
    } catch (err) {
      setError('Failed to connect. Please check your credentials and try again.');
      console.error('Connection error:', err);
      setIsLoading(false);
    }
  };
  
  const generateNewAccount = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const mockNsec = 'nsec1' + Array(59).fill(0).map(() => 
        "0123456789abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 36)]
      ).join('');
      
      setNsec(mockNsec);
      setIsLoading(false);
      toast.success("New Nostr key generated! Make sure to save this private key securely.");
    }, 1500);
  };

  const handleScanQR = () => {
    toast.info("QR code scanning would be implemented here");
  };
  
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Connect with Nostr</h1>
        <p className="text-muted-foreground mb-10">
          Link your Nostr account to start following people and sharing your challenges
        </p>
        
        <div className="glass rounded-2xl p-8">
          <div className="flex flex-col sm:flex-row gap-6 mb-10">
            <button
              className={`flex-1 p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3
                ${!isCreatingNew 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/30 hover:bg-primary/5'}`}
              onClick={() => setIsCreatingNew(false)}
            >
              <LinkIcon size={32} className={!isCreatingNew ? 'text-primary' : 'text-muted-foreground'} />
              <span className="font-medium">Connect Existing Account</span>
            </button>
            
            <button
              className={`flex-1 p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3
                ${isCreatingNew 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/30 hover:bg-primary/5'}`}
              onClick={() => setIsCreatingNew(true)}
            >
              <UserPlus size={32} className={isCreatingNew ? 'text-primary' : 'text-muted-foreground'} />
              <span className="font-medium">Create New Account</span>
            </button>
          </div>
          
          {isCreatingNew ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">Create a New Nostr Account</h2>
              
              {nsec ? (
                <div className="mb-6">
                  <div className="bg-secondary/30 p-4 rounded-lg mb-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="text-amber-500 shrink-0 mt-1" />
                      <div>
                        <h3 className="font-medium text-amber-500">Important Security Warning</h3>
                        <p className="text-sm">
                          This is your private key. Save it somewhere secure and never share it with anyone. 
                          Anyone with this key can control your Nostr account.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Your Private Key (nsec)</label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={nsec}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(nsec);
                          toast.success("Private key copied to clipboard");
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                  
                  <form onSubmit={handleConnect}>
                    <Button
                      type="submit"
                      className="w-full"
                      isLoading={isLoading}
                    >
                      Continue with this Key
                    </Button>
                  </form>
                </div>
              ) : (
                <div>
                  <p className="text-muted-foreground mb-6">
                    We'll generate a new Nostr key pair for you. Make sure to back up your private key!
                  </p>
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={generateNewAccount}
                    isLoading={isLoading}
                    leftIcon={<Key size={18} />}
                  >
                    Generate New Nostr Key
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4">Connect Existing Account</h2>
              
              <div className="flex gap-4 mb-6">
                <button
                  className={`flex-1 p-4 rounded-lg border-2 transition-all
                    ${connectionMethod === 'nsec' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/30 hover:bg-primary/5'}`}
                  onClick={() => setConnectionMethod('nsec')}
                >
                  <span className="font-medium">Private Key (nsec)</span>
                </button>
                <button
                  className={`flex-1 p-4 rounded-lg border-2 transition-all
                    ${connectionMethod === 'bunker' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/30 hover:bg-primary/5'}`}
                  onClick={() => setConnectionMethod('bunker')}
                >
                  <span className="font-medium">Bunker URL</span>
                </button>
              </div>

              <form onSubmit={handleConnect}>
                {connectionMethod === 'bunker' ? (
                  <div className="mb-6">
                    <p className="text-muted-foreground mb-4">
                      Generate a Bunker URL using a remote signer like Amber (Android), Nostrify
                      (iOS), or nsec.app (Web). Then paste it here.
                    </p>
                    <div className="relative mb-4">
                      <Input
                        ref={bunkerUrlRef}
                        type="text"
                        placeholder="bunker://..."
                        value={bunkerUrl}
                        onChange={(e) => setBunkerUrl(e.target.value)}
                        className="font-mono"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={handleScanQR}
                        leftIcon={<QrCode size={18} />}
                      >
                        Or scan QR Code
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <label htmlFor="nsec" className="block text-sm font-medium mb-1">
                      Your Private Key (nsec)
                    </label>
                    <Input
                      id="nsec"
                      type="password"
                      placeholder="nsec1..."
                      value={nsec}
                      onChange={(e) => setNsec(e.target.value)}
                      className="font-mono"
                      required
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Enter your Nostr private key (nsec) to connect your account
                    </p>
                  </div>
                )}
                
                {error && (
                  <p className="text-red-600 text-sm mb-4">{error}</p>
                )}
                
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={isLoading}
                  leftIcon={<LinkIcon size={18} />}
                >
                  Connect to Nostr
                </Button>
              </form>
            </div>
          )}
          
          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="text-lg font-medium mb-2">What is Nostr?</h3>
            <p className="text-muted-foreground">
              Nostr is a decentralized social network protocol that gives you full control over your data.
              It stands for "Notes and Other Stuff Transmitted by Relays" and allows for censorship-resistant
              communication across the internet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectNostr;
