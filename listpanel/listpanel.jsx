(function(isPanel){

    function file_filter(f){
        if(f instanceof Folder) return false;
        if(f.name.match(/^\./)) return false;
        if(!f.name.match(/\.(jsx|jsxbin)$/i)) return false;
        return true;
        }

    function init_listbox(script_folder, listbox){
        listbox.removeAll();
        var script_files = script_folder.getFiles(file_filter);
        script_files.sort();

        for(var i=0;i<script_files.length;i++){
            var script_file = script_files[i];
            var display_name = File.decode(script_file.name);
            var item = listbox.add('item',
                                     display_name,
                                     undefined,
                                     {script: script_file});
//~             item.script = script_file;
            }
        }
    
    function doScript(script_file){
        try{
            $.evalFile(script_file);
        }catch(e){
            var script_name = File.decode(script_file.name);
            var msg = script_name + 'の'+ e.line +'行目でエラー\n';
            msg += e.message;
            alert(msg);
            }
        }

    var win = (isPanel instanceof Panel) ?
               isPanel:
               new Window('palette',
                          'sciprtPanel',
                          undefined,
                          {resizeable:true});
    
    var btn_group = win.add('group');
    btn_group.orientation = 'row';

    var choose_btn = btn_group.add('button', undefined, '...');
    var reload_btn = btn_group.add('button', undefined, 'reload');
    
    var listbox = win.add('listbox');
    listbox.alignment = ['fill', 'fill'];

    var script_folder = new Folder('~');

    var section_name = 'ss_listpanel';
    var key = 'folder';

    var hasKey = app.settings.haveSetting(section_name, key);

    if (hasKey){
        var fo = app.settings.getSetting(section_name, key); 
        script_folder = new Folder(fo);                  
        }

    init_listbox(script_folder, listbox);

    choose_btn.onClick = function(){
        var new_folder = script_folder.selectDlg();
        if(new_folder === null) return;
        
        script_folder = new_folder;
        
        app.settings.saveSetting(section_name,
                             key,
                             script_folder.fsName);
                             
        init_listbox(script_folder, listbox);
        };

    reload_btn.onClick = function(){
        init_listbox(script_folder, listbox);
        };
    
    listbox.onDoubleClick= function(){
        var item = this.selection;
        if(item === null) return;
        doScript(item.properties.script);
        }

    win.layout.layout(true);
    
    win.onResize = function(){
        win.layout.resize();
        }
    
    if(win instanceof Window){
        win.center();
        win.show();
        }
        
    }(this));