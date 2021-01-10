import React from 'react';
import ProfileIcon from '../Profile/Profileicon';

const Navigation =( {onRouteChange, isSignedIn, toggleModal} ) => {
	if (isSignedIn) {
	    return (
				<nav style={{ display: 'flex', justifyContent: 'flex-end'}}>
			     <ProfileIcon onRouteChange = {onRouteChange} toggleModal={toggleModal}/>
				</nav>
				);
       } else {
       	   return (
             	<nav style={{ display: 'flex', justifyContent: 'flex-end'}}>
				<p  onClick={() => onRouteChange('signin')} 
				className='f3 link dim pointer black pa3 underline'> Sign In</p>
				<p  onClick={() => onRouteChange('register')} 
				className='f3 link dim pointer black pa3 underline'> Register </p>
				</nav>
       	   	);
       }
   }

export default Navigation;