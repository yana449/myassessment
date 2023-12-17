import React from 'react'
import FormContainer from './FormContainer'
import InstructionsContainer from './InstructionsContainer'
import '../styles/Main.css'

export default function Main() {
  return (
    <div className="main">
      <InstructionsContainer />
      <FormContainer />
    </div>
  )
}
