
import React, { useEffect, useRef } from 'react';
import { X, Share2, Smartphone } from 'lucide-react';
import QRCode from 'qrcode';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  theme: string;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, imageUrl, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      // In a real app, this would be a link to a gallery page. 
      // For this prototype, we'll encode the theme and a simulation link.
      const shareUrl = `https://stamps-for-tomorrow.ae/view?theme=${encodeURIComponent(theme)}`;
      QRCode.toCanvas(canvasRef.current, shareUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#5596C4',
          light: '#FFFFFF',
        },
      });
    }
  }, [isOpen, theme]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        <div className="p-6 flex justify-between items-center border-b border-slate-100">
          <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
            <Smartphone className="text-brand-blue" />
            Collect Stamp
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>
        
        <div className="p-8 flex flex-col items-center">
          <div className="bg-slate-50 p-4 rounded-3xl mb-6">
            <canvas ref={canvasRef} className="rounded-xl"></canvas>
          </div>
          
          <div className="text-center space-y-2">
            <p className="font-bold text-slate-800 text-lg">Scan to Save</p>
            <p className="text-sm text-slate-500 leading-relaxed px-4">
              Point your phone camera at the QR code to add this stamp to your digital collection album.
            </p>
          </div>
        </div>

        <div className="p-6 bg-slate-50 flex justify-center">
           <button 
             onClick={() => {
               // Simulate sharing
               if (navigator.share) {
                 navigator.share({ title: 'My UAE Stamp', text: `I made a ${theme} stamp!`, url: window.location.href });
               } else {
                 alert('Sharing simulated for: ' + theme);
               }
             }}
             className="flex items-center gap-2 font-bold text-brand-blue hover:text-blue-700 transition-colors"
           >
             <Share2 size={18} />
             Share with Friends
           </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;
