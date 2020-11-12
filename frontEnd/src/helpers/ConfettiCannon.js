import confetti from "canvas-confetti";

export default function confettiCannon() {
    var count = 250;
    var defaults = {
        origin: { y: 0.8 }
    };

    function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio)
        }));
    }

    fire(0.25, {
        spread: 56,
        startVelocity: 55,
    });
    fire(0.2, {
        spread: 120,
    });
    fire(0.55, {
        spread: 180,
        decay: 0.90,
        scalar: 0.8
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
    });
    fire(0.2, {
        spread: 120,
        startVelocity: 55,
    });
}