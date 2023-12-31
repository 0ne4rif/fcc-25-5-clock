import React from "react";
import TimerSetter from "./TimerSetter";

const accurateInterval = function (fn, time) {
  var cancel, nextAt, timeout, wrapper;
  nextAt = new Date().getTime() + time;
  timeout = null;
  wrapper = function () {
    nextAt += time;
    timeout = setTimeout(wrapper, nextAt - new Date().getTime());
    return fn();
  };
  cancel = function () {
    return clearTimeout(timeout);
  };
  timeout = setTimeout(wrapper, nextAt - new Date().getTime());
  return {
    cancel: cancel,
  };
};

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      timerState: "stopped",
      timerType: "Session",
      timer: 1500,
      intervalID: "",
      alarmColor: { color: "white" },
    };
    this.setLength = this.setLength.bind(this);
    this.lengthControl = this.lengthControl.bind(this);
    this.timerControl = this.timerControl.bind(this);
    this.startCountDown = this.startCountDown.bind(this);
    this.decrementTimer = this.decrementTimer.bind(this);
    this.phaseControl = this.phaseControl.bind(this);
    this.warning = this.warning.bind(this);
    this.buzzer = this.buzzer.bind(this);
    this.switchTimer = this.switchTimer.bind(this);
    this.clockify = this.clockify.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
  }

  setLength(type, e) {
    const typeLength = `${type.toLowerCase()}Length`;
    const currentLength = this.state[typeLength];
    const timerType = type === "Break" ? "Session" : "Break";

    this.lengthControl(
      typeLength,
      e.currentTarget.value,
      currentLength,
      timerType
    );
  }

  lengthControl(stateToChange, sign, currentLength, timerType) {
    if (this.state.timerState === "running") {
      return;
    }
    if (this.state.timerType === timerType) {
      if (sign === "-" && currentLength !== 1) {
        this.setState({ [stateToChange]: currentLength - 1 });
      } else if (sign === "+" && currentLength !== 60) {
        this.setState({ [stateToChange]: currentLength + 1 });
      }
    } else if (sign === "-" && currentLength !== 1) {
      this.setState({
        [stateToChange]: currentLength - 1,
        timer: currentLength * 60 - 60,
      });
    } else if (sign === "+" && currentLength !== 60) {
      this.setState({
        [stateToChange]: currentLength + 1,
        timer: currentLength * 60 + 60,
      });
    }
  }

  timerControl() {
    if (this.state.timerState === "stopped") {
      this.startCountDown();
      this.setState({ timerState: "running" });
    } else {
      this.setState({ timerState: "stopped" });
      if (this.state.intervalID) {
        this.state.intervalID.cancel();
      }
    }
  }

  startCountDown() {
    this.setState({
      intervalID: accurateInterval(() => {
        this.decrementTimer();
        this.phaseControl();
      }, 1000),
    });
  }

  decrementTimer() {
    this.setState({ timer: this.state.timer - 1 });
  }
  
  phaseControl() {
    let timer = this.state.timer;
    this.warning(timer);
    this.buzzer(timer);
    if (timer < 0) {
      if (this.state.intervalID) {
        this.state.intervalID.cancel();
      }
      if (this.state.timerType === "Session") {
        this.startCountDown();
        this.switchTimer(this.state.breakLength * 60, "Break");
      } else {
        this.startCountDown();
        this.switchTimer(this.state.sessionLength * 60, "Session");
      }
    }
  }

  warning(_timer) {
    if (_timer < 61) {
      this.setState({ alarmColor: { color: "#a50d0d" } });
    } else {
      this.setState({ alarmColor: { color: "white" } });
    }
  }

  buzzer(_timer) {
    if (_timer === 0) {
      this.alarm.play();
    }
  }

  switchTimer(num, str) {
    this.setState({
      timer: num,
      timerType: str,
      alarmColor: { color: "white" },
    });
  }

  clockify() {
    if (this.state.timer < 0) return "00:00";
    let minutes = Math.floor(this.state.timer / 60);
    let seconds = this.state.timer - minutes * 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return minutes + ":" + seconds;
  }

  resetTimer() {
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      timerState: "stopped",
      timerType: "Session",
      timer: 1500,
      intervalID: "",
      alarmColor: { color: "white" },
    });
    if (this.state.intervalID) {
      this.state.intervalID.cancel();
    }
    this.alarm.pause();
    this.alarm.currentTime = 0;
  }
  
  render() {
    return (
      <div>
        <div>25 + 5 Clock</div>
        <TimerSetter
          addID="break"
          length={this.state.breakLength}
          lengthID="break"
          minID="break"
          onClick={(e) => this.setLength("Break", e)}
          title="Break"
          titleID="break"
        />
        <TimerSetter
          addID="session"
          length={this.state.sessionLength}
          lengthID="session"
          minID="session"
          onClick={(e) => this.setLength("Session", e)}
          title="Session"
          titleID="session"
        />
        <div style={this.state.alarmColor}>
          <div>
            <div id="timer-label">{this.state.timerType}</div>
            <div id="time-left">{this.clockify()}</div>
          </div>
        </div>
        <button
          className="btn btn-dark"
          id="start_stop"
          onClick={this.timerControl}
        >
          {this.state.timerState === "running" ? "Pause" : "Play"}
        </button>
        <button className="btn btn-dark" id="reset" onClick={this.resetTimer}>
          Reset
        </button>

        <audio
          id="beep"
          preload="auto"
          ref={(audio) => {
            this.alarm = audio;
          }}
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        />
      </div>
    );
  }
}

export default Timer;
