import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import UploadSection from '../components/UploadSection'
import DocumentCard from '../components/DocumentCard'
import { useDocs } from '../hooks/useDocs'

const Dashboard = () => {
  const { docs, setFile, message, handleUpload, handleDelete } = useDocs()
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/login')
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <Navbar />
        <UploadSection
          onUpload={handleUpload}
          onFileChange={setFile}
          message={message}
        />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
            <p className="text-2xl font-bold text-gray-800">{docs.length}</p>
            <p className="text-xs text-gray-400 mt-1">Total Documents</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
            <p className="text-2xl font-bold text-green-600">
              {docs.filter(d => d.status === 'signed').length}
            </p>
            <p className="text-xs text-gray-400 mt-1">Signed</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
            <p className="text-2xl font-bold text-yellow-500">
              {docs.filter(d => d.status === 'pending').length}
            </p>
            <p className="text-xs text-gray-400 mt-1">Pending</p>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">My Documents</h2>
          {docs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-5xl mb-4">📭</p>
              <p className="text-gray-400 font-medium">No documents yet</p>
              <p className="text-gray-300 text-sm mt-1">Upload a PDF to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {docs.map((doc) => (
                <DocumentCard 
                  key={doc._id} 
                  doc={doc}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard