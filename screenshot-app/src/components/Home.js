import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

const Home = () => {
  const [urls, setUrls] = useState(['', '', '', ''])
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (index, value) => {
    const newUrls = [...urls]
    newUrls[index] = value
    setUrls(newUrls)
  }

  const handleNext = () => {
    if (urls.some((url) => !isValidUrl(url))) {
      setError('Please enter valid URLs')
      return
    }
    navigate('/screenshots', { state: { urls } })
  }

  const isValidUrl = (string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  return (
    <div className="main-container">
      <h1>Screenshots for Play store / Appstore</h1>
      <div className="input-box-container ">
        {urls.map((url, index) => (
          <input
            key={index}
            type="text"
            value={url}
            onChange={(e) => handleChange(index, e.target.value)}
            placeholder={'Paste your URL here'}
            required
          />
        ))}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      <div className="input-container">
        <button className="next-btn" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  )
}

export default Home
