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
                <div className="contentDetail">
                    <div className="postButton">
                        <button type="button" className="add"><Link className="nav" to={'/post/' + this.props.circleId + '/' + this.props.circleName + '/' + this.props.match.params.userId + '/' + localStorage.getItem('username')} >Add Post</Link></button>
                    </div>
                    <h1 className="content-header">{this.props.circleName}</h1>
                    {this.state.contents.map(content =>
                    <div className="content-2" key={content.id}>
                            <div className="post-avatar"><p></p></div>
                            <div className="post">
                            <p>author: {content.author}</p>
                            <p>"{content.text_post}"</p>
                            <button>Edit</button>
                            <button onClick={this.handleOpenModal}>Delete</button>
                            <p>created at: {content.created_at}</p>
                            </div>
                        <ReactModal isOpen={this.state.showModal} style={customStyles}>
                                <button className="modal" onClick={this.handleCloseModal}>X</button>
                                <h3 className="delete-message">Are you sure you want delete this post?</h3>
                                <div className="delete">
                                    <button className="deleter" onClick={(e) => this.handleDelete(content.id)}>Yes</button>
                                    <button className="deleter" onClick={this.handleDelete}>No</button>
                                </div>
                        </ReactModal>
                    </div>
                    )}
                </div>
                <React.Fragment>
                    Members: <Circle circleId={params.circleId} />
                </React.Fragment>
                
            </div>
        );
    }

}

export default withRouter(Content);