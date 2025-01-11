import React, { useEffect, useState } from "react"
import axios from "axios"
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

function TextSentiment() {
  const [input, setInput] = useState("")
  const [sentiment, setSentiment] = useState([[0, 0, 0]])

  const handleSubmit = async () => {
    if (!input) {
      alert("Please enter something")
      return
    }

    try {
      const response = await axios.post("/api/analyze-text-prog", { text: input })
      console.log("Response from Flask:", response.data)
      setSentiment(response.data.result)
    } catch (error) {
      console.error("Some random error happened:", error)
      alert("Unexpected error occurred.")
    }
  }

  // Transform sentiment data into a format compatible with Recharts
  const chartData = sentiment.map((senti) => ({
    position: senti[2], // Text position (x-axis)
    positive: senti[1], // Positive probability (y-axis)
  }))

  console.log(chartData)

  return (
    <>
      {/* Input Area */}
      <div className="flex flex-col items-center">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your text here"
          rows={8}
          className="w-3/4 p-3 border border-gray-300 rounded-lg shadow-sm mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        ></textarea>
      </div>

      <div className="flex flex-col items-center">
        <button onClick={handleSubmit} className="bg-green-500 text-white px-6 py-2 rounded-lg shadow hover:bg-green-600 transition">
          Analyze
        </button>
      </div>

      {/* Chart */}
      <div className="mx-auto mt-8 w-9/12">
        <ResponsiveContainer height={400} className="mx-auto">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="position" label={{ value: "Position", offset: -5, position: "insideBottom" }} />
            <YAxis label={{ value: "Positive Probability", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Line type="monotone" dataKey="positive" stroke="#4caf50" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}

export default TextSentiment
