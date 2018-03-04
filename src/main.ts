import {AnimationIndex, run} from "./animations";
import {SVGCanvas} from "./svgCanvas";
import {CanvasCanvas} from "./canvasCanvas";
import {queryParams} from "./utils";

(function() {
    const useSvg: boolean = !(queryParams().get("useSvg") === "false");
    run((useSvg ? SVGCanvas : CanvasCanvas).new, AnimationIndex.DVD_PLAYER_SCREEN_SAVER);
})();