const UploadSection = ({ onUpload, onFileChange, message }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Upload PDF</h2>
      <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-400 transition">
        <p className="text-4xl mb-2">📄</p>
        <p className="text-gray-400 text-sm mb-4">Select a PDF file to upload</p>
        <div className="flex gap-3 justify-center items-center flex-wrap">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => onFileChange(e.target.files[0])}
            className="text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
          />
          <button
            onClick={onUpload}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition active:scale-95"
          >
            Upload
          </button>
        </div>
        {message && (
          <p className="text-green-500 text-sm mt-3 font-medium">{message}</p>
        )}
      </div>
    </div>
  )
}

export default UploadSection