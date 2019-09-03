import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { setLogOut } from '../actions/actions';
import { connect } from 'react-redux';

const mapDisPatchToProps = (disPatch) => {
	return {
		setLogOut: isLoggedOut => disPatch(setLogOut(isLoggedOut))
	}
}

class NavCustomContainer extends Component {
	render() {
		return (
			<Navbar sticky="top" style={{ backgroundColor: "#2C3E50", display: "flex", justifyContent: "center" }}>
				<div className="container-nav">
					<div className="container-nav-brand">
						<Navbar.Brand style={{ color: "#18BC9C", fontWeight: "bold" }} href="/">
							<img src="/images/tic-tac-toe-logo.png" height="30" className="d-inline-block align-top"></img>
							{' Caro provip 123 '}
						</Navbar.Brand>
					</div>
					<div className="container-nav-rank-logout">
						<Nav style={{display: "flex", flexDirection: "row-reverse", height: "100%"}}>
							<Nav.Link style={{ color: "white" }} onClick={this._logOut}>Log out</Nav.Link>
							<Nav.Link style={{ color: "white", marginRight: "20px" }} href="/ranks">Leaderboard</Nav.Link>
							<img style={{ height: "80%" }} src="images/trophy.png"></img>
						</Nav>
					</div>
				</div>
			</Navbar>
		);
	}

	_logOut = () => {
		localStorage.removeItem('token');
		this.props.setLogOut(true);
	}
}

const NavCustom = connect(null, mapDisPatchToProps)(NavCustomContainer);
export default NavCustom;
