
# Workflow: Extract Audio from Video
# Description: Extracts audio track from a video file and saves it as MP3.

# Usage: ./extract_audio.sh <input_video> [output_audio_name]

if [ -z "$1" ]; then
    echo "Usage: $0 <input_video> [output_audio_name]"
    exit 1
fi

INPUT_FILE="$1"
FILENAME=$(basename -- "$INPUT_FILE")
BASENAME="${FILENAME%.*}"

if [ -z "$2" ]; then
    OUTPUT_FILE="${BASENAME}.mp3"
else
    OUTPUT_FILE="$2"
fi

echo "Extracting audio from $INPUT_FILE to $OUTPUT_FILE..."

# -q:a 0 = Best variable bit rate quality
# -map a = Map only audio streams
ffmpeg -i "$INPUT_FILE" -q:a 0 -map a "$OUTPUT_FILE" -y

if [ $? -eq 0 ]; then
    echo "✅ Success! Audio saved to: $OUTPUT_FILE"
else
    echo "❌ Error extracting audio."
fi
