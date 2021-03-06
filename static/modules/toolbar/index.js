define(function(require){

    var qpf = require("qpf");
    var ko = require("knockout");
    var Module = require("../module");
    var xml = require("text!./toolbar.xml");
    var command = require("core/command");
    var $ = require("$");

    var project = require("project/project");

    var hierarchyModule = require("../hierarchy/index");
    var viewportModule = require("../viewport/index");

    require("./toolbargroup");

    var toolbar = new Module({
        name : "toolbar",
        xml : xml,

        createElement : function(){
            command.execute("create");
        },
        createImage : function(){
            var $imageInput = $("<input type='file' />");
            $imageInput[0].addEventListener("change", uploadImageFile);
            $imageInput.click();
        },
        createText : function(){
            command.execute("create", "text");
        },

        zoomIn : function(){
            var scale = viewportModule.viewportScale();
            viewportModule.viewportScale( Math.min( Math.max(scale+0.1, 0.2), 1.5) );
        },

        zoomOut : function(){
            var scale = viewportModule.viewportScale();
            viewportModule.viewportScale( Math.min( Math.max(scale-0.1, 0.2), 1.5) );
        },

        viewportScale : ko.computed(function(){
            return Math.floor(viewportModule.viewportScale() * 100) + "%";
        }),

        viewportWidth : viewportModule.viewportWidth,
        viewportHeight : viewportModule.viewportHeight,

        exportProject : function(){
            var result = project.export();
            var blob = new Blob([JSON.stringify(result, null, 2)], {
                type : "text/plain;charset=utf-8"
            });
            saveAs(blob, "example.epage");
        },
        importProject : function(){
            var $projectInput = $("<input type='file' />");
            $projectInput[0].addEventListener("change", uploadProjectFile);
            $projectInput.click();
        }
    });

    var fileReader = new FileReader();

    function uploadImageFile(e){
        var file = e.target.files[0];
        if(file && file.type.match(/image/)){
            fileReader.onload = function(e){
                fileReader.onload = null;
                command.execute("create", "image", {
                    src : e.target.result
                })

            }
            fileReader.readAsDataURL(file);
        }
    }

    function uploadProjectFile(e){
        var file = e.target.files[0];

        if(file && file.name.substr(-5) === 'epage'){
            fileReader.onload = function(e){
                fileReader.onload = null;

                var elements = project.import(JSON.parse(e.target.result));

            }
            fileReader.readAsText(file);
        }
    }

    require("elements/image");
    require("elements/text");

    return toolbar;
})