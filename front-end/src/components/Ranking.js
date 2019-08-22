import React, { Component } from 'react';
import { Form, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ranks } from '../mock/data';
import { getRankBadge } from '../helper/helper';
import NavCustom from './NavCustom';

class Ranking extends Component {
	render() {
		return (
			<div className="background-img">
				<NavCustom></NavCustom>
				<div className="background-color-effect-dark">
					<div style={{ marginBottom: "0", marginTop: "120px", textAlign: "center" }}>
						<p style={{ fontSize: "35px", color: "white", fontWeight: "bold" }}>Ranking</p>
					</div>

					<div className="leaderboard">
						<Table size="sm" borderless style={{ marginLeft: "10px", marginTop: "10px" }}>
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
			</div>
		);
	}

	_renderRankItem = (item, i) => {
		let rankIcon = getRankBadge(item.rank);
		return (
			// <div className="rank-item">
			// 	<p style={{color: "#18BC9C", fontWeight: "bold"}}>{ i }</p>
			// 	<p style={{color: "white", paddingLeft: "100px"}}>{ item.username }</p>
			// 			<img src={ rankIcon }></img>
			// 	<p style={{color: "#E7F732"}}>{ item.rank }</p>
			// </div>
			<tr>
				<td style={{ color: "#18BC9C", fontWeight: "bold" }}>{i}</td>
				<td style={{ color: "white" }}>{item.username}</td>
				<td><img style={{ height: "50%" }} src={rankIcon}></img></td>
				<td style={{ color: "#E7F732" }}>{item.rank}</td>
			</tr >
		);
	}
}

export default Ranking;