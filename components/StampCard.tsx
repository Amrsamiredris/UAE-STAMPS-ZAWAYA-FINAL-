
import React from 'react';
import { GeneratedStamp } from '../types';
import { Download, Printer, Trash2, Smartphone } from 'lucide-react';

interface StampCardProps {
  stamp: GeneratedStamp;
  onDelete: (id: string) => void;
  onCollect?: (stamp: GeneratedStamp) => void;
}

const StampCard: React.FC<StampCardProps> = ({ stamp, onDelete, onCollect }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = stamp.imageUrl;
    link.download = `uae-stamp-${stamp.theme.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.click();
  };

  const handlePrint = () => {
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`
        <html>
          <body style="display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f1f5f9;">
            <img src="${stamp.imageUrl}" style="max-width: 100%; height: auto; border: 1px solid #ddd; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
            <script>window.onload = () => { window.print(); window.close(); }</script>
          </body>
        </html>
      `);
      win.document.close();
    }
  };

  return (
    <div className="group relative bg-white p-3 rounded-[2rem] stamp-shadow transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-slate-100">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-slate-50 flex items-center justify-center">
        <img 
          src={stamp.imageUrl} 
          alt={stamp.theme} 
          className="max-h-full max-w-full object-contain p-2"
        />
        
        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-wrap items-center justify-center gap-2 p-4">
          <button 
            onClick={handleDownload}
            className="p-2.5 bg-white rounded-full text-brand-blue hover:scale-110 transition-transform"
            title="Download"
          >
            <Download size={18} />
          </button>
          <button 
            onClick={handlePrint}
            className="p-2.5 bg-white rounded-full text-brand-green hover:scale-110 transition-transform"
            title="Print"
          >
            <Printer size={18} />
          </button>
          {onCollect && (
            <button 
              onClick={() => onCollect(stamp)}
              className="p-2.5 bg-white rounded-full text-brand-purple hover:scale-110 transition-transform"
              title="QR Collect"
            >
              <Smartphone size={18} />
            </button>
          )}
          <button 
            onClick={() => onDelete(stamp.id)}
            className="p-2.5 bg-white rounded-full text-red-500 hover:scale-110 transition-transform"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <div className="mt-3 px-2">
        <p className="text-xs font-black text-slate-800 truncate">{stamp.theme}</p>
        <p className="text-[10px] font-bold text-slate-400 mt-0.5">{new Date(stamp.timestamp).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default StampCard;
