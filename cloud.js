class Cloud {
    constructor(canvas, x, y, width, height, speed, distanceAboveGround) {
        // Initialiserer skyens position, størrelse og hastighed
        this.canvas = canvas;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.distanceAboveGround = distanceAboveGround;
    }

    update() {
        // Opdaterer skyens position
        this.x -= this.speed;
        if (this.x + this.width < 0) {
            this.x = this.canvas.width;
        }
    }

    draw(ctx) {
        // Tegner skyen som en hvid firkant med sort kant
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}

function generateClouds(canvas, numClouds, groundHeights, distanceAboveGround) {
    // Genererer skyer med tilfældige positioner og størrelser
    const clouds = [];
    const highestPoint = Math.min(...groundHeights);
    for (let i = 0; i < numClouds; i++) {
        const x = Math.random() * canvas.width;
        const y = highestPoint - distanceAboveGround - (Math.random() * 100); // Varierer højden, de flyver i
        const width = 50 + Math.random() * 50;
        const height = 20 + Math.random() * 10;
        const speed = 0.5 + Math.random() * 1;
        clouds.push(new Cloud(canvas, x, y, width, height, speed, distanceAboveGround));
    }
    return clouds;
}

export { Cloud, generateClouds };
