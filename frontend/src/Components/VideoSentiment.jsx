import React, { useEffect, useState } from "react"
import axios from "axios"
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

function VideoSentiment() {
  const [videoId, setVideoId] = useState("")
  const [videoSentiment, setVideoSentiment] = useState([[0, 0, 0]])

  // Submit for video analysis
  const handleVideoSubmit = async () => {
    if (!videoId) {
      alert("Please enter a YouTube video ID")
      return
    }

    try {
      const response = await axios.post("/api/analyze-youtube", { video_id: videoId })
      console.log("Response from Flask (video):", response.data)
      setVideoSentiment(response.data.result)
    } catch (error) {
      console.error("Error in video analysis:", error)
      alert("Unexpected error occurred.")
    }
  }

  // Transform video sentiment data to include mm:ss format
  const videoChartData = videoSentiment.map((senti) => {
    const minutes = Math.floor(senti[2] / 60) // Calculate minutes
    const seconds = Math.floor(senti[2] % 60) // Calculate remaining seconds
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}` // Format as mm:ss
    return {
      position: formattedTime, // Use formatted mm:ss for x-axis
      positive: senti[1], // Positive probability (y-axis)
    }
  })

  console.log(videoChartData)

  return (
    <>
      {/* YouTube Video ID Input Area */}
      <div className="flex flex-col items-center mb-8">
        <input
          type="text"
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
          placeholder="Enter YouTube Video ID here"
          className="w-3/4 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex flex-col items-center">
        <button onClick={handleVideoSubmit} className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition">
          Analyze Vid
        </button>
      </div>

      {/* Video Chart */}
      <div className="mx-auto mt-8 w-9/12">
        <ResponsiveContainer height={400} className="mx-auto">
          <LineChart data={videoChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="position" label={{ value: "Time (mm:ss)", offset: -5, position: "insideBottom" }} />
            <YAxis label={{ value: "Positive Probability", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Line type="monotone" dataKey="positive" stroke="#2196f3" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}

export default VideoSentiment
