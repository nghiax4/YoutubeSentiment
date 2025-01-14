import React, { useState } from "react"
import axios from "axios"
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

// Constants for model selection states
const DISTILBERT_STATE = "distilbert"
const CUSTOM_MODEL_STATE = "custommodel"

function VideoSentiment() {
  // State to store the YouTube video ID input by the user
  const [videoId, setVideoId] = useState("")

  // State to store the video sentiment analysis results
  const [videoSentiment, setVideoSentiment] = useState([[0, 0, 0]])

  // State to track the selected model (DISTILBERT_STATE or CUSTOM_MODEL_STATE)
  const [selectedModel, setSelectedModel] = useState(DISTILBERT_STATE)

  /**
   * Handles the submission of the video ID for sentiment analysis
   * Sends a POST request to the Flask backend and updates the video sentiment state
   */
  const handleVideoSubmit = async () => {
    // Validate that the video ID input is not empty
    if (!videoId) {
      alert("Please enter a YouTube video ID")
      return
    }

    try {
      // Send the video ID and selected model info to the backend
      const response = await axios.post("/api/analyze-youtube", {
        video_id: videoId,
        use_custom_model: selectedModel === CUSTOM_MODEL_STATE,
      })

      console.log("Response from Flask (video):", response.data)

      // Update the video sentiment data with the results from the backend
      setVideoSentiment(response.data.result)
    } catch (error) {
      console.error("Error in video analysis:", error)
      alert("Unexpected error occurred.")
    }
  }

  /**
   * Transforms video sentiment data to a format compatible with the Recharts LineChart
   * Each object represents a point on the chart with a formatted time (mm:ss) and positive sentiment score
   */
  const videoChartData = videoSentiment.map((senti) => {
    const minutes = Math.floor(senti[2] / 60) // Calculate minutes from the time position
    const seconds = Math.floor(senti[2] % 60) // Calculate remaining seconds
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}` // Format as mm:ss
    return {
      position: formattedTime, // x-axis value: formatted time
      positive: senti[1], // y-axis value: positive sentiment probability
    }
  })

  console.log(videoChartData)

  return (
    <>
      {/* Input Area for YouTube Video ID */}
      <div className="flex flex-col items-center mb-8">
        <input
          type="text"
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
          placeholder="Enter YouTube Video ID here"
          className="w-3/4 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Buttons for Model Selection */}
      <div className="flex flex-row flex-wrap justify-center items-center">
        Choose model:
        {/* Button to select DistilBERT model */}
        <button
          onClick={() => setSelectedModel(DISTILBERT_STATE)}
          className={
            selectedModel === DISTILBERT_STATE
              ? "px-4 py-2 rounded-lg shadow m-2 transition bg-blue-500 text-white border-blue-500"
              : "px-4 py-2 rounded-lg shadow m-2 transition bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }
        >
          (HuggingFace) DistilBERT
        </button>
        {/* Button to select Custom Model */}
        <button
          onClick={() => setSelectedModel(CUSTOM_MODEL_STATE)}
          className={
            selectedModel === CUSTOM_MODEL_STATE
              ? "px-4 py-2 rounded-lg shadow m-2 transition bg-blue-500 text-white border-blue-500"
              : "px-4 py-2 rounded-lg shadow m-2 transition bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }
        >
          (Custom made) Support Vector Regressor
        </button>
      </div>

      {/* Analyze Button */}
      <div className="flex flex-col items-center pt-5">
        <button onClick={handleVideoSubmit} className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition">
          Analyze Vid
        </button>
      </div>

      {/* Video Chart Section to display sentiment analysis results */}
      <div className="mx-auto mt-8 w-9/12">
        <ResponsiveContainer height={400} className="mx-auto">
          <LineChart data={videoChartData}>
            {/* Gridlines for the chart */}
            <CartesianGrid strokeDasharray="3 3" />

            {/* X-axis: Represents the time in mm:ss format */}
            <XAxis dataKey="position" label={{ value: "Time (mm:ss)", offset: -5, position: "insideBottom" }} />

            {/* Y-axis: Represents positive sentiment probability */}
            <YAxis label={{ value: "Positive Probability", angle: -90, position: "insideLeft" }} />

            {/* Tooltip to show data on hover */}
            <Tooltip />

            {/* Line to plot the sentiment data */}
            <Line type="monotone" dataKey="positive" stroke="#2196f3" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}

export default VideoSentiment
