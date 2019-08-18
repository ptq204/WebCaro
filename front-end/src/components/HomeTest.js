import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class HomeTest extends Component {

    render() {
        return (
            <div>
                <ul>
                    <li><Link to={{ pathname: '/play/room01', state: { roomId: 'room01' } }} >1</Link></li>
                    <li><Link to={{ pathname: '/play/room02', state: { roomId: 'room02' } }} >2</Link></li>
                </ul>
            </div>
        );
    }
}

export default HomeTest;