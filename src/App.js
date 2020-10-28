import React, {Component} from 'react';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js';
import Register from './components/Register/Register';
import SignIn from './components/SignIn/SignIn';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'; 
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import './App.css';


 const app = new Clarifai.App({apiKey: '4e2138a283314954a9f2ac4e15c2cfa8'});

 


const particlesOptions = {
  particles: {
    number: {
      value:50,
      density:{
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState = {
      input: '',
      imageUrl: '',
      box: {} ,
      route : 'signin',
      isSignedIn : false,
      user: {
          id : '',
        name : '',
        email : '',
        password: '',
        entries: 0,
        joined : ''
      }
    }
class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }


 loadUser = (data) => {
     this.setState({ user: {
          id : data.id,
         name : data.name,
         email : data.email,
         password: data.password,
         entries: data.entries,
         joined : data.joined
}
 })
}
 

  calculateFaceLocation = (data) => { 
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
         leftCol: clarifaiFace.left_col * width,
         topRow: clarifaiFace.top_row * height,
         rightCol: width - (clarifaiFace.right_col * width),
         bottomRow: height - (clarifaiFace.bottom_row * height)
    }

  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

 onInputChange = (event) => {
    this.setState({input: event.target.value});
  }
  onButtonSubmit = () => {
      this.setState({imageUrl: this.state.input});
       app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
        .then((response)=> { 
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
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
        .catch(err => 
          console.log('opps!, there is an error')
        );
    
  }
 onRouteChange= (route) => {
      if (route === 'signout') {
        this.setState(initialState);
      } else if(route === 'home') {
        this.setState({isSignedIn: true})
      }
  this.setState({route : route})
 }

  render() {
   const  { isSignedIn, imageUrl, box, route } = this.state;
   return (
       <div className='App'>
          <Particles className='particles'
              params={particlesOptions}
           />
          <Navigation onRouteChange={this.onRouteChange}
           isSignedIn = {isSignedIn}
          />
          { route === 'home' 
              ?
            <div>

              <Logo/>
                <ErrorBoundary>
                   <Rank name= {this.state.user.name}
                    entries = {this.state.user.entries}
                    />
                   <ImageLinkForm onInputChange= {this.onInputChange}
                   onButtonSubmit={this.onButtonSubmit}
                   />
                   <FaceRecognition box = {box}
                   imageUrl = {imageUrl}
                    />
                  </ErrorBoundary>
              </div>
               :
               ( route ==='signin' ? 
                <SignIn onRouteChange= {this.onRouteChange} 
                 loadUser = {this.loadUser}
                /> :
                <Register loadUser = {this.loadUser}
                onRouteChange= {this.onRouteChange}
                />
              
          )
         }
       </div>
  
  );
}
}
export default App;
