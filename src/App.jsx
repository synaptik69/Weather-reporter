import React, { useState, useEffect } from 'react';
import './assets/css/style.css';

function App() {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [millis, setMillis] = useState(0);
  const [run, setRun] = useState(false);
  const [stopDisabled, setStopDisabled] = useState(true);
  const [resetDisabled, setResetDisabled] = useState(true);
  const [lastPause, setLastPause] = useState(null);
  const [animationFrameId, setAnimationFrameId] = useState(null);
  const [prevTime, setPrevTime] = useState(null);

  const zeroPad = (value) => (value < 10 ? `0${value}` : value);

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

    setSeconds(updatedSeconds);
    setMinutes(updatedMinutes);
    setMillis(Math.round(updatedMillis));
    setPrevTime(currentTime);
    setAnimationFrameId(requestAnimationFrame(updateTimer));
  };

  useEffect(() => {
    if (run) {
      setAnimationFrameId(requestAnimationFrame(updateTimer));
    } else {
      cancelAnimationFrame(animationFrameId);
      setPrevTime(null);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [run]);

  const handleStartClick = () => {
    if (!run) {
      setRun(true);
      setStopDisabled(false);
      setResetDisabled(true);
      setPrevTime(performance.now());
    }
  };

  const handleStopClick = () => {
    if (run) {
      setRun(false);
      setStopDisabled(true);
      setResetDisabled(false);
      setLastPause({
        minutes,
        seconds,
        millis,
      });
      cancelAnimationFrame(animationFrameId);
      setPrevTime(null);
    }
  };

  const handleResetClick = () => {
    setMinutes(0);
    setSeconds(0);
    setMillis(0);
    setStopDisabled(true);
    setResetDisabled(true);
    setLastPause(null);
    cancelAnimationFrame(animationFrameId);
    setPrevTime(null);
  };

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
          className={`btn start ${run ? 'disabled' : ''}`}
          onClick={handleStartClick}
        >
          START
        </button>
        <button
          type="button"
          className={`btn stop ${stopDisabled ? 'disabled' : ''}`}
          onClick={handleStopClick}
        >
          STOP
        </button>
        <button
          type="button"
          className={`btn reset ${resetDisabled ? '' : 'disabled'}`}
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
