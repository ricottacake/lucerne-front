
import React, { useState, useEffect, Component, prevState, useRef } from 'react';
import SockJsClient from 'react-stomp';
var ReactCSSTransitionGroup = require('react-transition-group');

class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  toggleNewGame = () => {
    const query = {
      status: "ok",
      type: "newGame",
      data: ""
    }
    this.props.socket.sendMessage("/app/newGame", JSON.stringify(query));
  }

  toggleJoinGame = () => {

    this.props.state.setState({
      Main: false,
      Lobby: false,
      Game: false,
      Join: true
    });
  }

  toggleChangeName = () => {

    this.props.state.setState({
      Main: false,
      Lobby: false,
      Game: false,
      Join: false,
      ChangeName: true
    });
  }

  MainActions = {
    elements: [
      {
        id: "new_game",
        title: "NEW GAME",
        onClick: this.toggleNewGame
      },
      {
        id: "join_game",
        title: "JOIN GAME",
        onClick: this.toggleJoinGame
      },
      {
        id: "change_name",
        title: "CHANGE NAME",
        onClick: this.toggleChangeName
      },
    ]
  };

  render() {
    const { elements } = this.MainActions;


    return (
      <div key="K" className="choosecontainer">

        {elements.map(el => (
          <div className="mainChooser">
              <button className="mdc-button mdc-button--raised">
                <span className="mdc-button__label"><p key={el.id} onClick={el.onClick} className="MainButton">{el.title}</p></span>
              </button>
          </div>
        ))}
      </div>
    )
  }
}

export default Main;
