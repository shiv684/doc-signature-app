import axios from './axios'

export const saveSignature = (data, token) => {
  return axios.post('/signatures', data, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const getSignatures = (docId, token) => {
  return axios.get(`/signatures/${docId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
}