from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/data')
def get_data():
    return jsonify({'message': 'Hello from Flask!'})

@app.route('/api/submit-url', methods=['POST'])
def submit_url():
    data = request.get_json()
    url = data.get('url')

    for i in range(10**8):
        i += i

    if not url:
        return jsonify({'error': 'No URL provided'}), 400

    print(f'Received URL: {url}')
    # Process the URL here (e.g., save it, fetch data, etc.)
    return jsonify({'message': 'URL received successfully', 'url': url}), 200

if __name__ == '__main__':
    app.run(debug=True)