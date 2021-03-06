import React, { Component } from 'react';
import { updateBoard, checkWin, createMap } from '../algo/algo';
import Cell from './Cell';
import io from 'socket.io-client';
import NavCustom from './NavCustom';
import { Col, ProgressBar, Button, InputGroup, FormControl, Form } from 'react-bootstrap';
import { Card, Image, Progress, Input } from 'semantic-ui-react';
import { getRankBadge } from '../helper/helper';
import { SERVER_URL } from '../config/config';
import { markGameStart, updateBoardState, markTurn, markTurnNum, markGameEnd, markCurrentRoom, markStatus } from '../actions/actions';
import { connect } from 'react-redux';
import getUser from '../helper/getUser';

const mapStateToProps = state => {
	return {
		roomId: state.markCurrentRoom.roomId,
		isGameStarted: state.markCurrentRoom.isGameStarted,
		board: state.markCurrentRoom.board,
		isYourTurn: state.markCurrentRoom.isYourTurn,
		currTurn: state.markCurrentRoom.currTurn,
		isGameEnd: state.markCurrentRoom.isGameEnd,
		username: state.getUserInfo.user.username,
		userrank: state.getUserInfo.user.rank,
		creatorName: state.markCurrentRoom.creatorName,
		creatorRank: state.markCurrentRoom.creatorRank,
		status: state.markCurrentRoom.status,
		name: state.markCurrentRoom.name,
		watchLive: state.markWatchLive.watchLive
	}
}

const mapDispatchToProps = (disPatch) => {
	return {
		markGameStart: () => disPatch(markGameStart()),
		updateBoard: board => disPatch(updateBoardState(board)),
		markTurn: turnMark => disPatch(markTurn(turnMark)),
		markTurnNum: turnNum => disPatch(markTurnNum(turnNum)),
		markGameEnd: gameEnd => disPatch(markGameEnd(gameEnd)),
		markCurrentRoom: newRoom => disPatch(markCurrentRoom(newRoom)),
		markStatus: status => disPatch(markStatus(status))
	}
}
class BoardContainer extends Component {

	constructor(props) {
		super(props);
		// this.state = {
		// 	board: createMap(16, 19),
		// 	isGameStarted: false,
		// 	isYourTurn: false,
		// 	currTurn: null
		// }'
		this.state = {
			inputChatMesage: ''
		}

		let currUser = JSON.parse(getUser(localStorage.getItem('token')));
		this.user = currUser.id;
		this.roomId = this.props.roomId;
		this.socket = io(SERVER_URL, {
			query: { token: localStorage.getItem('token') }
		});

		this.opponent = null;
		// If you are player and creator name >< your username => opponent is creator
		if (this.props.creatorName !== undefined && this.props.username !== this.props.creatorName && !this.props.watchLive) {
			this.opponent = {
				username: this.props.creatorName,
				rank: this.props.creatorRank
			}
		}

		if (this.props.watchLive) {
			this.socket.emit('query-opponent', { 'roomId': this.roomId });
		}
		// let data = JSON.parse(getUser(localStorage.getItem('token')));
		// this.user = data.id;
		// console.log(data.id);
	}

	componentDidMount() {
		this.socket.on('start-game', (data) => {
			console.log('Emit game ack');
			if (this.opponent === null && !this.props.watchLive) {
				this.opponent = {
					username: data.joining.username,
					rank: data.joining.rank
				}
			}
			this.socket.emit('game-ack', {});
			this.props.markStatus(1);
		});

		this.socket.on('start-playing', (data) => {
			if (!this.props.isGameStarted) {
				this.props.markGameStart();
				this.props.markStatus(2);
			}
		})

		this.socket.on('turn', (data) => {
			console.log(data);
			let turnMark = false;
			if (data.updatedBoard) {
				this.props.updateBoard(data.updatedBoard);
			}

			if (data.gameEnd === 1) {
				this._updateNumWinOfPlayer('opponent-num-win');
				setTimeout(() => {
					this.props.markGameEnd(true);
					if (this.props.watchLive) {
						this.props.history.push('/');
					}
					console.log('GAME END FROM SERVER');
				}, 500);

			}
			else {
				if (data.firstTurn === 1) {
					if (this.user === data.user) {
						turnMark = true;
						console.log('You go first');
					}
				}
				else if (!this.props.watchLive) {
					turnMark = true;
				}
				// this.timeOut = setTimeout(() => {
				// 	alert('Game end');
				// }, 5000);
				console.log(this.timeOut);
			}
			this.props.markTurn(turnMark);
			this.props.markTurnNum(data.currTurn);
			//this._timePassForProgressBar();
		});

		this.socket.on('want-replay', (data) => {
			document.getElementById('replay-message').innerHTML = "Your's opponent want to replay";
		})

		console.log("COnstructor done");

		this.socket.on('other-disconnect', (data) => {
			this.opponent = null;
			if (this.props.status === 2) {
				this._updateNumWinOfPlayer('user-num-win');
			}
			if (this.props.watchLive) {
				this.props.history.push('/');
			}
			else {
				this.socket.emit('create-room', { 'oldRoomId': data.oldRoomId, 'roomName': this.props.name });
				let newRoom = {
					id: this.user,
					creatorName: this.props.username,
					creatorRank: this.props.userrank,
					name: 'New room',
					createdAt: new Date(),
					status: 0
				}
				this.props.markCurrentRoom(newRoom);
			}
		});

		// If watch live => need to get information of creator's opponent
		this.socket.on('opponent-live', (data) => {
			if (this.opponent === null && this.props.watchLive) {
				this.opponent = {
					username: data.username,
					rank: data.rank
				}
			}
		});

		this.socket.on('display-message', (data) => {
			if(!this.props.watchLive) {
				this._displayChatMessage(data.msg, 'opponent');
			}
		});
	}
	// componentDidMount() {
	// 	this.socket.emit('join', { 'roomId': this.roomId, 'user': this.user });
	// 	console.log("Event emitted");

	// }
	render() {
		return (
			<div className="background-img">
				<div className="background-color-effect-dark">
					<NavCustom></NavCustom>
					<div style={{ height: "100vh", width: "100%" }} className="board-body-container">
						<Card className="play-game-container" style={{ width: "140vmin", "height": "86vh" }}>
							<div className="opponent-time-progress-container">
								<div style={{ height: "22vmin", width: "100%", display: "flex", flexDirection: "row", alignItems: "flex-end" }}>
									<div id="play-user-info" className="play-user-info">
										<img style={{ height: "80%" }} src={getRankBadge(this.props.userrank)}></img>
										<div>
											<p className="play-game-username">{this.props.creatorName}</p>
											<div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
												<img style={{ height: "4vmin" }} src="/images/rank-logo.png"></img>
												<p className="play-game-userrank">{this.props.creatorRank}</p>
											</div>
										</div>
										{
											(this._decideTurnAnimation()) ?
												<div class="lds-dual-ring" style={{ marginLeft: "10px" }}></div>
												:
												<div></div>
										}
									</div>
									<div className="match-ratio">
										<p id="user-num-win" style={{ color: "#383834", fontSize: "200%", marginRight: "10%" }}>0</p>
										<p id="opponent-num-win" style={{ color: "#383834", fontSize: "200%" }}>0</p>
									</div>
									{
										(this.opponent !== null) ?
											<div id="play-opponent-info" className="play-opponent-info">
												{
													(this.props.isGameStarted && !this.props.isGameEnd && !this._decideTurnAnimation()) ?
														<div class="lds-dual-ring" style={{ marginLeft: "10px" }}></div>
														:
														<div></div>
												}
												<div>
													<p className="play-game-username">{this._decideOpponentInfo('name')}</p>
													<div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
														<img style={{ height: "4vmin" }} src="/images/rank-logo.png"></img>
														<p className="play-game-userrank">{this._decideOpponentInfo('rank')}</p>
													</div>
												</div>
												<img style={{ height: "80%" }} src={getRankBadge(this._decideOpponentInfo('rank'))}></img>
											</div>
											:
											<div id="play-opponent-info-waiting" className="play-opponent-info">
												<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
											</div>
									}
								</div>
								<Progress id="progress-bar" style={{ width: "100%" }} percent={45} color="teal" size="small" />
							</div>
							<div className="board-chat-container" style={{ border: "0", padding: "0" }}>
								<Col md={7.5} className="board" style={{ padding: "0", border: "0" }}>
									{
										(this.props.isGameEnd) ?
											(
												<div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
													<Button onClick={this._replayOnClick}>Play Again</Button>
													<p id="replay-message" style={{ color: "black", fontSize: "150%", fontWeight: "bold" }}></p>
												</div>
											)
											:
											<div>
												{
													(this.props.isGameStarted) ?
														this._renderBoard(this.props.board)
														:
														<div>
															<span className="number-countdown"></span>
														</div>
												}
											</div>
									}
								</Col>
								<Col md={3} className="room-name-chat-container" style={{ padding: 0 }}>
									<Card className="room-name-chat-container-card" style={{ width: "100%" }}>
										<Image style={{ maxHeight: "15vmin", width: "100%" }} src='/images/tic-tac-toe.png' fluid>
											<p className="board-room-name">{this.props.name}</p>
										</Image>
										<Card.Content>
											<Card.Header>
												<Button onClick={this._leaveRoom}>Leave</Button>
											</Card.Header>
										</Card.Content>
										<div className="chat-layout-container">
											<div className="chat-layout" id="chat-layout">
											</div>
											{
												(!this.props.watchLive) ?
													<Form style={{ marginTop: "2vmin" }} className="mb-3 chat-input">
														<Input
															style={{ maxWidth: "70%" }}
															action={{ content: 'Send', color: 'teal', onClick: (e) => this._sendChatMessage(e) }}
															placeholder="chat here"
															onChange={(e) => this._handleInputChatMessageChange(e)}
															value={ this.state.inputChatMesage }
														/>
													</Form>
													:
													<div></div>
											}							
										</div>
									</Card>
								</Col>
							</div>
						</Card>
					</div>
				</div>
			</div>
		);
	}

	_renderBoard = (m) => {
		if (m !== null) {
			return m.map((datarow, i) => (
				<div key={i} className="board-row">
					{
						datarow.map((cell, j) => (
							<Cell
								move={cell.move}
								isChoosen={cell.isChoosen}
								onClick={() => this._handleCellClick(m, i, j)}
								key={i * 19 + j + 1}
							>
							</Cell>
						))
					}
				</div>
			));
		}
		else {
			this.props.history.push('/');
		}
	}

	_handleCellClick = (m, i, j) => {
		if (this.props.isGameStarted && !this.props.isGameEnd && this.props.isYourTurn && m[i][j].move === null) {
			let move = (this.props.currTurn % 2 == 0) ? 'X' : 'O';
			let updatedBoard = updateBoard(m, i, j, move);
			//this.props.updateBoard(updatedBoard);
			// this.setState({
			// 	board: updatedBoard
			// });
			console.log(this.timeOut);
			clearTimeout(this.timeOut);
			this.timeOut = null;

			let gameEnd = checkWin(m, i, j, move) ? 1 : 0;

			this.socket.emit('play', { roomId: this.roomId, updatedBoard: updatedBoard, gameEnd: gameEnd });

			this.props.markTurn(false);

			// if (gameEnd === 1) {
			// 	alert('You won');
			// }
			if (gameEnd) {
				console.log('YOU WON');
				this._updateNumWinOfPlayer('user-num-win');
				setTimeout(() => {
					this.props.markGameEnd(true);
					console.log('GAME END FROM SERVER');
				}, 500);
			}
			// setTimeout(() => {

			// }, 500);
		}
	}

	_timePassForProgressBar = async () => {
		let progressBar = document.getElementById("progress-bar");
		let timePass = 0;
		let interval = setInterval(function () {
			timePass += 20;
			progressBar.props.now = timePass;
			if (timePass === 100) {
				window.clearInterval(interval);
				alert('You lose');
			}
		}, 1000);
	}

	_replayOnClick = () => {
		this.socket.emit('replay', {});
		this.props.markGameEnd(false);
		this.props.markTurn(false);
		this.props.markTurnNum(-1);
		this.props.updateBoard(createMap(16, 22));
	}

	_leaveRoom = () => {
		let msgBody = {id: this.props.roomId};
		if(this.props.watchLive) {
			msgBody.watchLive = true;
		}
		this.socket.emit('leave-room', msgBody);
		this.props.history.push('/');
	}

	_updateNumWinOfPlayer = (id) => {
		let numWin = document.getElementById(id);
		let currNumWin = parseInt(numWin.innerHTML);
		numWin.innerHTML = currNumWin + 1;
	}

	_decideOpponentInfo = (field) => {
		let info = null;
		if (field === 'name') {
			if (this.props.username !== this.props.creatorName) {
				if (this.props.watchLive) {
					info = this.opponent.username;
				}
				else {
					info = this.props.username;
				}
			}
			else {
				info = this.opponent.username;
			}
		}
		else if (field === 'rank') {
			if (this.props.username !== this.props.creatorName) {
				if (this.props.watchLive) {
					info = this.opponent.rank;
				}
				else {
					info = this.props.userrank;
				}
			}
			else {
				info = this.opponent.rank;
			}
		}
		return info;
	}

	_decideTurnAnimation = () => {
		let check = false;
		if (this.props.isGameStarted && !this.props.isGameEnd) {
			if (this.props.username === this.props.creatorName) {
				if (this.props.isYourTurn) {
					check = true;
				}
			}
			else if (this.props.watchLive) {
				if (this.props.currTurn % 2 === 0) {
					check = true;
				}
			}
			else if (!this.props.isYourTurn) {
				check = true;
			}
		}
		// else {
		// 	if (this.props.isGameStarted && !this.props.isGameEnd && this.props.isYourTurn && this.props.creatorName !== this.props.username) {
		// 		check = true;
		// 	}
		// }
		return check;
	}

	_sendChatMessage = (e) => {
		e.preventDefault();
		this.socket.emit('chat', {'msg': this.state.inputChatMesage});
		this._displayChatMessage(this.state.inputChatMesage, 'you');
		this.setState({
			inputChatMesage: ''
		});
	}

	_handleInputChatMessageChange = (e) => {
		this.setState({
			inputChatMesage: e.target.value
		});
	}

	_displayChatMessage = (message, user) => {
		let chatLayout = document.getElementById('chat-layout');
		let chatContent = document.createElement('p');
		chatContent.innerHTML = message;
		let chatItem = document.createElement('div');
		if(user === 'you') {
			chatItem.className = 'chat-item-user';
		}
		else {
			chatItem.className = 'chat-item';
		}
		chatItem.appendChild(chatContent);
		chatLayout.appendChild(chatItem);
	}
}

const Board = connect(mapStateToProps, mapDispatchToProps)(BoardContainer);
export default Board;
