import groundTile from "../../assets/exports/environment_ground_middle_variant.png";

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
    console.log("data", data);
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
    });

    autorun(() => {
      console.log("ground", this.ground);
      //dispatch event

      const event = new CustomEvent("segment-updated", {
        detail: {
          segment: this,
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

  writeURL() {
    const url = new URL(window.location.href);

    //simplify segments to json structure for url
    const segments = this.segments.map((segment) => {
      return {
        ground: segment.ground,
        enemies: segment.enemies,
        items: segment.items,
      };
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
}

export default new SegmentModel();
