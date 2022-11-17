
import React, { useState, useEffect, Component, prevState, useRef } from 'react';
import SockJsClient from 'react-stomp';
import  { Redirect, Route } from 'react-router-dom';
var ReactCSSTransitionGroup = require('react-transition-group');

class Reg extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      status: false,
      name: '',
      country: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    if(event.target.name == "name") {
      this.setState({name: event.target.value});
    } else {
      this.setState({country: event.target.value});
    }
  }

  handleSubmit( event ) {

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.state)
    };

    fetch(process.env.REACT_APP_HOST + 'api/reg', requestOptions)
      .then(response => response.json())
      .then(data => localStorage.setItem("player_id", data.id))
      .then(() => this.setState({
        status: true
      }))

  }
  
  render() {

    return (
      <div>
        <div>
          <div>
            <p>Enter your name:</p>
            <input name="name" type="text" onChange={this.handleChange}></input>
          </div>
          <div>
            <p>Enter your cards:</p>
            <input name="country" type="text" onChange={this.handleChange}></input>
          </div>
          <div>
            <input type="submit" value="Submit" onClick={this.handleSubmit} />
          </div>
        </div>
      </div>
    )
  }
}

export default Reg;
