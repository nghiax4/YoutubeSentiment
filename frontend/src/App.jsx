import React, { useEffect, useState } from "react"
import axios from "axios"

function App() {
  const [input, setInput] = useState("")
  const [sentiment, setSentiment] = useState("Please enter text")

  const handleSubmit = async () => {
    if (!input) {
      alert("Please enter something")
      return
    }

    try {
      const response = await axios.post("/api/submit-url", { 'text': input })
      console.log("Response from Flask:", response.data)
      //alert("Text submitted successfully!")
      setSentiment(response.data.result[0].label + ", " + response.data.result[0].score)
    } catch (error) {
      console.error("Error sending text:", error)
      alert("Failed to send text.")
    }
  }

  return (
    <>
      <h1 className="text-center font-bold">Youtube video Sentiment Analyzer</h1>
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text" />
      <button onClick={handleSubmit}>Submit</button>
      <h2>{sentiment}</h2>
    </>
  )
}

export default App
