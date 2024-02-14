import tkinter
import tkinter as tk
from tkinter import filedialog
import re

# Create the main window
root = tk.Tk()
root.title("Selected Fear and hunger game (\"game.exe\" on windows, \"game\" on lnx\mac): ")

# Create a label to display selected file path
label = tk.Label(root, text="No file selected")
label.pack(pady=10)

label2 = tk.Label(root, text="This file seems incorrect, double check that you selected the file you use to start fear and hunger. the game executable.")

def select_file():
    file_path = filedialog.askopenfilename()
    if file_path:
        label.config(text="File:" + file_path)
        if "game" in (str.lower(file_path)):
            label2.pack_forget()
            newFilePath = re.sub(r'game.*$',"",file_path, 1, re.IGNORECASE) + "/www/js/rpg_core.js"
            patchRPG_CORE(newFilePath)
        elif "rpg_core.js" in (str.lower(file_path)):
            label2.pack_forget()
            patchRPG_CORE(file_path)
        else:
            label2.pack(pady=10)
    else:
        label.config(text="No file selected")

def patchRPG_CORE(rpg_core_path):
    try:
        # Open the file for reading
        with open(rpg_core_path, 'r') as file:
            content = file.read()

        # Replace the desired text
        modified_content = content.replace("this._skipCount === 0", "this._skipCount <= 0")

        # Open the file for writing and overwrite the content
        with open(rpg_core_path, 'w') as file:
            file.write(modified_content)

        print("Replacement successful!")
        label.config(text="Done! your game won't have the freeze bug anymore. <3")
        button.pack_forget()

    except FileNotFoundError:
        print("File not found.")
    except Exception as e:
        print("An error occurred:", e)

    
    
     


# Create a button to trigger file selection
button = tk.Button(root, text="Selected Fear and hunger game (\"game.exe\" on windows, \"game\" on lnx\mac): ", command=select_file)
button.pack(pady=5)

# Run the Tkinter event loop
root.mainloop()
