export const keyCodeToDeltaSpeed = function(keyCode: number): number {
    switch (keyCode) {
        case 38:
            return 1;
        case 40:
            return -1;
        default:
            return 0;
    }
};

export const keyCodeToDeltaAngle = function(keyCode: number): number {
    switch (keyCode) {
        case 37:
            return -1;
        case 39:
            return 1;
        default:
            return 0;
    }
};