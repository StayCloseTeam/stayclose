import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import NavBar from './NavBar'
import Content from './Content'
import Toolbar from './Toolbar'

class CircleFeed extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        const { match: { params } } = this.props;
        return (
            <React.Fragment>
                <NavBar username={localStorage.getItem('username')} userId={params.userId}/>
                <Toolbar circleId={params.circleId} circleName={params.circleName} userId={params.userId}/>
                <Content circleId={params.circleId} circleName={params.circleName} userId={params.userId}/>
            </React.Fragment>
        );
    }

}

export default withRouter(CircleFeed);