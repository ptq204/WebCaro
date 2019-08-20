import React, { Component } from 'react';
import { createMap, updateBoard, checkWin } from '../algo/algo';
import Cell from './Cell';
import io from 'socket.io-client';
import uuidv4 from 'uuid/v4';

class Board extends Component {

	constructor(props) {
		super(props);
		this.state = {
			board: createMap(19),
			isGameStarted: false,
			isYourTurn: false,
			currTurn: null
		}
		this.roomId = this.props.location.state.roomId;
		this.socket = io('http://10.200.234.247:4000');
		this.user = uuidv4();

		this.socket.on('start-game', (data) => {
			console.log('Game started!!!');
			this.setState({
				isGameStarted: true,
			});
		});
		this.socket.on('turn', (data) => {
			let turnMark = false;
			if(data.updatedBoard) {
				this.setState({
					board: data.updatedBoard
				});
			}
			if(this.user === data.user) {
				turnMark = true;
				this.timeOut = setTimeout(()=> {
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
		this.socket.emit('join', {'roomId': this.roomId, 'user': this.user});
		console.log("Event emitted");

	}
	render() {
		return (
			<div className="board">
				<div>
					{this._renderBoard(this.state.board)}
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
		if(this.state.isGameStarted && this.state.isYourTurn && m[i][j].move === null) {
			let move = (this.state.currTurn % 2 == 0) ? 'X': 'O';
			var updatedBoard = updateBoard(m, i, j, move);
			// this.setState({
			// 	board: updatedBoard
			// });
			console.log(this.timeOut);
			clearTimeout(this.timeOut);
			this.timeOut = null;
			this.socket.emit('play', {roomId: this.roomId, updatedBoard: updatedBoard});
			setTimeout(()=>{
				if(checkWin(m, i, j, move)) {
					alert('You won');
				}
			}, 1000);
		}
	}
}

export default Board;