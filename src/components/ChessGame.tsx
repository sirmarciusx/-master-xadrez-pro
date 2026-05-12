import React, { useState, useEffect, useCallback } from 'react';
import { Chess, Square } from 'chess.js';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { playSound } from '../utils/audio';

interface ChessGameProps {
  mode: 'local' | 'cpu';
  onBack: () => void;
}

const PIECE_URLS: Record<string, string> = {
  'w-k': 'https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg',
  'w-q': 'https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg',
  'w-r': 'https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg',
  'w-b': 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg',
  'w-n': 'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg',
  'w-p': 'https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg',
  'b-k': 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg',
  'b-q': 'https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg',
  'b-r': 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg',
  'b-b': 'https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg',
  'b-n': 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg',
  'b-p': 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg',
};

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

export function ChessGame({ mode, onBack }: ChessGameProps) {
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const [fen, setFen] = useState(game.fen());
  const [lastMove, setLastMove] = useState<{from: string; to: string} | null>(null);

  const makeRandomMove = useCallback(() => {
    const possible = game.moves({ verbose: true });
    if (game.isGameOver() || game.isDraw() || possible.length === 0) return;

    const pieceValues: Record<string, number> = {
      p: 1, n: 3, b: 3, r: 5, q: 9, k: 0
    };

    let selectedMove = possible[Math.floor(Math.random() * possible.length)];
    let bestScore = -1;

    for (const move of possible) {
      let score = Math.random() * 10;
      
      if (move.flags.includes('c') && move.captured) {
        const capturedValue = pieceValues[move.captured] || 0;
        score += capturedValue * 5;
      }
      
      if (move.flags.includes('e')) {
        score += 5;
      }
      
      if (game.inCheck()) {
        const kingMoves = possible.filter(m => m.flags.includes('k') || m.flags.includes('c'));
        if (kingMoves.includes(move)) {
          score += 20;
        }
      }

      if (score > bestScore) {
        bestScore = score;
        selectedMove = move;
      }
    }

    game.move(selectedMove.san);
    setFen(game.fen());

    if (game.isGameOver()) {
      playSound('end');
    } else if (game.inCheck()) {
      playSound('check');
    } else if (selectedMove.flags.includes('c') || selectedMove.flags.includes('e')) {
      playSound('capture');
    } else {
      playSound('move');
    }
  }, [game]);

  useEffect(() => {
    if (mode === 'cpu' && game.turn() === 'b' && !game.isGameOver()) {
      const timeout = setTimeout(makeRandomMove, 500);
      return () => clearTimeout(timeout);
    }
  }, [fen, mode, game, makeRandomMove]);

  useEffect(() => {
    const history = game.history({ verbose: true });
    if (history.length > 0) {
      const last = history[history.length - 1];
      if (!lastMove || last.from !== lastMove.from || last.to !== lastMove.to) {
        setLastMove({ from: last.from, to: last.to });
      }
    }
  }, [fen]);

  const onSquareClick = (square: string) => {
    if (game.isGameOver()) return;
    
    // CPU's turn
    if (mode === 'cpu' && game.turn() === 'b') {
       return;
    }

    if (selectedSquare === null) {
      const piece = game.get(square as Square);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        const moves = game.moves({ square: square as Square, verbose: true });
        setPossibleMoves(moves.map(m => m.to));
      }
    } else {
      try {
        const move = game.move({
          from: selectedSquare,
          to: square,
          promotion: 'q', // Always promote to queen for simplicity
        });

        if (move) {
          setFen(game.fen());
          setLastMove({ from: selectedSquare, to: square });
          if (game.isGameOver()) {
            playSound('end');
          } else if (game.inCheck()) {
            playSound('check');
          } else if (move.flags.includes('c') || move.flags.includes('e')) {
            playSound('capture');
          } else {
            playSound('move');
          }
        }
      } catch (e) {
        // Invalid move
        const piece = game.get(square as Square);
        if (piece && piece.color === game.turn()) {
          // Select another piece
          setSelectedSquare(square);
          const moves = game.moves({ square: square as Square, verbose: true });
          setPossibleMoves(moves.map(m => m.to));
          return;
        }
      }
      setSelectedSquare(null);
      setPossibleMoves([]);
    }
  };

  const getSquareColor = (rIndex: number, fIndex: number) => {
    return (rIndex + fIndex) % 2 === 0 ? 'brushed-metal-light' : 'brushed-metal-dark';
  };

  return (
    <div className="relative z-20 flex flex-col items-center justify-center min-h-screen w-full px-4 sm:px-8 py-8">
      {/* Header */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-8 glass-panel px-6 py-4 rounded-xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-label-md tracking-wider uppercase text-sm">Voltar</span>
        </button>
        
        <h2 className="font-display-lg text-2xl sm:text-3xl text-primary font-semibold hidden sm:block">
          {mode === 'cpu' ? 'Contra a CPU' : 'PvP Local'}
        </h2>
        
        <button
          onClick={() => {
            playSound('start');
            const newGame = new Chess();
            setGame(newGame);
            setFen(newGame.fen());
            setSelectedSquare(null);
            setPossibleMoves([]);
            setLastMove(null);
          }}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          <RefreshCw className="w-5 h-5" />
          <span className="font-label-md tracking-wider uppercase text-sm">Reiniciar</span>
        </button>
      </div>

      {/* Main Game Area */}
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl items-center lg:items-start justify-center">
        
        {/* The Board */}
        <div className="glass-panel p-4 sm:p-6 rounded-3xl flex-shrink-0">
          <div className="board-frame p-2 sm:p-4">
            <div className="relative">
              <div className="board-inner-glow"></div>
              <div className="grid grid-cols-8 grid-rows-8 rounded-md overflow-hidden relative z-0" 
                   style={{ width: 'min(80vw, 600px)', height: 'min(80vw, 600px)' }}>
                {RANKS.map((rank, rIndex) => (
                  FILES.map((file, fIndex) => {
                    const square = `${file}${rank}` as Square;
                    const piece = game.get(square);
                    const isSelected = selectedSquare === square;
                    const isPossibleMove = possibleMoves.includes(square);
                    const isLastMove = lastMove && (square === lastMove.from || square === lastMove.to);
                    
                    return (
                      <div
                        key={square}
                        onClick={() => onSquareClick(square)}
                        className={`${getSquareColor(rIndex, fIndex)} 
                                   relative flex items-center justify-center cursor-pointer
                                   ${isSelected ? 'square-glow' : ''}
                                   ${isLastMove ? 'last-move-glow' : ''}
                                   hover:opacity-90 transition-opacity`}
                      >
                        {isPossibleMove && (
                          <div className="absolute w-4 h-4 rounded-full bg-primary/70 shadow-[0_0_10px_theme(colors.primary)] z-10 pointer-events-none" />
                        )}
                        
                        {piece && (
                          <img
                            src={PIECE_URLS[`${piece.color}-${piece.type}`]}
                            alt={`${piece.color} ${piece.type}`}
                            className="w-[85%] h-[85%] object-contain select-none z-20 piece-shadow"
                            draggable={false}
                          />
                        )}

                        {/* Coordinates */}
                        {fIndex === 0 && (
                          <span className="absolute left-1 top-1 text-[10px] sm:text-xs font-semibold text-white/50 drop-shadow-md font-body-md select-none z-10">
                            {rank}
                          </span>
                        )}
                        {rIndex === 7 && (
                          <span className="absolute right-1 bottom-0 text-[10px] sm:text-xs font-semibold text-white/50 drop-shadow-md font-body-md select-none z-10">
                            {file}
                          </span>
                        )}
                      </div>
                    );
                  })
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel (Moves / Status) */}
        <div className="glass-panel w-full lg:w-80 rounded-2xl p-6 flex flex-col h-[400px] lg:h-[648px]">
          <h3 className="font-headline-sm text-xl text-primary border-b border-outline-variant pb-4 mb-4">
            Status do Jogo
          </h3>
          
          <div className="flex-1 overflow-y-auto font-body-md text-on-surface mb-4">
            {game.isGameOver() ? (
              <div className="text-center py-8">
                <p className="text-2xl text-primary font-display-lg mb-2">Fim de Jogo</p>
                <p className="text-on-surface-variant">
                  {game.isCheckmate() ? 'Checkmate!' : 
                   game.isDraw() ? 'Empate!' : 
                   game.isStalemate() ? 'Afogamento!' : 'Jogo Encerrado'}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${game.turn() === 'w' ? 'bg-primary shadow-[0_0_10px_theme(colors.primary)]' : 'bg-transparent border border-outline'}`} />
                  <span className={game.turn() === 'w' ? 'text-primary font-bold' : 'text-on-surface-variant'}>
                    Brancas jogam {game.inCheck() && game.turn() === 'w' && '(Check)'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${game.turn() === 'b' ? 'bg-primary shadow-[0_0_10px_theme(colors.primary)]' : 'bg-transparent border border-outline'}`} />
                  <span className={game.turn() === 'b' ? 'text-primary font-bold' : 'text-on-surface-variant'}>
                    Pretas jogam {game.inCheck() && game.turn() === 'b' && '(Check)'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-outline-variant pt-4">
            <h4 className="font-label-md text-sm text-on-surface-variant uppercase tracking-widest mb-2">Histórico de Movimentos</h4>
            <div className="h-32 overflow-y-auto text-sm font-mono text-on-surface bg-surface-container-low p-3 rounded border border-outline-variant">
              {game.history().length === 0 ? (
                 <span className="opacity-50">Nenhum movimento ainda</span>
              ) : (
                 <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                   {game.history().reduce((acc: any[], move, i) => {
                     if (i % 2 === 0) {
                       acc.push([move]);
                     } else {
                       acc[acc.length - 1].push(move);
                     }
                     return acc;
                   }, []).map((pair, i) => (
                     <React.Fragment key={i}>
                       <div className="opacity-60">{i + 1}. {pair[0]}</div>
                       <div>{pair[1] || ''}</div>
                     </React.Fragment>
                   ))}
                 </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
