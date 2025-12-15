"use client"

import { useEffect } from "react"

const Alert = ({ type = "info", message, onClose, autoClose = true, duration = 5000 }) => {
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [autoClose, duration, onClose])

  if (!message) return null

  return (
    <div className="alert-container">
      <div className={`alert alert-${type} alert-dismissible fade show`} role="alert">
        <strong>{type === "danger" ? "Error!" : type === "success" ? "Success!" : "Info:"}</strong> {message}
        {onClose && <button type="button" className="btn-close" onClick={onClose}></button>}
      </div>
    </div>
  )
}

export default Alert
