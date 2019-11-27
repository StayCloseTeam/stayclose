import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';


class NewContent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            post: '',
            userId: ''
        }
    }

    handleSubmit = (event) => {
        let post_text = this.state.post;
        let member = this.props.match.params.userId;
        let circle = this.props.match.params.circleId;
        let date = new Date('2020-11-30');
        let timestamp = date.getTime() / 1000;
        event.preventDefault();
        let config = {
            headers: {
                Authorization: `Token ${localStorage.getItem("access_key")}`
            }
        }
        axios.post('/api/content/', {
            author: 'placeholder',
            text_post: post_text,
            img_post: null,
            caption: "",
            likes: 0,
            member: member,
            circle: circle,
            tags: null
        }, config
        ).then(res => {
            this.props.history.push('/circle/' + this.props.match.params.circleId + '/' + this.props.match.params.circleName + '/' + this.props.match.params.userId)
        })
    }

    render() {
        return (
            <div className='postForm'>
                <h2>New Post: </h2>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Post:
                    <div></div>
                        <input type='text' value={this.state.post} onChange={(e) => this.setState({ post: e.target.value })} />
                        <div></div>
                    </label>
                    <div></div>
                    <button type='submit' value='create'>Create a Post</button>
                </form>
            </div>
        )
    }
}

export default withRouter(NewContent);