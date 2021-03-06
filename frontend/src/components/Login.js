import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';


class LoginForm extends Component {


    constructor(props) {
        super(props);
        this.state = {
            user: '',
            pass: '',
            currentUser: ''

        };
    }

    handleSubmit = (event) => {
        event.preventDefault();

        axios.post('/api/rest-auth/login/', {
            username: this.state.user,
            password: this.state.pass,

        }).then(res => {

            localStorage.setItem('access_key', res.data.key);
            localStorage.setItem('username', this.state.user);

            this.props.history.push("/profile");
        }).catch(function (error) {
            alert('login unsuccessful, try again')
        })

    }

    render() {
        return (

            <div className="login-page" >
                <div className="login-1">
                    <h1 className="login-header">StayClose</h1>
                    <p className="login-p">"Personal. Practical. Private."</p>
                </div>
                <div className="login-2">
                    <h2>Sign In:</h2>
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            Username:
                            <div></div>
                            <input type='text' value={this.state.user} onChange={(e) => this.setState({ user: e.target.value })} />
                        </label>
                        <div></div>
                        <label>
                            Password:
                            <div></div>
                            <input type='password' value={this.state.pass} onChange={(e) => this.setState({ pass: e.target.value })} />
                        </label>
                        <div></div>
                        <button type='submit' value='submit' className="signin"> Sign In</button>
                    </form>
                    <p className="member">
                        Not a Member? <Link className="register-link" to="/register"> Click Here to Register</Link>
                    </p>
                </div>
            </div >
        );
    }
}

export default withRouter(LoginForm);