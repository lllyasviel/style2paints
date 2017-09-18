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
var finalX=0;
var finalY=0;

var hasSketch=false;
var hasRef=false;

var hintCan;

var isPen = true;

var mouseIsDown = false;

var resultURL = "";

function createObjectURL(blob){
    if(window.URL !== undefined)
        return window['URL']['createObjectURL'](blob);
    else
        return window['webkitURL']['createObjectURL'](blob);
}

function onSketchFileSelected(evt) {
    loadLocalSketch(createObjectURL(evt.target.files[0]));
}

function onRefereneFileSelected(evt) {
    loadLocalReference(createObjectURL(evt.target.files[0]));
}

function loadLocalReference(uri){
    var tempDiv = document.getElementById("tempDivReference");
	if(tempDiv===null){
	    var tempDiv = document.createElement("div");
        document.body.appendChild(tempDiv);
        tempDiv.style.position="absolute";
        tempDiv.id="tempDivReference";
        tempDiv.innerHTML = '<img id=imgheadReference>';
        tempDiv.style.display='none';
        tempDiv.style.visibility = "hidden";
	}
	var img = document.getElementById('imgheadReference');
    img.onload = function(){
		var texture=spRefereneImg.spriteFrame.getTexture();
		texture._pixels = [];
		texture.initWithElement(this);
		texture.handleLoadedTexture();
		var w = parseFloat(this.width);
		var h = parseFloat(this.height);
		if(w<h)
		{
		    w = 200.0 / h * w;
		    h = 200.0;
		}
		else
		{
		    h = 200.0 / w * h;
		    w = 200.0;
		}
		spRefereneImg.node.width = parseInt(w);
		spRefereneImg.node.height = parseInt(h);
		
		hasRef = true;
    }
	img.src = uri;
}

function loadLocalResult(uri){
    var tempDiv = document.getElementById("tempDivResult");
	if(tempDiv===null){
	    var tempDiv = document.createElement("div");
        document.body.appendChild(tempDiv);
        tempDiv.style.position="absolute";
        tempDiv.id="tempDivResult";
        tempDiv.innerHTML = '<img id=imgheadResult>';
        tempDiv.style.display='none';
        tempDiv.style.visibility = "hidden";
	}
	var img = document.getElementById('imgheadResult');
    img.onload = function(){
		var texture=spResultImg.spriteFrame.getTexture();
		texture._pixels = [];
		texture.initWithElement(this);
		texture.handleLoadedTexture();
		var w = parseFloat(this.width);
		var h = parseFloat(this.height);
		
		var small = true;
		
		if(w>h){
		    if(w>724){
		        small = false;
		    }
		}else{
		    if(h>724){
		        small = false;
		    }
		}
		
		if(!small){
		    if(w<h)
		    {
		        w = 724.0 / h * w;
		        h = 724.0;
		    }
		    else
		    {
		        h = 724.0 / w * h;
		        w = 724.0;
		    }
		}
		
		spResultImg.node.width = parseInt(w);
		spResultImg.node.height = parseInt(h);
    }
	img.src = uri;
}

function loadLocalSketch(uri){
    var tempDiv = document.getElementById("tempDivSketch");
	if(tempDiv===null){
	    var tempDiv = document.createElement("div");
        document.body.appendChild(tempDiv);
        tempDiv.style.position="absolute";
        tempDiv.id="tempDivSketch";
        tempDiv.innerHTML = '<img id=imgheadSketch>';
        tempDiv.style.display='none';
        tempDiv.style.visibility = "hidden";
	}
	var img = document.getElementById('imgheadSketch');
    img.onload = function(){
		var texture=spSketchImg.spriteFrame.getTexture();
		texture._pixels = [];
		texture.initWithElement(this);
		texture.handleLoadedTexture();
		var w = parseFloat(this.width);
		var h = parseFloat(this.height);
		if(w<h)
		{
		    w = 512.0 / h * w;
		    h = 512.0;
		}
		else
		{
		    h = 512.0 / w * h;
		    w = 512.0;
		}
		spSketchImg.node.width = parseInt(w);
		spSketchImg.node.height = parseInt(h);
		
		spHintNode.width = spSketchImg.node.width;
		spHintNode.height = spSketchImg.node.height;
		
		hintCan.width = spSketchImg.node.width;
		hintCan.height = spSketchImg.node.height;
		var cxt=hintCan.getContext("2d");
	    cxt.clearRect(0,0,hintCan.width,hintCan.height);
        var hintNodeTex = spHintNode.getComponent('cc.Sprite').spriteFrame.getTexture();
		hintNodeTex.initWithElement(hintCan);
		hintNodeTex.handleLoadedTexture();
		
		hasSketch = true;
    }
	img.src = uri;
}

cc.Texture2D.prototype._pixels = [];
cc.Texture2D.prototype.getPixels = function(x,y,newWidth,newHeight){
    if(!this._pixels || this._pixels.length == 0){ 
        var canvas = document.createElement("canvas");
        canvas.width = newWidth;
        canvas.height = newHeight;
        var ctx = canvas.getContext("2d");
        var obj = this.getHtmlElementObj();
        ctx.drawImage(obj, 0, 0, newWidth, newHeight);
        this._pixels = ctx.getImageData(0, 0, newWidth, newHeight).data;
    }
    var idx = parseInt((newHeight-parseInt(y)) * newWidth * 4 + parseInt(x) * 4);
    return new cc.color(this._pixels[idx],this._pixels[idx + 1],this._pixels[idx + 2]);
};

cc.Class({
    extends: cc.Component,

    properties: {
        sketchImg:{
            default:null,type:cc.Node
        },
        referenceImg:{
            default:null,type:cc.Node
        },
        resultImg:{
            default:null,type:cc.Node
        },
        colorImg:{
            default:null,type:cc.Node
        },
        flag:{
            default:null,type:cc.Node
        },
        hint:{
            default:null,type:cc.Node
        },
        btn:{
            default:null,type:cc.Node
        },
    },

    onLoad: function () {
        cc.renderer.enableDirtyRegion(false);

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
        document.body.insertBefore(fileInputForSketch,document.body.firstChild);
        fileInputForSketch.addEventListener('change', onSketchFileSelected, false);
        
        fileInputForReferene = document.createElement("input");
        fileInputForReferene.id = "fileInputForReferene";
        fileInputForReferene.type = "file";
        fileInputForReferene.accept = "image/*";
        fileInputForReferene.style.height = "0px";
        fileInputForReferene.style.display = "block";
        fileInputForReferene.style.overflow = "hidden";
        document.body.insertBefore(fileInputForReferene,document.body.firstChild);
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
        
        hintCan = document.createElement("canvas");
        hintCan.id = "hintcan";
        loaded = true;
        
    },
    
    onSketchClicked: function(){
        fileInputForSketch.click();
    },
    onRefenceClicked: function(){
        fileInputForReferene.click();
    },
    onPenClicked: function(){
        isPen = true;
    },
    onEraserClicked: function(){
        isPen = false;
    },
    onClearClicked: function(){
        var cxt=hintCan.getContext("2d");
	    cxt.clearRect(0,0,hintCan.width,hintCan.height);
        var hintNodeTex = spHintNode.getComponent('cc.Sprite').spriteFrame.getTexture();
		hintNodeTex.initWithElement(hintCan);
		hintNodeTex.handleLoadedTexture();
    },
    onColorizeClicked: function(){
        if(!hasRef){
            return;
        }
        if(!hasSketch){
            return;
        }
        
        var canvas = document.createElement("canvas");
        var texture = spSketchImg.spriteFrame.getTexture();
        var w = parseFloat(texture.width);
		var h = parseFloat(texture.height);
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(texture.getHtmlElementObj(), 0, 0, w, h);
        var sketchDataURL = canvas.toDataURL("image/png");
        
        texture = spRefereneImg.spriteFrame.getTexture();
        var w = parseFloat(texture.width);
		var h = parseFloat(texture.height);
		if(w>h)
		{
		    w = 256.0 / h * w;
		    h = 256.0;
		}
		else
		{
		    h = 256.0 / w * h;
		    w = 256.0;
		}
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(texture.getHtmlElementObj(), 0, 0, w, h);
        var referenceDataURL = canvas.toDataURL("image/png");
        
        var hintDataURL = hintCan.toDataURL("image/png");
        
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/paint", true);
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;");
        xhr.onreadystatechange = function() {
            resultURL = "data:image/png;base64,"+xhr.responseText;
            loadLocalResult(resultURL);
            spBTN.enabled = true;
            spLAB.string = "<u>colorize</u>";
        };
        xhr.send
            (
            "sketch="+encodeURIComponent(sketchDataURL)+
            "&reference="+encodeURIComponent(referenceDataURL)+
            "&hint="+encodeURIComponent(hintDataURL)
            );
        spBTN.enabled = false;
        spLAB.string = "Waiting";
    },
    onDownloadClicked: function(){
        if(resultURL==""){
            return;
        }
        var w=window.open('about:blank','image');
        w.document.write("<img src='"+resultURL+"' alt='from canvas'/>");
    },
    onTitle: function(){
        window.open('https://github.com/lllyasviel/style2paints','gitHub');
    },
    handlePainter: function(){
        painting = false;
        var relativeX = 0;
        var relativeY = 0;
        var refPosition = spSketchImg.node.convertToWorldSpace(spSketchImg.node.position);
        if(refPosition != null && mousePosition != null){
            var beginX = refPosition.x - 256;
            var beginY = refPosition.y - 256;
            relativeX = mousePosition.x - beginX;
            relativeY = mousePosition.y - beginY;
            var mouseInSketch = (relativeX > 0 && relativeY > 0 && relativeX < spSketchImg.node.width && relativeY < spSketchImg.node.height);
            if(mouseInSketch){
                painting = true;
            }
        }
        if(painting){
            if(mouseIsDown){
                var cxt=hintCan.getContext("2d");
                
                if(isPen){
                    cxt.beginPath();
                    cxt.arc(relativeX, spSketchImg.node.height - relativeY, 3, 0, Math.PI * 2, true);
                    cxt.closePath();
                    var color = spColorImg.node.color
                    cxt.fillStyle = 'rgba('+color.r.toString()+','+color.g.toString()+','+color.b.toString()+',0.5)';
                    cxt.fill();
                }else{
                    var cxt=hintCan.getContext("2d");
                    cxt.clearRect(relativeX-10,spSketchImg.node.height - relativeY-10,20,20);
                }
                
                var hintNodeTex = spHintNode.getComponent('cc.Sprite').spriteFrame.getTexture();
                hintNodeTex.initWithElement(hintCan);
                hintNodeTex.handleLoadedTexture();
            }
        }
    },
    handleColorPicker: function(){
        var refPosition = spRefereneImg.node.convertToWorldSpace(spRefereneImg.node.position);
            if(refPosition != null && mousePosition != null){
                var beginX = refPosition.x;
                var beginY = refPosition.y;
                var relativeX = mousePosition.x - beginX;
                var relativeY = mousePosition.y - beginY;
                mouseInReference = (relativeX > 0 && relativeY > 0 && relativeX < spRefereneImg.node.width && relativeY < spRefereneImg.node.height);
                if(mouseInReference){
                    if(!preMouseInRef){
                        selectingColor = true;
                    }
                    if(getMouseDown){
                        if(selectingColor){
                        this.flag.x = relativeX - spRefereneImg.node.width / 2;
                        this.flag.y = relativeY - spRefereneImg.node.height / 2;
                        finalX = relativeX;
                        finalY = relativeY;
                        isPen = true;
                        }
                    }
                }else{
                    if(selectingColor){
                        selectingColor = false;
                        var texture = spRefereneImg.spriteFrame.getTexture();
                        spColorImg.node.color = spRefereneImg.spriteFrame.getTexture().getPixels(finalX,finalY,spRefereneImg.node.width,spRefereneImg.node.height);
                    }
                }
                if(selectingColor){
                    var texture = spRefereneImg.spriteFrame.getTexture();
                    spColorImg.node.color = spRefereneImg.spriteFrame.getTexture().getPixels(relativeX,relativeY,spRefereneImg.node.width,spRefereneImg.node.height);
                }
            }
    },
    update: function (dt) {
        if(loaded){
            this.handleColorPicker();
            this.handlePainter();
            if(selectingColor)
            {
                document.body.style.cursor='crosshair';
            }
            else if(painting)
            {
                document.body.style.cursor='crosshair';
            }
            else
            {
                document.body.style.cursor='default';
            }
        }
        preMouseInRef = mouseInReference;
        getMouseDown = false;
    },
});
