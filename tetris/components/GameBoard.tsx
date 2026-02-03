
import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef, useCallback, memo } from 'react';

// 짱구 감성의 따뜻하고 쨍한 색상들 (마지막은 방해 블록용 그레이)
const COLORS = ['#FF4B4B', '#2ECC71', '#FFDD00', '#3498DB', '#9B59B6', '#FF85A2', '#F39C12', '#95A5A6'];
const SHAPES = [
  [[1, 1, 1, 1]], [[0, 1, 0], [1, 1, 1]], [[1, 0, 0], [1, 1, 1]], [[0, 0, 1], [1, 1, 1]], [[1, 1], [1, 1]], [[1, 1, 0], [0, 1, 1]], [[0, 1, 1], [1, 1, 0]]
];
const MEMES = ["호호이~!", "액션 가면!!", "부리부리~", "초코비!", "천재 짱구!", "폭풍 감동!"];
const COLS = 10;
const ROWS = 20;

interface Particle {
  x: number; y: number; vx: number; vy: number; life: number; color: string; size: number;
}

export interface GameBoardHandle {
  moveLeft: () => void;
  moveRight: () => void;
  moveDown: () => void;
  rotate: () => void;
  hardDrop: () => void;
}

interface GameBoardProps {
  level: number; // App.tsx에서 점수 기반으로 계산된 레벨
  onScoreUpdate: (score: number) => void;
  onNextUpdate: (shape: number[][], color: string) => void;
  onGameOver: () => void;
  onMemeShow: (text: string) => void;
}

const GameBoard = forwardRef<GameBoardHandle, GameBoardProps>(({ level, onScoreUpdate, onNextUpdate, onGameOver, onMemeShow }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [grid, setGrid] = useState<number[][]>(() => Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
  const [blockSize, setBlockSize] = useState(18);
  const [activePiece, setActivePiece] = useState<{ pos: { x: number, y: number }, shape: number[][], color: string } | null>(null);
  const [nextPieceIndex, setNextPieceIndex] = useState(() => Math.floor(Math.random() * SHAPES.length));

  // level은 App.tsx에서 props로 전달받음 (점수 기반)
  const [totalLines, setTotalLines] = useState(0);
  const [combo, setCombo] = useState(0);
  const [clearingLines, setClearingLines] = useState<number[]>([]);

  const particlesRef = useRef<Particle[]>([]);
  const dropTimerRef = useRef<number | null>(null);
  const garbageTimerRef = useRef<number | null>(null);

  const stateRef = useRef({ activePiece, grid, combo, totalLines, level });
  const propsRef = useRef({ onScoreUpdate, onNextUpdate, onGameOver, onMemeShow });

  useEffect(() => {
    stateRef.current = { activePiece, grid, combo, totalLines, level };
  }, [activePiece, grid, combo, totalLines, level]);

  useEffect(() => {
    propsRef.current = { onScoreUpdate, onNextUpdate, onGameOver, onMemeShow };
  }, [onScoreUpdate, onNextUpdate, onGameOver, onMemeShow]);

  const dropTime = Math.max(80, 800 - (level - 1) * 80);

  const startDropTimer = useCallback(() => {
    if (dropTimerRef.current) window.clearTimeout(dropTimerRef.current);
    dropTimerRef.current = window.setTimeout(() => moveDown(true), dropTime);
  }, [dropTime]);

  const stopDropTimer = useCallback(() => {
    if (dropTimerRef.current) window.clearTimeout(dropTimerRef.current);
  }, []);

  const spawnGarbage = useCallback(() => {
    const { grid: g, activePiece: ap, level: lvl } = stateRef.current;
    if (g[0].some(cell => cell !== 0)) {
      propsRef.current.onGameOver();
      return;
    }
    const randomHole = Math.floor(Math.random() * COLS);
    const garbageRow = Array(COLS).fill(8); // 8번은 그레이 색상 (COLORS[7])
    garbageRow[randomHole] = 0;
    const nextGrid = [...g.slice(1), garbageRow];
    setGrid(nextGrid);
    if (ap) {
      setActivePiece(prev => prev ? { ...prev, pos: { ...prev.pos, y: prev.pos.y - 1 } } : null);
    }
    propsRef.current.onMemeShow("방해 공격!!!");
    const intervalTime = Math.max(3000, 10000 - (lvl - 5) * 500);
    garbageTimerRef.current = window.setTimeout(spawnGarbage, intervalTime);
  }, []);

  useEffect(() => {
    if (level >= 5) {
      const intervalTime = Math.max(3000, 10000 - (level - 5) * 500);
      garbageTimerRef.current = window.setTimeout(spawnGarbage, intervalTime);
    }
    return () => { if (garbageTimerRef.current) window.clearTimeout(garbageTimerRef.current); };
  }, [level >= 5, spawnGarbage]);

  useEffect(() => {
    const handleResize = () => {
      // 화면에 맞게 자동 계산: 헤더(60px) + 컨트롤러(150px) + 여백(50px)
      const availableHeight = window.innerHeight - 60 - 150 - 50;
      const availableWidth = window.innerWidth - 140;
      // 블록 사이즈 계산 (최소 10, 최대 22)
      const newSize = Math.max(10, Math.min(Math.floor(availableHeight / ROWS), Math.floor(availableWidth / COLS), 22));
      setBlockSize(newSize);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    spawnPiece();
    return () => {
      window.removeEventListener('resize', handleResize);
      stopDropTimer();
      if (garbageTimerRef.current) window.clearTimeout(garbageTimerRef.current);
    };
  }, []);

  const checkCollision = (shape: number[][], pos: { x: number, y: number }, g: number[][]) => {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const nx = pos.x + x; const ny = pos.y + y;
          if (nx < 0 || nx >= COLS || ny >= ROWS || (ny >= 0 && g[ny][nx] !== 0)) return true;
        }
      }
    }
    return false;
  };

  const lockPiece = (finalPiece = stateRef.current.activePiece) => {
    if (!finalPiece) return;
    const currentGrid = stateRef.current.grid.map(row => [...row]);
    finalPiece.shape.forEach((row, y) => {
      row.forEach((v, x) => {
        if (v !== 0) {
          const gy = finalPiece.pos.y + y; const gx = finalPiece.pos.x + x;
          if (gy >= 0 && gy < ROWS) currentGrid[gy][gx] = COLORS.indexOf(finalPiece.color) + 1;
        }
      });
    });

    const fullLines: number[] = [];
    currentGrid.forEach((row, i) => { if (row.every(cell => cell !== 0)) fullLines.push(i); });

    if (fullLines.length > 0) {
      setClearingLines(fullLines);
      setTimeout(() => setClearingLines([]), 150); // 플래시만 잠깐 보여주고 상태 초기화

      // 1. 심플한 파티클 생성 (즉시)
      fullLines.forEach(y => {
        for (let x = 0; x < COLS; x++) {
          const cx = Math.floor(x * blockSize + blockSize / 2);
          const cy = Math.floor(y * blockSize + blockSize / 2);
          const cellValue = currentGrid[y][x];
          const color = COLORS[cellValue - 1] || '#FFFFFF';

          for (let i = 0; i < 2; i++) {
            particlesRef.current.push({
              x: cx, y: cy,
              vx: (Math.random() - 0.5) * 4,
              vy: (Math.random() - 0.5) * 4 - 2,
              life: 1.0,
              color: color,
              size: Math.random() * 2 + 1
            });
          }
        }
      });

      // 2. 데이터 업데이트 및 즉시 플레이 재개 (지연 없음)
      const lineCount = fullLines.length;
      const currentCombo = stateRef.current.combo + 1;
      setCombo(currentCombo);

      const baseScores = [0, 100, 300, 700, 1200];
      const scoreGain = (baseScores[lineCount] + (currentCombo > 1 ? currentCombo * 100 : 0)) * stateRef.current.level;
      propsRef.current.onScoreUpdate(scoreGain);
      propsRef.current.onMemeShow(currentCombo > 2 ? `${currentCombo} COMBO!` : MEMES[Math.floor(Math.random() * MEMES.length)]);

      // 레벨업은 App.tsx에서 점수 기반으로 자동 처리됨

      setTotalLines(stateRef.current.totalLines + lineCount);
      const newGrid = currentGrid.filter((_, i) => !fullLines.includes(i));
      while (newGrid.length < ROWS) newGrid.unshift(Array(COLS).fill(0));
      setGrid(newGrid);
      spawnPiece();

    } else {
      setCombo(0);
      setGrid(currentGrid);
      spawnPiece();
    }
  };

  const spawnPiece = () => {
    setNextPieceIndex(prevIdx => {
      const np = { pos: { x: 3, y: 0 }, shape: SHAPES[prevIdx], color: COLORS[prevIdx] };
      const nextIdx = Math.floor(Math.random() * SHAPES.length);
      propsRef.current.onNextUpdate(SHAPES[nextIdx], COLORS[nextIdx]);
      // 충돌 감지 시 블록을 생성하지 않고 즉시 게임오버 (겹침 방지)
      if (checkCollision(np.shape, np.pos, stateRef.current.grid)) {
        setActivePiece(null); // 블록을 그리지 않음
        propsRef.current.onGameOver();
        return nextIdx;
      }
      setActivePiece(np);
      return nextIdx;
    });
  };

  const moveDown = (isAuto = false) => {
    const { activePiece: ap, grid: g } = stateRef.current;
    if (!ap) return;
    const n = { ...ap.pos, y: ap.pos.y + 1 };
    if (!checkCollision(ap.shape, n, g)) {
      setActivePiece({ ...ap, pos: n });
      if (!isAuto) startDropTimer();
    } else {
      lockPiece();
    }
    if (isAuto) startDropTimer();
  };

  const moveLeft = () => {
    const { activePiece: ap, grid: g } = stateRef.current;
    if (!ap) return;
    const n = { ...ap.pos, x: ap.pos.x - 1 };
    if (!checkCollision(ap.shape, n, g)) setActivePiece({ ...ap, pos: n });
  };

  const moveRight = () => {
    const { activePiece: ap, grid: g } = stateRef.current;
    if (!ap) return;
    const n = { ...ap.pos, x: ap.pos.x + 1 };
    if (!checkCollision(ap.shape, n, g)) setActivePiece({ ...ap, pos: n });
  };

  const rotate = () => {
    const { activePiece: ap, grid: g } = stateRef.current;
    if (!ap) return;
    const rs = ap.shape[0].map((_, i) => ap.shape.map(row => row[row.length - 1 - i]));
    let kx = ap.pos.x;
    if (kx + rs[0].length > COLS) kx = COLS - rs[0].length;
    if (kx < 0) kx = 0;
    if (!checkCollision(rs, { ...ap.pos, x: kx }, g)) setActivePiece({ ...ap, shape: rs, pos: { ...ap.pos, x: kx } });
  };

  const hardDrop = () => {
    const { activePiece: ap, grid: g } = stateRef.current;
    if (!ap) return;
    let dy = ap.pos.y;
    while (!checkCollision(ap.shape, { ...ap.pos, y: dy + 1 }, g)) dy++;
    lockPiece({ ...ap, pos: { ...ap.pos, y: dy } });
  };

  useImperativeHandle(ref, () => ({ moveLeft, moveRight, moveDown: () => moveDown(false), rotate, hardDrop }));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' '].includes(e.key)) e.preventDefault();
      switch (e.key) {
        case 'ArrowLeft': moveLeft(); break;
        case 'ArrowRight': moveRight(); break;
        case 'ArrowDown': moveDown(false); break;
        case 'ArrowUp': rotate(); break;
        case ' ': hardDrop(); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (activePiece) startDropTimer();
    return () => stopDropTimer();
  }, [activePiece, dropTime, startDropTimer, stopDropTimer]);

  const drawBlock = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string) => {
    const px = x * blockSize; const py = y * blockSize; const s = blockSize;
    const seed = (x * 17 + y * 23);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(px + 1, py + 1, s - 2, s - 2, 2) : ctx.rect(px + 1, py + 1, s - 2, s - 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(0,0,0,0.8)';
    ctx.lineWidth = 1;
    ctx.stroke();

    if (seed % 100 < 10) {
      ctx.fillStyle = 'black';
      ctx.beginPath(); ctx.arc(px + s * 0.35, py + s * 0.45, 1, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(px + s * 0.65, py + s * 0.45, 1, 0, Math.PI * 2); ctx.fill();
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(px + s * 0.45, py + s * 0.65);
      ctx.lineTo(px + s * 0.55, py + s * 0.65);
      ctx.stroke();
    }
  };

  useEffect(() => {
    let animationId: number;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    const render = () => {
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, COLS * blockSize * 2, ROWS * blockSize * 2);
      ctx.save();
      ctx.scale(2, 2);

      const { grid: g, activePiece: ap } = stateRef.current;

      // 배경 격자
      ctx.strokeStyle = '#f0f0f0';
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= COLS; i++) {
        ctx.beginPath(); ctx.moveTo(i * blockSize, 0); ctx.lineTo(i * blockSize, ROWS * blockSize); ctx.stroke();
      }
      for (let i = 0; i <= ROWS; i++) {
        ctx.beginPath(); ctx.moveTo(0, i * blockSize); ctx.lineTo(COLS * blockSize, i * blockSize); ctx.stroke();
      } // 고정된 블록
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          if (g[y][x] !== 0) drawBlock(ctx, x, y, COLORS[g[y][x] - 1]);
        }
      }

      // 조작 중인 블록
      if (ap) {
        ap.shape.forEach((row, y) => row.forEach((v, x) => {
          if (v !== 0) drawBlock(ctx, ap.pos.x + x, ap.pos.y + y, ap.color);
        }));
      }

      // ✨ 라인 클리어 플래시 효과 (기존보다 연하게, 해당 라인만)
      if (clearingLines.length > 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        clearingLines.forEach(y => {
          ctx.fillRect(0, y * blockSize, COLS * blockSize, blockSize);
        });
      }

      // 파티클 (랙 최소화를 위해 life 기반 필터링)
      if (particlesRef.current.length > 0) {
        particlesRef.current = particlesRef.current.filter(p => p.life > 0);
        particlesRef.current.forEach(p => {
          p.x += p.vx; p.y += p.vy; p.vy += 0.2; p.life -= 0.04;
          ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1.0;
      }
      ctx.restore();
      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [blockSize, clearingLines]);

  return (
    <div className="relative border-[3px] border-black bg-white rounded-2xl overflow-hidden shadow-[5px_5px_0px_black]">
      <canvas
        ref={canvasRef}
        width={COLS * blockSize * 2}
        height={ROWS * blockSize * 2}
        style={{ width: COLS * blockSize, height: ROWS * blockSize }}
        className="block"
      />
    </div>
  );
});

export default memo(GameBoard);
