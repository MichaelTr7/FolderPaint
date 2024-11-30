function Setup(){
    var Debug_Mode = 0;

    (async () => {
        var Contents_Path = await ipcRenderer.invoke('get-app-path');
        Contents_Path = path.resolve(Contents_Path, '../../');
        window.ProcessingPath = path.join(`${Contents_Path}`, '/Processing_Folder/Folder_Icon_Adjusted.png'); 
        window.ReferenceScriptPath = path.join(`${Contents_Path}`, '/Processing_Folder/Change_Icon.bash'); 
        window.FavouritesJSONLocation = path.join(`${Contents_Path}`, '/Processing_Folder/Favourites.json'); 
        window.SetupJSONLocation = path.join(`${Contents_Path}`, '/Processing_Folder/Setup.json'); 

        var ReferencePath = window.ProcessingPath;
        window.ReferenceImagePath = `"${ReferencePath}"`;
        window.SavedLocation = ReferencePath;

        if(Debug_Mode == 1){
            console.log("Running: Debug Mode");
            window.ReferenceImagePath =  "/Users/laptop/Desktop/Folder Paint/Processing_Folder/Folder_Icon_Adjusted.png";
            window.ReferenceScriptPath = "/Users/laptop/Desktop/Folder Paint/Processing_Folder/Change_Icon.bash";
            window.SavedLocation = "/Users/laptop/Desktop/Folder Paint/Processing_Folder/Folder_Icon_Adjusted.png";
            window.FavouritesJSONLocation = "/Users/laptop/Desktop/Folder Paint/Processing_Folder/Favourites.json";
            window.SetupJSONLocation = "/Users/laptop/Desktop/Folder Paint/Processing_Folder/Setup.json";

        }else{
            console.log("Running: Production Mode");
        }

        // console.log(`Images saved to: ${window.ReferenceImagePath}`);
        // console.log(`Processed by: ${window.ReferenceScriptPath}`);

        SetupQualityOfLifeFeatures();

    })();
    
  
const image = document.getElementById('Pseudo_Folder_Preview_Image');
var canvas = document.getElementById("Hidden_Canvas")

// Ensure the canvas is the same size as the image
canvas.width = image.width;
canvas.height = image.height;

const slider1 = document.getElementById('Hue_Slider');
const slider2 = document.getElementById('Saturation_Slider');
const slider3 = document.getElementById('Brightness_Slider');
const slider4 = document.getElementById('Contrast_Slider');


slider1.addEventListener('input', function() {
const value1 = (slider1.value - slider1.min) / (slider1.max - slider1.min) * 100;
slider1.style.setProperty('--progress', `${value1}%`);
Update_Preview();
});

slider2.addEventListener('input', function() {
const value2 = (slider2.value - slider2.min) / (slider2.max - slider2.min) * 100;
slider2.style.setProperty('--progress', `${value2}%`);
Update_Preview();
});

slider3.addEventListener('input', function() {
const value3 = (slider3.value - slider3.min) / (slider3.max - slider3.min) * 100;
slider3.style.setProperty('--progress', `${value3}%`);
Update_Preview();
});
  
slider4.addEventListener('input', function() {
const value4 = (slider4.value - slider4.min) / (slider4.max - slider4.min) * 100;
slider4.style.setProperty('--progress', `${value4}%`);
Update_Preview();
});



}

function Update_Preview(){
    const preview_image = document.getElementById('Folder_Preview_Image');

    const Hue_Value = document.getElementById('Hue_Slider').value;
    const Saturation_Value = document.getElementById('Saturation_Slider').value/100;
    const Brightness_Value = document.getElementById('Brightness_Slider').value/100;
    const Contrast_Value = document.getElementById('Contrast_Slider').value/100;

    // Changing Properties
    preview_image.style.filter = `hue-rotate(${Hue_Value}deg) saturate(${Saturation_Value}) brightness(${Brightness_Value}) contrast(${Contrast_Value})`;
}

function Preprocessing(callback){
    var savePath = window.SavedLocation;
    savePath = `"${savePath}"`; // Add quotes

    exec(`mv ${savePath} ${savePath}_OLD`);
    callback();
    return true;
}

function Download_Canvas(){
    var canvas = document.getElementById('Hidden_Canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const savePath = window.SavedLocation;
    const image = document.getElementById('Pseudo_Folder_Preview_Image');

    // Apply the hue-rotate effect before drawing the image
    const Hue_Value = document.getElementById('Hue_Slider').value;
    const Saturation_Value = document.getElementById('Saturation_Slider').value/100;
    const Brightness_Value = document.getElementById('Brightness_Slider').value/100;
    const Contrast_Value = document.getElementById('Contrast_Slider').value/100;

    ctx.filter = `hue-rotate(${Hue_Value}deg) saturate(${Saturation_Value}) brightness(${Brightness_Value}) contrast(${Contrast_Value})`;
    
    ctx.drawImage(image, 0, 0);
    const imageData = canvas.toDataURL('image/png');

    const base64Data = imageData.replace(/^data:image\/png;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

        fs.writeFile(savePath, buffer, (err) => {
        if (err) {
            console.error('Error saving the image: ', err);
        } else {
            ChangeIcon("change");
        }
    });

    return true;

}
