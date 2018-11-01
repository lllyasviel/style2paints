module.exports = (function FileSelector(){

    let self = Object();

    self.html_obj = document.createElement("input");
    self.html_obj.id = 'FileSelector';
    self.html_obj.type = "file";
    self.html_obj.accept = "image/*";
    self.html_obj.style.height = "0px";
    self.html_obj.style.display = "block";
    self.html_obj.style.overflow = "hidden";
    document.body.insertBefore(self.html_obj, document.body.firstChild);

    self.actural_callback = null;
    self.url = "";

    self.fake_callback = function (evt) {

        if (window.URL !== undefined)
            self.url = window['URL']['createObjectURL'](evt.target.files[0]);
        else
            self.url =  window['webkitURL']['createObjectURL'](evt.target.files[0]);

        self.actural_callback(self.url);
    };

    self.html_obj.addEventListener('change', self.fake_callback, false);
    
    self.activate = function (m_callback) {
        self.actural_callback = m_callback;
        self.html_obj.click();
    };

    return self;
})();
