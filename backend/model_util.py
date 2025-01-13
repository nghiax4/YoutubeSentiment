from typing import List
from transformers import pipeline

# Create a sentiment analysis pipeline using the pretrained model
pipe = pipeline("text-classification", model="distilbert/distilbert-base-uncased-finetuned-sst-2-english")

def chunk_text(text: str, max_word_count: int = 400, overlap: int = 20):
    """
    Splits a large text into smaller chunks to fit within the model's input size.

    Parameters:
    - text (str): The input text to be chunked.
    - max_word_count (int): Maximum number of words per chunk (default: 400).
    - overlap (int): Number of overlapping words between consecutive chunks (default: 50).

    Returns:
    - List[str]: A list of text chunks.
    """
    words = text.split(' ')
    chunks = []
    for i in range(0, len(words), max_word_count - overlap):
        print('Somethin somethin ', ' '.join(words[i:i + max_word_count]), '\n\n')
        # Create a chunk of words
        chunk = ' '.join(words[i:i + max_word_count])
        chunks.append(chunk)

    return chunks


def get_total_sentiment(text: str) -> List[float]:
    """
    Calculates the overall sentiment of a given text.

    Parameters:
    - text (str): The input text to analyze.

    Returns:
    - List[float]: A list containing [negative sentiment probability, positive sentiment probability].
    """
    # Split the text into TINY chunks to avoid exceeding Render's memory limit
    chunks = chunk_text(text=text, max_word_count=100, overlap=20)
    
    # Perform sentiment analysis on each chunk
    result = pipe(chunks)
    
    # Convert model output to probabilities for negative and positive sentiment
    all_probabilities = [
        [tmp['score'], 1 - tmp['score']] if tmp['label'] == 'NEGATIVE' else [1 - tmp['score'], tmp['score']]
        for tmp in result
    ]

    print('probs:', all_probabilities)  # Debugging

    # Calculate the average probabilities for negative and positive sentiment
    average_probabilities = [sum(p[0] for p in all_probabilities) / len(chunks), sum(p[1] for p in all_probabilities) / len(chunks)]

    return average_probabilities


def get_segmented_sentiment_youtubecaption(data: List[dict], second: int) -> List[List[float]]:
    """
    Segments text data into time-based chunks and calculates sentiment for each chunk.

    Parameters:
    - data (List[dict]): A list of dictionaries, where each dictionary contains:
        - 'start' (float): Start time of the text in seconds.
        - 'text' (str): The text content.
        - 'duration' (float)
    - second (int): Time interval (in seconds) for segmenting the text.

    Returns:
    - List[List[float]]: A list where each element contains:
        - Negative sentiment probability (float).
        - Positive sentiment probability (float).
        - Start time of the segment (float).
    """
    chunks = []  # Stores the segmented text
    start_time_of_chunk = []  # Stores the start time of each segment

    for i in data:
        # Determine the index of the segment based on the start time
        idx = int(i['start'] / second)

        # Ensure the chunks list has enough space for the current segment
        while idx >= len(chunks):
            chunks.append('')
            start_time_of_chunk.append(-1)

        # Append the text to the appropriate segment
        chunks[idx] += i['text'] + ' '
        # Record the start time of the segment if it hasn't been set yet
        if start_time_of_chunk[idx] == -1:
            start_time_of_chunk[idx] = i['start']

    # Perform sentiment analysis for each text segment
    all_probabilities = [get_total_sentiment(chunk) for chunk in chunks]

    # Combine sentiment probabilities and start times into the final output
    return [
        [all_probabilities[i][0], all_probabilities[i][1], start_time_of_chunk[i]]
        for i in range(len(chunks))
    ]

def get_segmented_sentiment_wordcount(text: str, max_word_count: int) -> List[List[float]]:
    # Use chunk_text to split the text into segments
    chunks = chunk_text(text=text, max_word_count=max_word_count, overlap=0)
    
    # Calculate starting word indices for each chunk
    words = text.split(' ')
    starting_indices = [i for i in range(0, len(words), max_word_count)]

    # Perform sentiment analysis for each chunk
    all_probabilities = [get_total_sentiment(chunk) for chunk in chunks]

    # Combine sentiment probabilities with starting indices
    return [
        [all_probabilities[i][0], all_probabilities[i][1], starting_indices[i]]
        for i in range(len(chunks))
    ]

def get_segmented_sentiment_wordcount_two(text: str, max_word_count: int) -> List[List[float]]:
    """
    Segments the input text into chunks based on a word count limit,
    analyzes sentiment for each chunk, and combines the results with starting indices.

    Parameters:
    - text (str): The input text to analyze.
    - max_word_count (int): Maximum number of words per chunk.

    Returns:
    - List[List[float]]: A list of [negative probability, positive probability, starting index].
    """
    words = text.split(' ')  # Split text into words for indexing
    results = []             # Final list to store results

    # Iterate over chunks and calculate sentiment probabilities
    for i in range(0, len(words), max_word_count):
        # Create the chunk for the current segment
        chunk = ' '.join(words[i:i + max_word_count])

        # Perform sentiment analysis using pipe
        result = pipe(chunk)[0]  # Analyze one chunk at a time
        probabilities = (
            [result['score'], 1 - result['score']] if result['label'] == 'NEGATIVE'
            else [1 - result['score'], result['score']]
        )

        # Append the sentiment probabilities along with the starting index
        results.append([probabilities[0], probabilities[1], i])

    return results