

function SetupQualityOfLifeFeatures(){
    window.FavouriteColoursDictionary = [];
    Grab_Saved_Favourites();
    document.getElementById('Favourite_Button').addEventListener('click',Add_Favourite_Colour);
    document.getElementById('Plus_Button_Indent').addEventListener('click',Add_Favourite_Colour);
    // Detect mouse clicks
document.addEventListener('click', (event) => {
    Hide_Notification();

    const isInsideFavs = event.target.closest('.Favourite_Colours');

    if (!isInsideFavs) {
        var All_Favourite_Buttons = document.getElementsByClassName('Favourite_Colours');
        for(let Fav_Button of All_Favourite_Buttons){
            Fav_Button.style.border = "3px solid rgba(255,255,255,0.20)";
    }
}


});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Backspace') {
        RemoveFromDictionary();
    } else if (event.key === 'Delete') {
        RemoveFromDictionary();
    } else if (event.key === 'Enter') {
        document.getElementById("Apply_Colour_Button").click();
    } else if (event.key === 'ArrowLeft') {
        Traverse_Favourites("Left");
    } else if (event.key === 'ArrowRight') {
        Traverse_Favourites("Right");
    }




});

const scrollContainer = document.getElementById("Store_Grid");

// scrollContainer.addEventListener('wheel', (event) => {
//   event.preventDefault();
//   const increment = 5; // Set the scroll increment (adjust as needed)

// if (event.deltaY !== 0) {
//     // Vertical scrolling
//     if (event.deltaY > 0) {
//       console.log('Scrolling down');
//       scrollContainer.scrollLeft += increment; // Uncomment to scroll vertically
//     } else {
//       console.log('Scrolling up');
//       scrollContainer.scrollLeft -= increment; // Uncomment to scroll vertically
//     }
// }
// });
    document.getElementById('Install_Button_Actual').addEventListener('click',Install_CLI_Tools);
    document.getElementById('Done_Button_Actual').addEventListener('click',Hide_Setup_Panel);
    // const Setup_Value = localStorage.getItem("Setup_Complete");
    // if(Setup_Value){
    //     document.getElementById('Setup_Panel').style.opacity = "0";
    //     document.getElementById('Setup_Panel').style.display = "none";
    // }

    console.log(window.SetupJSONLocation);

    const data = fs.readFileSync(window.SetupJSONLocation, 'utf8');
    const jsonData = JSON.parse(data);
    console.log(jsonData.ConfirmedCLI == "Yes");
    if(jsonData.ConfirmedCLI == "Yes"){
        console.log("Setup done");
        document.getElementById('Setup_Panel').style.opacity = "0";
        document.getElementById('Setup_Panel').style.display = "none";
    }

}

function Complete_Notification(){
    document.getElementById('Notification_Message').innerHTML = "Completed colour changes";
    document.getElementsByClassName('Notification_Bar')[0].classList.add('Show_Notification_Bar');
    var Note_Sound = document.getElementById("Converting_Sound_Effect");
    Note_Sound.currentTime = 0;
    Note_Sound.volume = 0.2;
    Note_Sound.play();
}

function Error_Notification(){
    // console.log("Show error notification");
    document.getElementById('Notification_Message').innerHTML = "No folders detected";
    document.getElementsByClassName('Notification_Bar')[0].classList.add('Show_Notification_Bar');
    var Note_Sound = document.getElementById("Error_Sound_Effect");
    Note_Sound.currentTime = 0;
    Note_Sound.volume = 0.2;
    Note_Sound.play();
}

function Hide_Notification(){
    // console.log("Hide notification");
    document.getElementsByClassName('Notification_Bar')[0].classList.remove('Show_Notification_Bar');

}

function Print_Summary(){
    var Hue_Value = document.getElementById('Hue_Slider').value;
    var Saturation_Value = document.getElementById('Saturation_Slider').value;
    var Brightness_Value = document.getElementById('Brightness_Slider').value;
    var Contrast_Value = document.getElementById('Contrast_Slider').value;
    var Summary = {
        "Hue": Hue_Value,
        "Saturation": Saturation_Value,
        "Brightness": Brightness_Value,
        "Contrast": Contrast_Value,
    };
}

function Select_Preset(){
    this.classList.add('Button_Press_Animation');
    setTimeout(() => {
        this.classList.remove('Button_Press_Animation');
    }, 200);

    // Preset Dictionary
    Presets_Dictionary = {
        "Preset_Purple": {Hue: '49', Saturation: '100', Brightness: '100', Contrast: '100'},
        "Preset_Pink": {Hue: '93', Saturation: '100', Brightness: '100', Contrast: '100'},
        "Preset_Cocoa": {Hue: '188', Saturation: '30', Brightness: '97', Contrast: '114'},
        "Preset_Teal": {Hue: '323', Saturation: '100', Brightness: '100', Contrast: '100'},
        "Preset_Orange": {Hue: '178', Saturation: '100', Brightness: '100', Contrast: '100'}
    }

    var Selected_Colour = Presets_Dictionary[this.id];
    document.getElementById('Hue_Slider').value = Selected_Colour.Hue;
    document.getElementById('Saturation_Slider').value = Selected_Colour.Saturation;
    document.getElementById('Brightness_Slider').value = Selected_Colour.Brightness;
    document.getElementById('Contrast_Slider').value = Selected_Colour.Contrast;
    Update_Preview();
}

function Add_Favourite_Colour(){
    this.classList.add('Button_Press_Animation');
    setTimeout(() => {
        this.classList.remove('Button_Press_Animation');
    }, 200);

    var Current_Hue_Slider = document.getElementById('Hue_Slider').value;
    var Current_Saturation_Slider = document.getElementById('Saturation_Slider').value;
    var Current_Brightness_Slider = document.getElementById('Brightness_Slider').value;
    var Current_Contrast_Slider = document.getElementById('Contrast_Slider').value;

    var New_Favourite_Colour_Entry = {
        "Hue": Current_Hue_Slider,
        "Saturation": Current_Saturation_Slider,
        "Brightness": Current_Brightness_Slider,
        "Contrast": Current_Contrast_Slider
    };
    
    WriteToDictionary(New_Favourite_Colour_Entry);
    const Favourite_Colours_Template = document.getElementById("Favourite_Colours_Template");
    const Favourite_Colours_Container = document.getElementById("Store_Grid");
    
    const New_Fav_Button = Favourite_Colours_Template.content.cloneNode(true);
    
    const Favourite_Colours_Div = New_Fav_Button.querySelector(".Favourite_Colours");
    Favourite_Colours_Div.dataset.hue = Current_Hue_Slider;
    Favourite_Colours_Div.dataset.saturation = Current_Saturation_Slider;
    Favourite_Colours_Div.dataset.brightness = Current_Brightness_Slider;
    Favourite_Colours_Div.dataset.contrast = Current_Contrast_Slider;

    Favourite_Colours_Container.prepend(New_Fav_Button);
    var Hue_Value = Current_Hue_Slider;
    var Saturation_Value = Current_Saturation_Slider / 100;
    var Brightness_Value = Current_Brightness_Slider / 100;
    var Contrast_Value = Current_Contrast_Slider / 100;
    Favourite_Colours_Div.style.filter = `hue-rotate(${Hue_Value}deg) saturate(${Saturation_Value}) brightness(${Brightness_Value}) contrast(${Contrast_Value})`;
    Favourite_Colours_Div.addEventListener('click',Selected_Favourite); 
}



function Selected_Favourite(){
    var All_Favourite_Buttons = document.getElementsByClassName('Favourite_Colours');
    for(let Fav_Button of All_Favourite_Buttons){
        Fav_Button.style.border = "3px solid rgba(255,255,255,0.20)";
    }

    this.style.border = "3px solid rgba(255,255,255,1)";

    this.classList.add('Button_Press_Animation');
    setTimeout(() => {
        this.classList.remove('Button_Press_Animation');
    }, 200);
    document.getElementById('Hue_Slider').value = this.dataset.hue;
    document.getElementById('Saturation_Slider').value = this.dataset.saturation;
    document.getElementById('Brightness_Slider').value = this.dataset.brightness;
    document.getElementById('Contrast_Slider').value = this.dataset.contrast;
    Update_Preview();
}

function WriteToDictionary(FavouritedColour){
    window.FavouriteColoursDictionary.unshift(FavouritedColour);
    console.log(window.FavouriteColoursDictionary);
   const jsonData = JSON.stringify(window.FavouriteColoursDictionary, null, 2); // Pretty format with 2 spaces
    fs.writeFile(window.FavouritesJSONLocation, jsonData, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('JSON file has been saved.');
        }
    });
}

function RemoveFromDictionary() {
    var Favourites_Container = document.getElementById('Store_Grid');
    var All_Favourite_Buttons = document.getElementsByClassName('Favourite_Colours');
    
    // Convert HTMLCollection to an array to avoid issues with live updates
    var buttonsArray = Array.from(All_Favourite_Buttons);

    var i = 0;
    buttonsArray.forEach(button => {
        
        var Border_Colour = button.style.borderColor;
        if (Border_Colour == 'rgb(255, 255, 255)') {
            window.FavouriteColoursDictionary.splice(i, 1);
            button.classList.add('Delete_Favourite_Animation');
            setTimeout(() => {
                Favourites_Container.removeChild(button);
            }, 210);
        }
        i++;
    });
    const jsonData = JSON.stringify(window.FavouriteColoursDictionary, null, 2); // Pretty format with 2 spaces
    fs.writeFile(window.FavouritesJSONLocation, jsonData, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log(window.FavouriteColoursDictionary);
            console.log('JSON file has been saved.');
        }
    });
}


function Grab_Saved_Favourites(){
    try {
        const data = fs.readFileSync(window.FavouritesJSONLocation, 'utf8');
        const jsonData = JSON.parse(data);
        window.FavouriteColoursDictionary = jsonData;
      } catch (err) {
        // console.error(err);
      }
      var Saved_Colours = window.FavouriteColoursDictionary;
      Saved_Colours = Saved_Colours.reverse();
      for(let Colour of Saved_Colours){
        Add_Saved_Colour(Colour);
      }
}


function Add_Saved_Colour(Saved_Colour){
    const Favourite_Colours_Template = document.getElementById("Favourite_Colours_Template");
    const Favourite_Colours_Container = document.getElementById("Store_Grid");
    
    const New_Fav_Button = Favourite_Colours_Template.content.cloneNode(true);
    
    const Favourite_Colours_Div = New_Fav_Button.querySelector(".Favourite_Colours");
    Favourite_Colours_Div.dataset.hue = Saved_Colour.Hue;
    Favourite_Colours_Div.dataset.saturation = Saved_Colour.Saturation;
    Favourite_Colours_Div.dataset.brightness = Saved_Colour.Brightness;
    Favourite_Colours_Div.dataset.contrast = Saved_Colour.Contrast;

    Favourite_Colours_Container.prepend(New_Fav_Button);
    var Hue_Value = Saved_Colour.Hue;
    var Saturation_Value = Saved_Colour.Saturation / 100;
    var Brightness_Value = Saved_Colour.Brightness / 100;
    var Contrast_Value = Saved_Colour.Contrast / 100;
    
    Favourite_Colours_Div.style.filter = `hue-rotate(${Hue_Value}deg) saturate(${Saturation_Value}) brightness(${Brightness_Value}) contrast(${Contrast_Value})`;
    Favourite_Colours_Div.addEventListener('click',Selected_Favourite); 
}

function Traverse_Favourites(Direction){
var i = 0;
var Foccused_Fav_Index = null;
 var All_Favourite_Buttons = document.getElementsByClassName('Favourite_Colours');
    for(let Fav_Button of All_Favourite_Buttons){
        var Border_Colour =  Fav_Button.style.borderColor;
        if (Border_Colour == 'rgb(255, 255, 255)') {
            Foccused_Fav_Index = i;
        }
        i++;
    }

    if(Foccused_Fav_Index !== null){
        var Current_Index = Foccused_Fav_Index;
        if(Direction == "Left"){
            Current_Index = Math.max(0, Current_Index - 1);
        }else{
            Current_Index = Math.min(All_Favourite_Buttons.length-1, Current_Index + 1);
        }
        for(let Fav_Button of All_Favourite_Buttons){
            Fav_Button.style.border = "3px solid rgba(255,255,255,0.20)";
        }
        All_Favourite_Buttons[Current_Index].style.border = "3px solid rgba(255,255,255,1)";
        const parent = document.getElementById('Store_Grid');
    
        // Get the offset of the element relative to the parent
        const elementOffsetTop = All_Favourite_Buttons[Current_Index].offsetTop;
        const elementOffsetLeft = All_Favourite_Buttons[Current_Index].offsetLeft;
        
        // Scroll the parent container to bring the element into view
        parent.scrollTo({
          top: elementOffsetTop - parent.offsetTop, // Adjust for parent's top offset
          left: elementOffsetLeft - parent.offsetLeft, // Adjust for parent's left offset
          behavior: 'smooth' // Smooth scrolling
        });
        All_Favourite_Buttons[Current_Index].click();

    }else{
        if(All_Favourite_Buttons[0]){
            All_Favourite_Buttons[0].style.border = "3px solid rgba(255,255,255,1)";
            All_Favourite_Buttons[0].click();
        }
    }

}

function Hide_Setup_Panel(){
    document.getElementById('Setup_Panel').style.opacity = 0;
    setTimeout(() => {
        document.getElementById('Setup_Panel').style.display = "none";
    }, 210);
    // localStorage.setItem("Setup_Complete", "Yes");

    var SetupStatus = {
        "ConfirmedCLI": "Yes"
    };

    const jsonData = JSON.stringify(SetupStatus, null, 2); // Pretty format with 2 spaces
    fs.writeFile(window.SetupJSONLocation, jsonData, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('JSON file has been saved.');
        }
    });
}

function Install_CLI_Tools(){
    this.classList.add('Button_Press_Animation');
    setTimeout(() => {
        this.classList.remove('Button_Press_Animation');
    }, 200);
    exec('xcode-select --install');
}