import axios from './axios'

export const uploadDoc = (formData, token) => {
  return axios.post('/docs/upload', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const getDocs = (token) => {
  return axios.get('/docs', {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const generateSigningLink = (docId, signerEmail, token) => {
  return axios.post('/docs/generate-link', 
    { docId, signerEmail },
    { headers: { Authorization: `Bearer ${token}` } }
  )
}

export const getDocByToken = (token) => {
  return axios.get(`/docs/sign/${token}`)
}

export const updateDocStatus = (token, status) => {
  return axios.post('/docs/update-status', { token, status })
}
export const deleteDoc = (docId, token) => {
  return axios.delete(`/docs/${docId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
}