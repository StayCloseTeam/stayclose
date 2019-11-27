import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
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
class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
        showModal: false
    }
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

    handleOpenModal() {
        this.setState({ showModal: true });
    }

    handleCloseModal() {
        this.setState({ showModal: false });
    }

    handleSubmit(){

    }

    handleDelete(){
      let config = {
          headers: {
              Authorization: `Token ${localStorage.getItem("access_key")}`
            }
        }
        axios.delete('/api/circles/' + this.props.circleId, config, {
        }).then(res => {
            this.props.history.push('/profile');
        })
    }

  render() {
    return (
      <div className="postButton">
        <button type="button" className="add-post"><Link className="nav" to={'/post/' + this.props.circleId + '/' + this.props.circleName + '/' + this.props.match.params.userId + '/' + localStorage.getItem('username')} >Add Post</Link></button>
        <button type="button" className="stuff" onClick={(e) => this.handleDelete()}>Delete Circle</button>
        <button type="button" className="addMember" onClick={this.handleOpenModal}>Add Member</button>
        <ReactModal isOpen={this.state.showModal} style={customStyles}>
            <button className="modal" onClick={this.handleCloseModal}>X</button>
            <h2>New Members: </h2>
            <form onSubmit={this.handleSubmit}>
                <label>
                    Add Members:
                    <input type='text' value={this.state.members} onChange={(e) => this.setState({ members: e.target.value })} />
                </label>
                <button type='submit' value='create'>Add Memebers</button>
            </form>
        </ReactModal>
    </div>
    )
  }
}
export default withRouter(Toolbar)
