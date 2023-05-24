import React, { useState, useEffect, useRef } from 'react';
import './assets/css/style.css';

function App() {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [millis, setMillis] = useState(0);
  const [run, setRun] = useState(false);
  const [lastPause, setLastPause] = useState(null);
  const [prevTime, setPrevTime] = useState(null);
  const animationFrameId = useState(null);
  const animationFrameRef = useRef(null);

  const zeroPad = (value) => (value < 10 ? `0${value}` : value);

  const handleStartClick = () => {
    if (!run) {
      setRun(true);
      setPrevTime(performance.now());
    }
  };

  const handleStopClick = () => {
    if (run) {
      setRun(false);
      setLastPause({
        minutes,
        seconds,
        millis,
      });
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      setPrevTime(null);
    }
  };

  const handleResetClick = () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    setMinutes(0);
    setSeconds(0);
    setMillis(0);
    setLastPause(null);
    setRun(false);
    setPrevTime(null);
  };

  const updateTimer = (currentTime) => {
    if (!prevTime) {
      setPrevTime(currentTime);
    }

    const deltaTime = currentTime - prevTime;

    let updatedMillis = millis + deltaTime;
    let updatedSeconds = seconds;
    let updatedMinutes = minutes;

    if (updatedMillis >= 1000) {
      updatedSeconds += Math.floor(updatedMillis / 1000);
      updatedMillis %= 1000;
    }
    if (updatedSeconds >= 60) {
      updatedMinutes += Math.floor(updatedSeconds / 60);
      updatedSeconds %= 60;
    }
    if (updatedMinutes >= 60) {
      handleStopClick();
      return;
    }

    setSeconds(updatedSeconds);
    setMinutes(updatedMinutes);
    setMillis(Math.round(updatedMillis));
    setPrevTime(currentTime);
    animationFrameRef.current = requestAnimationFrame(updateTimer);
  };

  useEffect(() => {
    if (run) {
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    } else {
      cancelAnimationFrame(animationFrameRef.current);
      setPrevTime(null);
    }

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [run]);

  return (
    <div className="wrapper">
      <header>
        <h1>Chronomètre</h1>
      </header>
      <div className="display">
        <div className="numbers">
          <span className="mins">
            {zeroPad(minutes)}
            :
          </span>
          <span className="secs">
            {zeroPad(seconds)}
            :
          </span>
          <span className="millis">{zeroPad(millis)}</span>
        </div>
      </div>
      <div className="actions">
        <button
          type="button"
          onClick={handleStartClick}
        >
          START
        </button>
        <button
          type="button"
          onClick={handleStopClick}
        >
          STOP
        </button>
        <button
          type="button"
          onClick={handleResetClick}
        >
          RESET
        </button>
        <p className="dernierePause">
          Dernière pause :
          {lastPause && ` ${zeroPad(lastPause.minutes)}:${zeroPad(lastPause.seconds)}:${zeroPad(lastPause.millis)}`}
        </p>
      </div>
    </div>
  );
}

export default App;
