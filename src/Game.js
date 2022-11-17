import React, { useState, useEffect, Component, prevState, Fragment } from 'react';
import './App.css';
import Congratulation from './Congratulation';
import './Game.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import md5 from 'crypto-js/md5';

class Game extends React.Component {

  card_to_number = {
    'ace'   : 11,
    'two'   : 2,
    'three' : 3,
    'four'  : 4,
    'five'  : 5,
    'six'   : 6,
    'seven' : 7,
    'eight' : 8,
    'nine'  : 9,
    'ten'   : 10,
    'jack'  : 2,
    'queen' : 3,
    'king'  : 4
  }

  constructor(props) {
    super(props);

    this.state = {
      playerCards: [],
      delaerCards: [],
      lose: false,
      some_one_lose: false,
      your_move: false,
      gameResult: false,
      sumCards: 0,
      logs: []
    };
  }

  getCountFromCard(cardName) {
    var arr = new Map([
      ['ACE', 11],
      ['TWO', 2],
      ['THREE', 3],
      ['FOUR', 4],
      ['FIVE', 5],
      ['SIX', 6],
      ['SEVEN', 7],
      ['EIGHT', 8],
      ['NINE', 9],
      ['TEN', 10],
      ['JACK', 2],
      ['QUEEN', 3],
      ['KING', 4]

    ]);
    return arr.get(cardName);
  }


  setFirstTwoDelaerCards = (dealerCards) => {
    this.setState({
      delaerCards: [{"url" : "/cards/" + dealerCards.card1 + ".png", "key" : Math.floor(Math.random() * 500)},
                    {"url" : "/cards/" + dealerCards.card2 + ".png", "key" : Math.floor(Math.random() * 500)}]
    })
  }

  nextMove = (data) => {
    if(data.playerId == md5(localStorage.getItem("player_id")).toString()) {
      this.setState({
        your_move: true
      })
    } else {
      this.setState({
        your_move: false
      })
    }
  }

  endMove = (data) => {
    this.setState({
      your_move: false
    })
  }

  takeCard = (data) => {

    this.state.playerCards.push({"url" : "/cards/" + data.card + ".png", "key" : Math.floor(Math.random() * 500)});

    this.setState({
      playerCards: this.state.playerCards,
      sumCards: this.state.sumCards + this.getCountFromCard(data.card)
    })

    if(this.state.sumCards > 21) {
      this.setState({
        your_move:false
      })
    }
  }

  gameData = (data) => {
    if(!data.timeIsOk) {
      this.setState({
        your_move:false
      })
    }
  }

  handleAddingDivs () {
    this.setState({count: this.state.count + 1})
  }

  youLose () {
    if(this.state.count) {
      return <div className="lose">ВЫ ПЕРЕБРАЛИ :(</div>;
    }
  }

  pushDealerCard(data) {

    this.state.delaerCards.push({"url" :  "/cards/" + data.card + ".png", "key" : Math.floor(Math.random() * 500)})
    this.setState({
      delaerCards: this.state.delaerCards
    })
  }

  takeACard = () => {
    const query = {
      status: "ok",
      type: "playerQuery",
      data: {
        type: "add",
      }
    }
    this.props.socket.sendMessage("/app/transferGameData", JSON.stringify(query));
  }

  resultGame = (data) => {

    data.players.forEach((player) => {
      if(player.user.publicId == md5(localStorage.getItem("player_id"))) {

        if(player.result) {
          this.setState({
            gameResult: "win"
          })
        } else {
          this.setState({
            gameResult: "lose"
          })
        }
      }
    });
  }

  renderLog = (data) => {
    var logType = data.type;
    var playerId = data.publicId;
    var name = data.name;

    if(logType == "OVER") {
      var result = name + " перебрал";

      this.setState({
        logs: this.state.logs
      })
    }
  }

  enough = () => {
    this.setState({
      your_move:false
    })

    const query = {
      status: "ok",
      type: "playerQuery",
      data: {
        type: "enough"
      }
    }
    this.props.socket.sendMessage("/app/transferGameData", JSON.stringify(query));
  }

  render() {

    const { gameResult } = this.state;


    return (

      <div>
        {gameResult && <Congratulation result={gameResult} />}
        <h1 className="display-4 mx-auto m-4 ">Lucerne</h1>

          <div class="own">
            {this.state.logs.map(string => (
              <div class="action">
                <p>{string}</p>
              </div>
            ))}

          </div>


        <div style={{textAlign:"center"}}><h3>DEALER CARDS</h3></div>

        <TransitionGroup className="scrollmenu">
          {this.state.delaerCards.reverse().map((el, val) => (
            <CSSTransition key={el.key} timeout={2000} classNames="item">
            <div className="v1">
              <img src={el.url} className="card-img-top" alt="Max-width 180px" />
            </div>
            </CSSTransition>
          ))}
        </TransitionGroup>

      <div className="v2 container i-am-centered">

        <div className="row justify-content-center">

          <div className="container">
            <div className="row justify-content-center">
              <h3>YOUR CARDS</h3>
            </div>
          </div>

          <div className="container">
            {this.youLose()}
            {this.state.your_move ? <div className="take_a_card mdc-button mdc-button--raised" onClick={this.takeACard}><span className="chooser mdc-button__label">MORE...</span></div> : null}
            {this.state.your_move ? <div className="take_a_card mdc-button mdc-button--raised" onClick={this.enough}><span className="chooser mdc-button__label">ENOUGH</span></div> : null}
          </div>
            <TransitionGroup className="scrollmenu">
            {this.state.playerCards.reverse().map((el, val) => (
              <CSSTransition key={el.key} timeout={500} classNames="item">
                <div className="v1">
                  <img src={el.url} className="card-img-top" alt="Max-width 180px" />
                </div>
                </CSSTransition>
            ))}
          </TransitionGroup>
        </div>
      </div>
    </div>
    )
  }
}

export default Game;