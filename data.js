window.objects   = window.objects   || [];
window.obstacles = window.obstacles || [];

const TILE_SIZE = 32;
const MAP_WIDTH = 90;
const MAP_HEIGHT = 30;

const baseMap = [
    331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332,
  
    331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332,

    331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332,

    331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332,

    331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332,

    331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332,

    331, 332, 333, 333, 331, 332, 333, 333, 331, 335, 336, 336, 336, 336, 336, 336, 336, 336, 336, 336, 336, 336, 336, 336, 336, 336, 336, 337, 333, 335, 336, 336, 336, 336, 336, 336, 336, 336, 336, 336, 336, 336, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 332, 333, 333, 331, 332, 333, 333, 331, 332,

    331, 332, 333, 333, 331, 332, 333, 333, 331, 346, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 348, 333, 346, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 332, 333, 333, 331, 332, 333, 333, 331, 332,

    331, 332, 333, 333, 331, 332, 333, 333, 331, 346, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 348, 333, 346, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 332, 333, 333, 331, 332, 333, 333, 331, 332,

    331, 332, 333, 333, 331, 332, 333, 333, 331, 346, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 110, 111, 23, 113, 23, 348, 333, 346, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 332, 333, 333, 331, 332, 333, 333, 331, 332,

    331, 332, 333, 333, 331, 332, 333, 333, 335, 363, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 115, 23, 23, 23, 23, 348, 333, 346, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 332, 333, 333, 331, 332, 333, 333, 331, 332,

    331, 332, 333, 333, 331, 332, 333, 333, 346, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 348, 333, 346, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 332, 333, 333, 331, 332, 333, 333, 331, 332,

    331, 332, 333, 333, 331, 332, 333, 333, 357, 352, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 348, 334, 357, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 333, 333, 333, 331, 332, 333, 333, 331, 332,

    331, 332, 333, 332, 331, 332, 333, 332, 331, 346, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 537, 537, 537, 23, 348, 334, 357, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 332, 333, 333, 331, 332, 333, 333, 331, 332,

    331, 332, 333, 333, 331, 332, 333, 333, 331, 357, 352, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 537, 537, 537, 23, 348, 333, 357, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 46, 332, 333, 333, 331, 332, 333, 333, 331, 332,

    331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 357, 358, 358, 358, 358, 358, 358, 358, 358, 358, 358, 352, 23, 23, 23, 23, 23, 348, 331, 357, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332,

    331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 357, 358, 358, 358, 358, 358, 359, 331, 357, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332,

    331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 357, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332,

    331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 357, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332,

    331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 357, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332,

    331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 357, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332,

    331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 357, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332,

    331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 357, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332,

    331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 357, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332,

    331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 379, 358, 358, 358, 358, 358, 358, 358, 358, 358, 358, 358, 358, 358, 358, 358, 358, 358, 358, 358, 358, 358, 358, 358, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332,

    331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332,

    331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332,

    331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332,

    331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332,

    331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332, 333, 333, 331, 332,
];


const emptyRow = Array(90).fill(null);


const overlayMap = [
    ...emptyRow,
    ...emptyRow,
    ...emptyRow,
    ...emptyRow,
    ...emptyRow,
    ...emptyRow,
    ...emptyRow,
    ...emptyRow,

    null, null, null, null, null, null, null, null, null, null, null, 313, 313, 313, 313, 313, 313, 313, 313, 313, null, 498, null, 618, 618, null, 498, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,

    null, null, null, null, null, null, null, null, null, null, null, 325, 325, 325, 325, 325, 325, 325, 325, 325, null, 498, 619, 619, 619, null, 498, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,

    null, null, null, null, null, null, null, null, null, null, null, 318, 320, 319, 319, 328, 319, 319, 320, 317, null, 498, null, 618, 619, 618, 498, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,

    null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 412, null, null, null, null, null, 503, 508, 508, 508, 508, 505, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,

    null, null, null, null, null, null, null, null, null, 613, null, 614, 615, null, null, 416, null, null, null, null, null, null, 525, 526, 526, 526, 527, 512, 513, 514, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,

    null, null, null, null, null, null, null, null, null, null, 614, 615, 619, 626, null, 420, null, null, null, null, null, null, 536, null, null, null, 538, 512, 513, 514, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,

    null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 536, 603, null, 603, 538, 512, 513, 514, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,

    null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 547, 548, 548, 548, 549, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
    
    ...emptyRow,
    ...emptyRow,
    ...emptyRow,
    ...emptyRow,
    ...emptyRow,
    ...emptyRow,
    ...emptyRow,
    ...emptyRow,
    ...emptyRow,
    ...emptyRow,
    ...emptyRow,
    ...emptyRow,
    ...emptyRow,
    ...emptyRow,
    ...emptyRow,
];

const topMap = [
    ...emptyRow,
    ...emptyRow,
    ...emptyRow,
    ...emptyRow,
    ...emptyRow,
    ...emptyRow,
        
    null, null, null, null, null, null, null, null, null, null, 308, 309, 309, 309, 309, 309, 309, 309, 309, 309, 310, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,

    null, null, null, null, null, null, null, null, null, null, 323, 322, 322, 322, 322, 322, 322, 322, 322, 322, 321, 495, 508, 508, 508, 508, 509, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,

    null, null, null, null, null, null, null, null, null, null, 312, null, null, null, null, null, null, null, null, null, 311, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,

    null, null, null, null, null, null, null, null, null, null, 324, null, null, null, null, null, null, null, null, null, 326, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,

    null, null, null, null, null, null, null, null, null, null, 315, 316, 316, 316, 316, 316, 316, 316, 316, 316, 314, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,

    null, null, null, null, null, null, null, null, null, 604, null, 605, 606, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,

    null, null, null, null, null, null, null, null, null, null, 605, 606, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
    
    null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 602, null, 602, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,

    ...emptyRow,
    ...emptyRow,
    ...emptyRow,
    ...emptyRow,
    ...emptyRow,
    ...emptyRow,
    ...emptyRow,
    ...emptyRow,
    ...emptyRow,
    ...emptyRow,
    ...emptyRow,
    ...emptyRow,
    ...emptyRow,
    ...emptyRow,
    ...emptyRow,
    ...emptyRow,
];

const obstacles = [
    { x: 0, y: 0, width: 1200, height: 196 },
    { x: 0, y: 196, width: 293, height: 584 },
    { x: 293, y: 465, width: 63, height: 315 },
    { x: 356, y: 498, width: 320, height: 282 },
    { x: 676, y: 530, width: 256, height: 250 },
    { x: 892, y: 475, width: 40, height: 55 },
    { x: 892, y: 196, width: 40, height: 192 },
  
    // house
    { x: 352, y: 220, width: 288, height: 132    },
  
    //barn
    { x: 686, y: 230, width: 164, height: 15 },
    { x: 686, y: 230, width: 5, height: 135 },
    { x: 614, y: 230, width: 5, height: 135 },
    { x: 686, y: 360, width: 164, height: 15 },

    //sunflowers
    { x: 738, y: 450, width: 28, height: 32 },
    { x: 802, y: 450, width: 28, height: 32 },
  ];
  