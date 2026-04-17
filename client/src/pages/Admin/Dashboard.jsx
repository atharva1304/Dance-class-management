export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Students</h3>
        <p className="text-3xl font-bold text-blue-600">--</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Revenue</h3>
        <p className="text-3xl font-bold text-green-600">₹--</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Expenses</h3>
        <p className="text-3xl font-bold text-red-600">₹--</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-600 text-sm font-semibold mb-2">Net Profit</h3>
        <p className="text-3xl font-bold text-purple-600">₹--</p>
      </div>
    </div>
  )
}
