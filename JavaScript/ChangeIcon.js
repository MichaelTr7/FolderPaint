const { spawn, exec } = require('child_process');
const { log } = require('console');
var fs = require('fs');
var path = require('path');
const { ipcRenderer } = require('electron');
const { webUtils } = require('electron')
const applescript = require('applescript');


window.Selected_Folders = [];

window.onload = function(){
    var Preset_Buttons = document.getElementsByClassName('Pallete_Colours');
    for(let Button of Preset_Buttons){
        Button.addEventListener('click',Select_Preset);
    }

    document.getElementById("Folder_Selector").addEventListener("click",Get_Folder_Path);
    const slider1 = document.getElementById('Hue_Slider');
    const slider2 = document.getElementById('Saturation_Slider');
    const slider3 = document.getElementById('Brightness_Slider');
    const slider4 = document.getElementById('Contrast_Slider');

    const value1 = (slider1.value - slider1.min) / (slider1.max - slider1.min) * 100;
    slider1.style.setProperty('--progress', `${value1}%`);

    const value2 = (slider2.value - slider2.min) / (slider2.max - slider2.min) * 100;
    slider2.style.setProperty('--progress', `${value2}%`);

    const value3 = (slider3.value - slider3.min) / (slider3.max - slider3.min) * 100;
    slider3.style.setProperty('--progress', `${value3}%`);

    const value4 = (slider4.value - slider4.min) / (slider4.max - slider4.min) * 100;
    slider4.style.setProperty('--progress', `${value4}%`);

    
    document.getElementById('Apply_Colour_Button').addEventListener('click',Apply_Button);
    document.getElementById('Revert_Button').addEventListener('click',Revert_Button);
    Setup();

    document.getElementById('Folder_Selector').addEventListener('click',Folder_Selector_Clicked);
    
}

function Folder_Selector_Clicked(){
    var Folder_Selector = document.getElementById('Folder_Selector');
    Folder_Selector.classList.add('Button_Press_Animation');
    
    setTimeout(function () {
        var Folder_Selector = document.getElementById('Folder_Selector');
        Folder_Selector.classList.remove('Button_Press_Animation');
    }, 200);  

}

function Get_Folder_Path(){
    var Drop_Zone = document.getElementsByClassName('Folder_Selector')[0];
    Drop_Zone.classList.add('Highlight_Drop_Zone');
    // const selectedPaths = dialog.showOpenDialogSync(mainWindow, options);
    ipcRenderer.send('files-dropped');
    Check_For_Folder();
}

function Check_For_Folder(){

    ipcRenderer.on('folder-paths', (event, folderPaths) => {
        var Selected_Folders = folderPaths;
        if (Selected_Folders !== undefined && Selected_Folders !== null) {
            Folders_Have_Been_Selected(Selected_Folders);
        } else {
            No_Folder_Has_Been_Selected();
        }
    });
}

function Folders_Have_Been_Selected(Selected_Folders){
    var Number_Of_Folders = Selected_Folders.length;
    var Number_Of_Folders_Label = document.getElementById('Selected_Folder_Summary_Label');
    
    if(Number_Of_Folders == 1){
        Number_Of_Folders_Label.innerHTML = "1 folder selected";
        var Drop_Zone = document.getElementsByClassName('Folder_Selector')[0];
        Drop_Zone.classList.remove('Highlight_Drop_Zone');
        var Preview_Slab = document.getElementsByClassName('Folder_Preview_Container')[0];
        Preview_Slab.classList.add('Show_Folder_Preview');
        var Note_Sound = document.getElementById("Export_Sound_Effect");
        Note_Sound.currentTime = 0;
        Note_Sound.volume = 0.2;
        Note_Sound.play();
    }else if(Number_Of_Folders == 0){
        Number_Of_Folders_Label.innerHTML = Selected_Folders.length + " folders selected";
        No_Folder_Has_Been_Selected();
        Error_Notification();
    }else{
        Number_Of_Folders_Label.innerHTML = Selected_Folders.length + " folders selected";
        var Drop_Zone = document.getElementsByClassName('Folder_Selector')[0];
        Drop_Zone.classList.remove('Highlight_Drop_Zone');
        var Preview_Slab = document.getElementsByClassName('Folder_Preview_Container')[0];
        Preview_Slab.classList.add('Show_Folder_Preview');
        var Note_Sound = document.getElementById("Export_Sound_Effect");
        Note_Sound.currentTime = 0;
        Note_Sound.volume = 0.2;
        Note_Sound.play();
    }
    window.Selected_Folders = Selected_Folders;    
}

function No_Folder_Has_Been_Selected(){
      Drag_Leave_Animation();
    }

function Revert_Button(){
    var Apply_Button = document.getElementById('Apply_Colour_Button');
    var Revert_Button = document.getElementById('Revert_Button');
    Revert_Button.classList.add('Button_Press_Animation');

    setTimeout(function () {
        var Revert_Button = document.getElementById('Revert_Button');
        Revert_Button.classList.remove('Button_Press_Animation');
    }, 200);  

    var Number_Of_Folders_Selected = (window.Selected_Folders).length;
    if(Number_Of_Folders_Selected >= 1){

    Apply_Button.style.pointerEvents = 'none';
    Revert_Button.style.pointerEvents = 'none';
    
    var All_Folder_Paths = window.Selected_Folders;
    Number_Of_Folders = All_Folder_Paths.length;
    var Progress_Label = document.getElementById('Painting_Folder_Label');
    Progress_Label.innerHTML = `Preparing folder<br><br>0 of ${Number_Of_Folders}`;
    var Progress_Bar = document.getElementById('Progress_Bar');
    Progress_Bar.style.width = 0 + '%';
    var Number_Of_Folders_Selected = (window.Selected_Folders).length;
    if(Number_Of_Folders_Selected >= 1){

        var Revert_Button = document.getElementById('Revert_Button');
        Apply_Button.style.pointerEvents = 'none';
        Revert_Button.style.pointerEvents = 'none';


        ChangeIcon("revert");

        var Loading_Panel = document.getElementsByClassName('Loading_Panel')[0];
        Loading_Panel.classList.add("Show_Loading_Panel");


        document.getElementById('Hue_Slider').value = 0;
        document.getElementById('Saturation_Slider').value = 100;
        document.getElementById('Brightness_Slider').value = 100;
        document.getElementById('Contrast_Slider').value = 100;
        Update_Preview();

    }
    }
}

function Apply_Button(){
    Print_Summary();
    var Apply_Button = document.getElementById('Apply_Colour_Button');
    Apply_Button.classList.add('Button_Press_Animation');
    
    setTimeout(function () {
        var Apply_Button = document.getElementById('Apply_Colour_Button');
        Apply_Button.classList.remove('Button_Press_Animation');
    }, 200);  

    var All_Folder_Paths = window.Selected_Folders;
    Number_Of_Folders = All_Folder_Paths.length;
    var Progress_Label = document.getElementById('Painting_Folder_Label');
    Progress_Label.innerHTML = `Preparing folder<br><br>0 of ${Number_Of_Folders}`;
    var Progress_Bar = document.getElementById('Progress_Bar');
    Progress_Bar.style.width = 0 + '%';
    var Number_Of_Folders_Selected = (window.Selected_Folders).length;
    if(Number_Of_Folders_Selected >= 1){

        var Revert_Button = document.getElementById('Revert_Button');
        Apply_Button.style.pointerEvents = 'none';
        Revert_Button.style.pointerEvents = 'none';


        Preprocessing(Download_Canvas);
        var Loading_Panel = document.getElementsByClassName('Loading_Panel')[0];
        Loading_Panel.classList.add("Show_Loading_Panel");
    }


}

