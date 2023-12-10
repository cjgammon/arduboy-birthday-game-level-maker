
const SCREEN_WIDTH = 128;
const SCREEN_HEIGHT = 64;
const SEGMENT_SIZE = 24;
const GROUND_SIZE = 6;

const container = document.getElementById("container");
const addSegmentBtn = document.getElementById("addSegmentBtn");



let segments = [];

init();

function init() {
    if (segments.length == 0) {
        addSegment()
    }
    addSegmentBtn.addEventListener("click", addSegment);
    setInterval(draw, 1000/60);
}

function addSegment() {
    let segment = new Segment(container);
    segments.push(segment);
}

function load() {

}

function draw() {
   for (let i = 0; i < segments.length; i++) {
        segments[i].draw();
   } 
}


