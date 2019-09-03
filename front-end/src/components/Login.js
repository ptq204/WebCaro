import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { changeLoginPassword, changeLoginUsername, setLoggedIn, setLogOut } from '../actions/actions';
import { connect } from 'react-redux';
import axios from 'axios';
import { SERVER_URL } from '../config/config';
import { Redirect } from 'react-router-dom';

const mapStateToProps = state => {
	return {
		username: state.login.username,
		password: state.login.password,
		isLoggedIn: state.login.isLoggedIn,
		isLoggedOut: state.setLogOut.isLoggedOut
	}
}

const mapDispatchToProps = disPatch => {
	return {
		handleChangeUsername: username => disPatch(changeLoginUsername(username)),
		handleChangePassword: password => disPatch(changeLoginPassword(password)),
		setLoggedIn: isLoggedIn => disPatch(setLoggedIn(isLoggedIn)),
		setLogOut: isLoggedOut => disPatch(setLogOut(isLoggedOut))
	}
}

class LoginContainer extends Component {

	state = {
		errMessage: ''
	}
	render() {
		if(this.props.isLoggedIn && !this.props.isLoggedOut) {
			return <Redirect to="/"></Redirect>
		}
		return (
			<div className="background-img">
				<div className="background-color-effect">
					<div style={{ height: "100%", display: "flex", alignContent: "center"}}>
						<div className="login-board">
							<p style={{ fontSize: "35px", color: "white", textAlign: "center", paddingTop: "60px" }}>Sign in</p>
							<div style={{ display: "flex", justifyContent: "center", marginTop: "60px" }}>
								<Form>
									<div>
										<Form.Group controlId="formBasicEmail" style={{ width: "250px" }}>
											<Form.Control type="username" placeholder="Enter username" onChange={(e) => this.props.handleChangeUsername(e.target.value)} />
										</Form.Group>
									</div>
									<div>
										<Form.Group controlId="formBasicPassword" style={{ width: "250px" }}>
											<Form.Control type="password" placeholder="Password" onChange={(e) => this.props.handleChangePassword(e.target.value)} />
										</Form.Group>
									</div>
									<div style={{ display: "flex", justifyContent: "center" }}>
										<Button variant="primary" type="submit" onClick={this._login} style={{ width: "150px", backgroundColor: "#18BC9C", border: "solid #18BC9C" }}>
											Login
									</Button>
									</div>
								</Form>
							</div>				
							<Link to="/register" style={{ color: "white", fontSize: "15px", display: "flex", justifyContent: "center" }}>
								Create new account
						</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}

	_login = (e) => {
		e.preventDefault();
		let params = new URLSearchParams();
		params.append('username', this.props.username);
		params.append('password', this.props.password);
		axios({
			method: 'POST',
			data: params,
			url: `${SERVER_URL}/login`
		}).then(res => {
			if(res) {
				const resInfo = JSON.stringify(res.data);
				const data = JSON.parse(resInfo);
				if(data.token && data.token !== ''){
					localStorage.setItem('token', data.token);
					this.props.setLoggedIn(true);
					this.props.setLogOut(false);
				}
			}
		}).catch(err => {
			console.log(err);
		})
	}
}

const Login = connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
export default Login;