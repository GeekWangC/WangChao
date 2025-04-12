import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import '../styles/settings.css'

const Settings = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState(settings)

  useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  const handleChange = (key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(localSettings)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="settings-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="settings-modal"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
          >
            <h2>设置</h2>
            <form onSubmit={handleSubmit}>
              <div className="setting-group">
                <h3>工作设置</h3>
                <div className="setting-item">
                  <label>月薪（元）</label>
                  <input
                    type="number"
                    value={localSettings.salary}
                    onChange={(e) => handleChange('salary', Number(e.target.value))}
                    min="0"
                  />
                </div>
                <div className="setting-item">
                  <label>上班时间</label>
                  <input
                    type="time"
                    value={localSettings.workStart}
                    onChange={(e) => handleChange('workStart', e.target.value)}
                  />
                </div>
                <div className="setting-item">
                  <label>下班时间</label>
                  <input
                    type="time"
                    value={localSettings.workEnd}
                    onChange={(e) => handleChange('workEnd', e.target.value)}
                  />
                </div>
              </div>

              <div className="setting-group">
                <h3>显示设置</h3>
                <div className="setting-item">
                  <label>显示倒计时</label>
                  <input
                    type="checkbox"
                    checked={localSettings.showCountdown}
                    onChange={(e) => handleChange('showCountdown', e.target.checked)}
                  />
                </div>
              </div>

              <div className="setting-actions">
                <button type="button" onClick={onClose} className="cancel-button">
                  取消
                </button>
                <button type="submit" className="save-button">
                  保存
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Settings 