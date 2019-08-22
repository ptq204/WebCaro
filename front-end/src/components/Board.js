import React, { Component } from 'react';
import { createMap, updateBoard, checkWin } from '../algo/algo';
import Cell from './Cell';
import io from 'socket.io-client';
import uuidv4 from 'uuid/v4';
import NavCustom from './NavCustom';
import { Container, Col, ProgressBar, Button, InputGroup, FormControl } from 'react-bootstrap';
import { getRankBadge } from '../helper/helper';

class Board extends Component {

	constructor(props) {
		super(props);
		this.state = {
			board: createMap(16, 19),
			isGameStarted: false,
			isYourTurn: false,
			currTurn: null
		}
		this.roomId = this.props.location.state.roomId;
		this.socket = io('http://10.200.232.42:4000');
		this.user = uuidv4();

		this.socket.on('start-game', (data) => {
			console.log('Game started!!!');
			this.setState({
				isGameStarted: true,
			});
		});
		this.socket.on('turn', (data) => {
			let turnMark = false;
			if (data.updatedBoard) {
				this.setState({
					board: data.updatedBoard
				});
			}
			if (this.user === data.user) {
				turnMark = true;
				this.timeOut = setTimeout(() => {
					alert('Game end');
				}, 5000);
				console.log(this.timeOut);
			}
			this.setState({
				isYourTurn: turnMark,
				currTurn: data.currTurn
			});
		});
		console.log("COnstructor done");
	}

	componentDidMount() {
		this.socket.emit('join', { 'roomId': this.roomId, 'user': this.user });
		console.log("Event emitted");

	}
	render() {
		return (
			<div className="background-img">
				<NavCustom></NavCustom>
				<div className="background-color-effect-dark">
					<div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
						<div className="play-game-container">
							<div className="opponent-time-progress-container">
								<div id="play-user-info" className="play-user-info">
									<img src={getRankBadge(9282)}></img>
									<p className="play-game-username">Quyen PT</p>
								</div>
								<div className="match-ratio">
									<p style={{ color: "white", fontSize: "200%", marginRight: "10%" }}>0</p>
									<p style={{ color: "white", fontSize: "200%" }}>0</p>
								</div>
								<div id="play-opponent-info" className="play-opponent-info">
									<p className="play-game-username">Quyen PT</p>
									<img src={getRankBadge(9282)}></img>
								</div>
							</div>
							<div className="board-chat-container" style={{ width: "100%", border: "0", padding: "0" }}>
								<Col className="board" style={{ padding: "0", border: "0" }}>
									{this._renderBoard(this.state.board)}
								</Col>
								<Col className="chat-container">
									<ProgressBar style={{ width: "100%" }} animated now={45} />
									<div className="chat-layout-container">
										<div className="chat-layout">
										</div>
										<InputGroup style={{ marginTop: "2vmin" }} className="mb-3">
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
									<div>
									</div>
								</Col>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	_renderBoard = (m) => {
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

	_handleCellClick = (m, i, j) => {
		if (this.state.isGameStarted && this.state.isYourTurn && m[i][j].move === null) {
			let move = (this.state.currTurn % 2 == 0) ? 'X' : 'O';
			var updatedBoard = updateBoard(m, i, j, move);
			// this.setState({
			// 	board: updatedBoard
			// });
			console.log(this.timeOut);
			clearTimeout(this.timeOut);
			this.timeOut = null;

			let gameEnd = checkWin(m, i, j, move) ? 1 : 0;

			this.socket.emit('play', { roomId: this.roomId, updatedBoard: updatedBoard, gameEnd: gameEnd });

			setTimeout(() => {
				if (gameEnd === 1) {
					alert('You won');
				}
			}, 500);
		}
	}
}

export default Board;