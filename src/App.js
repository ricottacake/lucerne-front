import React from 'react';

import './App.css';

import Lobby from './Lobby';
import Join from './Join';
import Game from './Game';
import Main from './Main';
import Reg from './Reg';
import ChangeName from './ChangeName';
import SockJsClient from 'react-stomp';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

class App extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      Main: false,
      Lobby: false,
      Game: false,
      Join: false,
      ChangeName: false,
      playersInLobby: [],
      open: false,
      clientRef: null,
      sockjs: false,
      loggedIn: false
    }
    this.toggleChildMenu = this.toggleChildMenu.bind(this);

    this.lobbyElement = React.createRef();
    this.gameElement = React.createRef();
  }

  toggleChildMenu() {
     this.setState(state => ({
       open: true
     }));
  }

  setSocketListeners () {}

  getPID() {
    return localStorage.getItem("player_id");
  }

  componentDidMount () {

    if(!localStorage.getItem("player_id")) {
      this.setState({
        Main: false,
        loggedIn: true
      })
    }

    this.setState({
      sockjs: true,
    })
  }

  messageEngine(msg) {

    if(msg.type === "newGame" && msg.status === "ok") {

      this.setState({
        Main: false,
        Lobby: true,
        Game: false,
        Join: false
      });

      this.clientRef._subscribe("/topic/game/" + msg.data.id);
      this.lobbyElement.current.updatePlayersInLobby(msg.data);

    } else if(msg.type === "updatePlayersInLobby" && msg.status === "ok") {

      if(!this.state.Game) {
        this.setState({
          Main: false,
          Lobby: true,
          Game: false,
          Join: false
        });
      }
      this.clientRef._subscribe("/topic/game/" + msg.data.id);

      this.lobbyElement.current.updatePlayersInLobby(msg.data);

    } else if(msg.type === "startGame" && msg.status === "ok") {
      this.setState({
        Main: false,
        Lobby: false,
        Game: true,
        Join: false
      })
      this.gameElement.current.setFirstTwoDelaerCards(msg.data);

    } else if(msg.type === "nextMove" && msg.status === "ok") {

      this.gameElement.current.nextMove(msg.data);

    } else if(msg.type === "gameData" && msg.status === "ok") {

      this.gameElement.current.gameData(msg.data);

    } else if(msg.type === "endMove" && msg.status === "ok") {

      this.gameElement.current.endMove(msg.data);

    } else if(msg.type === "takeCard" && msg.status === "ok") {

      this.gameElement.current.takeCard(msg.data);

    } else if(msg.type === "dealerCard" && msg.status === "ok") {

      this.gameElement.current.pushDealerCard(msg.data);

    } else if(msg.type === "gameLog" && msg.status === "ok") {

      this.gameElement.current.renderLog(msg.data);

    } else if(msg.type === "resultGame" && msg.status === "ok") {

      this.gameElement.current.resultGame(msg.data);
    }
  }

  render() {

    const cr = {
      key : localStorage.getItem("player_id")
    }

    return (
      <div>
        <BrowserRouter>
          <Switch>

          <Route exact path="/change"><ChangeName /></Route>
          <Route exact path="/reg"><Reg /></Route>
          <Route exact path="/">

            {this.state.sockjs ?
              <SockJsClient
                    url={process.env.REACT_APP_HOST + "ws"}
                    topics={[ "/user/queue/reply", "/topic/all" ]}
                    onMessage={ (msg) => { this.messageEngine(msg); }}
                    ref={ (client) => {
                      this.clientRef = client
                    } }
                    headers = {cr}
                    options={{sessionId:() => {return this.getPID();}}}
                    onConnect={ () => {
                      this.setState({
                        Main: true,
                        loggedIn: false
                      })
                    }}
                  /> : "ERROR :("}

            {this.state.Main       ? <Main socket={this.clientRef} state={this} /> : ""}
            {this.state.Lobby      ? <Lobby socket={this.clientRef} state={this} ref={this.lobbyElement} /> : ""}
            {this.state.Game       ? <Game socket={this.clientRef} propsForStart={this.state.propsForStart} ref={this.gameElement} /> : ""}
            {this.state.Join       ? <Join status={this.state.open} state={this} socket={this.clientRef} /> : ""}
            {this.state.ChangeName ? <Redirect to="/change"/> : ""}
            {this.state.loggedIn   ? <Redirect to= "/reg" /> : ""}

          </Route>
        </Switch>
        </BrowserRouter>

      </div>
    );
  }
}

export default App;