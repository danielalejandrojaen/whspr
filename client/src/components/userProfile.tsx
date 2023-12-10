import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLoaderData } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import CardTitle from 'react-bootstrap/esm/CardTitle';

const UserProfile = () => {
    const [selectedUser, setselectedUser] = useState({});
    const currentUser: any = useLoaderData();
    console.log('userLoader', currentUser);
    return (
        <div className="user-main">
            <Card style={{ width: '20rem' }}>
                <div className="user-main-card">
                    <div className="user-pfp">
                        <img src={currentUser.profileImgUrl} alt="user profile image" />
                    </div>
                </div>
                <Card.Body>
                    <Card.Title>{currentUser.username}</Card.Title>
                    <Card.Text>
                        {currentUser.bio || 'No bio yet'}
                    </Card.Text>
                </Card.Body>
            </Card>
            {/* <div className="user-profile-card">
                <div className="user-profile-image">
                    <img src={currentUser.profileImgUrl} alt="user profile image" />
                </div>
                <div className="user-profile-info">
                    <h1>{currentUser.username}</h1>
                </div>
            </div> */}
        </div>
    )
};

export default UserProfile;