
import React, { useState, useEffect, Component, prevState, Fragment } from 'react';

class Countdown extends React.Component {
  
  render() {
    if(this.props.result == "win") {
      return(
        <h1>YOU WIN!</h1>
      )
    } else {
      return(
        <h1>YOU LOSE!</h1>
      )
    }
  }
}

export default Countdown;
