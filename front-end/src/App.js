import React, { Component } from 'react';
import './App.css';
import Board from './components/Board';
import { BrowserRouter, Route } from 'react-router-dom'
import HomeTest from './components/HomeTest';
import Login from './components/Login';
import Ranking from './components/Ranking';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact path="/" component={HomeTest} />
          <Route path="/play/:roomId" component={Board} />
          <Route path="/login" component={Login}></Route>
          <Route path="/ranks" component={Ranking}></Route>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
