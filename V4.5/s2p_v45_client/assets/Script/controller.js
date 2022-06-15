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
        real_fileBtnNode: {
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
        c9Node: {
            default: null, type: cc.Node
        },
        logoNode: {
            default: null, type: cc.Node
        },
        cpNode: {
            default: null, type: cc.Node
        },
        cpNode2: {
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
        c1BtnNode: {
            default: null, type: cc.Node
        },
        c2BtnNode: {
            default: null, type: cc.Node
        },
        c3BtnNode: {
            default: null, type: cc.Node
        },
        c4BtnNode: {
            default: null, type: cc.Node
        },
        c5BtnNode: {
            default: null, type: cc.Node
        },
        c6BtnNode: {
            default: null, type: cc.Node
        },
        c7BtnNode: {
            default: null, type: cc.Node
        },
        c8BtnNode: {
            default: null, type: cc.Node
        },
        c9BtnNode: {
            default: null, type: cc.Node
        },
        claNode: {
            default: null, type: cc.Node
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
        if(window.hasGird){
            if(!window.hasColor){
                window.faceSeletor.download_gird_color();
            }
        }
    },

    to_gird: function () {
        window.controller.lightNode.y = 4096;
        window.in_color = true;
        window.bghintNode.active = false;
        window.creativeCanvas.finish();
        window.minecraft.shift();
        window.girdNode.active = true;
        console.log('to_gird');
        if(!window.hasGird){
            if(window.hasColor){
                window.faceSeletor.download_gird_color();
            }
        }
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
        let new_document = window.open("about:blank").document;

        window.tripleCanvas.load_local();
        let all_html = "";
        all_html += '<div><a href="https://twitter.com/hashtag/style2paints?f=tweets&vertical=default" target="_blank">【 Click here to see others\'s results on Twitter. 】</a></div>';
        all_html += '<div><a href="https://twitter.com/hashtag/style2paints?f=tweets&vertical=default" target="_blank">【 他の人の結果を見る。 】</a></div>';
        all_html += '<div><p><br/></p></div>';
        all_html += '<div><img src=' + window.server_url + '/rooms/' + window.current_room + '/' + window.current_step + '.blended_smoothed_careful.png' + ' width=\"1024\"></div>';
        all_html += '<div><img src=' + window.server_url + '/rooms/' + window.current_room + '/' + window.current_step + '.blended_flat_careful.png' + ' width=\"1024\"></div>';
        all_html += '<div><img src=' + window.server_url + '/rooms/' + window.current_room + '/' + window.current_step + '.flat_careful.png' + ' width=\"1024\"></div>';
        all_html += '<div><img src=' + window.server_url + '/rooms/' + window.current_room + '/' + window.current_step + '.smoothed_careful.png' + ' width=\"1024\"></div>';
        all_html += '<div><img src=' + window.server_url + '/rooms/' + window.current_room + '/' + window.current_step + '.blended_smoothed_careless.png' + ' width=\"1024\"></div>';
        all_html += '<div><img src=' + window.server_url + '/rooms/' + window.current_room + '/' + window.current_step + '.blended_flat_careless.png' + ' width=\"1024\"></div>';
        all_html += '<div><img src=' + window.server_url + '/rooms/' + window.current_room + '/' + window.current_step + '.flat_careless.png' + ' width=\"1024\"></div>';
        all_html += '<div><img src=' + window.server_url + '/rooms/' + window.current_room + '/' + window.current_step + '.smoothed_careless.png' + ' width=\"1024\"></div>';
        all_html += '<div><img src=' + window.server_url + '/rooms/' + window.current_room + '/sketch.png' + ' width=\"1024\"></div>';
        all_html += '<div>' + JSON.stringify(window.creativeCanvas.points_XYRGBR) + '</div>';
        window.confirmNode.active = false;
        new_document.writeln('<html><head></head><body style="background-color:#C8C8C8">' + all_html + '</body></html>');
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
        try{
            console.log(text + ' - net_unlock')
            window.uploading = false;
            window.fileBtnNode.active = true;
            window.aiBtnNode.active = true;
            window.magicBtnNode.active = true;
            window.processingNode.active = false;
            window.state_label.change(text, 1.0);
        }catch(err){
            console.log(err);
        }
    },

    on_c0_event: function(){
        window.current_cid = 0;
        window.previewSprite.spriteFrame = window.previewImageCanvas.load_canvas(window.finImageCanvass[window.current_cid].canvas);
        window.claNode.y = window.c1BtnNode.y;
    },

    on_c1_event: function(){
        window.current_cid = 1;
        window.previewSprite.spriteFrame = window.previewImageCanvas.load_canvas(window.finImageCanvass[window.current_cid].canvas);
        window.claNode.y = window.c2BtnNode.y;
    },

    on_c2_event: function(){
        window.current_cid = 2;
        window.previewSprite.spriteFrame = window.previewImageCanvas.load_canvas(window.finImageCanvass[window.current_cid].canvas);
        window.claNode.y = window.c3BtnNode.y;
    },

    on_c3_event: function(){
        window.current_cid = 3;
        window.previewSprite.spriteFrame = window.previewImageCanvas.load_canvas(window.finImageCanvass[window.current_cid].canvas);
        window.claNode.y = window.c4BtnNode.y;
    },

    on_c4_event: function(){
        window.current_cid = 4;
        window.previewSprite.spriteFrame = window.previewImageCanvas.load_canvas(window.finImageCanvass[window.current_cid].canvas);
        window.claNode.y = window.c5BtnNode.y;
    },

    on_c5_event: function(){
        window.current_cid = 5;
        window.previewSprite.spriteFrame = window.previewImageCanvas.load_canvas(window.finImageCanvass[window.current_cid].canvas);
        window.claNode.y = window.c6BtnNode.y;
    },

    on_c6_event: function(){
        window.current_cid = 6;
        window.previewSprite.spriteFrame = window.previewImageCanvas.load_canvas(window.finImageCanvass[window.current_cid].canvas);
        window.claNode.y = window.c7BtnNode.y;
    },

    on_c7_event: function(){
        window.current_cid = 7;
        window.previewSprite.spriteFrame = window.previewImageCanvas.load_canvas(window.finImageCanvass[window.current_cid].canvas);
        window.claNode.y = window.c8BtnNode.y;
    },

    on_c8_event: function(){
        window.current_cid = 8;
        window.previewSprite.spriteFrame = window.previewImageCanvas.load_canvas(window.finImageCanvass[window.current_cid].canvas);
        window.claNode.y = window.c9BtnNode.y;
    },

    onLoad: function () {
        window.controller = this;
        window.uploading = false;
        window.server_url = 'http://127.0.0.1:8233';
        // window.server_url = 'https://s2p.moe';
        // window.server_url = '';
        window.fileSelector = require('./FileInputs');
        window.regulator = require('./SizeRegulator');

        window.fileBtnNode = this.fileBtnNode;
        window.aiBtnNode = this.aiBtnNode;
        window.magicBtnNode = this.magicBtnNode;
        window.confirmNode = this.confirmNode;
        window.c9Node = this.c9Node;

        window.c1BtnNode = this.c1BtnNode;
        window.c2BtnNode = this.c2BtnNode;
        window.c3BtnNode = this.c3BtnNode;
        window.c4BtnNode = this.c4BtnNode;
        window.c5BtnNode = this.c5BtnNode;
        window.c6BtnNode = this.c6BtnNode;
        window.c7BtnNode = this.c7BtnNode;
        window.c8BtnNode = this.c8BtnNode;
        window.c9BtnNode = this.c9BtnNode;

        window.claNode = this.claNode;

        window.c1BtnSprite = this.c1BtnNode.getComponent('cc.Sprite');
        window.c2BtnSprite = this.c2BtnNode.getComponent('cc.Sprite');
        window.c3BtnSprite = this.c3BtnNode.getComponent('cc.Sprite');
        window.c4BtnSprite = this.c4BtnNode.getComponent('cc.Sprite');
        window.c5BtnSprite = this.c5BtnNode.getComponent('cc.Sprite');
        window.c6BtnSprite = this.c6BtnNode.getComponent('cc.Sprite');
        window.c7BtnSprite = this.c7BtnNode.getComponent('cc.Sprite');
        window.c8BtnSprite = this.c8BtnNode.getComponent('cc.Sprite');
        window.c9BtnSprite = this.c9BtnNode.getComponent('cc.Sprite');

        window.confirmNode.active = false;
        window.c9Node.active = false;

        window.sketchNode = this.sketchNode;
        window.sketchSprite = this.sketchNode.getComponent('cc.Sprite');
        window.alphaSketchNode = this.alphaSketchNode;
        window.alphaSketchSprite = this.alphaSketchNode.getComponent('cc.Sprite');
        window.cpNode = this.cpNode;
        window.cpNodeSprite = this.cpNode.getComponent('cc.Sprite');
        window.hasSketch = false;
        window.hasGird = false;
        window.hasColor = false;
        window.hasRender = false;
        window.in_color = true;

        window.current_cid = 0;
        window.claNode.y = window.c1BtnNode.y;

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

        window.cpNode2 = this.cpNode2;
        window.cpNode2Sprite = this.cpNode2.getComponent('cc.Sprite');

        window.state_label = this.labelNode.getComponent('fake_bar');

        window.pendingNode = this.pendingNode;
        window.pendingNode.active = false;

        window.V4_toggle = this.V4_toggle;

        let ImageLoader = require('./ImageLoader');
        let ImageCanvas = require('./ImageCanvas');
        let BoxCanvas = require('./BoxCanvas');
        let TripleCanvas = require('./TripleCanvas');

        window.finImageLoaders = [
            ImageLoader('finImage1'),
            ImageLoader('finImage2'),
            ImageLoader('finImage3'),
            ImageLoader('finImage4'),
            ImageLoader('finImage5'),
            ImageLoader('finImage6'),
            ImageLoader('finImage7'),
            ImageLoader('finImage8'),
            ImageLoader('finImage9'),
        ];

        window.finImageCanvass = [
            ImageCanvas('finImage1'),
            ImageCanvas('finImage2'),
            ImageCanvas('finImage3'),
            ImageCanvas('finImage4'),
            ImageCanvas('finImage5'),
            ImageCanvas('finImage6'),
            ImageCanvas('finImage7'),
            ImageCanvas('finImage8'),
            ImageCanvas('finImage9'),
        ];

        window.sketchImageLoader = ImageLoader('sketchImage');
        window.sketchImageCanvas = ImageCanvas('sketchImage');
        window.sketchImageCanvas_bf = ImageCanvas('sketchImage_bf');
        window.renderImageLoader = ImageLoader('renderImage');
        window.renderImageCanvas = ImageCanvas('renderImage');
        window.cropImageLoader = ImageLoader('cropImage');
        window.cropImageCanvas = ImageCanvas('cropImage');
        window.cropMaskCanvas = ImageCanvas('cropMask');
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

        window.cp_drager = [];
        window.crop_dragger_A = null;
    },

    start () {
        setTimeout(this.on_pen, 500);
        setTimeout(this.hide_light, 500);
    },

    load_sketch: function (url) {
        window.cropImageLoader.load_url(url,function (image) {
            window.confirmNode.active = true;
            window.cpNode.width = cc.winSize.width- 100;
            window.cpNode.height = cc.winSize.height- 300;
            window.cpNodeSprite.spriteFrame = window.cropImageCanvas.load_image(image, image.width, image.height);
            window.cpNode2Sprite.spriteFrame = window.cropMaskCanvas.dark();
            let ra = (window.cpNode.width * 1.0) / (window.cropImageCanvas.canvas.width * 1.0);
            let rb = (window.cpNode.height * 1.0) / (window.cropImageCanvas.canvas.height * 1.0);
            let r = Math.min(ra, rb);
            window.cpNode.width = parseInt(window.cropImageCanvas.canvas.width * 1.0 * r);
            window.cpNode.height = parseInt(window.cropImageCanvas.canvas.height * 1.0 * r);
            window.cp_drager[0].x = - window.cpNode.width / 3.23;
            window.cp_drager[0].y = 0;
            window.cp_drager[1].x = window.cpNode.width / 3.23;
            window.cp_drager[1].y = 0;
            window.cp_drager[2].x = 0;
            window.cp_drager[2].y = - window.cpNode.height / 3.23;
            window.cp_drager[3].x = 0;
            window.cp_drager[3].y = window.cpNode.height / 3.23;
            if(window.crop_dragger_A != null){
                window.crop_dragger_A.ontiii(null);
            }
        });
    },

    load_hints: function (url) {
        window.sketchImageLoader.load_url(url,function (image) {
            window.previewSprite.spriteFrame = window.previewImageCanvas.clear();
            window.hintSprite.spriteFrame = window.creativeCanvas.ini_image(image, image.width, image.height);
        });
    },

    confirm_ok: function () {
        let image = window.cropImageCanvas.image;
        let w = parseInt(window.sketch_crop_w);
        let h = parseInt(window.sketch_crop_h);
        let x = parseInt(window.sketch_crop_l);
        let y = parseInt(window.cropImageCanvas.canvas.height - window.sketch_crop_u);
        console.log([x, y, w, h]);
        window.sketchImageCanvas.load_image_adv(image, x, y, w, h);
        window.sketchImageCanvas_bf.load_image_adv(image, x, y, w, h);
        window.alphaSketchSprite.spriteFrame = window.sketchImageCanvas.load_alpha();
        window.hasGird = false;
        window.hasColor = false;
        window.hasRender = false;
        window.previewSprite.spriteFrame = window.previewImageCanvas.clear();
        window.girdSprite.spriteFrame = window.girdImageCanvas.clear();
        window.bghintSprite.spriteFrame = window.renderImageCanvas.clear();
        window.current_room = "new";
        window.current_step = "new";
        let s2048 = window.regulator.minRegulate([w, h], 2048);
        let s180 = window.regulator.maxRegulate([w, h], 140);
        window.sketchSprite.spriteFrame = window.sketchBoxCanvas.ini(w, h);
        window.hintSprite.spriteFrame = window.creativeCanvas.ini(s2048[0], s2048[1]);
        window.sketchNode.width = s2048[0];
        window.sketchNode.height = s2048[1];
        window.sketchNode.scaleX = ((cc.winSize.height - 420.0) * 1.0) / (window.sketchNode.height) * 1.0;
        window.sketchNode.scaleY = window.sketchNode.scaleX;
        window.c9Node.active = true;
        window.sketchNode.x = 105.0 / 1440.0 * cc.winSize.height;
        window.sketchNode.y = cc.winSize.height * 0.5 - window.sketchNode.scaleY * window.sketchNode.height * 0.5 - 100;
        window.hasSketch = true;
        window.logoNode.active = false;
        window.confirmNode.active = false;
        window.c1BtnSprite.spriteFrame = window.finImageCanvass[0].load_image_adv(image, x, y, w, h);
        window.c1BtnNode.width = s180[0];
        window.c1BtnNode.height = s180[1];
        window.c2BtnSprite.spriteFrame = window.finImageCanvass[1].load_image_adv(image, x, y, w, h);
        window.c2BtnNode.width = s180[0];
        window.c2BtnNode.height = s180[1];
        window.c3BtnSprite.spriteFrame = window.finImageCanvass[2].load_image_adv(image, x, y, w, h);
        window.c3BtnNode.width = s180[0];
        window.c3BtnNode.height = s180[1];
        window.c4BtnSprite.spriteFrame = window.finImageCanvass[3].load_image_adv(image, x, y, w, h);
        window.c4BtnNode.width = s180[0];
        window.c4BtnNode.height = s180[1];
        window.c5BtnSprite.spriteFrame = window.finImageCanvass[4].load_image_adv(image, x, y, w, h);
        window.c5BtnNode.width = s180[0];
        window.c5BtnNode.height = s180[1];
        window.c6BtnSprite.spriteFrame = window.finImageCanvass[5].load_image_adv(image, x, y, w, h);
        window.c6BtnNode.width = s180[0];
        window.c6BtnNode.height = s180[1];
        window.c7BtnSprite.spriteFrame = window.finImageCanvass[6].load_image_adv(image, x, y, w, h);
        window.c7BtnNode.width = s180[0];
        window.c7BtnNode.height = s180[1];
        window.c8BtnSprite.spriteFrame = window.finImageCanvass[7].load_image_adv(image, x, y, w, h);
        window.c8BtnNode.width = s180[0];
        window.c8BtnNode.height = s180[1];
        window.c9BtnSprite.spriteFrame = window.finImageCanvass[8].load_image_adv(image, x, y, w, h);
        window.c9BtnNode.width = s180[0];
        window.c9BtnNode.height = s180[1];
        window.controller.uploadSketch();
    },

    confirm_failed: function () {
        window.confirmNode.active = false;
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
        xhr.open("POST", window.server_url + "/upload_sketch", true);
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
                window.current_cid = 0;
                window.claNode.y = window.c1BtnNode.y;
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
