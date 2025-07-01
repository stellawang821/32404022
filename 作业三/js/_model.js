var fs   = require('fs');
var path = require('path');

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Initialize codes.
AutoLoadPlugins();

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//You can load the plugins in global field, if the next line codes are uncommented.
AutoLoadGlobalPlugins();

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Sample codes.
exports.Test = function() {
        console.log("Hi, I'm a model test funciton");
};

exports.getTipTemplete = (title, vicon, detail, help = true) => {
        var pathPicture = process.env.COMX_SDK + 'picture/';
        var icon = pathPicture + vicon;
        
        if(!fs.existsSync(icon)) {
                icon = unit.dir + '/picture/' + vicon;
        }
        
        var res = "<div style='padding:5px'><div style='font-weight:900;margin:5px 0;font-size:14px'>" + title + "</div><table><tbody><tr><td>";

        if (icon !== "") {
                res += "<img width=34 height=32 src='" + icon + "'/>";
        }

        res += "</td><td></td><td><span>" + detail + "</span></td></tr></tbody></table>";

        if (help) {
                res += "<hr/>";
                res += "<table><tbody><tr><td><img width=16 height=16 src='" + pathPicture + "help.bmp'/></td><td></td><td>";
                res += "<span style='font-weight:900'>Press F1 to get more helps.<span></td></tr></tbody></table>";
        }

        return res;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Put you codes here
// DXF 引擎功能封装
exports.dxf = {
        // 打开DXF文件
        open: function(fname) {
                comx.dxf_engine.Clear();
                return comx.dxf_engine.Import(fname);
        },
    
        // 获取所有图层
        getLayers: function() {
                const layers = [];
                const count = comx.dxf_engine.GetLayerCount();
                for (let i = 0; i < count; i++) {
                        layers.push(comx.dxf_engine.GetLayerName(i));
                }
                return layers;
        },
    
        // 获取图层上的实体
        getEntities: function(layer) {
                const entities = [];
                const ids = comx.dxf_engine.GetEntitiesOfLayer(layer).split(',');
                for (let i = 0; i < ids.length; i += 2) {
                        if (ids[i] && ids[i + 1]) {
                                entities.push({ mid: parseInt(ids[i]), sid: parseInt(ids[i + 1]) });
                        }
                }
                return entities;
        },
    
        // 获取块定义
        getBlocks: function() {
                const blocks = [];
                const count = comx.dxf_engine.GetBlockCount();
                for (let i = 0; i < count; i++) {
                        blocks.push(comx.dxf_engine.GetBlockName(i));
                }
                return blocks;
        },
    
        // 渲染DXF
        render: function() {
                return comx.dxf_engine.Render();
        }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 选择器功能
exports.picker = {
        autoHighlight: true,
        filter: null,
    
        // 更新选择器设置
        update: function(config) {
                this.mode = config.mode || this.mode;
                this.autoHighlight = config.autoHighlight || this.autoHighlight;
                this.filter = config.filter || this.filter;
        }
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 状态管理
exports.state = {
        currentFile: null,
        selection: [],
    
        // 打开文件
        openFile: function(fname) {
                this.currentFile = fname;
                this.selection = [];
                return this.currentFile;
        },
    
        // 添加选择
        addSelection: function(entity) {
                this.selection.push(entity);
                return this.selection.length;
        },
    
        // 清除选择
        clearSelection: function() {
                this.selection = [];
        }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AutoLoadPlugins Function Implement Start.

function AutoLoadPlugins() {
        var plugin_dir = (__dirname + '/../addon/');
        if(!fs.existsSync(plugin_dir)) {
                return;
        }
    
        var files = fs.readdirSync(plugin_dir);
        files.forEach(function(filename){
                var filedir = path.join(plugin_dir, filename);
                var stats = fs.statSync(filedir);
                if(!stats.isDirectory()) {
                        if(filedir.indexOf('-linux.node') !== -1 && require('os').platform() === 'linux') {
                                require(filedir);
                        }
            
                        if(filedir.indexOf('-win.node') !== -1 && require('os').platform() === 'win32') {
                                require(filedir);
                        }
                }
        });
}

function AutoLoadGlobalPlugins() {
        var plugin_dir = (process.env.COMX_SDK + 'addon/');
        if (!fs.existsSync(plugin_dir)) {
                return;
        }
        console.log(plugin_dir);
        var files = fs.readdirSync(plugin_dir);
        files.forEach(function(filename) {
                var filedir = path.join(plugin_dir, filename);
                var stats = fs.statSync(filedir);
                if (!stats.isDirectory()) {
                        if (filedir.indexOf('-linux.node') !== -1 && require('os').platform() === 'linux') {
                                require(filedir);
                        }

                        if (filedir.indexOf('-win.node') !== -1 && require('os').platform() === 'win32') {
                                require(filedir);
                        }
                }
        });
}

//AutoLoadPlugins Function Implement End.
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ide_info Function Implement Start.

exports.ide_info = (msg) => {
        if (process.send) {
                process.send({
                        type: 'debug',
                        info: msg
                });
        }
};

//ide_info Function Implement End.
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
