import { useAuth } from '../hooks/useAuth'

const Navbar = () => {
  const { handleLogout } = useAuth()
  const user = JSON.parse(localStorage.getItem('user'))

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
          <span className="text-white text-lg">✍️</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">DocSign</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-800">{user?.name}</p>
          <p className="text-xs text-gray-400">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-50 text-red-500 border border-red-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-100 transition"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Navbar