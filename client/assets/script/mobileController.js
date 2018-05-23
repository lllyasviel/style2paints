// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        isInLeft: true,
        isMenuShow: false,
        parentCanvas: {
            default: null, type: cc.Node
        },
    },

    // onLoad () {},

    on_Process () {
        let animation = this.node.getComponent(cc.Animation);
        if (this.isInLeft) {
            this.parentCanvas.getComponent('controller').requireResult();
            window.touchGesture.init();
            animation.play('mobileRootMoveToLeft');
        } else {
            animation.play('mobileRootMoveToRight');
        }
        this.isInLeft = !this.isInLeft;
    },

    on_Menu () {
        let animation = this.node.getComponent(cc.Animation);
        if (this.isMenuShow) {
            setTimeout(()=>{
                window.colorPickerPanelNode.active = false;
                for(let item of window.colorPickerPanelNode.getChildren()) {
                    item.active = false;
                    for(let itemChild of item.getChildren()) {
                        itemChild.active = false;
                    }
                }
            },250)
            animation.play('arrowDown');
        } else {
            window.colorPickerPanelNode.active = true;
            for(let item of window.colorPickerPanelNode.getChildren()) {
                item.active = true;
                for(let itemChild of item.getChildren()) {
                    itemChild.active = true;
                }
            }
            animation.play('arrowUp');
        }
        this.isMenuShow = !this.isMenuShow;
    },

    on_blank_start () {
        this.parentCanvas.getComponent('controller').on_blank_start();
        this.isMenuShow = false;
        this.on_Menu();
    },

    // update (dt) {},
});
