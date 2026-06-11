import { useAudit } from '../hooks/useAudit'

const AuditModal = ({ docId, onClose }) => {
  const { logs, loading } = useAudit(docId)

  const actionColor = (action) => {
    if (action === 'signed') return 'text-green-600 bg-green-100'
    if (action === 'rejected') return 'text-red-600 bg-red-100'
    if (action === 'viewed') return 'text-blue-600 bg-blue-100'
    return 'text-gray-600 bg-gray-100'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[500px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Audit Trail</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <p className="text-gray-400 text-center py-4">Loading...</p>
        ) : logs.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No audit logs found</p>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log._id} className="border p-3 rounded">
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${actionColor(log.action)}`}>
                    {log.action.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  By: {log.performedBy}
                </p>
                <p className="text-xs text-gray-400">
                  IP: {log.ipAddress}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AuditModal