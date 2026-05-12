import React from 'react';
import { Users, Bot, BarChart2 } from 'lucide-react';
import { playSound } from '../utils/audio';

interface MainMenuProps {
  onStartGame: (mode: 'local' | 'cpu') => void;
}

export function MainMenu({ onStartGame }: MainMenuProps) {
  const handleStart = (mode: 'local' | 'cpu') => {
    playSound('start');
    onStartGame(mode);
  };

  return (
    <div className="relative z-20 flex flex-col items-center justify-center min-h-screen w-full px-8">
      {/* Header / Brand */}
      <div className="mb-12 text-center flex flex-col items-center w-full">
        <h1 className="font-display-lg text-4xl sm:text-5xl text-primary tracking-wide drop-shadow-lg mb-2 font-bold">
          Master Xadrez Pro
        </h1>
        <p className="font-body-lg text-lg text-on-surface-variant mt-2 opacity-80 mb-6">
          O Ápice da Estratégia
        </p>

        {/* Letreiro Luminoso (Marquee) */}
        <div className="w-full max-w-sm overflow-hidden whitespace-nowrap bg-gradient-to-r from-transparent via-primary/10 to-transparent py-1 border-y border-primary/20">
          <div className="animate-marquee font-label-sm text-xs tracking-widest uppercase text-primary neon-text font-bold">
            © 2026 MAPER TECNOLOGIA • TODOS OS DIREITOS RESERVADOS
          </div>
        </div>
      </div>

      {/* Glass Menu Card */}
      <div className="glass-panel rounded-xl p-8 w-full max-w-md flex flex-col gap-6">
        <h2 className="text-center font-headline-sm text-2xl text-primary font-semibold mb-2">
          Iniciar jogo
        </h2>

        {/* Button: Local PvP */}
        <button
          onClick={() => handleStart('local')}
          className="w-full flex items-center justify-between bg-transparent border border-outline text-on-surface rounded-lg px-6 py-4 hover:border-primary hover:text-primary transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6" />
            <span className="font-label-md text-sm uppercase tracking-widest font-semibold">
              PvP Local
            </span>
          </div>
        </button>

        {/* Button: Vs CPU */}
        <button
          onClick={() => handleStart('cpu')}
          className="w-full flex items-center justify-between bg-transparent border border-outline text-on-surface rounded-lg px-6 py-4 hover:border-primary hover:text-primary transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6" />
            <span className="font-label-md text-sm uppercase tracking-widest font-semibold">
              Contra a CPU
            </span>
          </div>
        </button>

        <div className="w-full h-px bg-outline-variant/30 my-2"></div>

        {/* Secondary */}
        <div className="flex justify-center mt-2">
          <button className="text-on-surface-variant hover:text-primary transition-colors flex flex-col items-center gap-2 cursor-pointer">
            <BarChart2 className="w-6 h-6" />
            <span className="font-label-sm text-xs tracking-widest uppercase">Classificação</span>
          </button>
        </div>
      </div>
    </div>
  );
}
