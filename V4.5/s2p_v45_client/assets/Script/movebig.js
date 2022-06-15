cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad: function () {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            if(event!=null){
                var delta = event.touch.getDelta();
                for(let i=0; i<4; i++){
                    window.cp_drager[i].x += delta.x;
                    window.cp_drager[i].y += delta.y;
                    if(window.cp_drager[i].x < - window.cpNode.width / 2.0){
                        window.cp_drager[i].x = - window.cpNode.width / 2.0;
                    }
                    if(window.cp_drager[i].x >  window.cpNode.width / 2.0){
                        window.cp_drager[i].x =  window.cpNode.width / 2.0;
                    }
                    if(window.cp_drager[i].y < - window.cpNode.height / 2.0){
                        window.cp_drager[i].y = - window.cpNode.height / 2.0;
                    }
                    if(window.cp_drager[i].y >  window.cpNode.height / 2.0){
                        window.cp_drager[i].y =  window.cpNode.height / 2.0;
                    }
                }
                window.crop_dragger_A.ontiii(null);
            }
        }, this.node);
    },

    update: function (dt) {

    },
});
