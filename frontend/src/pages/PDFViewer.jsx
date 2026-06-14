import { useState, useRef } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { DndContext } from '@dnd-kit/core'
import { useParams, useNavigate } from 'react-router-dom'
import DraggableSignature from '../components/DraggableSignature'
import { useSignature } from '../hooks/useSignature'

import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

const PDFViewer = () => {
  const { docId, filename } = useParams()
  const navigate = useNavigate()
  const [numPages, setNumPages] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [signaturePos, setSignaturePos] = useState({ x: 100, y: 100 })
  const [signingToken, setSigningToken] = useState('')
  const containerRef = useRef(null)
  const { saved, handleSave } = useSignature(docId)

  const onDocumentLoad = ({ numPages }) => {
    setNumPages(numPages)
  }

  const handleDragEnd = (event) => {
    const { delta } = event
    setSignaturePos((prev) => ({
      x: prev.x + delta.x,
      y: prev.y + delta.y
    }))
  }

  const handleSaveClick = () => {
    if (!signingToken.trim()) {
      return alert('Please enter signing token first')
    }
    handleSave(signaturePos.x, signaturePos.y, currentPage, signingToken.trim())
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm mb-6">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-500 hover:text-gray-700 font-medium text-sm"
          >
            ← Back
          </button>
          <h1 className="text-lg font-bold text-gray-800">Place Signature</h1>
          <button
            onClick={handleSaveClick}
            className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-600 transition"
          >
            {saved ? '✅ Saved!' : 'Save Position'}
          </button>
        </div>
      </div>

      {/* Signing Token Input */}
      <div className="max-w-5xl mx-auto px-6 mb-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter Signing Token (from signing link)
          </label>
          <input
            type="text"
            placeholder="Paste signing token here..."
            value={signingToken}
            onChange={(e) => setSigningToken(e.target.value)}
            className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-400 mt-1">
            Generate signing link first, then paste the token here to link signature position
          </p>
        </div>
      </div>

      {/* Page Controls */}
      <div className="flex justify-center items-center gap-4 mb-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="bg-white border px-3 py-1 rounded-lg disabled:opacity-40 text-sm"
        >
          Prev
        </button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {numPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, numPages))}
          disabled={currentPage === numPages}
          className="bg-white border px-3 py-1 rounded-lg disabled:opacity-40 text-sm"
        >
          Next
        </button>
      </div>

      {/* PDF + Draggable Signature */}
      <div className="flex justify-center">
        <DndContext onDragEnd={handleDragEnd}>
          <div
            ref={containerRef}
            className="relative shadow-lg"
            style={{ display: 'inline-block' }}
          >
            <Document
              file={`http://localhost:5000/uploads/${filename}`}
              onLoadSuccess={onDocumentLoad}
            >
              <Page pageNumber={currentPage} width={700} />
            </Document>

            <DraggableSignature
              id="signature"
              x={signaturePos.x}
              y={signaturePos.y}
            />
          </div>
        </DndContext>
      </div>
    </div>
  )
}

export default PDFViewer