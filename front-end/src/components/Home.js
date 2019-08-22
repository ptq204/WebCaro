import React, { Component } from 'react';
import { Form, Button, Navbar, Nav, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NavCustom from './NavCustom';
import { gameRooms, userInformation } from '../mock/data';
import { getRankBadge } from '../helper/helper';

class Home extends Component {

  constructor(props) {
    super(props);
    this.socket = io('http://10.200.232.42:4000');
    this.state = {
      gameRooms: gameRooms
    }
  }

  componentDidMount() {
    this.socket.on('new-room', (data) => {
      let newRoom = {
        roomName: 'room03',
        roomId: data.detail.id,
        creator: data.detail.id,
        creatorName: data.detail.id,
        createdAt: "Thu Aug 15 2019 09:40:23",
      }
      this.setState({
        gameRooms: [...gameRooms, newRoom]
      });
    });
  }

  render() {
    return (
      <div className="background-img">
        <div className="background-color-effect-dark">
          <NavCustom></NavCustom>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="home-create-join-button-container">
              <Button style={{ marginRight: "20px", height: "40%" }} onClick={this._createNewGameRoom}>Create room</Button>
              <Button style={{ height: "40%" }}>Join random</Button>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="room-list-container" style={{ width: "140vmin", padding: "0", border: "0" }}>
              <Col md={8.5} className="room-list-container-scroll">
                <div className="room-list">
                  {
                    this.state.gameRooms.map((roomItem, index) => {
                      return this._renderRoomItem(roomItem, index);
                    })
                  }
                </div>
              </Col>
              <Col md={4} className="user-info">
                <Row className="user-rank-info-container">
                  <Col xs={10} className="user-rank-info">
                    <p className="user-rank-info-username">{userInformation.username} KKK</p>
                    <p className="user-rank-info-rank">Rank: {userInformation.rank} pts</p>
                  </Col>
                  <Col xs={2} className="user-rank-info-badge-container">
                    <img style={{ height: "90%" }} src={getRankBadge(userInformation.rank)}></img>
                  </Col>
                </Row>
                <Row style={{ height: "60%" }}>
                  <Col xs={6} className="user-game-statistic-win-loss">
                    <div>
                      <p style={{ color: "#18BC9C", fontSize: "20px" }}>Win</p>
                      <p style={{ color: "white", fontSize: "25px" }}>{userInformation.winCount}</p>
                    </div>
                  </Col>
                  <Col xs={6} className="user-game-statistic-win-loss">
                    <div>
                      <p style={{ color: "#F33A3A", fontSize: "20px" }}>Loss</p>
                      <p style={{ color: "white", fontSize: "25px" }}>{userInformation.lossCount}</p>
                    </div>
                  </Col>
                </Row>
              </Col>
            </div>
          </div>
        </div>
      </div>
    );
  }

  _renderRoomItem = (roomItem, i) => {
    return (
      <div className="room-item">
        <div style={{ width: "183px" }}>
          <Link to={{ pathname: `/play/${roomItem.roomId}`, state: { roomId: roomItem.roomId } }} className="room-item-name">{roomItem.roomName}</Link>
          <p className="room-item-creator">{roomItem.creatorName}</p>
          <p className="room-item-created-at">1 minute ago</p>
        </div>
        <div className="room-item-join-button">
          <Button style={{ backgroundColor: "#18BC9C", border: "solid #18BC9C" }}>Join</Button>
        </div>
      </div>
    );
  }

  _createNewGameRoom = () => {
    var roomName = 'room03';
    this.socket.emit('create-room', {'roomName': roomName, 'user': 'ptquyen'});
  }
}

export default Home;