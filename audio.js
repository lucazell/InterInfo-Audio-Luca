
/**
 * AudioController class handles all sound generation and audio processing
 * using the Web Audio API
 */
class AudioController {
    constructor() {
        this.audioContext = null;
        this.gainNode = null;
        this.analyser = null;
        this.volume = 0.5;
        this.isMuted = false;
        this.waveform = 'sine';
        
        this.initializeAudioContext();
    }

    initializeAudioContext() {
        if (this.audioContext) return;

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();
        
        this.analyser = this.audioContext.createAnalyser();
        this.gainNode = this.audioContext.createGain();
        
        this.gainNode.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);

        this.setVolume(this.volume);
    }

    setVolume(value) {
        this.volume = value;
        if (this.gainNode) {
            this.gainNode.gain.value = this.isMuted ? 0 : this.volume;
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.gainNode) {
            this.gainNode.gain.value = this.isMuted ? 0 : this.volume;
        }
        return this.isMuted;
    }

    playSound(note, continuous = false) {
        this.initializeAudioContext();

        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        const frequencies = {
            'C': 261.63, 'D': 293.66, 'E': 329.63,
            'F': 349.23, 'G': 392.00, 'A': 440.00,
            'B': 493.88, 'C2': 523.25
        };

        const oscillator = this.audioContext.createOscillator();
        oscillator.connect(this.gainNode);
        oscillator.frequency.value = frequencies[note];
        oscillator.type = this.waveform;
        
        oscillator.start();
        
        if (!continuous) {
            setTimeout(() => {
                oscillator.stop();
                oscillator.disconnect();
            }, 200);
        }

        return oscillator;
    }
}

export default AudioController;
