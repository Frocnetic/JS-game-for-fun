import { InterpolationBetweenPoints } from './map_gen.js';
import { Player } from './player.js';
import { Cloud, generateClouds } from './cloud.js';

document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("mapCanvas");
    const ctx = canvas.getContext("2d");

    const landSize = 1000;
    const initialHeight = 250;
    const up = 30;
    const down = 30;
    const variabilityCap = 15;
    const pointGaps = 30;
    const distanceAboveGround = 50; // Afstand over jorden for skyer

    const heights = InterpolationBetweenPoints(landSize, initialHeight, up, down, variabilityCap, pointGaps);

    const playerOptions = {
        width: 20,
        height: 20,
        speed: 2,
        gravity: 0.5,
        jumpStrength: 12
    };

    const player = new Player(50, 50, canvas, playerOptions);
    const clouds = generateClouds(canvas, 5, heights.map(h => canvas.height - h), distanceAboveGround);

    let mouseX = 0;
    let mouseY = 0;
    const maxArrowLength = 100; // Maksimal længde af pilen

    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = event.clientX - rect.left;
        mouseY = event.clientY - rect.top;
    });

    function drawArrow(ctx, fromX, fromY, toX, toY, maxLength) {
        // Tegner en pil fra (fromX, fromY) til (toX, toY) med en maksimal længde
        const dx = toX - fromX;
        const dy = toY - fromY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        const length = Math.min(distance, maxLength);
        const endX = fromX + length * Math.cos(angle);
        const endY = fromY + length * Math.sin(angle);
        const headlen = 10; // længde af pilens hoved i pixels

        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(endX, endY);
        ctx.lineTo(endX - headlen * Math.cos(angle - Math.PI / 6), endY - headlen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - headlen * Math.cos(angle + Math.PI / 6), endY - headlen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
    }

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Tegner det grønne område under jorden
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        ctx.lineTo(0, canvas.height - heights[0]);
        for (let i = 1; i < heights.length; i++) {
            ctx.lineTo(i, canvas.height - heights[i]);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fill();

        // Tegner jorden
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - heights[0]);
        for (let i = 1; i < heights.length; i++) {
            ctx.lineTo(i, canvas.height - heights[i]);
        }
        ctx.stroke();

        // Opdaterer og tegner skyer
        clouds.forEach(cloud => {
            cloud.update();
            cloud.draw(ctx);
        });

        // Opdaterer og tegner spilleren
        player.update(heights.map(h => canvas.height - h), clouds);
        player.draw(ctx);

        // Tjekker for kollision med skyer
        clouds.forEach(cloud => {
            if (player.x < cloud.x + cloud.width &&
                player.x + player.width > cloud.x &&
                player.y + player.height > cloud.y &&
                player.y + player.height < cloud.y + cloud.height) {
                player.y = cloud.y - player.height;
                player.velocityY = 0;
                player.onGround = true;
            }
        });

        // Tegner pilen, der peger mod musen
        drawArrow(ctx, player.x + player.width / 2, player.y + player.height / 2, mouseX, mouseY, maxArrowLength);

        requestAnimationFrame(gameLoop);
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            player.moveLeft();
        } else if (event.key === 'ArrowRight') {
            player.moveRight();
        } else if (event.key === 'ArrowUp') {
            player.jump();
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            player.stop();
        }
    });

    gameLoop();
});
