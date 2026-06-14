import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Document, Page, pdfjs } from 'react-pdf'
import SignaturePad from 'signature_pad'
import { getDocByToken } from '../api/docs.api'
import { embedSignature } from '../api/signature.api'

import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

const SignRequest = () => {
  const { token } = useParams()
  const [doc, setDoc] = useState(null)
  const [fetchError, setFetchError] = useState('')
  const [signError, setSignError] = useState('')
  const [status, setStatus] = useState('')
  const [numPages, setNumPages] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const sigCanvas = useRef(null)
  const signaturePad = useRef(null)
useEffect(() => {
  console.log('Token from URL:', token)
  const fetchDoc = async () => {
    try {
      const res = await getDocByToken(token)
      console.log('Doc fetched:', res.data)
      setDoc(res.data)
    } catch (err) {
      console.error('Fetch error:', err.response?.data || err.message)
      setFetchError('Invalid or expired signing link')
    }
  }
  fetchDoc()
}, [token])

useEffect(() => {
  if (doc && sigCanvas.current) {
    signaturePad.current = new SignaturePad(sigCanvas.current)
  }
}, [doc])

  const handleSign = async () => {
  if (!signaturePad.current || signaturePad.current.isEmpty()) {
    return alert('Please draw your signature first')
  }

  try {
    setLoading(true)
    setSignError('')

    const signatureImage = signaturePad.current.toDataURL('image/png')

    console.log('Signing with token:', token)
    const res = await embedSignature(token, signatureImage)
    console.log('Success:', res.data)

    setStatus('signed')
  } catch (err) {
    console.error('Sign error:', err.response?.data || err.message)
    setSignError(err.response?.data?.message || 'Signing failed, please try again')
  } finally {
    setLoading(false)
  }
}
  const handleReject = async () => {
    try {
      await fetch('http://localhost:5000/api/docs/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, status: 'rejected' })
      })
      setStatus('rejected')
    } catch (err) {
      setSignError('Something went wrong, please try again')
    }
  }

  // Only show fetch error — not sign error
  if (fetchError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow text-center">
          <p className="text-red-500 text-lg font-medium">{fetchError}</p>
        </div>
      </div>
    )
  }

  if (status) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow text-center">
          <p className={`text-2xl font-bold mb-2 ${
            status === 'signed' ? 'text-green-500' : 'text-red-500'
          }`}>
            {status === 'signed' ? '✅ Document Signed!' : '❌ Document Rejected'}
          </p>
          <p className="text-gray-500">You can close this window now.</p>
        </div>
      </div>
    )
  }

  if (!doc) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading document...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

     {/* Header */}
<div className="bg-white border-b border-gray-100 shadow-sm mb-6">
  <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
        <span className="text-white">✍️</span>
      </div>
      <div>
        <h1 className="text-lg font-bold text-gray-800">Document Signing Request</h1>
        <p className="text-xs text-gray-400">Review and sign the document below</p>
      </div>
    </div>
  </div>
</div>

      {/* PDF Viewer */}
      <div className="flex justify-center mb-6">
        <div className="shadow-lg">
          <Document
            file={`http://localhost:5000/uploads/${doc.filename}`}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          >
            <Page pageNumber={currentPage} width={700} />
          </Document>
        </div>
      </div>

      {/* Page Controls */}
      <div className="flex justify-center items-center gap-4 mb-6">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="bg-white border px-3 py-1 rounded disabled:opacity-40"
        >
          Prev
        </button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {numPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, numPages))}
          disabled={currentPage === numPages}
          className="bg-white border px-3 py-1 rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>

{/* Signature Canvas */}
<div className="flex justify-center mb-6">
  <div className="bg-white p-4 rounded shadow">
    <p className="text-sm text-gray-500 mb-2 text-center">
      Draw your signature below:
    </p>
    <canvas
      ref={sigCanvas}
      width={500}
      height={150}
      className="border border-gray-300 rounded"
    />
    <div className="flex justify-end mt-2">
      <button
        onClick={() => signaturePad.current?.clear()}
        className="text-sm text-gray-400 hover:text-gray-600"
      >
        Clear
      </button>
    </div>
  </div>
</div>

      {/* Sign error */}
      {signError && (
        <p className="text-center text-red-500 mb-4">{signError}</p>
      )}

      {/* Sign / Reject Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleSign}
          disabled={loading}
          className="bg-green-500 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Signing...' : '✅ Accept & Sign'}
        </button>
        <button
          onClick={handleReject}
          className="bg-red-500 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-red-600"
        >
          ❌ Reject
        </button>
      </div>

    </div>
  )
}

export default SignRequest