import React, { Component } from 'react';
import { createMap, updateBoard, checkWin } from '../algo/algo';
import Cell from './Cell';
import io from 'socket.io-client';
import uuidv4 from 'uuid/v4';
import NavCustom from './NavCustom';
import { Container, Col, ProgressBar, Button, InputGroup, FormControl } from 'react-bootstrap';
import { Card, Image } from 'semantic-ui-react';
import { getRankBadge } from '../helper/helper';
import { SERVER_URL } from '../config/config';
import { markCurrentRoom, markGameStart, updateBoardState, markTurn, markTurnNum, markGameEnd } from '../actions/actions';
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
		userrank: state.getUserInfo.user.rank
	}
}

const mapDispatchToProps = (disPatch) => {
	return {
		markGameStart: () => disPatch(markGameStart()),
		updateBoard: board => disPatch(updateBoardState(board)),
		markTurn: turnMark => disPatch(markTurn(turnMark)),
		markTurnNum: turnNum => disPatch(markTurnNum(turnNum)),
		markGameEnd: gameEnd => disPatch(markGameEnd(gameEnd))
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
		this.opponent = null;
		this.roomId = this.props.roomId;
		let data = JSON.parse(getUser(localStorage.getItem('token')));
		this.user = data.id;
		console.log(data.id);

		this.socket = io(SERVER_URL, {
			query: { token: localStorage.getItem('token') }
		});

		this.socket.on('start-game', (data) => {
			console.log('Emit game ack');
			this.socket.emit('game-ack', {});
		});

		this.socket.on('start-playing', (data) => {
			this.props.markGameStart();
		})

		this.socket.on('turn', (data) => {
			console.log(data);
			let turnMark = false;
			if(data.updatedBoard) {
				this.props.updateBoard(data.updatedBoard);
			}

			if(data.gameEnd === 1) {
				this.props.markGameEnd(true);
				console.log('GAME END FROM SERVER');
			}
			else {
				turnMark = true;
				// this.timeOut = setTimeout(() => {
				// 	alert('Game end');
				// }, 5000);
				console.log(this.timeOut);
			}
			this.props.markTurn(turnMark);
			this.props.markTurnNum(data.currTurn);
		});
		console.log("COnstructor done");
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
					<div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
						<Card className="play-game-container" style={{ width: "140vmin" }}>
							<div className="opponent-time-progress-container">
								<div style={{height: "22vmin", width: "100%", display: "flex", flexDirection: "row", alignItems: "flex-end"}}>
									<div id="play-user-info" className="play-user-info">
										<img style={{height: "80%"}} src={getRankBadge(this.props.userrank)}></img>
										<div>
											<p className="play-game-username">{ this.props.username }</p>
											<div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
												<img style={{ height: "4vmin" }} src="/images/rank-logo.png"></img>
												<p className="play-game-userrank">{ this.props.userrank }</p>
											</div>
										</div>
									</div>
									<div className="match-ratio">
										<p style={{ color: "#383834", fontSize: "200%", marginRight: "10%" }}>0</p>
										<p style={{ color: "#383834", fontSize: "200%" }}>0</p>
									</div>
									<div id="play-opponent-info" className="play-opponent-info">
										{
											(this.opponent !== null) ? 
											<div>
												<p className="play-game-username">Quyen PT</p>
												<div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
													<img style={{ height: "4vmin" }} src="/images/rank-logo.png"></img>
													<p className="play-game-userrank">9282</p>
												</div>
											</div>
											:
											<p>Waiting</p>
										}
										<img style={{height: "80%"}} src={getRankBadge(9282)}></img>
									</div>
								</div>
								<ProgressBar style={{ width: "100%" }} animated now={45} />
							</div>
							<div className="board-chat-container" style={{ border: "0", padding: "0" }}>
								<Col md={6.5} className="board" style={{ padding: "0", border: "0"}}>
									{
										(this.props.isGameEnd) ? 
										(
											<div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
												<Button>Play Again</Button>
											</div>
										)
										:
										this._renderBoard(this.props.board)
									}
								</Col>
								<Col md = {4} className="room-name-chat-container" style={{ padding: 0 }}>
									<Card className="room-name-chat-container-card" style={{width: "100%"}}>
									<Image style={{maxHeight: "15vmin", width: "100%"}} src='https://react.semantic-ui.com/images/avatar/large/matthew.png' fluid />
										<Card.Content>
											<Card.Header>
												Game Room
											</Card.Header>
										</Card.Content>
										<div className="chat-layout-container">
											<div className="chat-layout">
											</div>
											<InputGroup style={{ marginTop: "2vmin" }} className="mb-3 chat-input">
												<FormControl
													placeholder="Recipient's username"
													aria-label="Recipient's username"
													aria-describedby="basic-addon2"
												/>
												<InputGroup.Append>
													<Button variant="primary">Button</Button>
												</InputGroup.Append>
											</InputGroup>
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
		if(m !== null) {
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
			if(gameEnd) {
				console.log('GAME END');
				this.props.markGameEnd(true);
			}
			
			// setTimeout(() => {
				
			// }, 500);
		}
	}
}

const Board = connect(mapStateToProps, mapDispatchToProps)(BoardContainer);
export default Board;