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

    self.load_url = function (url, callback) {
        self.image.onload = function () {
            if (this.complete) {
                setTimeout(function() {callback(document.getElementById(imageID));}, 100);
            }
        };
        self.image.src = url;
    };

    return self;
};