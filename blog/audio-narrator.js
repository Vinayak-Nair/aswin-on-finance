/**
 * Audio Narrator for Blog Posts
 * Uses pre-generated AI audio files (English Only).
 */

document.addEventListener('DOMContentLoaded', () => {
    const articleContent = document.querySelector('.article-content');
    if (!articleContent) return;

    // Inject Player UI
    const playerContainer = document.createElement('div');
    playerContainer.className = 'audio-player-container';
    playerContainer.innerHTML = `
        <div class="audio-player">
            <button id="audio-play-btn" class="audio-control-btn">
                <span class="icon-play">▶</span>
                <span class="icon-pause" style="display:none;">⏸</span>
            </button>
            <div class="audio-info">
                <div class="audio-meta">
                    <span class="audio-label">Listen to article</span>
                </div>
                <span class="audio-status">Ready</span>
            </div>
        </div>
    `;

    // Insert before the article content
    articleContent.parentNode.insertBefore(playerContainer, articleContent);

    // Variables
    let isPlaying = false;
    let audioFile = null;

    // Setup Audio
    // File convention: {postId}-en.mp3
    const filename = '../audio/1-en.mp3';
    audioFile = new Audio(filename);

    // Elements
    const playBtn = document.getElementById('audio-play-btn');
    const statusEl = document.querySelector('.audio-status');
    const playIcon = document.querySelector('.icon-play');
    const pauseIcon = document.querySelector('.icon-pause');

    // Event Listeners
    audioFile.addEventListener('ended', () => {
        isPlaying = false;
        updateUIState(false);
        updateStatus('Ready');
        audioFile.currentTime = 0;
    });

    audioFile.addEventListener('error', () => {
        updateStatus('Audio Missing');
        console.error(`Audio file (${filename}) not found.`);
        isPlaying = false;
        updateUIState(false);
    });

    function updateStatus(text) {
        statusEl.textContent = text;
    }

    function updateUIState(playing) {
        if (playing) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'inline';
        } else {
            playIcon.style.display = 'inline';
            pauseIcon.style.display = 'none';
        }
    }

    // Play/Pause Toggle
    playBtn.addEventListener('click', () => {
        if (!audioFile) return;

        if (!isPlaying) {
            audioFile.play().then(() => {
                isPlaying = true;
                updateUIState(true);
                updateStatus('Playing...');
            }).catch(e => {
                console.error("Playback failed", e);
                updateStatus('Error');
            });
        } else if (audioFile.paused) {
            audioFile.play();
            isPlaying = true;
            updateUIState(true);
            updateStatus('Playing...');
        } else {
            audioFile.pause();
            isPlaying = false;
            updateUIState(false);
            updateStatus('Paused');
        }
    });

    // Cleanup
    window.addEventListener('beforeunload', () => {
        if (audioFile) audioFile.pause();
    });
});
