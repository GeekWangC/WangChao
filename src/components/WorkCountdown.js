import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Settings from './Settings'
import '../styles/workCountdown.css'

const WorkCountdown = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [showDetails, setShowDetails] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [timeLeft, setTimeLeft] = useState('')
  const [nextHoliday, setNextHoliday] = useState('')
  const [todayEarnings, setTodayEarnings] = useState(0)
  const [yearEarnings, setYearEarnings] = useState(0)
  const [randomQuote, setRandomQuote] = useState('')
  
  // 默认设置
  const defaultSettings = {
    salary: 10000,
    workStart: '09:00',
    workEnd: '18:00',
    workDays: [1, 2, 3, 4, 5],
    showCountdown: true
  }
  
  // 从 localStorage 加载设置
  const [settings, setSettings] = useState(defaultSettings)

  // 在客户端加载设置
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('workCountdownSettings')
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      }
    }
  }, [])

  // 随机励志语录
  const quotes = [
    "今天也要加油哦！",
    "再坚持一下下~",
    "你是最棒的！",
    "休息一下，继续前进！",
    "工作使我快乐！",
    "今天也是元气满满的一天！",
    "加油，你是最胖的！",
    "努力工作，快乐生活！",
  ]

  // 检查是否是休息日
  const isHoliday = () => {
    const today = new Date()
    const dayOfWeek = today.getDay() || 7 // 将周日的 0 转换为 7
    return !settings.workDays.includes(dayOfWeek)
  }

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const currentHour = now.getHours()
      const currentMinute = now.getMinutes()
      
      // 如果是休息日
      if (isHoliday()) {
        setTimeLeft('今天是休息日！')
        return
      }
      
      // 解析工作时间
      const [startHour, startMinute] = settings.workStart.split(':').map(Number)
      const [endHour, endMinute] = settings.workEnd.split(':').map(Number)
      
      // 如果已经下班
      if (currentHour > endHour || (currentHour === endHour && currentMinute >= endMinute)) {
        setTimeLeft('下班了！')
        return
      }
      
      // 如果还没上班
      if (currentHour < startHour || (currentHour === startHour && currentMinute < startMinute)) {
        const minutesUntilWork = (startHour - currentHour) * 60 + (startMinute - currentMinute)
        setTimeLeft(`还有${minutesUntilWork}分钟上班`)
        return
      }
      
      // 计算距离下班还有多久
      const minutesUntilEnd = (endHour - currentHour) * 60 + (endMinute - currentMinute)
      setTimeLeft(`还有${minutesUntilEnd}分钟下班`)
    }

    const calculateEarnings = () => {
      

      const now = new Date()
      const [startHour, startMinute] = settings.workStart.split(':').map(Number)
      const [endHour, endMinute] = settings.workEnd.split(':').map(Number)
      
      const currentHour = now.getHours()
      const currentMinute = now.getMinutes()
      
      // 计算今天已工作的时间（小时）
      const workedHours = currentHour - startHour + (currentMinute - startMinute) / 60
      const dailySalary = settings.salary / 22 // 假设每月22个工作日
      const totalWorkHours = (endHour - startHour) + (endMinute - startMinute) / 60
      const hourlyRate = dailySalary / totalWorkHours
      
      // 计算今日收入
      const todayEarned = Math.max(0, Math.min(workedHours * hourlyRate, dailySalary))
      setTodayEarnings(todayEarned.toFixed(2))
      
      // 计算今年收入
      const yearStart = new Date(now.getFullYear(), 0, 1)
      const daysWorked = Math.floor((now - yearStart) / (1000 * 60 * 60 * 24))
      const workDaysInYear = Math.floor(daysWorked / 7 * 5) // 每周5个工作日
      const yearEarned = (workDaysInYear / 22) * settings.salary // 按每月22个工作日计算
      setYearEarnings(yearEarned.toFixed(2))

      if (isHoliday()) {
        setTodayEarnings('0.00')
        return
      }
    }

    const calculateNextHoliday = () => {
      const now = new Date()
      let nextHolidayDate = new Date(now)
      
      // 找到下一个休息日
      while (settings.workDays.includes(nextHolidayDate.getDay() || 7)) {
        nextHolidayDate.setDate(nextHolidayDate.getDate() + 1)
      }
      
      const diffDays = Math.ceil((nextHolidayDate - now) / (1000 * 60 * 60 * 24))
      setNextHoliday(`还有${diffDays}天到休息日`)
    }

    const updateRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * quotes.length)
      setRandomQuote(quotes[randomIndex])
    }

    // 初始计算
    calculateTimeLeft()
    calculateEarnings()
    calculateNextHoliday()
    updateRandomQuote()

    // 设置定时器
    const timer = setInterval(() => {
      calculateTimeLeft()
      calculateEarnings()
    }, 60000) // 每分钟更新一次

    return () => clearInterval(timer)
  }, [settings, isHoliday])

  // 保存设置到 localStorage
  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings)
    if (typeof window !== 'undefined') {
      localStorage.setItem('workCountdownSettings', JSON.stringify(newSettings))
    }
    setIsVisible(newSettings.showCountdown)
  }

  if (!isVisible) return null

  return (
    <>
      <motion.div
        className="work-countdown"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onHoverStart={() => setShowDetails(true)}
        onHoverEnd={() => setShowDetails(false)}
      >
        <div className="countdown-content">
          <div className="main-countdown">{timeLeft}</div>
          <AnimatePresence>
            {showDetails && (
              <motion.div
                className="details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <p>{nextHoliday}</p>
                <p>今日已赚：¥{todayEarnings}</p>
                <p>今年已赚：¥{yearEarnings}</p>
                <p className="quote">{randomQuote}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button
          className="settings-button"
          onClick={() => setShowSettings(true)}
          title="设置"
        >
          ⚙️
        </button>
        <button
          className="close-button"
          onClick={() => setIsVisible(false)}
          title="关闭倒计时"
        >
          ×
        </button>
      </motion.div>

      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />
    </>
  )
}

export default WorkCountdown 