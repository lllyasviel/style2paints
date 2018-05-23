cc.Class({
    extends: cc.Component,

    properties: {
        colorPreviewNode: {
            default: null, type: cc.Node
        },
        colorSelectedNode: {
            default: null, type: cc.Node
        },
        maskNode: {
            default: null, type: cc.Node
        },
        wheelNode: {
            default: null, type: cc.Node
        },
        markerInNode: {
            default: null, type: cc.Node
        },
        markerWheelNode: {
            default: null, type: cc.Node
        },
        mainColorNode: {
            default: null, type: cc.Node
        },
        colorPickerPanelNode: {
            default: null, type: cc.Node
        },

    },

    onLoad () {
        window.colorPickerPanelNode = this.colorPickerPanelNode;
        window.colorPickerPanelNode.active = false;
        for(let item of window.colorPickerPanelNode.getChildren()) {
            item.active = false;
            for(let itemChild of item.getChildren()) {
                itemChild.active = false;
            }
        }

        const self = this;
        window.color_picker = {
            init () {
                this._h = 0;
                this._s = 1.0;
                this._l = 0.5;
                this.h = 0;
                this.s = 1.0;
                this.l = 0.5;
                window.colorSelectedNode.color = window.colorPreviewNode.color;
            },
            set hsl(val) {
                this._h = val[0]*360;
                this._s = val[1];
                this._l = val[2];
                this.colorChanged();
            },
            set h(val) {
                this._h = val;
                this.colorChanged();
            },
            set s(val) {
                this._s = val;
                this.colorChanged();
            },
            set l(val) {
                this._l = val;
                this.colorChanged();
            },
            get h() {
                return this._h;
            },
            get s() {
                return this._s;
            },
            get l() {
                return this._l;
            },
            colorChanged () {
                let tmpS = 1 - this._s - 0.5;
                let tmpL = this._l - 0.5;
                let x = tmpS * self.maskNode.width;
                let y = tmpL * self.maskNode.height;
                let p = cc.p(x,y).rotate(cc.degreesToRadians(45))
                self.markerInNode.x = p.x;
                self.markerInNode.y = p.y;
                self.markerWheelNode.rotation = this._h - 135;
                self.mainColorNode.color = self.HSLToRGB([this._h/360, 1, 0.5]);
                this.rgb = self.HSLToRGB([this._h/360,this._s,this._l]);
                if (!self.colorPreviewNode.color.equals(this.rgb)) {
                    self.colorPreviewNode.color = this.rgb;
                }
                window.color.r = this.rgb.getR();
                window.color.g = this.rgb.getG();
                window.color.b = this.rgb.getB();
            }
        }

        window.color_picker.init();

        let move_event = event => {
            window.mousePosition = event.getLocation();

            window.currentSensitiveNode = null;

            let mouseRelative, cur_position;
            window.mousePosition = cc.p(window.mousePosition.x, window.mousePosition.y);
            
            /** Mousedown in wheel */
            {
                cur_position = this.node.convertToWorldSpace(this.wheelNode.position);
                mouseRelative = window.mousePosition.sub(cur_position);
                if (mouseRelative.x > 0 && mouseRelative.y > 0 && mouseRelative.x < this.wheelNode.width && mouseRelative.y < this.wheelNode.height) {
                    let center = cc.p(this.wheelNode.width/2, this.wheelNode.height/2);
                    let MrSubC = mouseRelative.sub(center);
                    let length = MrSubC.mag();
                    if (window.mouseIsDown && length > this.maskNode.width/Math.SQRT2 && length < this.wheelNode.width) {
                        window.currentSensitiveNode = this.wheelNode;
                        window.mouseRelativeX = mouseRelative.x / this.wheelNode.width;
                        window.mouseRelativeY = mouseRelative.y / this.wheelNode.height;
                        window.wheelAngle = MrSubC.angle(cc.p(1,0)) * 180 / Math.PI * (MrSubC.y >= 0 ? -1 : 1);
                        let tmpH = window.wheelAngle + 135;
                        
                        while (tmpH < 0) {
                            tmpH = tmpH + 360;
                        } 
                        while (tmpH > 360) {
                            tmpH = tmpH - 360;
                        }
                        window.color_picker.h = tmpH;
                        window.isColorPicking = true;
                    }
                }
            }
            /** Mousedown in color mask */
            {
                cur_position = this.maskNode.convertToWorldSpace(this.maskNode.position);
                mouseRelative = window.mousePosition.sub(cur_position);
                if (window.mouseIsDown && mouseRelative.x > -this.maskNode.width/Math.SQRT2 && mouseRelative.y > 0 && mouseRelative.x < this.maskNode.width/Math.SQRT2 && mouseRelative.y < this.maskNode.height*Math.SQRT2) {
                    window.currentSensitiveNode = this.maskNode;
                    window.mouseRelativeX = mouseRelative.x / this.maskNode.width*Math.SQRT2;
                    window.mouseRelativeY = mouseRelative.y / this.maskNode.height*Math.SQRT2;
                    let tmpMouseRelative = mouseRelative.clone();
                    mouseRelative = cc.pRotateByAngle(mouseRelative, cc.p(0,0), cc.degreesToRadians(-45));
                    if (mouseRelative.x >=0 && mouseRelative.x <= this.maskNode.width && mouseRelative.y >=0 && mouseRelative.y <= this.maskNode.height) {
                        let tmpS = mouseRelative.x/this.maskNode.width;
                        if (tmpS > 0.98) {
                            tmpS = 1;
                        } else if (tmpS < 0.02) {
                            tmpS = 0;
                        }

                        let tmpL = mouseRelative.y/this.maskNode.height;
                        if (tmpL > 0.98) {
                            tmpL = 1;
                        } else if (tmpL < 0.02) {
                            tmpL = 0;
                        }

                        window.color_picker.s = 1 - tmpS;
                        window.color_picker.l = tmpL;
                        window.isColorPicking = true;
                    }
                }
            }
        }

        if (!cc.sys.isMobile) {

            this.node.on("mousemove", function (event) {
                event.stopPropagation();
                move_event(event);
            });
    
            this.node.on("mousedown", function (event) {
                event.stopPropagation();
                window.mouseIsDown = true;
            });
    
            this.node.on("mouseup", function (event) {
                event.stopPropagation();
                window.mouseIsDown = false;
                window.colorSelectedNode.color = window.colorPreviewNode.color;
            });
            
        } else {

            this.node.on("touchmove", function (event) {
                event.stopPropagation();
                move_event(event);
            });
    
            this.node.on("touchstart", function (event) {
                event.stopPropagation();
                window.mouseIsDown = true;
                move_event(event);
            });
    
            this.node.on("touchend", function (event) {
                event.stopPropagation();
                window.mouseIsDown = false;
                window.colorSelectedNode.color = window.colorPreviewNode.color;
            });

        }
    },

    HSLToRGB (hsl) {
        var m1, m2, r, g, b;
        var h = hsl[0], s = hsl[1], l = hsl[2];
        m2 = (l <= 0.5) ? l * (s + 1) : l + s - l*s;
        m1 = l * 2 - m2;
        return cc.color(
            this.hueToRGB(m1, m2, h+0.33333)*255,
            this.hueToRGB(m1, m2, h)*255,
            this.hueToRGB(m1, m2, h-0.33333)*255,
        255);
    },

    hueToRGB (m1, m2, h) {
        h = (h < 0) ? h + 1 : ((h > 1) ? h - 1 : h);
        if (h * 6 < 1) return m1 + (m2 - m1) * h * 6;
        if (h * 2 < 1) return m2;
        if (h * 3 < 2) return m1 + (m2 - m1) * (0.66666 - h) * 6;
        return m1;
    },

    RGBToHSL (rgb) {
        var min, max, delta, h, s, l;
        var r = rgb[0], g = rgb[1], b = rgb[2];
        min = Math.min(r, Math.min(g, b));
        max = Math.max(r, Math.max(g, b));
        delta = max - min;
        l = (min + max) / 2;
        s = 0;
        if (l > 0 && l < 1) {
          s = delta / (l < 0.5 ? (2 * l) : (2 - 2 * l));
        }
        h = 0;
        if (delta > 0) {
          if (max == r && max != g) h += (g - b) / delta;
          if (max == g && max != b) h += (2 + (b - r) / delta);
          if (max == b && max != r) h += (4 + (r - g) / delta);
          h /= 6;
        }
        return [h, s, l];
    },

    update (dt) {
        if (!this.colorPreviewNode.color.equals(window.color_picker.rgb) && window.currentSensitiveNode && window.currentSensitiveNode.name != this.wheelNode.name && window.currentSensitiveNode.name != this.maskNode.name) {
            let hsl = this.RGBToHSL([this.colorPreviewNode.color.getR()/255, this.colorPreviewNode.color.getG()/255, this.colorPreviewNode.color.getB()/255]);
            window.color_picker.hsl = hsl;
        }
    },
});
