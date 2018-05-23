function getDistance(p1x, p1y, p2x, p2y) {
    let x = p2x - p1x,
        y = p2y - p1y;
    return Math.sqrt((x * x) + (y * y));
};
function getAngle(p1x, p1y, p2x, p2y) {
    let x = p1x - p2x,
        y = p1y - p2y;
    return Math.atan2(y, x) * 180 / Math.PI;
};

module.exports = function TouchGesture(el) {
    let self = Object();
    let lastPoints = [];
    let startDistance = 1;
    let scaleCount;
    self.startScale = 1;

    el.on('touchmove', function (event) {
        let touches = event.getTouches();
        if (touches.length >= 2){
            if (lastPoints.length < 2) {
                lastPoints = [{
                    x: touches[0].getLocationX(),
                    y: touches[0].getLocationY()
                }, {
                    x: touches[1].getLocationX(),
                    y: touches[1].getLocationY()
                }];
                startDistance = getDistance(lastPoints[0].x, lastPoints[0].y, lastPoints[1].x, lastPoints[1].y);
                return;
            }
            let nowPoints = [{
                x: touches[0].getLocationX(),
                y: touches[0].getLocationY()
            }, {
                x: touches[1].getLocationX(),
                y: touches[1].getLocationY()
            }];
            let nowDistance = getDistance(nowPoints[0].x, nowPoints[0].y, nowPoints[1].x, nowPoints[1].y),
                lastDistance = getDistance(lastPoints[0].x, lastPoints[0].y, lastPoints[1].x, lastPoints[1].y);
            let scale = nowDistance / startDistance;
            let rotation = getAngle(lastPoints[0].x, lastPoints[0].y, lastPoints[1].x, lastPoints[1].y) - getAngle(nowPoints[0].x, nowPoints[0].y, nowPoints[1].x, nowPoints[1].y);
            event.move = {
                x: 0,
                y: 0
            };
            scale = scale < 0.25 ? 0.25 : scale;
            scale = scale > 4 ? 4 : scale;
            if (Math.abs(nowDistance - lastDistance) < 20) {
                let dx = nowPoints[0].x - lastPoints[0].x;
                let dy = nowPoints[0].y - lastPoints[0].y;
                dx = dx > 200 ? 200 : dx;
                dx = dx < -200 ? -200 :dx;
                dy = dy > 200 ? 200 : dy;
                dy = dy < -200 ? -200 :dy;
                event.move.x = dx;
                event.move.y = dy;
            }
            event.scale = scaleCount = self.startScale*scale;
            event.rotation = rotation;
            self.gesturemove && self.gesturemove.call(el, event);
            lastPoints = nowPoints;
        }
    })

    el.on('touchend', function (event) {
        lastPoints = [];
        startDistance = 1;
        self.startScale && (self.startScale = scaleCount);
    });

    self.gesturemove = function(event){
        let childNodes = el.getChildren();
        for (let i of childNodes) {
            i.scale = event.scale;
            i.rotation += event.rotation;
            i.x += event.move.x;
            i.y += event.move.y;
        }
    };

    self.init = function() {
        lastPoints = [];
        startDistance = 1;
        self.startScale = 1;
        let childNodes = el.getChildren();
        for (let i of childNodes) {
            i.scale = 1;
            i.rotation = 0;
            i.x = 0;
            i.y = 0;
        }
    }
    self.init();
    return self;
}