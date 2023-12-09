import React from 'react';
import { Link, Navigate, useNavigate, Outlet } from 'react-router-dom';

const NavBar = () => {

  const navigate = useNavigate();
  const handleNavigation = (path: string) => {
    navigate(path);
  }

  return (
    <div>
      <div className="collapse" id="navbarToggleExternalContent">
        <div className="bg-dark p-4">
        <h5 className="text-white h4">Collapsed content</h5>
    <span className="text-muted">Toggleable via the navbar brand.</span>
        <Link to='/protected/synthesize'>Synthesize</Link>

        <Link to='/protected/dashboard'>WaveSurfer</Link>

        <Link to='/protected/post'>Record Post</Link>

        <Link to='/protected/profile'>User Profile</Link>
        </div>
      </div>
      <nav className='navbar navbar-dark bg-dark'>
        <div className="container-fluid">
            <button 
            className='navbar-toggler' 
            type='button' 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarToggleExternalContent"
            aria-controls="navbarToggleExternalContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            >
               <span className="navbar-toggler-icon"></span>
            </button>
        </div>

      </nav>
      {/* <div className="outlet">
        <Outlet />
      </div> */}
    </div>
  );
};

export default NavBar;