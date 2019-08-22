import React, { Component } from 'react';
import { Form, Button, Navbar, Nav, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NavCustom from './NavCustom';
import { gameRooms, userInformation } from '../mock/data';
import { getRankBadge } from '../helper/helper';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { changeRoomList } from '../actions/actions';

const mapRoomListStateToProps = state => {
  return {roomList: state.changeRoomList.roomList}
}

const mapDispatchRoomListToProps = (disPatch) => {
  return {
    changeRoomList: roomList => disPatch(changeRoomList(roomList))
  }
}

class ConnectedHome extends Component {

  constructor(props) {
    localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkNWUwZTJkZjc0OGY1NjkyNWEwMWZiMCIsImlhdCI6MTU2NjQ0NTEwMSwiZXhwIjoxNTY2NTMxNTAxfQ.-k1mJNs8s2Bf1-iWwuKxukxMCro5mT9yjExg4jjvB1I');
    super(props);
    this.socket = io('http://192.168.122.1:4000', {
      query: {token: localStorage.getItem('token')}
    });
  }

  componentDidMount() {
    // this.socket.on('new-room', (data) => {
    //   let newRoom = {
    //     roomName: 'room03',
    //     roomId: data.detail.id,
    //     creator: data.detail.id,
    //     creatorName: data.detail.id,
    //     createdAt: "Thu Aug 15 2019 09:40:23",
    //   }
    //   this.setState({
    //     gameRooms: [...gameRooms, newRoom]
    //   });
    // });
  }

  render() {
    return (
      <div className="background-img">
        <div className="background-color-effect-dark">
          <NavCustom></NavCustom>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="home-create-join-button-container">
              <Button style={{ marginRight: "20px", height: "40%" }} onClick={this._createNewGameRoom}>Create room</Button>
              <Button style={{ height: "40%" }} onClick={() => this.props.changeRoomList(gameRooms)}>Join random</Button>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="room-list-container" style={{ width: "140vmin", padding: "0", border: "0" }}>
              <Col md={8.5} className="room-list-container-scroll">
                <div className="room-list">
                  {
                    this.props.roomList.map((roomItem, index) => {
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
                    uth.js        </Col>
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
        <div style={{ width: "50%" }}>
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

  // Create new room ('create-room', {roomName: String})
  _createNewGameRoom = () => {
    var roomName = 'room03';
    this.socket.emit('create-room', {'roomName': roomName});
  }
}

const Home = connect(mapRoomListStateToProps, mapDispatchRoomListToProps)(ConnectedHome);

export default Home;