import trollSprite from "../../../public/assets/enemy~troll.png";
import spiderSprite from "../../../public/assets/enemy~spiduh~a.png";

export const ENEMY_SIZE = 32;

export const ENEMY_TYPES = {
  NONE: 0,
  TROLL: 1,
  SPIDER: 2,
};

export const ENEMY_DEFINITIONS = [
  {
    type: 1,
    y: 28,
    cx: 14,
    cy: 20,
    cr: 10,
    src: trollSprite,
  },
  {
    type: 2,
    y: 0,
    cx: 12,
    cy: 20,
    cr: 10,
    src: spiderSprite,
  },
];

export function getEnemyImage(type: number) {
  const definition = ENEMY_DEFINITIONS.find((d) => d.type === type);
  if (definition) {
    return definition.src;
  } else {
    throw new Error("Unknown enemy type");
  }
}
