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