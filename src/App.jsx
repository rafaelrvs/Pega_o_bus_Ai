import { useState } from 'react'
import './App.css'
import Header from './components/header/header.jsx'
import { GlobalStorage } from './components/Context/Globalcontext/Globalcontext'
import Main from './components/main/Main.jsx'

function App() {

  return (
    <GlobalStorage>
    <Header/>
    <Main/>
    </GlobalStorage>

 
  )
}

export default App
