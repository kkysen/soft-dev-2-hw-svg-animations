import {AnyImage} from "./utils";

interface SVGConstructor {
    
    <K extends keyof SVGElementTagNameMap>(tagName: K): SVGElementTagNameMap[K];
    
}

interface SVGElementTagNameMap {
    
    "a": SVGAElement;
    "circle": SVGCircleElement;
    "clipPath": SVGClipPathElement;
    "componentTransferFunction": SVGComponentTransferFunctionElement;
    "defs": SVGDefsElement;
    "desc": SVGDescElement;
    "ellipse": SVGEllipseElement;
    "feBlend": SVGFEBlendElement;
    "feColorMatrix": SVGFEColorMatrixElement;
    "feComponentTransfer": SVGFEComponentTransferElement;
    "feComposite": SVGFECompositeElement;
    "feConvolveMatrix": SVGFEConvolveMatrixElement;
    "feDiffuseLighting": SVGFEDiffuseLightingElement;
    "feDisplacementMap": SVGFEDisplacementMapElement;
    "feDistantLight": SVGFEDistantLightElement;
    "feFlood": SVGFEFloodElement;
    "feFuncA": SVGFEFuncAElement;
    "feFuncB": SVGFEFuncBElement;
    "feFuncG": SVGFEFuncGElement;
    "feFuncR": SVGFEFuncRElement;
    "feGaussianBlur": SVGFEGaussianBlurElement;
    "feImage": SVGFEImageElement;
    "feMerge": SVGFEMergeElement;
    "feMergeNode": SVGFEMergeNodeElement;
    "feMorphology": SVGFEMorphologyElement;
    "feOffset": SVGFEOffsetElement;
    "fePointLight": SVGFEPointLightElement;
    "feSpecularLighting": SVGFESpecularLightingElement;
    "feSpotLight": SVGFESpotLightElement;
    "feTile": SVGFETileElement;
    "feTurbulence": SVGFETurbulenceElement;
    "filter": SVGFilterElement;
    "foreignObject": SVGForeignObjectElement;
    "g": SVGGElement;
    "image": SVGImageElement;
    "gradient": SVGGradientElement;
    "line": SVGLineElement;
    "linearGradient": SVGLinearGradientElement;
    "marker": SVGMarkerElement;
    "mask": SVGMaskElement;
    "path": SVGPathElement;
    "metadata": SVGMetadataElement;
    "pattern": SVGPatternElement;
    "polygon": SVGPolygonElement;
    "polyline": SVGPolylineElement;
    "radialGradient": SVGRadialGradientElement;
    "rect": SVGRectElement;
    "svg": SVGSVGElement;
    "script": SVGScriptElement;
    "stop": SVGStopElement;
    "style": SVGStyleElement;
    "switch": SVGSwitchElement;
    "symbol": SVGSymbolElement;
    "tspan": SVGTSpanElement;
    "textContent": SVGTextContentElement;
    "text": SVGTextElement;
    "textPath": SVGTextPathElement;
    "textPositioning": SVGTextPositioningElement;
    "title": SVGTitleElement;
    "use": SVGUseElement;
    "view": SVGViewElement;
    
}

interface SVGSVGPlusElement extends SVGSVGElement {
    
    newChild: SVGConstructor;
    
}

export interface Canvas {
    
    readonly parentElement: HTMLElement | null;
    
    width: number,
    height: number,
    
    readonly style: CSSStyleDeclaration;
    
    appendTo(element: Node): Canvas;
    
    appendChild<T extends Node>(element: T): T;
    
    addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLDivElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    
    fillStyle: string;
    strokeStyle: string;
    
    clear(): void;
    
    fillRect(x: number, y: number, width: number, height: number, fill?: string): void;
    
    fillRectCentered(x: number, y: number, width: number, height: number, fill?: string): void;
    
    fillCircle(x: number, y: number, radius: number, fill?: string, stroke?: string): void;
    
    fillEllipse(x: number, y: number, radiusX: number, radiusY: number, fillStyle?: string, stroke?: string): void;
    
    moveTo(x: number, y: number): void;
    
    line(x1: number, y1: number, x2: number, y2: number, stroke?: string): void;
    
    lineTo(x: number, y: number, stroke?: string): void;
    
    drawImage(image: AnyImage, destX: number, destY: number): void;
    
    drawImage(image: AnyImage, destX: number, destY: number, destWidth: number, destHeigth: number): void;
    
}

export interface SVGCanvas extends Canvas {


}

export interface CanvasConstructor {
    
    (): Canvas;
    
}

export const SVGCanvas: { new: CanvasConstructor } = {
    
    new: function(): SVGCanvas {
        
        const svgCreate: SVGConstructor = document.createElementNS.bind(document, "http://www.w3.org/2000/svg");
        
        const svg: SVGSVGPlusElement = <SVGSVGPlusElement> svgCreate("svg");
        svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
        console.log(svg);
        
        svg.newChild = function <K extends keyof SVGElementTagNameMap>(tagName: K) {
            return svg.appendChild(svgCreate(tagName));
        };
        
        const p = {
            x: 0,
            y: 0,
            invalid: true,
            set: function(x: number, y: number) {
                this.x = x;
                this.y = y;
                this.invalid = false;
            },
        };
        
        let fillStyle: string;
        let strokeStyle: string;
        
        const imageToUrl = function(image: AnyImage): string {
            if (image instanceof HTMLImageElement || image instanceof HTMLVideoElement) {
                return image.src;
            }
            if (!(image instanceof HTMLCanvasElement)) {
                const canvas: HTMLCanvasElement = document.createElement("canvas");
                canvas.width = image.width;
                canvas.height = image.height;
                canvas.getContext("2d").drawImage(image, 0, 0);
                image = canvas;
            }
            return image.toDataURL();
        };
        
        const canvas: SVGCanvas = {
            
            get parentElement(): HTMLElement | null {
                return svg.parentElement;
            },
    
            get width(): number {
                return parseInt(svg.getAttribute("width"));
            },
    
            set width(width: number) {
                svg.setAttribute("width", width.toString());
            },
            
            get height(): number {
                return parseInt(svg.getAttribute("height"));
            },
            
            set height(height: number) {
                svg.setAttribute("height", height.toString());
            },
            
            get style(): CSSStyleDeclaration {
                return svg.style;
            },
            
            appendTo: function(element: Node): SVGCanvas {
                element.appendChild(svg);
                return this;
            },
            
            appendChild: function <T extends Node>(element: T): T {
                return svg.appendChild(element);
            },
            
            addEventListener: function(eventType, listener, optionsOrUseCapture): void {
                svg.addEventListener(eventType, listener, optionsOrUseCapture);
            },
            
            set fillStyle(fill: string) {
                fillStyle = fill;
            },
            
            set strokeStyle(stroke: string) {
                strokeStyle = stroke;
            },
            
            clear: function(): void {
                svg.clearHTML();
                p.invalid = true;
            },
            
            fillRect: function(x: number, y: number, width: number, height: number,
                               fill: string = fillStyle): void {
                svg.newChild("rect").setAttributes({
                    x: x,
                    y: y,
                    width: width,
                    height: height,
                    fill: fill,
                });
                p.set(x, y);
            },
            
            fillRectCentered: function(x: number, y: number, width: number, height: number,
                                       fill: string = fillStyle): void {
                this.fillRect(x - width * 0.5, y - height * 0.5, width, height, fill);
                p.set(x, y);
            },
            
            fillCircle: function(x: number, y: number, radius: number,
                                 fill: string = fillStyle, stroke: string = strokeStyle): void {
                svg.newChild("circle").setAttributes({
                    cx: x,
                    cy: y,
                    r: radius,
                    fill: fill,
                    stroke: stroke,
                });
                p.set(x, y);
            },
            
            fillEllipse(x: number, y: number, radiusX: number, radiusY: number,
                        fill: string = fillStyle, stroke: string = strokeStyle): void {
                svg.newChild("ellipse").setAttributes({
                    cx: x,
                    cy: y,
                    rx: radiusX,
                    ry: radiusY,
                    fill: fill,
                    stroke: stroke,
                });
                p.set(x, y);
            },
            
            moveTo: function(x: number, y: number): void {
                p.set(x, y);
            },
            
            line: function(x1: number, y1: number, x2: number, y2: number, stroke: string = strokeStyle): void {
                svg.newChild("line").setAttributes({
                    x1: x1,
                    y1: y1,
                    x2: x2,
                    y2: y2,
                    stroke: stroke,
                });
                p.set(x2, y2);
            },
            
            lineTo: function(x: number, y: number, stroke: string = strokeStyle): void {
                if (p.invalid === true) {
                    return;
                }
                this.line(p.x, p.y, x, y, stroke);
            },
            
            drawImage(image: AnyImage, destX: number, destY: number, destWidth?: number, destHeight?: number): void {
                if (!destWidth) {
                    destWidth = image.width;
                }
                if (!destHeight) {
                    destHeight = image.height;
                }
                svg.newChild("image").setAttributes({
                    x: destX,
                    y: destY,
                    width: destWidth,
                    height: destHeight,
                    "href": imageToUrl(image),
                });
                p.set(destX, destY);
            },
            
        };
        
        return Object.freeze(canvas);
        
    },
    
};

Object.freeze(SVGCanvas);