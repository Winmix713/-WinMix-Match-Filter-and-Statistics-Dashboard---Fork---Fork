import React, { useEffect, useState } from 'react';
import { ShieldIcon, SaveIcon, KeyIcon, LinkIcon, CheckCircleIcon, XCircleIcon, DatabaseIcon, InfoIcon, SettingsIcon, EyeIcon, EyeOffIcon, RefreshCwIcon, ArrowLeftIcon, UsersIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
interface SupabaseConfig {
  url: string;
  key: string;
  isConnected: boolean;
}
export const Admin: React.FC = () => {
  const [config, setConfig] = useState<SupabaseConfig>({
    url: '',
    key: '',
    isConnected: false
  });
  const [loading, setLoading] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [showKey, setShowKey] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  // Load config from localStorage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('winmix_supabase_config');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig({
          url: parsedConfig.url || '',
          key: parsedConfig.key || '',
          isConnected: parsedConfig.isConnected || false
        });
      } catch (error) {
        console.error('Error parsing saved config:', error);
      }
    }
  }, []);
  const handleSaveConfig = () => {
    setLoading(true);
    // Validate inputs
    if (!config.url || !config.key) {
      setTestStatus('error');
      setTestMessage('Kérjük, add meg az URL-t és az API kulcsot');
      setLoading(false);
      return;
    }
    // In a real app, we would test the connection here
    // For now, we'll just simulate a successful connection
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate for demo
      if (success) {
        const newConfig = {
          ...config,
          isConnected: true
        };
        // Save to localStorage
        localStorage.setItem('winmix_supabase_config', JSON.stringify(newConfig));
        setConfig(newConfig);
        setTestStatus('success');
        setTestMessage('Sikeres kapcsolódás a Supabase adatbázishoz');
      } else {
        setTestStatus('error');
        setTestMessage('Nem sikerült kapcsolódni a Supabase adatbázishoz. Ellenőrizd az adatokat.');
      }
      setLoading(false);
    }, 1500);
  };
  const handleTestConnection = () => {
    setTestStatus('testing');
    // Simulate testing the connection
    setTimeout(() => {
      const success = config.url && config.key && Math.random() > 0.3; // 70% success rate for demo
      if (success) {
        setTestStatus('success');
        setTestMessage('Sikeres kapcsolódás a Supabase adatbázishoz');
      } else {
        setTestStatus('error');
        setTestMessage('Nem sikerült kapcsolódni a Supabase adatbázishoz. Ellenőrizd az adatokat.');
      }
    }, 1500);
  };
  const handleReset = () => {
    localStorage.removeItem('winmix_supabase_config');
    setConfig({
      url: '',
      key: '',
      isConnected: false
    });
    setTestStatus('idle');
    setTestMessage('');
  };
  return <div className="min-h-screen bg-[#0a0a12] text-zinc-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="text-center space-y-3 mb-10">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-white">
            Admin Panel
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-300">
            Állítsd be a Supabase kapcsolatot az alkalmazáshoz
          </p>
        </div>
        <div className="bg-white/5 ring-1 ring-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                <ShieldIcon className="h-5 w-5 text-violet-400" />
              </div>
              <h2 className="text-xl font-medium text-white">
                Supabase Konfiguráció
              </h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="space-y-1">
                <label htmlFor="supabase-url" className="block text-sm font-medium text-zinc-300">
                  Supabase URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon className="h-5 w-5 text-zinc-400" />
                  </div>
                  <input id="supabase-url" type="url" value={config.url} onChange={e => setConfig({
                  ...config,
                  url: e.target.value
                })} className="block w-full pl-10 pr-3 py-3 border-0 rounded-xl bg-white/5 ring-1 ring-white/10 focus:ring-violet-500 focus:outline-none text-zinc-200 placeholder-zinc-400" placeholder="https://your-project.supabase.co" />
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  A Supabase projekt URL-je, amelyet a Supabase Dashboard-on
                  találsz
                </p>
              </div>
              <div className="space-y-1">
                <label htmlFor="supabase-key" className="block text-sm font-medium text-zinc-300">
                  Supabase Anon Key
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyIcon className="h-5 w-5 text-zinc-400" />
                  </div>
                  <input id="supabase-key" type={showKey ? 'text' : 'password'} value={config.key} onChange={e => setConfig({
                  ...config,
                  key: e.target.value
                })} className="block w-full pl-10 pr-10 py-3 border-0 rounded-xl bg-white/5 ring-1 ring-white/10 focus:ring-violet-500 focus:outline-none text-zinc-200 placeholder-zinc-400" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowKey(!showKey)}>
                    {showKey ? <EyeOffIcon className="h-5 w-5 text-zinc-400" /> : <EyeIcon className="h-5 w-5 text-zinc-400" />}
                  </button>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Az anonim kulcs, amelyet a Supabase API beállításoknál találsz
                </p>
              </div>
              {testStatus === 'success' && <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-emerald-400">
                      Sikeres kapcsolódás
                    </h3>
                    <p className="text-xs text-emerald-300/80 mt-1">
                      {testMessage}
                    </p>
                  </div>
                </div>}
              {testStatus === 'error' && <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
                  <XCircleIcon className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-red-400">
                      Kapcsolódási hiba
                    </h3>
                    <p className="text-xs text-red-300/80 mt-1">
                      {testMessage}
                    </p>
                  </div>
                </div>}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <h3 className="text-sm font-medium text-zinc-200 flex items-center gap-2 mb-3">
                  <InfoIcon className="h-4 w-4 text-zinc-400" />
                  Kapcsolat állapota
                </h3>
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${config.isConnected ? 'bg-emerald-500' : 'bg-zinc-500'}`}></div>
                  <span className="text-sm text-zinc-300">
                    {config.isConnected ? 'Kapcsolódva' : 'Nincs kapcsolat'}
                  </span>
                </div>
                {config.isConnected && <div className="mt-2 text-xs text-zinc-400">
                    Utoljára mentve: {new Date().toLocaleString()}
                  </div>}
              </div>
              <div className="pt-4 flex flex-wrap gap-3">
                <button type="button" onClick={handleSaveConfig} disabled={loading} className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-white bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full px-4 py-2.5 shadow-lg hover:shadow-[0_12px_24px_-6px_rgba(139,92,246,0.4)] hover:-translate-y-0.5 transform-gpu transition disabled:opacity-50">
                  {loading ? <>
                      <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                      <span>Mentés...</span>
                    </> : <>
                      <SaveIcon size={16} />
                      <span>Beállítások mentése</span>
                    </>}
                </button>
                <button type="button" onClick={handleTestConnection} disabled={testStatus === 'testing' || !config.url || !config.key} className="inline-flex items-center gap-2 text-sm font-medium text-zinc-200 border border-white/10 rounded-full px-4 py-2.5 hover:bg-white/5 disabled:opacity-50">
                  {testStatus === 'testing' ? <>
                      <div className="animate-spin h-4 w-4 border-2 border-zinc-300 rounded-full border-t-transparent"></div>
                      <span>Tesztelés...</span>
                    </> : <>
                      <DatabaseIcon size={16} />
                      <span>Kapcsolat tesztelése</span>
                    </>}
                </button>
                <button type="button" onClick={handleReset} className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 border border-white/5 rounded-full px-4 py-2.5 hover:bg-white/5 hover:text-zinc-300">
                  <RefreshCwIcon size={16} />
                  <span>Alaphelyzet</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-between items-center">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-zinc-100">
            <ArrowLeftIcon size={16} />
            Vissza a főoldalra
          </Link>
          <Link to="/teams" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-zinc-100">
            <UsersIcon size={16} />
            Csapatok megtekintése
          </Link>
        </div>
      </div>
    </div>;
};