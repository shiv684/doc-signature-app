import { useState, useEffect } from 'react'
import { saveSignature, getSignatures } from '../api/signature.api'

export const useSignature = (docId) => {
  const [signatures, setSignatures] = useState([])
  const [saved, setSaved] = useState(false)
  const token = localStorage.getItem('token')

  const fetchSignatures = async () => {
    try {
      const res = await getSignatures(docId, token)
      setSignatures(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const handleSave = async (x, y, page, signingToken) => {
    try {
      await saveSignature({ documentId: docId, x, y, page, signingToken }, token)
      setSaved(true)
      fetchSignatures()
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (docId) fetchSignatures()
  }, [docId])

  return { signatures, saved, handleSave }
}