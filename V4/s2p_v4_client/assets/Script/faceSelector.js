cc.Class({
    extends: cc.Component,

    properties: {
        bigFaceNode: {
            default: null, type: cc.Node
        },
        faceNodes: {
            default: [], type: cc.Node
        },
    },

    onLoad(){
        window.faceSeletor = this;
    },

    start () {
        window.faceID = -233;
        window.faceSeletor = this;
        window.bigFaceNode = this.bigFaceNode;
        window.bigFaceSprite = this.bigFaceNode.getComponent('cc.Sprite');
        for(let i=0; i<32; i++){
            this.faceNodes[i].getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame();;
            this.faceNodes[i].getComponent(cc.Sprite).spriteFrame.setTexture(cc.textureCache.addImage("res\\raw-assets\\face_128\\"+ (i + 1) +".jpg"));
            this.faceNodes[i].on(cc.Node.EventType.MOUSE_UP, function (event) {
                window.faceSeletor.on_face_selected(i);
            });
        }
        let ImageLoader = require('./ImageLoader');
        let ImageCanvas = require('./ImageCanvas');
        window.faceImageLoader = ImageLoader('faceImage');
        window.faceImageCanvas = ImageCanvas('faceImage');
        this.on_face_selected(Math.floor(Math.random() * 32));
        this.bigFaceNode.on("mousemove", function (event) {
            window.mousePosition = event.getLocation();
            let begin_x = 150.0 - window.bigFaceNode.width * 0.5;
            let begin_y = 1290.0 - window.bigFaceNode.height * 0.5;
            let ax = (window.mousePosition.x * 1.0 - begin_x) / (window.bigFaceNode.width * 1.0);
            let ay = (window.mousePosition.y * 1.0 - begin_y) / (window.bigFaceNode.height * 1.0);
            if(ax > 0.0 && ay > 0.0 && ax < 1.0 && ay < 1.0){
                let color = window.faceImageCanvas.get_color(ax, ay);
                window.color_picker_main.float_do(color);
            }
        });
        this.bigFaceNode.on("mousedown", function (event) {
            window.color_picker_main.pick_do();
        });
    },

    on_face_selected: function (face_index) {
        window.faceID = face_index;
        window.faceImageLoader.load_url("res\\raw-assets\\face_512\\"+ (face_index + 1) +".jpg",function (image) {
            window.bigFaceSprite.spriteFrame = window.faceImageCanvas.load_image(image, 240, 240);
            window.bigFaceNode.width = 240;
            window.bigFaceNode.height = 240;
        });
        if(window.girdNode.active){
            window.controller.to_gird();
        }else{
            window.controller.hide_light();
        }
        window.creativeCanvas.flush_bg();
        this.flush_preview();
    },

    on_upload: function () {
        if(window.hasSketch == false){
            return;
        }
        window.fileSelector.activate(window.faceSeletor.load_reference);
    },

    flush_preview: function () {
        if(window.in_color){
            this.flush_preview_color();
        }else{
            this.flush_preview_light();
        }
    },

    on_toggle_v4v2: function () {
        window.controller.hide_light();
        window.faceSeletor.flush_preview();
    },

    flush_preview_color: function () {
        if(window.uploading){
            return;
        }
        if(window.hasSketch == false) {
            return;
        }
        window.controller.net_lock('uploading', 0.0);
        let xhr = new XMLHttpRequest();
        xhr.open("POST", window.server_url + "/request_v2_result", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
        xhr.upload.onprogress = function(progress) {
            if (progress.lengthComputable) {
                let x = progress.loaded / progress.total;
                if(x > 0.8){
                    window.controller.net_lock('painting', 0.0);
                }else{
                    window.controller.net_lock('uploading', x);
                }
            }
        };
        xhr.onreadystatechange = function () {
            if (xhr.readyState==4 && xhr.status==200)
            {
                window.controller.net_lock('downloading', 0.0);
                let arr = xhr.responseText.split('_');
                window.current_room = arr[0];
                window.current_step = arr[1];
                console.log('get room id ' + window.current_room);
                console.log('get step id ' + window.current_step);
                if(window.girdNode.active){
                    window.girdImageLoader.on_process = function(x){
                        window.controller.net_lock('downloading', x);
                    }
                    window.girdImageLoader.on_error = function(x){
                        window.controller.net_unlock('error');
                    }
                    window.girdImageLoader.on_finish = function(x){
                        window.controller.net_unlock('finished');
                    }
                    window.girdImageLoader.load_url(window.server_url + '/rooms/' + window.current_room + '/gird.' + window.current_step + '.jpg',function (image) {
                        window.girdSprite.spriteFrame = window.girdImageCanvas.load_image(image, image.width, image.height);
                        window.bghintSprite.spriteFrame = window.renderImageCanvas.dark();
                        window.alphaSketchSprite.spriteFrame = window.sketchImageCanvas.clear();
                        window.hasRender = false;
                        window.controller.to_gird();
                        window.controller.net_unlock('finished');
                        window.resultImageLoader.on_error = null;
                        window.resultImageLoader.on_process = null;
                        window.resultImageLoader.on_finish = null;
                        window.resultImageLoader.load_url(window.server_url + '/rooms/' + window.current_room + '/result.' + window.current_step + '.jpg',function (image) {
                            window.previewSprite.spriteFrame = window.previewImageCanvas.load_image(image, image.width, image.height);
                        });
                    });
                }else{
                    window.resultImageLoader.on_process = function(x){
                        window.controller.net_lock('downloading', x);
                    }
                    window.resultImageLoader.on_error = function(x){
                        window.controller.net_unlock('error');
                    }
                    window.resultImageLoader.on_finish = function(x){
                        window.controller.net_unlock('finished');
                    }
                    window.resultImageLoader.load_url(window.server_url + '/rooms/' + window.current_room + '/result.' + window.current_step + '.jpg',function (image) {
                        window.previewSprite.spriteFrame = window.previewImageCanvas.load_image(image, image.width, image.height);
                        window.bghintSprite.spriteFrame = window.renderImageCanvas.dark();
                        window.alphaSketchSprite.spriteFrame = window.sketchImageCanvas.clear();
                        window.hasRender = false;
                        window.controller.hide_light();
                        window.controller.net_unlock('finished');
                        window.girdImageLoader.on_error = null;
                        window.girdImageLoader.on_process = null;
                        window.girdImageLoader.on_finish = null;
                        window.girdImageLoader.load_url(window.server_url + '/rooms/' + window.current_room + '/gird.' + window.current_step + '.jpg',function (image) {
                            window.girdSprite.spriteFrame = window.girdImageCanvas.load_image(image, image.width, image.height);
                        });
                    });
                }
            }else{
                if(xhr.readyState==4){
                    window.controller.net_unlock('error');
                }
            }
        };
        xhr.send
        (
            "room=" + window.current_room +
            "&points=" + encodeURIComponent(JSON.stringify(window.creativeCanvas.points_XYRGBR)) +
            "&face=" + ((window.faceID < 0)?encodeURIComponent(window.faceImageCanvas.canvas.toDataURL("image/png")):"null") +
            "&faceID=" + (window.faceID + 65535) +
            "&need_render=" + (0) +
            "&skipper=" + "null" +
            "&inv4=" + (window.V4_toggle.isChecked?"1":"0") +
            "&r=" + window.lighter.light_R_slider.progress +
            "&g=" + window.lighter.light_G_slider.progress +
            "&b=" + window.lighter.light_B_slider.progress +
            "&h=" + window.lighter.light_H_slider.progress +
            "&d=" + window.light_direction
        );
        console.log('request sended');
    },

    flush_preview_light: function () {
        if(window.uploading){
            return;
        }
        if(window.hasSketch == false) {
            return;
        }
        if(window.current_step == "new"){
            return;
        }
        window.controller.net_lock('uploading', 0.0);
        let xhr = new XMLHttpRequest();
        xhr.open("POST", window.server_url + "/request_v2_result", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
        xhr.upload.onprogress = function(progress) {
            if (progress.lengthComputable) {
                let x = progress.loaded / progress.total;
                if(x > 0.8){
                    window.controller.net_lock('painting', 0.0);
                }else{
                    window.controller.net_lock('uploading', x);
                }
            }
        };
        xhr.onreadystatechange = function () {
            if (xhr.readyState==4 && xhr.status==200)
            {
                window.controller.net_lock('downloading', 0.0);
                let arr = xhr.responseText.split('_');
                window.current_room = arr[0];
                window.current_step = arr[1];
                console.log('get room id ' + window.current_room);
                console.log('get step id ' + window.current_step);
                window.renderImageLoader.on_process = function(x){
                    window.controller.net_lock('downloading', x);
                }
                window.renderImageLoader.on_error = function(x){
                    window.controller.net_unlock('error');
                }
                window.renderImageLoader.on_finish = function(x){
                    window.controller.net_unlock('finished');
                }
                window.renderImageLoader.load_url(window.server_url + '/rooms/' + window.current_room + '/result.' + window.current_step + '.jpg',function (image) {
                    window.bghintSprite.spriteFrame = window.renderImageCanvas.load_image(image, image.width, image.height);
                    window.alphaSketchSprite.spriteFrame = window.sketchImageCanvas.clear();
                    window.hasRender = true;
                    window.controller.show_light();
                    window.controller.net_unlock('finished');
                });
            }else{
                if(xhr.readyState==4){
                    window.controller.net_unlock('error');
                }
            }
        };
        xhr.send
        (
            "room=" + window.current_room +
            "&points=" + encodeURIComponent(JSON.stringify(window.creativeCanvas.points_XYRGBR)) +
            "&need_render=" + (2) +
            "&skipper=" + window.current_step +
            "&inv4=" + (window.V4_toggle.isChecked?"1":"0") +
            "&r=" + window.lighter.light_R_slider.progress +
            "&g=" + window.lighter.light_G_slider.progress +
            "&b=" + window.lighter.light_B_slider.progress +
            "&h=" + window.lighter.light_H_slider.progress +
            "&d=" + window.light_direction
        );
        console.log('request sended');
    },

    load_reference: function (url) {
        window.faceImageLoader.load_url(url,function (image) {
            if(image.width > image.height * 2.5){
                return;
            }
            if(image.height > image.width * 2.5){
                return;
            }
            let s240 = window.regulator.maxRegulate([image.width, image.height], 240);
            window.bigFaceSprite.spriteFrame = window.faceImageCanvas.load_image(image, s240[0], s240[1]);
            window.bigFaceNode.width = s240[0];
            window.bigFaceNode.height = s240[1];
            window.faceID = -233;
            window.controller.hide_light();
            window.faceSeletor.flush_preview();
        });
    },

    // update (dt) {},
});
