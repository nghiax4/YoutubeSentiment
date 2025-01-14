from typing import List
from transformers import pipeline
import cloudpickle

# Create a sentiment analysis pipeline using the pretrained model
# This uses the DistilBERT model fine-tuned for sentiment analysis
# (distilbert-base-uncased-finetuned-sst-2-english)
distilbert = pipeline("text-classification", model="distilbert/distilbert-base-uncased-finetuned-sst-2-english")

# Load the custom trained Support Vector Regressor model from a file
with open("../ml_model/svr_pipeline.pkl", "rb") as file:
    custom_model = cloudpickle.load(file)

def chunk_text(text: str, max_word_count: int = 400, overlap: int = 20) -> List[str]:
    """
    Splits text into chunks of a specified maximum word count, with optional overlap between chunks.

    Args:
    - text (str): The input text to be chunked.
    - max_word_count (int): Maximum number of words per chunk.
    - overlap (int): Number of overlapping words between consecutive chunks.

    Returns:
    - List[str]: List of text chunks.
    """
    words = text.split(' ')
    chunks = []
    for i in range(0, len(words), max_word_count - overlap):
        chunk = ' '.join(words[i:i + max_word_count])
        print('Chunking text: ', chunk, '\n\n')  # Debugging
        chunks.append(chunk)
    return chunks

def get_total_sentiment(text: str, use_custom_model: bool) -> List[float]:
    """
    Calculates the overall sentiment of the text using the selected model.

    Args:
    - text (str): The input text for sentiment analysis.
    - use_custom_model (bool): Whether to use the custom trained model.

    Returns:
    - List[float]: Average probabilities for negative and positive sentiment.
    """
    # Split the text into smaller chunks for processing
    chunks = chunk_text(text=text, max_word_count=100, overlap=50)  # TODO: Adjust parameters as needed

    # Perform sentiment analysis on each chunk using the selected model
    result = distilbert(chunks) if not use_custom_model else custom_model.predict(chunks)

    # Convert model output to probabilities
    if not use_custom_model:
        all_probabilities = [
            [tmp['score'], 1 - tmp['score']] if tmp['label'] == 'NEGATIVE' else [1 - tmp['score'], tmp['score']]
            for tmp in result
        ]
    else:
        all_probabilities = [[1 - pos_prob, pos_prob] for pos_prob in result]

    print('Sentiment probabilities:', all_probabilities)  # Debugging

    # Calculate average probabilities
    average_probabilities = [
        sum(p[0] for p in all_probabilities) / len(chunks),
        sum(p[1] for p in all_probabilities) / len(chunks)
    ]

    return average_probabilities

def get_segmented_sentiment_youtubecaption(data: List[dict], second: int, use_custom_model: bool) -> List[List[float]]:
    """
    Segments YouTube video captions into time-based chunks and analyzes their sentiment.

    Args:
    - data (List[dict]): List of caption segments with "start", "text", and "duration" fields. Note that "duration" is currently unused.
    - second (int): Time duration for each segment in seconds.
    - use_custom_model (bool): Whether to use the custom trained model.

    Returns:
    - List[List[float]]: List of sentiment probabilities with start times.
    """
    chunks = []  # Stores text segments
    start_time_of_chunk = []  # Stores start times of segments

    for i in data:
        # Determine segment index by start time; "duration" is not used in this logic
        idx = int(i['start'] / second)  # Determine segment index by start time

        # Ensure the chunk lists are long enough
        while idx >= len(chunks):
            chunks.append('')
            start_time_of_chunk.append(-1)

        # Append text to the appropriate segment
        chunks[idx] += i['text'] + ' '
        if start_time_of_chunk[idx] == -1:
            start_time_of_chunk[idx] = i['start']

    # Perform sentiment analysis for each segment
    all_probabilities = [
        get_total_sentiment(text=chunk, use_custom_model=use_custom_model)
        for chunk in chunks
    ]

    # Combine results with start times
    return [
        [all_probabilities[i][0], all_probabilities[i][1], start_time_of_chunk[i]]
        for i in range(len(chunks))
    ]

def get_segmented_sentiment_wordcount(text: str, max_word_count: int, use_custom_model: bool) -> List[List[float]]:
    """
    Segments text into word-based chunks and analyzes their sentiment.

    Args:
    - text (str): Input text to analyze.
    - max_word_count (int): Maximum number of words per chunk.
    - use_custom_model (bool): Whether to use the custom trained model.

    Returns:
    - List[List[float]]: List of sentiment probabilities with starting word indices.
    """
    # Split the text into chunks
    chunks = chunk_text(text=text, max_word_count=max_word_count, overlap=0)

    # Calculate starting indices for each chunk
    words = text.split(' ')
    starting_indices = [i for i in range(0, len(words), max_word_count)]

    # Perform sentiment analysis for each chunk
    all_probabilities = [
        get_total_sentiment(text=chunk, use_custom_model=use_custom_model)
        for chunk in chunks
    ]

    # Combine results with starting indices
    return [
        [all_probabilities[i][0], all_probabilities[i][1], starting_indices[i]]
        for i in range(len(chunks))
    ]
