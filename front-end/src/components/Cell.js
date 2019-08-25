import React, { Component } from 'react';

class Cell extends Component {
	render(){
		const { move, isChoosen, onClick } = this.props;
		return(
			(move == 'X') ?
			<div className="cell" onClick={onClick}>
				<p className="label-X">{ move }</p>
			</div>
			:
			<div className="cell" onClick={onClick}>
				<p className="label-O">{ move }</p>
			</div>
		);
	}
}

export default Cell;