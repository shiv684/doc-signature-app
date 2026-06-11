import { useState, useEffect } from 'react'
import { getAuditLogs } from '../api/audit.api'

export const useAudit = (docId) => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem('token')

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const res = await getAuditLogs(docId, token)
      setLogs(res.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (docId) fetchLogs()
  }, [docId])

  return { logs, loading }
}