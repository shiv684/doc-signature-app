import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Document, Page, pdfjs } from 'react-pdf'
import { getDocByToken, updateDocStatus } from '../api/docs.api'

import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

const SignRequest = () => {
  const { token } = useParams()
  const [doc, setDoc] = useState(null)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [numPages, setNumPages] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await getDocByToken(token)
        setDoc(res.data)
      } catch (err) {
        setError('Invalid or expired signing link')
      }
    }
    fetchDoc()
  }, [token])

  const handleSign = async (action) => {
    try {
      await updateDocStatus(token, action)
      setStatus(action)
    } catch (err) {
      setError('Something went wrong, please try again')
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow text-center">
          <p className="text-red-500 text-lg font-medium">{error}</p>
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
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Document Signing Request</h1>
        <p className="text-gray-500 mt-1">
          Please review the document and sign or reject below
        </p>
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

      {/* Sign / Reject Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => handleSign('signed')}
          className="bg-green-500 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-green-600"
        >
          ✅ Accept & Sign
        </button>
        <button
          onClick={() => handleSign('rejected')}
          className="bg-red-500 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-red-600"
        >
          ❌ Reject
        </button>
      </div>

    </div>
  )
}

export default SignRequest