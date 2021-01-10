
import React from 'react';
import './Profile.css';

class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: this.props.user.name,
			age: this.props.user.age,
			pet: this.props.user.pet
		}
	}

	onFormChange = (event) => {
	 switch(event.target.name) {
	 	case 'user-name' :
	 	 this.setState({name : event.target.value})
	 	 break;
	 	 case 'user-age' :
	 	 this.setState({age : event.target.value})
	 	 break;
	 	 case 'user-pet' :
	 	 this.setState({ pet : event.target.value})
	 	 break;
	 	 default :
	 	  return;
		}
	}
	onProfileUpdate = (data) => {
		fetch(`https://powerful-garden-65991.herokuapp.com/profile/${this.props.user.id}`, {
			method : 'post',
			headers : {
				'Content-Type' : 'application/json',
				'Authorization' : window.sessionStorage.getItem('token')
		},
			body: JSON.stringify({ formInput : data})
			})
			.then(resp => {
				if(resp.status === 200 || resp.status === 204){
					this.props.toggleModal();
				this.props.loadUser({...this.props.user, ...data})
				}
		}) 
		.catch(err => console.log(err))
	}

	render() {
		const {user,toggleModal} = this.props;
		const {name, age, pet} = this.state;
	    return(
	    <div className="profile-modal">
	     <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l shadow-5 mw6  center" style={{'backgroundColor': '#B83F74'}}>
	      <main className="pa4 black-80 w-80">
	          <img
			      src="https://st3.depositphotos.com/3581215/18899/v/600/depositphotos_188994514-stock-illustration-vector-illustration-male-silhouette-profile.jpg"
			      className="h3 w3 dib" alt="avatar" />
			   <h1> { this.state.name }</h1>
			   <h4> {`Images Submitted: ${user.entries}`}</h4>
			   <p> {`Member Since: ${new Date(user.joined).toLocaleString()}`} </p>
	            <label className="mt2 fw6" htmlFor="user-name">Name :</label>
	              <input 
	              onChange = {this.onFormChange}
	              className="pa2 ba w-100"
	              placeholder={user.name}
	              type="user-name"
	               name="user-name" 
	                id="user-name"/>
	             <label className="mt2 fw6" htmlFor="user-age">Age :</label>
	              <input 
	              onChange = {this.onFormChange}
	              className="pa2 ba w-100"
	              placeholder={user.age} 
	              type="user-age"
	               name="user-age" 
	                id="user-age"/>
	             <label className="mt2 fw6" htmlFor="user-name">Pets :</label>
	              <input 
	              onChange = {this.onFormChange}
	              className="pa2 ba w-100"
	              placeholder={user.pet} 
	              type="user-pet"
	               name="user-pet" 
	                id="user-pet"/>
	             <div className="mt4"
	                 style={{display:'flex', justifyContent: 'space-evenly'}}>
	               <button onClick = {() => this.onProfileUpdate({name, age, pet})}
	               className='b pa2 grow pointer hover-white w-40 bg-light-blue b--20'>
	                 Save
	                </button>
	                <button className='b pa2 grow pointer hover-white w-40 bg-light-red b--20' onClick={toggleModal}>
	                 Cancel
	                </button>
	               </div>
	        </main>
	         <div className="modal-close" onClick={toggleModal}>
	          &times;
	          </div>
	       </article>
	      </div>
		
)
}
}

export default Profile;