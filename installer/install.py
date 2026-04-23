import tkinter as tk
from tkinter import filedialog, messagebox, ttk
import os
import shutil
import json
from pathlib import Path
import sys
import webbrowser

class ModManagerInstaller(tk.Tk):
    def __init__(self):
        super().__init__()

        self.title("Fear & Hunger Mod Manager Installer (Arch Linux)")
        self.geometry("700x750") # Increased height
        self.resizable(True, True) # Made resizable

        # Black & White Theme Configuration
        self.configure(bg="#000000")
        self.style = ttk.Style()
        self.style.theme_use('clam')
        
        # Fonts
        self.retro_font = ("Courier", 12)
        self.header_font = ("Courier", 18, "bold")
        self.btn_font = ("Courier", 14, "bold")

        # Colors
        bg_color = "#000000"
        fg_color = "#FFFFFF"
        select_color = "#333333"

        self.style.configure(".", 
            background=bg_color, 
            foreground=fg_color, 
            font=self.retro_font,
            fieldbackground=select_color
        )
        self.style.configure("TLabel", background=bg_color, foreground=fg_color)
        self.style.configure("TButton", 
            background="#FFFFFF", 
            foreground="#000000", 
            borderwidth=1,
            focuscolor="none"
        )
        self.style.map("TButton", 
            background=[("active", "#DDDDDD")],
            foreground=[("active", "#000000")]
        )
        self.style.configure("TCheckbutton", background=bg_color, foreground=fg_color)
        self.style.map("TCheckbutton", background=[("active", bg_color)])
        self.style.configure("TRadiobutton", background=bg_color, foreground=fg_color)
        self.style.map("TRadiobutton", background=[("active", bg_color)])
        self.style.configure("TLabelframe", background=bg_color, foreground=fg_color, bordercolor=fg_color)
        self.style.configure("TLabelframe.Label", background=bg_color, foreground=fg_color, font=self.header_font)
        self.style.configure("Vertical.TScrollbar", background="#FFFFFF", troughcolor=bg_color, bordercolor=bg_color, arrowcolor="#000000")

        self.game_version = tk.StringVar(value="fh1")
        self.game_path = tk.StringVar()
        self.status_var = tk.StringVar()
        self.status_var.set("Ready")

        self.mods_dir = Path(__file__).parent.parent / "www" / "mods"
        self.available_mods = []
        self.selected_mods = {}

        # Main Container
        self.main_frame = tk.Frame(self, bg=bg_color)
        self.main_frame.pack(fill="both", expand=True)

        self.create_widgets()
        self.auto_detect_game_path()
        self.load_mods()

    def create_widgets(self):
        # --- BOTTOM SECTION (Packed First) ---
        bottom_frame = tk.Frame(self.main_frame, bg="#000000")
        bottom_frame.pack(side="bottom", fill="x", padx=15, pady=10)

        # Status
        status_lbl = tk.Label(bottom_frame, textvariable=self.status_var, bg="#000000", fg="#FFFFFF", font=("Courier", 10))
        status_lbl.pack(pady=(5, 5))

        # Big Install Button
        install_btn = tk.Button(
            bottom_frame, 
            text="INSTALL MODS", 
            command=self.install,
            bg="#FFFFFF",
            fg="#000000",
            font=("Courier", 16, "bold"),
            activebackground="#CCCCCC",
            activeforeground="#000000",
            relief="raised",
            bd=3,
            padx=20,
            pady=10
        )
        install_btn.pack(fill="x", pady=5)

        # Footer / Credits
        credits_text = "Mod Manager by MattieFM | Linux Installer by Asukate"
        tk.Label(bottom_frame, text=credits_text, bg="#000000", fg="#FFFFFF", font=("Courier", 10)).pack()
        
        # Small About button
        ttk.Button(bottom_frame, text="License Info", command=self.show_about).pack(pady=5)


        # --- TOP SECTION ---
        top_frame = tk.Frame(self.main_frame, bg="#000000")
        top_frame.pack(side="top", fill="x", padx=15, pady=10)

        # Header
        header_label = tk.Label(top_frame, text="Fear & Hunger Mod Manager", font=("Courier", 22, "bold"), bg="#000000", fg="#FFFFFF")
        header_label.pack(pady=5)

        # Game Selection Frame (Custom Buttons)
        game_frame = ttk.LabelFrame(top_frame, text="Select Game Version")
        game_frame.pack(fill="x", pady=5)

        # Container for buttons
        game_btn_container = tk.Frame(game_frame, bg="#000000")
        game_btn_container.pack(fill="x", padx=10, pady=10)

        self.btn_fh1 = tk.Button(
            game_btn_container,
            text="Fear & Hunger 1",
            font=("Courier", 12, "bold"),
            command=lambda: self.select_game("fh1"),
            relief="raised",
            bd=2,
            padx=10,
            pady=5
        )
        self.btn_fh1.pack(side="left", fill="x", expand=True, padx=(0, 5))

        self.btn_fh2 = tk.Button(
            game_btn_container,
            text="Fear & Hunger 2: Termina",
            font=("Courier", 12, "bold"),
            command=lambda: self.select_game("fh2"),
            relief="raised",
            bd=2,
            padx=10,
            pady=5
        )
        self.btn_fh2.pack(side="left", fill="x", expand=True, padx=(5, 0))
        
        # Initialize button states
        self.update_game_buttons()


        # Path Selection Frame
        path_frame = ttk.LabelFrame(top_frame, text="Game Installation Directory")
        path_frame.pack(fill="x", pady=5)

        entry = ttk.Entry(path_frame, textvariable=self.game_path)
        entry.pack(side="left", fill="x", expand=True, padx=(5, 5), pady=5)
        
        ttk.Button(path_frame, text="Browse", command=self.browse_path).pack(side="right", padx=(0, 5), pady=5)


        # --- MIDDLE SECTION (Mod List - Takes remaining space) ---
        mod_frame = ttk.LabelFrame(self.main_frame, text="Select Mods to Install")
        mod_frame.pack(side="top", fill="both", expand=True, padx=15, pady=5)

        # Canvas and Scrollbar for Mods
        canvas = tk.Canvas(mod_frame, bg="#000000", highlightthickness=0)
        scrollbar = ttk.Scrollbar(mod_frame, orient="vertical", command=canvas.yview)
        self.scrollable_frame = tk.Frame(canvas, bg="#000000")

        self.scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )

        canvas.create_window((0, 0), window=self.scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)

        canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")


    def select_game(self, version):
        self.game_version.set(version)
        self.update_game_buttons()
        self.auto_detect_game_path()

    def update_game_buttons(self):
        ver = self.game_version.get()
        
        # Selected Style: White BG, Black Text
        # Unselected Style: Black BG, White Text
        
        if ver == "fh1":
            self.btn_fh1.configure(bg="#FFFFFF", fg="#000000", relief="sunken")
            self.btn_fh2.configure(bg="#000000", fg="#FFFFFF", relief="raised")
        else:
            self.btn_fh1.configure(bg="#000000", fg="#FFFFFF", relief="raised")
            self.btn_fh2.configure(bg="#FFFFFF", fg="#000000", relief="sunken")

    def browse_path(self):
        directory = filedialog.askdirectory()
        if directory:
            self.game_path.set(directory)

    def auto_detect_game_path(self):
        # Common Steam paths on Linux
        steam_paths = [
            Path.home() / ".steam" / "steam",
            Path.home() / ".local" / "share" / "Steam",
        ]

        possible_libraries = []
        for p in steam_paths:
            if p.exists():
                possible_libraries.append(p / "steamapps")
                # Try to read libraryfolders.vdf
                vdf_path = p / "steamapps" / "libraryfolders.vdf"
                if vdf_path.exists():
                    try:
                        with open(vdf_path, 'r') as f:
                            content = f.read()
                            import re
                            matches = re.findall(r'"path"\s+"([^"]+)"', content)
                            for m in matches:
                                possible_libraries.append(Path(m) / "steamapps")
                    except Exception as e:
                        print(f"Error reading VDF: {e}")

        target_folders = []
        if self.game_version.get() == "fh1":
            target_folders = ["Fear & Hunger", "FearAndHunger"]
        else:
            target_folders = ["Fear & Hunger 2 Termina", "FearAndHunger2Termina", "Fear & Hunger 2"]

        found = False
        for lib in possible_libraries:
            for folder in target_folders:
                game_dir = lib / "common" / folder
                if game_dir.exists():
                    self.game_path.set(str(game_dir))
                    self.status_var.set(f"Found {folder}!")
                    found = True
                    break
            if found: break

        if not found:
            self.status_var.set("Game not found. Please select manually.")
            self.game_path.set("")

    def load_mods(self):
        # Clear existing checkboxes
        for widget in self.scrollable_frame.winfo_children():
            widget.destroy()
        self.selected_mods.clear()

        if not self.mods_dir.exists():
            return

        hidden_mods = [
            "commonLibs", "mattieFMModLoader.js", "mattieFMModLoader.json", 
            "notes.txt", "README.md"
        ]
        
        for item in sorted(self.mods_dir.glob("*.js")):
            if item.name in hidden_mods:
                continue
            if item.name.startswith("_"):
                continue

            mod_name = item.stem
            var = tk.BooleanVar(value=True)
            chk = ttk.Checkbutton(self.scrollable_frame, text=mod_name, variable=var)
            chk.pack(anchor="w", padx=5, pady=2)
            self.selected_mods[mod_name] = var

    def show_about(self):
        about_window = tk.Toplevel(self)
        about_window.title("About")
        about_window.geometry("400x300")
        about_window.configure(bg="#000000")
        
        info = """
Fear & Hunger Mod Manager
-------------------------
Original Creator: mattieFM
Linux Installer by: Asukate

License: CC BY-NC-SA 4.0 (See LICENSE file)
        """
        
        lbl = tk.Label(about_window, text=info, justify="center", bg="#000000", fg="#FFFFFF", font=("Courier", 10))
        lbl.pack(expand=True, fill="both", padx=20, pady=20)
        
        ttk.Button(about_window, text="Close", command=about_window.destroy).pack(pady=10)

    def show_success_screen(self):
        # Hide main frame
        self.main_frame.pack_forget()
        
        # Show success frame
        success_frame = tk.Frame(self, bg="#000000")
        success_frame.pack(fill="both", expand=True)
        
        tk.Label(success_frame, text="INSTALLATION COMPLETE", font=("Courier", 24, "bold"), bg="#000000", fg="#FFFFFF").pack(expand=True)
        
        tk.Label(success_frame, text="The mods have been successfully installed.", font=("Courier", 12), bg="#000000", fg="#FFFFFF").pack(pady=10)
        tk.Label(success_frame, text="You can close the installer now.", font=("Courier", 12), bg="#000000", fg="#FFFFFF").pack(pady=10)
        
        # Big Exit Button
        tk.Button(
            success_frame, 
            text="EXIT", 
            command=self.quit,
            bg="#FFFFFF",
            fg="#000000",
            font=("Courier", 16, "bold"),
            relief="raised",
            bd=3,
            padx=30,
            pady=10
        ).pack(pady=30)

    def install(self):
        dest_path = Path(self.game_path.get())
        if not dest_path.exists():
            messagebox.showerror("Error", "Invalid game directory.")
            return

        # Basic validation
        if not (dest_path / "www").exists():
             if dest_path.name == "www":
                 dest_path = dest_path.parent
             else:
                 # Check for executables
                 exes = ["Game.exe", "Game.x86_64", "Fear & Hunger 2 Termina.exe", "Fear & Hunger 2 Termina.x86_64"]
                 if not any((dest_path / exe).exists() for exe in exes):
                     if not messagebox.askyesno("Warning", "Game executable or 'www' folder not found. Continue anyway?"):
                         return

        try:
            self.status_var.set("Installing...")
            self.update_idletasks()

            # 1. Copy index.html
            src_www = self.mods_dir.parent
            shutil.copy2(src_www / "index.html", dest_path / "www" / "index.html")

            # 2. Create mods folder in destination
            dest_mods = dest_path / "www" / "mods"
            dest_mods.mkdir(parents=True, exist_ok=True)

            # 3. Copy Core Loader
            shutil.copy2(self.mods_dir / "mattieFMModLoader.js", dest_mods / "mattieFMModLoader.js")
            
            # Copy commonLibs
            src_common = self.mods_dir / "commonLibs"
            if src_common.exists():
                if (dest_mods / "commonLibs").exists():
                    shutil.rmtree(dest_mods / "commonLibs")
                shutil.copytree(src_common, dest_mods / "commonLibs")

            # 4. Copy Selected Mods
            for mod_name, var in self.selected_mods.items():
                if var.get():
                    # Copy .js
                    src_js = self.mods_dir / f"{mod_name}.js"
                    if src_js.exists():
                        shutil.copy2(src_js, dest_mods / f"{mod_name}.js")
                    
                    # Copy .json if exists
                    src_json = self.mods_dir / f"{mod_name}.json"
                    if src_json.exists():
                        shutil.copy2(src_json, dest_mods / f"{mod_name}.json")

                    # Copy asset folder if exists (starts with _)
                    src_assets = self.mods_dir / f"_{mod_name}"
                    if src_assets.exists():
                        dest_assets = dest_mods / f"_{mod_name}"
                        if dest_assets.exists():
                            shutil.rmtree(dest_assets)
                        shutil.copytree(src_assets, dest_assets)
                    
                    # Copy asset folder without underscore
                    src_assets_no_score = self.mods_dir / f"{mod_name}"
                    if src_assets_no_score.exists() and src_assets_no_score.is_dir():
                         dest_assets_no_score = dest_mods / f"{mod_name}"
                         if dest_assets_no_score.exists():
                             shutil.rmtree(dest_assets_no_score)
                         shutil.copytree(src_assets_no_score, dest_assets_no_score)


            self.show_success_screen()

        except Exception as e:
            self.status_var.set("Error during installation.")
            messagebox.showerror("Error", str(e))
            print(e)

if __name__ == "__main__":
    app = ModManagerInstaller()
    app.mainloop()
