import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SigningLinkModal from './SigningLinkModal'
import AuditModal from './AuditModal'

const DocumentCard = ({ doc }) => {
  const navigate = useNavigate()
  const [showSignModal, setShowSignModal] = useState(false)
  const [showAuditModal, setShowAuditModal] = useState(false)

  return (
    <>
      <div className="flex justify-between items-center border p-3 rounded">
        <div>
          <p className="font-medium">{doc.originalName}</p>
          <p className="text-sm text-gray-400">
            {new Date(doc.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm px-3 py-1 rounded-full ${
            doc.status === 'signed' ? 'bg-green-100 text-green-600' :
            doc.status === 'rejected' ? 'bg-red-100 text-red-600' :
            'bg-yellow-100 text-yellow-600'
          }`}>
            {doc.status}
          </span>
          <button
            onClick={() => navigate(`/sign/${doc._id}/${doc.filename}`)}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
          >
            Place Signature
          </button>
          <button
            onClick={() => setShowSignModal(true)}
            className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
          >
            Send for Signing
          </button>
          <button
            onClick={() => setShowAuditModal(true)}
            className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
          >
            Audit Trail
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