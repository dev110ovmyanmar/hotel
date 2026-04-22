import React from 'react';
import { useTimer } from 'use-timer';
 
const ReactTimer = ({
    onFinish
}) => {
  const { time, start, pause, reset, status } = useTimer({
    autostart:true,
    initialTime:3,
    endTime:0,
    timerType:"DECREMENTAL",
    onTimeOver:onFinish
  });
 
  return (
    <div className='flex justify-center'>
      <p className='w-[12%] h-full bg-[#333333] text-[#FFFFFF] text-center rounded-sm p-3 '>{Math.floor(time/60)} Min : {Math.floor(time%60)} Sec</p>
    </div>
  );
};


export default ReactTimer