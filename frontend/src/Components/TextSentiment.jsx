import React, { useState } from "react"
import axios from "axios"
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

// Constants for model selection states
const DISTILBERT_STATE = "distilbert"
const CUSTOM_MODEL_STATE = "custommodel"

function TextSentiment() {
  // State to store the user input text
  const [input, setInput] = useState("")

  // State to store sentiment analysis results, initialized to a default array
  const [sentiment, setSentiment] = useState([[0, 0, 0]])

  // State to track the selected model (DISTILBERT_STATE or CUSTOM_MODEL_STATE)
  const [selectedModel, setSelectedModel] = useState(DISTILBERT_STATE)

  /**
   * Handles the submission of the text input for sentiment analysis
   * Sends a POST request to the Flask backend and updates the sentiment state
   */
  const handleSubmit = async () => {
    // Validate that the input is not empty
    if (!input) {
      alert("Please enter something")
      return
    }

    try {
      // Send the text and selected model info to the backend
      const response = await axios.post("/api/analyze-text-prog", {
        text: input,
        use_custom_model: selectedModel === CUSTOM_MODEL_STATE,
      })

      console.log("Response from Flask:", response.data)

      // Update the sentiment data with the results from the backend
      setSentiment(response.data.result)
    } catch (error) {
      console.error("Some random error happened:", error)
      alert("Unexpected error occurred.")
    }
  }

  /**
   * Transforms sentiment data into a format compatible with the Recharts LineChart
   * Each object represents a point on the chart with a text position and its positive sentiment score
   */
  const chartData = sentiment.map((senti) => ({
    position: senti[2], // x-axis value: text position
    positive: senti[1], // y-axis value: positive sentiment probability
  }))

  console.log(chartData)

  return (
    <>
      {/* Input Area for the user to enter text */}
      <div className="flex flex-col items-center">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your text here"
          rows={8}
          className="w-3/4 p-3 border border-gray-300 rounded-lg shadow-sm mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        ></textarea>
      </div>

      {/* Buttons for Model Selection */}
      <div className="flex flex-row flex-wrap justify-center items-center">
        <div>Choose model:</div>

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
        <button onClick={handleSubmit} className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition">
          Analyze
        </button>
      </div>

      {/* Chart Section to display sentiment analysis results */}
      <div className="mx-auto mt-8 w-9/12">
        <ResponsiveContainer height={400} className="mx-auto">
          <LineChart data={chartData}>
            {/* Gridlines for the chart */}
            <CartesianGrid strokeDasharray="3 3" />

            {/* X-axis: Represents the text position */}
            <XAxis dataKey="position" label={{ value: "Position", offset: -5, position: "insideBottom" }} />

            {/* Y-axis: Represents positive sentiment probability */}
            <YAxis label={{ value: "Positive Probability", angle: -90, position: "insideLeft" }} />

            {/* Tooltip to show data on hover */}
            <Tooltip />

            {/* Line to plot the sentiment data */}
            <Line type="monotone" dataKey="positive" stroke="#4caf50" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}

export default TextSentiment
