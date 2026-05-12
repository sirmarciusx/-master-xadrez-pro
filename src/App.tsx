import { useState } from 'react';
import { MainMenu } from './components/MainMenu';
import { ChessGame } from './components/ChessGame';

export default function App() {
  const [mode, setMode] = useState<'menu' | 'local' | 'cpu'>('menu');

  return (
    <div className="bg-background text-on-background min-h-screen w-screen overflow-x-hidden relative font-body-md">
      {/* Blurred Background Scene */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center filter blur-md opacity-30 pointer-events-none" 
        style={{ backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuDHPCw_cice4OfZnuXAfEOHiZGpPR0Nuem3XsbMXN_eODsGJe5_nxzU5H4L71n7ZeptDSL6qP9LJctSg87ShOP-4G_g83jwcEl2smeZx6alTs0l9-ikE0ouWSitgAjcxICr-QUu1n67o0I9TE9aZovlGYNKrh8DuAV8vuDns9wCHUwu7FBaAZL4IjyIEd_Ol7vOg9dImghVg2lwVJNkVEej2lvhtl_Vun5YxhwaPZZGQVhqy3CEfLi2SCNK3w845iW9sO2bC1vQcFc)' }}
      />
      {/* Vignette overlay for depth */}
      <div className="fixed inset-0 bg-gradient-to-t from-background via-transparent to-background/50 z-10 pointer-events-none" />
      
      {/* Dynamic Content */}
      {mode === 'menu' && (
        <MainMenu onStartGame={(newMode) => setMode(newMode)} />
      )}
      
      {(mode === 'local' || mode === 'cpu') && (
        <ChessGame mode={mode} onBack={() => setMode('menu')} />
      )}
    </div>
  );
}
