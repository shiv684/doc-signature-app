import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import PDFViewer from './pages/PDFViewer'
import SignRequest from './pages/SignRequest'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sign/:docId/:filename" element={<PDFViewer />} />
        <Route path="/sign-request/:token" element={<SignRequest />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App