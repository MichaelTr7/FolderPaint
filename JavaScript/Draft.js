
    // var Folder_Path_Preliminary = "/Users/laptop/Desktop/Blender Folder";
    var Folder_Icon_Preliminary = path.join(__dirname, '/Processing_Folder/Folder_Icon_Adjusted.png'); 
    
    const Folder_Path = `"${Folder}"`; // Add quotes
    const Icon_Path = `"${Folder_Icon_Preliminary}"`; // Add quotes
    
    var Command_Refresh_Finder = `
    tell application "Finder"
        quit
    end tell
    delay 1
    tell application "Finder"
        activate
    end tell
    `
    var Command_Change_Icon = `
    folderpath=${Folder_Path}
    icon=${Icon_Path}
    
    # Recursively delete any old icons in the folder path
    find "$folderpath" -name "Icon\r" -exec rm -rf {} +
    
    # Add a Finder icon to the image file and redirect output to /dev/null
    sips -i "$icon" >/dev/null
    
    # Only read files with icns, and store resource in a temp file
    DeRez -only icns "$icon" > /tmp/icns.rsrc
    
    # Append the new icon based on the folder path
    Rez -append /tmp/icns.rsrc -o "$folderpath"/Icon\r
    
    # Remove custom icons from the folder
    SetFile -a C "$folderpath"
    
    # Set the icon file to be invisible in Finder
    SetFile -a V "$folderpath"/Icon\r
    
    killall Finder
    `;
    exec(Command_Change_Icon);
    