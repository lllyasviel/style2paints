Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};

Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

cc.Class({
    extends: cc.Component,

    properties: {
        dropNode: {
            default: null, type: cc.Node
        },
    },

    onLoad(){
        window.color_picker_main = this;
    },

    start () {
        let ImageLoader = require('./ImageLoader');
        let PickCanvas = require('./PickCanvas');

        window.pickCanvas = PickCanvas('paletteImage');
        window.right_color_picker = this.getComponent('cc.Sprite');
        window.right_color_picker_node = this.node;
        window.color_picker_main = this;
        window.dropper_node = this.dropNode;

        this.last_record = 0;

        ImageLoader('paletteImage').load_url("res\\raw-assets\\Texture\\ring.png",function (image) {
            window.right_color_picker.spriteFrame = window.pickCanvas.ini(image);

            window.right_color_picker_node.on("mousemove", function (event) {
                window.mousePosition = event.getLocation();
                let item = window.right_color_picker_node
                let cur_position = item.convertToWorldSpace(item.position);
                let beginX = cc.winSize.width - 300;
                let beginY = 362;
                let mouseRelativeX = window.mousePosition.x - beginX;
                let mouseRelativeY = window.mousePosition.y - beginY;
                if(mouseRelativeX > 0 && mouseRelativeY > 0 && mouseRelativeX < item.width && mouseRelativeY < item.height){
                    window.mouseRelativeX = mouseRelativeX / item.width;
                    window.mouseRelativeY = mouseRelativeY / item.height;
                    let color = window.pickCanvas.get_color(window.mouseRelativeX, window.mouseRelativeY);
                    if(color.r == 80){
                        if(color.g == 80){
                            if(color.b == 80){
                                color.r = 255;
                                color.g = 255;
                                color.b = 255;
                            }
                        }
                    }
                    window.color_picker_main.float_do(color);
                }
            });
    
            window.right_color_picker_node.on("mousedown", function (event) {
                window.color_picker_main.pick_do();
            });
        });

        window.dropper_node.on(cc.Node.EventType.MOUSE_DOWN, this.onDropDown, this);
        window.dropper_node.on(cc.Node.EventType.MOUSE_UP, this.onDropUp, this);
        window.dropper_node.on(cc.Node.EventType.TOUCH_MOVE, this.onDropMove, this);
        window.in_dropping = false;

    },

    float_do: function(color){
        window.pickCanvas.floatingColor[0] = color.r;
        window.pickCanvas.floatingColor[1] = color.g;
        window.pickCanvas.floatingColor[2] = color.b;
        window.dropper_node.color = color;
        window.pickCanvas.finish_float();
    },

    pick_do: function(){
        window.dropper_node.x = 122;
        window.dropper_node.y = 268;
        window.minecraft.go_pen();
        window.color_picker_main.pick_float();
        window.minecraft.set_cur_color(window.pickCanvas.currentColor);
    },

    onDropDown: function(event){
        window.in_dropping = true;
    },

    onDropUp: function(event){
        window.in_dropping = false;
        window.color_picker_main.pick_do();
    },

    onDropMove: function(event){
        if(window.in_dropping){
            var delta = event.touch.getDelta();
            window.dropper_node.x += delta.x;
            window.dropper_node.y += delta.y;
            let begin_x = window.leftNode.width * 0.5 + window.drag_target.x * 1.0 - window.drag_target.width * 0.5 * window.drag_target.scaleX + 300;
            let begin_y = window.leftNode.height * 0.5 + window.drag_target.y * 1.0 - window.drag_target.height * 0.5 * window.drag_target.scaleX;
            let ax = (window.mousePosition.x - begin_x) / (window.drag_target.width * window.drag_target.scaleX);
            let ay = (window.mousePosition.y - begin_y) / (window.drag_target.height * window.drag_target.scaleX);
            if(ax > 0.0 && ay > 0.0 && ax < 1.0 && ay < 1.0){
                window.creativeCanvas.re = true;
                window.creativeCanvas.rex = ax;
                window.creativeCanvas.rey = ay;
                window.creativeCanvas.refresh_current_point_index();
                if(window.creativeCanvas.current_index > -1){
                    let pt = window.creativeCanvas.points_XYRGBR[window.creativeCanvas.current_index];
                    let color = [pt[2], pt[3], pt[4]];
                    window.color_picker_main.float_do(new cc.color(color[0], color[1], color[2]));
                    window.minecraft.set_cur_color([color[0], color[1], color[2]]);
                }else{
                    let target_canvas = window.previewImageCanvas;
                    if(window.girdNode.active){
                        target_canvas = window.girdImageCanvas;
                    }
                    let color = target_canvas.get_color(ax, ay);
                    window.color_picker_main.float_do(color);
                    window.minecraft.set_cur_color([color.r, color.g, color.b]);
                }
            }else{
                window.creativeCanvas.re = false;
            }
        }
    },

    pick_float: function(){
        window.controller.on_pen();
        window.pickCanvas.currentColor[0] = window.pickCanvas.floatingColor[0];
        window.pickCanvas.currentColor[1] = window.pickCanvas.floatingColor[1];
        window.pickCanvas.currentColor[2] = window.pickCanvas.floatingColor[2];
        window.pickCanvas.finish();
    },

    make_record: function(){
        let hash = window.pickCanvas.currentColor[0] * 1000000 + window.pickCanvas.currentColor[1] * 1000 + window.pickCanvas.currentColor[2];
        if(this.last_record != hash){
            window.pickCanvas.record.remove(hash);
            window.pickCanvas.record.push(hash);
            window.pickCanvas.finish();
            this.last_record = hash;
        }
    },

});
