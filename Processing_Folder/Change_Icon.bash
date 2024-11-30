icon="$1"
mode="$2"
icon="${icon//\"/}"

shift
shift

# Loop through the arguments and print them
for arg in "$@"; do
    # Commands to process $item
    folderpath=$arg

    # Recursively deleting the old icons
    rm -rf "$folderpath"$'/icon\r'

    # Adding a finder/local icon to an image file and redirect to > /dev/null
    sips -i "$icon" >/dev/null

    # Only read files with icns
    DeRez -only icns "$icon" > /tmp/icns.rsrc

    # Appending the new icon based on the filer path from stdin
    if [ "$mode" = "change" ]; then
        Rez -append /tmp/icns.rsrc -o "$folderpath"$'/icon\r'
  

        # Recursively remove custom icons
        SetFile -a C "$folderpath"

        # Setting the icon image to be invisble in the finder
        SetFile -a V "$folderpath"$'/icon\r'
        SetFile -a V "$folderpath"$'/icon\r'
        SetFile -a V "$folderpath"$'/icon\r'
    fi

    echo "Completed processing folder: $arg"

done

killall Finder