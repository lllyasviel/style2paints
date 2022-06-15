cc.Class({
    extends: cc.Component,

    properties: {
        sketchNode: {
            default: null, type: cc.Node
        },
        alphaSketchNode: {
            default: null, type: cc.Node
        },
        hintNode: {
            default: null, type: cc.Node
        },
        bghintNode: {
            default: null, type: cc.Node
        },
        girdNode: {
            default: null, type: cc.Node
        },
        previewNode: {
            default: null, type: cc.Node
        },
        labelNode: {
            default: null, type: cc.Node
        },
        pendingNode: {
            default: null, type: cc.Node
        },
        fileBtnNode: {
            default: null, type: cc.Node
        },
        aiBtnNode: {
            default: null, type: cc.Node
        },
        magicBtnNode: {
            default: null, type: cc.Node
        },
        leftNode: {
            default: null, type: cc.Node
        },
        confirmNode: {
            default: null, type: cc.Node
        },
        logoNode: {
            default: null, type: cc.Node
        },
        cpNode: {
            default: null, type: cc.Node
        },
        lightNode: {
            default: null, type: cc.Node
        },
        processingNode: {
            default: null, type: cc.Node
        },
        V4_toggle: {
            default: null, type: cc.Toggle
        },
    },

    show_light: function () {
        window.controller.lightNode.y = 181;
        window.in_color = false;
        window.bghintNode.active = true;
        window.creativeCanvas.finish();
        window.minecraft.shift();
        window.girdNode.active = false;
        if(window.hasRender == false){
            window.faceSeletor.flush_preview_light();
        }
        console.log('show_light');
    },

    hide_light: function () {
        window.controller.lightNode.y = 4096;
        window.in_color = true;
        window.bghintNode.active = false;
        window.creativeCanvas.finish();
        window.minecraft.shift();
        window.girdNode.active = false;
        console.log('hide_light');
    },

    to_gird: function () {
        this.hide_light();
        window.girdNode.active = true;
        console.log('to_gird');
    },

    on_pen: function () {
        window.isPen = true;
        window.in_move = false;
        window.eraser_masker.active = false;
        console.log('on_pen');
    },

    on_eraser: function () {
        window.isPen = false;
        window.in_move = false;
        window.minecraft.set_index(-233);
        window.eraser_masker.active = true;
        console.log('on_eraser');
    },

    on_upload_hints: function () {
        if(window.hasSketch == false) {
            return;
        }
        var point_str = prompt("Points?");
        if(point_str != null){
            window.creativeCanvas.points_XYRGBR = JSON.parse(point_str);
            window.creativeCanvas.finish();
            window.creativeCanvas.create_k();
        }

    },

    on_download_hints: function () {
        if(window.hasSketch == false) {
            return;
        }
        let new_document = window.open("about:blank").document;
        new_document.body.style.backgroundColor="#000000";
        new_document.writeln(JSON.stringify(window.creativeCanvas.points_XYRGBR));
    },

    on_logo: function () {
        let turl = "https://style2paints.github.io/";
        if (navigator.language.substring(0,2) == "zh") {
            turl = "https://style2paints.github.io/README_zh";
        }
        if (navigator.language.substring(0, 2) == "ja") {
            turl = "https://style2paints.github.io/README_ja";
        }
        window.open(turl);
    },

    on_logo_en: function () {
        window.open("https://style2paints.github.io/");
    },

    on_logo_zh: function () {
        window.open("https://style2paints.github.io/README_zh");
    },

    on_logo_ja: function () {
        window.open("https://style2paints.github.io/README_ja");
    },

    on_twitter: function () {
        window.open("https://twitter.com/hashtag/style2paints?f=tweets&vertical=default");
    },

    on_github: function () {
        window.open("https://github.com/lllyasviel/style2paints");
    },

    on_file: function () {
        if(window.uploading){
            return;
        }
        window.fileSelector.activate(window.controller.load_sketch);
    },

    on_result: function () {
        let all_html = "";
        all_html += '<div><img src=' + window.tripleCanvas.canvas.toDataURL("\"image/png") + ' width=\"512\"></div>';
        all_html += '<div><img src=' + window.server_url + '/rooms/' + window.current_room + '/YUV.' + window.current_step + '.jpg' + ' width=\"512\"></div>';
        all_html += '<div><img src=' + window.tripleCanvas.canvas_render.toDataURL("\"image/png") + ' width=\"512\"></div>';
        all_html += '<div><img src=' + window.tripleCanvas.canvas_color.toDataURL("\"image/png") + ' width=\"512\"></div>';
        all_html += '<div><img src=' + window.tripleCanvas.canvas_light.toDataURL("\"image/png") + ' width=\"512\"></div>';
        all_html += '<div><img src=' + window.tripleCanvas.canvas_shade.toDataURL("\"image/png") + ' width=\"512\"></div>';
        all_html += '<div><img src=' + window.server_url + '/rooms/' + window.current_room + '/composition.' + window.current_step + '.jpg' + ' width=\"512\"></div>';
        all_html += '<div><img src=' + window.server_url + '/rooms/' + window.current_room + '/gird.' + window.current_step + '.jpg' + ' width=\"512\"></div>';
        all_html += '<div><img src=' + window.server_url + '/rooms/' + window.current_room + '/DEL.' + window.current_step + '.jpg' + ' width=\"512\"></div>';
        all_html += '<div><img src=' + window.server_url + '/rooms/' + window.current_room + '/HSV.' + window.current_step + '.jpg' + ' width=\"512\"></div>';
        all_html += '<div><img src=' + window.tripleCanvas.canvas_sketch.toDataURL("\"image/png") + ' width=\"512\"></div>';
        all_html += '<div>' + JSON.stringify(window.creativeCanvas.points_XYRGBR) + '</div>';
        window.confirmNode.active = false;
        let new_document = window.open("about:blank").document;
        new_document.writeln('<html><head></head><body style="background-color:#C8C8C8">' + all_html + '</body></html>');
    },

    on_result_cancel: function () {
        window.confirmNode.active = false;
    },

    on_magic: function () {
        window.faceSeletor.flush_preview();
    },

    on_ai: function () {
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
                window.resultImageLoader.on_process = function(x){
                    window.controller.net_lock('downloading', x);
                }
                window.resultImageLoader.on_error = function(x){
                    window.controller.net_unlock('error');
                }
                window.resultImageLoader.on_finish = function(x){
                    window.controller.net_unlock('finished');
                }
                window.resultImageLoader.load_url(window.server_url + '/rooms/' + window.current_room + '/preview.' + window.current_step + '.jpg',function (image) {
                    window.tripleCanvas.load_image(image, image.width, image.height);
                    window.confirmNode.active = true;
                    window.cpNode.width = cc.winSize.width- 100;
                    window.cpNode.height = cc.winSize.height- 300;
                    window.cpNodeSprite.spriteFrame = window.tripleCanvas.spriteFrame_p;
                    let ra = (window.cpNode.width * 1.0) / (window.tripleCanvas.canvas_preview.width * 1.0);
                    let rb = (window.cpNode.height * 1.0) / (window.tripleCanvas.canvas_preview.height * 1.0);
                    let r = Math.min(ra, rb);
                    window.cpNode.width = parseInt(window.tripleCanvas.canvas_preview.width * 1.0 * r);
                    window.cpNode.height = parseInt(window.tripleCanvas.canvas_preview.height * 1.0 * r);
                    window.previewSprite.spriteFrame = window.previewImageCanvas.load_canvas(window.tripleCanvas.canvas);
                    window.bghintSprite.spriteFrame = window.renderImageCanvas.load_canvas(window.tripleCanvas.canvas_render);
                    window.hasRender = true;
                    window.controller.net_unlock('finished');
                    window.girdImageLoader.on_error = null;
                    window.girdImageLoader.on_process = null;
                    window.girdImageLoader.on_finish = null;
                    window.girdImageLoader.load_url(window.server_url + '/rooms/' + window.current_room + '/gird.' + window.current_step + '.jpg',function (image) {
                        window.girdSprite.spriteFrame = window.girdImageCanvas.load_image(image, image.width, image.height);
                    });
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
            "&face=" + ((window.faceID < 0)?encodeURIComponent(window.faceImageCanvas.canvas.toDataURL("image/png")):"null") +
            "&faceID=" + (window.faceID + 65535) +
            "&need_render=" + (1) +
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

    on_big_error: function(){
        let turl = "Network error. Please refresh this page.";
        if (navigator.language.substring(0,2) == "zh") {
            turl = "严重网络错误，请刷新。";
        }
        if (navigator.language.substring(0, 2) == "ja") {
            turl = "ネットワークエラー、ページを更新してください。";
        }
        alert(turl);
    },

    net_lock: function(text, x){
        console.log(text + ' - net_lock -' + x)
        window.uploading = true;
        window.fileBtnNode.active = false;
        window.aiBtnNode.active = false;
        window.magicBtnNode.active = false;
        window.processingNode.active = true;
        window.state_label.change(text, x);
    },

    net_unlock: function(text){
        console.log(text + ' - net_unlock')
        window.uploading = false;
        window.fileBtnNode.active = true;
        window.aiBtnNode.active = true;
        window.magicBtnNode.active = true;
        window.processingNode.active = false;
        window.state_label.change(text, 1.0);
    },

    onLoad: function () {
        window.controller = this;
        window.uploading = false;
        window.server_url = 'http://127.0.0.1:8080';
        window.server_url = 'https://s2p.moe';
        window.server_url = '';
        window.fileSelector = require('./FileInputs');
        window.regulator = require('./SizeRegulator');

        window.fileBtnNode = this.fileBtnNode;
        window.aiBtnNode = this.aiBtnNode;
        window.magicBtnNode = this.magicBtnNode;
        window.confirmNode = this.confirmNode;

        window.confirmNode.active = false;

        window.sketchNode = this.sketchNode;
        window.sketchSprite = this.sketchNode.getComponent('cc.Sprite');
        window.alphaSketchNode = this.alphaSketchNode;
        window.alphaSketchSprite = this.alphaSketchNode.getComponent('cc.Sprite');
        window.cpNode = this.cpNode;
        window.cpNodeSprite = this.cpNode.getComponent('cc.Sprite');
        window.hasSketch = false;
        window.hasRender = false;
        window.in_color = true;

        window.hintNode = this.hintNode;
        window.hintSprite = this.hintNode.getComponent('cc.Sprite');
        
        window.bghintNode = this.bghintNode;
        window.bghintSprite = this.bghintNode.getComponent('cc.Sprite');
        window.bghintNode.active = false;

        window.girdNode = this.girdNode;
        window.girdSprite = this.girdNode.getComponent('cc.Sprite');
        window.girdNode.active = false;

        window.previewNode = this.previewNode;
        window.previewSprite = this.previewNode.getComponent('cc.Sprite');

        window.state_label = this.labelNode.getComponent('fake_bar');

        window.pendingNode = this.pendingNode;
        window.pendingNode.active = false;

        window.V4_toggle = this.V4_toggle;

        let ImageLoader = require('./ImageLoader');
        let ImageCanvas = require('./ImageCanvas');
        let BoxCanvas = require('./BoxCanvas');
        let TripleCanvas = require('./TripleCanvas');

        window.sketchImageLoader = ImageLoader('sketchImage');
        window.sketchImageCanvas = ImageCanvas('sketchImage');
        window.renderImageLoader = ImageLoader('renderImage');
        window.renderImageCanvas = ImageCanvas('renderImage');
        window.girdImageLoader = ImageLoader('girdImage');
        window.girdImageCanvas = ImageCanvas('girdImage');
        window.sketchBoxCanvas = BoxCanvas('sketchBox');
        window.tripleCanvas = TripleCanvas('tripleCanvas');

        window.hintImageLoader = ImageLoader('hintImage');

        window.resultImageLoader = ImageLoader('resultImage');

        window.previewImageLoader = ImageLoader('previewImage');
        window.previewImageCanvas = ImageCanvas('previewImage');

        window.creativeCanvas = require('./CreativeCanvas');

        window.boxLoader = ImageLoader('boxLoader');
        window.boxLoader.load_url("res\\raw-assets\\Texture\\board.png", function(e){});

        window.leftNode = this.leftNode;

        window.isPen = true;
        window.in_move = false;

        window.current_room = "new";
        window.current_step = "new";

        window.logoNode = this.logoNode;

        window.processingNode = this.processingNode;
        window.processingNode.active = false;

    },

    start () {
        setTimeout(this.on_pen, 500);
        setTimeout(this.hide_light, 500);
    },

    load_sketch: function (url) {
        window.sketchImageLoader.load_url(url,function (image) {
            if(image.width > image.height * 3){
                return;
            }
            if(image.height > image.width * 3){
                return;
            }
            window.previewSprite.spriteFrame = window.previewImageCanvas.clear();
            window.current_room = "new";
            window.current_step = "new";
            let s2048 = window.regulator.minRegulate([image.width, image.height], 2048);
            window.sketchSprite.spriteFrame = window.sketchBoxCanvas.ini(image.width, image.height);
            window.alphaSketchSprite.spriteFrame = window.sketchImageCanvas.load_alpha(image, image.width, image.height);
            window.hintSprite.spriteFrame = window.creativeCanvas.ini(s2048[0], s2048[1]);
            window.bghintSprite.spriteFrame = window.renderImageCanvas.clear();
            window.girdSprite.spriteFrame = window.girdImageCanvas.clear();
            window.sketchNode.width = s2048[0];
            window.sketchNode.height = s2048[1];
            window.sketchNode.scaleX = ((cc.winSize.height - 300.0) * 1.0) / (window.sketchNode.height) * 1.0;
            window.sketchNode.scaleY = window.sketchNode.scaleX;
            window.sketchNode.x = 0;
            window.sketchNode.y = cc.winSize.height * 0.5 - window.sketchNode.scaleY * window.sketchNode.height * 0.5 - 100;
            window.hasSketch = true;
            window.logoNode.active = false;
            window.controller.uploadSketch();
        });
    },

    load_hints: function (url) {
        window.sketchImageLoader.load_url(url,function (image) {
            window.previewSprite.spriteFrame = window.previewImageCanvas.clear();
            window.hintSprite.spriteFrame = window.creativeCanvas.ini_image(image, image.width, image.height);
        });
    },

    uploadSketch: function () {
        if(window.uploading){
            return;
        }
        if(window.sketchImageCanvas.source==null) {
            return;
        }
        window.controller.net_lock('initializing', 0.0);
        window.current_room = "new";
        window.current_step = "new";
        window.creativeCanvas.kill_preview();
        let xhr = new XMLHttpRequest();
        xhr.open("POST", window.server_url + "/upload_v2_sketch", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
        xhr.upload.onprogress = function(progress) {
            if (progress.lengthComputable) {
                let x = progress.loaded / progress.total;
                if(x > 0.8){
                    window.controller.net_lock('preparing', 0.0);
                }else{
                    window.controller.net_lock('initializing', x);
                }
            }
        };
        xhr.onreadystatechange = function () {
            if (xhr.readyState==4 && xhr.status==200)
            {
                let arr = xhr.responseText.split('_');
                window.current_room = arr[0];
                window.current_step = arr[1];
                console.log('get room id ' + window.current_room);
                console.log('get step id ' + window.current_step);
                window.controller.net_unlock('finished');
                window.controller.hide_light();
                window.creativeCanvas.flush_bg();
                window.faceSeletor.flush_preview();
            }else{
                if(xhr.readyState==4){
                    window.state_label.change('error', 1.0);
                    window.controller.on_big_error();
                    window.location.reload();
                }
            }
        };
        xhr.send
        (
            "room=" + window.current_room +
            "&sketch=" + encodeURIComponent(window.sketchImageCanvas.dataurl)
        );
        console.log('sketch uploaded');
    },

    // update (dt) {},
});
