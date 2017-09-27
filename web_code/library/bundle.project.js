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
    } else {
        spBTN.enabled = true;
        spLAB.string = "<u>colorize</u>";
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvQ29udHJvbGxlci5qcyIsImFzc2V0cy9zY3JpcHQvb3BlblVSTC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDSTtBQUlIOztBQUVEO0FBQ0k7QUFDSDs7QUFFRDtBQUNJO0FBQ0g7O0FBRUQ7QUFDSTtBQUNIO0FBQ0k7QUFDRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTjtBQUNEO0FBQ0c7O0FBRUk7QUFDTjtBQUNBO0FBRUk7QUFDQTtBQUNIO0FBR0c7QUFDQTtBQUNIOztBQUVEO0FBQ0E7QUFDQTtBQUVJO0FBQ0E7QUFDSDtBQUdHO0FBQ0E7QUFDSDs7QUFFRDtBQUNBO0FBQ0E7QUFDTTs7QUFFQTtBQUNBOztBQUVBO0FBQ047O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ007QUFDQTtBQUNBO0FBQ0E7O0FBRU47QUFDQTtBQUNHO0FBQ0o7QUFDQTs7QUFFRDtBQUNJO0FBQ0g7QUFDSTtBQUNHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNOO0FBQ0Q7QUFDRzs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7QUFDRztBQUNJO0FBQ0g7QUFDSjs7QUFFRDtBQUNJO0FBRUk7QUFDQTtBQUNIO0FBR0c7QUFDQTtBQUNIO0FBQ0o7O0FBRUQ7QUFDQTs7QUFFQTtBQUNNOztBQUVBO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNIO0FBQ0E7QUFDRztBQUNBO0FBQ0g7QUFDSjs7QUFFRDtBQUNJO0FBQ0g7QUFDSTtBQUNHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNOO0FBQ0Q7QUFDRzs7QUFFSTtBQUNOOztBQUVBO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUNHO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7O0FBRUQ7QUFDTTs7QUFFTjtBQUVJO0FBQ0E7QUFDSDtBQUdHO0FBQ0E7QUFDSDs7QUFFSztBQUNOOztBQUVBO0FBQ0E7QUFDQTtBQUVJO0FBQ0E7QUFDSDtBQUdHO0FBQ0E7QUFDSDs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFTTtBQUNIOztBQUVHO0FBQ047QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0c7QUFDSjtBQUNBOztBQUVEO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7O0FBRUQ7QUFDSTs7QUFFQTtBQUNJO0FBQ0k7QUFETTtBQUdWO0FBQ0k7QUFEUztBQUdiO0FBQ0k7QUFETTtBQUdWO0FBQ0k7QUFESztBQUdUO0FBQ0k7QUFEQztBQUdMO0FBQ0k7QUFEQztBQUdMO0FBQ0k7QUFEQTtBQUdKO0FBQ0k7QUFESTtBQUdSO0FBQ0k7QUFESTtBQXpCQTs7QUE4Qlo7QUFDSTtBQUNBO0FBQ0g7O0FBRUQ7QUFDSTtBQUNBO0FBQ0g7O0FBRUQ7QUFDSTtBQUNBO0FBQ0g7O0FBRUQ7QUFDSTtBQUNBO0FBQ0g7O0FBRUQ7O0FBRUk7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJO0FBQ0g7O0FBRUQ7QUFDSTtBQUNIOztBQUVEO0FBQ0k7QUFDQTtBQUNIOztBQUVEO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBRUg7O0FBRUQ7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0c7QUFDTjtBQUNBO0FBQ0c7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDs7QUFFRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQVVBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNHO0FBQ0E7QUFDSDs7QUFFRDtBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7QUFDRDtBQUNJO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNDO0FBQ0o7QUFDSjtBQUNHO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7QUFDUjtBQUNEO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFFSTtBQUNIO0FBR0c7QUFDSDtBQUdHO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSDtBQTVRSTs7Ozs7Ozs7OztBQ3RSVDtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBREE7QUFESTtBQUtaO0FBQ0k7QUFDSDtBQVRJIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHNwU2tldGNoSW1nO1xyXG52YXIgc3BSZWZlcmVuZUltZztcclxudmFyIHNwUmVzdWx0SW1nO1xyXG52YXIgc3BDb2xvckltZztcclxudmFyIHNwSGludE5vZGU7XHJcbnZhciBzcEJUTjtcclxudmFyIHNwTEFCO1xyXG5cclxudmFyIGZpbGVJbnB1dEZvclNrZXRjaDtcclxudmFyIGZpbGVJbnB1dEZvclJlZmVyZW5lO1xyXG5cclxudmFyIG1vdXNlUG9zaXRpb247XHJcbnZhciBtb3VzZUluUmVmZXJlbmNlID0gZmFsc2U7XHJcblxyXG52YXIgbG9hZGVkID0gZmFsc2U7XHJcblxyXG52YXIgZ2V0TW91c2VEb3duID0gZmFsc2U7XHJcbnZhciBwcmVNb3VzZUluUmVmID0gZmFsc2U7XHJcbnZhciBzZWxlY3RpbmdDb2xvciA9IGZhbHNlO1xyXG52YXIgcGFpbnRpbmcgPSBmYWxzZTtcclxudmFyIGZpbmFsWD0wO1xyXG52YXIgZmluYWxZPTA7XHJcblxyXG52YXIgaGFzU2tldGNoPWZhbHNlO1xyXG52YXIgaGFzUmVmPWZhbHNlO1xyXG5cclxudmFyIEhUTUxfQ2FudmFzX3NrZXRjaDtcclxudmFyIEhUTUxfQ2FudmFzX3JlZmVyZW5jZTtcclxudmFyIEhUTUxfQ2FudmFzX2hpbnQ7XHJcblxyXG52YXIgaXNQZW4gPSB0cnVlO1xyXG5cclxudmFyIG1vdXNlSXNEb3duID0gZmFsc2U7XHJcblxyXG52YXIgc2tldGNoSUQgPSBcIm5ld1wiO1xyXG52YXIgcmVmZXJlbmNlSUQgPSBcIm5ld1wiO1xyXG52YXIgdGVtcElEO1xyXG5cclxudmFyIHJlc3VsdFVSTCA9IFwiXCI7XHJcblxyXG52YXIgdmVyc2lvbiA9IDI7XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVPYmplY3RVUkwoYmxvYil7XHJcbiAgICBpZih3aW5kb3cuVVJMICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgcmV0dXJuIHdpbmRvd1snVVJMJ11bJ2NyZWF0ZU9iamVjdFVSTCddKGJsb2IpO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHJldHVybiB3aW5kb3dbJ3dlYmtpdFVSTCddWydjcmVhdGVPYmplY3RVUkwnXShibG9iKTtcclxufVxyXG5cclxuZnVuY3Rpb24gb25Ta2V0Y2hGaWxlU2VsZWN0ZWQoZXZ0KSB7XHJcbiAgICBsb2FkTG9jYWxTa2V0Y2goY3JlYXRlT2JqZWN0VVJMKGV2dC50YXJnZXQuZmlsZXNbMF0pKTtcclxufVxyXG5cclxuZnVuY3Rpb24gb25SZWZlcmVuZUZpbGVTZWxlY3RlZChldnQpIHtcclxuICAgIGxvYWRMb2NhbFJlZmVyZW5jZShjcmVhdGVPYmplY3RVUkwoZXZ0LnRhcmdldC5maWxlc1swXSkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBsb2FkTG9jYWxSZWZlcmVuY2UodXJpKXtcclxuICAgIHZhciB0ZW1wRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0ZW1wRGl2UmVmZXJlbmNlXCIpO1xyXG5cdGlmKHRlbXBEaXY9PT1udWxsKXtcclxuXHQgICAgdmFyIHRlbXBEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGVtcERpdik7XHJcbiAgICAgICAgdGVtcERpdi5zdHlsZS5wb3NpdGlvbj1cImFic29sdXRlXCI7XHJcbiAgICAgICAgdGVtcERpdi5pZD1cInRlbXBEaXZSZWZlcmVuY2VcIjtcclxuICAgICAgICB0ZW1wRGl2LmlubmVySFRNTCA9ICc8aW1nIGlkPWltZ2hlYWRSZWZlcmVuY2U+JztcclxuICAgICAgICB0ZW1wRGl2LnN0eWxlLmRpc3BsYXk9J25vbmUnO1xyXG4gICAgICAgIHRlbXBEaXYuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XHJcblx0fVxyXG5cdHZhciBpbWcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW1naGVhZFJlZmVyZW5jZScpO1xyXG4gICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHdfMjI0ID0gcGFyc2VGbG9hdCh0aGlzLndpZHRoKTtcclxuXHRcdHZhciBoXzIyNCA9IHBhcnNlRmxvYXQodGhpcy5oZWlnaHQpO1xyXG5cdFx0aWYod18yMjQgPiBoXzIyNClcclxuXHRcdHtcclxuXHRcdCAgICB3XzIyNCA9IDIyNC4wIC8gaF8yMjQgKiB3XzIyNDtcclxuXHRcdCAgICBoXzIyNCA9IDIyNC4wO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZVxyXG5cdFx0e1xyXG5cdFx0ICAgIGhfMjI0ID0gMjI0LjAgLyB3XzIyNCAqIGhfMjI0O1xyXG5cdFx0ICAgIHdfMjI0ID0gMjI0LjA7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHZhciB3XzIwMCA9IHBhcnNlRmxvYXQodGhpcy53aWR0aCk7XHJcblx0XHR2YXIgaF8yMDAgPSBwYXJzZUZsb2F0KHRoaXMuaGVpZ2h0KTtcclxuXHRcdGlmKHdfMjAwIDwgaF8yMDApXHJcblx0XHR7XHJcblx0XHQgICAgd18yMDAgPSAyMDAuMCAvIGhfMjAwICogd18yMDA7XHJcblx0XHQgICAgaF8yMDAgPSAyMDAuMDtcclxuXHRcdH1cclxuXHRcdGVsc2VcclxuXHRcdHtcclxuXHRcdCAgICBoXzIwMCA9IDIwMC4wIC8gd18yMDAgKiBoXzIwMDtcclxuXHRcdCAgICB3XzIwMCA9IDIwMC4wO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRzcFJlZmVyZW5lSW1nLm5vZGUud2lkdGggPSBwYXJzZUludCh3XzIwMCk7XHJcblx0XHRzcFJlZmVyZW5lSW1nLm5vZGUuaGVpZ2h0ID0gcGFyc2VJbnQoaF8yMDApO1xyXG5cdFx0SFRNTF9DYW52YXNfcmVmZXJlbmNlLndpZHRoID0gcGFyc2VJbnQod18yMjQpO1xyXG4gICAgICAgIEhUTUxfQ2FudmFzX3JlZmVyZW5jZS5oZWlnaHQgPSBwYXJzZUludChoXzIyNCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgSFRNTF9DYW52YXNfcmVmZXJlbmNlLmdldENvbnRleHQoXCIyZFwiKS5kcmF3SW1hZ2UodGhpcywgMCwgMCwgSFRNTF9DYW52YXNfcmVmZXJlbmNlLndpZHRoLCBIVE1MX0NhbnZhc19yZWZlcmVuY2UuaGVpZ2h0KTtcclxuICAgICAgICBIVE1MX0NhbnZhc19oaW50LmdldENvbnRleHQoXCIyZFwiKS5jbGVhclJlY3QoMCwwLEhUTUxfQ2FudmFzX2hpbnQud2lkdGgsSFRNTF9DYW52YXNfaGludC5oZWlnaHQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciByZWZlcmVuY2VOb2RlVGV4dHVyZSA9IHNwUmVmZXJlbmVJbWcuc3ByaXRlRnJhbWUuZ2V0VGV4dHVyZSgpO1xyXG5cdFx0dmFyIGhpbnROb2RlVGV4dHVyZSA9IHNwSGludE5vZGUuZ2V0Q29tcG9uZW50KCdjYy5TcHJpdGUnKS5zcHJpdGVGcmFtZS5nZXRUZXh0dXJlKCk7XHJcbiAgICAgICAgXHJcblx0XHRoaW50Tm9kZVRleHR1cmUuaW5pdFdpdGhFbGVtZW50KEhUTUxfQ2FudmFzX2hpbnQpO1xyXG5cdFx0aGludE5vZGVUZXh0dXJlLmhhbmRsZUxvYWRlZFRleHR1cmUoKTtcclxuXHRcdFxyXG5cdFx0cmVmZXJlbmNlTm9kZVRleHR1cmUuaW5pdFdpdGhFbGVtZW50KEhUTUxfQ2FudmFzX3JlZmVyZW5jZSk7XHJcblx0XHRyZWZlcmVuY2VOb2RlVGV4dHVyZS5oYW5kbGVMb2FkZWRUZXh0dXJlKCk7XHJcblx0XHRcclxuXHRcdHZhciB0ZW1wQ2FudmFzXzIwMCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcbiAgICAgICAgdGVtcENhbnZhc18yMDAud2lkdGggPSBwYXJzZUludCh3XzIwMCk7XHJcbiAgICAgICAgdGVtcENhbnZhc18yMDAuaGVpZ2h0ID0gcGFyc2VJbnQoaF8yMDApO1xyXG4gICAgICAgIHRlbXBDYW52YXNfMjAwLmdldENvbnRleHQoXCIyZFwiKS5kcmF3SW1hZ2UodGhpcywgMCwgMCwgdGVtcENhbnZhc18yMDAud2lkdGgsIHRlbXBDYW52YXNfMjAwLmhlaWdodCk7XHJcbiAgICAgICAgcmVmZXJlbmNlTm9kZVRleHR1cmUuX3BpeGVscyA9IHRlbXBDYW52YXNfMjAwLmdldENvbnRleHQoXCIyZFwiKS5nZXRJbWFnZURhdGEoMCwgMCwgdGVtcENhbnZhc18yMDAud2lkdGgsIHRlbXBDYW52YXNfMjAwLmhlaWdodCkuZGF0YTtcclxuXHRcdFxyXG5cdFx0aGFzUmVmID0gdHJ1ZTtcclxuXHRcdHJlZmVyZW5jZUlEID0gXCJuZXdcIjtcclxuICAgIH1cclxuXHRpbWcuc3JjID0gdXJpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBsb2FkTG9jYWxSZXN1bHQodXJpKXtcclxuICAgIHZhciB0ZW1wRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0ZW1wRGl2UmVzdWx0XCIpO1xyXG5cdGlmKHRlbXBEaXY9PT1udWxsKXtcclxuXHQgICAgdmFyIHRlbXBEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGVtcERpdik7XHJcbiAgICAgICAgdGVtcERpdi5zdHlsZS5wb3NpdGlvbj1cImFic29sdXRlXCI7XHJcbiAgICAgICAgdGVtcERpdi5pZD1cInRlbXBEaXZSZXN1bHRcIjtcclxuICAgICAgICB0ZW1wRGl2LmlubmVySFRNTCA9ICc8aW1nIGlkPWltZ2hlYWRSZXN1bHQ+JztcclxuICAgICAgICB0ZW1wRGl2LnN0eWxlLmRpc3BsYXk9J25vbmUnO1xyXG4gICAgICAgIHRlbXBEaXYuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XHJcblx0fVxyXG5cdHZhciBpbWcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW1naGVhZFJlc3VsdCcpO1xyXG4gICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgXHJcblx0XHR2YXIgdGV4dHVyZSA9IHNwUmVzdWx0SW1nLnNwcml0ZUZyYW1lLmdldFRleHR1cmUoKTtcclxuXHRcdHRleHR1cmUuaW5pdFdpdGhFbGVtZW50KHRoaXMpO1xyXG5cdFx0dGV4dHVyZS5oYW5kbGVMb2FkZWRUZXh0dXJlKCk7XHJcblx0XHR2YXIgdyA9IHBhcnNlRmxvYXQodGhpcy53aWR0aCk7XHJcblx0XHR2YXIgaCA9IHBhcnNlRmxvYXQodGhpcy5oZWlnaHQpO1xyXG5cdFx0XHJcblx0XHR2YXIgc21hbGwgPSB0cnVlO1xyXG5cdFx0XHJcblx0XHRpZih3Pmgpe1xyXG5cdFx0ICAgIGlmKHc+NzI0KXtcclxuXHRcdCAgICAgICAgc21hbGwgPSBmYWxzZTtcclxuXHRcdCAgICB9XHJcblx0XHR9ZWxzZXtcclxuXHRcdCAgICBpZihoPjcyNCl7XHJcblx0XHQgICAgICAgIHNtYWxsID0gZmFsc2U7XHJcblx0XHQgICAgfVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRpZighc21hbGwpe1xyXG5cdFx0ICAgIGlmKHc8aClcclxuXHRcdCAgICB7XHJcblx0XHQgICAgICAgIHcgPSA3MjQuMCAvIGggKiB3O1xyXG5cdFx0ICAgICAgICBoID0gNzI0LjA7XHJcblx0XHQgICAgfVxyXG5cdFx0ICAgIGVsc2VcclxuXHRcdCAgICB7XHJcblx0XHQgICAgICAgIGggPSA3MjQuMCAvIHcgKiBoO1xyXG5cdFx0ICAgICAgICB3ID0gNzI0LjA7XHJcblx0XHQgICAgfVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRzcFJlc3VsdEltZy5ub2RlLndpZHRoID0gcGFyc2VJbnQodyk7XHJcblx0XHRzcFJlc3VsdEltZy5ub2RlLmhlaWdodCA9IHBhcnNlSW50KGgpO1xyXG5cdFx0XHJcblx0XHRzcEJUTi5lbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICBzcExBQi5zdHJpbmcgPSBcIjx1PmNvbG9yaXplPC91PlwiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHNrZXRjaElEID0gdGVtcElEWzBdO1xyXG4gICAgICAgIHJlZmVyZW5jZUlEID0gdGVtcElEWzFdO1xyXG4gICAgfVxyXG4gICAgdGVtcElEID0gdXJpLnNwbGl0KFwiKlwiKTtcclxuICAgIGlmKHRlbXBJRC5sZW5ndGg9PTIpe1xyXG4gICAgICAgIHJlc3VsdFVSTCA9IFwicmVzdWx0cy9cIiArIHRlbXBJRFswXSArIFwiLmpwZz90PVwiICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygpO1xyXG5cdCAgICBpbWcuc3JjID0gcmVzdWx0VVJMO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgc3BCVE4uZW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgc3BMQUIuc3RyaW5nID0gXCI8dT5jb2xvcml6ZTwvdT5cIjtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbG9hZExvY2FsU2tldGNoKHVyaSl7XHJcbiAgICB2YXIgdGVtcERpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGVtcERpdlNrZXRjaFwiKTtcclxuXHRpZih0ZW1wRGl2PT09bnVsbCl7XHJcblx0ICAgIHZhciB0ZW1wRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRlbXBEaXYpO1xyXG4gICAgICAgIHRlbXBEaXYuc3R5bGUucG9zaXRpb249XCJhYnNvbHV0ZVwiO1xyXG4gICAgICAgIHRlbXBEaXYuaWQ9XCJ0ZW1wRGl2U2tldGNoXCI7XHJcbiAgICAgICAgdGVtcERpdi5pbm5lckhUTUwgPSAnPGltZyBpZD1pbWdoZWFkU2tldGNoPic7XHJcbiAgICAgICAgdGVtcERpdi5zdHlsZS5kaXNwbGF5PSdub25lJztcclxuICAgICAgICB0ZW1wRGl2LnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xyXG5cdH1cclxuXHR2YXIgaW1nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ltZ2hlYWRTa2V0Y2gnKTtcclxuICAgIGltZy5vbmxvYWQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciB3ID0gcGFyc2VGbG9hdCh0aGlzLndpZHRoKTtcclxuXHRcdHZhciBoID0gcGFyc2VGbG9hdCh0aGlzLmhlaWdodCk7XHJcblx0XHRcclxuXHRcdGlmKGg8dyl7XHJcblx0XHQgICAgaWYoaD4xMDI0KXtcclxuXHRcdCAgICAgICAgdyA9IDEwMjQuMCAvIGggKiB3O1xyXG5cdFx0ICAgICAgICBoID0gMTAyNC4wO1xyXG5cdFx0ICAgIH1cclxuXHRcdH1lbHNle1xyXG5cdFx0ICAgIGlmKHc+MTAyNCl7XHJcblx0XHQgICAgICAgIGggPSAxMDI0LjAgLyB3ICogaDtcclxuXHRcdCAgICAgICAgdyA9IDEwMjQuMDtcclxuXHRcdCAgICB9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdEhUTUxfQ2FudmFzX3NrZXRjaC53aWR0aCA9IHBhcnNlSW50KHcpO1xyXG4gICAgICAgIEhUTUxfQ2FudmFzX3NrZXRjaC5oZWlnaHQgPSBwYXJzZUludChoKTtcclxuICAgICAgICBcclxuXHRcdGlmKHcgPiBoKVxyXG5cdFx0e1xyXG5cdFx0ICAgIHcgPSA1MTIuMCAvIGggKiB3O1xyXG5cdFx0ICAgIGggPSA1MTIuMDtcclxuXHRcdH1cclxuXHRcdGVsc2VcclxuXHRcdHtcclxuXHRcdCAgICBoID0gNTEyLjAgLyB3ICogaDtcclxuXHRcdCAgICB3ID0gNTEyLjA7XHJcblx0XHR9XHJcbiAgICAgICAgXHJcbiAgICAgICAgSFRNTF9DYW52YXNfaGludC53aWR0aCA9IHBhcnNlSW50KHcpO1xyXG5cdFx0SFRNTF9DYW52YXNfaGludC5oZWlnaHQgPSBwYXJzZUludChoKTtcclxuICAgICAgICBcclxuXHRcdHcgPSBwYXJzZUZsb2F0KHRoaXMud2lkdGgpO1xyXG5cdFx0aCA9IHBhcnNlRmxvYXQodGhpcy5oZWlnaHQpO1xyXG5cdFx0aWYodyA8IGgpXHJcblx0XHR7XHJcblx0XHQgICAgdyA9IDUxMi4wIC8gaCAqIHc7XHJcblx0XHQgICAgaCA9IDUxMi4wO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZVxyXG5cdFx0e1xyXG5cdFx0ICAgIGggPSA1MTIuMCAvIHcgKiBoO1xyXG5cdFx0ICAgIHcgPSA1MTIuMDtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0c3BTa2V0Y2hJbWcubm9kZS53aWR0aCA9IHBhcnNlSW50KHcpO1xyXG5cdFx0c3BTa2V0Y2hJbWcubm9kZS5oZWlnaHQgPSBwYXJzZUludChoKTtcclxuXHRcdHNwSGludE5vZGUud2lkdGggPSBwYXJzZUludCh3KTtcclxuXHRcdHNwSGludE5vZGUuaGVpZ2h0ID0gcGFyc2VJbnQoaCk7XHJcblxyXG4gICAgICAgIEhUTUxfQ2FudmFzX3NrZXRjaC5nZXRDb250ZXh0KFwiMmRcIikuZHJhd0ltYWdlKHRoaXMsIDAsIDAsIEhUTUxfQ2FudmFzX3NrZXRjaC53aWR0aCwgSFRNTF9DYW52YXNfc2tldGNoLmhlaWdodCk7XHJcblx0ICAgIEhUTUxfQ2FudmFzX2hpbnQuZ2V0Q29udGV4dChcIjJkXCIpLmNsZWFyUmVjdCgwLDAsSFRNTF9DYW52YXNfaGludC53aWR0aCxIVE1MX0NhbnZhc19oaW50LmhlaWdodCk7XHJcblx0ICAgIFxyXG4gICAgICAgIHZhciBoaW50Tm9kZVRleHR1cmUgPSBzcEhpbnROb2RlLmdldENvbXBvbmVudCgnY2MuU3ByaXRlJykuc3ByaXRlRnJhbWUuZ2V0VGV4dHVyZSgpO1xyXG5cdFx0aGludE5vZGVUZXh0dXJlLmluaXRXaXRoRWxlbWVudChIVE1MX0NhbnZhc19oaW50KTtcclxuXHRcdGhpbnROb2RlVGV4dHVyZS5oYW5kbGVMb2FkZWRUZXh0dXJlKCk7XHJcblx0XHRcclxuXHRcdHZhciBza2V0Y2hOb2RlVGV4dHVyZSA9IHNwU2tldGNoSW1nLnNwcml0ZUZyYW1lLmdldFRleHR1cmUoKTtcclxuXHRcdHNrZXRjaE5vZGVUZXh0dXJlLmluaXRXaXRoRWxlbWVudChIVE1MX0NhbnZhc19za2V0Y2gpO1xyXG5cdFx0c2tldGNoTm9kZVRleHR1cmUuaGFuZGxlTG9hZGVkVGV4dHVyZSgpO1xyXG5cdFx0XHJcblx0XHRoYXNTa2V0Y2ggPSB0cnVlO1xyXG5cdFx0c2tldGNoSUQgPSBcIm5ld1wiO1xyXG5cdFx0cmVmZXJlbmNlSUQgPSBcIm5ld1wiO1xyXG4gICAgfVxyXG5cdGltZy5zcmMgPSB1cmk7XHJcbn1cclxuXHJcbmNjLlRleHR1cmUyRC5wcm90b3R5cGUuX3BpeGVscyA9IFtdO1xyXG5jYy5UZXh0dXJlMkQucHJvdG90eXBlLmdldFBpeGVscyA9IGZ1bmN0aW9uKHgseSxuZXdXaWR0aCxuZXdIZWlnaHQpe1xyXG4gICAgdmFyIGlkeCA9IHBhcnNlSW50KChuZXdIZWlnaHQtcGFyc2VJbnQoeSkpICogbmV3V2lkdGggKiA0ICsgcGFyc2VJbnQoeCkgKiA0KTtcclxuICAgIHJldHVybiBuZXcgY2MuY29sb3IodGhpcy5fcGl4ZWxzW2lkeF0sdGhpcy5fcGl4ZWxzW2lkeCArIDFdLHRoaXMuX3BpeGVsc1tpZHggKyAyXSk7XHJcbn07XHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIHNrZXRjaEltZzp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCx0eXBlOmNjLk5vZGVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlZmVyZW5jZUltZzp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCx0eXBlOmNjLk5vZGVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlc3VsdEltZzp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCx0eXBlOmNjLk5vZGVcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvbG9ySW1nOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLHR5cGU6Y2MuTm9kZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmxhZzp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCx0eXBlOmNjLk5vZGVcclxuICAgICAgICB9LFxyXG4gICAgICAgIGhpbnQ6e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsdHlwZTpjYy5Ob2RlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBidG46e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsdHlwZTpjYy5Ob2RlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZW5vaXNlOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLHR5cGU6Y2MuTm9kZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgd2VsY29tZTp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCx0eXBlOmNjLk5vZGVcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIFxyXG4gICAgb25WMTogZnVuY3Rpb24oKXtcclxuICAgICAgICB2ZXJzaW9uID0gMTtcclxuICAgICAgICB0aGlzLm9uQ2xlYXJDbGlja2VkKCk7XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBvblYyOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZlcnNpb24gPSAyO1xyXG4gICAgICAgIHRoaXMub25DbGVhckNsaWNrZWQoKTtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIG9uVjM6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmVyc2lvbiA9IDM7XHJcbiAgICAgICAgdGhpcy5vbkNsZWFyQ2xpY2tlZCgpO1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgb25WNDogZnVuY3Rpb24oKXtcclxuICAgICAgICB2ZXJzaW9uID0gNDtcclxuICAgICAgICB0aGlzLm9uQ2xlYXJDbGlja2VkKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNjLmRpcmVjdG9yLnNldENsZWFyQ29sb3IoY2MuY29sb3IoMCwgMCwgMCwgMCkpXHJcbiAgICAgICAgXHJcbiAgICAgICAgc3BTa2V0Y2hJbWcgPSB0aGlzLnNrZXRjaEltZy5nZXRDb21wb25lbnQoJ2NjLlNwcml0ZScpO1xyXG4gICAgICAgIHNwUmVmZXJlbmVJbWcgPSB0aGlzLnJlZmVyZW5jZUltZy5nZXRDb21wb25lbnQoJ2NjLlNwcml0ZScpO1xyXG4gICAgICAgIHNwUmVzdWx0SW1nID0gdGhpcy5yZXN1bHRJbWcuZ2V0Q29tcG9uZW50KCdjYy5TcHJpdGUnKTtcclxuICAgICAgICBzcENvbG9ySW1nID0gdGhpcy5jb2xvckltZy5nZXRDb21wb25lbnQoJ2NjLlNwcml0ZScpO1xyXG4gICAgICAgIHNwSGludE5vZGUgPSB0aGlzLmhpbnQ7XHJcbiAgICAgICAgc3BCVE4gPSB0aGlzLmJ0bi5nZXRDb21wb25lbnQoJ2NjLkJ1dHRvbicpO1xyXG4gICAgICAgIHNwTEFCID0gdGhpcy5idG4uZ2V0Q29tcG9uZW50KCdjYy5SaWNoVGV4dCcpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZpbGVJbnB1dEZvclNrZXRjaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgICBmaWxlSW5wdXRGb3JTa2V0Y2guaWQgPSBcImZpbGVJbnB1dEZvclNrZXRjaFwiO1xyXG4gICAgICAgIGZpbGVJbnB1dEZvclNrZXRjaC50eXBlID0gXCJmaWxlXCI7XHJcbiAgICAgICAgZmlsZUlucHV0Rm9yU2tldGNoLmFjY2VwdCA9IFwiaW1hZ2UvKlwiO1xyXG4gICAgICAgIGZpbGVJbnB1dEZvclNrZXRjaC5zdHlsZS5oZWlnaHQgPSBcIjBweFwiO1xyXG4gICAgICAgIGZpbGVJbnB1dEZvclNrZXRjaC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgICAgIGZpbGVJbnB1dEZvclNrZXRjaC5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5pbnNlcnRCZWZvcmUoZmlsZUlucHV0Rm9yU2tldGNoLGRvY3VtZW50LmJvZHkuZmlyc3RDaGlsZCk7XHJcbiAgICAgICAgZmlsZUlucHV0Rm9yU2tldGNoLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIG9uU2tldGNoRmlsZVNlbGVjdGVkLCBmYWxzZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZmlsZUlucHV0Rm9yUmVmZXJlbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgICAgZmlsZUlucHV0Rm9yUmVmZXJlbmUuaWQgPSBcImZpbGVJbnB1dEZvclJlZmVyZW5lXCI7XHJcbiAgICAgICAgZmlsZUlucHV0Rm9yUmVmZXJlbmUudHlwZSA9IFwiZmlsZVwiO1xyXG4gICAgICAgIGZpbGVJbnB1dEZvclJlZmVyZW5lLmFjY2VwdCA9IFwiaW1hZ2UvKlwiO1xyXG4gICAgICAgIGZpbGVJbnB1dEZvclJlZmVyZW5lLnN0eWxlLmhlaWdodCA9IFwiMHB4XCI7XHJcbiAgICAgICAgZmlsZUlucHV0Rm9yUmVmZXJlbmUuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgICAgICBmaWxlSW5wdXRGb3JSZWZlcmVuZS5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5pbnNlcnRCZWZvcmUoZmlsZUlucHV0Rm9yUmVmZXJlbmUsZG9jdW1lbnQuYm9keS5maXJzdENoaWxkKTtcclxuICAgICAgICBmaWxlSW5wdXRGb3JSZWZlcmVuZS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBvblJlZmVyZW5lRmlsZVNlbGVjdGVkLCBmYWxzZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKFwibW91c2Vtb3ZlXCIsIGZ1bmN0aW9uIChldmVudCkgeyBcclxuICAgICAgICAgICAgbW91c2VQb3NpdGlvbiA9IGV2ZW50LmdldExvY2F0aW9uKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKFwibW91c2Vkb3duXCIsIGZ1bmN0aW9uIChldmVudCkgeyBcclxuICAgICAgICAgICAgbW91c2VJc0Rvd24gPSB0cnVlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMubm9kZS5vbihcIm1vdXNldXBcIiwgZnVuY3Rpb24gKGV2ZW50KSB7IFxyXG4gICAgICAgICAgICBnZXRNb3VzZURvd24gPSB0cnVlO1xyXG4gICAgICAgICAgICBtb3VzZUlzRG93biA9IGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIEhUTUxfQ2FudmFzX2hpbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG4gICAgICAgIEhUTUxfQ2FudmFzX2hpbnQuaWQgPSBcIkhUTUxfQ2FudmFzX2hpbnRcIjtcclxuICAgICAgICBcclxuICAgICAgICBIVE1MX0NhbnZhc19yZWZlcmVuY2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG4gICAgICAgIEhUTUxfQ2FudmFzX3JlZmVyZW5jZS5pZCA9IFwiSFRNTF9DYW52YXNfcmVmZXJlbmNlXCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgSFRNTF9DYW52YXNfc2tldGNoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcclxuICAgICAgICBIVE1MX0NhbnZhc19za2V0Y2guaWQgPSBcIkhUTUxfQ2FudmFzX3NrZXRjaFwiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBvblNrZXRjaENsaWNrZWQ6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgZmlsZUlucHV0Rm9yU2tldGNoLmNsaWNrKCk7XHJcbiAgICB9LFxyXG4gICAgb25SZWZlbmNlQ2xpY2tlZDogZnVuY3Rpb24oKXtcclxuICAgICAgICBmaWxlSW5wdXRGb3JSZWZlcmVuZS5jbGljaygpO1xyXG4gICAgfSxcclxuICAgIG9uUGVuQ2xpY2tlZDogZnVuY3Rpb24oKXtcclxuICAgICAgICBpc1BlbiA9IHRydWU7XHJcbiAgICB9LFxyXG4gICAgb25FcmFzZXJDbGlja2VkOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIGlzUGVuID0gZmFsc2U7XHJcbiAgICB9LFxyXG4gICAgb25DbGVhckNsaWNrZWQ6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIGN4dD1IVE1MX0NhbnZhc19oaW50LmdldENvbnRleHQoXCIyZFwiKTtcclxuXHQgICAgY3h0LmNsZWFyUmVjdCgwLDAsSFRNTF9DYW52YXNfaGludC53aWR0aCxIVE1MX0NhbnZhc19oaW50LmhlaWdodCk7XHJcbiAgICAgICAgdmFyIGhpbnROb2RlVGV4ID0gc3BIaW50Tm9kZS5nZXRDb21wb25lbnQoJ2NjLlNwcml0ZScpLnNwcml0ZUZyYW1lLmdldFRleHR1cmUoKTtcclxuXHRcdGhpbnROb2RlVGV4LmluaXRXaXRoRWxlbWVudChIVE1MX0NhbnZhc19oaW50KTtcclxuXHRcdGhpbnROb2RlVGV4LmhhbmRsZUxvYWRlZFRleHR1cmUoKTtcclxuICAgIH0sXHJcbiAgICBvbkNvbG9yaXplQ2xpY2tlZDogZnVuY3Rpb24oKXtcclxuICAgICAgICBpZighaGFzUmVmKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZighaGFzU2tldGNoKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBzcFJlc3VsdEltZy5ub2RlLndpZHRoID0gMDtcclxuICAgICAgICBzcFJlc3VsdEltZy5ub2RlLmhlaWdodCA9IDA7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIGhpbnREYXRhVVJMID0gSFRNTF9DYW52YXNfaGludC50b0RhdGFVUkwoXCJpbWFnZS9wbmdcIik7XHJcbiAgICAgICAgdmFyIHJlZmVyZW5jZURhdGFVUkwgPSBIVE1MX0NhbnZhc19yZWZlcmVuY2UudG9EYXRhVVJMKFwiaW1hZ2UvcG5nXCIpO1xyXG4gICAgICAgIHZhciBza2V0Y2hEYXRhVVJMID0gSFRNTF9DYW52YXNfc2tldGNoLnRvRGF0YVVSTChcImltYWdlL3BuZ1wiKTtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgeGhyLm9wZW4oXCJQT1NUXCIsIFwiL3BhaW50XCIsIHRydWUpO1xyXG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7XCIpO1xyXG4gICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbG9hZExvY2FsUmVzdWx0KHhoci5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYoc2tldGNoSUQhPVwibmV3XCIpe1xyXG4gICAgICAgICAgICBza2V0Y2hEYXRhVVJMID0gXCJudWxsXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHJlZmVyZW5jZUlEIT1cIm5ld1wiKXtcclxuICAgICAgICAgICAgcmVmZXJlbmNlRGF0YVVSTCA9IFwibnVsbFwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICB4aHIuc2VuZFxyXG4gICAgICAgICAgICAoXHJcbiAgICAgICAgICAgIFwic2tldGNoPVwiK2VuY29kZVVSSUNvbXBvbmVudChza2V0Y2hEYXRhVVJMKStcclxuICAgICAgICAgICAgXCImcmVmZXJlbmNlPVwiK2VuY29kZVVSSUNvbXBvbmVudChyZWZlcmVuY2VEYXRhVVJMKStcclxuICAgICAgICAgICAgXCImaGludD1cIitlbmNvZGVVUklDb21wb25lbnQoaGludERhdGFVUkwpK1xyXG4gICAgICAgICAgICBcIiZ2ZXJzaW9uPVwiK3ZlcnNpb24udG9TdHJpbmcoKStcclxuICAgICAgICAgICAgXCImZGVub2lzZT1cIit0aGlzLmRlbm9pc2UuZ2V0Q29tcG9uZW50KCdjYy5Ub2dnbGUnKS5pc0NoZWNrZWQudG9TdHJpbmcoKStcclxuICAgICAgICAgICAgXCImc2tldGNoSUQ9XCIrc2tldGNoSUQrXHJcbiAgICAgICAgICAgIFwiJnJlZmVyZW5jZUlEPVwiK3JlZmVyZW5jZUlEXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgc3BCVE4uZW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIHNwTEFCLnN0cmluZyA9IFwiV2FpdGluZ1wiO1xyXG4gICAgICAgIHRoaXMud2VsY29tZS5hY3RpdmUgPSBmYWxzZTtcclxuICAgIH0sXHJcbiAgICBvbkRvd25sb2FkQ2xpY2tlZDogZnVuY3Rpb24oKXtcclxuICAgICAgICBpZihyZXN1bHRVUkw9PVwiXCIpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdpbmRvdy5vcGVuKHJlc3VsdFVSTCk7XHJcbiAgICB9LFxyXG4gICAgaGFuZGxlUGFpbnRlcjogZnVuY3Rpb24oKXtcclxuICAgICAgICBwYWludGluZyA9IGZhbHNlO1xyXG4gICAgICAgIHZhciByZWxhdGl2ZVggPSAwO1xyXG4gICAgICAgIHZhciByZWxhdGl2ZVkgPSAwO1xyXG4gICAgICAgIHZhciByZWZQb3NpdGlvbiA9IHNwU2tldGNoSW1nLm5vZGUuY29udmVydFRvV29ybGRTcGFjZShzcFNrZXRjaEltZy5ub2RlLnBvc2l0aW9uKTtcclxuICAgICAgICBpZihyZWZQb3NpdGlvbiAhPSBudWxsICYmIG1vdXNlUG9zaXRpb24gIT0gbnVsbCl7XHJcbiAgICAgICAgICAgIHZhciBiZWdpblggPSByZWZQb3NpdGlvbi54IC0gMjU2O1xyXG4gICAgICAgICAgICB2YXIgYmVnaW5ZID0gcmVmUG9zaXRpb24ueSAtIDI1NjtcclxuICAgICAgICAgICAgcmVsYXRpdmVYID0gbW91c2VQb3NpdGlvbi54IC0gYmVnaW5YO1xyXG4gICAgICAgICAgICByZWxhdGl2ZVkgPSBtb3VzZVBvc2l0aW9uLnkgLSBiZWdpblk7XHJcbiAgICAgICAgICAgIHZhciBtb3VzZUluU2tldGNoID0gKHJlbGF0aXZlWCA+IDAgJiYgcmVsYXRpdmVZID4gMCAmJiByZWxhdGl2ZVggPCBzcFNrZXRjaEltZy5ub2RlLndpZHRoICYmIHJlbGF0aXZlWSA8IHNwU2tldGNoSW1nLm5vZGUuaGVpZ2h0KTtcclxuICAgICAgICAgICAgaWYobW91c2VJblNrZXRjaCl7XHJcbiAgICAgICAgICAgICAgICBwYWludGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYocGFpbnRpbmcpe1xyXG4gICAgICAgICAgICBpZihtb3VzZUlzRG93bil7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3h0PUhUTUxfQ2FudmFzX2hpbnQuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZihpc1Blbil7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBlbiA9IDYgLSB2ZXJzaW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIGN4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgICAgICBjeHQuYXJjKHBhcnNlSW50KHBhcnNlRmxvYXQocmVsYXRpdmVYKSAvIHBhcnNlRmxvYXQoc3BIaW50Tm9kZS53aWR0aCkgKiBwYXJzZUZsb2F0KEhUTUxfQ2FudmFzX2hpbnQud2lkdGgpKSwgcGFyc2VJbnQocGFyc2VGbG9hdChzcEhpbnROb2RlLmhlaWdodCAtIHJlbGF0aXZlWSkgLyBwYXJzZUZsb2F0KHNwSGludE5vZGUuaGVpZ2h0KSAqIHBhcnNlRmxvYXQoSFRNTF9DYW52YXNfaGludC5oZWlnaHQpKSwgcGVuLCAwLCBNYXRoLlBJICogMiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY3h0LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb2xvciA9IHNwQ29sb3JJbWcubm9kZS5jb2xvclxyXG4gICAgICAgICAgICAgICAgICAgIGN4dC5maWxsU3R5bGUgPSAncmdiYSgnK2NvbG9yLnIudG9TdHJpbmcoKSsnLCcrY29sb3IuZy50b1N0cmluZygpKycsJytjb2xvci5iLnRvU3RyaW5nKCkrJywwLjYxOCknO1xyXG4gICAgICAgICAgICAgICAgICAgIGN4dC5maWxsKCk7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY3h0PUhUTUxfQ2FudmFzX2hpbnQuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGN4dC5jbGVhclJlY3QocGFyc2VJbnQocGFyc2VGbG9hdChyZWxhdGl2ZVgpIC8gcGFyc2VGbG9hdChzcEhpbnROb2RlLndpZHRoKSAqIHBhcnNlRmxvYXQoSFRNTF9DYW52YXNfaGludC53aWR0aCkpIC0gMTAsIHBhcnNlSW50KHBhcnNlRmxvYXQoc3BIaW50Tm9kZS5oZWlnaHQgLSByZWxhdGl2ZVkpIC8gcGFyc2VGbG9hdChzcEhpbnROb2RlLmhlaWdodCkgKiBwYXJzZUZsb2F0KEhUTUxfQ2FudmFzX2hpbnQuaGVpZ2h0KSkgLSAxMCwyMCwyMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHZhciBoaW50Tm9kZVRleCA9IHNwSGludE5vZGUuZ2V0Q29tcG9uZW50KCdjYy5TcHJpdGUnKS5zcHJpdGVGcmFtZS5nZXRUZXh0dXJlKCk7XHJcbiAgICAgICAgICAgICAgICBoaW50Tm9kZVRleC5pbml0V2l0aEVsZW1lbnQoSFRNTF9DYW52YXNfaGludCk7XHJcbiAgICAgICAgICAgICAgICBoaW50Tm9kZVRleC5oYW5kbGVMb2FkZWRUZXh0dXJlKHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGhhbmRsZUNvbG9yUGlja2VyOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciByZWZQb3NpdGlvbiA9IHNwUmVmZXJlbmVJbWcubm9kZS5jb252ZXJ0VG9Xb3JsZFNwYWNlKHNwUmVmZXJlbmVJbWcubm9kZS5wb3NpdGlvbik7XHJcbiAgICAgICAgICAgIGlmKHJlZlBvc2l0aW9uICE9IG51bGwgJiYgbW91c2VQb3NpdGlvbiAhPSBudWxsKXtcclxuICAgICAgICAgICAgICAgIHZhciBiZWdpblggPSByZWZQb3NpdGlvbi54O1xyXG4gICAgICAgICAgICAgICAgdmFyIGJlZ2luWSA9IHJlZlBvc2l0aW9uLnk7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVsYXRpdmVYID0gbW91c2VQb3NpdGlvbi54IC0gYmVnaW5YO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlbGF0aXZlWSA9IG1vdXNlUG9zaXRpb24ueSAtIGJlZ2luWTtcclxuICAgICAgICAgICAgICAgIG1vdXNlSW5SZWZlcmVuY2UgPSAocmVsYXRpdmVYID4gMCAmJiByZWxhdGl2ZVkgPiAwICYmIHJlbGF0aXZlWCA8IHNwUmVmZXJlbmVJbWcubm9kZS53aWR0aCAmJiByZWxhdGl2ZVkgPCBzcFJlZmVyZW5lSW1nLm5vZGUuaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIGlmKG1vdXNlSW5SZWZlcmVuY2Upe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCFwcmVNb3VzZUluUmVmKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW5nQ29sb3IgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZihnZXRNb3VzZURvd24pe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihzZWxlY3RpbmdDb2xvcil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmxhZy54ID0gcmVsYXRpdmVYIC0gc3BSZWZlcmVuZUltZy5ub2RlLndpZHRoIC8gMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mbGFnLnkgPSByZWxhdGl2ZVkgLSBzcFJlZmVyZW5lSW1nLm5vZGUuaGVpZ2h0IC8gMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxYID0gcmVsYXRpdmVYO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5hbFkgPSByZWxhdGl2ZVk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzUGVuID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHNlbGVjdGluZ0NvbG9yKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW5nQ29sb3IgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRleHR1cmUgPSBzcFJlZmVyZW5lSW1nLnNwcml0ZUZyYW1lLmdldFRleHR1cmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3BDb2xvckltZy5ub2RlLmNvbG9yID0gc3BSZWZlcmVuZUltZy5zcHJpdGVGcmFtZS5nZXRUZXh0dXJlKCkuZ2V0UGl4ZWxzKGZpbmFsWCxmaW5hbFksc3BSZWZlcmVuZUltZy5ub2RlLndpZHRoLHNwUmVmZXJlbmVJbWcubm9kZS5oZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmKHNlbGVjdGluZ0NvbG9yKXtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGV4dHVyZSA9IHNwUmVmZXJlbmVJbWcuc3ByaXRlRnJhbWUuZ2V0VGV4dHVyZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNwQ29sb3JJbWcubm9kZS5jb2xvciA9IHNwUmVmZXJlbmVJbWcuc3ByaXRlRnJhbWUuZ2V0VGV4dHVyZSgpLmdldFBpeGVscyhyZWxhdGl2ZVgscmVsYXRpdmVZLHNwUmVmZXJlbmVJbWcubm9kZS53aWR0aCxzcFJlZmVyZW5lSW1nLm5vZGUuaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcbiAgICAgICAgaWYobG9hZGVkKXtcclxuICAgICAgICAgICAgdGhpcy5oYW5kbGVDb2xvclBpY2tlcigpO1xyXG4gICAgICAgICAgICB0aGlzLmhhbmRsZVBhaW50ZXIoKTtcclxuICAgICAgICAgICAgaWYoc2VsZWN0aW5nQ29sb3IpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuY3Vyc29yPSdjcm9zc2hhaXInO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYocGFpbnRpbmcpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuY3Vyc29yPSdjcm9zc2hhaXInO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5jdXJzb3I9J2RlZmF1bHQnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByZU1vdXNlSW5SZWYgPSBtb3VzZUluUmVmZXJlbmNlO1xyXG4gICAgICAgIGdldE1vdXNlRG93biA9IGZhbHNlO1xyXG4gICAgfSxcclxufSk7XHJcbiIsImNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICB1cmw6e1xyXG4gICAgICAgICAgICBkZWZhdWx0OlwiXCIsdHlwZTpTdHJpbmdcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIG9uT3BlbjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHdpbmRvdy5vcGVuKHRoaXMudXJsKTtcclxuICAgIH0sXHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9