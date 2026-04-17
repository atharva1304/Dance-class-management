export default function StudentDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Due Payment</h3>
          <p className="text-3xl font-bold text-red-600">₹--</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Paid</h3>
          <p className="text-3xl font-bold text-green-600">₹--</p>
        </div>
      </div>
    </div>
  )
}
