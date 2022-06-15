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
        window.hasGird = false;
        window.hasColor = false;
        window.hasRender = false;
        window.controller.net_lock('painting', 0.0);
        let xhr = new XMLHttpRequest();
        xhr.open("POST", window.server_url + "/request_result", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
        xhr.onreadystatechange = function () {
            if (xhr.readyState==4 && xhr.status==200)
            {
                let arr = xhr.responseText.split('_');
                window.current_room = arr[0];
                window.current_step = arr[1];
                console.log('get room id ' + window.current_room);
                console.log('get step id ' + window.current_step);
                window.controller.net_unlock('finished');
                window.faceSeletor.download_gird_color();
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
            "&r=" + ((window.lighter.color_tog.isChecked)?window.lighter.light_R_slider.progress:-1) +
            "&g=" + ((window.lighter.color_tog.isChecked)?window.lighter.light_G_slider.progress:-1) +
            "&b=" + ((window.lighter.color_tog.isChecked)?window.lighter.light_B_slider.progress:-1) +
            "&h=" + window.lighter.light_H_slider.progress +
            "&d=" + window.light_direction
        );
        console.log('request sended');
    },

    download_gird_color: function(){
        window.resultImageLoader.on_error = function(x){
            window.controller.net_unlock('error');
        }
        window.resultImageLoader.on_finish = function(x){
            window.controller.net_unlock('finished');
        }
        window.finImageLoaders[0].load_url(window.server_url + '/rooms/' + window.current_room + '/sketch.png',function (image) {
            window.c1BtnSprite.spriteFrame = window.finImageCanvass[0].load_image(image, image.width, image.height);
            if(window.current_cid == 0){
                window.previewSprite.spriteFrame = window.previewImageCanvas.load_image(image, image.width, image.height);
                window.alphaSketchSprite.spriteFrame = window.sketchImageCanvas.clear();
                window.hasColor = true;
                window.controller.net_unlock('finished');
                window.controller.hide_light();
            }
        });
        window.finImageLoaders[1].load_url(window.server_url + '/rooms/' + window.current_room + '/' + window.current_step + '.flat_careless.png',function (image) {
            window.c2BtnSprite.spriteFrame = window.finImageCanvass[1].load_image(image, image.width, image.height);
            if(window.current_cid == 1){
                window.previewSprite.spriteFrame = window.previewImageCanvas.load_image(image, image.width, image.height);
                window.alphaSketchSprite.spriteFrame = window.sketchImageCanvas.clear();
                window.hasColor = true;
                window.controller.net_unlock('finished');
                window.controller.hide_light();
            }
        });
        window.finImageLoaders[2].load_url(window.server_url + '/rooms/' + window.current_room + '/' + window.current_step + '.blended_flat_careless.png',function (image) {
            window.c3BtnSprite.spriteFrame = window.finImageCanvass[2].load_image(image, image.width, image.height);
            if(window.current_cid == 2){
                window.previewSprite.spriteFrame = window.previewImageCanvas.load_image(image, image.width, image.height);
                window.alphaSketchSprite.spriteFrame = window.sketchImageCanvas.clear();
                window.hasColor = true;
                window.controller.net_unlock('finished');
                window.controller.hide_light();
            }
        });
        window.finImageLoaders[3].load_url(window.server_url + '/rooms/' + window.current_room + '/' + window.current_step + '.smoothed_careless.png',function (image) {
            window.c4BtnSprite.spriteFrame = window.finImageCanvass[3].load_image(image, image.width, image.height);
            if(window.current_cid == 3){
                window.previewSprite.spriteFrame = window.previewImageCanvas.load_image(image, image.width, image.height);
                window.alphaSketchSprite.spriteFrame = window.sketchImageCanvas.clear();
                window.hasColor = true;
                window.controller.net_unlock('finished');
                window.controller.hide_light();
            }
        });
        window.finImageLoaders[4].load_url(window.server_url + '/rooms/' + window.current_room + '/' + window.current_step + '.blended_smoothed_careless.png',function (image) {
            window.c5BtnSprite.spriteFrame = window.finImageCanvass[4].load_image(image, image.width, image.height);
            if(window.current_cid == 4){
                window.previewSprite.spriteFrame = window.previewImageCanvas.load_image(image, image.width, image.height);
                window.alphaSketchSprite.spriteFrame = window.sketchImageCanvas.clear();
                window.hasColor = true;
                window.controller.net_unlock('finished');
                window.controller.hide_light();
            }
        });
        window.finImageLoaders[5].load_url(window.server_url + '/rooms/' + window.current_room + '/' + window.current_step + '.flat_careful.png',function (image) {
            window.c6BtnSprite.spriteFrame = window.finImageCanvass[5].load_image(image, image.width, image.height);
            if(window.current_cid == 5){
                window.previewSprite.spriteFrame = window.previewImageCanvas.load_image(image, image.width, image.height);
                window.alphaSketchSprite.spriteFrame = window.sketchImageCanvas.clear();
                window.hasColor = true;
                window.controller.net_unlock('finished');
                window.controller.hide_light();
            }
        });
        window.finImageLoaders[6].load_url(window.server_url + '/rooms/' + window.current_room + '/' + window.current_step + '.blended_flat_careful.png',function (image) {
            window.c7BtnSprite.spriteFrame = window.finImageCanvass[6].load_image(image, image.width, image.height);
            if(window.current_cid == 6){
                window.previewSprite.spriteFrame = window.previewImageCanvas.load_image(image, image.width, image.height);
                window.alphaSketchSprite.spriteFrame = window.sketchImageCanvas.clear();
                window.hasColor = true;
                window.controller.net_unlock('finished');
                window.controller.hide_light();
            }
        });
        window.finImageLoaders[7].load_url(window.server_url + '/rooms/' + window.current_room + '/' + window.current_step + '.smoothed_careful.png',function (image) {
            window.c8BtnSprite.spriteFrame = window.finImageCanvass[7].load_image(image, image.width, image.height);
            if(window.current_cid == 7){
                window.previewSprite.spriteFrame = window.previewImageCanvas.load_image(image, image.width, image.height);
                window.alphaSketchSprite.spriteFrame = window.sketchImageCanvas.clear();
                window.hasColor = true;
                window.controller.net_unlock('finished');
                window.controller.hide_light();
            }
        });
        window.finImageLoaders[8].load_url(window.server_url + '/rooms/' + window.current_room + '/' + window.current_step + '.blended_smoothed_careful.png',function (image) {
            window.c9BtnSprite.spriteFrame = window.finImageCanvass[8].load_image(image, image.width, image.height);
            if(window.current_cid == 8){
                window.previewSprite.spriteFrame = window.previewImageCanvas.load_image(image, image.width, image.height);
                window.alphaSketchSprite.spriteFrame = window.sketchImageCanvas.clear();
                window.hasColor = true;
                window.controller.net_unlock('finished');
                window.controller.hide_light();
            }
        });
    },

    flush_preview_light: function () {

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
