import React, { Component } from 'react';
import { Form, Button, Navbar, Nav, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NavCustom from './NavCustom';
import { gameRooms, userInformation } from '../mock/data';
import { getRankBadge } from '../helper/helper';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { changeRoomList, getUserInfo } from '../actions/actions';
import { SERVER_URL } from '../config/config';
import axios from 'axios';

const mapStateToProps = state => {
  return {
    roomList: state.changeRoomList.roomList,
    userInfo: state.getUserInfo.user
  }
}

const mapDispatchToProps = (disPatch) => {
  return {
    changeRoomList: roomList => disPatch(changeRoomList(roomList)),
    getUserInfo: user => disPatch(getUserInfo(user))
  }
}

class ConnectedHome extends Component {

  constructor(props) {
    //localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkNWUwZTJkZjc0OGY1NjkyNWEwMWZiMCIsImlhdCI6MTU2NjQ0NTEwMSwiZXhwIjoxNTY2NTMxNTAxfQ.-k1mJNs8s2Bf1-iWwuKxukxMCro5mT9yjExg4jjvB1I');
    super(props);
    this.socket = io(SERVER_URL, {
      query: {token: localStorage.getItem('token')}
    });
  }

  componentWillMount() {
    this._queryUserInformation();
  }

  componentDidMount() {
    this.socket.on('new-room', (data) => {
      let newRoom = {
        roomId: data.id,
        roomName: 'room03',
        creatorName: 'ptquyen'
      }
      this.props.changeRoomList([...this.props.roomList, newRoom])
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
                    <p className="user-rank-info-username">{this.props.userInfo.username} KKK</p>
                    <p className="user-rank-info-rank">Rank: {this.props.userInfo.rank} pts</p>
                  </Col>
                  <Col xs={2} className="userhttp://10.200.232.42:4000-rank-info-badge-container">
                    <img style={{ height: "90%" }} src={getRankBadge(this.props.userInfo.rank)}></img>
                  </Col>
                </Row>
                <Row style={{ height: "60%" }}>
                  <Col xs={6} className="user-game-statistic-win-loss">
                    <div>
                      <p style={{ color: "#18BC9C", fontSize: "20px" }}>Win</p>
                      <p style={{ color: "white", fontSize: "25px" }}>{this.props.userInfo.win}</p>
                    </div>
                  </Col>
                  <Col xs={6} className="user-game-statistic-win-loss">
                    <div>
                      <p style={{ color: "#F33A3A", fontSize: "20px" }}>Loss</p>
                      <p style={{ color: "white", fontSize: "25px" }}>{this.props.userInfo.loss}</p>
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

  _queryUserInformation  = () => {
    axios({
      headers: {
        Authentication: `Bearer ${localStorage.getItem('token')}`
      },
      method: 'GET',
      url: `${SERVER_URL}/users/info`
    }).then(res => {
      if(res) {
        const resInfo = JSON.stringify(res.data);
        const data = JSON.parse(resInfo);
        if(data) {
          console.log(data);
          this.props.getUserInfo(data);
        }
      }
    }).catch(err => {
      console.log(err);
    });
  }
}

const Home = connect(
  mapStateToProps,
  mapDispatchToProps,
  )(ConnectedHome);

export default Home;