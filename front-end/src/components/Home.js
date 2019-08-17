import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class Login extends Component {
	render() {
		return (
			<div className="background-img">
				<div className="background-color-effect">
					<div className="login-board">
						<p style={{ fontSize: "35px", color: "white", textAlign: "center", marginTop: "50px" }}>Sign in</p>
						<div style={{ display: "flex", justifyContent: "center", marginTop: "60px" }}>
							<Form>
								<div>
									<Form.Group controlId="formBasicEmail" style={{ width: "250px" }}>
										<Form.Control type="email" placeholder="Enter username" />
									</Form.Group>
								</div>
								<div>
									<Form.Group controlId="formBasicPassword" style={{ width: "250px" }}>
										<Form.Control type="password" placeholder="Password" />
									</Form.Group>
								</div>
							</Form>
						</div>
						<div style={{ display: "flex", justifyContent: "center" }}>
							<Button variant="primary" type="submit" style={{ width: "150px", backgroundColor: "#18BC9C", border: "solid #18BC9C" }}>
								Login
  						</Button>
						</div>
						<Link style={{ color: "white", fontSize: "15px", display: "flex", justifyContent: "center" }}>
							Create new account
						</Link>
					</div>
				</div>
			</div>
		);
	}
}

export default Login;