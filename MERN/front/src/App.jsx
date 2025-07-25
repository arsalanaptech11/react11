import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Create } from './Components/Create'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'
import Read from './Components/Read'


function App() {
  const [count, setCount] = useState(0)

  return (
   <>
   <BrowserRouter>
  <Routes>
    <Route path="/" element={<Create/>}/>
    <Route path="/r" element={<Read/>}/>
  </Routes>
   
   </BrowserRouter>
   </>
     
  )
}

export default App
