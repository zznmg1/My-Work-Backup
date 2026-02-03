
import React, { useRef } from 'react';

interface ControllerProps {
  onLeft: () => void;
  onRight: () => void;
  onDown: () => void;
  onRotate: () => void;
  onHardDrop: () => void;
}

const Controller: React.FC<ControllerProps> = ({ onLeft, onRight, onDown, onRotate, onHardDrop }) => {
  const timerRef = useRef<number | null>(null);
  const delayRef = useRef<number | null>(null);

  const stopRepeat = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (delayRef.current) window.clearTimeout(delayRef.current);
    timerRef.current = null;
    delayRef.current = null;
  };

  const startRepeat = (action: () => void) => {
    stopRepeat();
    action();
    // DAS 최적화: 160ms 대기 후 60ms 간격으로 실행
    delayRef.current = window.setTimeout(() => {
      timerRef.current = window.setInterval(() => {
        action();
      }, 60);
    }, 160);
  };

  const btnBase = "active:translate-y-0.5 active:shadow-none transition-all duration-75 flex items-center justify-center font-normal text-black select-none touch-manipulation border-[2px] border-black shadow-[0_3px_0px_black] rounded-xl";
  const directionBtn = "bg-white h-14 w-14 text-xl";
  const actionBtn = "bg-[#AED6F1] h-13 w-13 text-sm";

  return (
    <div className="flex items-end gap-6 w-full justify-center">
      {/* 방향키 뭉치 (역 T자형) */}
      <div className="grid grid-cols-3 grid-rows-2 gap-2 auto-cols-max">
        <div /> {/* 빈 칸 */}
        <button onPointerDown={onRotate} className={`${btnBase} bg-[#AED6F1] h-14 w-14 text-xl`}>▲</button>
        <div /> {/* 빈 칸 */}

        <button
          onPointerDown={() => startRepeat(onLeft)}
          onPointerUp={stopRepeat}
          onPointerLeave={stopRepeat}
          onPointerCancel={stopRepeat}
          className={`${btnBase} ${directionBtn}`}
        >◀</button>
        <button
          onPointerDown={() => startRepeat(onDown)}
          onPointerUp={stopRepeat}
          onPointerLeave={stopRepeat}
          onPointerCancel={stopRepeat}
          className={`${btnBase} bg-[#F1948A] h-14 w-14 text-xl`}
        >▼</button>
        <button
          onPointerDown={() => startRepeat(onRight)}
          onPointerUp={stopRepeat}
          onPointerLeave={stopRepeat}
          onPointerCancel={stopRepeat}
          className={`${btnBase} ${directionBtn}`}
        >▶</button>
      </div>

      {/* 액션 버튼 (하드 드롭) */}
      <div className="flex flex-col gap-1">
        <button
          onPointerDown={onHardDrop}
          className={`${btnBase} bg-[#F9E79F] h-20 w-14 text-sm flex-col gap-1`}
        >
          <span className="text-xl">⚡</span>
          <span>한번에!</span>
        </button>
        <p className="text-xs font-normal text-center opacity-50">DROP</p>
      </div>
    </div>
  );
};

export default Controller;
