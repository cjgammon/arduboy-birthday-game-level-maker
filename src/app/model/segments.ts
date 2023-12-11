import groundTile from "../../../public/assets/environment_ground_middle_variant.png";

import { Enemy } from "./enemy";

export const GROUND_TILE_IMG = groundTile;
export const GROUND_TILES_PER_SEGMENT = 24;
export const GROUND_TILE_SIZE = 6;

import { makeObservable, observable, action, autorun } from "mobx";

interface ISegment {
  ground: number[];
  enemies: number[];
  items: number[];
}

export class Segment implements ISegment {
  ground: number[] = [];
  enemies: number[] = [];
  items: number[] = [];

  constructor(data?: ISegment) {
    if (data) {
      this.ground = data.ground;
      this.enemies = data.enemies;
      //this.items = data.items;
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
      //addEnemy: action,
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
      console.log("dispatch");
      window.dispatchEvent(event);
    });
  }

  toggleGroundTile(index: number) {
    console.log("toggle");
    const ground = [...this.ground];
    ground[index] = ground[index] === 0 ? 1 : 0;
    this.ground = ground;
  }

  addEnemy(type, x, y) {
    const enemies = [...this.enemies];
    //const enemy = new Enemy(type, x, y);
    const enemy = [type, x, y];
    enemies.push(enemy);
    this.enemies = enemies;
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
    this.segments = this.segments.filter((s, i) => i !== index);
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
    let cppString = "{\n";

    this.segments.forEach((segment, index) => {
      cppString += `    // segment ${index}\n`;
      cppString += `  {\n`;
      cppString += `    {${segment.ground.join(", ")}},\n`;
      cppString += `    {\n`;

      segment.enemies.forEach((enemies) => {
        cppString += `      {${enemies.join(", ")}}, // Enemy\n`;
      });

      cppString += `    },\n`;
      cppString += `    {\n`;

      segment.items.forEach(() => {
        //cppString += `      {${item.join(", ")}}, // Item\n`;
        cppString += `      {},\n`;
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
