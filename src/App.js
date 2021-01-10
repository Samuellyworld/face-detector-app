import React, {Component, Suspense} from 'react';
import Particles from 'react-particles-js';
import SignIn from './components/SignIn/SignIn';
import Navigation from './components/Navigation/Navigation';
import Modal from './components/Modal/Modal';
import Profile from './components/Profile/Profile';
import './App.css';


const Registerlazy = React.lazy(() => import('./components/Register/Register'));
const Errorlazy = React.lazy(() => import('./components/ErrorBoundary/ErrorBoundary'));
const Facelazy = React.lazy(() => import('./components/FaceRecognition/FaceRecognition'));
const Logolazy = React.lazy(() => import('./components/Logo/Logo'));
const Ranklazy = React.lazy(() => import('./components/Rank/Rank'));
const Imagelazy = React.lazy(() => import('./components/ImageLinkForm/ImageLinkForm'));

const particlesOptions = {
  particles: {
    number: {
      value:70,
      density:{
        enable: true,
        value_area: 900
      }
    }
  }
}

const initialState = {
      input: '',
      imageUrl: '',
      boxes: [],
      route : 'signin',
      isSignedIn : false,
      isProfileOpen: false,
      user: {
          id : '',
        name : '',
        email : '',
        password: '',
        entries: 0,
        joined : '',
        pet : '',
        age : ''
      }
    }
class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

componentDidMount() {
  const token = window.sessionStorage.getItem('token');
  if(token) {
    fetch('https://powerful-garden-65991.herokuapp.com/signin', {
      method: 'post',
      headers : {
        'Content-Type' : 'application/json',
        'Authorization' : token
      }
    })
    .then(resp => resp.json())
     .then(data => {
      if(data && data.id) {
        fetch(`https://powerful-garden-65991.herokuapp.com/profile/${data.id}`, {
          method: 'get',
          headers: {
            'Content-Type' : 'application/json',
            'Authorization' : token
          }
        }).then(resp => resp.json())
        .then(user => {
          if(user && user.email) {
            this.loadUser(user)
            this.onRouteChange('home')
          }
        })
      }
    })
     .catch(err => console.log(err));
  }
}

 loadUser = (data) => {
     this.setState({ user: {
          id : data.id,
         name : data.name,
         email : data.email,
         password: data.password,
         entries: data.entries,
         joined : data.joined,
         age: data.age,
         pet: data.pet
}

 })
}

  calculateFaceLocations = (data) => { 
    return data.outputs[0].data.regions.map(face => {
     const clarifaiFace= face.region_info.bounding_box;
    const image = document.getElementById('inputimage')
    const width = Number(image.width);
    const height = Number(image.height);
    return {
         leftCol: clarifaiFace.left_col * width,
         topRow: clarifaiFace.top_row * height,
         rightCol: width - (clarifaiFace.right_col * width),
         bottomRow: height - (clarifaiFace.bottom_row * height)
    }
 })
  }

  displayFaceBoxes = (boxes) => {
    this.setState({boxes: boxes});
  }

 onInputChange = (event) => {
    this.setState({input: event.target.value});
  }
  onButtonSubmit = () => {
      this.setState({imageUrl: this.state.input});
       fetch('https://powerful-garden-65991.herokuapp.com/imageUrl', {
         method: 'post',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify({
           input: this.state.input
         })
       })
       .then(response => response.json())
       .then(response => {
         if(response) {
             fetch('https://powerful-garden-65991.herokuapp.com/image', {
            method : 'put',
            headers : {'Content-Type' : 'application/json'},
            body: JSON.stringify({
              id : this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })

          .catch(console.log)
         }       
          this.displayFaceBoxes(this.calculateFaceLocations(response))
       
      })
        .catch(err => 
          console.log('opps!, there is an error', err));
    
  }
 onRouteChange= (route) => {
      if (route === 'signout') {
       return  this.setState(initialState);
      } else if(route === 'home') {
        this.setState({isSignedIn: true})
      }
  this.setState({route : route})
 }

  toggleModal = () => {
   this.setState(prevState => ({
     ...prevState, isProfileOpen: !prevState.isProfileOpen
   }))
 }

  render() {
   const  { isSignedIn, imageUrl, boxes, route, isProfileOpen, user } = this.state;
   return (
       <div className='App'>
          <Particles className='particles'
              params={particlesOptions}
           />
          <Navigation onRouteChange={this.onRouteChange}
           isSignedIn = {isSignedIn} toggleModal={this.toggleModal}
          />
          {
            isProfileOpen &&
             <Modal>
                 <Profile isProfileOpen ={isProfileOpen}
                   toggleModal = {this.toggleModal}
                    loadUser ={this.loadUser} user={user} />
             </Modal>
          }
          { route === 'home' 
              ?
            <div>
             <Suspense fallback={<div> loading ... </div>}>
              <Logolazy />
                <Errorlazy>
                   <Ranklazy name= {this.state.user.name}
                    entries = {this.state.user.entries}
                    />
                   <Imagelazy onInputChange= {this.onInputChange}
                   onButtonSubmit={this.onButtonSubmit}
                   />
                   <Facelazy boxes = {boxes}
                   imageUrl = {imageUrl}
                    />
                  </Errorlazy>
                </Suspense>  
              </div>
               :
               ( route ==='signin' ? 
               
                <SignIn onRouteChange= {this.onRouteChange} 
                 loadUser = {this.loadUser}
                
                />
                 :
                <Suspense fallback={<div> loading ... </div>}>
                 <Registerlazy loadUser = {this.loadUser}
                onRouteChange= {this.onRouteChange}
                />
                </Suspense>
              
          )
         }
       </div>
  
  );
}
}
export default App;
