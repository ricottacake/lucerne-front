

import React, { useState, useEffect, Component, prevState } from 'react';
import io from 'socket.io-client'
import Welcome from './Welcome'

class Join extends React.Component {

  constructor(props) {
    super(props);

    this.state = {};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: parseInt(event.target.value)});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.joinGame(this.state.value);
  }

  joinGame = (joinGame) => {

    const query = {
      status: "ok",
      type: "joinGame",
      data: joinGame
    }

    this.props.socket.sendMessage("/app/joinGame", JSON.stringify(query));
  }

  render() {

    return (

      <div>
        {this.props.status ? <Welcome /> : null}
        <form onSubmit={this.handleSubmit}>
          <input onChange={this.handleChange}></input>
          <input type="submit" value="Submit" />
        </form>
      </div>

    );
  }
}

export default Join;
