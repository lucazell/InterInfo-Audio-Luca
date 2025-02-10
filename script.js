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
        
        // Initialize visualizer after first interaction
        this.visualizer = null;
        
        // Track active oscillators
        this.activeOscillators = new Map();
        
        // Check if running on mobile
        this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        this.setupEventListeners();
        this.setupInitialInteraction();
        this.setupMobileHandling();
    }

    setupInitialInteraction() {
        const initializeAudio = () => {
            if (!this.visualizer) {
                this.visualizer = new Visualizer(this.audioController.analyser);
            }
            document.removeEventListener('click', initializeAudio);
            document.removeEventListener('touchstart', initializeAudio);
            document.removeEventListener('keydown', initializeAudio);
        };

        document.addEventListener('click', initializeAudio);
        document.addEventListener('touchstart', initializeAudio);
        document.addEventListener('keydown', initializeAudio);
    }

    setupMobileHandling() {
        if (this.isMobile) {
            // Add touch events for sound pads
            document.querySelectorAll('.sound-pad').forEach(pad => {
                pad.addEventListener('touchstart', (e) => {
                    e.preventDefault(); // Prevent default touch behavior
                    const note = pad.dataset.note;
                    const oscillator = this.audioController.playSound(note, true);
                    this.activeOscillators.set(note, oscillator);
                    this.effects.createRipple(pad);
                    this.recorder.recordNote(note);
                });

                pad.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    const note = pad.dataset.note;
                    const oscillator = this.activeOscillators.get(note);
                    if (oscillator) {
                        oscillator.stop();
                        this.activeOscillators.delete(note);
                    }
                });
            });
        }
    }

    setupEventListeners() {
        // Set up mouse events for sound pads (for desktop)
        document.querySelectorAll('.sound-pad').forEach(pad => {
            pad.addEventListener('mousedown', () => {
                const note = pad.dataset.note;
                const oscillator = this.audioController.playSound(note, true);
                this.activeOscillators.set(note, oscillator);
                this.effects.createRipple(pad);
                this.recorder.recordNote(note);
            });

            pad.addEventListener('mouseup', () => {
                const note = pad.dataset.note;
                const oscillator = this.activeOscillators.get(note);
                if (oscillator) {
                    oscillator.stop();
                    this.activeOscillators.delete(note);
                    this.recorder.recordNoteEnd(note);
                }
            });

            pad.addEventListener('mouseleave', () => {
                const note = pad.dataset.note;
                const oscillator = this.activeOscillators.get(note);
                if (oscillator) {
                    oscillator.stop();
                    this.activeOscillators.delete(note);
                    this.recorder.recordNoteEnd(note);
                }
            });
        });

        // Add window blur event to stop all sounds when switching tabs
        window.addEventListener('blur', () => {
            this.activeOscillators.forEach((oscillator, note) => {
                oscillator.stop();
                this.recorder.recordNoteEnd(note);
            });
            this.activeOscillators.clear();
            document.querySelectorAll('.sound-pad').forEach(pad => {
                pad.classList.remove('active');
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
            if (note && !e.repeat) {  // Prevent repeated keydown events
                const pad = document.querySelector(`[data-note="${note}"]`);
                if (pad) {
                    pad.classList.add('active');
                    const oscillator = this.audioController.playSound(note, true);
                    this.activeOscillators.set(note, oscillator);
                    this.effects.createRipple(pad);
                    this.recorder.recordNote(note);
                }
            }
        });

        document.addEventListener('keyup', (e) => {
            const note = keyMap[e.key.toLowerCase()];
            if (note) {
                const pad = document.querySelector(`[data-note="${note}"]`);
                if (pad) {
                    pad.classList.remove('active');
                    const oscillator = this.activeOscillators.get(note);
                    if (oscillator) {
                        oscillator.stop();
                        this.activeOscillators.delete(note);
                        this.recorder.recordNoteEnd(note);
                    }
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
