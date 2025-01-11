from flask import Flask, request, send_from_directory, jsonify
import model_utilities  # Import the sentiment analysis utility

# Initialize Flask app
app = Flask(__name__, static_folder='../frontend/dist', static_url_path='/')

# Serve the frontend (e.g., React/Vue/Angular app) from the 'dist' folder
#@app.route('/')
def serve():
    """
    Serves the main frontend page (index.html) when the root URL is accessed.

    Returns:
    - The `index.html` file from the `dist` folder.
    """
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/api/analyze-text', methods=['POST'])
def analyze_text():
    """
    API endpoint to receive a text payload, analyze its sentiment, and return the result.

    Method:
    - POST

    Payload (JSON):
    - 'text': The text to analyze for sentiment.

    Returns:
    - JSON response:
        - 'message': A success message.
        - 'result': Sentiment analysis results (e.g., [negative probability, positive probability]).
        - On error: Returns an error message with a 400 status code.
    """
    # Parse JSON data from the incoming request
    data = request.get_json()

    # Extract the 'text' field from the JSON payload
    text = data.get('text')

    # Validate the input: Ensure 'text' is provided
    if not text:
        return jsonify({'error': 'No Text provided'}), 400  # Return an error if 'text' is missing

    # Log the received text for debugging purposes
    print(f'Received Text: {text}')

    # Perform sentiment analysis using the imported utility function
    out = model_utilities.get_total_sentiment(text)

    # Return the sentiment analysis result as a JSON response
    return jsonify({'message': 'Text sentiment analyzed successfully', 'result': out}), 200

@app.route('/api/analyze-text-prog', methods=['POST'])
def analyze_text_prog():
    # Parse JSON data from the incoming request
    data = request.get_json()

    # Extract the 'text' field from the JSON payload
    text = data.get('text')

    # Validate the input: Ensure 'text' is provided
    if not text:
        return jsonify({'error': 'No Text provided'}), 400  # Return an error if 'text' is missing

    # Log the received text for debugging purposes
    print(f'Received Text: {text}')

    # Perform sentiment analysis using the imported utility function
    out = model_utilities.get_segmented_sentiment_wordcount(text=text, max_word_count=150)

    # Return the sentiment analysis result as a JSON response
    return jsonify({'message': 'Text sentiment analyzed successfully', 'result': out}), 200

# Run the Flask app in debug mode (useful for development)
if __name__ == '__main__':
    app.run(debug=True)