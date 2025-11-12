import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Upload, Download, Sparkles } from 'lucide-react';

export default function BadgeGenerator() {
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateBadge = () => {
    if (!canvasRef.current || !profileImage) return;

    setIsGenerating(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const badgeImg = new Image();
    badgeImg.crossOrigin = 'anonymous';
    badgeImg.src = 'https://assets-gen.codenut.dev/lib/b71fce25-176e-49bb-929b-c4db27767877/irys mainnet card.png';

    badgeImg.onload = () => {
      // Set canvas size to match the badge
      canvas.width = badgeImg.width;
      canvas.height = badgeImg.height;

      // Draw the badge template
      ctx.drawImage(badgeImg, 0, 0);

      // Load and draw profile picture
      const profileImg = new Image();
      profileImg.src = profileImage;

      profileImg.onload = () => {
       // Old code
// const circleX = canvas.width / 2;
// const circleY = canvas.height * 0.28;
// const circleRadius = canvas.width * 0.145;

// New accurate version
const originalWidth = 888;
const originalHeight = 1250;

const circleX = (445 / originalWidth) * canvas.width;
const circleY = (700 / originalHeight) * canvas.height;
const circleRadius = (170 / originalWidth) * canvas.width;


        // Save context state
        ctx.save();

        // Create circular clipping path
        ctx.beginPath();
        ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        // Draw profile image to fill the circle
        const size = circleRadius * 2;
        ctx.drawImage(
          profileImg,
          circleX - circleRadius,
          circleY - circleRadius,
          size,
          size
        );

        // Restore context
        ctx.restore();

        // Draw username if provided
        if (username) {
          // Position text where "IRYS MAINNET" appears
          const textY = canvas.height * 0.7;
          
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle'; 
          
          // Draw username in cyan color to match "IRYS"
          ctx.font = `${canvas.width * 0.07}px Impact, sans-serif`;
          ctx.fillStyle = '#000';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(username.toUpperCase(), canvas.width / 2, textY);
        }

        setIsGenerating(false);
      };
    };
  };

  useEffect(() => {
    if (profileImage && username) {
      generateBadge();
    }
  }, [profileImage, username]);

  const downloadBadge = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `${username || 'badge'}-irys-mainnet.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-cyan-950 to-emerald-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwRDlDNSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
      
      <div className="relative z-10 w-full max-w-6xl grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <Card className="p-8 bg-slate-900/80 backdrop-blur-xl border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-8 h-8 text-cyan-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              IRYS Badge Generator
            </h1>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="username" className="text-cyan-100 text-lg mb-2 block">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-slate-800/50 border-cyan-500/50 text-white placeholder:text-slate-500 text-lg h-12 focus:border-cyan-400 focus:ring-cyan-400/50"
              />
            </div>

            <div>
              <Label htmlFor="profile" className="text-cyan-100 text-lg mb-2 block">
                Profile Picture
              </Label>
              <input
                ref={fileInputRef}
                id="profile"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="w-full h-12 bg-slate-800/50 border-cyan-500/50 text-cyan-100 hover:bg-cyan-500/20 hover:border-cyan-400 hover:text-cyan-50 transition-all"
              >
                <Upload className="w-5 h-5 mr-2" />
                {profileImage ? 'Change Image' : 'Upload Image'}
              </Button>
            </div>

            {profileImage && username && (
              <Button
                onClick={downloadBadge}
                disabled={isGenerating}
                className="w-full h-12 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white font-semibold text-lg shadow-lg shadow-cyan-500/50"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Badge
              </Button>
            )}
          </div>

          <div className="mt-8 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <p className="text-cyan-200 text-sm">
              <span className="font-semibold">Tip:</span> Upload a square profile picture for best results. Your badge will be generated automatically!
            </p>
          </div>
        </Card>

        {/* Preview Section */}
        <Card className="p-8 bg-slate-900/80 backdrop-blur-xl border-cyan-500/30 shadow-2xl shadow-cyan-500/20 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-cyan-100 mb-6">Preview</h2>
          
          {profileImage && username ? (
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto rounded-lg shadow-2xl shadow-cyan-500/30 border border-cyan-500/20"
              />
              {isGenerating && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm rounded-lg">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full aspect-[9/16] max-w-md bg-slate-800/30 border-2 border-dashed border-cyan-500/30 rounded-lg flex flex-col items-center justify-center gap-4">
              <Sparkles className="w-16 h-16 text-cyan-500/50" />
              <p className="text-cyan-300/70 text-center px-4">
                Upload an image and enter your username to see your badge
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
