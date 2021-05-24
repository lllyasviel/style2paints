require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Controller":[function(require,module,exports){
"use strict";
cc._RF.push(module, '806bcYbxcNFYKpTMgw+5/TX', 'Controller');
// script/Controller.js

"use strict";

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

var sketchID = "new";
var referenceID = "new";
var tempID;

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
        referenceID = "new";
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

        sketchID = tempID[0];
        referenceID = tempID[1];
    };
    tempID = uri.split("*");
    if (tempID.length == 2) {
        resultURL = "results/" + tempID[0] + ".jpg?t=" + Math.random().toString();
        img.src = resultURL;
    }
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

        if (h < w) {
            if (h > 1024) {
                w = 1024.0 / h * w;
                h = 1024.0;
            }
        } else {
            if (w > 1024) {
                h = 1024.0 / w * h;
                w = 1024.0;
            }
        }

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
        sketchID = "new";
        referenceID = "new";
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
        if (sketchID != "new") {
            sketchDataURL = "null";
        }
        if (referenceID != "new") {
            referenceDataURL = "null";
        }
        xhr.send("sketch=" + encodeURIComponent(sketchDataURL) + "&reference=" + encodeURIComponent(referenceDataURL) + "&hint=" + encodeURIComponent(hintDataURL) + "&version=" + version.toString() + "&denoise=" + this.denoise.getComponent('cc.Toggle').isChecked.toString() + "&sketchID=" + sketchID + "&referenceID=" + referenceID);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvQ29udHJvbGxlci5qcyIsImFzc2V0cy9zY3JpcHQvb3BlblVSTC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDSTtBQUlIOztBQUVEO0FBQ0k7QUFDSDs7QUFFRDtBQUNJO0FBQ0g7O0FBRUQ7QUFDSTtBQUNIO0FBQ0k7QUFDRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTjtBQUNEO0FBQ0c7O0FBRUk7QUFDTjtBQUNBO0FBRUk7QUFDQTtBQUNIO0FBR0c7QUFDQTtBQUNIOztBQUVEO0FBQ0E7QUFDQTtBQUVJO0FBQ0E7QUFDSDtBQUdHO0FBQ0E7QUFDSDs7QUFFRDtBQUNBO0FBQ0E7QUFDTTs7QUFFQTtBQUNBOztBQUVBO0FBQ047O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ007QUFDQTtBQUNBO0FBQ0E7O0FBRU47QUFDQTtBQUNHO0FBQ0o7QUFDQTs7QUFFRDtBQUNJO0FBQ0g7QUFDSTtBQUNHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNOO0FBQ0Q7QUFDRzs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7QUFDRztBQUNJO0FBQ0g7QUFDSjs7QUFFRDtBQUNJO0FBRUk7QUFDQTtBQUNIO0FBR0c7QUFDQTtBQUNIO0FBQ0o7O0FBRUQ7QUFDQTs7QUFFQTtBQUNNOztBQUVBO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNIO0FBQ0E7QUFDSjs7QUFFRDtBQUNJO0FBQ0g7QUFDSTtBQUNHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNOO0FBQ0Q7QUFDRzs7QUFFSTtBQUNOOztBQUVBO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUNHO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7O0FBRUQ7QUFDTTs7QUFFTjtBQUVJO0FBQ0E7QUFDSDtBQUdHO0FBQ0E7QUFDSDs7QUFFSztBQUNOOztBQUVBO0FBQ0E7QUFDQTtBQUVJO0FBQ0E7QUFDSDtBQUdHO0FBQ0E7QUFDSDs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFTTtBQUNIOztBQUVHO0FBQ047QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0c7QUFDSjtBQUNBOztBQUVEO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7O0FBRUQ7QUFDSTs7QUFFQTtBQUNJO0FBQ0k7QUFETTtBQUdWO0FBQ0k7QUFEUztBQUdiO0FBQ0k7QUFETTtBQUdWO0FBQ0k7QUFESztBQUdUO0FBQ0k7QUFEQztBQUdMO0FBQ0k7QUFEQztBQUdMO0FBQ0k7QUFEQTtBQUdKO0FBQ0k7QUFESTtBQUdSO0FBQ0k7QUFESTtBQXpCQTs7QUE4Qlo7QUFDSTtBQUNBO0FBQ0g7O0FBRUQ7QUFDSTtBQUNBO0FBQ0g7O0FBRUQ7QUFDSTtBQUNBO0FBQ0g7O0FBRUQ7QUFDSTtBQUNBO0FBQ0g7O0FBRUQ7O0FBRUk7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJO0FBQ0g7O0FBRUQ7QUFDSTtBQUNIOztBQUVEO0FBQ0k7QUFDQTtBQUNIOztBQUVEO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBRUg7O0FBRUQ7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0c7QUFDTjtBQUNBO0FBQ0c7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDs7QUFFRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQVVBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNHO0FBQ0E7QUFDSDs7QUFFRDtBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7QUFDRDtBQUNJO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNDO0FBQ0o7QUFDSjtBQUNHO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7QUFDUjtBQUNEO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFFSTtBQUNIO0FBR0c7QUFDSDtBQUdHO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSDtBQTVRSTs7Ozs7Ozs7OztBQ25SVDtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBREE7QUFESTtBQUtaO0FBQ0k7QUFDSDtBQVRJIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHNwU2tldGNoSW1nO1xyXG52YXIgc3BSZWZlcmVuZUltZztcclxudmFyIHNwUmVzdWx0SW1nO1xyXG52YXIgc3BDb2xvckltZztcclxudmFyIHNwSGludE5vZGU7XHJcbnZhciBzcEJUTjtcclxudmFyIHNwTEFCO1xyXG5cclxudmFyIGZpbGVJbnB1dEZvclNrZXRjaDtcclxudmFyIGZpbGVJbnB1dEZvclJlZmVyZW5lO1xyXG5cclxudmFyIG1vdXNlUG9zaXRpb247XHJcbnZhciBtb3VzZUluUmVmZXJlbmNlID0gZmFsc2U7XHJcblxyXG52YXIgbG9hZGVkID0gZmFsc2U7XHJcblxyXG52YXIgZ2V0TW91c2VEb3duID0gZmFsc2U7XHJcbnZhciBwcmVNb3VzZUluUmVmID0gZmFsc2U7XHJcbnZhciBzZWxlY3RpbmdDb2xvciA9IGZhbHNlO1xyXG52YXIgcGFpbnRpbmcgPSBmYWxzZTtcclxudmFyIGZpbmFsWD0wO1xyXG52YXIgZmluYWxZPTA7XHJcblxyXG52YXIgaGFzU2tldGNoPWZhbHNlO1xyXG52YXIgaGFzUmVmPWZhbHNlO1xyXG5cclxudmFyIEhUTUxfQ2FudmFzX3NrZXRjaDtcclxudmFyIEhUTUxfQ2FudmFzX3JlZmVyZW5jZTtcclxudmFyIEhUTUxfQ2FudmFzX2hpbnQ7XHJcblxyXG52YXIgaXNQZW4gPSB0cnVlO1xyXG5cclxudmFyIG1vdXNlSXNEb3duID0gZmFsc2U7XHJcblxyXG52YXIgc2tldGNoSUQgPSBcIm5ld1wiO1xyXG52YXIgcmVmZXJlbmNlSUQgPSBcIm5ld1wiO1xyXG52YXIgdGVtcElEO1xyXG5cclxudmFyIHJlc3VsdFVSTCA9IFwiXCI7XHJcblxyXG52YXIgdmVyc2lvbiA9IDI7XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVPYmplY3RVUkwoYmxvYil7XHJcbiAgICBpZih3aW5kb3cuVVJMICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgcmV0dXJuIHdpbmRvd1snVVJMJ11bJ2NyZWF0ZU9iamVjdFVSTCddKGJsb2IpO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHJldHVybiB3aW5kb3dbJ3dlYmtpdFVSTCddWydjcmVhdGVPYmplY3RVUkwnXShibG9iKTtcclxufVxyXG5cclxuZnVuY3Rpb24gb25Ta2V0Y2hGaWxlU2VsZWN0ZWQoZXZ0KSB7XHJcbiAgICBsb2FkTG9jYWxTa2V0Y2goY3JlYXRlT2JqZWN0VVJMKGV2dC50YXJnZXQuZmlsZXNbMF0pKTtcclxufVxyXG5cclxuZnVuY3Rpb24gb25SZWZlcmVuZUZpbGVTZWxlY3RlZChldnQpIHtcclxuICAgIGxvYWRMb2NhbFJlZmVyZW5jZShjcmVhdGVPYmplY3RVUkwoZXZ0LnRhcmdldC5maWxlc1swXSkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBsb2FkTG9jYWxSZWZlcmVuY2UodXJpKXtcclxuICAgIHZhciB0ZW1wRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0ZW1wRGl2UmVmZXJlbmNlXCIpO1xyXG5cdGlmKHRlbXBEaXY9PT1udWxsKXtcclxuXHQgICAgdmFyIHRlbXBEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGVtcERpdik7XHJcbiAgICAgICAgdGVtcERpdi5zdHlsZS5wb3NpdGlvbj1cImFic29sdXRlXCI7XHJcbiAgICAgICAgdGVtcERpdi5pZD1cInRlbXBEaXZSZWZlcmVuY2VcIjtcclxuICAgICAgICB0ZW1wRGl2LmlubmVySFRNTCA9ICc8aW1nIGlkPWltZ2hlYWRSZWZlcmVuY2U+JztcclxuICAgICAgICB0ZW1wRGl2LnN0eWxlLmRpc3BsYXk9J25vbmUnO1xyXG4gICAgICAgIHRlbXBEaXYuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XHJcblx0fVxyXG5cdHZhciBpbWcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW1naGVhZFJlZmVyZW5jZScpO1xyXG4gICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHdfMjI0ID0gcGFyc2VGbG9hdCh0aGlzLndpZHRoKTtcclxuXHRcdHZhciBoXzIyNCA9IHBhcnNlRmxvYXQodGhpcy5oZWlnaHQpO1xyXG5cdFx0aWYod18yMjQgPiBoXzIyNClcclxuXHRcdHtcclxuXHRcdCAgICB3XzIyNCA9IDIyNC4wIC8gaF8yMjQgKiB3XzIyNDtcclxuXHRcdCAgICBoXzIyNCA9IDIyNC4wO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZVxyXG5cdFx0e1xyXG5cdFx0ICAgIGhfMjI0ID0gMjI0LjAgLyB3XzIyNCAqIGhfMjI0O1xyXG5cdFx0ICAgIHdfMjI0ID0gMjI0LjA7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHZhciB3XzIwMCA9IHBhcnNlRmxvYXQodGhpcy53aWR0aCk7XHJcblx0XHR2YXIgaF8yMDAgPSBwYXJzZUZsb2F0KHRoaXMuaGVpZ2h0KTtcclxuXHRcdGlmKHdfMjAwIDwgaF8yMDApXHJcblx0XHR7XHJcblx0XHQgICAgd18yMDAgPSAyMDAuMCAvIGhfMjAwICogd18yMDA7XHJcblx0XHQgICAgaF8yMDAgPSAyMDAuMDtcclxuXHRcdH1cclxuXHRcdGVsc2VcclxuXHRcdHtcclxuXHRcdCAgICBoXzIwMCA9IDIwMC4wIC8gd18yMDAgKiBoXzIwMDtcclxuXHRcdCAgICB3XzIwMCA9IDIwMC4wO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRzcFJlZmVyZW5lSW1nLm5vZGUud2lkdGggPSBwYXJzZUludCh3XzIwMCk7XHJcblx0XHRzcFJlZmVyZW5lSW1nLm5vZGUuaGVpZ2h0ID0gcGFyc2VJbnQoaF8yMDApO1xyXG5cdFx0SFRNTF9DYW52YXNfcmVmZXJlbmNlLndpZHRoID0gcGFyc2VJbnQod18yMjQpO1xyXG4gICAgICAgIEhUTUxfQ2FudmFzX3JlZmVyZW5jZS5oZWlnaHQgPSBwYXJzZUludChoXzIyNCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgSFRNTF9DYW52YXNfcmVmZXJlbmNlLmdldENvbnRleHQoXCIyZFwiKS5kcmF3SW1hZ2UodGhpcywgMCwgMCwgSFRNTF9DYW52YXNfcmVmZXJlbmNlLndpZHRoLCBIVE1MX0NhbnZhc19yZWZlcmVuY2UuaGVpZ2h0KTtcclxuICAgICAgICBIVE1MX0NhbnZhc19oaW50LmdldENvbnRleHQoXCIyZFwiKS5jbGVhclJlY3QoMCwwLEhUTUxfQ2FudmFzX2hpbnQud2lkdGgsSFRNTF9DYW52YXNfaGludC5oZWlnaHQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciByZWZlcmVuY2VOb2RlVGV4dHVyZSA9IHNwUmVmZXJlbmVJbWcuc3ByaXRlRnJhbWUuZ2V0VGV4dHVyZSgpO1xyXG5cdFx0dmFyIGhpbnROb2RlVGV4dHVyZSA9IHNwSGludE5vZGUuZ2V0Q29tcG9uZW50KCdjYy5TcHJpdGUnKS5zcHJpdGVGcmFtZS5nZXRUZXh0dXJlKCk7XHJcbiAgICAgICAgXHJcblx0XHRoaW50Tm9kZVRleHR1cmUuaW5pdFdpdGhFbGVtZW50KEhUTUxfQ2FudmFzX2hpbnQpO1xyXG5cdFx0aGludE5vZGVUZXh0dXJlLmhhbmRsZUxvYWRlZFRleHR1cmUoKTtcclxuXHRcdFxyXG5cdFx0cmVmZXJlbmNlTm9kZVRleHR1cmUuaW5pdFdpdGhFbGVtZW50KEhUTUxfQ2FudmFzX3JlZmVyZW5jZSk7XHJcblx0XHRyZWZlcmVuY2VOb2RlVGV4dHVyZS5oYW5kbGVMb2FkZWRUZXh0dXJlKCk7XHJcblx0XHRcclxuXHRcdHZhciB0ZW1wQ2FudmFzXzIwMCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcbiAgICAgICAgdGVtcENhbnZhc18yMDAud2lkdGggPSBwYXJzZUludCh3XzIwMCk7XHJcbiAgICAgICAgdGVtcENhbnZhc18yMDAuaGVpZ2h0ID0gcGFyc2VJbnQoaF8yMDApO1xyXG4gICAgICAgIHRlbXBDYW52YXNfMjAwLmdldENvbnRleHQoXCIyZFwiKS5kcmF3SW1hZ2UodGhpcywgMCwgMCwgdGVtcENhbnZhc18yMDAud2lkdGgsIHRlbXBDYW52YXNfMjAwLmhlaWdodCk7XHJcbiAgICAgICAgcmVmZXJlbmNlTm9kZVRleHR1cmUuX3BpeGVscyA9IHRlbXBDYW52YXNfMjAwLmdldENvbnRleHQoXCIyZFwiKS5nZXRJbWFnZURhdGEoMCwgMCwgdGVtcENhbnZhc18yMDAud2lkdGgsIHRlbXBDYW52YXNfMjAwLmhlaWdodCkuZGF0YTtcclxuXHRcdFxyXG5cdFx0aGFzUmVmID0gdHJ1ZTtcclxuXHRcdHJlZmVyZW5jZUlEID0gXCJuZXdcIjtcclxuICAgIH1cclxuXHRpbWcuc3JjID0gdXJpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBsb2FkTG9jYWxSZXN1bHQodXJpKXtcclxuICAgIHZhciB0ZW1wRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0ZW1wRGl2UmVzdWx0XCIpO1xyXG5cdGlmKHRlbXBEaXY9PT1udWxsKXtcclxuXHQgICAgdmFyIHRlbXBEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGVtcERpdik7XHJcbiAgICAgICAgdGVtcERpdi5zdHlsZS5wb3NpdGlvbj1cImFic29sdXRlXCI7XHJcbiAgICAgICAgdGVtcERpdi5pZD1cInRlbXBEaXZSZXN1bHRcIjtcclxuICAgICAgICB0ZW1wRGl2LmlubmVySFRNTCA9ICc8aW1nIGlkPWltZ2hlYWRSZXN1bHQ+JztcclxuICAgICAgICB0ZW1wRGl2LnN0eWxlLmRpc3BsYXk9J25vbmUnO1xyXG4gICAgICAgIHRlbXBEaXYuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XHJcblx0fVxyXG5cdHZhciBpbWcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW1naGVhZFJlc3VsdCcpO1xyXG4gICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgXHJcblx0XHR2YXIgdGV4dHVyZSA9IHNwUmVzdWx0SW1nLnNwcml0ZUZyYW1lLmdldFRleHR1cmUoKTtcclxuXHRcdHRleHR1cmUuaW5pdFdpdGhFbGVtZW50KHRoaXMpO1xyXG5cdFx0dGV4dHVyZS5oYW5kbGVMb2FkZWRUZXh0dXJlKCk7XHJcblx0XHR2YXIgdyA9IHBhcnNlRmxvYXQodGhpcy53aWR0aCk7XHJcblx0XHR2YXIgaCA9IHBhcnNlRmxvYXQodGhpcy5oZWlnaHQpO1xyXG5cdFx0XHJcblx0XHR2YXIgc21hbGwgPSB0cnVlO1xyXG5cdFx0XHJcblx0XHRpZih3Pmgpe1xyXG5cdFx0ICAgIGlmKHc+NzI0KXtcclxuXHRcdCAgICAgICAgc21hbGwgPSBmYWxzZTtcclxuXHRcdCAgICB9XHJcblx0XHR9ZWxzZXtcclxuXHRcdCAgICBpZihoPjcyNCl7XHJcblx0XHQgICAgICAgIHNtYWxsID0gZmFsc2U7XHJcblx0XHQgICAgfVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRpZighc21hbGwpe1xyXG5cdFx0ICAgIGlmKHc8aClcclxuXHRcdCAgICB7XHJcblx0XHQgICAgICAgIHcgPSA3MjQuMCAvIGggKiB3O1xyXG5cdFx0ICAgICAgICBoID0gNzI0LjA7XHJcblx0XHQgICAgfVxyXG5cdFx0ICAgIGVsc2VcclxuXHRcdCAgICB7XHJcblx0XHQgICAgICAgIGggPSA3MjQuMCAvIHcgKiBoO1xyXG5cdFx0ICAgICAgICB3ID0gNzI0LjA7XHJcblx0XHQgICAgfVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRzcFJlc3VsdEltZy5ub2RlLndpZHRoID0gcGFyc2VJbnQodyk7XHJcblx0XHRzcFJlc3VsdEltZy5ub2RlLmhlaWdodCA9IHBhcnNlSW50KGgpO1xyXG5cdFx0XHJcblx0XHRzcEJUTi5lbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICBzcExBQi5zdHJpbmcgPSBcIjx1PmNvbG9yaXplPC91PlwiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHNrZXRjaElEID0gdGVtcElEWzBdO1xyXG4gICAgICAgIHJlZmVyZW5jZUlEID0gdGVtcElEWzFdO1xyXG4gICAgfVxyXG4gICAgdGVtcElEID0gdXJpLnNwbGl0KFwiKlwiKTtcclxuICAgIGlmKHRlbXBJRC5sZW5ndGg9PTIpe1xyXG4gICAgICAgIHJlc3VsdFVSTCA9IFwicmVzdWx0cy9cIiArIHRlbXBJRFswXSArIFwiLmpwZz90PVwiICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygpO1xyXG5cdCAgICBpbWcuc3JjID0gcmVzdWx0VVJMO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBsb2FkTG9jYWxTa2V0Y2godXJpKXtcclxuICAgIHZhciB0ZW1wRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0ZW1wRGl2U2tldGNoXCIpO1xyXG5cdGlmKHRlbXBEaXY9PT1udWxsKXtcclxuXHQgICAgdmFyIHRlbXBEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGVtcERpdik7XHJcbiAgICAgICAgdGVtcERpdi5zdHlsZS5wb3NpdGlvbj1cImFic29sdXRlXCI7XHJcbiAgICAgICAgdGVtcERpdi5pZD1cInRlbXBEaXZTa2V0Y2hcIjtcclxuICAgICAgICB0ZW1wRGl2LmlubmVySFRNTCA9ICc8aW1nIGlkPWltZ2hlYWRTa2V0Y2g+JztcclxuICAgICAgICB0ZW1wRGl2LnN0eWxlLmRpc3BsYXk9J25vbmUnO1xyXG4gICAgICAgIHRlbXBEaXYuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XHJcblx0fVxyXG5cdHZhciBpbWcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW1naGVhZFNrZXRjaCcpO1xyXG4gICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHcgPSBwYXJzZUZsb2F0KHRoaXMud2lkdGgpO1xyXG5cdFx0dmFyIGggPSBwYXJzZUZsb2F0KHRoaXMuaGVpZ2h0KTtcclxuXHRcdFxyXG5cdFx0aWYoaDx3KXtcclxuXHRcdCAgICBpZihoPjEwMjQpe1xyXG5cdFx0ICAgICAgICB3ID0gMTAyNC4wIC8gaCAqIHc7XHJcblx0XHQgICAgICAgIGggPSAxMDI0LjA7XHJcblx0XHQgICAgfVxyXG5cdFx0fWVsc2V7XHJcblx0XHQgICAgaWYodz4xMDI0KXtcclxuXHRcdCAgICAgICAgaCA9IDEwMjQuMCAvIHcgKiBoO1xyXG5cdFx0ICAgICAgICB3ID0gMTAyNC4wO1xyXG5cdFx0ICAgIH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0SFRNTF9DYW52YXNfc2tldGNoLndpZHRoID0gcGFyc2VJbnQodyk7XHJcbiAgICAgICAgSFRNTF9DYW52YXNfc2tldGNoLmhlaWdodCA9IHBhcnNlSW50KGgpO1xyXG4gICAgICAgIFxyXG5cdFx0aWYodyA+IGgpXHJcblx0XHR7XHJcblx0XHQgICAgdyA9IDUxMi4wIC8gaCAqIHc7XHJcblx0XHQgICAgaCA9IDUxMi4wO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZVxyXG5cdFx0e1xyXG5cdFx0ICAgIGggPSA1MTIuMCAvIHcgKiBoO1xyXG5cdFx0ICAgIHcgPSA1MTIuMDtcclxuXHRcdH1cclxuICAgICAgICBcclxuICAgICAgICBIVE1MX0NhbnZhc19oaW50LndpZHRoID0gcGFyc2VJbnQodyk7XHJcblx0XHRIVE1MX0NhbnZhc19oaW50LmhlaWdodCA9IHBhcnNlSW50KGgpO1xyXG4gICAgICAgIFxyXG5cdFx0dyA9IHBhcnNlRmxvYXQodGhpcy53aWR0aCk7XHJcblx0XHRoID0gcGFyc2VGbG9hdCh0aGlzLmhlaWdodCk7XHJcblx0XHRpZih3IDwgaClcclxuXHRcdHtcclxuXHRcdCAgICB3ID0gNTEyLjAgLyBoICogdztcclxuXHRcdCAgICBoID0gNTEyLjA7XHJcblx0XHR9XHJcblx0XHRlbHNlXHJcblx0XHR7XHJcblx0XHQgICAgaCA9IDUxMi4wIC8gdyAqIGg7XHJcblx0XHQgICAgdyA9IDUxMi4wO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRzcFNrZXRjaEltZy5ub2RlLndpZHRoID0gcGFyc2VJbnQodyk7XHJcblx0XHRzcFNrZXRjaEltZy5ub2RlLmhlaWdodCA9IHBhcnNlSW50KGgpO1xyXG5cdFx0c3BIaW50Tm9kZS53aWR0aCA9IHBhcnNlSW50KHcpO1xyXG5cdFx0c3BIaW50Tm9kZS5oZWlnaHQgPSBwYXJzZUludChoKTtcclxuXHJcbiAgICAgICAgSFRNTF9DYW52YXNfc2tldGNoLmdldENvbnRleHQoXCIyZFwiKS5kcmF3SW1hZ2UodGhpcywgMCwgMCwgSFRNTF9DYW52YXNfc2tldGNoLndpZHRoLCBIVE1MX0NhbnZhc19za2V0Y2guaGVpZ2h0KTtcclxuXHQgICAgSFRNTF9DYW52YXNfaGludC5nZXRDb250ZXh0KFwiMmRcIikuY2xlYXJSZWN0KDAsMCxIVE1MX0NhbnZhc19oaW50LndpZHRoLEhUTUxfQ2FudmFzX2hpbnQuaGVpZ2h0KTtcclxuXHQgICAgXHJcbiAgICAgICAgdmFyIGhpbnROb2RlVGV4dHVyZSA9IHNwSGludE5vZGUuZ2V0Q29tcG9uZW50KCdjYy5TcHJpdGUnKS5zcHJpdGVGcmFtZS5nZXRUZXh0dXJlKCk7XHJcblx0XHRoaW50Tm9kZVRleHR1cmUuaW5pdFdpdGhFbGVtZW50KEhUTUxfQ2FudmFzX2hpbnQpO1xyXG5cdFx0aGludE5vZGVUZXh0dXJlLmhhbmRsZUxvYWRlZFRleHR1cmUoKTtcclxuXHRcdFxyXG5cdFx0dmFyIHNrZXRjaE5vZGVUZXh0dXJlID0gc3BTa2V0Y2hJbWcuc3ByaXRlRnJhbWUuZ2V0VGV4dHVyZSgpO1xyXG5cdFx0c2tldGNoTm9kZVRleHR1cmUuaW5pdFdpdGhFbGVtZW50KEhUTUxfQ2FudmFzX3NrZXRjaCk7XHJcblx0XHRza2V0Y2hOb2RlVGV4dHVyZS5oYW5kbGVMb2FkZWRUZXh0dXJlKCk7XHJcblx0XHRcclxuXHRcdGhhc1NrZXRjaCA9IHRydWU7XHJcblx0XHRza2V0Y2hJRCA9IFwibmV3XCI7XHJcblx0XHRyZWZlcmVuY2VJRCA9IFwibmV3XCI7XHJcbiAgICB9XHJcblx0aW1nLnNyYyA9IHVyaTtcclxufVxyXG5cclxuY2MuVGV4dHVyZTJELnByb3RvdHlwZS5fcGl4ZWxzID0gW107XHJcbmNjLlRleHR1cmUyRC5wcm90b3R5cGUuZ2V0UGl4ZWxzID0gZnVuY3Rpb24oeCx5LG5ld1dpZHRoLG5ld0hlaWdodCl7XHJcbiAgICB2YXIgaWR4ID0gcGFyc2VJbnQoKG5ld0hlaWdodC1wYXJzZUludCh5KSkgKiBuZXdXaWR0aCAqIDQgKyBwYXJzZUludCh4KSAqIDQpO1xyXG4gICAgcmV0dXJuIG5ldyBjYy5jb2xvcih0aGlzLl9waXhlbHNbaWR4XSx0aGlzLl9waXhlbHNbaWR4ICsgMV0sdGhpcy5fcGl4ZWxzW2lkeCArIDJdKTtcclxufTtcclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgc2tldGNoSW1nOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLHR5cGU6Y2MuTm9kZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVmZXJlbmNlSW1nOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLHR5cGU6Y2MuTm9kZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVzdWx0SW1nOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLHR5cGU6Y2MuTm9kZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY29sb3JJbWc6e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsdHlwZTpjYy5Ob2RlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBmbGFnOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLHR5cGU6Y2MuTm9kZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaGludDp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCx0eXBlOmNjLk5vZGVcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJ0bjp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCx0eXBlOmNjLk5vZGVcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlbm9pc2U6e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsdHlwZTpjYy5Ob2RlXHJcbiAgICAgICAgfSxcclxuICAgICAgICB3ZWxjb21lOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLHR5cGU6Y2MuTm9kZVxyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBvblYxOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZlcnNpb24gPSAxO1xyXG4gICAgICAgIHRoaXMub25DbGVhckNsaWNrZWQoKTtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIG9uVjI6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmVyc2lvbiA9IDI7XHJcbiAgICAgICAgdGhpcy5vbkNsZWFyQ2xpY2tlZCgpO1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgb25WMzogZnVuY3Rpb24oKXtcclxuICAgICAgICB2ZXJzaW9uID0gMztcclxuICAgICAgICB0aGlzLm9uQ2xlYXJDbGlja2VkKCk7XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBvblY0OiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZlcnNpb24gPSA0O1xyXG4gICAgICAgIHRoaXMub25DbGVhckNsaWNrZWQoKTtcclxuICAgIH0sXHJcblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY2MuZGlyZWN0b3Iuc2V0Q2xlYXJDb2xvcihjYy5jb2xvcigwLCAwLCAwLCAwKSlcclxuICAgICAgICBcclxuICAgICAgICBzcFNrZXRjaEltZyA9IHRoaXMuc2tldGNoSW1nLmdldENvbXBvbmVudCgnY2MuU3ByaXRlJyk7XHJcbiAgICAgICAgc3BSZWZlcmVuZUltZyA9IHRoaXMucmVmZXJlbmNlSW1nLmdldENvbXBvbmVudCgnY2MuU3ByaXRlJyk7XHJcbiAgICAgICAgc3BSZXN1bHRJbWcgPSB0aGlzLnJlc3VsdEltZy5nZXRDb21wb25lbnQoJ2NjLlNwcml0ZScpO1xyXG4gICAgICAgIHNwQ29sb3JJbWcgPSB0aGlzLmNvbG9ySW1nLmdldENvbXBvbmVudCgnY2MuU3ByaXRlJyk7XHJcbiAgICAgICAgc3BIaW50Tm9kZSA9IHRoaXMuaGludDtcclxuICAgICAgICBzcEJUTiA9IHRoaXMuYnRuLmdldENvbXBvbmVudCgnY2MuQnV0dG9uJyk7XHJcbiAgICAgICAgc3BMQUIgPSB0aGlzLmJ0bi5nZXRDb21wb25lbnQoJ2NjLlJpY2hUZXh0Jyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZmlsZUlucHV0Rm9yU2tldGNoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICAgIGZpbGVJbnB1dEZvclNrZXRjaC5pZCA9IFwiZmlsZUlucHV0Rm9yU2tldGNoXCI7XHJcbiAgICAgICAgZmlsZUlucHV0Rm9yU2tldGNoLnR5cGUgPSBcImZpbGVcIjtcclxuICAgICAgICBmaWxlSW5wdXRGb3JTa2V0Y2guYWNjZXB0ID0gXCJpbWFnZS8qXCI7XHJcbiAgICAgICAgZmlsZUlucHV0Rm9yU2tldGNoLnN0eWxlLmhlaWdodCA9IFwiMHB4XCI7XHJcbiAgICAgICAgZmlsZUlucHV0Rm9yU2tldGNoLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICAgICAgZmlsZUlucHV0Rm9yU2tldGNoLnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcclxuICAgICAgICBkb2N1bWVudC5ib2R5Lmluc2VydEJlZm9yZShmaWxlSW5wdXRGb3JTa2V0Y2gsZG9jdW1lbnQuYm9keS5maXJzdENoaWxkKTtcclxuICAgICAgICBmaWxlSW5wdXRGb3JTa2V0Y2guYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgb25Ta2V0Y2hGaWxlU2VsZWN0ZWQsIGZhbHNlKTtcclxuICAgICAgICBcclxuICAgICAgICBmaWxlSW5wdXRGb3JSZWZlcmVuZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgICBmaWxlSW5wdXRGb3JSZWZlcmVuZS5pZCA9IFwiZmlsZUlucHV0Rm9yUmVmZXJlbmVcIjtcclxuICAgICAgICBmaWxlSW5wdXRGb3JSZWZlcmVuZS50eXBlID0gXCJmaWxlXCI7XHJcbiAgICAgICAgZmlsZUlucHV0Rm9yUmVmZXJlbmUuYWNjZXB0ID0gXCJpbWFnZS8qXCI7XHJcbiAgICAgICAgZmlsZUlucHV0Rm9yUmVmZXJlbmUuc3R5bGUuaGVpZ2h0ID0gXCIwcHhcIjtcclxuICAgICAgICBmaWxlSW5wdXRGb3JSZWZlcmVuZS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgICAgIGZpbGVJbnB1dEZvclJlZmVyZW5lLnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcclxuICAgICAgICBkb2N1bWVudC5ib2R5Lmluc2VydEJlZm9yZShmaWxlSW5wdXRGb3JSZWZlcmVuZSxkb2N1bWVudC5ib2R5LmZpcnN0Q2hpbGQpO1xyXG4gICAgICAgIGZpbGVJbnB1dEZvclJlZmVyZW5lLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIG9uUmVmZXJlbmVGaWxlU2VsZWN0ZWQsIGZhbHNlKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm5vZGUub24oXCJtb3VzZW1vdmVcIiwgZnVuY3Rpb24gKGV2ZW50KSB7IFxyXG4gICAgICAgICAgICBtb3VzZVBvc2l0aW9uID0gZXZlbnQuZ2V0TG9jYXRpb24oKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm5vZGUub24oXCJtb3VzZWRvd25cIiwgZnVuY3Rpb24gKGV2ZW50KSB7IFxyXG4gICAgICAgICAgICBtb3VzZUlzRG93biA9IHRydWU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKFwibW91c2V1cFwiLCBmdW5jdGlvbiAoZXZlbnQpIHsgXHJcbiAgICAgICAgICAgIGdldE1vdXNlRG93biA9IHRydWU7XHJcbiAgICAgICAgICAgIG1vdXNlSXNEb3duID0gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgSFRNTF9DYW52YXNfaGludCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcbiAgICAgICAgSFRNTF9DYW52YXNfaGludC5pZCA9IFwiSFRNTF9DYW52YXNfaGludFwiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIEhUTUxfQ2FudmFzX3JlZmVyZW5jZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcbiAgICAgICAgSFRNTF9DYW52YXNfcmVmZXJlbmNlLmlkID0gXCJIVE1MX0NhbnZhc19yZWZlcmVuY2VcIjtcclxuICAgICAgICBcclxuICAgICAgICBIVE1MX0NhbnZhc19za2V0Y2ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG4gICAgICAgIEhUTUxfQ2FudmFzX3NrZXRjaC5pZCA9IFwiSFRNTF9DYW52YXNfc2tldGNoXCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICBcclxuICAgIH0sXHJcbiAgICBcclxuICAgIG9uU2tldGNoQ2xpY2tlZDogZnVuY3Rpb24oKXtcclxuICAgICAgICBmaWxlSW5wdXRGb3JTa2V0Y2guY2xpY2soKTtcclxuICAgIH0sXHJcbiAgICBvblJlZmVuY2VDbGlja2VkOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIGZpbGVJbnB1dEZvclJlZmVyZW5lLmNsaWNrKCk7XHJcbiAgICB9LFxyXG4gICAgb25QZW5DbGlja2VkOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIGlzUGVuID0gdHJ1ZTtcclxuICAgIH0sXHJcbiAgICBvbkVyYXNlckNsaWNrZWQ6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgaXNQZW4gPSBmYWxzZTtcclxuICAgIH0sXHJcbiAgICBvbkNsZWFyQ2xpY2tlZDogZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgY3h0PUhUTUxfQ2FudmFzX2hpbnQuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5cdCAgICBjeHQuY2xlYXJSZWN0KDAsMCxIVE1MX0NhbnZhc19oaW50LndpZHRoLEhUTUxfQ2FudmFzX2hpbnQuaGVpZ2h0KTtcclxuICAgICAgICB2YXIgaGludE5vZGVUZXggPSBzcEhpbnROb2RlLmdldENvbXBvbmVudCgnY2MuU3ByaXRlJykuc3ByaXRlRnJhbWUuZ2V0VGV4dHVyZSgpO1xyXG5cdFx0aGludE5vZGVUZXguaW5pdFdpdGhFbGVtZW50KEhUTUxfQ2FudmFzX2hpbnQpO1xyXG5cdFx0aGludE5vZGVUZXguaGFuZGxlTG9hZGVkVGV4dHVyZSgpO1xyXG4gICAgfSxcclxuICAgIG9uQ29sb3JpemVDbGlja2VkOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIGlmKCFoYXNSZWYpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCFoYXNTa2V0Y2gpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHNwUmVzdWx0SW1nLm5vZGUud2lkdGggPSAwO1xyXG4gICAgICAgIHNwUmVzdWx0SW1nLm5vZGUuaGVpZ2h0ID0gMDtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgaGludERhdGFVUkwgPSBIVE1MX0NhbnZhc19oaW50LnRvRGF0YVVSTChcImltYWdlL3BuZ1wiKTtcclxuICAgICAgICB2YXIgcmVmZXJlbmNlRGF0YVVSTCA9IEhUTUxfQ2FudmFzX3JlZmVyZW5jZS50b0RhdGFVUkwoXCJpbWFnZS9wbmdcIik7XHJcbiAgICAgICAgdmFyIHNrZXRjaERhdGFVUkwgPSBIVE1MX0NhbnZhc19za2V0Y2gudG9EYXRhVVJMKFwiaW1hZ2UvcG5nXCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICB4aHIub3BlbihcIlBPU1RcIiwgXCIvcGFpbnRcIiwgdHJ1ZSk7XHJcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIixcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtcIik7XHJcbiAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBsb2FkTG9jYWxSZXN1bHQoeGhyLnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZihza2V0Y2hJRCE9XCJuZXdcIil7XHJcbiAgICAgICAgICAgIHNrZXRjaERhdGFVUkwgPSBcIm51bGxcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYocmVmZXJlbmNlSUQhPVwibmV3XCIpe1xyXG4gICAgICAgICAgICByZWZlcmVuY2VEYXRhVVJMID0gXCJudWxsXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHhoci5zZW5kXHJcbiAgICAgICAgICAgIChcclxuICAgICAgICAgICAgXCJza2V0Y2g9XCIrZW5jb2RlVVJJQ29tcG9uZW50KHNrZXRjaERhdGFVUkwpK1xyXG4gICAgICAgICAgICBcIiZyZWZlcmVuY2U9XCIrZW5jb2RlVVJJQ29tcG9uZW50KHJlZmVyZW5jZURhdGFVUkwpK1xyXG4gICAgICAgICAgICBcIiZoaW50PVwiK2VuY29kZVVSSUNvbXBvbmVudChoaW50RGF0YVVSTCkrXHJcbiAgICAgICAgICAgIFwiJnZlcnNpb249XCIrdmVyc2lvbi50b1N0cmluZygpK1xyXG4gICAgICAgICAgICBcIiZkZW5vaXNlPVwiK3RoaXMuZGVub2lzZS5nZXRDb21wb25lbnQoJ2NjLlRvZ2dsZScpLmlzQ2hlY2tlZC50b1N0cmluZygpK1xyXG4gICAgICAgICAgICBcIiZza2V0Y2hJRD1cIitza2V0Y2hJRCtcclxuICAgICAgICAgICAgXCImcmVmZXJlbmNlSUQ9XCIrcmVmZXJlbmNlSURcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICBzcEJUTi5lbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgc3BMQUIuc3RyaW5nID0gXCJXYWl0aW5nXCI7XHJcbiAgICAgICAgdGhpcy53ZWxjb21lLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgfSxcclxuICAgIG9uRG93bmxvYWRDbGlja2VkOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIGlmKHJlc3VsdFVSTD09XCJcIil7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgd2luZG93Lm9wZW4ocmVzdWx0VVJMKTtcclxuICAgIH0sXHJcbiAgICBoYW5kbGVQYWludGVyOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHBhaW50aW5nID0gZmFsc2U7XHJcbiAgICAgICAgdmFyIHJlbGF0aXZlWCA9IDA7XHJcbiAgICAgICAgdmFyIHJlbGF0aXZlWSA9IDA7XHJcbiAgICAgICAgdmFyIHJlZlBvc2l0aW9uID0gc3BTa2V0Y2hJbWcubm9kZS5jb252ZXJ0VG9Xb3JsZFNwYWNlKHNwU2tldGNoSW1nLm5vZGUucG9zaXRpb24pO1xyXG4gICAgICAgIGlmKHJlZlBvc2l0aW9uICE9IG51bGwgJiYgbW91c2VQb3NpdGlvbiAhPSBudWxsKXtcclxuICAgICAgICAgICAgdmFyIGJlZ2luWCA9IHJlZlBvc2l0aW9uLnggLSAyNTY7XHJcbiAgICAgICAgICAgIHZhciBiZWdpblkgPSByZWZQb3NpdGlvbi55IC0gMjU2O1xyXG4gICAgICAgICAgICByZWxhdGl2ZVggPSBtb3VzZVBvc2l0aW9uLnggLSBiZWdpblg7XHJcbiAgICAgICAgICAgIHJlbGF0aXZlWSA9IG1vdXNlUG9zaXRpb24ueSAtIGJlZ2luWTtcclxuICAgICAgICAgICAgdmFyIG1vdXNlSW5Ta2V0Y2ggPSAocmVsYXRpdmVYID4gMCAmJiByZWxhdGl2ZVkgPiAwICYmIHJlbGF0aXZlWCA8IHNwU2tldGNoSW1nLm5vZGUud2lkdGggJiYgcmVsYXRpdmVZIDwgc3BTa2V0Y2hJbWcubm9kZS5oZWlnaHQpO1xyXG4gICAgICAgICAgICBpZihtb3VzZUluU2tldGNoKXtcclxuICAgICAgICAgICAgICAgIHBhaW50aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihwYWludGluZyl7XHJcbiAgICAgICAgICAgIGlmKG1vdXNlSXNEb3duKXtcclxuICAgICAgICAgICAgICAgIHZhciBjeHQ9SFRNTF9DYW52YXNfaGludC5nZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmKGlzUGVuKXtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcGVuID0gNiAtIHZlcnNpb247XHJcbiAgICAgICAgICAgICAgICAgICAgY3h0LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGN4dC5hcmMocGFyc2VJbnQocGFyc2VGbG9hdChyZWxhdGl2ZVgpIC8gcGFyc2VGbG9hdChzcEhpbnROb2RlLndpZHRoKSAqIHBhcnNlRmxvYXQoSFRNTF9DYW52YXNfaGludC53aWR0aCkpLCBwYXJzZUludChwYXJzZUZsb2F0KHNwSGludE5vZGUuaGVpZ2h0IC0gcmVsYXRpdmVZKSAvIHBhcnNlRmxvYXQoc3BIaW50Tm9kZS5oZWlnaHQpICogcGFyc2VGbG9hdChIVE1MX0NhbnZhc19oaW50LmhlaWdodCkpLCBwZW4sIDAsIE1hdGguUEkgKiAyLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICBjeHQuY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbG9yID0gc3BDb2xvckltZy5ub2RlLmNvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgY3h0LmZpbGxTdHlsZSA9ICdyZ2JhKCcrY29sb3Iuci50b1N0cmluZygpKycsJytjb2xvci5nLnRvU3RyaW5nKCkrJywnK2NvbG9yLmIudG9TdHJpbmcoKSsnLDAuNjE4KSc7XHJcbiAgICAgICAgICAgICAgICAgICAgY3h0LmZpbGwoKTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjeHQ9SFRNTF9DYW52YXNfaGludC5nZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY3h0LmNsZWFyUmVjdChwYXJzZUludChwYXJzZUZsb2F0KHJlbGF0aXZlWCkgLyBwYXJzZUZsb2F0KHNwSGludE5vZGUud2lkdGgpICogcGFyc2VGbG9hdChIVE1MX0NhbnZhc19oaW50LndpZHRoKSkgLSAxMCwgcGFyc2VJbnQocGFyc2VGbG9hdChzcEhpbnROb2RlLmhlaWdodCAtIHJlbGF0aXZlWSkgLyBwYXJzZUZsb2F0KHNwSGludE5vZGUuaGVpZ2h0KSAqIHBhcnNlRmxvYXQoSFRNTF9DYW52YXNfaGludC5oZWlnaHQpKSAtIDEwLDIwLDIwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdmFyIGhpbnROb2RlVGV4ID0gc3BIaW50Tm9kZS5nZXRDb21wb25lbnQoJ2NjLlNwcml0ZScpLnNwcml0ZUZyYW1lLmdldFRleHR1cmUoKTtcclxuICAgICAgICAgICAgICAgIGhpbnROb2RlVGV4LmluaXRXaXRoRWxlbWVudChIVE1MX0NhbnZhc19oaW50KTtcclxuICAgICAgICAgICAgICAgIGhpbnROb2RlVGV4LmhhbmRsZUxvYWRlZFRleHR1cmUodHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgaGFuZGxlQ29sb3JQaWNrZXI6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIHJlZlBvc2l0aW9uID0gc3BSZWZlcmVuZUltZy5ub2RlLmNvbnZlcnRUb1dvcmxkU3BhY2Uoc3BSZWZlcmVuZUltZy5ub2RlLnBvc2l0aW9uKTtcclxuICAgICAgICAgICAgaWYocmVmUG9zaXRpb24gIT0gbnVsbCAmJiBtb3VzZVBvc2l0aW9uICE9IG51bGwpe1xyXG4gICAgICAgICAgICAgICAgdmFyIGJlZ2luWCA9IHJlZlBvc2l0aW9uLng7XHJcbiAgICAgICAgICAgICAgICB2YXIgYmVnaW5ZID0gcmVmUG9zaXRpb24ueTtcclxuICAgICAgICAgICAgICAgIHZhciByZWxhdGl2ZVggPSBtb3VzZVBvc2l0aW9uLnggLSBiZWdpblg7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVsYXRpdmVZID0gbW91c2VQb3NpdGlvbi55IC0gYmVnaW5ZO1xyXG4gICAgICAgICAgICAgICAgbW91c2VJblJlZmVyZW5jZSA9IChyZWxhdGl2ZVggPiAwICYmIHJlbGF0aXZlWSA+IDAgJiYgcmVsYXRpdmVYIDwgc3BSZWZlcmVuZUltZy5ub2RlLndpZHRoICYmIHJlbGF0aXZlWSA8IHNwUmVmZXJlbmVJbWcubm9kZS5oZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgaWYobW91c2VJblJlZmVyZW5jZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIXByZU1vdXNlSW5SZWYpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RpbmdDb2xvciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmKGdldE1vdXNlRG93bil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHNlbGVjdGluZ0NvbG9yKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mbGFnLnggPSByZWxhdGl2ZVggLSBzcFJlZmVyZW5lSW1nLm5vZGUud2lkdGggLyAyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZsYWcueSA9IHJlbGF0aXZlWSAtIHNwUmVmZXJlbmVJbWcubm9kZS5oZWlnaHQgLyAyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5hbFggPSByZWxhdGl2ZVg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsWSA9IHJlbGF0aXZlWTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNQZW4gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoc2VsZWN0aW5nQ29sb3Ipe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RpbmdDb2xvciA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGV4dHVyZSA9IHNwUmVmZXJlbmVJbWcuc3ByaXRlRnJhbWUuZ2V0VGV4dHVyZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcENvbG9ySW1nLm5vZGUuY29sb3IgPSBzcFJlZmVyZW5lSW1nLnNwcml0ZUZyYW1lLmdldFRleHR1cmUoKS5nZXRQaXhlbHMoZmluYWxYLGZpbmFsWSxzcFJlZmVyZW5lSW1nLm5vZGUud2lkdGgsc3BSZWZlcmVuZUltZy5ub2RlLmhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYoc2VsZWN0aW5nQ29sb3Ipe1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZXh0dXJlID0gc3BSZWZlcmVuZUltZy5zcHJpdGVGcmFtZS5nZXRUZXh0dXJlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3BDb2xvckltZy5ub2RlLmNvbG9yID0gc3BSZWZlcmVuZUltZy5zcHJpdGVGcmFtZS5nZXRUZXh0dXJlKCkuZ2V0UGl4ZWxzKHJlbGF0aXZlWCxyZWxhdGl2ZVksc3BSZWZlcmVuZUltZy5ub2RlLndpZHRoLHNwUmVmZXJlbmVJbWcubm9kZS5oZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuICAgICAgICBpZihsb2FkZWQpe1xyXG4gICAgICAgICAgICB0aGlzLmhhbmRsZUNvbG9yUGlja2VyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlUGFpbnRlcigpO1xyXG4gICAgICAgICAgICBpZihzZWxlY3RpbmdDb2xvcilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5jdXJzb3I9J2Nyb3NzaGFpcic7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZihwYWludGluZylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5jdXJzb3I9J2Nyb3NzaGFpcic7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmN1cnNvcj0nZGVmYXVsdCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJlTW91c2VJblJlZiA9IG1vdXNlSW5SZWZlcmVuY2U7XHJcbiAgICAgICAgZ2V0TW91c2VEb3duID0gZmFsc2U7XHJcbiAgICB9LFxyXG59KTtcclxuIiwiY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIHVybDp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XCJcIix0eXBlOlN0cmluZ1xyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgb25PcGVuOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgd2luZG93Lm9wZW4odGhpcy51cmwpO1xyXG4gICAgfSxcclxufSk7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=