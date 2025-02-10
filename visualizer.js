/**
 * Visualizer class creates real-time audio visualization
 * using Canvas API and AudioContext analyzer node
 */
class Visualizer {
    constructor(audioAnalyser) {
        this.analyser = audioAnalyser;
        this.hue = 0;
        this.canvas = document.getElementById('visualizer');
        this.ctx = this.canvas.getContext('2d');
        
        this.setupCanvas();
        this.startVisualization();
    }

    // Configure canvas size and analyzer settings
    setupCanvas() {
        const resize = () => {
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
        };
        
        window.addEventListener('resize', resize);
        resize();

        // Set FFT size for frequency analysis
        this.analyser.fftSize = 256;
    }

    // Start the visualization animation loop
    startVisualization() {
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            requestAnimationFrame(draw);
            
            // Get frequency data from analyzer
            this.analyser.getByteFrequencyData(dataArray);
            
            // Clear canvas with fade effect
            this.ctx.fillStyle = 'rgba(26, 31, 44, 0.2)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            const barWidth = this.canvas.width / bufferLength * 2.5;
            let x = 0;

            // Cycle through colors for rainbow effect
            this.hue = (this.hue + 1) % 360;
            
            // Draw frequency bars
            for(let i = 0; i < bufferLength; i++) {
                const barHeight = (dataArray[i] / 255) * this.canvas.height;
                
                // Create gradient for bars
                const gradient = this.ctx.createLinearGradient(0, this.canvas.height, 0, 0);
                gradient.addColorStop(0, `hsl(${this.hue}, 80%, 50%)`);
                gradient.addColorStop(1, `hsl(${(this.hue + 60) % 360}, 80%, 50%)`);
                
                this.ctx.fillStyle = gradient;

                // Draw mirrored bars
                const centerY = this.canvas.height / 2;
                const halfHeight = barHeight / 2;
                
                // Draw top triangle
                this.ctx.beginPath();
                this.ctx.moveTo(x, centerY - halfHeight);
                this.ctx.lineTo(x + barWidth, centerY - halfHeight);
                this.ctx.lineTo(x + barWidth/2, centerY - halfHeight - 20);
                this.ctx.closePath();
                this.ctx.fill();
                
                // Draw bottom triangle
                this.ctx.beginPath();
                this.ctx.moveTo(x, centerY + halfHeight);
                this.ctx.lineTo(x + barWidth, centerY + halfHeight);
                this.ctx.lineTo(x + barWidth/2, centerY + halfHeight + 20);
                this.ctx.closePath();
                this.ctx.fill();
                
                x += barWidth + 1;
            }

            // Add glow effect
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = `hsl(${this.hue}, 80%, 50%)`;
        };
        
        draw();
    }
}

export default Visualizer;