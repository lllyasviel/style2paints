require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Controller":[function(require,module,exports){
"use strict";
cc._RF.push(module, '806bcYbxcNFYKpTMgw+5/TX', 'Controller');
// script/Controller.js

'use strict';

var spSketchImg;
var spRefereneImg;
var spResultImg;
var spColorImg;
var spHintNode;
var spBTN;
var spLAB;

var fileInputForSketch;
var fileInputForReferene;

var mousePosition;
var mouseInReference = false;

var loaded = false;

var getMouseDown = false;
var preMouseInRef = false;
var selectingColor = false;
var painting = false;
var finalX = 0;
var finalY = 0;

var hasSketch = false;
var hasRef = false;

var HTML_Canvas_sketch;
var HTML_Canvas_reference;
var HTML_Canvas_hint;

var isPen = true;

var mouseIsDown = false;

var resultURL = "";

var version = 2;

function createObjectURL(blob) {
    if (window.URL !== undefined) return window['URL']['createObjectURL'](blob);else return window['webkitURL']['createObjectURL'](blob);
}

function onSketchFileSelected(evt) {
    loadLocalSketch(createObjectURL(evt.target.files[0]));
}

function onRefereneFileSelected(evt) {
    loadLocalReference(createObjectURL(evt.target.files[0]));
}

function loadLocalReference(uri) {
    var tempDiv = document.getElementById("tempDivReference");
    if (tempDiv === null) {
        var tempDiv = document.createElement("div");
        document.body.appendChild(tempDiv);
        tempDiv.style.position = "absolute";
        tempDiv.id = "tempDivReference";
        tempDiv.innerHTML = '<img id=imgheadReference>';
        tempDiv.style.display = 'none';
        tempDiv.style.visibility = "hidden";
    }
    var img = document.getElementById('imgheadReference');
    img.onload = function () {

        var w_224 = parseFloat(this.width);
        var h_224 = parseFloat(this.height);
        if (w_224 > h_224) {
            w_224 = 224.0 / h_224 * w_224;
            h_224 = 224.0;
        } else {
            h_224 = 224.0 / w_224 * h_224;
            w_224 = 224.0;
        }

        var w_200 = parseFloat(this.width);
        var h_200 = parseFloat(this.height);
        if (w_200 < h_200) {
            w_200 = 200.0 / h_200 * w_200;
            h_200 = 200.0;
        } else {
            h_200 = 200.0 / w_200 * h_200;
            w_200 = 200.0;
        }

        spRefereneImg.node.width = parseInt(w_200);
        spRefereneImg.node.height = parseInt(h_200);
        HTML_Canvas_reference.width = parseInt(w_224);
        HTML_Canvas_reference.height = parseInt(h_224);

        HTML_Canvas_reference.getContext("2d").drawImage(this, 0, 0, HTML_Canvas_reference.width, HTML_Canvas_reference.height);
        HTML_Canvas_hint.getContext("2d").clearRect(0, 0, HTML_Canvas_hint.width, HTML_Canvas_hint.height);

        var referenceNodeTexture = spRefereneImg.spriteFrame.getTexture();
        var hintNodeTexture = spHintNode.getComponent('cc.Sprite').spriteFrame.getTexture();

        hintNodeTexture.initWithElement(HTML_Canvas_hint);
        hintNodeTexture.handleLoadedTexture();

        referenceNodeTexture.initWithElement(HTML_Canvas_reference);
        referenceNodeTexture.handleLoadedTexture();

        var tempCanvas_200 = document.createElement("canvas");
        tempCanvas_200.width = parseInt(w_200);
        tempCanvas_200.height = parseInt(h_200);
        tempCanvas_200.getContext("2d").drawImage(this, 0, 0, tempCanvas_200.width, tempCanvas_200.height);
        referenceNodeTexture._pixels = tempCanvas_200.getContext("2d").getImageData(0, 0, tempCanvas_200.width, tempCanvas_200.height).data;

        hasRef = true;
    };
    img.src = uri;
}

function loadLocalResult(uri) {
    var tempDiv = document.getElementById("tempDivResult");
    if (tempDiv === null) {
        var tempDiv = document.createElement("div");
        document.body.appendChild(tempDiv);
        tempDiv.style.position = "absolute";
        tempDiv.id = "tempDivResult";
        tempDiv.innerHTML = '<img id=imgheadResult>';
        tempDiv.style.display = 'none';
        tempDiv.style.visibility = "hidden";
    }
    var img = document.getElementById('imgheadResult');
    img.onload = function () {

        var texture = spResultImg.spriteFrame.getTexture();
        texture.initWithElement(this);
        texture.handleLoadedTexture();
        var w = parseFloat(this.width);
        var h = parseFloat(this.height);

        var small = true;

        if (w > h) {
            if (w > 724) {
                small = false;
            }
        } else {
            if (h > 724) {
                small = false;
            }
        }

        if (!small) {
            if (w < h) {
                w = 724.0 / h * w;
                h = 724.0;
            } else {
                h = 724.0 / w * h;
                w = 724.0;
            }
        }

        spResultImg.node.width = parseInt(w);
        spResultImg.node.height = parseInt(h);

        spBTN.enabled = true;
        spLAB.string = "<u>colorize</u>";
    };
    img.src = uri;
    resultURL = uri;
}

function loadLocalSketch(uri) {
    var tempDiv = document.getElementById("tempDivSketch");
    if (tempDiv === null) {
        var tempDiv = document.createElement("div");
        document.body.appendChild(tempDiv);
        tempDiv.style.position = "absolute";
        tempDiv.id = "tempDivSketch";
        tempDiv.innerHTML = '<img id=imgheadSketch>';
        tempDiv.style.display = 'none';
        tempDiv.style.visibility = "hidden";
    }
    var img = document.getElementById('imgheadSketch');
    img.onload = function () {

        var w = parseFloat(this.width);
        var h = parseFloat(this.height);
        HTML_Canvas_sketch.width = parseInt(w);
        HTML_Canvas_sketch.height = parseInt(h);

        if (w > h) {
            w = 512.0 / h * w;
            h = 512.0;
        } else {
            h = 512.0 / w * h;
            w = 512.0;
        }

        HTML_Canvas_hint.width = parseInt(w);
        HTML_Canvas_hint.height = parseInt(h);

        w = parseFloat(this.width);
        h = parseFloat(this.height);
        if (w < h) {
            w = 512.0 / h * w;
            h = 512.0;
        } else {
            h = 512.0 / w * h;
            w = 512.0;
        }

        spSketchImg.node.width = parseInt(w);
        spSketchImg.node.height = parseInt(h);
        spHintNode.width = parseInt(w);
        spHintNode.height = parseInt(h);

        HTML_Canvas_sketch.getContext("2d").drawImage(this, 0, 0, HTML_Canvas_sketch.width, HTML_Canvas_sketch.height);
        HTML_Canvas_hint.getContext("2d").clearRect(0, 0, HTML_Canvas_hint.width, HTML_Canvas_hint.height);

        var hintNodeTexture = spHintNode.getComponent('cc.Sprite').spriteFrame.getTexture();
        hintNodeTexture.initWithElement(HTML_Canvas_hint);
        hintNodeTexture.handleLoadedTexture();

        var sketchNodeTexture = spSketchImg.spriteFrame.getTexture();
        sketchNodeTexture.initWithElement(HTML_Canvas_sketch);
        sketchNodeTexture.handleLoadedTexture();

        hasSketch = true;
    };
    img.src = uri;
}

cc.Texture2D.prototype._pixels = [];
cc.Texture2D.prototype.getPixels = function (x, y, newWidth, newHeight) {
    var idx = parseInt((newHeight - parseInt(y)) * newWidth * 4 + parseInt(x) * 4);
    return new cc.color(this._pixels[idx], this._pixels[idx + 1], this._pixels[idx + 2]);
};

cc.Class({
    extends: cc.Component,

    properties: {
        sketchImg: {
            default: null, type: cc.Node
        },
        referenceImg: {
            default: null, type: cc.Node
        },
        resultImg: {
            default: null, type: cc.Node
        },
        colorImg: {
            default: null, type: cc.Node
        },
        flag: {
            default: null, type: cc.Node
        },
        hint: {
            default: null, type: cc.Node
        },
        btn: {
            default: null, type: cc.Node
        },
        denoise: {
            default: null, type: cc.Node
        },
        welcome: {
            default: null, type: cc.Node
        }
    },

    onV1: function onV1() {
        version = 1;
        this.onClearClicked();
    },

    onV2: function onV2() {
        version = 2;
        this.onClearClicked();
    },

    onV3: function onV3() {
        version = 3;
        this.onClearClicked();
    },

    onV4: function onV4() {
        version = 4;
        this.onClearClicked();
    },

    onLoad: function onLoad() {

        cc.director.setClearColor(cc.color(0, 0, 0, 0));

        spSketchImg = this.sketchImg.getComponent('cc.Sprite');
        spRefereneImg = this.referenceImg.getComponent('cc.Sprite');
        spResultImg = this.resultImg.getComponent('cc.Sprite');
        spColorImg = this.colorImg.getComponent('cc.Sprite');
        spHintNode = this.hint;
        spBTN = this.btn.getComponent('cc.Button');
        spLAB = this.btn.getComponent('cc.RichText');

        fileInputForSketch = document.createElement("input");
        fileInputForSketch.id = "fileInputForSketch";
        fileInputForSketch.type = "file";
        fileInputForSketch.accept = "image/*";
        fileInputForSketch.style.height = "0px";
        fileInputForSketch.style.display = "block";
        fileInputForSketch.style.overflow = "hidden";
        document.body.insertBefore(fileInputForSketch, document.body.firstChild);
        fileInputForSketch.addEventListener('change', onSketchFileSelected, false);

        fileInputForReferene = document.createElement("input");
        fileInputForReferene.id = "fileInputForReferene";
        fileInputForReferene.type = "file";
        fileInputForReferene.accept = "image/*";
        fileInputForReferene.style.height = "0px";
        fileInputForReferene.style.display = "block";
        fileInputForReferene.style.overflow = "hidden";
        document.body.insertBefore(fileInputForReferene, document.body.firstChild);
        fileInputForReferene.addEventListener('change', onRefereneFileSelected, false);

        this.node.on("mousemove", function (event) {
            mousePosition = event.getLocation();
        });

        this.node.on("mousedown", function (event) {
            mouseIsDown = true;
        });

        this.node.on("mouseup", function (event) {
            getMouseDown = true;
            mouseIsDown = false;
        });

        HTML_Canvas_hint = document.createElement("canvas");
        HTML_Canvas_hint.id = "HTML_Canvas_hint";

        HTML_Canvas_reference = document.createElement("canvas");
        HTML_Canvas_reference.id = "HTML_Canvas_reference";

        HTML_Canvas_sketch = document.createElement("canvas");
        HTML_Canvas_sketch.id = "HTML_Canvas_sketch";

        loaded = true;
    },

    onSketchClicked: function onSketchClicked() {
        fileInputForSketch.click();
    },
    onRefenceClicked: function onRefenceClicked() {
        fileInputForReferene.click();
    },
    onPenClicked: function onPenClicked() {
        isPen = true;
    },
    onEraserClicked: function onEraserClicked() {
        isPen = false;
    },
    onClearClicked: function onClearClicked() {
        var cxt = HTML_Canvas_hint.getContext("2d");
        cxt.clearRect(0, 0, HTML_Canvas_hint.width, HTML_Canvas_hint.height);
        var hintNodeTex = spHintNode.getComponent('cc.Sprite').spriteFrame.getTexture();
        hintNodeTex.initWithElement(HTML_Canvas_hint);
        hintNodeTex.handleLoadedTexture();
    },
    onColorizeClicked: function onColorizeClicked() {
        if (!hasRef) {
            return;
        }
        if (!hasSketch) {
            return;
        }

        spResultImg.node.width = 0;
        spResultImg.node.height = 0;

        var hintDataURL = HTML_Canvas_hint.toDataURL("image/png");
        var referenceDataURL = HTML_Canvas_reference.toDataURL("image/png");
        var sketchDataURL = HTML_Canvas_sketch.toDataURL("image/png");

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/paint", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
        xhr.onreadystatechange = function () {
            loadLocalResult(xhr.responseText);
        };
        xhr.send("sketch=" + encodeURIComponent(sketchDataURL) + "&reference=" + encodeURIComponent(referenceDataURL) + "&hint=" + encodeURIComponent(hintDataURL) + "&version=" + version.toString() + "&denoise=" + this.denoise.getComponent('cc.Toggle').isChecked.toString());
        spBTN.enabled = false;
        spLAB.string = "Waiting";
        this.welcome.active = false;
    },
    onDownloadClicked: function onDownloadClicked() {
        if (resultURL == "") {
            return;
        }
        window.open(resultURL);
    },
    handlePainter: function handlePainter() {
        painting = false;
        var relativeX = 0;
        var relativeY = 0;
        var refPosition = spSketchImg.node.convertToWorldSpace(spSketchImg.node.position);
        if (refPosition != null && mousePosition != null) {
            var beginX = refPosition.x - 256;
            var beginY = refPosition.y - 256;
            relativeX = mousePosition.x - beginX;
            relativeY = mousePosition.y - beginY;
            var mouseInSketch = relativeX > 0 && relativeY > 0 && relativeX < spSketchImg.node.width && relativeY < spSketchImg.node.height;
            if (mouseInSketch) {
                painting = true;
            }
        }
        if (painting) {
            if (mouseIsDown) {
                var cxt = HTML_Canvas_hint.getContext("2d");

                if (isPen) {
                    var pen = 6 - version;
                    cxt.beginPath();
                    cxt.arc(parseInt(parseFloat(relativeX) / parseFloat(spHintNode.width) * parseFloat(HTML_Canvas_hint.width)), parseInt(parseFloat(spHintNode.height - relativeY) / parseFloat(spHintNode.height) * parseFloat(HTML_Canvas_hint.height)), pen, 0, Math.PI * 2, true);
                    cxt.closePath();
                    var color = spColorImg.node.color;
                    cxt.fillStyle = 'rgba(' + color.r.toString() + ',' + color.g.toString() + ',' + color.b.toString() + ',0.618)';
                    cxt.fill();
                } else {
                    var cxt = HTML_Canvas_hint.getContext("2d");
                    cxt.clearRect(parseInt(parseFloat(relativeX) / parseFloat(spHintNode.width) * parseFloat(HTML_Canvas_hint.width)) - 10, parseInt(parseFloat(spHintNode.height - relativeY) / parseFloat(spHintNode.height) * parseFloat(HTML_Canvas_hint.height)) - 10, 20, 20);
                }

                var hintNodeTex = spHintNode.getComponent('cc.Sprite').spriteFrame.getTexture();
                hintNodeTex.initWithElement(HTML_Canvas_hint);
                hintNodeTex.handleLoadedTexture(true);
            }
        }
    },
    handleColorPicker: function handleColorPicker() {
        var refPosition = spRefereneImg.node.convertToWorldSpace(spRefereneImg.node.position);
        if (refPosition != null && mousePosition != null) {
            var beginX = refPosition.x;
            var beginY = refPosition.y;
            var relativeX = mousePosition.x - beginX;
            var relativeY = mousePosition.y - beginY;
            mouseInReference = relativeX > 0 && relativeY > 0 && relativeX < spRefereneImg.node.width && relativeY < spRefereneImg.node.height;
            if (mouseInReference) {
                if (!preMouseInRef) {
                    selectingColor = true;
                }
                if (getMouseDown) {
                    if (selectingColor) {
                        this.flag.x = relativeX - spRefereneImg.node.width / 2;
                        this.flag.y = relativeY - spRefereneImg.node.height / 2;
                        finalX = relativeX;
                        finalY = relativeY;
                        isPen = true;
                    }
                }
            } else {
                if (selectingColor) {
                    selectingColor = false;
                    var texture = spRefereneImg.spriteFrame.getTexture();
                    spColorImg.node.color = spRefereneImg.spriteFrame.getTexture().getPixels(finalX, finalY, spRefereneImg.node.width, spRefereneImg.node.height);
                }
            }
            if (selectingColor) {
                var texture = spRefereneImg.spriteFrame.getTexture();
                spColorImg.node.color = spRefereneImg.spriteFrame.getTexture().getPixels(relativeX, relativeY, spRefereneImg.node.width, spRefereneImg.node.height);
            }
        }
    },
    update: function update(dt) {
        if (loaded) {
            this.handleColorPicker();
            this.handlePainter();
            if (selectingColor) {
                document.body.style.cursor = 'crosshair';
            } else if (painting) {
                document.body.style.cursor = 'crosshair';
            } else {
                document.body.style.cursor = 'default';
            }
        }
        preMouseInRef = mouseInReference;
        getMouseDown = false;
    }
});

cc._RF.pop();
},{}],"openURL":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'c3edbKDNW5IabfV9hr8BIUy', 'openURL');
// script/openURL.js

"use strict";

cc.Class({
    extends: cc.Component,
    properties: {
        url: {
            default: "", type: String
        }
    },
    onOpen: function onOpen() {
        window.open(this.url);
    }
});

cc._RF.pop();
},{}]},{},["Controller","openURL"])

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvQ29udHJvbGxlci5qcyIsImFzc2V0cy9zY3JpcHQvb3BlblVSTC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNJO0FBSUg7O0FBRUQ7QUFDSTtBQUNIOztBQUVEO0FBQ0k7QUFDSDs7QUFFRDtBQUNJO0FBQ0g7QUFDSTtBQUNHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNOO0FBQ0Q7QUFDRzs7QUFFSTtBQUNOO0FBQ0E7QUFFSTtBQUNBO0FBQ0g7QUFHRztBQUNBO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBO0FBRUk7QUFDQTtBQUNIO0FBR0c7QUFDQTtBQUNIOztBQUVEO0FBQ0E7QUFDQTtBQUNNOztBQUVBO0FBQ0E7O0FBRUE7QUFDTjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDTTtBQUNBO0FBQ0E7QUFDQTs7QUFFTjtBQUNHO0FBQ0o7QUFDQTs7QUFFRDtBQUNJO0FBQ0g7QUFDSTtBQUNHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNOO0FBQ0Q7QUFDRzs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7QUFDRztBQUNJO0FBQ0g7QUFDSjs7QUFFRDtBQUNJO0FBRUk7QUFDQTtBQUNIO0FBR0c7QUFDQTtBQUNIO0FBQ0o7O0FBRUQ7QUFDQTs7QUFFQTtBQUNNO0FBQ0g7QUFDSjtBQUNBO0FBQ0E7O0FBRUQ7QUFDSTtBQUNIO0FBQ0k7QUFDRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTjtBQUNEO0FBQ0c7O0FBRUk7QUFDTjtBQUNBO0FBQ007O0FBRU47QUFFSTtBQUNBO0FBQ0g7QUFHRztBQUNBO0FBQ0g7O0FBRUs7QUFDTjs7QUFFQTtBQUNBO0FBQ0E7QUFFSTtBQUNBO0FBQ0g7QUFHRztBQUNBO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRU07QUFDSDs7QUFFRztBQUNOO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0c7QUFDSjtBQUNBOztBQUVEO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7O0FBRUQ7QUFDSTs7QUFFQTtBQUNJO0FBQ0k7QUFETTtBQUdWO0FBQ0k7QUFEUztBQUdiO0FBQ0k7QUFETTtBQUdWO0FBQ0k7QUFESztBQUdUO0FBQ0k7QUFEQztBQUdMO0FBQ0k7QUFEQztBQUdMO0FBQ0k7QUFEQTtBQUdKO0FBQ0k7QUFESTtBQUdSO0FBQ0k7QUFESTtBQXpCQTs7QUE4Qlo7QUFDSTtBQUNBO0FBQ0g7O0FBRUQ7QUFDSTtBQUNBO0FBQ0g7O0FBRUQ7QUFDSTtBQUNBO0FBQ0g7O0FBRUQ7QUFDSTtBQUNBO0FBQ0g7O0FBRUQ7O0FBRUk7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJO0FBQ0g7O0FBRUQ7QUFDSTtBQUNIOztBQUVEO0FBQ0k7QUFDQTtBQUNIOztBQUVEO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBRUg7O0FBRUQ7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0c7QUFDTjtBQUNBO0FBQ0c7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDs7QUFFRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQVFBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNHO0FBQ0E7QUFDSDs7QUFFRDtBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7QUFDRDtBQUNJO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNDO0FBQ0o7QUFDSjtBQUNHO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7QUFDUjtBQUNEO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFFSTtBQUNIO0FBR0c7QUFDSDtBQUdHO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSDtBQXBRSTs7Ozs7Ozs7OztBQ3pQVDtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBREE7QUFESTtBQUtaO0FBQ0k7QUFDSDtBQVRJIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHNwU2tldGNoSW1nO1xyXG52YXIgc3BSZWZlcmVuZUltZztcclxudmFyIHNwUmVzdWx0SW1nO1xyXG52YXIgc3BDb2xvckltZztcclxudmFyIHNwSGludE5vZGU7XHJcbnZhciBzcEJUTjtcclxudmFyIHNwTEFCO1xyXG5cclxudmFyIGZpbGVJbnB1dEZvclNrZXRjaDtcclxudmFyIGZpbGVJbnB1dEZvclJlZmVyZW5lO1xyXG5cclxudmFyIG1vdXNlUG9zaXRpb247XHJcbnZhciBtb3VzZUluUmVmZXJlbmNlID0gZmFsc2U7XHJcblxyXG52YXIgbG9hZGVkID0gZmFsc2U7XHJcblxyXG52YXIgZ2V0TW91c2VEb3duID0gZmFsc2U7XHJcbnZhciBwcmVNb3VzZUluUmVmID0gZmFsc2U7XHJcbnZhciBzZWxlY3RpbmdDb2xvciA9IGZhbHNlO1xyXG52YXIgcGFpbnRpbmcgPSBmYWxzZTtcclxudmFyIGZpbmFsWD0wO1xyXG52YXIgZmluYWxZPTA7XHJcblxyXG52YXIgaGFzU2tldGNoPWZhbHNlO1xyXG52YXIgaGFzUmVmPWZhbHNlO1xyXG5cclxudmFyIEhUTUxfQ2FudmFzX3NrZXRjaDtcclxudmFyIEhUTUxfQ2FudmFzX3JlZmVyZW5jZTtcclxudmFyIEhUTUxfQ2FudmFzX2hpbnQ7XHJcblxyXG52YXIgaXNQZW4gPSB0cnVlO1xyXG5cclxudmFyIG1vdXNlSXNEb3duID0gZmFsc2U7XHJcblxyXG52YXIgcmVzdWx0VVJMID0gXCJcIjtcclxuXHJcbnZhciB2ZXJzaW9uID0gMjtcclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZU9iamVjdFVSTChibG9iKXtcclxuICAgIGlmKHdpbmRvdy5VUkwgIT09IHVuZGVmaW5lZClcclxuICAgICAgICByZXR1cm4gd2luZG93WydVUkwnXVsnY3JlYXRlT2JqZWN0VVJMJ10oYmxvYik7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgcmV0dXJuIHdpbmRvd1snd2Via2l0VVJMJ11bJ2NyZWF0ZU9iamVjdFVSTCddKGJsb2IpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBvblNrZXRjaEZpbGVTZWxlY3RlZChldnQpIHtcclxuICAgIGxvYWRMb2NhbFNrZXRjaChjcmVhdGVPYmplY3RVUkwoZXZ0LnRhcmdldC5maWxlc1swXSkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBvblJlZmVyZW5lRmlsZVNlbGVjdGVkKGV2dCkge1xyXG4gICAgbG9hZExvY2FsUmVmZXJlbmNlKGNyZWF0ZU9iamVjdFVSTChldnQudGFyZ2V0LmZpbGVzWzBdKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRMb2NhbFJlZmVyZW5jZSh1cmkpe1xyXG4gICAgdmFyIHRlbXBEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRlbXBEaXZSZWZlcmVuY2VcIik7XHJcblx0aWYodGVtcERpdj09PW51bGwpe1xyXG5cdCAgICB2YXIgdGVtcERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0ZW1wRGl2KTtcclxuICAgICAgICB0ZW1wRGl2LnN0eWxlLnBvc2l0aW9uPVwiYWJzb2x1dGVcIjtcclxuICAgICAgICB0ZW1wRGl2LmlkPVwidGVtcERpdlJlZmVyZW5jZVwiO1xyXG4gICAgICAgIHRlbXBEaXYuaW5uZXJIVE1MID0gJzxpbWcgaWQ9aW1naGVhZFJlZmVyZW5jZT4nO1xyXG4gICAgICAgIHRlbXBEaXYuc3R5bGUuZGlzcGxheT0nbm9uZSc7XHJcbiAgICAgICAgdGVtcERpdi5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcclxuXHR9XHJcblx0dmFyIGltZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbWdoZWFkUmVmZXJlbmNlJyk7XHJcbiAgICBpbWcub25sb2FkID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgd18yMjQgPSBwYXJzZUZsb2F0KHRoaXMud2lkdGgpO1xyXG5cdFx0dmFyIGhfMjI0ID0gcGFyc2VGbG9hdCh0aGlzLmhlaWdodCk7XHJcblx0XHRpZih3XzIyNCA+IGhfMjI0KVxyXG5cdFx0e1xyXG5cdFx0ICAgIHdfMjI0ID0gMjI0LjAgLyBoXzIyNCAqIHdfMjI0O1xyXG5cdFx0ICAgIGhfMjI0ID0gMjI0LjA7XHJcblx0XHR9XHJcblx0XHRlbHNlXHJcblx0XHR7XHJcblx0XHQgICAgaF8yMjQgPSAyMjQuMCAvIHdfMjI0ICogaF8yMjQ7XHJcblx0XHQgICAgd18yMjQgPSAyMjQuMDtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dmFyIHdfMjAwID0gcGFyc2VGbG9hdCh0aGlzLndpZHRoKTtcclxuXHRcdHZhciBoXzIwMCA9IHBhcnNlRmxvYXQodGhpcy5oZWlnaHQpO1xyXG5cdFx0aWYod18yMDAgPCBoXzIwMClcclxuXHRcdHtcclxuXHRcdCAgICB3XzIwMCA9IDIwMC4wIC8gaF8yMDAgKiB3XzIwMDtcclxuXHRcdCAgICBoXzIwMCA9IDIwMC4wO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZVxyXG5cdFx0e1xyXG5cdFx0ICAgIGhfMjAwID0gMjAwLjAgLyB3XzIwMCAqIGhfMjAwO1xyXG5cdFx0ICAgIHdfMjAwID0gMjAwLjA7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHNwUmVmZXJlbmVJbWcubm9kZS53aWR0aCA9IHBhcnNlSW50KHdfMjAwKTtcclxuXHRcdHNwUmVmZXJlbmVJbWcubm9kZS5oZWlnaHQgPSBwYXJzZUludChoXzIwMCk7XHJcblx0XHRIVE1MX0NhbnZhc19yZWZlcmVuY2Uud2lkdGggPSBwYXJzZUludCh3XzIyNCk7XHJcbiAgICAgICAgSFRNTF9DYW52YXNfcmVmZXJlbmNlLmhlaWdodCA9IHBhcnNlSW50KGhfMjI0KTtcclxuICAgICAgICBcclxuICAgICAgICBIVE1MX0NhbnZhc19yZWZlcmVuY2UuZ2V0Q29udGV4dChcIjJkXCIpLmRyYXdJbWFnZSh0aGlzLCAwLCAwLCBIVE1MX0NhbnZhc19yZWZlcmVuY2Uud2lkdGgsIEhUTUxfQ2FudmFzX3JlZmVyZW5jZS5oZWlnaHQpO1xyXG4gICAgICAgIEhUTUxfQ2FudmFzX2hpbnQuZ2V0Q29udGV4dChcIjJkXCIpLmNsZWFyUmVjdCgwLDAsSFRNTF9DYW52YXNfaGludC53aWR0aCxIVE1MX0NhbnZhc19oaW50LmhlaWdodCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHJlZmVyZW5jZU5vZGVUZXh0dXJlID0gc3BSZWZlcmVuZUltZy5zcHJpdGVGcmFtZS5nZXRUZXh0dXJlKCk7XHJcblx0XHR2YXIgaGludE5vZGVUZXh0dXJlID0gc3BIaW50Tm9kZS5nZXRDb21wb25lbnQoJ2NjLlNwcml0ZScpLnNwcml0ZUZyYW1lLmdldFRleHR1cmUoKTtcclxuICAgICAgICBcclxuXHRcdGhpbnROb2RlVGV4dHVyZS5pbml0V2l0aEVsZW1lbnQoSFRNTF9DYW52YXNfaGludCk7XHJcblx0XHRoaW50Tm9kZVRleHR1cmUuaGFuZGxlTG9hZGVkVGV4dHVyZSgpO1xyXG5cdFx0XHJcblx0XHRyZWZlcmVuY2VOb2RlVGV4dHVyZS5pbml0V2l0aEVsZW1lbnQoSFRNTF9DYW52YXNfcmVmZXJlbmNlKTtcclxuXHRcdHJlZmVyZW5jZU5vZGVUZXh0dXJlLmhhbmRsZUxvYWRlZFRleHR1cmUoKTtcclxuXHRcdFxyXG5cdFx0dmFyIHRlbXBDYW52YXNfMjAwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcclxuICAgICAgICB0ZW1wQ2FudmFzXzIwMC53aWR0aCA9IHBhcnNlSW50KHdfMjAwKTtcclxuICAgICAgICB0ZW1wQ2FudmFzXzIwMC5oZWlnaHQgPSBwYXJzZUludChoXzIwMCk7XHJcbiAgICAgICAgdGVtcENhbnZhc18yMDAuZ2V0Q29udGV4dChcIjJkXCIpLmRyYXdJbWFnZSh0aGlzLCAwLCAwLCB0ZW1wQ2FudmFzXzIwMC53aWR0aCwgdGVtcENhbnZhc18yMDAuaGVpZ2h0KTtcclxuICAgICAgICByZWZlcmVuY2VOb2RlVGV4dHVyZS5fcGl4ZWxzID0gdGVtcENhbnZhc18yMDAuZ2V0Q29udGV4dChcIjJkXCIpLmdldEltYWdlRGF0YSgwLCAwLCB0ZW1wQ2FudmFzXzIwMC53aWR0aCwgdGVtcENhbnZhc18yMDAuaGVpZ2h0KS5kYXRhO1xyXG5cdFx0XHJcblx0XHRoYXNSZWYgPSB0cnVlO1xyXG4gICAgfVxyXG5cdGltZy5zcmMgPSB1cmk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRMb2NhbFJlc3VsdCh1cmkpe1xyXG4gICAgdmFyIHRlbXBEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRlbXBEaXZSZXN1bHRcIik7XHJcblx0aWYodGVtcERpdj09PW51bGwpe1xyXG5cdCAgICB2YXIgdGVtcERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0ZW1wRGl2KTtcclxuICAgICAgICB0ZW1wRGl2LnN0eWxlLnBvc2l0aW9uPVwiYWJzb2x1dGVcIjtcclxuICAgICAgICB0ZW1wRGl2LmlkPVwidGVtcERpdlJlc3VsdFwiO1xyXG4gICAgICAgIHRlbXBEaXYuaW5uZXJIVE1MID0gJzxpbWcgaWQ9aW1naGVhZFJlc3VsdD4nO1xyXG4gICAgICAgIHRlbXBEaXYuc3R5bGUuZGlzcGxheT0nbm9uZSc7XHJcbiAgICAgICAgdGVtcERpdi5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcclxuXHR9XHJcblx0dmFyIGltZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbWdoZWFkUmVzdWx0Jyk7XHJcbiAgICBpbWcub25sb2FkID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBcclxuXHRcdHZhciB0ZXh0dXJlID0gc3BSZXN1bHRJbWcuc3ByaXRlRnJhbWUuZ2V0VGV4dHVyZSgpO1xyXG5cdFx0dGV4dHVyZS5pbml0V2l0aEVsZW1lbnQodGhpcyk7XHJcblx0XHR0ZXh0dXJlLmhhbmRsZUxvYWRlZFRleHR1cmUoKTtcclxuXHRcdHZhciB3ID0gcGFyc2VGbG9hdCh0aGlzLndpZHRoKTtcclxuXHRcdHZhciBoID0gcGFyc2VGbG9hdCh0aGlzLmhlaWdodCk7XHJcblx0XHRcclxuXHRcdHZhciBzbWFsbCA9IHRydWU7XHJcblx0XHRcclxuXHRcdGlmKHc+aCl7XHJcblx0XHQgICAgaWYodz43MjQpe1xyXG5cdFx0ICAgICAgICBzbWFsbCA9IGZhbHNlO1xyXG5cdFx0ICAgIH1cclxuXHRcdH1lbHNle1xyXG5cdFx0ICAgIGlmKGg+NzI0KXtcclxuXHRcdCAgICAgICAgc21hbGwgPSBmYWxzZTtcclxuXHRcdCAgICB9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmKCFzbWFsbCl7XHJcblx0XHQgICAgaWYodzxoKVxyXG5cdFx0ICAgIHtcclxuXHRcdCAgICAgICAgdyA9IDcyNC4wIC8gaCAqIHc7XHJcblx0XHQgICAgICAgIGggPSA3MjQuMDtcclxuXHRcdCAgICB9XHJcblx0XHQgICAgZWxzZVxyXG5cdFx0ICAgIHtcclxuXHRcdCAgICAgICAgaCA9IDcyNC4wIC8gdyAqIGg7XHJcblx0XHQgICAgICAgIHcgPSA3MjQuMDtcclxuXHRcdCAgICB9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHNwUmVzdWx0SW1nLm5vZGUud2lkdGggPSBwYXJzZUludCh3KTtcclxuXHRcdHNwUmVzdWx0SW1nLm5vZGUuaGVpZ2h0ID0gcGFyc2VJbnQoaCk7XHJcblx0XHRcclxuXHRcdHNwQlROLmVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIHNwTEFCLnN0cmluZyA9IFwiPHU+Y29sb3JpemU8L3U+XCI7XHJcbiAgICB9XHJcblx0aW1nLnNyYyA9IHVyaTtcclxuXHRyZXN1bHRVUkwgPSB1cmk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRMb2NhbFNrZXRjaCh1cmkpe1xyXG4gICAgdmFyIHRlbXBEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRlbXBEaXZTa2V0Y2hcIik7XHJcblx0aWYodGVtcERpdj09PW51bGwpe1xyXG5cdCAgICB2YXIgdGVtcERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0ZW1wRGl2KTtcclxuICAgICAgICB0ZW1wRGl2LnN0eWxlLnBvc2l0aW9uPVwiYWJzb2x1dGVcIjtcclxuICAgICAgICB0ZW1wRGl2LmlkPVwidGVtcERpdlNrZXRjaFwiO1xyXG4gICAgICAgIHRlbXBEaXYuaW5uZXJIVE1MID0gJzxpbWcgaWQ9aW1naGVhZFNrZXRjaD4nO1xyXG4gICAgICAgIHRlbXBEaXYuc3R5bGUuZGlzcGxheT0nbm9uZSc7XHJcbiAgICAgICAgdGVtcERpdi5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcclxuXHR9XHJcblx0dmFyIGltZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbWdoZWFkU2tldGNoJyk7XHJcbiAgICBpbWcub25sb2FkID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgdyA9IHBhcnNlRmxvYXQodGhpcy53aWR0aCk7XHJcblx0XHR2YXIgaCA9IHBhcnNlRmxvYXQodGhpcy5oZWlnaHQpO1xyXG5cdFx0SFRNTF9DYW52YXNfc2tldGNoLndpZHRoID0gcGFyc2VJbnQodyk7XHJcbiAgICAgICAgSFRNTF9DYW52YXNfc2tldGNoLmhlaWdodCA9IHBhcnNlSW50KGgpO1xyXG4gICAgICAgIFxyXG5cdFx0aWYodyA+IGgpXHJcblx0XHR7XHJcblx0XHQgICAgdyA9IDUxMi4wIC8gaCAqIHc7XHJcblx0XHQgICAgaCA9IDUxMi4wO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZVxyXG5cdFx0e1xyXG5cdFx0ICAgIGggPSA1MTIuMCAvIHcgKiBoO1xyXG5cdFx0ICAgIHcgPSA1MTIuMDtcclxuXHRcdH1cclxuICAgICAgICBcclxuICAgICAgICBIVE1MX0NhbnZhc19oaW50LndpZHRoID0gcGFyc2VJbnQodyk7XHJcblx0XHRIVE1MX0NhbnZhc19oaW50LmhlaWdodCA9IHBhcnNlSW50KGgpO1xyXG4gICAgICAgIFxyXG5cdFx0dyA9IHBhcnNlRmxvYXQodGhpcy53aWR0aCk7XHJcblx0XHRoID0gcGFyc2VGbG9hdCh0aGlzLmhlaWdodCk7XHJcblx0XHRpZih3IDwgaClcclxuXHRcdHtcclxuXHRcdCAgICB3ID0gNTEyLjAgLyBoICogdztcclxuXHRcdCAgICBoID0gNTEyLjA7XHJcblx0XHR9XHJcblx0XHRlbHNlXHJcblx0XHR7XHJcblx0XHQgICAgaCA9IDUxMi4wIC8gdyAqIGg7XHJcblx0XHQgICAgdyA9IDUxMi4wO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRzcFNrZXRjaEltZy5ub2RlLndpZHRoID0gcGFyc2VJbnQodyk7XHJcblx0XHRzcFNrZXRjaEltZy5ub2RlLmhlaWdodCA9IHBhcnNlSW50KGgpO1xyXG5cdFx0c3BIaW50Tm9kZS53aWR0aCA9IHBhcnNlSW50KHcpO1xyXG5cdFx0c3BIaW50Tm9kZS5oZWlnaHQgPSBwYXJzZUludChoKTtcclxuXHJcbiAgICAgICAgSFRNTF9DYW52YXNfc2tldGNoLmdldENvbnRleHQoXCIyZFwiKS5kcmF3SW1hZ2UodGhpcywgMCwgMCwgSFRNTF9DYW52YXNfc2tldGNoLndpZHRoLCBIVE1MX0NhbnZhc19za2V0Y2guaGVpZ2h0KTtcclxuXHQgICAgSFRNTF9DYW52YXNfaGludC5nZXRDb250ZXh0KFwiMmRcIikuY2xlYXJSZWN0KDAsMCxIVE1MX0NhbnZhc19oaW50LndpZHRoLEhUTUxfQ2FudmFzX2hpbnQuaGVpZ2h0KTtcclxuXHQgICAgXHJcbiAgICAgICAgdmFyIGhpbnROb2RlVGV4dHVyZSA9IHNwSGludE5vZGUuZ2V0Q29tcG9uZW50KCdjYy5TcHJpdGUnKS5zcHJpdGVGcmFtZS5nZXRUZXh0dXJlKCk7XHJcblx0XHRoaW50Tm9kZVRleHR1cmUuaW5pdFdpdGhFbGVtZW50KEhUTUxfQ2FudmFzX2hpbnQpO1xyXG5cdFx0aGludE5vZGVUZXh0dXJlLmhhbmRsZUxvYWRlZFRleHR1cmUoKTtcclxuXHRcdFxyXG5cdFx0dmFyIHNrZXRjaE5vZGVUZXh0dXJlID0gc3BTa2V0Y2hJbWcuc3ByaXRlRnJhbWUuZ2V0VGV4dHVyZSgpO1xyXG5cdFx0c2tldGNoTm9kZVRleHR1cmUuaW5pdFdpdGhFbGVtZW50KEhUTUxfQ2FudmFzX3NrZXRjaCk7XHJcblx0XHRza2V0Y2hOb2RlVGV4dHVyZS5oYW5kbGVMb2FkZWRUZXh0dXJlKCk7XHJcblx0XHRcclxuXHRcdGhhc1NrZXRjaCA9IHRydWU7XHJcbiAgICB9XHJcblx0aW1nLnNyYyA9IHVyaTtcclxufVxyXG5cclxuY2MuVGV4dHVyZTJELnByb3RvdHlwZS5fcGl4ZWxzID0gW107XHJcbmNjLlRleHR1cmUyRC5wcm90b3R5cGUuZ2V0UGl4ZWxzID0gZnVuY3Rpb24oeCx5LG5ld1dpZHRoLG5ld0hlaWdodCl7XHJcbiAgICB2YXIgaWR4ID0gcGFyc2VJbnQoKG5ld0hlaWdodC1wYXJzZUludCh5KSkgKiBuZXdXaWR0aCAqIDQgKyBwYXJzZUludCh4KSAqIDQpO1xyXG4gICAgcmV0dXJuIG5ldyBjYy5jb2xvcih0aGlzLl9waXhlbHNbaWR4XSx0aGlzLl9waXhlbHNbaWR4ICsgMV0sdGhpcy5fcGl4ZWxzW2lkeCArIDJdKTtcclxufTtcclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgc2tldGNoSW1nOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLHR5cGU6Y2MuTm9kZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVmZXJlbmNlSW1nOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLHR5cGU6Y2MuTm9kZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVzdWx0SW1nOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLHR5cGU6Y2MuTm9kZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY29sb3JJbWc6e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsdHlwZTpjYy5Ob2RlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBmbGFnOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLHR5cGU6Y2MuTm9kZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaGludDp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCx0eXBlOmNjLk5vZGVcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJ0bjp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCx0eXBlOmNjLk5vZGVcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlbm9pc2U6e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsdHlwZTpjYy5Ob2RlXHJcbiAgICAgICAgfSxcclxuICAgICAgICB3ZWxjb21lOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLHR5cGU6Y2MuTm9kZVxyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBvblYxOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZlcnNpb24gPSAxO1xyXG4gICAgICAgIHRoaXMub25DbGVhckNsaWNrZWQoKTtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIG9uVjI6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmVyc2lvbiA9IDI7XHJcbiAgICAgICAgdGhpcy5vbkNsZWFyQ2xpY2tlZCgpO1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgb25WMzogZnVuY3Rpb24oKXtcclxuICAgICAgICB2ZXJzaW9uID0gMztcclxuICAgICAgICB0aGlzLm9uQ2xlYXJDbGlja2VkKCk7XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBvblY0OiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZlcnNpb24gPSA0O1xyXG4gICAgICAgIHRoaXMub25DbGVhckNsaWNrZWQoKTtcclxuICAgIH0sXHJcblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY2MuZGlyZWN0b3Iuc2V0Q2xlYXJDb2xvcihjYy5jb2xvcigwLCAwLCAwLCAwKSlcclxuICAgICAgICBcclxuICAgICAgICBzcFNrZXRjaEltZyA9IHRoaXMuc2tldGNoSW1nLmdldENvbXBvbmVudCgnY2MuU3ByaXRlJyk7XHJcbiAgICAgICAgc3BSZWZlcmVuZUltZyA9IHRoaXMucmVmZXJlbmNlSW1nLmdldENvbXBvbmVudCgnY2MuU3ByaXRlJyk7XHJcbiAgICAgICAgc3BSZXN1bHRJbWcgPSB0aGlzLnJlc3VsdEltZy5nZXRDb21wb25lbnQoJ2NjLlNwcml0ZScpO1xyXG4gICAgICAgIHNwQ29sb3JJbWcgPSB0aGlzLmNvbG9ySW1nLmdldENvbXBvbmVudCgnY2MuU3ByaXRlJyk7XHJcbiAgICAgICAgc3BIaW50Tm9kZSA9IHRoaXMuaGludDtcclxuICAgICAgICBzcEJUTiA9IHRoaXMuYnRuLmdldENvbXBvbmVudCgnY2MuQnV0dG9uJyk7XHJcbiAgICAgICAgc3BMQUIgPSB0aGlzLmJ0bi5nZXRDb21wb25lbnQoJ2NjLlJpY2hUZXh0Jyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZmlsZUlucHV0Rm9yU2tldGNoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICAgIGZpbGVJbnB1dEZvclNrZXRjaC5pZCA9IFwiZmlsZUlucHV0Rm9yU2tldGNoXCI7XHJcbiAgICAgICAgZmlsZUlucHV0Rm9yU2tldGNoLnR5cGUgPSBcImZpbGVcIjtcclxuICAgICAgICBmaWxlSW5wdXRGb3JTa2V0Y2guYWNjZXB0ID0gXCJpbWFnZS8qXCI7XHJcbiAgICAgICAgZmlsZUlucHV0Rm9yU2tldGNoLnN0eWxlLmhlaWdodCA9IFwiMHB4XCI7XHJcbiAgICAgICAgZmlsZUlucHV0Rm9yU2tldGNoLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICAgICAgZmlsZUlucHV0Rm9yU2tldGNoLnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcclxuICAgICAgICBkb2N1bWVudC5ib2R5Lmluc2VydEJlZm9yZShmaWxlSW5wdXRGb3JTa2V0Y2gsZG9jdW1lbnQuYm9keS5maXJzdENoaWxkKTtcclxuICAgICAgICBmaWxlSW5wdXRGb3JTa2V0Y2guYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgb25Ta2V0Y2hGaWxlU2VsZWN0ZWQsIGZhbHNlKTtcclxuICAgICAgICBcclxuICAgICAgICBmaWxlSW5wdXRGb3JSZWZlcmVuZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgICBmaWxlSW5wdXRGb3JSZWZlcmVuZS5pZCA9IFwiZmlsZUlucHV0Rm9yUmVmZXJlbmVcIjtcclxuICAgICAgICBmaWxlSW5wdXRGb3JSZWZlcmVuZS50eXBlID0gXCJmaWxlXCI7XHJcbiAgICAgICAgZmlsZUlucHV0Rm9yUmVmZXJlbmUuYWNjZXB0ID0gXCJpbWFnZS8qXCI7XHJcbiAgICAgICAgZmlsZUlucHV0Rm9yUmVmZXJlbmUuc3R5bGUuaGVpZ2h0ID0gXCIwcHhcIjtcclxuICAgICAgICBmaWxlSW5wdXRGb3JSZWZlcmVuZS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgICAgIGZpbGVJbnB1dEZvclJlZmVyZW5lLnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcclxuICAgICAgICBkb2N1bWVudC5ib2R5Lmluc2VydEJlZm9yZShmaWxlSW5wdXRGb3JSZWZlcmVuZSxkb2N1bWVudC5ib2R5LmZpcnN0Q2hpbGQpO1xyXG4gICAgICAgIGZpbGVJbnB1dEZvclJlZmVyZW5lLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIG9uUmVmZXJlbmVGaWxlU2VsZWN0ZWQsIGZhbHNlKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm5vZGUub24oXCJtb3VzZW1vdmVcIiwgZnVuY3Rpb24gKGV2ZW50KSB7IFxyXG4gICAgICAgICAgICBtb3VzZVBvc2l0aW9uID0gZXZlbnQuZ2V0TG9jYXRpb24oKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm5vZGUub24oXCJtb3VzZWRvd25cIiwgZnVuY3Rpb24gKGV2ZW50KSB7IFxyXG4gICAgICAgICAgICBtb3VzZUlzRG93biA9IHRydWU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKFwibW91c2V1cFwiLCBmdW5jdGlvbiAoZXZlbnQpIHsgXHJcbiAgICAgICAgICAgIGdldE1vdXNlRG93biA9IHRydWU7XHJcbiAgICAgICAgICAgIG1vdXNlSXNEb3duID0gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgSFRNTF9DYW52YXNfaGludCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcbiAgICAgICAgSFRNTF9DYW52YXNfaGludC5pZCA9IFwiSFRNTF9DYW52YXNfaGludFwiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIEhUTUxfQ2FudmFzX3JlZmVyZW5jZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcbiAgICAgICAgSFRNTF9DYW52YXNfcmVmZXJlbmNlLmlkID0gXCJIVE1MX0NhbnZhc19yZWZlcmVuY2VcIjtcclxuICAgICAgICBcclxuICAgICAgICBIVE1MX0NhbnZhc19za2V0Y2ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG4gICAgICAgIEhUTUxfQ2FudmFzX3NrZXRjaC5pZCA9IFwiSFRNTF9DYW52YXNfc2tldGNoXCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICBcclxuICAgIH0sXHJcbiAgICBcclxuICAgIG9uU2tldGNoQ2xpY2tlZDogZnVuY3Rpb24oKXtcclxuICAgICAgICBmaWxlSW5wdXRGb3JTa2V0Y2guY2xpY2soKTtcclxuICAgIH0sXHJcbiAgICBvblJlZmVuY2VDbGlja2VkOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIGZpbGVJbnB1dEZvclJlZmVyZW5lLmNsaWNrKCk7XHJcbiAgICB9LFxyXG4gICAgb25QZW5DbGlja2VkOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIGlzUGVuID0gdHJ1ZTtcclxuICAgIH0sXHJcbiAgICBvbkVyYXNlckNsaWNrZWQ6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgaXNQZW4gPSBmYWxzZTtcclxuICAgIH0sXHJcbiAgICBvbkNsZWFyQ2xpY2tlZDogZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgY3h0PUhUTUxfQ2FudmFzX2hpbnQuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5cdCAgICBjeHQuY2xlYXJSZWN0KDAsMCxIVE1MX0NhbnZhc19oaW50LndpZHRoLEhUTUxfQ2FudmFzX2hpbnQuaGVpZ2h0KTtcclxuICAgICAgICB2YXIgaGludE5vZGVUZXggPSBzcEhpbnROb2RlLmdldENvbXBvbmVudCgnY2MuU3ByaXRlJykuc3ByaXRlRnJhbWUuZ2V0VGV4dHVyZSgpO1xyXG5cdFx0aGludE5vZGVUZXguaW5pdFdpdGhFbGVtZW50KEhUTUxfQ2FudmFzX2hpbnQpO1xyXG5cdFx0aGludE5vZGVUZXguaGFuZGxlTG9hZGVkVGV4dHVyZSgpO1xyXG4gICAgfSxcclxuICAgIG9uQ29sb3JpemVDbGlja2VkOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIGlmKCFoYXNSZWYpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCFoYXNTa2V0Y2gpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHNwUmVzdWx0SW1nLm5vZGUud2lkdGggPSAwO1xyXG4gICAgICAgIHNwUmVzdWx0SW1nLm5vZGUuaGVpZ2h0ID0gMDtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgaGludERhdGFVUkwgPSBIVE1MX0NhbnZhc19oaW50LnRvRGF0YVVSTChcImltYWdlL3BuZ1wiKTtcclxuICAgICAgICB2YXIgcmVmZXJlbmNlRGF0YVVSTCA9IEhUTUxfQ2FudmFzX3JlZmVyZW5jZS50b0RhdGFVUkwoXCJpbWFnZS9wbmdcIik7XHJcbiAgICAgICAgdmFyIHNrZXRjaERhdGFVUkwgPSBIVE1MX0NhbnZhc19za2V0Y2gudG9EYXRhVVJMKFwiaW1hZ2UvcG5nXCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICB4aHIub3BlbihcIlBPU1RcIiwgXCIvcGFpbnRcIiwgdHJ1ZSk7XHJcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIixcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtcIik7XHJcbiAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBsb2FkTG9jYWxSZXN1bHQoeGhyLnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB4aHIuc2VuZFxyXG4gICAgICAgICAgICAoXHJcbiAgICAgICAgICAgIFwic2tldGNoPVwiK2VuY29kZVVSSUNvbXBvbmVudChza2V0Y2hEYXRhVVJMKStcclxuICAgICAgICAgICAgXCImcmVmZXJlbmNlPVwiK2VuY29kZVVSSUNvbXBvbmVudChyZWZlcmVuY2VEYXRhVVJMKStcclxuICAgICAgICAgICAgXCImaGludD1cIitlbmNvZGVVUklDb21wb25lbnQoaGludERhdGFVUkwpK1xyXG4gICAgICAgICAgICBcIiZ2ZXJzaW9uPVwiK3ZlcnNpb24udG9TdHJpbmcoKStcclxuICAgICAgICAgICAgXCImZGVub2lzZT1cIit0aGlzLmRlbm9pc2UuZ2V0Q29tcG9uZW50KCdjYy5Ub2dnbGUnKS5pc0NoZWNrZWQudG9TdHJpbmcoKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIHNwQlROLmVuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICBzcExBQi5zdHJpbmcgPSBcIldhaXRpbmdcIjtcclxuICAgICAgICB0aGlzLndlbGNvbWUuYWN0aXZlID0gZmFsc2U7XHJcbiAgICB9LFxyXG4gICAgb25Eb3dubG9hZENsaWNrZWQ6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgaWYocmVzdWx0VVJMPT1cIlwiKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3aW5kb3cub3BlbihyZXN1bHRVUkwpO1xyXG4gICAgfSxcclxuICAgIGhhbmRsZVBhaW50ZXI6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgcGFpbnRpbmcgPSBmYWxzZTtcclxuICAgICAgICB2YXIgcmVsYXRpdmVYID0gMDtcclxuICAgICAgICB2YXIgcmVsYXRpdmVZID0gMDtcclxuICAgICAgICB2YXIgcmVmUG9zaXRpb24gPSBzcFNrZXRjaEltZy5ub2RlLmNvbnZlcnRUb1dvcmxkU3BhY2Uoc3BTa2V0Y2hJbWcubm9kZS5wb3NpdGlvbik7XHJcbiAgICAgICAgaWYocmVmUG9zaXRpb24gIT0gbnVsbCAmJiBtb3VzZVBvc2l0aW9uICE9IG51bGwpe1xyXG4gICAgICAgICAgICB2YXIgYmVnaW5YID0gcmVmUG9zaXRpb24ueCAtIDI1NjtcclxuICAgICAgICAgICAgdmFyIGJlZ2luWSA9IHJlZlBvc2l0aW9uLnkgLSAyNTY7XHJcbiAgICAgICAgICAgIHJlbGF0aXZlWCA9IG1vdXNlUG9zaXRpb24ueCAtIGJlZ2luWDtcclxuICAgICAgICAgICAgcmVsYXRpdmVZID0gbW91c2VQb3NpdGlvbi55IC0gYmVnaW5ZO1xyXG4gICAgICAgICAgICB2YXIgbW91c2VJblNrZXRjaCA9IChyZWxhdGl2ZVggPiAwICYmIHJlbGF0aXZlWSA+IDAgJiYgcmVsYXRpdmVYIDwgc3BTa2V0Y2hJbWcubm9kZS53aWR0aCAmJiByZWxhdGl2ZVkgPCBzcFNrZXRjaEltZy5ub2RlLmhlaWdodCk7XHJcbiAgICAgICAgICAgIGlmKG1vdXNlSW5Ta2V0Y2gpe1xyXG4gICAgICAgICAgICAgICAgcGFpbnRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHBhaW50aW5nKXtcclxuICAgICAgICAgICAgaWYobW91c2VJc0Rvd24pe1xyXG4gICAgICAgICAgICAgICAgdmFyIGN4dD1IVE1MX0NhbnZhc19oaW50LmdldENvbnRleHQoXCIyZFwiKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYoaXNQZW4pe1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwZW4gPSA2IC0gdmVyc2lvbjtcclxuICAgICAgICAgICAgICAgICAgICBjeHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY3h0LmFyYyhwYXJzZUludChwYXJzZUZsb2F0KHJlbGF0aXZlWCkgLyBwYXJzZUZsb2F0KHNwSGludE5vZGUud2lkdGgpICogcGFyc2VGbG9hdChIVE1MX0NhbnZhc19oaW50LndpZHRoKSksIHBhcnNlSW50KHBhcnNlRmxvYXQoc3BIaW50Tm9kZS5oZWlnaHQgLSByZWxhdGl2ZVkpIC8gcGFyc2VGbG9hdChzcEhpbnROb2RlLmhlaWdodCkgKiBwYXJzZUZsb2F0KEhUTUxfQ2FudmFzX2hpbnQuaGVpZ2h0KSksIHBlbiwgMCwgTWF0aC5QSSAqIDIsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGN4dC5jbG9zZVBhdGgoKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY29sb3IgPSBzcENvbG9ySW1nLm5vZGUuY29sb3JcclxuICAgICAgICAgICAgICAgICAgICBjeHQuZmlsbFN0eWxlID0gJ3JnYmEoJytjb2xvci5yLnRvU3RyaW5nKCkrJywnK2NvbG9yLmcudG9TdHJpbmcoKSsnLCcrY29sb3IuYi50b1N0cmluZygpKycsMC42MTgpJztcclxuICAgICAgICAgICAgICAgICAgICBjeHQuZmlsbCgpO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGN4dD1IVE1MX0NhbnZhc19oaW50LmdldENvbnRleHQoXCIyZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBjeHQuY2xlYXJSZWN0KHBhcnNlSW50KHBhcnNlRmxvYXQocmVsYXRpdmVYKSAvIHBhcnNlRmxvYXQoc3BIaW50Tm9kZS53aWR0aCkgKiBwYXJzZUZsb2F0KEhUTUxfQ2FudmFzX2hpbnQud2lkdGgpKSAtIDEwLCBwYXJzZUludChwYXJzZUZsb2F0KHNwSGludE5vZGUuaGVpZ2h0IC0gcmVsYXRpdmVZKSAvIHBhcnNlRmxvYXQoc3BIaW50Tm9kZS5oZWlnaHQpICogcGFyc2VGbG9hdChIVE1MX0NhbnZhc19oaW50LmhlaWdodCkpIC0gMTAsMjAsMjApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB2YXIgaGludE5vZGVUZXggPSBzcEhpbnROb2RlLmdldENvbXBvbmVudCgnY2MuU3ByaXRlJykuc3ByaXRlRnJhbWUuZ2V0VGV4dHVyZSgpO1xyXG4gICAgICAgICAgICAgICAgaGludE5vZGVUZXguaW5pdFdpdGhFbGVtZW50KEhUTUxfQ2FudmFzX2hpbnQpO1xyXG4gICAgICAgICAgICAgICAgaGludE5vZGVUZXguaGFuZGxlTG9hZGVkVGV4dHVyZSh0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBoYW5kbGVDb2xvclBpY2tlcjogZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgcmVmUG9zaXRpb24gPSBzcFJlZmVyZW5lSW1nLm5vZGUuY29udmVydFRvV29ybGRTcGFjZShzcFJlZmVyZW5lSW1nLm5vZGUucG9zaXRpb24pO1xyXG4gICAgICAgICAgICBpZihyZWZQb3NpdGlvbiAhPSBudWxsICYmIG1vdXNlUG9zaXRpb24gIT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgICB2YXIgYmVnaW5YID0gcmVmUG9zaXRpb24ueDtcclxuICAgICAgICAgICAgICAgIHZhciBiZWdpblkgPSByZWZQb3NpdGlvbi55O1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlbGF0aXZlWCA9IG1vdXNlUG9zaXRpb24ueCAtIGJlZ2luWDtcclxuICAgICAgICAgICAgICAgIHZhciByZWxhdGl2ZVkgPSBtb3VzZVBvc2l0aW9uLnkgLSBiZWdpblk7XHJcbiAgICAgICAgICAgICAgICBtb3VzZUluUmVmZXJlbmNlID0gKHJlbGF0aXZlWCA+IDAgJiYgcmVsYXRpdmVZID4gMCAmJiByZWxhdGl2ZVggPCBzcFJlZmVyZW5lSW1nLm5vZGUud2lkdGggJiYgcmVsYXRpdmVZIDwgc3BSZWZlcmVuZUltZy5ub2RlLmhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICBpZihtb3VzZUluUmVmZXJlbmNlKXtcclxuICAgICAgICAgICAgICAgICAgICBpZighcHJlTW91c2VJblJlZil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGluZ0NvbG9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoZ2V0TW91c2VEb3duKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoc2VsZWN0aW5nQ29sb3Ipe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZsYWcueCA9IHJlbGF0aXZlWCAtIHNwUmVmZXJlbmVJbWcubm9kZS53aWR0aCAvIDI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmxhZy55ID0gcmVsYXRpdmVZIC0gc3BSZWZlcmVuZUltZy5ub2RlLmhlaWdodCAvIDI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsWCA9IHJlbGF0aXZlWDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxZID0gcmVsYXRpdmVZO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc1BlbiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBpZihzZWxlY3RpbmdDb2xvcil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGluZ0NvbG9yID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZXh0dXJlID0gc3BSZWZlcmVuZUltZy5zcHJpdGVGcmFtZS5nZXRUZXh0dXJlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwQ29sb3JJbWcubm9kZS5jb2xvciA9IHNwUmVmZXJlbmVJbWcuc3ByaXRlRnJhbWUuZ2V0VGV4dHVyZSgpLmdldFBpeGVscyhmaW5hbFgsZmluYWxZLHNwUmVmZXJlbmVJbWcubm9kZS53aWR0aCxzcFJlZmVyZW5lSW1nLm5vZGUuaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZihzZWxlY3RpbmdDb2xvcil7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRleHR1cmUgPSBzcFJlZmVyZW5lSW1nLnNwcml0ZUZyYW1lLmdldFRleHR1cmUoKTtcclxuICAgICAgICAgICAgICAgICAgICBzcENvbG9ySW1nLm5vZGUuY29sb3IgPSBzcFJlZmVyZW5lSW1nLnNwcml0ZUZyYW1lLmdldFRleHR1cmUoKS5nZXRQaXhlbHMocmVsYXRpdmVYLHJlbGF0aXZlWSxzcFJlZmVyZW5lSW1nLm5vZGUud2lkdGgsc3BSZWZlcmVuZUltZy5ub2RlLmhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgIH0sXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG4gICAgICAgIGlmKGxvYWRlZCl7XHJcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlQ29sb3JQaWNrZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5oYW5kbGVQYWludGVyKCk7XHJcbiAgICAgICAgICAgIGlmKHNlbGVjdGluZ0NvbG9yKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmN1cnNvcj0nY3Jvc3NoYWlyJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKHBhaW50aW5nKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmN1cnNvcj0nY3Jvc3NoYWlyJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuY3Vyc29yPSdkZWZhdWx0JztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcmVNb3VzZUluUmVmID0gbW91c2VJblJlZmVyZW5jZTtcclxuICAgICAgICBnZXRNb3VzZURvd24gPSBmYWxzZTtcclxuICAgIH0sXHJcbn0pO1xyXG4iLCJjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgdXJsOntcclxuICAgICAgICAgICAgZGVmYXVsdDpcIlwiLHR5cGU6U3RyaW5nXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBvbk9wZW46IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB3aW5kb3cub3Blbih0aGlzLnVybCk7XHJcbiAgICB9LFxyXG59KTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==