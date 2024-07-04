// src/App.js
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Screenshots from './components/screenshots'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/screenshots" element={<Screenshots />} />
      </Routes>
    </Router>
  )
}

export default App
