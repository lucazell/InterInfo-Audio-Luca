/**
 * Recorder class handles recording and playback of sound sequences
 * storing timing information for accurate replay
 */
class Recorder {
    constructor(audioController) {
        this.audioController = audioController;
        this.isRecording = false;
        this.recordedNotes = [];
        this.recordStartTime = 0;
        
        this.setupControls();
    }

    // Set up record and play button event listeners
    setupControls() {
        const recordBtn = document.getElementById('recordBtn');
        const playBtn = document.getElementById('playBtn');

        recordBtn.addEventListener('click', () => {
            if (!this.isRecording) {
                this.startRecording();
                recordBtn.classList.add('recording');
                recordBtn.textContent = '⏹️ Stop';
                playBtn.disabled = true;
            } else {
                this.stopRecording();
                recordBtn.classList.remove('recording');
                recordBtn.textContent = '⏺️ Record';
                playBtn.disabled = false;
            }
        });

        playBtn.addEventListener('click', () => {
            this.playRecording();
        });
    }

    // Start recording mode
    startRecording() {
        this.isRecording = true;
        this.recordedNotes = [];
        this.recordStartTime = Date.now();
    }

    // Stop recording mode
    stopRecording() {
        this.isRecording = false;
    }

    // Record a note with its timestamp
    recordNote(note) {
        if (this.isRecording) {
            this.recordedNotes.push({
                note: note,
                timestamp: Date.now()
            });
        }
    }

    // Play back recorded sequence with correct timing
    playRecording() {
        if (this.recordedNotes.length === 0) return;

        const playBtn = document.getElementById('playBtn');
        const recordBtn = document.getElementById('recordBtn');
        playBtn.disabled = true;
        recordBtn.disabled = true;

        // Calculate relative timings from first note
        let startTime = this.recordedNotes[0].timestamp;
        
        // Play each note at its recorded time
        this.recordedNotes.forEach(note => {
            setTimeout(() => {
                this.audioController.playSound(note.note);
                const pad = document.querySelector(`[data-note="${note.note}"]`);
                if (pad) {
                    pad.classList.add('active');
                    setTimeout(() => pad.classList.remove('active'), 200);
                }
            }, note.timestamp - startTime);
        });

        // Re-enable buttons after playback
        setTimeout(() => {
            playBtn.disabled = false;
            recordBtn.disabled = false;
        }, this.recordedNotes[this.recordedNotes.length - 1].timestamp - startTime + 200);
    }
}

export default Recorder;