/**
 * Main application file that initializes all components
 * and sets up event listeners for user interaction
 */
import AudioController from './audio.js';
import Visualizer from './visualizer.js';
import Effects from './effects.js';
import Recorder from './recorder.js';

class SoundExplorer {
    constructor() {
        // Initialize core components
        this.audioController = new AudioController();
        this.effects = new Effects();
        this.recorder = new Recorder(this.audioController);
        this.visualizer = new Visualizer(this.audioController.analyser);
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Set up click handlers for sound pads
        document.querySelectorAll('.sound-pad').forEach(pad => {
            pad.addEventListener('click', () => {
                this.audioController.playSound(pad.dataset.note);
                this.effects.createRipple(pad);
                this.recorder.recordNote(pad.dataset.note);
            });
        });

        // Map keyboard keys to notes
        const keyMap = {
            'a': 'C', 's': 'D', 'd': 'E', 'f': 'F',
            'g': 'G', 'h': 'A', 'j': 'B', 'k': 'C2'
        };

        // Set up keyboard controls
        document.addEventListener('keydown', (e) => {
            const note = keyMap[e.key.toLowerCase()];
            if (note) {
                const pad = document.querySelector(`[data-note="${note}"]`);
                if (pad) {
                    pad.classList.add('active');
                    this.audioController.playSound(note);
                    this.effects.createRipple(pad);
                    this.recorder.recordNote(note);
                    setTimeout(() => pad.classList.remove('active'), 200);
                }
            }
        });

        // Set up volume and mute controls
        const volumeSlider = document.getElementById('volumeSlider');
        const muteBtn = document.getElementById('muteBtn');

        volumeSlider.addEventListener('input', (e) => {
            this.audioController.setVolume(e.target.value / 100);
        });

        muteBtn.addEventListener('click', () => {
            const isMuted = this.audioController.toggleMute();
            muteBtn.textContent = isMuted ? '🔈' : '🔊';
        });

        // Set up waveform selection
        const waveformSelect = document.getElementById('waveform');
        waveformSelect.addEventListener('change', (e) => {
            this.audioController.waveform = e.target.value;
        });
    }
}

// Initialize the application when the page loads
window.addEventListener('load', () => {
    new SoundExplorer();
});