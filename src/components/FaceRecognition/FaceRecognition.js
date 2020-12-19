import React from 'react';
import './FaceRecognition.css';


const FaceRecognition = ({ imageUrl, boxes }) => {
	return(
		<div className='center ma'>
		 <div className=' absolute mt2'>
	       <img id='inputimage' alt='' width="500px" height='auto' src = {imageUrl}/>
			{boxes.map(box => {
               return <div key={box.rightCol} className="bounding-box" style ={{top:box.topRow, right:box.rightCol, bottom:box.bottomRow,  left:box.leftCol,}}> </div>
              })

          }
		  </div>
		</div>
		);
}

export default FaceRecognition;