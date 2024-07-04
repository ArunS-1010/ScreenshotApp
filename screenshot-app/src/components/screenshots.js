// screenshot.js
import React, { useEffect, useState, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import '../App.css'

const Screenshots = () => {
  const location = useLocation()
  const { urls } = location.state || { urls: [] }
  const [screenshots, setScreenshots] = useState({})
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('mobile')
  const [orientation, setOrientation] = useState('portrait')

  const fetchScreenshots = useCallback(
    async (currentTab, currentOrientation) => {
      setLoading(true)
      const response = await axios.post('http://localhost:5000/screenshot', {
        urls,
        tab: currentTab,
        orientation: currentOrientation,
      })
      setScreenshots((prevScreenshots) => ({
        ...prevScreenshots,
        ...response.data,
      }))
      setLoading(false)
    },
    [urls]
  )

  useEffect(() => {
    fetchScreenshots('mobile', 'portrait')
  }, [fetchScreenshots])

  const handleTabChange = (newTab) => {
    setTab(newTab)
    setOrientation('portrait')
    if (!screenshots[urls[0]] || !screenshots[urls[0]][newTab]) {
      fetchScreenshots(newTab, 'portrait')
    }
  }

  const handleOrientationChange = (newOrientation) => {
    setOrientation(newOrientation)
    fetchScreenshots(tab, newOrientation)
  }

  const downloadImage = (dataUrl, filename) => {
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadAll = () => {
    urls.forEach((url) => {
      if (screenshots[url] && screenshots[url][tab]) {
        downloadImage(
          `data:image/png;base64,${screenshots[url][tab]}`,
          `${url}-${tab}.png`
        )
      }
    })
  }

  return (
    <div className="main-container">
      <h1>Screenshots for Play store / Appstore</h1>
      <div className="tab-container">
        <button
          className={tab === 'mobile' ? 'active' : ''}
          onClick={() => handleTabChange('mobile')}
        >
          Mobile
        </button>
        <button
          className={tab === 'tablet' ? 'active' : ''}
          onClick={() => handleTabChange('tablet')}
        >
          Tablet
        </button>
        <button
          className={tab === 'tv' ? 'active' : ''}
          onClick={() => handleTabChange('tv')}
        >
          TV
        </button>
        <button
          className={tab === 'wearOS' ? 'active' : ''}
          onClick={() => handleTabChange('wearOS')}
        >
          Wear OS
        </button>
      </div>

      {(tab === 'mobile' || tab === 'tablet') && (
        <div className="orientation-container">
          <label htmlFor="orientation">Orientation: </label>
          <select
            id="orientation"
            value={orientation}
            onChange={(e) => handleOrientationChange(e.target.value)}
          >
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </div>
      )}

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="images-container">
          {urls.map((url, index) => (
            <div key={index} className="image-wrapper">
              <h5 className="page-name">
                Image {index + 1}: {url}
              </h5>
              {screenshots[url] && (
                <>
                  <div className="image-container">
                    <img
                      src={`data:image/png;base64,${screenshots[url][tab]}`}
                      alt={`${tab} screenshot`}
                    />
                    <button
                      className="download-btn"
                      onClick={() =>
                        downloadImage(
                          `data:image/png;base64,${screenshots[url][tab]}`,
                          `${url}-${tab}.png`
                        )
                      }
                    >
                      Download
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="download-all-btn-container">
        <button className="download-all-btn" onClick={downloadAll}>
          Download All
        </button>
      </div>
    </div>
  )
}

export default Screenshots
