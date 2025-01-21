/**
 * AudioController class handles all sound generation and audio processing
 * using the Web Audio API
 */
class AudioController {
    constructor() {
        // Initialize Web Audio API context and nodes
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.volume = 0.5;
        this.isMuted = false;
        
        // Create analyzer for visualizations
        this.analyser = this.audioContext.createAnalyser();
        
        // Create gain node for volume control
        this.gainNode = this.audioContext.createGain();
        this.waveform = 'sine';
        
        // Connect audio nodes: gainNode -> analyser -> destination
        this.gainNode.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
    }

    // Controls the volume level (0 to 1)
    setVolume(value) {
        this.volume = value;
        this.gainNode.gain.value = this.isMuted ? 0 : this.volume;
    }

    // Toggles mute state and returns the new state
    toggleMute() {
        this.isMuted = !this.isMuted;
        this.gainNode.gain.value = this.isMuted ? 0 : this.volume;
        return this.isMuted;
    }

    // Plays a musical note based on frequency
    playSound(note) {
        // Define frequencies for each musical note (in Hz)
        const frequencies = {
            'C': 261.63, 'D': 293.66, 'E': 329.63,
            'F': 349.23, 'G': 392.00, 'A': 440.00,
            'B': 493.88, 'C2': 523.25
        };

        // Create and configure oscillator
        const oscillator = this.audioContext.createOscillator();
        oscillator.connect(this.gainNode);
        oscillator.frequency.value = frequencies[note];
        oscillator.type = this.waveform;
        
        // Start sound and stop after 200ms
        oscillator.start();
        setTimeout(() => {
            oscillator.stop();
            oscillator.disconnect();
        }, 200);

        return oscillator;
    }
}

export default AudioController;