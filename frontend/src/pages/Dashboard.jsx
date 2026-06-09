import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import UploadSection from '../components/UploadSection'
import DocumentCard from '../components/DocumentCard'
import { useDocs } from '../hooks/useDocs'

const Dashboard = () => {
  const { docs, setFile, message, handleUpload } = useDocs()
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/login')
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Navbar />
      <UploadSection
        onUpload={handleUpload}
        onFileChange={setFile}
        message={message}
      />
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">My Documents</h2>
        {docs.length === 0 ? (
          <p className="text-gray-400">No documents found</p>
        ) : (
          <div className="space-y-3">
            {docs.map((doc) => (
              <DocumentCard key={doc._id} doc={doc} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard