import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import img1 from '../../../Images/slideshow1.jpg'
import img2 from '../../../Images/slideshow2.jpg'
import img3 from '../../../Images/slideshow3.jpg'
import img4 from '../../../Images/slideshow4.jpg'
import img5 from '../../../Images/slideshow5.jpg'
import './slideshow.css'

const slideImages = [img1, img2, img3, img4, img5];

const Slideshow = () => {
    return (
      <div className="slide-container">
        <Slide>
         {slideImages.map((slideImage, index)=> (
            <div  key={index}>
              <img className = "sliderImg" src = {slideImage} />
            </div>
          ))} 
        </Slide>

      </div>
    )
}
export default Slideshow;