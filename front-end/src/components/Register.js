import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { changeRegisterUsername, changeRegisterPassword } from '../actions/actions';
import { connect } from 'react-redux';
import axios from 'axios';
import { SERVER_URL } from '../config/config';

const mapStateToProps = state => {
	return {
		username: state.register.username,
		password: state.register.password,
	}
}

const mapDispatchToProps = disPatch => {
	return {
		handleChangeUsername: username => disPatch(changeRegisterUsername(username)),
		handleChangePassword: password => disPatch(changeRegisterPassword(password)),
	}
}

class RegisterContainer extends Component {
	state = {
		errMessage: ''
	}

	render() {
		if (this.props.isLoggedIn) {
			this.props.history.push('/');
		}
		return (
			<div className="background-img">
				<div className="background-color-effect">
					<div style={{ height: "100%", display: "flex", alignContent: "center" }}>
						<div className="login-board">
							<p style={{ fontSize: "35px", color: "white", textAlign: "center", paddingTop: "60px" }}>Register</p>
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
										<Button variant="primary" type="submit" onClick={this._register} style={{ width: "150px", backgroundColor: "#18BC9C", border: "solid #18BC9C" }}>
											Register
										</Button>
									</div>
								</Form>
							</div>
							<p style={{color: 'red', fontSize: "100%", marginTop: "30px", textAlign: "center"}}>{ this.state.errMessage }</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	_register = (e) => {
		e.preventDefault();
		if(this.props.username === '' || this.props.password === '') {
			this.setState({
				errMessage: 'Fields must not be blank'
			});
		}
		else if(!this.props.username.match(/^[a-zA-Z0-9]{3,20}$/)) {
			this.setState({
				errMessage: 'Username should start at alphabet, number and has 3 - 20 characters'
			});
		}
		else {
			let params = new URLSearchParams();
			params.append('username', this.props.username);
			params.append('password', this.props.password);
			axios({
				method: 'POST',
				data: params,
				url: `${SERVER_URL}/register`
			}).then(res => {
				if (res) {
					const resInfo = JSON.stringify(res.data);
					const data = JSON.parse(resInfo);
					if (data.token && data.token !== '') {
						localStorage.setItem('token', data.token);
						this.props.history.push('/');
					}
				}
			}).catch(err => {
				console.log(err);
			});
		}
	}
}

const Register = connect(mapStateToProps, mapDispatchToProps)(RegisterContainer);
export default Register;