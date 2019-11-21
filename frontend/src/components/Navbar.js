import React, { Component } from 'react';
import Notification from './Notifications'
import { Link } from 'react-router-dom';

class NavBar extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="navbar">
                <h1 className="nav"> Hi {this.props.username}! Welcome back to StayClose. </h1>
                <nav>
                    <ul>
                        <li className="nav"> {this.props.username}'s Account </li>
                        <li className="nav"> Add Circle </li>
                        <li className="nav"> Notifications </li>
                    </ul>
                </nav>
                <Notification />
            </div>
        )
    }
}

export default NavBar;
