

import React, { useState, useEffect, Component, prevState } from 'react';

class Lobby extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      playersInLobby: [],
      joinCode: null
    }
  }

  updatePlayersInLobby = (data) => {
    this.setState({
      playersInLobby: data.players,
      joinCode: data.id
    })
  }

  send() {
    const query = {
      status: "ok",
      type: "playerQuery",
      data: {
        type: "start",
        playerId: localStorage.getItem("player_id")
      }
    }
    this.props.socket.sendMessage("/app/transferGameData", JSON.stringify(query));
  }

  render() {

    const elements = this.props.data;
    const ps = this.state.playersInLobby.map((data) =>

      <div>
        <p>{data.user.name}</p>
      </div>
    );

    return (
      <div className="lobby-window">
        <p>CODE FOR JOIN ANOTHER PLAYERS:</p> <p>{this.state.joinCode}</p>
      <div>
        <p>Players:</p>
        {ps}
      </div>
        <button className="mdc-button mdc-button--raised">
          <span className="mdc-button__label"><p className="MainButton" onClick={() => this.send()}>Start</p></span>
        </button>
      </div>
    );
  }
}

export default Lobby;
