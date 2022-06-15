module.exports.minRegulate = function (size, min){
    let w = parseFloat(size[0]);
    let h = parseFloat(size[1]);
    if (h < w) {
        w = min / h * w;
        h = min;
    } else {
        h = min / w * h;
        w = min;
    }
    return [parseInt(w), parseInt(h)]
};

module.exports.maxRegulate = function (size, max){
    let w = parseFloat(size[0]);
    let h = parseFloat(size[1]);
    if (h > w) {
        w = max / h * w;
        h = max;
    } else {
        h = max / w * h;
        w = max;
    }
    return [parseInt(w), parseInt(h)]
};
