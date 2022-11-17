
import React from 'react';
import  { Redirect, Route } from 'react-router-dom';

const PORT = 8080;
const HOST = "http://localhost:8080"

class ChangeName extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      newName: null,
      isChange: false
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({newName: event.target.value})
  }

  handleSubmit(event) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({playerId: localStorage.getItem("player_id"), newName: this.state.newName})
    };

    fetch(process.env.REACT_APP_HOST + 'api/change', requestOptions)
      .then(data => {
        this.setState({
          isChange: true
        })
      })
  }

  render() {

    if(this.state.isChange) {
      return <Redirect to="/flsakmdfmkasdmklfmkasd" />
    }
    return(

      <div>
        <label>
          Name:
          <input type="text" onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" onClick={this.handleSubmit} />

      </div>
    )
  }
}

export default ChangeName;
