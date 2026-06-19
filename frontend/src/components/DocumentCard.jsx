import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SigningLinkModal from './SigningLinkModal'
import AuditModal from './AuditModal'

const statusConfig = {
  pending: { color: 'bg-yellow-50 text-yellow-600 border-yellow-200', label: 'Pending' },
  signed: { color: 'bg-green-50 text-green-600 border-green-200', label: 'Signed' },
  rejected: { color: 'bg-red-50 text-red-600 border-red-200', label: 'Rejected' }
}

const DocumentCard = ({ doc, onDelete }) => {
  const navigate = useNavigate()
  const [showSignModal, setShowSignModal] = useState(false)
  const [showAuditModal, setShowAuditModal] = useState(false)

 const handleDownload = () => {
  const filename = doc.signedFilename || doc.filename
  window.open(
    `${import.meta.env.VITE_API_URL?.replace('/api', '')}/uploads/${filename}`,
    '_blank'
  )
}

  const config = statusConfig[doc.status] || statusConfig.pending

  return (
    <>
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-xl">📄</span>
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{doc.originalName}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {new Date(doc.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric'
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-3 py-1 rounded-full border font-medium ${config.color}`}>
              {config.label}
            </span>
            {/* Delete button */}
            <button
              onClick={() => onDelete(doc._id)}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition"
              title="Delete document"
            >
              🗑️
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <button
            onClick={() => navigate(`/sign/${doc._id}/${doc.filename}`)}
            className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-100 transition"
          >
            ✏️ Place Signature
          </button>
          <button
            onClick={() => setShowSignModal(true)}
            className="bg-purple-50 text-purple-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-purple-100 transition"
          >
            🔗 Send for Signing
          </button>
          {doc.status === 'signed' && (
            <button
              onClick={handleDownload}
              className="bg-green-50 text-green-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-100 transition"
            >
              ⬇️ Download
            </button>
          )}
          <button
            onClick={() => setShowAuditModal(true)}
            className="bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-100 transition"
          >
            📋 Audit Trail
          </button>
        </div>
      </div>

      {showSignModal && (
        <SigningLinkModal
          docId={doc._id}
          onClose={() => setShowSignModal(false)}
        />
      )}
      {showAuditModal && (
        <AuditModal
          docId={doc._id}
          onClose={() => setShowAuditModal(false)}
        />
      )}
    </>
  )
}

export default DocumentCard