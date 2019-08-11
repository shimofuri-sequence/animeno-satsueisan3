(function(){

function input_validator(syaku){
    var result = syaku.match(/^(\d+)\+(\d+)$/);

    if(result === null) return;
    
    var byou = Number(result[1]);
    var koma = Number(result[2]);
    
    if((byou + koma) === 0
    || koma > 23){
        return;
        }
    
    return byou * 24 + koma;
    }

function stretchOutPoint(comp, old_duration){
    for(var i=1;i<=comp.numLayers;i++){
        var layer = comp.layer(i);
        var locked = layer.locked;
        
        if(locked) layer.locked = false;
        
        if(layer.outPoint >= old_duration){
            layer.outPoint = comp.duration;
            }
        
        if(locked) layer.locked = true;
        }
    }

function calc_bold(comp){
    var max_inPoint = 0;
    for(var i=1;i<=comp.numLayers;i++){
        var layer = comp.layer(i);
        if(max_inPoint < layer.inPoint){
            max_inPoint = layer.inPoint;
            }
        }
    return max_inPoint * 24;
    }

var comps = [];
for(var i=1;i<app.project.numItems;i++){
    var item = app.project.item(i);
    if(item instanceof CompItem){
        var data = {comp: item, duration: item.duration}
        comps.push(data);
        }
    }

var input_result = prompt();

if(input_result === null) return;

var result = input_validator(input_result);
if(result === undefined) {
    alert('無効な入力値です');
    return;
    }

app.beginUndoGroup('尺変更');

for(var i=0;i<comps.length;i++){
    var comp_data = comps[i];
    var comp = comp_data.comp;
    
    var bold = 0;
    if(comp.usedIn.length === 0){
        bold = calc_bold(comp);
        }
    
    comp.duration = (bold + result) / 24;
    }

for(var i=0;i<comps.length;i++){
    var comp_data = comps[i];
    var comp = comp_data.comp;
    var old_duration = comp_data.duration;
    stretchOutPoint(comp, old_duration);
    }

app.endUndoGroup();

    }());