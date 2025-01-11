import React, { useEffect, useState } from "react"
import TextSentiment from "./Components/TextSentiment"
import VideoSentiment from "./Components/VideoSentiment"

function App() {
  const [analysisMode, setAnalysisMode] = useState("Analyze Just Text")
  const [show, setShow] = useState(true) // Control visibility for animation

  const handleModeChange = (mode) => {
    setShow(false) // Trigger fade-out animation
    setTimeout(() => {
      setAnalysisMode(mode) // Change the mode after animation
      setShow(true) // Trigger fade-in animation
    }, 300) // Duration of the fade-out animation (in milliseconds)
  }

  return (
    <div className="bg-green-50 min-h-screen h-full p-6">
      {/* Title */}
      <h1 className="text-center font-bold text-4xl text-green-600 mb-8">YouTube Video Sentiment Analyzer</h1>

      {/* Buttons Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex space-x-4">
          <button
            onClick={() => handleModeChange("Analyze Just Text")}
            className="bg-green-500 text-white px-6 py-3 rounded-lg shadow hover:bg-green-600 transition"
          >
            Analyze Just Text
          </button>
          <button onClick={() => handleModeChange("Analyze Video")} className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition">
            Analyze Video
          </button>
        </div>
      </div>

      {/* Conditional Rendering with Animation */}
      <div className={`transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0"}`}>
        {analysisMode === "Analyze Just Text" && <TextSentiment />}
        {analysisMode === "Analyze Video" && <VideoSentiment />}
      </div>
    </div>
  )
}

export default App
