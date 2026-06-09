const UploadSection = ({ onUpload, onFileChange, message }) => {
  return (
    <div className="bg-white p-6 rounded shadow mb-6">
      <h2 className="text-lg font-semibold mb-4">Upload PDF</h2>
      <div className="flex gap-4 items-center">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => onFileChange(e.target.files[0])}
          className="border p-2 rounded"
        />
        <button
          onClick={onUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Upload
        </button>
      </div>
      {message && <p className="text-green-500 mt-2">{message}</p>}
    </div>
  )
}

export default UploadSection