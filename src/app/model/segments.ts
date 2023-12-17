import groundTile from "../../../public/assets/environment_ground_middle_variant.png";

export const GROUND_TILE_IMG = groundTile;
export const GROUND_TILES_PER_SEGMENT = 24;
export const GROUND_TILE_SIZE = 6;

import { makeObservable, observable, action, autorun } from "mobx";

interface ISegment {
  ground: number[];
  enemies: number[][];
  items: number[][];
}

export class Segment implements ISegment {
  ground: number[] = [];
  enemies: number[][] = [];
  items: number[][] = [];

  constructor(data?: ISegment) {
    if (data) {
      this.ground = data.ground;
      this.enemies = data.enemies;
      this.items = data.items;
    } else {
      for (let i = 0; i < GROUND_TILES_PER_SEGMENT; i++) {
        this.ground.push(1);
      }
    }

    makeObservable(this, {
      ground: observable,
      enemies: observable,
      items: observable,
      toggleGroundTile: action,
      hideGroundTile: action,
      showGroundTile: action,
      addEnemy: action,
      removeEnemy: action,
      addCoin: action,
      removeCoin: action,
    });

    autorun(() => {
      const event = new CustomEvent("segment-updated", {
        detail: {
          segment: this,
          ground: this.ground,
          enemies: this.enemies,
          items: this.items,
        },
      });
      window.dispatchEvent(event);
    });
  }

  toggleGroundTile(index: number) {
    const ground = [...this.ground];
    ground[index] = ground[index] === 0 ? 1 : 0;
    this.ground = ground;
  }

  hideGroundTile(index: number) {
    const ground = [...this.ground];
    ground[index] = 0;
    this.ground = ground;
  }

  showGroundTile(index: number) {
    const ground = [...this.ground];
    ground[index] = 1;
    this.ground = ground;
  }

  addEnemy(type: number, x: number) {
    const enemies = [...this.enemies];
    const enemy = [type, x];
    enemies.push(enemy);
    this.enemies = enemies;
  }

  removeEnemy(enemy: number[]) {
    const enemies = [...this.enemies];
    this.enemies = enemies.filter((e) => e !== enemy);
  }

  addCoin(type: number, x: number) {
    const items = [...this.items];
    const item = [type, x];
    items.push(item);
    this.items = items;
  }

  removeCoin(coin: number[]) {
    const items = [...this.items];
    this.items = items.filter((c) => c !== coin);
  }

  toJSON() {
    //convert enemies to json structure
    return {
      ground: this.ground,
      enemies: this.enemies,
      items: this.items,
    };
  }
}

export class SegmentModel {
  segments: Segment[] = [];

  constructor() {
    this.readURL();

    makeObservable(this, {
      segments: observable.deep,
      addSegment: action,
      removeSegment: action,
    });

    //@ts-ignore
    window.addEventListener("segment-updated", (e: CustomEvent) => {
      this.writeURL();
    });
  }

  addSegment() {
    const segment = new Segment();
    this.segments.push(segment);
    this.writeURL();
  }

  removeSegment(segment: ISegment) {
    this.segments = this.segments.filter((s) => s !== segment);
    this.writeURL();
  }

  removeSegmentByIndex(index: number) {
    this.segments = this.segments.filter((_, i) => i !== index);
    this.writeURL();
  }

  writeURL() {
    const url = new URL(window.location.href);

    //simplify segments to json structure for url
    const segments = this.segments.map((segment) => {
      return segment.toJSON();
    });

    url.searchParams.set("segments", JSON.stringify(segments));
    window.history.replaceState({}, "", url.toString());
  }

  readURL() {
    const url = new URL(window.location.href);
    const segments = url.searchParams.get("segments");
    if (segments) {
      const _segments = JSON.parse(segments);
      this.segments = _segments.map((segment: ISegment) => {
        const _segment = new Segment(segment);
        return _segment;
      });
    }
  }

  export() {
    let cppString = `#define GROUND_DEFINITION_COUNT ${this.segments.length}\n`;

    cppString +=
      "const SegmentDefinition groundDefinitions[GROUND_DEFINITION_COUNT] PROGMEM = {\n";

    this.segments.forEach((segment, index) => {
      cppString += `    // segment ${index}\n`;
      cppString += `  {\n`;

      var floorBytes = [];
      var byteCount = segment.ground.length / 8;
      for (var byteIndex = 0; byteIndex < byteCount; byteIndex++) {
        floorBytes.push(0);
      }

      for (var tileIndex = 0; tileIndex < segment.ground.length; tileIndex++) {
        var tile = segment.ground[tileIndex];
        var byteIndex = Math.floor(tileIndex / 8);
        var bitIndex = tileIndex % 8;
        if (tile != 0) {
          floorBytes[byteIndex] |= 1 << bitIndex;
        }

        //console.log("tileIndex:" + tileIndex + ": byteIndex:" + byteIndex + " bitIndex: " + bitIndex);
      }

      cppString += `    {${floorBytes.join(", ")}},\n`;
      cppString += `    {\n`;

      segment.enemies.forEach((enemies) => {
        cppString += `      {${enemies.join(", ")}}, // Enemy\n`;
      });

      cppString += `    },\n`;
      cppString += `    {\n`;

      segment.items.forEach((item) => {
        cppString += `      {${item.join(", ")}}, // Item\n`;
      });

      cppString += `    }\n`;
      cppString += `  },\n`;
    });

    cppString += "};\n";

    const blob = new Blob([cppString], { type: "text/plain" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "segments.cpp";
    a.click();
    URL.revokeObjectURL(url);
  }

  exportJSON() {
    const segments = this.segments.map((segment) => {
      return segment.toJSON();
    });

    const blob = new Blob([JSON.stringify(segments)], { type: "text/plain" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "segments.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  loadJSON() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const target = e.target as FileReader;
          const segments = JSON.parse(target.result as string);

          this.segments = segments.map((segment: ISegment) => {
            const _segment = new Segment(segment);
            return _segment;
          });
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }
}

export default new SegmentModel();
