
const ENEMY_TYPES = {
    NONE: 0,
    TROLL: 1,
    SPIDER: 2
};

const ENEMY_DEFINITIONS = [
    {
        type: 1,
        y: 28,
        cx: 14,
        cy: 20,
        cr: 10,
        src: "exports/enemy~troll.png"
    },
    {
        type: 2,
        y: 0,
        cx: 12,
        cy: 20,
        cr: 10,
        src: "exports/enemy~spiduh~a.png"
    }
]

class Enemy{
    selected = false;

    constructor(data) {
        if (data.type) {
            let enemy = data;
            this.type = enemy.type;
            this.x = enemy.x;
            this.y = enemy.y;
            this.w = enemy.w;
            this.h = enemy.h;
            this.cx = enemy.cx;
            this.cy = enemy.cy;
            this.cr = enemy.cr;

            this.image = new Image();
            this.image.classList.add("enemy");
            this.image.src = enemy.src;
        }
    }
}

let selectedEnemy = null;
let enemies = [];

//add enemy buttons
for (i = 0; i < ENEMY_DEFINITIONS.length; i++) {
    let enemy = new Enemy(ENEMY_DEFINITIONS[i]);
    let btn = enemy.image;
    btn.addEventListener("click", () => handle_ENEMY_CLICK(enemy));
    enemies.push(enemy);
    document.getElementById("ui").appendChild(btn);
}

handle_ENEMY_CLICK = (enemy) => {
    for (i = 0; i < enemies.length; i++) {
        if (enemies[i] !== enemy) {
            enemies[i].selected = false;
            enemies[i].image.classList.remove("selected");
        }
    }
    enemy.selected = !enemy.selected;
    enemy.image.classList.toggle("selected");

    if (enemy.selected) {
        selectedEnemy = enemy;
    } else {
        selectedEnemy = null;
    }
}
