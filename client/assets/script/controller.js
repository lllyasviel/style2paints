cc.Class({
    extends: cc.Component,

    properties: {
        referenceNode: {
            default: null, type: cc.Node
        },
        paletteNode: {
            default: null, type: cc.Node
        },
        colorPreviewNode: {
            default: null, type: cc.Node
        },
        colorSelectedNode: {
            default: null, type: cc.Node
        },
        leftNode: {
            default: null, type: cc.Node
        },
        sketchL1Node: {
            default: null, type: cc.Node
        },
        sketchL2Node: {
            default: null, type: cc.Node
        },
        midNode: {
            default: null, type: cc.Node
        },
        hintL1Node: {
            default: null, type: cc.Node
        },
        hintL2Node: {
            default: null, type: cc.Node
        },
        hintL3Node: {
            default: null, type: cc.Node
        },
        rightNode: {
            default: null, type: cc.Node
        },
        resultNode: {
            default: null, type: cc.Node
        },
        sliderNode: {
            default: null, type: cc.Node
        },
        loadingNode: {
            default: null, type: cc.Node
        },
        tog1: {
            default: null, type: cc.Node
        },
        tog2: {
            default: null, type: cc.Node
        },
        tog3: {
            default: null, type: cc.Node
        },
        line_enabled: {
            default: null, type: cc.Toggle
        },
        line_color: {
            default: null, type: cc.Node
        },
        sample_container: {
            default: null, type: cc.Node
        },
        default_sample: {
            default: null, type: cc.Node
        },
        welcome_node: {
            default: null, type: cc.Node
        },
        logo_node: {
            default: null, type: cc.Node
        },
        undo_node: {
            default: null, type: cc.Button
        },
        redo_node: {
            default: null, type: cc.Button
        },
    },

    on_slider: function () {
        window.current_referenceAlpha = this.sliderNode.getComponent('cc.Slider').progress;
        if(!window.hasReference){
            window.current_referenceAlpha = 0;
            this.sliderNode.getComponent('cc.Slider').progress = 0;
        }
        window.hintL3Node.opacity = parseInt(window.current_referenceAlpha * 255);
    },

    on_home: function () {
        if(window.uploading){
            return;
        }
        window.controller.welcome_node.active = !window.controller.welcome_node.active;
        window.controller.logo_node.active = window.controller.welcome_node.active;
    },

    on_start: function () {
        window.controller.logo_node.active = false;
    },

    onGithub: function () {
        window.open('http://github.com/lllyasviel/style2paints');
    },

    load_reference_url: function (url, call_back=null) {
        if (url.substr(0,4) == 'http') window.referenceImg = url;
        window.referenceImageLoader.load_url(url,function (image) {

            let raw_zize = [image.width, image.height];
            let canvas_size = window.regulator.maxRegulate(raw_zize, 256);
            let node_size = window.regulator.maxRegulate(raw_zize, 180);
            window.referenceSprite.spriteFrame = window.referenceImageCanvas.load_image(image, canvas_size[0], canvas_size[1]);
            window.referenceNode.width = node_size[0];
            window.referenceNode.height = node_size[1];
            window.hintL3Sprite.spriteFrame = window.referenceRandomCanvas.load_image(image, canvas_size[0], canvas_size[1]);
            window.referenceRandomCanvas.randomize(window.sketchImageCanvas.canvas.width, window.sketchImageCanvas.canvas.height);
            if(call_back!=null){
                call_back();
            }
        });
    },

    load_sketch_url: function (url, call_back=null) {
        if (url.substr(0,4) == 'http') window.srcImg = url;
        window.firstUpdateThis = true;
        window.sketchImageLoader.load_url(url,function (image) {
            let canvas_size = window.regulator.maxRegulate([image.width, image.height], 1024);
            window.sketchL1Sprite.spriteFrame = window.sketchImageCanvas.load_image(image, canvas_size[0], canvas_size[1]);
            window.resultSprite.spriteFrame = window.resultImageCanvas.load_image(image, canvas_size[0], canvas_size[1]);
            window.creativeCanvas.load_latent_image(image, canvas_size[0], canvas_size[1]);
            if(window.hasReference){
                window.referenceRandomCanvas.randomize(window.sketchImageCanvas.canvas.width, window.sketchImageCanvas.canvas.height);
            }
            if(call_back!=null){
                call_back();
            }
        });
    },

    load_result_url: function (url, call_back=null) {
        window.resultImageLoader.load_url(url,function (image) {
            window.resultSprite.spriteFrame = window.resultImageCanvas.load_image(image, image.width, image.height);
            if(call_back!=null){
                call_back();
            }
        });
    },

    load_latent_url: function (url, call_back=null) {
        window.latentImageLoader.load_url(url,function (image) {
            window.creativeCanvas.load_latent_image(image, image.width, image.height);
            if(call_back!=null){
                call_back();
            }
        });
    },

    onUploadReferenceClicked: function () {
        if(window.uploading){
            return;
        }
        if(window.sketchImageCanvas.source==null){
            return;
        }
        window.fileSelector.activate(function (url) {
            window.currentImg = 'referenceImg';
            window.controller.load_reference_url(url, function () {
                window.hasReference = true;
            });
        });
    },

    onDownloadClicked: function () {
        if(window.current_room == 'new'){
            return;
        }
        if(window.result_id == 'new'){
            return;
        }
        if (!window.resultDownload) {
            window.resultDownload = document.createElement('a');
            window.resultDownload.visible = false;
            window.resultDownload.download = 'result.jpg';
            document.body.appendChild(window.resultDownload);
        }
        window.resultDownload.href = window.server_url + '/rooms/' + window.current_room + '/result.' + window.result_id + '.jpg';
        window.resultDownload.click();
    },

    requireResult: function(){
        if(window.uploading){
            return;
        }
        if(window.current_room == 'new'){
            return;
        }
        window.controller.loadingNode.active = true;
        window.controller.loadingNode.getComponent('fake_bar').change('uploading');
        window.uploading = true;
        let xhr = new XMLHttpRequest();
        xhr.open("POST", window.server_url + "/request_result", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
        xhr.upload.onprogress = function(progress) {
            if (progress.lengthComputable) {
                let x = progress.loaded / progress.total;
                window.controller.loadingNode.getComponent('fake_bar').change('uploading', x);
                if(x > 0.8){
                    window.controller.loadingNode.getComponent('fake_bar').change('painting');
                }
            }
        };
        xhr.onreadystatechange = function () {
            if (xhr.readyState==4 && xhr.status==200)
            {
                window.controller.loadingNode.getComponent('fake_bar').change('downloading');
                let arr = xhr.responseText.split('_');
                window.current_room = arr[0];
                window.result_id = arr[1];
                window.current_step = arr[1];
                console.log('get result step id ' + window.result_id);
                window.resultImageCanvas.source = null;
                window.creativeCanvas.finalData = null;
                let call_back = function(){
                    window.controller.loadingNode.getComponent('fake_bar').change('downloading final result');
                    if (window.resultImageCanvas.source != null){
                        window.controller.loadingNode.getComponent('fake_bar').change('downloading final result');
                        if (window.creativeCanvas.finalData != null){
                            window.controller.loadingNode.getComponent('fake_bar').change('downloading final result');
                            window.controller.loadingNode.active = false;
                            window.uploading = false;
                        }
                    }
                };
                window.controller.load_result_url(window.server_url + '/rooms/' + window.current_room + '/result.' + window.result_id + '.jpg', call_back);
                window.controller.load_latent_url(window.server_url + '/rooms/' + window.current_room + '/composition.' + window.current_step + '.jpg', call_back);
            }else{
                window.controller.loadingNode.getComponent('fake_bar').change('painting');
            }
        };
        xhr.send
        (
            "room=" + window.current_room +
            "&step=" + window.current_step +
            "&reference=" + (window.hasReference?encodeURIComponent(window.referenceImageCanvas.canvas.toDataURL("image/png")):"none") +
            "&options=" + encodeURIComponent(JSON.stringify({
                alpha: window.current_referenceAlpha,
                points: window.creativeCanvas.points_XYRGBR,
                method: window.current_method,
                lineColor: [window.lcolor.r, window.lcolor.g, window.lcolor.b],
                line: window.controller.line_enabled.isChecked,
                hasReference: window.hasReference
            }))
        );
        xhr.onerror = function() {
            alert('Network Request. You might need to contact with the author.')
        }
        console.log('request sended');
    },

    onSaveSample: function () {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", window.server_url + "/save_as_sample", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
        xhr.send("room=" + window.current_room + "&step=" + window.current_step);
        console.log('SaveSample Sended');
    },

    uploadSketch: function () {
        if(window.uploading){
            return;
        }
        if(window.sketchImageCanvas.source==null) {
            return;
        }
        window.controller.welcome_node.active = false;
        window.controller.loadingNode.active = true;
        window.controller.loadingNode.getComponent('fake_bar').change('uploading');
        window.uploading = true;
        window.controller.tog1.active = false;
        window.controller.tog2.active = false;
        window.controller.tog3.active = false;
        let xhr = new XMLHttpRequest();
        xhr.open("POST", window.server_url + "/upload_sketch", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
        xhr.upload.onprogress = function(progress) {
            if (progress.lengthComputable) {
                let x = progress.loaded / progress.total;
                window.controller.loadingNode.getComponent('fake_bar').change('uploading', x);
                if(x > 0.8){
                    window.controller.loadingNode.getComponent('fake_bar').change('preparing');
                }
            }
        };
        xhr.onreadystatechange = function () {
            if (xhr.readyState==4 && xhr.status==200)
            {
                window.controller.loadingNode.getComponent('fake_bar').change('downloading');
                let arr = xhr.responseText.split('_');
                window.current_room = arr[0];
                window.result_id = arr[1];
                window.current_step = arr[1];
                console.log('get room id ' + window.current_room);
                window.sketchImageCanvas.source = null;
                let call_back = function(){
                    if(window.sketchImageCanvas.source != null)
                    {
                        window.creativeCanvas.finish();
                        window.controller.loadingNode.active = false;
                        window.uploading = false;
                        window.controller.tog1.active = true;
                        window.controller.tog2.active = true;
                        window.controller.tog3.active = true;
                    }
                };
                window.controller.load_sketch_url(window.server_url + '/rooms/' + window.current_room + '/sketch.' + window.current_method + '.jpg', call_back);
            }else{
                window.controller.loadingNode.getComponent('fake_bar').change('preparing');
            }
        };
        xhr.send
        (
            "room=" + window.current_room +
            "&step=" + window.current_step +
            "&sketch=" + ((window.current_room == 'new')?encodeURIComponent(window.sketchImageCanvas.canvas.toDataURL("image/png")):"none") +
            "&method=" + encodeURIComponent(window.current_method)
        );
        console.log('sketch uploaded');
    },

    onUploadSketchClicked: function () {
        if(window.uploading){
            return;
        }
        window.fileSelector.activate(function (url) {
            window.currentImg = 'srcImg';
            window.controller.onClearClicked();
            window.creativeCanvas.cache = [];
            window.current_room = 'new';
            window.current_step = 'new';
            window.result_id = 'new';
            window.controller.load_sketch_url(url, window.controller.uploadSketch);
        });
    },

    onLoad: function () {

        if (!window.server_url) {
            window.server_url = 'http://127.0.0.1:8000';
            window.server_url = '';
        }

        window.undoNode = this.undo_node;
        window.redoNode = this.redo_node;
        window.undoNode && (window.undoNode.interactable = false);
        window.redoNode && (window.redoNode.interactable = false);

        window.controller = this;
        window.regulator = require('./SizeRegulator');
        window.fileSelector = require('./FileInputs');

        window.referenceNode = this.referenceNode;
        window.referenceSprite = this.referenceNode.getComponent('cc.Sprite');
        window.hasReference = false;

        window.paletteNode = this.paletteNode;
        window.paletteSprite = this.paletteNode.getComponent('cc.Sprite');

        window.leftNode = this.leftNode;
        window.touchGesture = require('./TouchGesture')(window.leftNode);

        window.sketchL1Node = this.sketchL1Node;
        window.sketchL1Sprite = this.sketchL1Node.getComponent('cc.Sprite');

        window.sketchL2Node = this.sketchL2Node;
        window.sketchL2Sprite = this.sketchL2Node.getComponent('cc.Sprite');

        window.midNode = this.midNode;
        window.hintL1Node = this.hintL1Node;
        window.hintL1Sprite = this.hintL1Node.getComponent('cc.Sprite');

        window.hintL2Node = this.hintL2Node;
        window.hintL2Sprite = this.hintL2Node.getComponent('cc.Sprite');

        window.hintL3Node = this.hintL3Node;
        window.hintL3Sprite = this.hintL3Node.getComponent('cc.Sprite');

        window.rightNode = this.rightNode;
        window.resultNode = this.resultNode;
        window.resultSprite = this.resultNode.getComponent('cc.Sprite');

        window.colorPreviewNode = this.colorPreviewNode;
        window.colorSelectedNode = this.colorSelectedNode;
        window.lineColorNode = this.line_color;

        let ImageLoader = require('./ImageLoader');
        let ImageCanvas = require('./ImageCanvas');
        let RandomCanvas = require('./RandomCanvas');

        window.referenceImageLoader = ImageLoader('referenceImage');
        window.referenceImageCanvas = ImageCanvas('referenceImage');
        window.referenceRandomCanvas = RandomCanvas('referenceRandom');

        window.paletteImageLoader = ImageLoader('paletteImage');
        window.paletteImageCanvas = ImageCanvas('paletteImage');

        window.sketchImageLoader = ImageLoader('sketchImage');
        window.sketchImageCanvas = ImageCanvas('sketchImage');

        window.resultImageLoader = ImageLoader('resultImage');
        window.resultImageCanvas = ImageCanvas('resultImage');

        window.latentImageLoader = ImageLoader('latentImage');

        window.creativeCanvas = require('./CreativeCanvas');

        window.hintL1Sprite.spriteFrame = window.creativeCanvas.spriteFrame;
        window.sketchL2Sprite.spriteFrame = window.creativeCanvas.gird_spriteFrame;

        setTimeout(this.delayed_initialization, 1000);

        window.sensitiveNodes = [];
        window.sensitiveNodes.push(window.sketchL2Node);
        window.sensitiveNodes.push(window.resultNode);
        window.sensitiveNodes.push(window.referenceNode);
        window.sensitiveNodes.push(window.paletteNode);
        window.sensitiveNodes.push(window.hintL1Node);

        let move_event = event => {
            window.mousePosition = event.getLocation();

            window.currentSensitiveNode = null;

            for (let item of window.sensitiveNodes) {
                if (!item.active) continue;
                let mouseRelativeX, mouseRelativeY;
                if (item === window.sketchL2Node && cc.sys.isMobile) {
                    let p = cc.p(this.node.width/2 + item.x - item.width/2, this.node.height/2 + item.y - item.height/2);
                    let centerP = cc.p(this.node.width/2 + item.x, this.node.height/2 + item.y);
                    let rotatedP = cc.pRotateByAngle(p, centerP, cc.degreesToRadians(-item.rotation));
                    let mouseRelative = cc.p(window.mousePosition.x, window.mousePosition.y);
                    mouseRelative = cc.pRotateByAngle(mouseRelative, rotatedP, cc.degreesToRadians(item.rotation));
                    centerP = cc.p(item.width/2, item.height/2);
                    mouseRelative.subSelf(rotatedP).subSelf(centerP).divSelf(item.scale).addSelf(centerP);
                    mouseRelativeX = mouseRelative.x;
                    mouseRelativeY = mouseRelative.y;
                } else {
                    let cur_position = item.convertToWorldSpace(item.position);
                    let beginX = cur_position.x;
                    let beginY = cur_position.y;
                    mouseRelativeX = window.mousePosition.x - beginX;
                    mouseRelativeY = window.mousePosition.y - beginY;
                }
                if (mouseRelativeX > 0 && mouseRelativeY > 0 && mouseRelativeX < item.width && mouseRelativeY < item.height) {
                    window.currentSensitiveNode = item;
                    window.mouseRelativeX = mouseRelativeX / item.width;
                    window.mouseRelativeY = mouseRelativeY / item.height;
                }
            }

            window.controller.onMouseMove();

        }

        if (!cc.sys.isMobile) {

            this.node.on("mousemove", function (event) {
                move_event(event);
            });
    
            this.node.on("mousedown", function (event) {
                window.mouseIsDown = true;
                window.controller.onMouseDown();
            });
    
            this.node.on("mouseup", function (event) {
                window.mouseIsDown = false;
                window.controller.onMouseUp();
            });
            
        } else {

            let multiTouch = 0;
            let startEvent;

            this.node.on("touchmove", function (event) {
                let touches = event.getTouches();
                if (touches.length >= 2) {
                    multiTouch+=4;
                } else {
                    if (!multiTouch) {
                        setTimeout(()=>{
                            startEvent && move_event(startEvent);
                            !multiTouch && window.controller.onMouseDown();
                            multiTouch--;
                            setTimeout(()=>{
                                move_event(event);
                            }, 100);
                        })
                    } else if (multiTouch < 0) {
                        move_event(event);
                    }
                }
            });
    
            this.node.on("touchstart", function (event) {
                multiTouch ? (startEvent = 0) : (startEvent = event);
                window.mouseIsDown = true;
            });
    
            this.node.on("touchend", function (event) {
                if (!multiTouch) {
                    if (startEvent) {
                        move_event(startEvent);
                        window.controller.onMouseDown();
                        startEvent = 0;
                        setTimeout(()=>{
                            multiTouch = 0;
                            window.mouseIsDown = false;
                            window.controller.onMouseUp();
                        },100);
                    } else {
                        multiTouch = 0;
                    }
                    return;
                }
                multiTouch = 0;
                window.mouseIsDown = false;
                window.controller.onMouseUp();
            });

        }

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event) {
            if(event.keyCode==cc.KEY.z){
                window.creativeCanvas.undo();
            }
        });

        window.color = new cc.Color();
        window.color.r = 0;
        window.color.g = 0;
        window.color.b = 0;

        window.lcolor = new cc.Color();
        window.lcolor.r = 0;
        window.lcolor.g = 0;
        window.lcolor.b = 0;

        window.CONDITION_ERASER = 0;
        window.CONDITION_POINT0 = 1;
        window.CONDITION_POINT1 = 3;
        window.CONDITION_POINT2 = 4;

        window.current_condition = window.CONDITION_POINT0;
        window.current_method = 'colorization';
        window.current_room = 'new';
        window.current_step = 'new';
        window.result_id = 'new';
        window.current_referenceAlpha = 0;

        window.uploading = false;
    },

    on_colorization: function () {
        if(window.current_method != 'colorization'){
            window.current_method = 'colorization';
            this.uploadSketch();
        }
    },

    on_rendering: function () {
        if(window.current_method != 'rendering'){
            window.current_method = 'rendering';
            this.uploadSketch();
        }
    },

    on_recolorization: function () {
        if(window.current_method != 'recolorization'){
            window.current_method = 'recolorization';
            this.uploadSketch();
        }
    },

    on_eraser: function () {
        window.current_condition = window.CONDITION_ERASER;
    },

    on_point0: function () {
        window.current_condition = window.CONDITION_POINT0;
    },

    on_point1: function () {
        window.current_condition = window.CONDITION_POINT1;
    },

    on_point2: function () {
        window.current_condition = window.CONDITION_POINT2;
    },

    delayed_initialization: function () {
        window.controller.load_reference_url("res\\raw-assets\\texture\\ring.png");
        window.paletteImageLoader.load_url("res\\raw-assets\\texture\\palette.png",function (image) {
            window.paletteSprite.spriteFrame = window.paletteImageCanvas.load_image(image, image.width, image.height);
            window.paletteNode.width = 650;
            window.paletteNode.height = 180;
        });
        let xhr = new XMLHttpRequest();
        xhr.open("POST", window.server_url + "/get_sample_list", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
        xhr.onreadystatechange = function () {
            if (xhr.readyState==4 && xhr.status==200)
            {
                let all_sample_list = JSON.parse(xhr.responseText);

                let img_width = window.controller.default_sample.width + 28;
                let img_height = window.controller.default_sample.height + 14;
                let maxLineWidth = window.controller.sample_container.width - 28;
                let line = 0;
                let wi = 0;
                
                for(let i in all_sample_list){
                    let node = cc.instantiate(window.controller.default_sample);
                    node.name = all_sample_list[i];
                    node.parent = window.controller.sample_container;
                    if ((line+1) * img_width > maxLineWidth) {
                        line = 0;
                        wi += 1;
                    }
                    node.setPosition(28 + line * img_width, -28 - wi * img_height);
                    line++;
                    let frame = new cc.SpriteFrame();
                    let tex = cc.textureCache.addImage(window.server_url + "/samples/" + all_sample_list[i] + '/icon.sample.jpg')
                    frame.setTexture(tex);
                    let imgNode = node.getChildByName("img");
                    imgNode.getComponent(cc.Sprite).spriteFrame = frame;
                }
            }
        };
        xhr.send();
    },

    onSample: function (e) {
        let name = e.currentTarget.name;
        console.log(name);
        window.current_room = name;
        window.current_step = 'sample';
        window.controller.welcome_node.active = false;
        window.controller.loadingNode.active = true;
        window.controller.loadingNode.getComponent('fake_bar').change('downloading');
        window.uploading = true;
        let xhr = new XMLHttpRequest();
        xhr.open("GET", window.server_url + "/samples/" + window.current_room + '/options.' + window.current_step + '.json', true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
        xhr.onreadystatechange = function () {
            if (xhr.readyState==4 && xhr.status==200)
            {
                let jn =　JSON.parse(xhr.responseText);
                console.log(jn);
                window.current_method = jn.method;
                if(window.current_method=='colorization'){
                    window.controller.tog1.getComponent('cc.Toggle').isChecked = true;
                    window.controller.tog2.getComponent('cc.Toggle').isChecked = false;
                    window.controller.tog3.getComponent('cc.Toggle').isChecked = false;
                }
                if(window.current_method=='rendering'){
                    window.controller.tog1.getComponent('cc.Toggle').isChecked = false;
                    window.controller.tog2.getComponent('cc.Toggle').isChecked = true;
                    window.controller.tog3.getComponent('cc.Toggle').isChecked = false;
                }
                if(window.current_method=='recolorization'){
                    window.controller.tog1.getComponent('cc.Toggle').isChecked = false;
                    window.controller.tog2.getComponent('cc.Toggle').isChecked = false;
                    window.controller.tog3.getComponent('cc.Toggle').isChecked = true;
                }
                window.controller.line_enabled.isChecked = jn.line;
                let lc = new cc.Color();
                lc.r = jn.lineColor[0];
                lc.g = jn.lineColor[1];
                lc.b = jn.lineColor[2];
                window.lcolor = lc;
                window.controller.line_color.color = lc;
                window.hasReference = jn.hasReference;
                if(window.hasReference){
                    window.controller.load_reference_url(window.server_url + '/samples/' + window.current_room + '/reference.' + window.current_step + '.jpg');
                }else{
                    window.controller.load_reference_url("res\\raw-assets\\texture\\ring.png?t="+Math.random());
                }
                window.current_referenceAlpha = jn.alpha;
                window.controller.sliderNode.getComponent('cc.Slider').progress = window.current_referenceAlpha;
                window.controller.on_slider();
                window.temp_points = jn.points;
                window.creativeCanvas.points_XYRGBR = window.temp_points;
                window.creativeCanvas.finish();
                window.controller.loadingNode.getComponent('fake_bar').change('downloading sketch');
                window.controller.load_sketch_url(window.server_url + '/samples/' + window.current_room + '/sketch.' + window.current_method + '.jpg', function () {
                    window.controller.loadingNode.getComponent('fake_bar').change('downloading results');
                    window.controller.load_latent_url(window.server_url + '/samples/' + window.current_room + '/composition.' + window.current_step + '.jpg', function () {
                        window.controller.loadingNode.getComponent('fake_bar').change('downloading final results');
                        window.controller.load_result_url(window.server_url + '/samples/' + window.current_room + '/result.' + window.current_step + '.jpg', function () {
                            window.creativeCanvas.points_XYRGBR = window.temp_points;
                            window.creativeCanvas.finish();
                            window.controller.loadingNode.active = false;
                            window.uploading = false;
                        });
                    });
                });

            }
        };
        xhr.send();
        console.log('sample request sended');
    },

    onMouseDown: function () {
        if(window.currentSensitiveNode != null){
            if(window.currentSensitiveNode.name == window.sketchL2Node.name){
                window.creativeCanvas.add_log();
                window.creativeCanvas.redo_cache = [];
                window.redoNode && (window.redoNode.interactable = false);
                window.creativeCanvas.refresh_current_point_index(1);
                if(window.creativeCanvas.current_index > -1){
                    if(window.current_condition==window.CONDITION_ERASER){
                        window.creativeCanvas.points_XYRGBR.splice(window.creativeCanvas.current_index, 1);
                        window.creativeCanvas.finish();
                    }else{
                        window.creativeCanvas.in_drag = true;
                        //
                        // window.creativeCanvas.points_XYRGBR[window.creativeCanvas.current_index][2] = window.color.r;
                        // window.creativeCanvas.points_XYRGBR[window.creativeCanvas.current_index][3] = window.color.g;
                        // window.creativeCanvas.points_XYRGBR[window.creativeCanvas.current_index][4] = window.color.b;

                    }
                }else{
                    if(window.current_condition==window.CONDITION_SPRAY){
                        window.creativeCanvas.in_paint = true;
                    }
                    if(window.current_condition==window.CONDITION_ERASER){
                        window.creativeCanvas.in_erase = true;
                    }
                    if(window.current_condition==window.CONDITION_POINT0){
                        window.creativeCanvas.add_point(window.mouseRelativeX, window.mouseRelativeY, window.color.r, window.color.g, window.color.b, 0);
                        window.creativeCanvas.in_drag = true;
                    }
                    if(window.current_condition==window.CONDITION_POINT1){
                        window.creativeCanvas.add_point(window.mouseRelativeX, window.mouseRelativeY, window.color.r, window.color.g, window.color.b, 1);
                        window.creativeCanvas.in_drag = true;
                    }
                    if(window.current_condition==window.CONDITION_POINT2){
                        window.creativeCanvas.add_point(window.mouseRelativeX, window.mouseRelativeY, window.color.r, window.color.g, window.color.b, 2);
                        window.creativeCanvas.in_drag = true;
                    }
                }
            }
        }
    },

    onLineColorChanged: function () {
        window.lcolor = window.colorSelectedNode.color;
        window.lineColorNode.color = window.lcolor;
    },

    onMouseUp: function () {
        if(window.currentSensitiveNode != null){
            if(window.currentSensitiveNode.name == window.referenceNode.name){
                window.colorSelectedNode.color = window.colorPreviewNode.color;
                window.color = window.colorPreviewNode.color;
            }
            if(window.currentSensitiveNode.name == window.paletteNode.name){
                window.colorSelectedNode.color = window.colorPreviewNode.color;
                window.color = window.colorPreviewNode.color;
            }
            if(window.currentSensitiveNode.name == window.hintL1Node.name){
                window.colorSelectedNode.color = window.colorPreviewNode.color;
                window.color = window.colorPreviewNode.color;
            }
            if(window.currentSensitiveNode.name == window.resultNode.name){
                window.colorSelectedNode.color = window.colorPreviewNode.color;
                window.color = window.colorPreviewNode.color;
            }
        }
        window.creativeCanvas.in_drag = false;
        window.creativeCanvas.in_paint = false;
        window.creativeCanvas.in_erase = false;
    },

    onMouseMove: function () {
        if(window.currentSensitiveNode != null){
            cc._canvas.style.cursor = 'crosshair';
            if(window.currentSensitiveNode.name == window.referenceNode.name){
                window.colorPreviewNode.color = window.referenceImageCanvas.get_color(window.mouseRelativeX, window.mouseRelativeY);
            }
            if(window.currentSensitiveNode.name == window.paletteNode.name){
                window.colorPreviewNode.color = window.paletteImageCanvas.get_color(window.mouseRelativeX, window.mouseRelativeY);
            }
            if(window.currentSensitiveNode.name == window.hintL1Node.name){
                window.colorPreviewNode.color = window.creativeCanvas.get_color(window.mouseRelativeX, window.mouseRelativeY);
            }
            if(window.currentSensitiveNode.name == window.resultNode.name){
                window.colorPreviewNode.color = window.resultImageCanvas.get_color_adapted(window.mouseRelativeX, window.mouseRelativeY);
            }
            if(window.currentSensitiveNode.name == window.sketchL2Node.name && window.creativeCanvas.in_drag == false){
                if(window.creativeCanvas.in_erase){
                    window.creativeCanvas.refresh_current_point_index(4);
                }else{
                    window.creativeCanvas.refresh_current_point_index(1);
                }
                if(window.creativeCanvas.current_index > -1){
                    if(window.creativeCanvas.in_erase){
                        window.creativeCanvas.points_XYRGBR.splice(window.creativeCanvas.current_index, 1);
                        window.creativeCanvas.finish();
                    }else{
                        if(window.current_condition==window.CONDITION_ERASER){
                            cc._canvas.style.cursor = 'pointer';
                        }else{
                            cc._canvas.style.cursor = 'move';
                        }
                    }
                }
            }
        }else{
            window.colorPreviewNode.color = window.colorSelectedNode.color;
            cc._canvas.style.cursor = 'default';
        }
    },

    update: function (dt) {

        let raw_shape = [window.sketchImageCanvas.canvas.width, window.sketchImageCanvas.canvas.height];
        let left_size = window.regulator.areaRegulate(raw_shape, [window.leftNode.width, window.leftNode.height]);
        let mid_size = window.regulator.areaRegulate(raw_shape, [window.midNode.width, window.midNode.height]);
        let right_size = window.regulator.areaRegulate(raw_shape, [window.rightNode.width, window.rightNode.height]);

        window.sketchL1Node.width = left_size[0];
        window.sketchL1Node.height = left_size[1];
        window.sketchL2Node.width = left_size[0];
        window.sketchL2Node.height = left_size[1];
        window.hintL1Node.width = mid_size[0];
        window.hintL1Node.height = mid_size[1];
        window.hintL2Node.width = mid_size[0];
        window.hintL2Node.height = mid_size[1];
        window.hintL3Node.width = mid_size[0];
        window.hintL3Node.height = mid_size[1];
        window.resultNode.width = right_size[0];
        window.resultNode.height = right_size[1];

        window.creativeCanvas.update_drag();

    },

    onRandomizeClicked: function () {
        window.creativeCanvas.randomize();
    },

    onClearClicked: function () {

        window.creativeCanvas.add_log();
        window.creativeCanvas.white_all();

        window.controller.line_enabled.isChecked = false;

        let lc = new cc.Color();
        lc.r = 0;
        lc.g = 0;
        lc.b = 0;
        window.lcolor = lc;
        window.controller.line_color.color = lc;

        window.hasReference = false;
        window.controller.load_reference_url("res\\raw-assets\\texture\\ring.png?t="+Math.random());

        window.current_referenceAlpha = 0;
        window.controller.sliderNode.getComponent('cc.Slider').progress = 0;
        window.controller.on_slider();

        window.temp_points = [];
        window.creativeCanvas.points_XYRGBR = [];
        window.creativeCanvas.finish();
    },

    on_blank_start: function() {
        window.controller.logo_node.active = false;
        window.controller.welcome_node.active = false;
    },

    undo() {
        window.creativeCanvas.undo();
    },

    redo() {
        window.creativeCanvas.redo();
    },

    saveJson() {
        let urlObject = window.URL || window.webkitURL || window;
        let data = {
            alpha: window.current_referenceAlpha,
            points: window.creativeCanvas.points_XYRGBR,
            method: window.current_method,
            lineColor: [window.lcolor.r, window.lcolor.g, window.lcolor.b],
            line: window.controller.line_enabled.isChecked,
            hasReference: window.hasReference,
            srcImg: window.srcImg,
            referenceImg: window.referenceImg ? window.referenceImg : ''
        };
        let export_blob = new Blob([JSON.stringify(data)]);
        if(!window.save_link) {
            window.save_link = document.createElement('a');
            window.save_link.visible = false;
            document.body.appendChild(window.save_link);
        }
        window.save_link.href = urlObject.createObjectURL(export_blob);
        let fileName = window.fileSelector.html_obj.value.replace(/\\/g, '/');
        fileName = window.fileSelector.html_obj.fake_value ? window.fileSelector.html_obj.fake_value.split('/') : fileName.split('/');
        let tmpName = fileName[fileName.length-1].split('.');
        fileName = '';
        for(let i=0;i<tmpName.length-1;i++) {
            fileName+=tmpName[i]+'.';
        }
        window.save_link.download = fileName ? fileName + 'pt' : 'data_'+Date.now()+'.pt';
        window.save_link.click();
    },

    dataURLtoURL(dataurl) {
        if (dataurl.substr(0,4) == 'http') return dataurl;
        let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        let file = new Blob([u8arr], {type:mime});
        let url;
        if (window.URL !== undefined)
            url = window['URL']['createObjectURL'](file);
        else
            url =  window['webkitURL']['createObjectURL'](file);
        return url;
    },

    openJson() {
        if (!window.open_json) {
            window.open_json = document.createElement("input");
            window.open_json.id = 'FileSelector';
            window.open_json.type = "file";
            window.open_json.accept = "application/pt";
            window.open_json.style.height = "0px";
            window.open_json.style.display = "block";
            window.open_json.style.overflow = "hidden";
            document.body.insertBefore(window.open_json, document.body.firstChild);
            window.open_json.onchange = function(event) {
                let files = event.target.files;
                let fileName = files[0].name.replace(/\\/g, '/');
                fileName = fileName.split('/');
                let tmpName = fileName[fileName.length-1].split('.');
                fileName = '';
                for(let i=0;i<tmpName.length-1;i++) {
                    fileName+=tmpName[i]+'.';
                }
                window.fileSelector.html_obj.fake_value = fileName + '.jpg';
                let reader = new FileReader();
                reader.onload = function() {
                    let jn = JSON.parse(this.result);
                    cc.log(jn);
                    try {
                        window.current_method = jn.method;
                        window.current_room = 'new';
                        window.current_step = 'new';
                        window.result_id = 'new';
                        if(window.current_method=='colorization'){
                            window.controller.tog1.getComponent('cc.Toggle').isChecked = true;
                            window.controller.tog2.getComponent('cc.Toggle').isChecked = false;
                            window.controller.tog3.getComponent('cc.Toggle').isChecked = false;
                        }
                        if(window.current_method=='rendering'){
                            window.controller.tog1.getComponent('cc.Toggle').isChecked = false;
                            window.controller.tog2.getComponent('cc.Toggle').isChecked = true;
                            window.controller.tog3.getComponent('cc.Toggle').isChecked = false;
                        }
                        if(window.current_method=='recolorization'){
                            window.controller.tog1.getComponent('cc.Toggle').isChecked = false;
                            window.controller.tog2.getComponent('cc.Toggle').isChecked = false;
                            window.controller.tog3.getComponent('cc.Toggle').isChecked = true;
                        }
                        window.controller.line_enabled.isChecked = jn.line;
                        let lc = new cc.Color();
                        lc.r = jn.lineColor[0];
                        lc.g = jn.lineColor[1];
                        lc.b = jn.lineColor[2];
                        window.lcolor = lc;
                        window.controller.line_color.color = lc;
                        window.hasReference = jn.hasReference;
                        jn.referenceImg && (window.referenceImg = jn.referenceImg);
                        if(window.hasReference && jn.referenceImg){
                            window.controller.load_reference_url(window.controller.dataURLtoURL(jn.referenceImg), function () {
                                window.hasReference = true;
                            });
                        }else{
                            window.controller.load_reference_url("res\\raw-assets\\texture\\ring.png?t="+Math.random());
                        }
                        window.current_referenceAlpha = jn.alpha;
                        window.controller.sliderNode.getComponent('cc.Slider').progress = window.current_referenceAlpha;
                        window.controller.on_slider();
                        window.temp_points = jn.points;
                        window.creativeCanvas.points_XYRGBR = window.temp_points;
                        window.creativeCanvas.finish();
                        jn.srcImg && (window.srcImg = jn.srcImg);
                        jn.srcImg && window.controller.load_sketch_url(window.controller.dataURLtoURL(jn.srcImg), window.controller.uploadSketch);
                        window.uploading = false;
                    } catch(e) {
                        alert('open failed:'+e);
                    }
                };
                reader.onerror = function() {
                    alert('open failed.');
                }
                reader.readAsText(files[0]);
            }
        }
        window.open_json.click();
    },

    onOpenWithJson() {
        this.openJson();
    }

});
