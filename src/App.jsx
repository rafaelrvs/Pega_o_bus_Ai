import { useState } from 'react'
import './App.css'
import Header from './components/header/Header'
import { GlobalStorage } from './components/Context/Globalcontext/Globalcontext'
import Main from './components/main/Main'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SaibaMais from './components/SaibaMais/SaibaMais'

function App() {
  return (
    <GlobalStorage>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Main />} /> 
          <Route path='/conhecimento' element={<SaibaMais />} /> 
        </Routes>
      </BrowserRouter>
    </GlobalStorage>
  )
}

export default App
