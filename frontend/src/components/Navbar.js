import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
import Notification from './Notifications';
import { Link } from 'react-router-dom';
import ReactModal from 'react-modal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    }
};

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '',
            name: '',
            members: '',
            addedMember: '',
            userId: '',
            showModal: false
        };
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }



    handleOpenModal() {
        this.setState({ showModal: true });
    }

    handleCloseModal() {
        this.setState({ showModal: false });
    }

    handleSubmit = (event) => {
        let currName = this.state.name
        let currAdmin = this.props.userId
        event.preventDefault();
        let config = {
            headers: {
                Authorization: `Token ${localStorage.getItem("access_key")}`
            }
        }
            axios.post('/api/circles/', {
                name: currName,
                created_at: "2020-11-30",
                admin: currAdmin,
                members: []
            }, config
            ).then(res => {
                this.setState({ showModal: false} );
                if (this.props.location.pathname != '/profile/'){
                    this.props.history.push('/profile');
                } else {
                    window.location.reload(false);
                }
            }).catch(function (error) {
                alert('circle not created, try again')
            })
            }

    handleLogout() {
        window.localStorage.clear()
        this.props.history.push('/')
    }

    render() {
        if (localStorage.getItem('access_key')) {
            return (
                <div className="navbar">
                    <h1 className="links"><Link className="header" to="/profile"> StayClose</Link></h1>
                    <ul className="links-2">
                        <li className="settings"><button type="button" className="add"><Link className="nav"> {this.props.username}'s Profile Settings </Link></button></li>
                        <li><button className="add" onClick={this.handleOpenModal}>+ Circle </button></li>
                        <div>
                            <ReactModal isOpen={this.state.showModal} style={customStyles}>
                                <button className="modal" onClick={this.handleCloseModal}>X</button>
                                <h2>New Circle: </h2>
                                <form onSubmit={this.handleSubmit}>
                                    <label>
                                        Circle Name:
                                        <div></div>
                                        <input type='text' value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} />
                                        <div></div>
                                    </label>
                                    <button type='submit' value='create'>Create a Circle</button>
                                </form>
                            </ReactModal>
                        </div>
                        <li><button type="button" onClick={this.handleCloseModal} className="add"><a className="nav" onClick={() => this.handleLogout()}>Logout </a></button></li>
                        <li className="notification"><Link to="/notification" className="nav">
                            <div className="sandwich"></div>
                            <div className="sandwich"></div>
                            <div className="sandwich"></div>
                        </Link></li>
                    </ul>
                </div>
            )
        } else {
            return (
                <div className="navbar">
                    <h1 className="nav"> Hi! Welcome to StayClose. </h1>
                    <nav>
                        <ul>
                            <li className="nav"> <Link to="/login"> Login </Link> </li>
                            <li className="nav"> <Link to="/register"> Register </Link> </li>
                        </ul>
                    </nav>
                    <Notification />
                </div>
            )
        }
    }
}

export default withRouter(NavBar);
