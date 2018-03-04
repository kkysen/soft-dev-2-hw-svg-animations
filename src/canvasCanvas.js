"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
exports.CanvasCanvas = {
    new: function () {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const canvasCanvas = {
            get parentElement() {
                return canvas.parentElement;
            },
            get width() {
                return canvas.width;
            },
            set width(width) {
                canvas.width = width;
            },
            get height() {
                return canvas.height;
            },
            set height(height) {
                canvas.height = height;
            },
            get style() {
                return canvas.style;
            },
            appendTo: function (element) {
                element.appendChild(canvas);
                return this;
            },
            appendChild: function (element) {
                return canvas.appendChild(element);
            },
            addEventListener: function (eventType, listener, optionsOrUseCapture) {
                canvas.addEventListener(eventType, listener, optionsOrUseCapture);
            },
            set fillStyle(fillStyle) {
                context.fillStyle = fillStyle;
            },
            set strokeStyle(strokeStyle) {
                context.strokeStyle = strokeStyle;
            },
            clear: function () {
                context.clearRect(0, 0, canvas.width, canvas.height);
            },
            fillRect: function (x, y, width, height, fillStyle) {
                let oldFillStyle;
                if (fillStyle) {
                    oldFillStyle = context.fillStyle;
                    context.fillStyle = fillStyle;
                }
                context.fillRect(x, y, width, height);
                if (oldFillStyle) {
                    context.fillStyle = oldFillStyle;
                }
            },
            fillRectCentered: function (x, y, width, height, fillStyle) {
                this.fillRect(x - width * 0.5, y - height * 0.5, width, height, fillStyle);
                context.moveTo(x, y);
            },
            fillCircle: function (x, y, radius, fillStyle, strokeStyle) {
                this.fillEllipse(x, y, radius, radius, fillStyle, strokeStyle);
            },
            fillEllipse(x, y, radiusX, radiusY, fillStyle, strokeStyle) {
                let oldFillStyle;
                let oldStrokeStyle;
                if (fillStyle) {
                    oldFillStyle = context.fillStyle;
                    context.fillStyle = fillStyle;
                }
                if (oldStrokeStyle) {
                    oldStrokeStyle = context.strokeStyle;
                    context.strokeStyle = strokeStyle;
                }
                context.beginPath();
                context.ellipse(x, y, radiusX, radiusY, 0, 0, utils_1.MathUtils.TAU);
                context.fill();
                context.beginPath();
                if (oldFillStyle) {
                    context.fillStyle = oldFillStyle;
                }
                if (oldStrokeStyle) {
                    context.strokeStyle = oldStrokeStyle;
                }
                context.moveTo(x, y);
            },
            moveTo: function (x, y) {
                context.moveTo(x, y);
            },
            line: function (x1, y1, x2, y2, strokeStyle) {
                let oldStrokeStyle;
                if (strokeStyle) {
                    oldStrokeStyle = context.strokeStyle;
                    context.strokeStyle = strokeStyle;
                }
                context.moveTo(x1, y2);
                context.lineTo(x2, y2);
                if (oldStrokeStyle) {
                    context.strokeStyle = oldStrokeStyle;
                }
            },
            lineTo: function (x, y, strokeStyle) {
                let oldStrokeStyle;
                if (strokeStyle) {
                    oldStrokeStyle = context.strokeStyle;
                    context.strokeStyle = strokeStyle;
                }
                context.lineTo(x, y);
                if (oldStrokeStyle) {
                    context.strokeStyle = oldStrokeStyle;
                }
            },
            drawImage(image, destX, destY, destWidth, destHeight) {
                context.drawImage(image, destX, destY, destWidth, destHeight);
            },
        };
        return Object.freeze(canvasCanvas);
    },
};
Object.freeze(exports.CanvasCanvas);
