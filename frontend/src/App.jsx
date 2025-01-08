import React, { useEffect, useState } from "react"
import axios from "axios"

function App() {
  const [url, setUrl] = useState("")

  const handleSubmit = async () => {
    if (!url) {
      alert("Please enter a URL")
      return
    }

    try {
      const response = await axios.post("/api/submit-url", { url })
      console.log("Response from Flask:", response.data)
      alert("URL submitted successfully!")
    } catch (error) {
      console.error("Error sending URL:", error)
      alert("Failed to send URL.")
    }
  }

  return (
    <>
      <h1 className="text-center font-bold">Youtube video Sentiment Analyzer</h1>
      <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Enter a URL" />
      <button onClick={handleSubmit}>Submit</button>
    </>
  )
}

export default App
