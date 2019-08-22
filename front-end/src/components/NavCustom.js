import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap';

class NavCustom extends Component {
	render() {
		return (
			<Navbar sticky="top" style={{ backgroundColor: "#2C3E50", display: "flex", justifyContent: "center" }}>
				<div className="container-nav">
					<div className="container-nav-brand">
						<Navbar.Brand style={{ color: "#18BC9C", fontWeight: "bold" }} href="/">Caro provip 123</Navbar.Brand>
					</div>
					<div className="container-nav-rank-logout">
						<Nav>
							<img style={{ height: "40px" }} src="images/trophy.png"></img>
							<Nav.Link style={{ color: "white", marginRight: "20px" }} href="/ranks">Leaderboard</Nav.Link>
							<Nav.Link style={{ color: "white" }} href="/ranks">Log out</Nav.Link>
						</Nav>
					</div>
				</div>
			</Navbar>
		);
	}
}

export default NavCustom;