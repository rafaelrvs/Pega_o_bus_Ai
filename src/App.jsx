import { useState } from 'react'
import './App.css'
import Header from './components/header/Header'
import { GlobalStorage } from './components/Context/Globalcontext/Globalcontext'
import Main from './components/main/Main'

function App() {

  return (
    <GlobalStorage>
    <Header/>
    <Main/>
    </GlobalStorage>

 
  )
}

export default App
