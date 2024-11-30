var Child_Process_Shell = require('child_process');
var Counter = 0; 
var Percentage_Complete = 0;
var Number_Of_Folders = 0;

function ChangeIcon(Mode){
    
    var Progress_Bar = document.getElementById('Progress_Bar');
    Progress_Bar.style.width = 0 + '%';

    var Icon_Image_Path = window.ReferenceImagePath;
    // console.log(Icon_Image_Path);
    var All_Folder_Paths = window.Selected_Folders;
    Number_Of_Folders = All_Folder_Paths.length;
    Counter = 0;
    Percentage_Complete = 0;

    var Progress_Label = document.getElementById('Painting_Folder_Label');
    Progress_Label.innerHTML = `Preparing folder<br><br>0 of ${Number_Of_Folders}`;

    // var array = ["a","b","c"]
    // console.log(window.ReferenceScriptPath);
    const script = spawn('bash', [window.ReferenceScriptPath, Icon_Image_Path,Mode, ...All_Folder_Paths]);

    script.stdout.on('data', (data) => {
        // console.log(`stdout: ${data}`);
        var Message_Check = `${data}`.includes("Completed processing folder");
        
        if(Message_Check){
            Counter = Counter + 1;
        }

        console.log(`Completed ${Counter} out of ${Number_Of_Folders} folders`);
        var Progress_Bar = document.getElementById('Progress_Bar');
        Percentage_Complete = 100 * (Counter / Number_Of_Folders);
        Progress_Bar.style.width = Percentage_Complete + '%';
        var Progress_Label = document.getElementById('Painting_Folder_Label');
        Progress_Label.innerHTML = `Preparing folder<br><br>${Counter} of ${Number_Of_Folders}`;
        


    });
    
    script.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
    
    script.on('close', (code) => {
        // console.log(`child process exited with code ${code}`);
        // console.log("Done processing folders");
        Complete_Notification();
        var Loading_Panel = document.getElementsByClassName('Loading_Panel')[0];
        Loading_Panel.classList.remove("Show_Loading_Panel");
        var Apply_Button = document.getElementById('Apply_Colour_Button');
        Apply_Button.classList.remove('Button_Press_Animation');
        var Revert_Button = document.getElementById('Revert_Button');
        Apply_Button.style.pointerEvents = 'all';
        Revert_Button.style.pointerEvents = 'all';
    });


}

