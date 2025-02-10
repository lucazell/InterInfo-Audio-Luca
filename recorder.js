
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
        this.activeNotes = new Map(); // Track currently playing notes
        
        this.setupControls();
    }

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

    startRecording() {
        this.isRecording = true;
        this.recordedNotes = [];
        this.recordStartTime = Date.now();
        this.activeNotes.clear();
    }

    stopRecording() {
        // End any notes that are still active when recording stops
        this.activeNotes.forEach((startTime, note) => {
            this.recordNoteEnd(note);
        });
        this.isRecording = false;
    }

    recordNote(note) {
        if (this.isRecording) {
            const timestamp = Date.now();
            this.activeNotes.set(note, timestamp);
            this.recordedNotes.push({
                note: note,
                startTime: timestamp,
                endTime: null
            });
        }
    }

    recordNoteEnd(note) {
        if (this.isRecording && this.activeNotes.has(note)) {
            const endTime = Date.now();
            const noteIndex = this.recordedNotes.findIndex(n => 
                n.note === note && n.endTime === null
            );
            
            if (noteIndex !== -1) {
                this.recordedNotes[noteIndex].endTime = endTime;
            }
            this.activeNotes.delete(note);
        }
    }

    playRecording() {
        if (this.recordedNotes.length === 0) return;

        const playBtn = document.getElementById('playBtn');
        const recordBtn = document.getElementById('recordBtn');
        playBtn.disabled = true;
        recordBtn.disabled = true;

        const startTime = this.recordedNotes[0].startTime;
        const activeOscillators = new Map();
        
        this.recordedNotes.forEach(note => {
            // Schedule note start
            setTimeout(() => {
                const oscillator = this.audioController.playSound(note.note, true);
                activeOscillators.set(note.note, oscillator);
                const pad = document.querySelector(`[data-note="${note.note}"]`);
                if (pad) pad.classList.add('active');
            }, note.startTime - startTime);

            // Schedule note end
            setTimeout(() => {
                const oscillator = activeOscillators.get(note.note);
                if (oscillator) {
                    oscillator.stop();
                    activeOscillators.delete(note.note);
                }
                const pad = document.querySelector(`[data-note="${note.note}"]`);
                if (pad) pad.classList.remove('active');
            }, note.endTime - startTime);
        });

        // Re-enable buttons after the last note ends
        const lastNote = this.recordedNotes[this.recordedNotes.length - 1];
        setTimeout(() => {
            playBtn.disabled = false;
            recordBtn.disabled = false;
        }, lastNote.endTime - startTime + 200);
    }
}

export default Recorder;
