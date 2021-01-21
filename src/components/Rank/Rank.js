import React from 'react';

class Rank extends React.Component {
  constructor() {
    super(); 
    this.state = {
      emoji: ''
    }
  }

  generateEmoji = (entries) => {
    fetch(`https://iweuopqia8.execute-api.us-east-1.amazonaws.com/prod/rank?rank=${entries}`)
    .then(response => response.json())
    .then(data => this.setState({
      emoji: data.input
    }))
    .catch(err => console.log(err));
  }

  componentDidMount() {
   this.generateEmoji(this.props.entries)
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.entries === this.props.entries && prevProps.name === this.props.name) {
      return null
    }
    this.generateEmoji(this.props.entries);
  }

  render() {
  return (
    <div>
     <div className='f3 white'>
       {`${this.props.name}, your current rank is ...`}
     </div>
     <div className='f1 white'>
       {this.props.entries}
     </div>
      <div className='f3 white'>
      {`Badge: ${this.state.emoji} `}
     </div>
  
    </div>
    )
}
}


export default Rank;