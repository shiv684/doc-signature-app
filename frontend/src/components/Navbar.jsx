import { useAuth } from '../hooks/useAuth'

const Navbar = () => {
  const { handleLogout } = useAuth()
  const user = JSON.parse(localStorage.getItem('user'))

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-600">wellcome, {user?.name}</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Navbar