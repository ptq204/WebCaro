import React, { Component } from 'react';
import { Form, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ranks } from '../mock/data';

class Ranking extends Component {
	render() {
		return (
			<div className="background-img">
				<div className="background-color-effect-dark">
					<div style={{ marginBottom: "0", marginTop: "120px", textAlign: "center" }}>
						<p style={{ fontSize: "35px", color: "white", fontWeight: "bold" }}>Ranking</p>
					</div>
				
					<div className="leaderboard">
					<Table size="sm" borderless style={{marginLeft: "10px", marginTop: "10px"}}>
						<tbody>
							{
								ranks.map((rankItem, i) => {
									return this._renderRankItem(rankItem, i + 1);
								})
							}
						</tbody>
					</Table>
					</div>
				</div>
				<div>Icons made by <a href="https://www.flaticon.com/authors/dimitry-miroliubov" title="Dimitry Miroliubov">Dimitry Miroliubov</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
			</div>
		);
	}

	_renderRankItem = (item, i) => {
		let rankIcon = '';
		if (item.rank < 2000) {
			rankIcon = '/images/rank-beginner.png';
		}
		else if (item.rank < 4000) {
			rankIcon = '/images/rank-intermediate.png';
		}
		else if (item.rank < 6000) {
			rankIcon = '/images/rank-professional.png';
		}
		else if (item.rank < 8000) {
			rankIcon = '/images/rank-challenger.png';
		}
		else {
			rankIcon = '/images/rank-master.png';
		}
		return (
			// <div className="rank-item">
			// 	<p style={{color: "#18BC9C", fontWeight: "bold"}}>{ i }</p>
			// 	<p style={{color: "white", paddingLeft: "100px"}}>{ item.username }</p>
			// 			<img src={ rankIcon }></img>
			// 	<p style={{color: "#E7F732"}}>{ item.rank }</p>
			// </div>
			<tr>
				<td style={{color: "#18BC9C", fontWeight: "bold"}}>{i}</td>
				<td style={{color: "white"}}>{item.username}</td>
				<td><img style={{height: "50%"}} src={rankIcon}></img></td>
				<td style={{color: "#E7F732"}}>{ item.rank }</td>
			</tr >
		);
	}
}

export default Ranking;