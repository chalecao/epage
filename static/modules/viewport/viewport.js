define(function(require){

    var qpf = require("qpf");
    var ko = require("knockout");
    var Meta = qpf.use("meta/meta");

    var command = require("core/command");
    var contextMenu = require("modules/common/contextmenu");

    var Viewport = Meta.derive(function(){
        return {
            scale : ko.observable(1.0)
        }
    }, {
        type : 'VIEWPORT',
        css : "viewport",

        template : '<div class="qpf-viewport-elements-container"></div>\
                    <div class="qpf-viewport-ruler-h"></div>\
                    <div class="qpf-viewport-ruler-v"></div>',

        initialize : function(){
            this.scale.subscribe(this._scale, this);
            this._scale(this.scale());

            contextMenu.bindTo(this.$el, function(target){
                var $epageEl = $(target).parents('.epage-element');
                if($epageEl.length){
                    var items = [{
                        label : "删除",
                        exec : function(){
                            command.execute("remove", $epageEl.attr("data-epage-eid"));
                        }
                    }, {
                        label : "复制",
                        exec : function(){
                            command.execute("copy", $epageEl.attr("data-epage-eid"));
                        }
                    }];
                }else{
                    var items = [];
                }
                items.push({
                    label : "粘贴",
                    exec : function(){
                        var els = command.execute("paste");
                    }
                });
                return items;
            });
        },

        afterRender : function(){
            this._$elementsContainer = this.$el.find(".qpf-viewport-elements-container");
        },     

        addElement : function(el){
            if(this._$elementsContainer){
                this._$elementsContainer.append(el.$wrapper);
            }
        },

        removeElement : function(el){
            el.$wrapper.remove();
        },

        _scale : function(val){
            this.$el.css({
                "-webkit-transform" : "scale(" + val + "," + val +")",
                "-moz-transform" : "scale(" + val + "," + val +")",
                "-o-transform" : "scale(" + val + "," + val +")",
                "transform" : "scale(" + val + "," + val +")"
            });
        }
    })

    Meta.provideBinding("viewport", Viewport);

    return Viewport;
})