import { useState, useEffect } from 'react'
import { getDocs, uploadDoc, deleteDoc } from '../api/docs.api'

export const useDocs = () => {
  const [docs, setDocs] = useState([])
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState('')
  const token = localStorage.getItem('token')

  const fetchDocs = async () => {
    try {
      const res = await getDocs(token)
      setDocs(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const handleUpload = async () => {
    if (!file) return setMessage('Please select a file first')

    const formData = new FormData()
    formData.append('pdf', file)

    try {
      await uploadDoc(formData, token)
      setMessage('File uploaded successfully!')
      setFile(null)
      fetchDocs()
    } catch (err) {
      setMessage('Upload failed, please try again')
    }
  }

  const handleDelete = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return

    try {
      await deleteDoc(docId, token)
      setMessage('Document deleted successfully')
      fetchDocs()
    } catch (err) {
      setMessage('Delete failed, please try again')
    }
  }

  useEffect(() => {
    fetchDocs()
  }, [])

  return { docs, file, setFile, message, handleUpload, handleDelete }
}