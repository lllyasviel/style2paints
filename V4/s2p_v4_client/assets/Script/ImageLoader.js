module.exports = function ImageLoader(name){

    let self = Object();

    let tempID = 'tempDiv'+ name;
    let imageID = 'imgHead'+ name;

    let tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.id = tempID;
    tempDiv.innerHTML = '<img id=' + imageID + '>';
    tempDiv.style.display = 'none';
    tempDiv.style.visibility = "hidden";
    document.body.appendChild(tempDiv);

    self.image = document.getElementById(imageID);

    self.on_process = null;
    self.on_error = null;
    self.on_finish = null;

    self.load_url = function (url, callback) {
        self.image.onload = function () {
            callback(document.getElementById(imageID));
        };
        self.image.onerror = function () {
            if(self.on_error!=null){
                self.on_error();
            }
        };
        var xmlHTTP = new XMLHttpRequest();
        xmlHTTP.open( 'GET', url , true );
        xmlHTTP.responseType = 'arraybuffer';
        xmlHTTP.onprogress = function( e ) {
            if ( e.lengthComputable ){
                console.log(url + ' - ' + e.loaded + ' / ' + e.total);
                if(self.on_process!=null){
                    self.on_process(e.loaded / e.total);
                }
            }
        };
        xmlHTTP.onreadystatechange = function () {
            if (xmlHTTP.readyState==4 && xmlHTTP.status==200){
                try{
                    if(self.on_finish!=null){
                        console.log(url + ' - on_finish called');
                        self.on_finish();
                    }
                    var h = xmlHTTP.getAllResponseHeaders();
                    var m = h.match( /^Content-Type\:\s*(.*?)$/mi );
                    var mimeType = m[ 1 ] || 'image/png';
                    var blob = new Blob( [ this.response ], { type: mimeType } );
                    console.log(url + ' - finished');
                    self.image.src = window.URL.createObjectURL( blob );
                    console.log(url + ' - blobed');
                }catch(err){
                    console.log(err);
                    if(self.on_error!=null){
                        self.on_error();
                    }
                }
            }else{
                if(xmlHTTP.readyState==4){
                    if(self.on_error!=null){
                        self.on_error();
                    }
                }
            }
        };
        xmlHTTP.send();
    };

    return self;
};