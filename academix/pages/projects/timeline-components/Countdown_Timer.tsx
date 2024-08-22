import React, { useState, useEffect } from 'react';

interface TimeLeft {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

const CountdownTimer: React.FC<{ dueDate: string }> = ({ dueDate }) => {
// const CountdownTimer: React.FC = () => {
  const calculateTimeLeft = (): TimeLeft => {
    const originalDate = dueDate;
    const dateObj = new Date(originalDate);
    dateObj.setHours(23, 59, 59, 0);
    const formattedDate = `${dateObj.toLocaleString('en-us', { month: 'long' })} ${dateObj.getDate()}, ${dateObj.getFullYear()} ${dateObj.toLocaleTimeString()}`;
    const deadline = new Date(formattedDate).getTime();
    const now = new Date().getTime();
    const difference = deadline - now;
    

    let timeLeft: TimeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  return (
    <div className='flex-1 flex flex-col justify-center items-center gap-2'>
      <div className="bg-gray-600 rounded-xl p-2 w-80">
        <h1 className='text-center text-white'>TIME LEFT</h1>
      </div>
      <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
        <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
          <span className="countdown font-mono text-4xl">{timeLeft.days ?? 0}</span>
          days
        </div>
        <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
          <span className="countdown font-mono text-4xl">{timeLeft.hours ?? 0}</span>
          hours
        </div>
        <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
          <span className="countdown font-mono text-4xl">{timeLeft.minutes ?? 0}</span>
          min
        </div>
        <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
          <span className="countdown font-mono text-4xl">{timeLeft.seconds ?? 0}</span>
          sec
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
