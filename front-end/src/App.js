import React, { Component } from 'react';
import './App.css';
import Board from './components/Board';
import { BrowserRouter, Route } from 'react-router-dom'
import Home from './components/Home';
import Login from './components/Login';
import Ranking from './components/Ranking';
import { Navbar, Nav } from 'react-bootstrap';
import Register from './components/Register';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact path="/" component={Home} />
          <Route path="/play" component={Board} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/ranks" component={Ranking} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
