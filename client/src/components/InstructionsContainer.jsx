import React from 'react'
import '../styles/InstructionsContainer.css'

export default function InstructionsContainer() {
  return (
    <div className="instructionsContainer">
      <span className="heading">
        Instructions:
      </span>
      <span className="instructions">
        Please fill out the form to register for our yoga classes.<br />
        <span className='points'>
          • Only people within the age limit of 18-65 can enroll for the monthly classes.
          <br />
          • The monthly fee is 500/- Rs INR.
          <br />
          • You can move to any other batch next month.
        </span>
      </span>
    </div>
  )
}
