from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)
sentiment_pipeline = pipeline("sentiment-analysis")

@app.route('/api/data')
def get_data():
    return jsonify({'message': 'Hello from Flask!'})

@app.route('/api/submit-url', methods=['POST'])
def submit_url():
    data = request.get_json()
    print('Chat wtf is this:\n', data)

    text = data.get('text')

    if not text:
        return jsonify({'error': 'No Text provided'}), 400

    print(f'Received Text: {text}')

    out = sentiment_pipeline(text)

    # Process the URL here (e.g., save it, fetch data, etc.)
    return jsonify({'message': 'Text sentiment analyzed successfully', 'result': out}), 200

if __name__ == '__main__':
    app.run(debug=True)