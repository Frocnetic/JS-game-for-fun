class Player {
    constructor(x, y, canvas, options = {}) {
        // Initialiserer spillerens position, størrelse og andre egenskaber
        this.x = x;
        this.y = y;
        this.width = options.width || 20;
        this.height = options.height || 20;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = options.speed || 2;
        this.gravity = options.gravity || 0.5;
        this.jumpStrength = options.jumpStrength || 10;
        this.onGround = false;
        this.onCloud = null; // Sporer skyen, som spilleren står på
        this.canvas = canvas; // Reference til canvas for grænsekontrol
        this.jumps = 2; // Antal hop, spilleren har tilbage
        this.reverseGravity = false; // Om tyngdekraften er omvendt
    }

    update(groundHeights, clouds) {
        // Anvender tyngdekraft
        this.velocityY += this.reverseGravity ? -this.gravity : this.gravity;

        // Flytter spilleren
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Tjekker for kollision med jorden eller loftet
        const groundHeight = groundHeights[Math.floor(this.x)];
        if (this.reverseGravity) {
            if (this.y < 0) {
                this.y = 0;
                this.velocityY = 0;
                this.onGround = true;
                this.onCloud = null;
                this.jumps = 2; // Nulstiller hop, når spilleren er på loftet
                this.reverseGravity = false; // Skifter tyngdekraften tilbage til normal
            } else {
                this.onGround = false;
            }
        } else {
            if (this.y + this.height > groundHeight) {
                this.y = groundHeight - this.height;
                this.velocityY = 0;
                this.onGround = true;
                this.onCloud = null;
                this.jumps = 2; // Nulstiller hop, når spilleren er på jorden
            } else {
                this.onGround = false;
            }
        }

        // Tjekker for kollision med skyer
        clouds.forEach(cloud => {
            if (this.reverseGravity) {
                // Kollision med undersiden af skyerne
                if (this.x < cloud.x + cloud.width &&
                    this.x + this.width > cloud.x &&
                    this.y < cloud.y + cloud.height &&
                    this.y > cloud.y) {
                    this.y = cloud.y + cloud.height;
                    this.velocityY = 0;
                    this.onGround = true;
                    this.onCloud = cloud;
                    this.jumps = 2; // Nulstiller hop, når spilleren er på en sky
                }
            } else {
                // Kollision med oversiden af skyerne
                if (this.x < cloud.x + cloud.width &&
                    this.x + this.width > cloud.x &&
                    this.y + this.height > cloud.y &&
                    this.y + this.height < cloud.y + cloud.height) {
                    this.y = cloud.y - this.height;
                    this.velocityY = 0;
                    this.onGround = true;
                    this.onCloud = cloud;
                    this.jumps = 2; // Nulstiller hop, når spilleren er på en sky
                }
            }
        });

        // Flytter med skyen, hvis spilleren står på den
        if (this.onCloud) {
            this.x -= this.onCloud.speed;
        }

        // Grænsekontrol for at forhindre spilleren i at bevæge sig uden for skærmen
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x + this.width > this.canvas.width) {
            this.x = this.canvas.width - this.width;
        }

        // Skifter tyngdekraften til omvendt, hvis spilleren rammer loftet
        if (this.y <= 0 && !this.reverseGravity) {
            this.y = 0;
            this.reverseGravity = true; // Skifter tyngdekraften til omvendt
        } else if (this.y + this.height >= groundHeight && this.reverseGravity) {
            this.y = groundHeight - this.height;
            this.reverseGravity = false; // Skifter tyngdekraften tilbage til normal
        }
    }

    draw(ctx) {
        // Tegner spilleren som en rød firkant
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    moveLeft() {
        // Flytter spilleren til venstre
        this.velocityX = -this.speed;
    }

    moveRight() {
        // Flytter spilleren til højre
        this.velocityX = this.speed;
    }

    stop() {
        // Stopper spillerens bevægelse
        this.velocityX = 0;
    }

    jump() {
        // Gør det muligt for spilleren at hoppe, hvis der er hop tilbage
        if (this.jumps > 0) {
            this.velocityY = this.reverseGravity ? this.jumpStrength : -this.jumpStrength;
            this.onGround = false;
            this.onCloud = null;
            this.jumps--;
        }
    }
}

export { Player };
