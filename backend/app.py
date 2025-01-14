from flask import Flask, request, send_from_directory, jsonify
import model_util  # Import the sentiment analysis utility

# Initialize Flask app
app = Flask(__name__, static_folder='../frontend/dist', static_url_path='/')

# Serve the frontend (e.g., React/Vue/Angular app) from the 'dist' folder
@app.route('/')
def serve():
    """
    Serves the main frontend page (index.html) when the root URL is accessed.

    Returns:
    - The `index.html` file from the `dist` folder.
    """
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/analyze-text-prog', methods=['POST'])
def analyze_text_prog():
    """
    API endpoint for analyzing text sentiment in segments.

    Request JSON payload:
    - text (str): The text to analyze.
    - use_custom_model (bool): Whether to use the custom sentiment analysis model.

    Returns:
    - JSON response containing the sentiment analysis results.
    """
    # Parse JSON data from the incoming request
    data = request.get_json()

    # Extract the 'text' field and the model selection flag from the JSON payload
    text = data.get('text')
    use_custom_model = data.get('use_custom_model')

    # Validate the input: Ensure 'text' is provided
    if not text:
        return jsonify({'error': 'No Text provided'}), 400  # Return an error if 'text' is missing

    # Log the received text for debugging purposes
    print(f'Received Text: {text}')

    # Calculate the maximum word count per segment based on text length
    words_count = len(text.split(' '))
    max_word_count = (
        20 if words_count <= 100 else
        50 if words_count <= 250 else
        100 if words_count <= 250 else
        150
    )

    # Perform sentiment analysis using the imported utility function
    out = model_util.get_segmented_sentiment_wordcount(
        text=text, 
        max_word_count=max_word_count, 
        use_custom_model=use_custom_model
    )

    # Return the sentiment analysis result as a JSON response
    return jsonify({'message': 'Text sentiment analyzed successfully', 'result': out}), 200

@app.route('/api/analyze-youtube', methods=['POST'])
def analyze_youtube():
    """
    API endpoint for analyzing sentiment in YouTube video transcripts.

    Request JSON payload:
    - video_id (str): The YouTube video ID to analyze.
    - use_custom_model (bool): Whether to use the custom sentiment analysis model.

    Returns:
    - JSON response containing the sentiment analysis results.
    """
    from youtube_transcript_api import YouTubeTranscriptApi

    # Parse JSON data from the incoming request
    data = request.get_json()

    # Extract the 'video_id' field and the model selection flag from the JSON payload
    video_id = data.get('video_id')
    use_custom_model = data.get('use_custom_model')

    print(f'Received video id: {video_id}')

    # Retrieve the transcript for the given YouTube video ID
    transcript = YouTubeTranscriptApi.get_transcript(video_id)

    # Calculate the total video length using the last transcript segment
    video_length = transcript[-1]['start'] + transcript[-1]['duration']

    # Determine the segment split duration based on video length
    second_split = (
        20 if video_length <= 150 else
        40 if video_length <= 300 else
        60
    )

    # Perform sentiment analysis on the video transcript using the imported utility function
    out = model_util.get_segmented_sentiment_youtubecaption(
        data=transcript, 
        second=second_split, 
        use_custom_model=use_custom_model
    )

    # Return the sentiment analysis result as a JSON response
    return jsonify({'message': 'Text sentiment analyzed successfully', 'result': out}), 200

# Run the Flask app in debug mode (useful for development)
if __name__ == '__main__':
    app.run(debug=True)
