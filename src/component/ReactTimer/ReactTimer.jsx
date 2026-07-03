import React from 'react';
import { useTimer } from 'use-timer';
 
const ReactTimer = ({
    onFinish
}) => {
  const { time, start, pause, reset, status } = useTimer({
    autostart:true,
    initialTime:8,
    endTime:0,
    timerType:"DECREMENTAL",
    onTimeOver:onFinish
  });
 
  return (
    <div className='flex justify-center'>
      <p className='w-[min(12vw,350px)] h-full bg-[#333333] text-[#FFFFFF] text-center rounded-sm p-3 text-[min(1.5vw,18px)] '>{Math.floor(time/60)} Min : {Math.floor(time%60)} Sec</p>
    </div>
  );
};


export default ReactTimer