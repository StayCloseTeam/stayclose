import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import Circle from './Circle';
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

class Content extends Component {
    constructor(props) {
        super(props);

        this.state = {
            contents: [],
            contentId: '',
            post: '',
            showDeleteModal: false,
            showEditModal: false
        }
        this.handleOpenDeleteModal = this.handleOpenDeleteModal.bind(this);
        this.handleCloseDeleteModal = this.handleCloseDeleteModal.bind(this);
        this.handleOpenEditModal = this.handleOpenEditModal.bind(this);
        this.handleClosEditModal = this.handleCloseEditModal.bind(this);
    }

    handleOpenDeleteModal(id) {
        this.setState({ contentId: id});
        this.setState({ showDeleteModal: true });
    }

    handleCloseDeleteModal() {
        this.setState({ showDeleteModal: false });
    }

    handleOpenEditModal(text, id) {
        this.setState({ post: text})
        this.setState({ contentId: id});
        this.setState({ showEditModal: true });
    }

    handleCloseEditModal() {
        this.setState({ post: ''});
        this.setState({ showEditModal: false });
    }

    handleDelete(){
        let config = {
            headers: {
                Authorization: `Token ${localStorage.getItem("access_key")}`
            }
        }
        axios.delete('http://127.0.0.1:8000/api/content/' + this.state.contentId, config, {
        }).then(res => {
            this.setState({ showDeleteModal: false} );
            this.componentDidMount();
            this.forceUpdate();
        })
    }

    handleEdit(){
        let config = {
            headers: {
                Authorization: `Token ${localStorage.getItem("access_key")}`
            }
        }
        axios.patch('http://127.0.0.1:8000/api/content/' + this.state.contentId + '/', {
            text_post: this.state.post
        }, config
        ).then(res => {
            console.log(this.state.post);
            this.setState({ showEditModal: false} );
            this.setState({ text: ''});
            this.componentDidMount();
            this.forceUpdate();
        })
    }

    componentDidMount() {
        let config = {
            headers: {
                Authorization: localStorage.getItem("access_key")
            }
        }
        axios.get('/api/content-by-circle/', {
            params: {
                id: this.props.circleId
            }
        }, config
        ).then(res => {
            let content = res.data
            this.setState({ contents: content })
        })
    }

    render() {
        const { match: { params } } = this.props;
        return (
            <div className="content-1">
                <React.Fragment>
                    Members: <Circle circleId={params.circleId} />
                </React.Fragment>
                <div className="contentDetail">
                    <h1 className="content-header">{this.props.circleName}'s Feed</h1>
                    {this.state.contents.map(content =>
                    <div className="content-2" key={content.id}>
                        <canvas className="post"></canvas>
                        <div className="post-2">
                            <p className="posting">author: {content.author}</p>
                            <p className="posting-2">"{content.text_post}"</p>
                            <p className="posting">created at: {content.created_at}</p>
                            <button className="editor" onClick={(e) => this.handleOpenEditModal(content.text_post, content.id)}>Edit</button>
                            <ReactModal isOpen={this.state.showEditModal} style={customStyles}>
                                    <button className="modal" onClick={(e) => this.handleCloseEditModal()}>X</button>
                                    <h3 className="message">Edit Your Post: </h3>
                                    <form>
                                    <input type='text' defaultValue={this.state.post} onChange={(e) => this.setState({ post: e.target.value })} />
                                    </form>
                                    <div className="edit">
                                        <button className="editing" onClick={(e) => this.handleEdit()}>Save</button>
                                        <button className="editing" onClick={(e) => this.handleCloseEditModal()}>Do Not Save</button>
                                    </div>
                            </ReactModal>
                            <button className="stuff" onClick={(e) => this.handleOpenDeleteModal(content.id)}>Delete</button>
                            <ReactModal isOpen={this.state.showDeleteModal} style={customStyles}>
                                    <button className="modal" onClick={(e) => this.handleCloseDeleteModal()}>X</button>
                                    <h3 className="message">Are you sure you want to delete your post?</h3>
                                    <div className="delete">
                                        <button className="deleting" onClick={(e) => this.handleDelete()}>Yes</button>
                                        <button className="deleting" onClick={(e) => this.handleCloseDeleteModal()}>No</button>
                                    </div>
                            </ReactModal>
                        </div>
                    </div>
                    )}
                </div>
               
            </div>
        );
    }

}

export default withRouter(Content);