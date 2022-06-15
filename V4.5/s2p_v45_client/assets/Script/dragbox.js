cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad(){
        window.drag_box = this;
    },

    start () {
        window.mouse_l = false;
        window.mouse_r = false;
        window.mouse_m = false;
        window.ctrl = false;
        window.alt = false;
        window.drag_box = this;

        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
        this.node.on(cc.Node.EventType.MOUSE_UP, this.onMouseUp, this);
        this.node.on(cc.Node.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);

        this.node.on("mousemove", function (event) {
            window.mousePosition = event.getLocation();

            let begin_x = window.leftNode.width * 0.5 + window.drag_target.x * 1.0 - window.drag_target.width * 0.5 * window.drag_target.scaleX + 300;
            let begin_y = window.leftNode.height * 0.5 + window.drag_target.y * 1.0 - window.drag_target.height * 0.5 * window.drag_target.scaleX;
    
            let ax = (window.mousePosition.x - begin_x) / (window.drag_target.width * window.drag_target.scaleX);
            let ay = (window.mousePosition.y - begin_y) / (window.drag_target.height * window.drag_target.scaleX);
    
            if(ax > 0.0 && ay > 0.0 && ax < 1.0 && ay < 1.0){
                window.creativeCanvas.re = true;
                window.creativeCanvas.rex = ax;
                window.creativeCanvas.rey = ay;
                if(!window.creativeCanvas.in_drag){
                    window.creativeCanvas.refresh_current_point_index();
                }
            }else{
                window.creativeCanvas.re = false;
            }

            if(window.alt){
                if(!window.mouse_l){
                    if(!window.mouse_r){
                        if(!window.mouse_m){
                            if(window.in_color){
                                window.drag_box.do_picking();
                            }
                        }
                    }
                }
            }
        });

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event) {
            if(event.keyCode==cc.KEY.z){
                window.creativeCanvas.undo();
            }
        });

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event) {
            if(event.keyCode==cc.KEY.y){
                window.creativeCanvas.redo();
            }
        });

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event) {
            switch(event.keyCode) {
                case cc.KEY.ctrl:
                    window.ctrl = true;
                    break;
                case cc.KEY.alt:
                    if(!window.alt){
                        window.alt = true;
                        if(window.in_color){
                            window.drag_box.begin_picking();
                            window.drag_box.do_picking();
                        }
                    }
                    break;
            }
        }, this);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, function (event) {
            switch(event.keyCode) {
                case cc.KEY.ctrl:
                    window.ctrl = false;
                    break;
                case cc.KEY.alt:
                    window.alt = false;
                    if(window.in_color){
                    window.drag_box.end_picking();
                    }
                    break;
            }
        }, this);

    },

    onTouchMove: function (event) {
        if (typeof(window.drag_target) != "undefined") {
            if (window.mouse_m || window.mouse_r || window.in_move) {
                var delta = event.touch.getDelta();
                window.drag_target.x += delta.x;
                window.drag_target.y += delta.y;
            }else if (window.mouse_l){
                if(window.isPen){
                    if(window.creativeCanvas.in_drag){
                        window.creativeCanvas.relocate_current_point();
                        window.creativeCanvas.finish();
                    }
                }else{
                    window.creativeCanvas.refresh_current_point_index();
                    if(window.creativeCanvas.current_index > -1){
                        if(window.creativeCanvas.if_point_in_color(window.creativeCanvas.current_index) == window.in_color){
                            window.creativeCanvas.points_XYRGBR.splice(window.creativeCanvas.current_index, 1);
                            window.creativeCanvas.finish();
                        }
                    }
                }
            }
        }
    },

    onMouseDown: function(event) {
        let mouseType = event.getButton();
        if (mouseType === cc.Event.EventMouse.BUTTON_LEFT) {
            window.mouse_l = true;
            if(window.creativeCanvas.re  && window.in_move == false){
                if(window.isPen){
                    if(window.creativeCanvas.current_index < 0){
                        window.creativeCanvas.add_point();
                        window.creativeCanvas.finish();
                    }
                    window.creativeCanvas.in_drag=true;
                }else{
                    window.creativeCanvas.refresh_current_point_index();
                    if(window.creativeCanvas.current_index > -1){
                        if(window.creativeCanvas.if_point_in_color(window.creativeCanvas.current_index) == window.in_color){
                            window.creativeCanvas.points_XYRGBR.splice(window.creativeCanvas.current_index, 1);
                            window.creativeCanvas.finish();
                        }
                    }
                }
            }
        } else if (mouseType === cc.Event.EventMouse.BUTTON_MIDDLE) {
            window.mouse_m = true;
        } else if (mouseType === cc.Event.EventMouse.BUTTON_RIGHT) {
            window.mouse_r = true;
        }
    },

    onMouseUp: function(event) {
        let mouseType = event.getButton();
        if (mouseType === cc.Event.EventMouse.BUTTON_LEFT) {
            window.mouse_l = false;
            window.creativeCanvas.in_drag=false;
            window.creativeCanvas.create_k();
        } else if (mouseType === cc.Event.EventMouse.BUTTON_MIDDLE) {
            window.mouse_m = false;
        } else if (mouseType === cc.Event.EventMouse.BUTTON_RIGHT) {
            window.mouse_r = false;
        }
    },

    onMouseWheel: function(event) {
        if(true){
            if (typeof(window.drag_target) != "undefined") {
                if(event.getScrollY() > 0){
                    window.drag_target.runAction(cc.scaleTo(0.1,window.drag_target.scaleX * 1.2));
                }else{
                    window.drag_target.runAction(cc.scaleTo(0.1,window.drag_target.scaleX / 1.2));
                }
            }
        }else{
            let index = window.minecraft.index;
            if (typeof(window.drag_target) != "undefined") {
                if(event.getScrollY() > 0){
                    index --;
                }else{
                    index ++;
                }
            }
            if(index > 8) index = 0;
            if(index < 0) index = 8;
            window.minecraft.set_index(index);
        }
    },

    begin_picking: function() {
        if (typeof(window.dropper_node) != "undefined") {
            window.creativeCanvas.flush();
        }
    },

    do_picking: function() {
        if (typeof(window.dropper_node) != "undefined") {
            window.dropper_node.x = window.mousePosition.x - cc.winSize.width + 150 + 30;
            window.dropper_node.y = window.mousePosition.y - cc.winSize.height / 2 - 181 + 30;
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
                    window.pickCanvas.currentColor[0] = color[0];
                    window.pickCanvas.currentColor[1] = color[1];
                    window.pickCanvas.currentColor[2] = color[2];
                }else{
                    let target_canvas = window.previewImageCanvas;
                    if(window.girdNode.active){
                        target_canvas = window.girdImageCanvas;
                    }
                    let color = target_canvas.get_color(ax, ay);
                    window.color_picker_main.float_do(color);
                    window.minecraft.set_cur_color([color.r, color.g, color.b]);
                    window.pickCanvas.currentColor[0] = color.r;
                    window.pickCanvas.currentColor[1] = color.g;
                    window.pickCanvas.currentColor[2] = color.b;
                }
            }
        }
    },

    end_picking: function() {
        if (typeof(window.dropper_node) != "undefined") {
            this.do_picking();
            window.pickCanvas.floatingColor[0] = window.dropper_node.color.r;
            window.pickCanvas.floatingColor[1] = window.dropper_node.color.g;
            window.pickCanvas.floatingColor[2] = window.dropper_node.color.b;
            window.dropper_node.x = 122;
            window.dropper_node.y = 268;
            window.color_picker_main.pick_do();
        }
    },

});
