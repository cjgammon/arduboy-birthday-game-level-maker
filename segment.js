
const GROUND_TILE = 'exports/environment_ground_middle_variant.png';
const GROUND_IMAGE = new Image();
GROUND_IMAGE.src = GROUND_TILE;


class Segment {
//create an array full of 1s and 0s 24 long
    ground = [];
    enemies = [];
    coins = [];
    canvas = null;

    constructor(parent) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = SEGMENT_SIZE * GROUND_SIZE;
        this.canvas.height = SCREEN_HEIGHT;
        parent.appendChild(this.canvas);
        this.ground = this.generateGround();

        this.canvas.addEventListener("click", (e) => this.handle_CLICK(e));
    }

    generateGround() {
        let ground = [];
        for (let i = 0; i < SEGMENT_SIZE; i++) {
            ground.push(1);
        }
        return ground;
    }

    handle_CLICK(event) {
        
        const rect = this.canvas.getBoundingClientRect(); // Gets the size of the element and its position relative to the viewport
        const scaleX = this.canvas.width / rect.width; // Determines the X scale factor
        
        let x = (event.clientX - rect.left) * scaleX;
    
        if (selectedEnemy) {
            const enemy = {...selectedEnemy};
            enemy.x = Math.round(x);
            this.enemies.push(enemy);
            return;
        }

        let tileX = Math.floor(x / GROUND_SIZE);
        this.ground[tileX] = this.ground[tileX] === 1 ? 0 : 1;
    }

    draw() {
        let ctx = this.canvas.getContext("2d");
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.canvas.width, SCREEN_HEIGHT);
        for (let i = 0; i < this.ground.length; i++) {
            if (this.ground[i] == 1) {
                ctx.drawImage(GROUND_IMAGE, i * GROUND_SIZE, SCREEN_HEIGHT - GROUND_SIZE);
            }
        }

        for(let i = 0; i < this.enemies.length; i++) {
            let enemy = this.enemies[i];
            ctx.drawImage(enemy.image, enemy.x, enemy.y);
        }
    }
}