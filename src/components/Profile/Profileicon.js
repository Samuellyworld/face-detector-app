import React from 'react';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';

class ProfileIcon extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dropdownOpen: false
		}
	}
	toggle = () => {
		this.setState(prevState => ({
			  dropdownOpen: !prevState.dropdownOpen
		}));
	}
	render() {
		return (
           <div className='pa4 tc'>
            <Dropdown isOpen = {this.state.dropdownOpen} toggle={this.toggle} >
             <DropdownToggle
               tag = "span"
               data-toggle = "dropdown"
               aria-expanded = {this.state.dropdownOpen}
               >
                <img
			      src="https://st3.depositphotos.com/3581215/18899/v/600/depositphotos_188994514-stock-illustration-vector-illustration-male-silhouette-profile.jpg"
			      className="br-100 h3 w3 dib" alt="avatar" />
			   </DropdownToggle>
			   <DropdownMenu
			      right
			      className='b--transparent shadow-5'
			       style= {{marginTop: '20px', backgroundColor: 'rgba(255,255,255,0.5'}}>
				   <DropdownItem onClick={this.props.toggleModal}> View Profile </DropdownItem>
				   <DropdownItem onClick={ ()=> this.props.onRouteChange('signout')}> Sign Out </DropdownItem>
				</DropdownMenu>
			  </Dropdown>
           </div>
			)
	}
}

export default ProfileIcon;