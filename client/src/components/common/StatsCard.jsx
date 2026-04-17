import React from 'react'

function StatsCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-600 font-semibold">{label}</h3>
        <span className="text-3xl">{icon}</span>
      </div>
      <div className="text-3xl font-bold text-gradient bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
        {value}
      </div>
    </div>
  )
}

export default StatsCard
