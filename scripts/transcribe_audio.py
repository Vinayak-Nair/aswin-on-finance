
import os
import sys
import torch
from transformers import pipeline

def transcribe(audio_path):
    if not os.path.exists(audio_path):
        print(f"Error: File {audio_path} not found.")
        sys.exit(1)

    print(f"Loading Whisper model (this may take a moment)...")
    device = "cuda:0" if torch.cuda.is_available() else "cpu"
    
    # Using openai/whisper-base for a good balance of speed and accuracy
    # chunk_length_s=30 enables long-form transcription for files > 30s
    transcriber = pipeline("automatic-speech-recognition", model="openai/whisper-base", device=device, chunk_length_s=30)

    print(f"Transcribing {audio_path}...")
    # return_timestamps=True is implicitly handled by chunking in pipeline, but setting explicit batch_size helps
    result = transcriber(audio_path, batch_size=8, return_timestamps=True)
    
    transcript = result["text"]
    print("\n--- Transcription ---")
    print(transcript)
    print("---------------------\n")

    # Save to file
    output_file = os.path.splitext(audio_path)[0] + ".txt"
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(transcript)
    
    print(f"Saved transcription to: {output_file}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/transcribe_audio.py <audio_file>")
        sys.exit(1)
    
    audio_file = sys.argv[1]
    transcribe(audio_file)
