
module.exports.maxRegulate = function (size, max){
    let w = parseFloat(size[0]);
    let h = parseFloat(size[1]);
    if (h > w) {
        if (h > max) {
            w = max / h * w;
            h = max;
        }
    } else {
        if (w > max) {
            h = max / w * h;
            w = max;
        }
    }
    return [parseInt(w), parseInt(h)]
};

module.exports.absRegulate = function (size, short){
    let w = parseFloat(size[0]);
    let h = parseFloat(size[1]);
    if (h < w) {
        w = short / h * w;
        h = short;
    } else {
        h = short / w * h;
        w = short;
    }
    return [parseInt(w), parseInt(h)]
};

module.exports.areaRegulate = function (size, area){
    let w = parseFloat(size[0]);
    let h = parseFloat(size[1]);
    let max_w = parseFloat(area[0] - 64);
    let max_h = parseFloat(area[1]);
    let s0 = max_w / w;
    let s1 = max_h / h;
    let s = Math.min(s0, s1);
    w = w * s;
    h = h * s;
    return [parseInt(w), parseInt(h)]
};