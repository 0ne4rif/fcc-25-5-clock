import React from "react";

class TimerSetter extends React.Component {
    render() {
      return (
        <div className="length-control">
          <div
            id={`${this.props.titleID}-label`}
          >{`${this.props.title} Length`}</div>
          <button
            className="timer-interval"
            id={`${this.props.minID}-decrement`}
            onClick={this.props.onClick}
            value="-"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-arrow-down"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"
              />
            </svg>
          </button>
          <div className="timer-label" id={`${this.props.lengthID}-length`}>
            {this.props.length}
          </div>
          <button
            className="timer-interval"
            id={`${this.props.addID}-increment`}
            onClick={this.props.onClick}
            value="+"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-arrow-up"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"
              />
            </svg>
          </button>
        </div>
      );
    }
  }

  export default TimerSetter;