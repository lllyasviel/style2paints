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

        var hintDataURL = HTML_Canvas_hint.toDataURL("image/png");
        var referenceDataURL = HTML_Canvas_reference.toDataURL("image/png");
        var sketchDataURL = HTML_Canvas_sketch.toDataURL("image/png");

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/paint", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
        xhr.onreadystatechange = function () {
            loadLocalResult(xhr.responseText);
            spBTN.enabled = true;
            spLAB.string = "<u>colorize</u>";
        };
        xhr.send("sketch=" + encodeURIComponent(sketchDataURL) + "&reference=" + encodeURIComponent(referenceDataURL) + "&hint=" + encodeURIComponent(hintDataURL) + "&version=" + version.toString());
        spBTN.enabled = false;
        spLAB.string = "Waiting";
    },
    onDownloadClicked: function onDownloadClicked() {
        if (resultURL == "") {
            return;
        }
        window.open(resultURL);
    },
    onTitle: function onTitle() {
        window.open('https://github.com/lllyasviel/style2paints', 'gitHub');
    },
    onHelp: function onHelp() {
        window.open('https://github.com/lllyasviel/style2paints/issues/12', 'gitHub');
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
},{}]},{},["Controller"])

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvQ29udHJvbGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNJO0FBSUg7O0FBRUQ7QUFDSTtBQUNIOztBQUVEO0FBQ0k7QUFDSDs7QUFFRDtBQUNJO0FBQ0g7QUFDSTtBQUNHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNOO0FBQ0Q7QUFDRzs7QUFFSTtBQUNOO0FBQ0E7QUFFSTtBQUNBO0FBQ0g7QUFHRztBQUNBO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBO0FBRUk7QUFDQTtBQUNIO0FBR0c7QUFDQTtBQUNIOztBQUVEO0FBQ0E7QUFDQTtBQUNNOztBQUVBO0FBQ0E7O0FBRUE7QUFDTjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDTTtBQUNBO0FBQ0E7QUFDQTs7QUFFTjtBQUNHO0FBQ0o7QUFDQTs7QUFFRDtBQUNJO0FBQ0g7QUFDSTtBQUNHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNOO0FBQ0Q7QUFDRzs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7QUFDRztBQUNJO0FBQ0g7QUFDSjs7QUFFRDtBQUNJO0FBRUk7QUFDQTtBQUNIO0FBR0c7QUFDQTtBQUNIO0FBQ0o7O0FBRUQ7QUFDQTtBQUNHO0FBQ0o7QUFDQTtBQUNBOztBQUVEO0FBQ0k7QUFDSDtBQUNJO0FBQ0c7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ047QUFDRDtBQUNHOztBQUVJO0FBQ047QUFDQTtBQUNNOztBQUVOO0FBRUk7QUFDQTtBQUNIO0FBR0c7QUFDQTtBQUNIOztBQUVLO0FBQ047O0FBRUE7QUFDQTtBQUNBO0FBRUk7QUFDQTtBQUNIO0FBR0c7QUFDQTtBQUNIOztBQUVEO0FBQ0E7QUFDQTtBQUNBOztBQUVNO0FBQ0g7O0FBRUc7QUFDTjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNHO0FBQ0o7QUFDQTs7QUFFRDtBQUNBO0FBQ0k7QUFDQTtBQUNIOztBQUVEO0FBQ0k7O0FBRUE7QUFDSTtBQUNJO0FBRE07QUFHVjtBQUNJO0FBRFM7QUFHYjtBQUNJO0FBRE07QUFHVjtBQUNJO0FBREs7QUFHVDtBQUNJO0FBREM7QUFHTDtBQUNJO0FBREM7QUFHTDtBQUNJO0FBREE7QUFuQkk7O0FBd0JaO0FBQ0k7QUFDQTtBQUNIOztBQUVEO0FBQ0k7QUFDQTtBQUNIOztBQUVEO0FBQ0k7QUFDQTtBQUNIOztBQUVEO0FBQ0k7QUFDQTtBQUNIOztBQUVEOztBQUVJOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTtBQUNIOztBQUVEO0FBQ0k7QUFDSDs7QUFFRDtBQUNJO0FBQ0E7QUFDSDs7QUFFRDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUVIOztBQUVEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNHO0FBQ047QUFDQTtBQUNHO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQU9BO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRztBQUNBO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBO0FBQ0g7QUFDSjtBQUNKO0FBQ0Q7QUFDSTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQztBQUNKO0FBQ0o7QUFDRztBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNKO0FBQ1I7QUFDRDtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBRUk7QUFDSDtBQUdHO0FBQ0g7QUFHRztBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0g7QUFqUUkiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgc3BTa2V0Y2hJbWc7XHJcbnZhciBzcFJlZmVyZW5lSW1nO1xyXG52YXIgc3BSZXN1bHRJbWc7XHJcbnZhciBzcENvbG9ySW1nO1xyXG52YXIgc3BIaW50Tm9kZTtcclxudmFyIHNwQlROO1xyXG52YXIgc3BMQUI7XHJcblxyXG52YXIgZmlsZUlucHV0Rm9yU2tldGNoO1xyXG52YXIgZmlsZUlucHV0Rm9yUmVmZXJlbmU7XHJcblxyXG52YXIgbW91c2VQb3NpdGlvbjtcclxudmFyIG1vdXNlSW5SZWZlcmVuY2UgPSBmYWxzZTtcclxuXHJcbnZhciBsb2FkZWQgPSBmYWxzZTtcclxuXHJcbnZhciBnZXRNb3VzZURvd24gPSBmYWxzZTtcclxudmFyIHByZU1vdXNlSW5SZWYgPSBmYWxzZTtcclxudmFyIHNlbGVjdGluZ0NvbG9yID0gZmFsc2U7XHJcbnZhciBwYWludGluZyA9IGZhbHNlO1xyXG52YXIgZmluYWxYPTA7XHJcbnZhciBmaW5hbFk9MDtcclxuXHJcbnZhciBoYXNTa2V0Y2g9ZmFsc2U7XHJcbnZhciBoYXNSZWY9ZmFsc2U7XHJcblxyXG52YXIgSFRNTF9DYW52YXNfc2tldGNoO1xyXG52YXIgSFRNTF9DYW52YXNfcmVmZXJlbmNlO1xyXG52YXIgSFRNTF9DYW52YXNfaGludDtcclxuXHJcbnZhciBpc1BlbiA9IHRydWU7XHJcblxyXG52YXIgbW91c2VJc0Rvd24gPSBmYWxzZTtcclxuXHJcbnZhciByZXN1bHRVUkwgPSBcIlwiO1xyXG5cclxudmFyIHZlcnNpb24gPSAyO1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlT2JqZWN0VVJMKGJsb2Ipe1xyXG4gICAgaWYod2luZG93LlVSTCAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgIHJldHVybiB3aW5kb3dbJ1VSTCddWydjcmVhdGVPYmplY3RVUkwnXShibG9iKTtcclxuICAgIGVsc2VcclxuICAgICAgICByZXR1cm4gd2luZG93Wyd3ZWJraXRVUkwnXVsnY3JlYXRlT2JqZWN0VVJMJ10oYmxvYik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9uU2tldGNoRmlsZVNlbGVjdGVkKGV2dCkge1xyXG4gICAgbG9hZExvY2FsU2tldGNoKGNyZWF0ZU9iamVjdFVSTChldnQudGFyZ2V0LmZpbGVzWzBdKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9uUmVmZXJlbmVGaWxlU2VsZWN0ZWQoZXZ0KSB7XHJcbiAgICBsb2FkTG9jYWxSZWZlcmVuY2UoY3JlYXRlT2JqZWN0VVJMKGV2dC50YXJnZXQuZmlsZXNbMF0pKTtcclxufVxyXG5cclxuZnVuY3Rpb24gbG9hZExvY2FsUmVmZXJlbmNlKHVyaSl7XHJcbiAgICB2YXIgdGVtcERpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGVtcERpdlJlZmVyZW5jZVwiKTtcclxuXHRpZih0ZW1wRGl2PT09bnVsbCl7XHJcblx0ICAgIHZhciB0ZW1wRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRlbXBEaXYpO1xyXG4gICAgICAgIHRlbXBEaXYuc3R5bGUucG9zaXRpb249XCJhYnNvbHV0ZVwiO1xyXG4gICAgICAgIHRlbXBEaXYuaWQ9XCJ0ZW1wRGl2UmVmZXJlbmNlXCI7XHJcbiAgICAgICAgdGVtcERpdi5pbm5lckhUTUwgPSAnPGltZyBpZD1pbWdoZWFkUmVmZXJlbmNlPic7XHJcbiAgICAgICAgdGVtcERpdi5zdHlsZS5kaXNwbGF5PSdub25lJztcclxuICAgICAgICB0ZW1wRGl2LnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xyXG5cdH1cclxuXHR2YXIgaW1nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ltZ2hlYWRSZWZlcmVuY2UnKTtcclxuICAgIGltZy5vbmxvYWQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciB3XzIyNCA9IHBhcnNlRmxvYXQodGhpcy53aWR0aCk7XHJcblx0XHR2YXIgaF8yMjQgPSBwYXJzZUZsb2F0KHRoaXMuaGVpZ2h0KTtcclxuXHRcdGlmKHdfMjI0ID4gaF8yMjQpXHJcblx0XHR7XHJcblx0XHQgICAgd18yMjQgPSAyMjQuMCAvIGhfMjI0ICogd18yMjQ7XHJcblx0XHQgICAgaF8yMjQgPSAyMjQuMDtcclxuXHRcdH1cclxuXHRcdGVsc2VcclxuXHRcdHtcclxuXHRcdCAgICBoXzIyNCA9IDIyNC4wIC8gd18yMjQgKiBoXzIyNDtcclxuXHRcdCAgICB3XzIyNCA9IDIyNC4wO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR2YXIgd18yMDAgPSBwYXJzZUZsb2F0KHRoaXMud2lkdGgpO1xyXG5cdFx0dmFyIGhfMjAwID0gcGFyc2VGbG9hdCh0aGlzLmhlaWdodCk7XHJcblx0XHRpZih3XzIwMCA8IGhfMjAwKVxyXG5cdFx0e1xyXG5cdFx0ICAgIHdfMjAwID0gMjAwLjAgLyBoXzIwMCAqIHdfMjAwO1xyXG5cdFx0ICAgIGhfMjAwID0gMjAwLjA7XHJcblx0XHR9XHJcblx0XHRlbHNlXHJcblx0XHR7XHJcblx0XHQgICAgaF8yMDAgPSAyMDAuMCAvIHdfMjAwICogaF8yMDA7XHJcblx0XHQgICAgd18yMDAgPSAyMDAuMDtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0c3BSZWZlcmVuZUltZy5ub2RlLndpZHRoID0gcGFyc2VJbnQod18yMDApO1xyXG5cdFx0c3BSZWZlcmVuZUltZy5ub2RlLmhlaWdodCA9IHBhcnNlSW50KGhfMjAwKTtcclxuXHRcdEhUTUxfQ2FudmFzX3JlZmVyZW5jZS53aWR0aCA9IHBhcnNlSW50KHdfMjI0KTtcclxuICAgICAgICBIVE1MX0NhbnZhc19yZWZlcmVuY2UuaGVpZ2h0ID0gcGFyc2VJbnQoaF8yMjQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIEhUTUxfQ2FudmFzX3JlZmVyZW5jZS5nZXRDb250ZXh0KFwiMmRcIikuZHJhd0ltYWdlKHRoaXMsIDAsIDAsIEhUTUxfQ2FudmFzX3JlZmVyZW5jZS53aWR0aCwgSFRNTF9DYW52YXNfcmVmZXJlbmNlLmhlaWdodCk7XHJcbiAgICAgICAgSFRNTF9DYW52YXNfaGludC5nZXRDb250ZXh0KFwiMmRcIikuY2xlYXJSZWN0KDAsMCxIVE1MX0NhbnZhc19oaW50LndpZHRoLEhUTUxfQ2FudmFzX2hpbnQuaGVpZ2h0KTtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgcmVmZXJlbmNlTm9kZVRleHR1cmUgPSBzcFJlZmVyZW5lSW1nLnNwcml0ZUZyYW1lLmdldFRleHR1cmUoKTtcclxuXHRcdHZhciBoaW50Tm9kZVRleHR1cmUgPSBzcEhpbnROb2RlLmdldENvbXBvbmVudCgnY2MuU3ByaXRlJykuc3ByaXRlRnJhbWUuZ2V0VGV4dHVyZSgpO1xyXG4gICAgICAgIFxyXG5cdFx0aGludE5vZGVUZXh0dXJlLmluaXRXaXRoRWxlbWVudChIVE1MX0NhbnZhc19oaW50KTtcclxuXHRcdGhpbnROb2RlVGV4dHVyZS5oYW5kbGVMb2FkZWRUZXh0dXJlKCk7XHJcblx0XHRcclxuXHRcdHJlZmVyZW5jZU5vZGVUZXh0dXJlLmluaXRXaXRoRWxlbWVudChIVE1MX0NhbnZhc19yZWZlcmVuY2UpO1xyXG5cdFx0cmVmZXJlbmNlTm9kZVRleHR1cmUuaGFuZGxlTG9hZGVkVGV4dHVyZSgpO1xyXG5cdFx0XHJcblx0XHR2YXIgdGVtcENhbnZhc18yMDAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG4gICAgICAgIHRlbXBDYW52YXNfMjAwLndpZHRoID0gcGFyc2VJbnQod18yMDApO1xyXG4gICAgICAgIHRlbXBDYW52YXNfMjAwLmhlaWdodCA9IHBhcnNlSW50KGhfMjAwKTtcclxuICAgICAgICB0ZW1wQ2FudmFzXzIwMC5nZXRDb250ZXh0KFwiMmRcIikuZHJhd0ltYWdlKHRoaXMsIDAsIDAsIHRlbXBDYW52YXNfMjAwLndpZHRoLCB0ZW1wQ2FudmFzXzIwMC5oZWlnaHQpO1xyXG4gICAgICAgIHJlZmVyZW5jZU5vZGVUZXh0dXJlLl9waXhlbHMgPSB0ZW1wQ2FudmFzXzIwMC5nZXRDb250ZXh0KFwiMmRcIikuZ2V0SW1hZ2VEYXRhKDAsIDAsIHRlbXBDYW52YXNfMjAwLndpZHRoLCB0ZW1wQ2FudmFzXzIwMC5oZWlnaHQpLmRhdGE7XHJcblx0XHRcclxuXHRcdGhhc1JlZiA9IHRydWU7XHJcbiAgICB9XHJcblx0aW1nLnNyYyA9IHVyaTtcclxufVxyXG5cclxuZnVuY3Rpb24gbG9hZExvY2FsUmVzdWx0KHVyaSl7XHJcbiAgICB2YXIgdGVtcERpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGVtcERpdlJlc3VsdFwiKTtcclxuXHRpZih0ZW1wRGl2PT09bnVsbCl7XHJcblx0ICAgIHZhciB0ZW1wRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRlbXBEaXYpO1xyXG4gICAgICAgIHRlbXBEaXYuc3R5bGUucG9zaXRpb249XCJhYnNvbHV0ZVwiO1xyXG4gICAgICAgIHRlbXBEaXYuaWQ9XCJ0ZW1wRGl2UmVzdWx0XCI7XHJcbiAgICAgICAgdGVtcERpdi5pbm5lckhUTUwgPSAnPGltZyBpZD1pbWdoZWFkUmVzdWx0Pic7XHJcbiAgICAgICAgdGVtcERpdi5zdHlsZS5kaXNwbGF5PSdub25lJztcclxuICAgICAgICB0ZW1wRGl2LnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xyXG5cdH1cclxuXHR2YXIgaW1nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ltZ2hlYWRSZXN1bHQnKTtcclxuICAgIGltZy5vbmxvYWQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIFxyXG5cdFx0dmFyIHRleHR1cmUgPSBzcFJlc3VsdEltZy5zcHJpdGVGcmFtZS5nZXRUZXh0dXJlKCk7XHJcblx0XHR0ZXh0dXJlLmluaXRXaXRoRWxlbWVudCh0aGlzKTtcclxuXHRcdHRleHR1cmUuaGFuZGxlTG9hZGVkVGV4dHVyZSgpO1xyXG5cdFx0dmFyIHcgPSBwYXJzZUZsb2F0KHRoaXMud2lkdGgpO1xyXG5cdFx0dmFyIGggPSBwYXJzZUZsb2F0KHRoaXMuaGVpZ2h0KTtcclxuXHRcdFxyXG5cdFx0dmFyIHNtYWxsID0gdHJ1ZTtcclxuXHRcdFxyXG5cdFx0aWYodz5oKXtcclxuXHRcdCAgICBpZih3PjcyNCl7XHJcblx0XHQgICAgICAgIHNtYWxsID0gZmFsc2U7XHJcblx0XHQgICAgfVxyXG5cdFx0fWVsc2V7XHJcblx0XHQgICAgaWYoaD43MjQpe1xyXG5cdFx0ICAgICAgICBzbWFsbCA9IGZhbHNlO1xyXG5cdFx0ICAgIH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYoIXNtYWxsKXtcclxuXHRcdCAgICBpZih3PGgpXHJcblx0XHQgICAge1xyXG5cdFx0ICAgICAgICB3ID0gNzI0LjAgLyBoICogdztcclxuXHRcdCAgICAgICAgaCA9IDcyNC4wO1xyXG5cdFx0ICAgIH1cclxuXHRcdCAgICBlbHNlXHJcblx0XHQgICAge1xyXG5cdFx0ICAgICAgICBoID0gNzI0LjAgLyB3ICogaDtcclxuXHRcdCAgICAgICAgdyA9IDcyNC4wO1xyXG5cdFx0ICAgIH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0c3BSZXN1bHRJbWcubm9kZS53aWR0aCA9IHBhcnNlSW50KHcpO1xyXG5cdFx0c3BSZXN1bHRJbWcubm9kZS5oZWlnaHQgPSBwYXJzZUludChoKTtcclxuICAgIH1cclxuXHRpbWcuc3JjID0gdXJpO1xyXG5cdHJlc3VsdFVSTCA9IHVyaTtcclxufVxyXG5cclxuZnVuY3Rpb24gbG9hZExvY2FsU2tldGNoKHVyaSl7XHJcbiAgICB2YXIgdGVtcERpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGVtcERpdlNrZXRjaFwiKTtcclxuXHRpZih0ZW1wRGl2PT09bnVsbCl7XHJcblx0ICAgIHZhciB0ZW1wRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRlbXBEaXYpO1xyXG4gICAgICAgIHRlbXBEaXYuc3R5bGUucG9zaXRpb249XCJhYnNvbHV0ZVwiO1xyXG4gICAgICAgIHRlbXBEaXYuaWQ9XCJ0ZW1wRGl2U2tldGNoXCI7XHJcbiAgICAgICAgdGVtcERpdi5pbm5lckhUTUwgPSAnPGltZyBpZD1pbWdoZWFkU2tldGNoPic7XHJcbiAgICAgICAgdGVtcERpdi5zdHlsZS5kaXNwbGF5PSdub25lJztcclxuICAgICAgICB0ZW1wRGl2LnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xyXG5cdH1cclxuXHR2YXIgaW1nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ltZ2hlYWRTa2V0Y2gnKTtcclxuICAgIGltZy5vbmxvYWQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciB3ID0gcGFyc2VGbG9hdCh0aGlzLndpZHRoKTtcclxuXHRcdHZhciBoID0gcGFyc2VGbG9hdCh0aGlzLmhlaWdodCk7XHJcblx0XHRIVE1MX0NhbnZhc19za2V0Y2gud2lkdGggPSBwYXJzZUludCh3KTtcclxuICAgICAgICBIVE1MX0NhbnZhc19za2V0Y2guaGVpZ2h0ID0gcGFyc2VJbnQoaCk7XHJcbiAgICAgICAgXHJcblx0XHRpZih3ID4gaClcclxuXHRcdHtcclxuXHRcdCAgICB3ID0gNTEyLjAgLyBoICogdztcclxuXHRcdCAgICBoID0gNTEyLjA7XHJcblx0XHR9XHJcblx0XHRlbHNlXHJcblx0XHR7XHJcblx0XHQgICAgaCA9IDUxMi4wIC8gdyAqIGg7XHJcblx0XHQgICAgdyA9IDUxMi4wO1xyXG5cdFx0fVxyXG4gICAgICAgIFxyXG4gICAgICAgIEhUTUxfQ2FudmFzX2hpbnQud2lkdGggPSBwYXJzZUludCh3KTtcclxuXHRcdEhUTUxfQ2FudmFzX2hpbnQuaGVpZ2h0ID0gcGFyc2VJbnQoaCk7XHJcbiAgICAgICAgXHJcblx0XHR3ID0gcGFyc2VGbG9hdCh0aGlzLndpZHRoKTtcclxuXHRcdGggPSBwYXJzZUZsb2F0KHRoaXMuaGVpZ2h0KTtcclxuXHRcdGlmKHcgPCBoKVxyXG5cdFx0e1xyXG5cdFx0ICAgIHcgPSA1MTIuMCAvIGggKiB3O1xyXG5cdFx0ICAgIGggPSA1MTIuMDtcclxuXHRcdH1cclxuXHRcdGVsc2VcclxuXHRcdHtcclxuXHRcdCAgICBoID0gNTEyLjAgLyB3ICogaDtcclxuXHRcdCAgICB3ID0gNTEyLjA7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHNwU2tldGNoSW1nLm5vZGUud2lkdGggPSBwYXJzZUludCh3KTtcclxuXHRcdHNwU2tldGNoSW1nLm5vZGUuaGVpZ2h0ID0gcGFyc2VJbnQoaCk7XHJcblx0XHRzcEhpbnROb2RlLndpZHRoID0gcGFyc2VJbnQodyk7XHJcblx0XHRzcEhpbnROb2RlLmhlaWdodCA9IHBhcnNlSW50KGgpO1xyXG5cclxuICAgICAgICBIVE1MX0NhbnZhc19za2V0Y2guZ2V0Q29udGV4dChcIjJkXCIpLmRyYXdJbWFnZSh0aGlzLCAwLCAwLCBIVE1MX0NhbnZhc19za2V0Y2gud2lkdGgsIEhUTUxfQ2FudmFzX3NrZXRjaC5oZWlnaHQpO1xyXG5cdCAgICBIVE1MX0NhbnZhc19oaW50LmdldENvbnRleHQoXCIyZFwiKS5jbGVhclJlY3QoMCwwLEhUTUxfQ2FudmFzX2hpbnQud2lkdGgsSFRNTF9DYW52YXNfaGludC5oZWlnaHQpO1xyXG5cdCAgICBcclxuICAgICAgICB2YXIgaGludE5vZGVUZXh0dXJlID0gc3BIaW50Tm9kZS5nZXRDb21wb25lbnQoJ2NjLlNwcml0ZScpLnNwcml0ZUZyYW1lLmdldFRleHR1cmUoKTtcclxuXHRcdGhpbnROb2RlVGV4dHVyZS5pbml0V2l0aEVsZW1lbnQoSFRNTF9DYW52YXNfaGludCk7XHJcblx0XHRoaW50Tm9kZVRleHR1cmUuaGFuZGxlTG9hZGVkVGV4dHVyZSgpO1xyXG5cdFx0XHJcblx0XHR2YXIgc2tldGNoTm9kZVRleHR1cmUgPSBzcFNrZXRjaEltZy5zcHJpdGVGcmFtZS5nZXRUZXh0dXJlKCk7XHJcblx0XHRza2V0Y2hOb2RlVGV4dHVyZS5pbml0V2l0aEVsZW1lbnQoSFRNTF9DYW52YXNfc2tldGNoKTtcclxuXHRcdHNrZXRjaE5vZGVUZXh0dXJlLmhhbmRsZUxvYWRlZFRleHR1cmUoKTtcclxuXHRcdFxyXG5cdFx0aGFzU2tldGNoID0gdHJ1ZTtcclxuICAgIH1cclxuXHRpbWcuc3JjID0gdXJpO1xyXG59XHJcblxyXG5jYy5UZXh0dXJlMkQucHJvdG90eXBlLl9waXhlbHMgPSBbXTtcclxuY2MuVGV4dHVyZTJELnByb3RvdHlwZS5nZXRQaXhlbHMgPSBmdW5jdGlvbih4LHksbmV3V2lkdGgsbmV3SGVpZ2h0KXtcclxuICAgIHZhciBpZHggPSBwYXJzZUludCgobmV3SGVpZ2h0LXBhcnNlSW50KHkpKSAqIG5ld1dpZHRoICogNCArIHBhcnNlSW50KHgpICogNCk7XHJcbiAgICByZXR1cm4gbmV3IGNjLmNvbG9yKHRoaXMuX3BpeGVsc1tpZHhdLHRoaXMuX3BpeGVsc1tpZHggKyAxXSx0aGlzLl9waXhlbHNbaWR4ICsgMl0pO1xyXG59O1xyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBza2V0Y2hJbWc6e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsdHlwZTpjYy5Ob2RlXHJcbiAgICAgICAgfSxcclxuICAgICAgICByZWZlcmVuY2VJbWc6e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsdHlwZTpjYy5Ob2RlXHJcbiAgICAgICAgfSxcclxuICAgICAgICByZXN1bHRJbWc6e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsdHlwZTpjYy5Ob2RlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBjb2xvckltZzp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCx0eXBlOmNjLk5vZGVcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZsYWc6e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsdHlwZTpjYy5Ob2RlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBoaW50OntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLHR5cGU6Y2MuTm9kZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYnRuOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLHR5cGU6Y2MuTm9kZVxyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBvblYxOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZlcnNpb24gPSAxO1xyXG4gICAgICAgIHRoaXMub25DbGVhckNsaWNrZWQoKTtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIG9uVjI6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmVyc2lvbiA9IDI7XHJcbiAgICAgICAgdGhpcy5vbkNsZWFyQ2xpY2tlZCgpO1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgb25WMzogZnVuY3Rpb24oKXtcclxuICAgICAgICB2ZXJzaW9uID0gMztcclxuICAgICAgICB0aGlzLm9uQ2xlYXJDbGlja2VkKCk7XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBvblY0OiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZlcnNpb24gPSA0O1xyXG4gICAgICAgIHRoaXMub25DbGVhckNsaWNrZWQoKTtcclxuICAgIH0sXHJcblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY2MuZGlyZWN0b3Iuc2V0Q2xlYXJDb2xvcihjYy5jb2xvcigwLCAwLCAwLCAwKSlcclxuICAgICAgICBcclxuICAgICAgICBzcFNrZXRjaEltZyA9IHRoaXMuc2tldGNoSW1nLmdldENvbXBvbmVudCgnY2MuU3ByaXRlJyk7XHJcbiAgICAgICAgc3BSZWZlcmVuZUltZyA9IHRoaXMucmVmZXJlbmNlSW1nLmdldENvbXBvbmVudCgnY2MuU3ByaXRlJyk7XHJcbiAgICAgICAgc3BSZXN1bHRJbWcgPSB0aGlzLnJlc3VsdEltZy5nZXRDb21wb25lbnQoJ2NjLlNwcml0ZScpO1xyXG4gICAgICAgIHNwQ29sb3JJbWcgPSB0aGlzLmNvbG9ySW1nLmdldENvbXBvbmVudCgnY2MuU3ByaXRlJyk7XHJcbiAgICAgICAgc3BIaW50Tm9kZSA9IHRoaXMuaGludDtcclxuICAgICAgICBzcEJUTiA9IHRoaXMuYnRuLmdldENvbXBvbmVudCgnY2MuQnV0dG9uJyk7XHJcbiAgICAgICAgc3BMQUIgPSB0aGlzLmJ0bi5nZXRDb21wb25lbnQoJ2NjLlJpY2hUZXh0Jyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZmlsZUlucHV0Rm9yU2tldGNoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICAgIGZpbGVJbnB1dEZvclNrZXRjaC5pZCA9IFwiZmlsZUlucHV0Rm9yU2tldGNoXCI7XHJcbiAgICAgICAgZmlsZUlucHV0Rm9yU2tldGNoLnR5cGUgPSBcImZpbGVcIjtcclxuICAgICAgICBmaWxlSW5wdXRGb3JTa2V0Y2guYWNjZXB0ID0gXCJpbWFnZS8qXCI7XHJcbiAgICAgICAgZmlsZUlucHV0Rm9yU2tldGNoLnN0eWxlLmhlaWdodCA9IFwiMHB4XCI7XHJcbiAgICAgICAgZmlsZUlucHV0Rm9yU2tldGNoLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICAgICAgZmlsZUlucHV0Rm9yU2tldGNoLnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcclxuICAgICAgICBkb2N1bWVudC5ib2R5Lmluc2VydEJlZm9yZShmaWxlSW5wdXRGb3JTa2V0Y2gsZG9jdW1lbnQuYm9keS5maXJzdENoaWxkKTtcclxuICAgICAgICBmaWxlSW5wdXRGb3JTa2V0Y2guYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgb25Ta2V0Y2hGaWxlU2VsZWN0ZWQsIGZhbHNlKTtcclxuICAgICAgICBcclxuICAgICAgICBmaWxlSW5wdXRGb3JSZWZlcmVuZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgICBmaWxlSW5wdXRGb3JSZWZlcmVuZS5pZCA9IFwiZmlsZUlucHV0Rm9yUmVmZXJlbmVcIjtcclxuICAgICAgICBmaWxlSW5wdXRGb3JSZWZlcmVuZS50eXBlID0gXCJmaWxlXCI7XHJcbiAgICAgICAgZmlsZUlucHV0Rm9yUmVmZXJlbmUuYWNjZXB0ID0gXCJpbWFnZS8qXCI7XHJcbiAgICAgICAgZmlsZUlucHV0Rm9yUmVmZXJlbmUuc3R5bGUuaGVpZ2h0ID0gXCIwcHhcIjtcclxuICAgICAgICBmaWxlSW5wdXRGb3JSZWZlcmVuZS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgICAgIGZpbGVJbnB1dEZvclJlZmVyZW5lLnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcclxuICAgICAgICBkb2N1bWVudC5ib2R5Lmluc2VydEJlZm9yZShmaWxlSW5wdXRGb3JSZWZlcmVuZSxkb2N1bWVudC5ib2R5LmZpcnN0Q2hpbGQpO1xyXG4gICAgICAgIGZpbGVJbnB1dEZvclJlZmVyZW5lLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIG9uUmVmZXJlbmVGaWxlU2VsZWN0ZWQsIGZhbHNlKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm5vZGUub24oXCJtb3VzZW1vdmVcIiwgZnVuY3Rpb24gKGV2ZW50KSB7IFxyXG4gICAgICAgICAgICBtb3VzZVBvc2l0aW9uID0gZXZlbnQuZ2V0TG9jYXRpb24oKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm5vZGUub24oXCJtb3VzZWRvd25cIiwgZnVuY3Rpb24gKGV2ZW50KSB7IFxyXG4gICAgICAgICAgICBtb3VzZUlzRG93biA9IHRydWU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKFwibW91c2V1cFwiLCBmdW5jdGlvbiAoZXZlbnQpIHsgXHJcbiAgICAgICAgICAgIGdldE1vdXNlRG93biA9IHRydWU7XHJcbiAgICAgICAgICAgIG1vdXNlSXNEb3duID0gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgSFRNTF9DYW52YXNfaGludCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcbiAgICAgICAgSFRNTF9DYW52YXNfaGludC5pZCA9IFwiSFRNTF9DYW52YXNfaGludFwiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIEhUTUxfQ2FudmFzX3JlZmVyZW5jZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcbiAgICAgICAgSFRNTF9DYW52YXNfcmVmZXJlbmNlLmlkID0gXCJIVE1MX0NhbnZhc19yZWZlcmVuY2VcIjtcclxuICAgICAgICBcclxuICAgICAgICBIVE1MX0NhbnZhc19za2V0Y2ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG4gICAgICAgIEhUTUxfQ2FudmFzX3NrZXRjaC5pZCA9IFwiSFRNTF9DYW52YXNfc2tldGNoXCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICBcclxuICAgIH0sXHJcbiAgICBcclxuICAgIG9uU2tldGNoQ2xpY2tlZDogZnVuY3Rpb24oKXtcclxuICAgICAgICBmaWxlSW5wdXRGb3JTa2V0Y2guY2xpY2soKTtcclxuICAgIH0sXHJcbiAgICBvblJlZmVuY2VDbGlja2VkOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIGZpbGVJbnB1dEZvclJlZmVyZW5lLmNsaWNrKCk7XHJcbiAgICB9LFxyXG4gICAgb25QZW5DbGlja2VkOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIGlzUGVuID0gdHJ1ZTtcclxuICAgIH0sXHJcbiAgICBvbkVyYXNlckNsaWNrZWQ6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgaXNQZW4gPSBmYWxzZTtcclxuICAgIH0sXHJcbiAgICBvbkNsZWFyQ2xpY2tlZDogZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgY3h0PUhUTUxfQ2FudmFzX2hpbnQuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5cdCAgICBjeHQuY2xlYXJSZWN0KDAsMCxIVE1MX0NhbnZhc19oaW50LndpZHRoLEhUTUxfQ2FudmFzX2hpbnQuaGVpZ2h0KTtcclxuICAgICAgICB2YXIgaGludE5vZGVUZXggPSBzcEhpbnROb2RlLmdldENvbXBvbmVudCgnY2MuU3ByaXRlJykuc3ByaXRlRnJhbWUuZ2V0VGV4dHVyZSgpO1xyXG5cdFx0aGludE5vZGVUZXguaW5pdFdpdGhFbGVtZW50KEhUTUxfQ2FudmFzX2hpbnQpO1xyXG5cdFx0aGludE5vZGVUZXguaGFuZGxlTG9hZGVkVGV4dHVyZSgpO1xyXG4gICAgfSxcclxuICAgIG9uQ29sb3JpemVDbGlja2VkOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIGlmKCFoYXNSZWYpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCFoYXNTa2V0Y2gpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBoaW50RGF0YVVSTCA9IEhUTUxfQ2FudmFzX2hpbnQudG9EYXRhVVJMKFwiaW1hZ2UvcG5nXCIpO1xyXG4gICAgICAgIHZhciByZWZlcmVuY2VEYXRhVVJMID0gSFRNTF9DYW52YXNfcmVmZXJlbmNlLnRvRGF0YVVSTChcImltYWdlL3BuZ1wiKTtcclxuICAgICAgICB2YXIgc2tldGNoRGF0YVVSTCA9IEhUTUxfQ2FudmFzX3NrZXRjaC50b0RhdGFVUkwoXCJpbWFnZS9wbmdcIik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHhoci5vcGVuKFwiUE9TVFwiLCBcIi9wYWludFwiLCB0cnVlKTtcclxuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO1wiKTtcclxuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGxvYWRMb2NhbFJlc3VsdCh4aHIucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgc3BCVE4uZW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHNwTEFCLnN0cmluZyA9IFwiPHU+Y29sb3JpemU8L3U+XCI7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB4aHIuc2VuZFxyXG4gICAgICAgICAgICAoXHJcbiAgICAgICAgICAgIFwic2tldGNoPVwiK2VuY29kZVVSSUNvbXBvbmVudChza2V0Y2hEYXRhVVJMKStcclxuICAgICAgICAgICAgXCImcmVmZXJlbmNlPVwiK2VuY29kZVVSSUNvbXBvbmVudChyZWZlcmVuY2VEYXRhVVJMKStcclxuICAgICAgICAgICAgXCImaGludD1cIitlbmNvZGVVUklDb21wb25lbnQoaGludERhdGFVUkwpK1xyXG4gICAgICAgICAgICBcIiZ2ZXJzaW9uPVwiK3ZlcnNpb24udG9TdHJpbmcoKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIHNwQlROLmVuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICBzcExBQi5zdHJpbmcgPSBcIldhaXRpbmdcIjtcclxuICAgIH0sXHJcbiAgICBvbkRvd25sb2FkQ2xpY2tlZDogZnVuY3Rpb24oKXtcclxuICAgICAgICBpZihyZXN1bHRVUkw9PVwiXCIpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdpbmRvdy5vcGVuKHJlc3VsdFVSTCk7XHJcbiAgICB9LFxyXG4gICAgb25UaXRsZTogZnVuY3Rpb24oKXtcclxuICAgICAgICB3aW5kb3cub3BlbignaHR0cHM6Ly9naXRodWIuY29tL2xsbHlhc3ZpZWwvc3R5bGUycGFpbnRzJywnZ2l0SHViJyk7XHJcbiAgICB9LFxyXG4gICAgb25IZWxwOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHdpbmRvdy5vcGVuKCdodHRwczovL2dpdGh1Yi5jb20vbGxseWFzdmllbC9zdHlsZTJwYWludHMvaXNzdWVzLzEyJywnZ2l0SHViJyk7XHJcbiAgICB9LFxyXG4gICAgaGFuZGxlUGFpbnRlcjogZnVuY3Rpb24oKXtcclxuICAgICAgICBwYWludGluZyA9IGZhbHNlO1xyXG4gICAgICAgIHZhciByZWxhdGl2ZVggPSAwO1xyXG4gICAgICAgIHZhciByZWxhdGl2ZVkgPSAwO1xyXG4gICAgICAgIHZhciByZWZQb3NpdGlvbiA9IHNwU2tldGNoSW1nLm5vZGUuY29udmVydFRvV29ybGRTcGFjZShzcFNrZXRjaEltZy5ub2RlLnBvc2l0aW9uKTtcclxuICAgICAgICBpZihyZWZQb3NpdGlvbiAhPSBudWxsICYmIG1vdXNlUG9zaXRpb24gIT0gbnVsbCl7XHJcbiAgICAgICAgICAgIHZhciBiZWdpblggPSByZWZQb3NpdGlvbi54IC0gMjU2O1xyXG4gICAgICAgICAgICB2YXIgYmVnaW5ZID0gcmVmUG9zaXRpb24ueSAtIDI1NjtcclxuICAgICAgICAgICAgcmVsYXRpdmVYID0gbW91c2VQb3NpdGlvbi54IC0gYmVnaW5YO1xyXG4gICAgICAgICAgICByZWxhdGl2ZVkgPSBtb3VzZVBvc2l0aW9uLnkgLSBiZWdpblk7XHJcbiAgICAgICAgICAgIHZhciBtb3VzZUluU2tldGNoID0gKHJlbGF0aXZlWCA+IDAgJiYgcmVsYXRpdmVZID4gMCAmJiByZWxhdGl2ZVggPCBzcFNrZXRjaEltZy5ub2RlLndpZHRoICYmIHJlbGF0aXZlWSA8IHNwU2tldGNoSW1nLm5vZGUuaGVpZ2h0KTtcclxuICAgICAgICAgICAgaWYobW91c2VJblNrZXRjaCl7XHJcbiAgICAgICAgICAgICAgICBwYWludGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYocGFpbnRpbmcpe1xyXG4gICAgICAgICAgICBpZihtb3VzZUlzRG93bil7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3h0PUhUTUxfQ2FudmFzX2hpbnQuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZihpc1Blbil7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBlbiA9IDYgLSB2ZXJzaW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIGN4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgICAgICBjeHQuYXJjKHBhcnNlSW50KHBhcnNlRmxvYXQocmVsYXRpdmVYKSAvIHBhcnNlRmxvYXQoc3BIaW50Tm9kZS53aWR0aCkgKiBwYXJzZUZsb2F0KEhUTUxfQ2FudmFzX2hpbnQud2lkdGgpKSwgcGFyc2VJbnQocGFyc2VGbG9hdChzcEhpbnROb2RlLmhlaWdodCAtIHJlbGF0aXZlWSkgLyBwYXJzZUZsb2F0KHNwSGludE5vZGUuaGVpZ2h0KSAqIHBhcnNlRmxvYXQoSFRNTF9DYW52YXNfaGludC5oZWlnaHQpKSwgcGVuLCAwLCBNYXRoLlBJICogMiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY3h0LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb2xvciA9IHNwQ29sb3JJbWcubm9kZS5jb2xvclxyXG4gICAgICAgICAgICAgICAgICAgIGN4dC5maWxsU3R5bGUgPSAncmdiYSgnK2NvbG9yLnIudG9TdHJpbmcoKSsnLCcrY29sb3IuZy50b1N0cmluZygpKycsJytjb2xvci5iLnRvU3RyaW5nKCkrJywwLjYxOCknO1xyXG4gICAgICAgICAgICAgICAgICAgIGN4dC5maWxsKCk7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY3h0PUhUTUxfQ2FudmFzX2hpbnQuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGN4dC5jbGVhclJlY3QocGFyc2VJbnQocGFyc2VGbG9hdChyZWxhdGl2ZVgpIC8gcGFyc2VGbG9hdChzcEhpbnROb2RlLndpZHRoKSAqIHBhcnNlRmxvYXQoSFRNTF9DYW52YXNfaGludC53aWR0aCkpIC0gMTAsIHBhcnNlSW50KHBhcnNlRmxvYXQoc3BIaW50Tm9kZS5oZWlnaHQgLSByZWxhdGl2ZVkpIC8gcGFyc2VGbG9hdChzcEhpbnROb2RlLmhlaWdodCkgKiBwYXJzZUZsb2F0KEhUTUxfQ2FudmFzX2hpbnQuaGVpZ2h0KSkgLSAxMCwyMCwyMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHZhciBoaW50Tm9kZVRleCA9IHNwSGludE5vZGUuZ2V0Q29tcG9uZW50KCdjYy5TcHJpdGUnKS5zcHJpdGVGcmFtZS5nZXRUZXh0dXJlKCk7XHJcbiAgICAgICAgICAgICAgICBoaW50Tm9kZVRleC5pbml0V2l0aEVsZW1lbnQoSFRNTF9DYW52YXNfaGludCk7XHJcbiAgICAgICAgICAgICAgICBoaW50Tm9kZVRleC5oYW5kbGVMb2FkZWRUZXh0dXJlKHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGhhbmRsZUNvbG9yUGlja2VyOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciByZWZQb3NpdGlvbiA9IHNwUmVmZXJlbmVJbWcubm9kZS5jb252ZXJ0VG9Xb3JsZFNwYWNlKHNwUmVmZXJlbmVJbWcubm9kZS5wb3NpdGlvbik7XHJcbiAgICAgICAgICAgIGlmKHJlZlBvc2l0aW9uICE9IG51bGwgJiYgbW91c2VQb3NpdGlvbiAhPSBudWxsKXtcclxuICAgICAgICAgICAgICAgIHZhciBiZWdpblggPSByZWZQb3NpdGlvbi54O1xyXG4gICAgICAgICAgICAgICAgdmFyIGJlZ2luWSA9IHJlZlBvc2l0aW9uLnk7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVsYXRpdmVYID0gbW91c2VQb3NpdGlvbi54IC0gYmVnaW5YO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlbGF0aXZlWSA9IG1vdXNlUG9zaXRpb24ueSAtIGJlZ2luWTtcclxuICAgICAgICAgICAgICAgIG1vdXNlSW5SZWZlcmVuY2UgPSAocmVsYXRpdmVYID4gMCAmJiByZWxhdGl2ZVkgPiAwICYmIHJlbGF0aXZlWCA8IHNwUmVmZXJlbmVJbWcubm9kZS53aWR0aCAmJiByZWxhdGl2ZVkgPCBzcFJlZmVyZW5lSW1nLm5vZGUuaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIGlmKG1vdXNlSW5SZWZlcmVuY2Upe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCFwcmVNb3VzZUluUmVmKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW5nQ29sb3IgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZihnZXRNb3VzZURvd24pe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihzZWxlY3RpbmdDb2xvcil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmxhZy54ID0gcmVsYXRpdmVYIC0gc3BSZWZlcmVuZUltZy5ub2RlLndpZHRoIC8gMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mbGFnLnkgPSByZWxhdGl2ZVkgLSBzcFJlZmVyZW5lSW1nLm5vZGUuaGVpZ2h0IC8gMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxYID0gcmVsYXRpdmVYO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5hbFkgPSByZWxhdGl2ZVk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzUGVuID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHNlbGVjdGluZ0NvbG9yKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW5nQ29sb3IgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRleHR1cmUgPSBzcFJlZmVyZW5lSW1nLnNwcml0ZUZyYW1lLmdldFRleHR1cmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3BDb2xvckltZy5ub2RlLmNvbG9yID0gc3BSZWZlcmVuZUltZy5zcHJpdGVGcmFtZS5nZXRUZXh0dXJlKCkuZ2V0UGl4ZWxzKGZpbmFsWCxmaW5hbFksc3BSZWZlcmVuZUltZy5ub2RlLndpZHRoLHNwUmVmZXJlbmVJbWcubm9kZS5oZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmKHNlbGVjdGluZ0NvbG9yKXtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGV4dHVyZSA9IHNwUmVmZXJlbmVJbWcuc3ByaXRlRnJhbWUuZ2V0VGV4dHVyZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNwQ29sb3JJbWcubm9kZS5jb2xvciA9IHNwUmVmZXJlbmVJbWcuc3ByaXRlRnJhbWUuZ2V0VGV4dHVyZSgpLmdldFBpeGVscyhyZWxhdGl2ZVgscmVsYXRpdmVZLHNwUmVmZXJlbmVJbWcubm9kZS53aWR0aCxzcFJlZmVyZW5lSW1nLm5vZGUuaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcbiAgICAgICAgaWYobG9hZGVkKXtcclxuICAgICAgICAgICAgdGhpcy5oYW5kbGVDb2xvclBpY2tlcigpO1xyXG4gICAgICAgICAgICB0aGlzLmhhbmRsZVBhaW50ZXIoKTtcclxuICAgICAgICAgICAgaWYoc2VsZWN0aW5nQ29sb3IpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuY3Vyc29yPSdjcm9zc2hhaXInO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYocGFpbnRpbmcpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuY3Vyc29yPSdjcm9zc2hhaXInO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5jdXJzb3I9J2RlZmF1bHQnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByZU1vdXNlSW5SZWYgPSBtb3VzZUluUmVmZXJlbmNlO1xyXG4gICAgICAgIGdldE1vdXNlRG93biA9IGZhbHNlO1xyXG4gICAgfSxcclxufSk7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=