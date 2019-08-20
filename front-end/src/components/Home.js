import React, { Component } from 'react';
import { Form, Button, Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NavCustom from './NavCustom';
import { gameRooms } from '../mock/data';

class Home extends Component {
	render() {
		return (
			<div className="background-img">
				<div className="background-color-effect-dark">
					<NavCustom></NavCustom>
					<div style={{ display: "flex", flexDirection: "column" }}>
						<div style={{ display: "flex", justifyContent: "center" }}>
							<div className="home-create-join-button-container">
								<Button style={{ marginRight: "20px", height: "40%" }}>Create room</Button>
								<Button style={{ height: "40%" }}>Join random</Button>
							</div>
						</div>
						<div className="container-scroll">
							<div className="container-room-list-user-info">
								<div style={{ width: "1000px", marginTop: "10px" }}>
									<div className="room-list">
										{
											gameRooms.map((roomItem, index) => {
												return this._renderRoomItem(roomItem, index);
											})
										}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	_renderRoomItem = (roomItem, i) => {
		return (
			<div className="room-item">
				<div style={{ width: "183px" }}>
					<Link to={{ pathname: `/play/${roomItem.roomId}`, state: { roomId: roomItem.roomId } }} className="room-item-name">{roomItem.roomName}</Link>
					<p className="room-item-creator">{roomItem.creatorName}</p>
					<p className="room-item-created-at">1 minute ago</p>
				</div>
				<div className="room-item-join-button">
					<Button style={{ backgroundColor: "#18BC9C", border: "solid #18BC9C" }}>Join</Button>
				</div>
			</div>
		);
	}
}

export default Home;