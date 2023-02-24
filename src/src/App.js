import React from 'react';
import './assets/css/style.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      minutes: 0,
      seconds: 0,
      millis: 0,
      running: false,
      text: ""
    };
    this._handleStartClick = this._handleStartClick.bind(this);
    this._handleResetClick = this._handleResetClick.bind(this);
    this._handleStopClick = this._handleStopClick.bind(this);
  }

  _handleStartClick() {
    if (!this.state.running) {
      this.interval = setInterval(() => {
        this.tick();
      }, 100);
      this.setState({ running: true });
    }
  }

  _handleStopClick() {
    if (this.state.running) {
      clearInterval(this.interval);
      this.setState({ running: false });
      this.text = "Pause : "+this.state.minutes+"min "+this.state.seconds+"sec "+this.state.millis;
    }
  }

  _handleResetClick() {
    this._handleStopClick();
    this.setState({
      millis: 0,
      seconds: 0,
      minutes: 0
    });
  }

  tick() {
    let millis = this.state.millis + 10;
    let seconds = this.state.seconds;
    let minutes = this.state.minutes;

    if (millis === 100) {
      millis = 0;
      seconds = seconds + 1;
    }
    if (seconds === 60) {
      millis = 0;
      seconds = 0;
      minutes = minutes + 1;
    }
    this.setState({
      millis: millis,
      seconds: seconds,
      minutes: minutes
    });
  }

  zeroPad(value) {
    return value < 10 ? `0${value}` : value;
  }

  render() {
    let run = this.state.running === true;
    let stopDisabled = false === run;
    let resetDisabled = (true === run || (false === run && (this.state.millis > 0 || this.state.seconds > 0 || this.state.minutes > 0)));
    return(
      <div className="wrapper">
        <header>Chronomètre</header>
        <div className="display">
          <div className="numbers">
            <span className="mins">{this.zeroPad(this.state.minutes)}:</span>
            <span className="secs">{this.zeroPad(this.state.seconds)}:</span>
            <span className="millis">{this.zeroPad(this.state.millis)}</span>
          </div>
        </div>
        <div className="actions">
          <button
            className={"btn start " + (run ? 'disabled' : '')}
            onClick={this._handleStartClick}>START
          </button>
          <button
            className={"btn stop " + (stopDisabled ? 'disabled' : '')}
            onClick={this._handleStopClick}>STOP
          </button>
          <button
            className={"btn reset " + (resetDisabled ? '' : 'disabled')}
            onClick={this._handleResetClick}>RESET
          </button>
          <p className="dernierePause">{this.text}</p>
        </div>
        <p>Découvrez aussi mon chronomètre développé en C++ <a href="https://github.com/PouletEnSlip/Chronometer" target="_blank" rel="noreferrer">ici</a>.</p>
      </div>
    );
  }
}
