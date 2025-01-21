/**
 * Effects class handles visual effects and easter eggs
 * including ripple animations and secret code detection
 */
class Effects {
    constructor() {
        this.secretCode = '';
        this.secretWord = 'MUSIC';
        this.setupSecretCodeDetection();
    }

    // Creates a ripple effect when a pad is clicked
    createRipple(pad) {
        // Create ripple element
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        
        // Match ripple color to pad color
        const padColor = window.getComputedStyle(pad).backgroundColor;
        ripple.style.borderColor = padColor;
        
        // Position ripple in center of pad
        const rect = pad.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.transform = 'translate(-50%, -50%)';

        // Add ripple to pad and remove after animation
        pad.appendChild(ripple);
        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    }

    // Easter egg animation triggered by secret code
    triggerEasterEgg() {
        const pads = document.querySelectorAll('.sound-pad');
        let delay = 0;
        
        // Trigger rainbow animation on each pad with staggered delay
        pads.forEach(pad => {
            setTimeout(() => {
                pad.style.animation = 'rainbow 2s';
                pad.addEventListener('animationend', () => {
                    pad.style.animation = '';
                }, { once: true });
            }, delay);
            delay += 100;
        });
    }

    // Detects when user types the secret word
    setupSecretCodeDetection() {
        document.addEventListener('keyup', (e) => {
            this.secretCode += e.key.toUpperCase();
            if (this.secretCode.length > this.secretWord.length) {
                this.secretCode = this.secretCode.slice(1);
            }
            
            if (this.secretCode === this.secretWord) {
                this.triggerEasterEgg();
                this.secretCode = '';
            }
        });
    }
}

export default Effects;