import React, { useEffect, useState } from "react"
import axios from "axios"

function App() {
  const [input, setInput] = useState("")
  const [sentiment, setSentiment] = useState([[0, 0]])

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
  }));

  return (
    <>
      <h1 className="text-center font-bold">Youtube video Sentiment Analyzer</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your text here"
        rows={10} // Number of visible rows
        cols={50} // Width of the textarea
      ></textarea>
      <button onClick={handleSubmit}>Submit</button>
      <h2>
        {sentiment.map((senti, index) => (
          <li key={index}>{senti[0]}, {senti[1]}, {senti[2]}</li>
        ))
        }
      </h2>
    </>
  )
}

export default App
