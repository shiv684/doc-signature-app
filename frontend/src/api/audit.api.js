import axios from './axios'

export const getAuditLogs = (docId, token) => {
  return axios.get(`/audit/${docId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
}