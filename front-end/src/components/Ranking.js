import React, { Component } from 'react';
import { Form, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ranks } from '../mock/data';
import { getRankBadge } from '../helper/helper';
import NavCustom from './NavCustom';
import axios from 'axios';
import { changeRankList } from '../actions/actions';
import { connect } from 'react-redux';
import {SERVER_URL } from '../config/config'

const mapStateToProps = state => {
	return {
		ranks: state.ranks.rankList
	}
}

const mapDispatchToProps = disPatch => {
	return {
		updateRankList: rankList => disPatch(changeRankList(rankList))
	}
}

class RankingContainer extends Component {

	componentWillMount() {
		this._queryRanking();
	}

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
									this.props.ranks.map((rankItem, i) => {
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

	_queryRanking = () => {
		axios({
			method: 'GET',
			headers: {
				authorization: `Bearer ${localStorage.getItem('token')}`
			},
			url: `${SERVER_URL}/ranking`
		}).then(res => {
			let rankList = [];
			const resInfo = JSON.stringify(res.data);
			const data = JSON.parse(resInfo);
			for(var key in data) {
				rankList.push({username: key, rank: data[key]});
			}
			this.props.updateRankList(rankList);
		}).catch(err => {
			console.log(err);
		})
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
			</tr>
		);
	}
}

const Ranking = connect(mapStateToProps, mapDispatchToProps)(RankingContainer);
export default Ranking;