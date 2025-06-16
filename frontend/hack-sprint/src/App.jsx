import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import HideRoute from './components/HideRoute'
import Loader from './components/Loader'
import Quest from './pages/Quest'
import About from './pages/About'
import Login from './pages/Login'
import './App.css'

function App() {
  return (
    <>
      <Router>
        <HideRoute>
          <Navbar />
        </HideRoute>
        <Routes>
          <Route path="/" element={<Home />} caseSensitive></Route>
          <Route path="/quest" element={<Quest />} caseSensitive></Route>
          <Route path="/about" element={<About />} caseSensitive></Route>
          <Route path='/login' element={<Login />} caseSensitive></Route>
        </Routes>
        <HideRoute>
          <Footer />
        </HideRoute>
      </Router>
    </>
  )
}

export default App
