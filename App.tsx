
import React, { useState, useEffect } from 'react';
import { Search, Loader2, Sparkles, Image as ImageIcon, History, Download, Printer, Smartphone, Trash2, ChevronRight } from 'lucide-react';
import { generateStampImage } from './services/geminiService';
import { GeneratedStamp, AppStatus } from './types';
import StampCard from './components/StampCard';
import QRCodeModal from './components/QRCodeModal';

const LOGO_URL = "https://raw.githubusercontent.com/username/repo/branch/logo.png"; // Placeholder for the provided logo

const SUGGESTIONS = [
  "Golden Camel", "Sheikh Zayed Mosque", "Burj Khalifa", 
  "Dhow Boat", "Royal Falcon", "Louvre Abu Dhabi",
  "Al Ain Oasis", "Pearl Diver", "Majlis Dallah", "Qasr Al Hosn"
];

const LOADING_MESSAGES = [
  "Inking the plates...",
  "Sketching Emirati wonders...",
  "Perforating the edges...",
  "Capturing the desert light...",
  "Building a masterpiece...",
  "Almost ready to post..."
];

const App: React.FC = () => {
  const [theme, setTheme] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [stamps, setStamps] = useState<GeneratedStamp[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [qrModal, setQrModal] = useState<{ isOpen: boolean; stamp: GeneratedStamp | null }>({
    isOpen: false,
    stamp: null
  });

  useEffect(() => {
    const saved = localStorage.getItem('uae-stamps-history-v2');
    if (saved) {
      try {
        setStamps(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse stamps history", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('uae-stamps-history-v2', JSON.stringify(stamps));
  }, [stamps]);

  useEffect(() => {
    let interval: any;
    if (status === AppStatus.GENERATING) {
      interval = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!theme.trim()) return;

    setStatus(AppStatus.GENERATING);
    setError(null);
    
    try {
      const imageUrl = await generateStampImage(theme);
      const newStamp: GeneratedStamp = {
        id: crypto.randomUUID(),
        theme: theme,
        imageUrl: imageUrl,
        timestamp: Date.now()
      };
      setStamps(prev => [newStamp, ...prev]);
      setStatus(AppStatus.SUCCESS);
      setTheme('');
    } catch (err) {
      setStatus(AppStatus.ERROR);
      setError("We couldn't generate that stamp right now. Try a different theme!");
      console.error(err);
    }
  };

  const deleteStamp = (id: string) => {
    setStamps(prev => prev.filter(s => s.id !== id));
  };

  const latestStamp = stamps[0];

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 pb-20">
      {/* Brand Header */}
      <header className="bg-white sticky top-0 z-[60] px-4 py-3 md:px-8 border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* The Logo (Based on user image description) */}
            <div className="flex flex-col">
              <div className="flex gap-0.5 mb-1 overflow-hidden h-4 md:h-6">
                {[...Array(15)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-brand-blue -translate-y-4 shrink-0"></div>
                ))}
              </div>
              <div className="flex items-end gap-2">
                <span className="text-xl md:text-2xl font-black italic tracking-tighter text-brand-green leading-none">STAMPS</span>
                <span className="text-lg md:text-xl font-black italic tracking-tighter text-brand-blue leading-none">FOR</span>
                <span className="text-xl md:text-2xl font-black italic tracking-tighter text-brand-purple leading-none">TOMORROW</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full">
                <History size={16} className="text-brand-purple" />
                <span className="text-sm font-black text-slate-700">{stamps.length} Stamps Collected</span>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-8 md:px-8">
        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* Generator Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-blue via-brand-green to-brand-purple"></div>
              
              <div className="mb-8">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Create a Vision</h2>
                <p className="text-slate-500 font-semibold leading-relaxed">What part of the UAE's future or heritage should we put on a stamp today?</p>
              </div>

              <form onSubmit={handleGenerate} className="space-y-6">
                <div className="group relative">
                  <input
                    type="text"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="E.g. Sustainable City 2050"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:border-brand-blue focus:bg-white transition-all outline-none font-bold text-lg placeholder:text-slate-300 shadow-inner"
                    disabled={status === AppStatus.GENERATING}
                  />
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-blue transition-colors" size={24} />
                </div>
                
                <button
                  type="submit"
                  disabled={status === AppStatus.GENERATING || !theme.trim()}
                  className="w-full h-16 bg-slate-900 text-white rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 hover:bg-slate-800 active:scale-[0.97] transition-all disabled:bg-slate-200 shadow-xl shadow-slate-200"
                >
                  {status === AppStatus.GENERATING ? (
                    <Loader2 className="animate-spin" size={28} />
                  ) : (
                    <>
                      <Sparkles size={24} className="text-brand-purple" />
                      <span>Generate Stamp</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px flex-1 bg-slate-100"></div>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Inspiration</span>
                  <div className="h-px flex-1 bg-slate-100"></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setTheme(s)}
                      className="px-4 py-2 bg-slate-50 hover:bg-white hover:shadow-md border border-slate-100 rounded-full text-xs font-black text-slate-600 transition-all hover:-translate-y-0.5"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-5 rounded-3xl border border-red-100 font-bold flex items-center gap-4 animate-in slide-in-from-top-4 duration-300">
                <span className="text-2xl shrink-0">😕</span>
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Preview / Gallery Column */}
          <div className="lg:col-span-7 space-y-10">
            {/* Main Preview Container */}
            <div className="relative bg-white rounded-[4rem] p-12 stamp-shadow border border-slate-100 flex flex-col items-center justify-center min-h-[600px]">
              {status === AppStatus.GENERATING ? (
                <div className="text-center">
                  <div className="relative w-72 h-96 mx-auto mb-10 bg-slate-50 border-4 border-dashed border-slate-200 rounded-[2rem] flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/50 animate-pulse"></div>
                    <Loader2 className="animate-spin text-brand-blue" size={56} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-800 mb-2">Designing...</h3>
                  <p className="text-brand-blue font-black uppercase tracking-widest text-sm">{LOADING_MESSAGES[loadingMsgIdx]}</p>
                </div>
              ) : latestStamp && status !== AppStatus.IDLE ? (
                <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-700">
                  <div className="w-full max-w-sm group">
                    <div className="bg-white p-8 rounded-[3rem] shadow-2xl border-4 border-slate-50 mb-10 overflow-hidden relative transition-transform hover:scale-[1.02]">
                       <div className="absolute inset-0 border-[16px] border-white/80 z-10 pointer-events-none perforated-edge"></div>
                       <img 
                        src={latestStamp.imageUrl} 
                        alt={latestStamp.theme} 
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <button 
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = latestStamp.imageUrl;
                          link.download = `uae-stamp-${latestStamp.theme.replace(/\s+/g, '-')}.png`;
                          link.click();
                        }}
                        className="bg-brand-blue text-white p-5 rounded-[2rem] flex flex-col items-center gap-1 hover:brightness-110 shadow-lg shadow-blue-100 transition-all active:scale-95"
                      >
                        <Download size={24} />
                        <span className="text-[10px] font-black uppercase">Save</span>
                      </button>
                      <button 
                        onClick={() => {
                          const win = window.open('', '_blank');
                          if (win) {
                            win.document.write(`<html><body style="display:flex;justify-content:center;align-items:center;height:100vh;margin:0;background:#f8fafc;"><img src="${latestStamp.imageUrl}" style="max-width:100%;height:auto;border:1px solid #eee;box-shadow:0 10px 30px rgba(0,0,0,0.1);"/><script>window.onload=()=>{window.print();window.close();}</script></body></html>`);
                            win.document.close();
                          }
                        }}
                        className="bg-brand-green text-white p-5 rounded-[2rem] flex flex-col items-center gap-1 hover:brightness-110 shadow-lg shadow-green-100 transition-all active:scale-95"
                      >
                        <Printer size={24} />
                        <span className="text-[10px] font-black uppercase">Print</span>
                      </button>
                      <button 
                        onClick={() => setQrModal({ isOpen: true, stamp: latestStamp })}
                        className="bg-brand-purple text-white p-5 rounded-[2rem] flex flex-col items-center gap-1 hover:brightness-110 shadow-lg shadow-purple-100 transition-all active:scale-95"
                      >
                        <Smartphone size={24} />
                        <span className="text-[10px] font-black uppercase">Collect</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-12 text-center">
                    <h3 className="text-4xl font-black text-slate-800 tracking-tighter mb-2">{latestStamp.theme}</h3>
                    <div className="flex items-center justify-center gap-2">
                      <span className="px-3 py-1 bg-brand-blue/10 text-brand-blue text-[10px] font-black uppercase rounded-full tracking-widest">Authentic Issue</span>
                      <span className="text-slate-300">•</span>
                      <span className="px-3 py-1 bg-brand-green/10 text-brand-green text-[10px] font-black uppercase rounded-full tracking-widest">Collector Grade</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8">
                  <div className="w-40 h-40 bg-slate-50 rounded-full flex items-center justify-center mb-8 mx-auto border-2 border-dashed border-slate-100">
                    <ImageIcon className="text-slate-200" size={80} />
                  </div>
                  <h3 className="text-4xl font-black text-slate-800 mb-3 tracking-tighter">Start Your Collection</h3>
                  <p className="text-slate-500 font-semibold max-w-xs mx-auto">Enter a theme on the left to generate your first custom UAE postage stamp.</p>
                </div>
              )}
            </div>

            {/* Collection Album */}
            {stamps.length > 0 && (
              <section className="space-y-8 animate-in slide-in-from-bottom-8 duration-700 delay-300">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-purple/10 rounded-xl">
                      <History className="text-brand-purple" size={24} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Your Stamp Album</h2>
                  </div>
                  <button 
                    onClick={() => { if(confirm("Empty your album?")) setStamps([]); }}
                    className="text-xs font-black text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 size={14} />
                    Reset Album
                  </button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {stamps.map((stamp) => (
                    <StampCard 
                      key={stamp.id} 
                      stamp={stamp} 
                      onDelete={deleteStamp}
                      onCollect={(s) => setQrModal({ isOpen: true, stamp: s })}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      {/* QR Modal */}
      <QRCodeModal 
        isOpen={qrModal.isOpen} 
        onClose={() => setQrModal({ isOpen: false, stamp: null })} 
        imageUrl={qrModal.stamp?.imageUrl || ''}
        theme={qrModal.stamp?.theme || ''}
      />

      {/* Footer Branded Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stamps For Tomorrow © 2024</p>
           <div className="flex gap-2">
             <div className="w-2 h-2 rounded-full bg-brand-blue"></div>
             <div className="w-2 h-2 rounded-full bg-brand-green"></div>
             <div className="w-2 h-2 rounded-full bg-brand-purple"></div>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
