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
    handleSave(signaturePos.x, signaturePos.y, currentPage)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold">Place Signature</h1>
        <button
          onClick={handleSaveClick}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {saved ? '✅ Saved!' : 'Save Position'}
        </button>
      </div>

      {/* Page Controls */}
      <div className="flex justify-center items-center gap-4 mb-4">
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