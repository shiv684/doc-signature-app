import { useState } from 'react'
import { generateSigningLink } from '../api/docs.api'

export const useSigningLink = () => {
  const [link, setLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const token = localStorage.getItem('token')

  const handleGenerateLink = async (docId, signerEmail) => {
    try {
      setLoading(true)
      const res = await generateSigningLink(docId, signerEmail, token)
      setLink(res.data.signingLink)
    } catch (err) {
      setError('Failed to generate signing link')
    } finally {
      setLoading(false)
    }
  }

  return { link, loading, error, handleGenerateLink }
}