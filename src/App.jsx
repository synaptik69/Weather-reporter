import React, { useState, useEffect } from 'react';
import './assets/css/style.css';

function App() {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [millis, setMillis] = useState(0);
  const [run, setRun] = useState(false);
  const [stopDisabled, setStopDisabled] = useState(true);
  const [resetDisabled, setResetDisabled] = useState(true);
  const setPauses = useState([]);
  const [lastPause, setLastPause] = useState(null);

  const zeroPad = (value) => (value < 10 ? `0${value}` : value);

  useEffect(() => {
    let timer = null;

    if (run) {
      timer = setInterval(() => {
        setMillis((prevMillis) => {
          let updatedMillis = prevMillis + 2;
          let updatedSeconds = seconds;
          let updatedMinutes = minutes;

          if (updatedMillis >= 100) {
            updatedSeconds += Math.floor(updatedMillis / 100);
            updatedMillis %= 100;
          }

          if (updatedSeconds >= 60) {
            updatedMinutes += Math.floor(updatedSeconds / 60);
            updatedSeconds %= 60;
          }

          setSeconds(updatedSeconds);
          setMinutes(updatedMinutes);

          return updatedMillis;
        });
      }, 20);
    }

    return () => {
      clearInterval(timer);
    };
  }, [run, minutes, seconds]);

  const handleStartClick = () => {
    setRun(true);
    setStopDisabled(false);
    setResetDisabled(true);
  };

  const handleStopClick = () => {
    setRun(false);
    setStopDisabled(true);
    setResetDisabled(false);
    setLastPause({
      minutes,
      seconds,
      millis,
    });
  };

  const handleResetClick = () => {
    setMinutes(0);
    setSeconds(0);
    setMillis(0);
    setStopDisabled(true);
    setResetDisabled(true);
    setPauses([]);
    setLastPause(null);
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
