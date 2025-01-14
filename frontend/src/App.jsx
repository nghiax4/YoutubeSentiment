import React, { useState } from "react"
import TextSentiment from "./Components/TextSentiment"
import VideoSentiment from "./Components/VideoSentiment"

function App() {
  // State to control the current analysis mode ("Analyze Just Text" or "Analyze Video")
  const [analysisMode, setAnalysisMode] = useState("Analyze Just Text")

  // State to control visibility for animation transitions
  const [show, setShow] = useState(true)

  /**
   * Function to handle changes in analysis mode
   * @param {string} mode - The new analysis mode to set
   */
  const handleModeChange = (mode) => {
    setShow(false) // Trigger fade-out animation by setting visibility to false

    setTimeout(() => {
      setAnalysisMode(mode) // Update the analysis mode after the fade-out animation
      setShow(true) // Trigger fade-in animation by setting visibility to true
    }, 300) // Wait for 300ms (duration of the fade-out animation) before updating
  }

  return (
    <div className="bg-green-50 min-h-screen h-full p-6">
      {/* Title Section */}
      <h1 className="text-center font-bold text-4xl text-green-600 mb-8">YouTube Video Sentiment Analyzer</h1>

      {/* Buttons Section: Allows users to toggle between analysis modes */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex space-x-4">
          {/* Button to set mode to "Analyze Just Text" */}
          <button
            onClick={() => handleModeChange("Analyze Just Text")}
            className="bg-green-500 text-white px-6 py-3 rounded-lg shadow hover:bg-green-600 transition"
          >
            Analyze Just Text
          </button>

          {/* Button to set mode to "Analyze Video" */}
          <button onClick={() => handleModeChange("Analyze Video")} className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition">
            Analyze Video
          </button>
        </div>
      </div>

      {/* Conditional Rendering Section with Transition Animation */}
      <div className={`transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0"}`}>
        {/* Render TextSentiment component when analysisMode is "Analyze Just Text" */}
        {analysisMode === "Analyze Just Text" && <TextSentiment />}

        {/* Render VideoSentiment component when analysisMode is "Analyze Video" */}
        {analysisMode === "Analyze Video" && <VideoSentiment />}
      </div>
    </div>
  )
}

export default App
