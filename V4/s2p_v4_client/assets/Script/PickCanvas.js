module.exports = function PickCanvas(name){

    let self = Object();

    self.spriteFrame = new cc.SpriteFrame();
    self.texture2d = null;

    self.source = null;

    self.canvas = document.createElement("canvas");
    self.canvas.id = 'canvas_' + name;

    self.canvas.width = 300;
    self.canvas.height = 1078;

    self.currentColor = new Array(255, 230, 200);
    self.floatingColor = new Array(0, 255, 0);

    self.bigall = [47079079.0, 112128144.0, 119136153.0, 105105105.0, 169169169.0, 211211211.0, 220220220.0, 176196222.0, 139.0, 25025112.0, 72061139.0, 75000130.0, 205.0, 123104238.0, 65105225.0, 100149237.0, 139187.0, 70130180.0, 30144255.0, 191255.0, 135206250.0, 135206235.0, 173216230.0, 255255.0, 95158160.0, 32178170.0, 102205170.0, 206209.0, 72209204.0, 64224208.0, 176224230.0, 175238238.0, 107142035.0, 85107047.0, 100000.0, 34139034.0, 46139087.0, 60179113.0, 50205050.0, 154205050.0, 127255212.0, 250154.0, 255127.0, 124252000.0, 127255000.0, 173255047.0, 144238144.0, 152251152.0, 139000139.0, 106090205.0, 138043226.0, 148000211.0, 153050204.0, 186085211.0, 147112219.0, 143188143.0, 139000000.0, 139069019.0, 165042042.0, 178034034.0, 160082045.0, 205092092.0, 210105030.0, 189183107.0, 220020060.0, 255020147.0, 255105180.0, 255000255.0, 218112214.0, 238130238.0, 221160221.0, 216191216.0, 188143143.0, 199021133.0, 219112147.0, 233150122.0, 240128128.0, 255160122.0, 255182193.0, 255192203.0, 255069000.0, 255099071.0, 255079080.0, 250128114.0, 255140000.0, 255165000.0, 244164096.0, 230230250.0, 184134011.0, 205133063.0, 218165032.0, 210180140.0, 222184135.0, 255215000.0, 255228225.0, 224255255.0, 240230140.0, 238232170.0, 250250210.0, 255250205.0, 245245220.0, 255248220.0, 255255224.0, 255218185.0, 245222179.0, 255222173.0, 255228181.0, 255228196.0, 255235205.0, 255239213.0, 250235215.0, 255240245.0, 240221195.0, 234182156.0, 240221208.0, 247206181.0, 238187153.0, 240208182.0, 234169143.0, 221169143.0, 247217214.0, 226199179.0, 247195156.0, 221169130.0, 234208182.0, 240186173.0, 166149141.0, 240221182.0, 234195169.0, 212128107.0, 158139130.0, 234182143.0, 247208195.0, 247182156.0, 235178133.0, 247195169.0, 247208182.0, 240195169.0, 195116077.0, 240208169.0, 234195182.0, 240169130.0, 69042029.0, 247208169.0, 247221195.0, 240182143.0, 236221202.0, 249249249.0];
    self.record = [];

    self.ctx = self.canvas.getContext('2d');

    self.ring = null;
    self.tring = null;

    self.ini = function (image) {
        self.ctx.drawImage(image, 0, 0, 300, 300);
        self.ring = self.ctx.getImageData(0, 0, 300, 300);
        self.tring = self.ctx.getImageData(0, 0, 164, 164);
        self.source = self.ctx.getImageData(0, 0, self.canvas.width, self.canvas.height);
        self.texture2d = new cc.Texture2D();
        self.spriteFrame.setTexture(self.texture2d);
        self.texture2d.initWithElement(self.canvas);
        self.texture2d.handleLoadedTexture(true);
        self.ctx = self.texture2d.getHtmlElementObj().getContext('2d');
        self.finish();
        return self.spriteFrame;
    };

    self.finish = function (image) {

        if(self.ring == null){
            return;
        }

        let cury = 0;

        self.ctx.fillStyle = 'rgb(80, 80, 80)';
        self.ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);

        self.ctx.putImageData(self.ring, 0, cury);

        cury += 300;

        let min_value = 1.0 * Math.min(Math.min(self.currentColor[0], self.currentColor[1]), self.currentColor[2]);
        let max_value = 1.0 * Math.max(Math.max(self.currentColor[0], self.currentColor[1]), self.currentColor[2]);
        let due_value = max_value - min_value + 0.0001;

        let r = (self.currentColor[0] * 1.0 - min_value + 0.0001) / due_value * 255.0;
        let g = (self.currentColor[1] * 1.0 - min_value + 0.0001) / due_value * 255.0;
        let b = (self.currentColor[2] * 1.0 - min_value + 0.0001) / due_value * 255.0;

        for(let x=0; x < 164; x++){
            for(let y=0; y < 164; y++){
                let idr_o = (x * 164 + 163 - y) * 4;
                let idg_o = idr_o + 1;
                let idb_o = idr_o + 2;
                let ida_o = idr_o + 3;
                let bc = (x * 1.0 / 164.0) * (255.0);
                let kc = (y * 1.0 / 164.0) * (255.0 - bc) / 255.0;
                self.tring.data[idr_o] = bc + r * kc;
                self.tring.data[idg_o] = bc + g * kc;
                self.tring.data[idb_o] = bc + b * kc;
                self.tring.data[ida_o] = 255;
            }
        }

        self.ctx.putImageData(self.tring, 68, 68);
        cury += 0;

        self.ctx.fillStyle = 'rgb(' + self.currentColor[0] + ',' + self.currentColor[1] + ', ' + self.currentColor[2] + ')';
        self.ctx.fillRect(8,cury + 5,142,30);

        self.ctx.fillStyle = 'rgb(' + self.floatingColor[0] + ',' + self.floatingColor[1] + ', ' + self.floatingColor[2] + ')';
        self.ctx.fillRect(150,cury + 5,142,30);

        cury += 40;

        for(let i = 0; i < self.record.length; i++){
            let x = parseInt(i % 8);
            let y = parseInt(i / 8);
            let allc = self.record[self.record.length - 1 - i];
            let bs = allc % 1000;
            allc = parseInt(allc / 1000);
            let gs = allc % 1000;
            allc = parseInt(allc / 1000);
            let rs = allc % 1000;
            self.ctx.beginPath();
            self.ctx.fillStyle = 'rgb(' + rs + ',' + gs + ', ' + bs + ')';
            self.ctx.arc(parseInt(x * 38 + 19),parseInt(cury + y * 38 + 19),16,0,Math.PI*2,true); 
            self.ctx.closePath();
            self.ctx.fill();
        }

        self.source = self.ctx.getImageData(0, 0, self.canvas.width, self.canvas.height);

    };

    self.finish_float = function (image) {
        if(self.ring == null){
            return;
        }
        let cury = 300;
        self.ctx.fillStyle = 'rgb(' + self.floatingColor[0] + ',' + self.floatingColor[1] + ', ' + self.floatingColor[2] + ')';
        self.ctx.fillRect(150,cury + 5,142,30);
    };

    self.get_color = function (x, y) {

        if(self.source==null){
            return new cc.color(255, 255, 255);
        }

        let idx = 0;

        idx = parseInt((1 - y) * self.canvas.height);
        idx = parseInt(idx * self.canvas.width);
        idx = parseInt(idx + x * self.canvas.width);
        idx = parseInt(idx * 4);

        return new cc.color(self.source.data[idx], self.source.data[idx + 1], self.source.data[idx + 2]);
    };

    return self;
};