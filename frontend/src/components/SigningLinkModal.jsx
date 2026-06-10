import { useState } from 'react'
import { useSigningLink } from '../hooks/useSigningLink'

const SigningLinkModal = ({ docId, onClose }) => {
  const [email, setEmail] = useState('')
  const { link, loading, error, handleGenerateLink } = useSigningLink()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Generate Signing Link</h2>

        {!link ? (
          <>
            <input
              type="email"
              placeholder="Signer's email address"
              className="w-full border p-2 rounded mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => handleGenerateLink(docId, email)}
                disabled={loading || !email}
                className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Link'}
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-2">Share this link with the signer:</p>
            <div className="bg-gray-100 p-3 rounded text-sm break-all mb-4">
              {link}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(link)
                alert('Link copied!')
              }}
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 mb-2"
            >
              Copy Link
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default SigningLinkModal