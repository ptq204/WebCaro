import React, { Component } from 'react';
import { Form, Button, Navbar, Nav, Col, Container, Row } from 'react-bootstrap';
import { Popup, Input } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import NavCustom from './NavCustom';
import { gameRooms, userInformation } from '../mock/data';
import { getRankBadge } from '../helper/helper';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { changeRoomList, getUserInfo, markCurrentRoom, changeInputRoomName, markWatchLive } from '../actions/actions';
import { SERVER_URL } from '../config/config';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import getUser from '../helper/getUser';

const mapStateToProps = state => {
  return {
    roomList: state.changeRoomList.roomList,
    userInfo: state.getUserInfo.user,
    currRoom: state.markCurrentRoom.roomId,
    inputRoomName: state.inputRoomName.roomName,
    watchLive: state.markWatchLive.watchLive,
    isLoggedOut: state.setLogOut.isLoggedOut
  }
}

const mapDispatchToProps = (disPatch) => {
  return {
    changeRoomList: roomList => disPatch(changeRoomList(roomList)),
    getUserInfo: user => disPatch(getUserInfo(user)),
    markCurrentRoom: roomItem => disPatch(markCurrentRoom(roomItem)),
    changeInputRoomName: roomName => disPatch(changeInputRoomName(roomName)),
    markWatchLive: watchLive => disPatch(markWatchLive(watchLive))
  }
}

class ConnectedHome extends Component {

  constructor(props) {
    //localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkNWUwZTJkZjc0OGY1NjkyNWEwMWZiMCIsImlhdCI6MTU2NjQ0NTEwMSwiZXhwIjoxNTY2NTMxNTAxfQ.-k1mJNs8s2Bf1-iWwuKxukxMCro5mT9yjExg4jjvB1I');
    super(props);
    this.socket = io(SERVER_URL, {
      query: { token: localStorage.getItem('token') }
    });
  }

  componentWillMount() {
    this._queryUserInformation();
  }

  componentDidMount() {
    this.socket.on('new-room', (data) => {
      let newRoom = {
        id: data.id,
        creatorName: data.creator.username,
        creatorRank: data.creator.rank,
        name: data.name,
        createdAt: data.createdAt,
        status: data.status
      }
      this.props.changeRoomList([...this.props.roomList, newRoom])
    });

    this.socket.on('room-created', (data) => {
      let createdRoom = {
        id: data.id,
        name: data.name,
        creatorName: this.props.userInfo.username,
        creatorRank: this.props.userInfo.rank,
        createdAt: new Date(),
        status: 0
      }
      this.props.markCurrentRoom(createdRoom);
      console.log(this.props.currRoom);
      this.props.history.push('/play');
    });

    this.socket.on('room-list', (data) => {
      console.log('ROOM LIST');
      let roomList = [];
      for (var key in data) {
        roomList.push({
          id: data[key].id,
          creatorName: data[key].creator.username,
          creatorRank: data[key].creator.rank,
          name: data[key].name,
          createdAt: data[key].createdAt,
          status: data[key].status
        });
      }
      this.props.changeRoomList(roomList);
    });

    this.socket.on('room-close', async (data) => {
      console.log('ROOM CLOSE ' + data.id);
      let roomList = [...this.props.roomList];
      await roomList.splice(roomList.findIndex(room => room.id === data.id), 1);
      //roomList.filter((room,index) => roomList.findIndex(room => room.id === data.id) !== index);
      this.props.changeRoomList(roomList);
    });

    this.socket.on('room-full', async (data) => {
      let roomList = [...this.props.roomList];
      let updateElement = function(rList, id){
        for(let i = 0; i < rList.length; i++) {
          if(rList[i].id === id) {
            rList[i].status = 1;
            break;
          }
        }
        return rList;
      }
      roomList = await updateElement(roomList, data.id);
      //roomList.filter((room,index) => roomList.findIndex(room => room.id === data.id) !== index);
      this.props.changeRoomList(roomList);
    });

    this.socket.on('room-start-playing', async (data) => {
      let roomList = [...this.props.roomList];
      let updateElement = function(rList, id){
        for(let i = 0; i < rList.length; i++) {
          if(rList[i].id === id) {
            rList[i].status = 2;
            break;
          }
        }
        return rList;
      }
      roomList = await updateElement(roomList, data.id);
      //roomList.filter((room,index) => roomList.findIndex(room => room.id === data.id) !== index);
      this.props.changeRoomList(roomList);
    });

    window.onclick = function (event) {
      let dialog = document.getElementById('room-name-input-dialog');
      if (event.target == dialog) {
        dialog.style.display = 'none';
      }
    }
  }

  render() {
    const token = localStorage.getItem('token');
    if (token && getUser(token) && !this.props.isLoggedOut) {
      return (
        <div className="background-img">
          <div className="background-color-effect-dark">
            <NavCustom></NavCustom>
            <div id="room-name-input-dialog" className="room-name-input-dialog">
              <div id="room-name-input-dialog-content" className="room-name-input-dialog-content">
                <Form style={{ minWidth: "80%" }}>
                  <Input
                    style={{ minWidth: "100%" }}
                    action={{ content: 'OK', color: 'teal', onClick: (e) => this._createNewGameRoom(e, this.props.inputRoomName) }}
                    placeholder="Enter room name"
                    onChange={(e) => this._handleChangeInputRoomName(e)}
                  />
                </Form>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div className="home-create-join-button-container">
                <Button style={{ marginRight: "20px", height: "40%" }} onClick={this._openRoomNameInputDialog}>Create room</Button>
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
                      <p className="user-rank-info-username">{this.props.userInfo.username}</p>
                      <p className="user-rank-info-rank">Rank: {this.props.userInfo.rank} pts</p>
                    </Col>
                    <Col xs={2} className="user-rank-info-badge-container">
                      <img style={{ height: "90%" }} src={getRankBadge(this.props.userInfo.rank)}></img>
                    </Col>
                  </Row>
                  <Row style={{ height: "60%" }}>
                    <Col xs={6} className="user-game-statistic-win-loss">
                      <div>
                        <p style={{ color: "#18BC9C", fontSize: "20px" }}>Win</p>
                        <p style={{ color: "white", fontSize: "25px", textAlign: "center" }}>{this.props.userInfo.win}</p>
                      </div>
                    </Col>
                    <Col xs={6} className="user-game-statistic-win-loss">
                      <div>
                        <p style={{ color: "#F33A3A", fontSize: "20px" }}>Loss</p>
                        <p style={{ color: "white", fontSize: "25px", textAlign: "center" }}>{this.props.userInfo.loss}</p>
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
    else {
      console.log('LOG OUT');
      return <Redirect to="/login"></Redirect>
    }
  }

  _renderRoomItem = (roomItem, i) => {
    return (
      <div key={i} className="room-item">
        <div style={{ width: "80%", display: "flex", alignItems: "center" }}>
          <div>
            <Popup trigger={<Link to={{ pathname: `/play`, state: { roomId: roomItem.id } }} className="room-item-name">{roomItem.name}</Link>}>
              {roomItem.id}
            </Popup>
            <p className="room-item-creator">{roomItem.creatorName}</p>
            <p className="room-item-created-at">{roomItem.createdAt}</p>
          </div>
        </div>
        <div className="room-item-join-button">
        {
          (roomItem.status === 0) ?
          <Button style={{ backgroundColor: "#18BC9C", border: "solid #18BC9C" }} onClick={() => this._joinRoom(roomItem)}>Join</Button>
          :
          ((roomItem.status === 2) ?
            <Button style={{ backgroundColor: "#858f8c", border: "solid #858f8c" }} onClick={() => this._watchLiveRoom(roomItem)}>Live</Button>
            :
            <div></div>
          )
        }
        </div>
      </div>
    );
  }

  // Create new room ('create-room', {roomName: String})
  _createNewGameRoom = (e, roomName) => {
    e.preventDefault();
    this.props.changeInputRoomName('');
    this.socket.emit('create-room', { 'roomName': roomName });
  }

  _queryUserInformation = () => {
    axios({
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
      },
      method: 'GET',
      url: `${SERVER_URL}/users/info`
    }).then(res => {
      if (res) {
        console.log(res);
        const resInfo = JSON.stringify(res.data);
        const data = JSON.parse(resInfo);
        if (data) {
          console.log(data);
          this.props.getUserInfo(data);
        }
      }
    }).catch(err => {
      console.log(err);
    });
  }

  _joinRoom = (roomItem) => {
    this.props.markCurrentRoom(roomItem);
    this.socket.emit('join', { 'roomId': roomItem.id });
    this.props.markWatchLive(false);
    this.props.history.push('/play');
  }

  _watchLiveRoom = (roomItem) => {
    this.props.markCurrentRoom(roomItem);
    this.props.markWatchLive(true);
    this.socket.emit('join', { 'roomId': roomItem.id });
    this.props.history.push('/play');
  }

  _openRoomNameInputDialog = () => {
    let dialog = document.getElementById('room-name-input-dialog');
    dialog.style.display = 'block';
  }

  _handleChangeInputRoomName = (e) => {
    this.props.changeInputRoomName(e.target.value);
  }
}

const Home = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConnectedHome);

export default Home;