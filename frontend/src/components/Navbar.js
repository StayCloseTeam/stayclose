import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
import Notification from './Notifications';
import ProfilePicture from './ProfilePicture';
import { Link } from 'react-router-dom';
import ReactModal from 'react-modal';
import Dropzone from 'react-dropzone';

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
            userFetched: false,
            userId: '',
            name: '',
            members: '',
            addedMember: '',
            picToUpload: [],
            showAddModal: false,
            showSettingsModal: false
        };
        this.handleOpenAddModal = this.handleOpenAddModal.bind(this);
        this.handleCloseAddModal = this.handleCloseAddModal.bind(this);
        this.handleOpenSettingsModal = this.handleOpenSettingsModal.bind(this);
        this.handleCloseSettingsModal = this.handleCloseSettingsModal.bind(this);
    }



    handleOpenAddModal() {
        this.setState({ showAddModal: true });
    }

    handleCloseAddModal() {
        this.setState({ showAddModal: false });
    }

    handleOpenSettingsModal() {
        this.setState({ picToUpload: [] })
        this.setState({ showSettingsModal: true });
    }

    handleCloseSettingsModal() {
        this.setState({ picToUpload: [] })
        this.setState({ showSettingsModal: false });
    }

    handleAddSubmit = (event) => {
        event.preventDefault();
        let currName = this.state.name
        let currAdmin = this.props.userId
        let config = {
            headers: {
                Authorization: `Token ${localStorage.getItem("access_key")}`
            }
        }
        const newCircle = {
            name: currName,
            admin: currAdmin,
            pending_members: [],
            members: []
        }
        axios.post('/api/circles/', newCircle, config
        ).then(res => {
            this.setState({ showAddModal: false });
            this.props.addCircle(newCircle)
        }).catch(function (error) {
            alert('circle not created, try again')
        })
    }

    handleSettingsSubmit = (event) => {
        event.preventDefault();
        let profilePicture = this.state.picToUpload[0]
        let config = {
            headers: {
                Authorization: `Token ${localStorage.getItem("access_key")}`
            }
        }
        let data = new FormData()
        data.append('file', profilePicture)
        axios.put('/api/upload-user-avatar/', data, config
        ).then(res => {
            this.setState({ showSettingsModal: false });
            if (this.props.location.pathname != '/profile/') {
                this.props.history.push('/profile');
            } else {
                window.location.reload(false);
            }
        }).catch(function (error) {
            alert('username not changed, try again')
        })
    }


    handleLogout() {
        window.localStorage.clear()
        this.props.history.push('/')
    }

    componentDidMount() {
        let config = {
            headers: {
                Authorization: `Token ${this.state.authtoken}`
            }
        }
        axios.get('/api/user/', config, {
        }).then(res => {
            this.setState({ userId: res.data.id })
            this.setState({ userFetched: true })

        })
    }

    render() {
        if (localStorage.getItem('access_key') && this.state.userFetched) {
            return (
                <div className="navbar">
                    <div className="links-1">
                        <h1 className="logo-1"><Link className="header" to="/profile"> StayClose</Link></h1>
                    </div>
                    <div className="navbar-2">
                        <ul className="links-2">
                            <ProfilePicture userId={this.state.userId} size='default' />
                            <li><button type="button" className="add" onClick={this.handleOpenSettingsModal}>Change Avatar </button></li>
                            <div>
                                <ReactModal isOpen={this.state.showSettingsModal} style={customStyles}>
                                    <button className="modal" onClick={this.handleCloseSettingsModal}>X</button>
                                    <h2>Change Avatar: </h2>
                                    <form onSubmit={this.handleSettingsSubmit}>
                                        {this.state.picToUpload.length == 0 &&
                                            <Dropzone className="dropzone" onDrop={acceptedFiles => this.setState({ picToUpload: acceptedFiles })}>
                                                {({ getRootProps, getInputProps, isDragActive }) => (
                                                    <section>
                                                        <div {...getRootProps()}>
                                                            <input {...getInputProps()} />
                                                            {isDragActive ? "Drop it like it's hot!" : 'Click me or drag a file to upload!'}
                                                        </div>
                                                    </section>
                                                )}
                                            </Dropzone>
                                        }
                                        {this.state.picToUpload.length > 0 &&
                                            <div>
                                                <h3>File is Added! Click to Submit</h3>
                                            </div>
                                        }
                                        <button className="profile-submit" type='submit' value='create'>Save</button>
                                    </form>
                                </ReactModal>
                            </div>
                            {this.props.location.pathname == '/profile' &&
                                <li><button className="add" onClick={this.handleOpenAddModal}>+ Circle </button></li>
                            }
                            {this.props.location.pathname == '/profile/' &&
                                <li><button className="add" onClick={this.handleOpenAddModal}>+ Circle </button></li>
                            }
                            <div>
                                <ReactModal isOpen={this.state.showAddModal} style={customStyles}>
                                    <button className="modal" onClick={this.handleCloseAddModal}>X</button>
                                    <h2>New Circle: </h2>
                                    <form onSubmit={this.handleAddSubmit}>
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
                        </ul>
                    </div>
                </div>
            )
        }
        else if (localStorage.getItem('access_key') && !this.state.userFetched) {
            return (
                <div className="navbar">
                    <div className="links-1">
                        <h1 className="logo-1"><Link className="header" to="/profile"> StayClose</Link></h1>
                    </div>
                    <ul className="links-2">

                        <li><button type="button" className="add" onClick={this.handleOpenSettingsModal}>Settings </button></li>
                        <div>
                            <ReactModal isOpen={this.state.showSettingsModal} style={customStyles}>
                                <button className="modal" onClick={this.handleCloseSettingsModal}>X</button>
                                <h2>Settings: </h2>
                                <form onSubmit={this.handleSettingsSubmit}>
                                    <label>
                                        Username:
                                        <div></div>
                                        <input type='text' defaultValue={this.state.user.username} onChange={(e) => this.setState({ user: e.target.value })} />
                                        <div></div>
                                    </label>
                                    {this.state.picToUpload.length == 0 &&
                                        <Dropzone className="dropzone" onDrop={acceptedFiles => this.setState({ picToUpload: acceptedFiles })}>
                                            {({ getRootProps, getInputProps, isDragActive }) => (
                                                <section>
                                                    <div {...getRootProps()}>
                                                        <input {...getInputProps()} />
                                                        {isDragActive ? "Drop it like it's hot!" : 'Click me or drag a file to upload!'}
                                                    </div>
                                                </section>
                                            )}
                                        </Dropzone>
                                    }
                                    {this.state.picToUpload.length > 0 &&
                                        <div>
                                            <h3>File is Added! Click to Submit</h3>
                                        </div>
                                    }
                                    <button className="profile-submit" type='submit' value='create'>Change Settings</button>
                                </form>
                            </ReactModal>
                        </div>
                        {this.props.location.pathname == '/profile' &&
                            <li><button className="add" onClick={this.handleOpenAddModal}>+ Circle </button></li>
                        }
                        {this.props.location.pathname == '/profile/' &&
                            <li><button className="add" onClick={this.handleOpenAddModal}>+ Circle </button></li>
                        }
                        <div>
                            <ReactModal isOpen={this.state.showAddModal} style={customStyles}>
                                <button className="modal" onClick={this.handleCloseAddModal}>X</button>
                                <h2>New Circle: </h2>
                                <form onSubmit={this.handleAddSubmit}>
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
                </div>
            )
        }
    }
}

export default withRouter(NavBar);