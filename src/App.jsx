import { useState } from 'react'
import OCRProcessor from './components/OCRProcessor';
import './App.css'




function App() {
  return (
   
    <div className='min-h-screen  bg-gray-700 p-8 justify-center'>
      <h1 className='text-4xl font-bold mb-6 text-center bg-gray-800 border rounded-2xl border-black'>MedDost-"Your Ai Medicine Identifier"</h1>
      <h2 className='text-4xl bg-gray-500 rounded mb-4 font-bold text-center'><strong>Welcome Home</strong></h2>
      <OCRProcessor/>
    </div>
    
  )
}

export default App
