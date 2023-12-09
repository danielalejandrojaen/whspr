import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLoaderData } from 'react-router-dom';

const UserProfile = () => {
    const [selectedUser, setselectedUser] = useState([]);
    const currentUser: any = useLoaderData();
    console.log('userLoader', currentUser);
    
    return (
        <div className="user-main">
            <div className="user-profile-card">
                <div className="user-profile-image">
                    <img src={currentUser.profileImgUrl} alt="user profile image" />
                </div>
                <div className="user-profile-info">
                    <h5 className='card-title'>{currentUser.username}</h5>
                </div>
            </div>
        </div>
    )
};

export default UserProfile;