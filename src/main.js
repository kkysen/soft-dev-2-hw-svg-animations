"use strict";
require("./extensions");
Object.defineProperty(exports, "__esModule", { value: true });
const animations_1 = require("./animations");
const svgCanvas_1 = require("./svgCanvas");
const canvasCanvas_1 = require("./canvasCanvas");
const utils_1 = require("./utils");
(function () {
    const useSvg = !(utils_1.queryParams().get("useSvg") === "false");
    animations_1.run((useSvg ? svgCanvas_1.SVGCanvas : canvasCanvas_1.CanvasCanvas).new, animations_1.AnimationIndex.DVD_PLAYER_SCREEN_SAVER);
})();
