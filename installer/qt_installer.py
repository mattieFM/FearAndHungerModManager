#!/usr/bin/env python3
"""
Fear & Hunger Mod Manager - Qt Installer
RPG Maker style aesthetic with dark, grim visuals

Requires: PyQt6 or PyQt5
Install: pip install PyQt6
"""

import sys
import os
from pathlib import Path
import shutil
import re

try:
    from PyQt6.QtWidgets import (
        QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
        QLabel, QPushButton, QCheckBox, QLineEdit, QFileDialog,
        QMessageBox, QScrollArea, QFrame, QGroupBox, QRadioButton,
        QButtonGroup, QProgressBar
    )
    from PyQt6.QtCore import Qt, QTimer
    from PyQt6.QtGui import QFont, QIcon, QColor, QPalette
except ImportError:
    from PyQt5.QtWidgets import (
        QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
        QLabel, QPushButton, QCheckBox, QLineEdit, QFileDialog,
        QMessageBox, QScrollArea, QFrame, QGroupBox, QRadioButton,
        QButtonGroup, QProgressBar
    )
    from PyQt5.QtCore import Qt, QTimer
    from PyQt5.QtGui import QFont, QColor, QPalette


class FearHungerPalette:
    """RPG Maker style color palette - dark, grim aesthetic"""
    BG_BLACK = "#0a0a0a"
    BG_DARK = "#1a1a1a"
    BG_MEDIUM = "#2a2a2a"
    FG_WHITE = "#f0f0f0"
    FG_GRAY = "#888888"
    FG_DIM = "#444444"
    ACCENT_BLOOD = "#8b0000"
    ACCENT_RED = "#aa0000"
    BORDER = "#333333"
    SELECTED = "#3a3a3a"


class FearHungerStyle:
    """Apply RPG Maker style to Qt widgets"""
    
    @staticmethod
    def apply(window: QMainWindow):
        palette = QPalette()
        palette.setColor(QPalette.ColorRole.Window, QColor(FearHungerPalette.BG_BLACK))
        palette.setColor(QPalette.ColorRole.WindowText, QColor(FearHungerPalette.FG_WHITE))
        palette.setColor(QPalette.ColorRole.Base, QColor(FearHungerPalette.BG_DARK))
        palette.setColor(QPalette.ColorRole.AlternateBase, QColor(FearHungerPalette.BG_MEDIUM))
        palette.setColor(QPalette.ColorRole.Text, QColor(FearHungerPalette.FG_WHITE))
        palette.setColor(QPalette.ColorRole.Button, QColor(FearHungerPalette.BG_MEDIUM))
        palette.setColor(QPalette.ColorRole.ButtonText, QColor(FearHungerPalette.FG_WHITE))
        palette.setColor(QPalette.ColorRole.Highlight, QColor(FearHungerPalette.ACCENT_RED))
        palette.setColor(QPalette.ColorRole.HighlightedText, QColor(FearHungerPalette.FG_WHITE))
        palette.setColor(QPalette.ColorRole.Link, QColor(FearHungerPalette.ACCENT_BLOOD))
        window.setPalette(palette)


class RetroFont:
    """RPG Maker style pixelated fonts"""
    
    @staticmethod
    def header(size=18):
        font = QFont("Courier New", size, QFont.Weight.Bold)
        return font
    
    @staticmethod
    def body(size=11):
        font = QFont("Courier New", size)
        return font
    
    @staticmethod
    def button(size=12):
        font = QFont("Courier New", size, QFont.Weight.Bold)
        return font


class ModManagerInstaller(QMainWindow):
    def __init__(self):
        super().__init__()
        
        self.setWindowTitle("Fear & Hunger Mod Manager Installer")
        self.setGeometry(100, 100, 700, 750)
        self.setMinimumSize(600, 600)
        
        FearHungerStyle.apply(self)
        
        self.game_version = "fh1"
        self.game_path = ""
        self.available_mods = []
        self.selected_mods = {}
        
        script_dir = Path(__file__).parent
        self.mods_dir = script_dir.parent / "www" / "mods"
        
        self.setup_ui()
        self.auto_detect_game_path()
        self.load_mods()
    
    def setup_ui(self):
        central = QWidget()
        self.setCentralWidget(central)
        
        main_layout = QVBoxLayout(central)
        main_layout.setSpacing(10)
        main_layout.setContentsMargins(20, 20, 20, 20)
        
        main_layout.addWidget(self.create_header())
        main_layout.addWidget(self.create_game_selector())
        main_layout.addWidget(self.create_path_selector())
        main_layout.addWidget(self.create_mod_selector(), 1)
        main_layout.addWidget(self.create_footer())
    
    def create_header(self) -> QFrame:
        frame = QFrame()
        frame.setStyleSheet(f"background-color: {FearHungerPalette.BG_BLACK};")
        layout = QVBoxLayout(frame)
        layout.setContentsMargins(0, 0, 0, 10)
        
        title = QLabel("Fear & Hunger Mod Manager")
        title.setFont(RetroFont.header(24))
        title.setStyleSheet(f"color: {FearHungerPalette.FG_WHITE};")
        title.setAlignment(Qt.AlignmentFlag.AlignCenter)
        layout.addWidget(title)
        
        subtitle = QLabel("Linux Installer - Qt Edition")
        subtitle.setFont(RetroFont.body(10))
        subtitle.setStyleSheet(f"color: {FearHungerPalette.FG_GRAY};")
        subtitle.setAlignment(Qt.AlignmentFlag.AlignCenter)
        layout.addWidget(subtitle)
        
       sep = QFrame()
        sep.setStyleSheet(f"background-color: {FearHungerPalette.BORDER}; min-height: 2; max-height: 2;")
        layout.addWidget(sep)
        
        return frame
    
    def create_game_selector(self) -> QGroupBox:
        group = QGroupBox("Select Game Version")
        group.setFont(RetroFont.header(14))
        group.setStyleSheet(f"""
            QGroupBox {{
                color: {FearHungerPalette.FG_WHITE};
                border: 1px solid {FearHungerPalette.BORDER};
                margin-top: 10px;
                padding-top: 10px;
                background-color: {FearHungerPalette.BG_DARK};
            }}
            QGroupBox::title {{
                subcontrol-origin: margin;
                subcontrol-position: top left;
                padding-left: 5px;
                padding-right: 5px;
            }}
        """)
        
        layout = QHBoxLayout(group)
        layout.setSpacing(10)
        
        self.game_group = QButtonGroup(self)
        
        btn_fh1 = QRadioButton("Fear & Hunger 1")
        btn_fh1.setFont(RetroFont.button(12))
        btn_fh1.setStyleSheet(f"""
            QRadioButton {{
                color: {FearHungerPalette.FG_WHITE};
                background-color: {FearHungerPalette.BG_MEDIUM};
                padding: 10px 20px;
                border: 2px solid {FearHungerPalette.BORDER};
            }}
            QRadioButton::indicator {{
                width: 16px;
                height: 16px;
            }}
            QRadioButton:checked {{
                background-color: {FearHungerPalette.FG_WHITE};
                color: {FearHungerPalette.BG_BLACK};
            }}
        """)
        btn_fh1.setChecked(True)
        btn_fh1.toggled.connect(lambda: self.on_game_toggled("fh1") if btn_fh1.isChecked() else None)
        
        btn_fh2 = QRadioButton("Fear & Hunger 2: Termina")
        btn_fh2.setFont(RetroFont.button(12))
        btn_fh2.setStyleSheet(f"""
            QRadioButton {{
                color: {FearHungerPalette.FG_WHITE};
                background-color: {FearHungerPalette.BG_MEDIUM};
                padding: 10px 20px;
                border: 2px solid {FearHungerPalette.BORDER};
            }}
            QRadioButton::indicator {{
                width: 16px;
                height: 16px;
            }}
            QRadioButton:checked {{
                background-color: {FearHungerPalette.FG_WHITE};
                color: {FearHungerPalette.BG_BLACK};
            }}
        """)
        btn_fh2.toggled.connect(lambda: self.on_game_toggled("fh2") if btn_fh2.isChecked() else None)
        
        self.game_group.addButton(btn_fh1)
        self.game_group.addButton(btn_fh2)
        
        layout.addWidget(btn_fh1)
        layout.addWidget(btn_fh2)
        
        return group
    
    def on_game_toggled(self, version):
        self.game_version = version
        self.auto_detect_game_path()
    
    def create_path_selector(self) -> QGroupBox:
        group = QGroupBox("Game Installation Directory")
        group.setFont(RetroFont.header(14))
        group.setStyleSheet(f"""
            QGroupBox {{
                color: {FearHungerPalette.FG_WHITE};
                border: 1px solid {FearHungerPalette.BORDER};
                margin-top: 10px;
                padding-top: 10px;
                background-color: {FearHungerPalette.BG_DARK};
            }}
        """)
        
        layout = QHBoxLayout(group)
        layout.setSpacing(10)
        
        self.path_edit = QLineEdit()
        self.path_edit.setFont(RetroFont.body(11))
        self.path_edit.setPlaceholderText("Select game directory...")
        self.path_edit.setStyleSheet(f"""
            QLineEdit {{
                color: {FearHungerPalette.FG_WHITE};
                background-color: {FearHungerPalette.BG_MEDIUM};
                border: 1px solid {FearHungerPalette.BORDER};
                padding: 8px;
            }}
        """)
        layout.addWidget(self.path_edit, 1)
        
        browse_btn = QPushButton("Browse")
        browse_btn.setFont(RetroFont.button(12))
        browse_btn.setStyleSheet(f"""
            QPushButton {{
                color: {FearHungerPalette.BG_BLACK};
                background-color: {FearHungerPalette.FG_WHITE};
                border: 2px solid {FearHungerPalette.BORDER};
                padding: 8px 16px;
                min-width: 80px;
            }}
            QPushButton:hover {{
                background-color: {FearHungerPalette.FG_GRAY};
            }}
            QPushButton:pressed {{
                background-color: {FearHungerPalette.BG_MEDIUM};
                color: {FearHungerPalette.FG_WHITE};
            }}
        """)
        browse_btn.clicked.connect(self.browse_path)
        layout.addWidget(browse_btn)
        
        return group
    
    def create_mod_selector(self) -> QGroupBox:
        group = QGroupBox("Select Mods to Install")
        group.setFont(RetroFont.header(14))
        group.setStyleSheet(f"""
            QGroupBox {{
                color: {FearHungerPalette.FG_WHITE};
                border: 1px solid {FearHungerPalette.BORDER};
                margin-top: 10px;
                padding-top: 10px;
                background-color: {FearHungerPalette.BG_DARK};
            }}
        """)
        
        layout = QVBoxLayout(group)
        
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setStyleSheet(f"""
            QScrollArea {{
                border: 1px solid {FearHungerPalette.BORDER};
                background-color: {FearHungerPalette.BG_DARK};
            }}
            QScrollBar:vertical {{
                background-color: {FearHungerPalette.BG_MEDIUM};
                width: 14px;
                margin: 0px;
            }}
            QScrollBar::handle:vertical {{
                background-color: {FearHungerPalette.FG_GRAY};
                min-height: 30px;
            }}
            QScrollBar::add-line:vertical, QScrollBar::sub-line:vertical {{
                height: 0px;
            }}
        """)
        
        self.mod_container = QWidget()
        self.mod_layout = QVBoxLayout(self.mod_container)
        self.mod_layout.setSpacing(5)
        self.mod_layout.setContentsMargins(5, 5, 5, 5)
        self.mod_layout.setAlignment(Qt.AlignmentFlag.AlignTop)
        
        scroll.setWidget(self.mod_container)
        layout.addWidget(scroll)
        
        return group
    
    def create_footer(self) -> QFrame:
        frame = QFrame()
        frame.setStyleSheet(f"background-color: {FearHungerPalette.BG_BLACK};")
        layout = QVBoxLayout(frame)
        layout.setContentsMargins(0, 10, 0, 0)
        
        sep = QFrame()
        sep.setStyleSheet(f"background-color: {FearHungerPalette.BORDER}; min-height: 2; max-height: 2;")
        layout.addWidget(sep)
        
        self.status_label = QLabel("Ready")
        self.status_label.setFont(RetroFont.body(10))
        self.status_label.setStyleSheet(f"color: {FearHungerPalette.FG_GRAY};")
        self.status_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        layout.addWidget(self.status_label)
        
        install_btn = QPushButton("INSTALL MODS")
        install_btn.setFont(RetroFont.header(16))
        install_btn.setStyleSheet(f"""
            QPushButton {{
                color: {FearHungerPalette.BG_BLACK};
                background-color: {FearHungerPalette.FG_WHITE};
                border: 3px solid {FearHungerPalette.FG_GRAY};
                padding: 15px 30px;
            }}
            QPushButton:hover {{
                background-color: {FearHungerPalette.FG_GRAY};
            }}
            QPushButton:pressed {{
                background-color: {FearHungerPalette.BG_MEDIUM};
                color: {FearHungerPalette.FG_WHITE};
                border-color: {FearHungerPalette.ACCENT_RED};
            }}
        """)
        install_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        install_btn.clicked.connect(self.install)
        layout.addWidget(install_btn)
        
        credits = QLabel("Mod Manager by MattieFM | Linux Installer by Asukate")
        credits.setFont(RetroFont.body(9))
        credits.setStyleSheet(f"color: {FearHungerPalette.FG_DIM};")
        credits.setAlignment(Qt.AlignmentFlag.AlignCenter)
        layout.addWidget(credits)
        
        return frame
    
    def browse_path(self):
        directory = QFileDialog.getExistingDirectory(
            self,
            "Select Game Directory",
            "",
            QFileDialog.Option.ShowDirsOnly
        )
        if directory:
            self.path_edit.setText(directory)
            self.game_path = directory
    
    def auto_detect_game_path(self):
        steam_paths = [
            Path.home() / ".steam" / "steam",
            Path.home() / ".local" / "share" / "Steam",
        ]
        
        possible_libraries = []
        for p in steam_paths:
            if p.exists():
                possible_libraries.append(p / "steamapps")
                vdf_path = p / "steamapps" / "libraryfolders.vdf"
                if vdf_path.exists():
                    try:
                        with open(vdf_path, 'r') as f:
                            content = f.read()
                            matches = re.findall(r'"path"\s+"([^"]+)"', content)
                            for m in matches:
                                possible_libraries.append(Path(m) / "steamapps")
                    except Exception as e:
                        print(f"VDF parse error: {e}")
        
        target_folders = []
        if self.game_version == "fh1":
            target_folders = ["Fear & Hunger", "FearAndHunger"]
        else:
            target_folders = ["Fear & Hunger 2 Termina", "FearAndHunger2Termina", "Fear & Hunger 2"]
        
        found = False
        for lib in possible_libraries:
            for folder in target_folders:
                game_dir = lib / "common" / folder
                if game_dir.exists():
                    self.path_edit.setText(str(game_dir))
                    self.game_path = str(game_dir)
                    self.status_label.setText(f"Found: {folder}")
                    found = True
                    break
            if found:
                break
        
        if not found:
            self.status_label.setText("Game not found. Please select manually.")
    
    def load_mods):
        while self.mod_layout.count():
            item = self.mod_layout.takeAt(0)
            if item.widget():
                item.widget().deleteLater()
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
            
            checkbox = QCheckBox(mod_name)
            checkbox.setFont(RetroFont.body(11))
            checkbox.setStyleSheet(f"""
                QCheckBox {{
                    color: {FearHungerPalette.FG_WHITE};
                    padding: 5px;
                }}
                QCheckBox::indicator {{
                    width: 16px;
                    height: 16px;
                    border: 1px solid {FearHungerPalette.BORDER};
                }}
                QCheckBox::indicator:checked {{
                    background-color: {FearHungerPalette.ACCENT_RED};
                    border: 1px solid {FearHungerPalette.ACCENT_BLOOD};
                }}
                QCheckBox:hover {{
                    background-color: {FearHungerPalette.SELECTED};
                }}
            """)
            checkbox.setChecked(True)
            self.mod_layout.addWidget(checkbox)
            self.selected_mods[mod_name] = checkbox
    
    def install(self):
        dest_path = Path(self.path_edit.text())
        if not dest_path.exists():
            QMessageBox.critical(self, "Error", "Invalid game directory.")
            return
        
        if not (dest_path / "www").exists():
            exes = ["Game.exe", "Game.x86_64", "Fear & Hunger 2 Termina.exe", "Fear & Hunger 2 Termina.x86_64"]
            if not any((dest_path / exe).exists() for exe in exes):
                reply = QMessageBox.question(
                    self, "Warning",
                    "Game executable or 'www' folder not found. Continue anyway?",
                    QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No
                )
                if reply == QMessageBox.StandardButton.No:
                    return
        
        try:
            self.status_label.setText("Installing...")
            QApplication.processEvents()
            
            src_www = self.mods_dir.parent
            shutil.copy2(src_www / "index.html", dest_path / "www" / "index.html")
            
            dest_mods = dest_path / "www" / "mods"
            dest_mods.mkdir(parents=True, exist_ok=True)
            
            shutil.copy2(self.mods_dir / "mattieFMModLoader.js", dest_mods / "mattieFMModLoader.js")
            
            src_common = self.mods_dir / "commonLibs"
            if src_common.exists():
                if (dest_mods / "commonLibs").exists():
                    shutil.rmtree(dest_mods / "commonLibs")
                shutil.copytree(src_common, dest_mods / "commonLibs")
            
            for mod_name, checkbox in self.selected_mods.items():
                if checkbox.isChecked():
                    src_js = self.mods_dir / f"{mod_name}.js"
                    if src_js.exists():
                        shutil.copy2(src_js, dest_mods / f"{mod_name}.js")
                    
                    src_json = self.mods_dir / f"{mod_name}.json"
                    if src_json.exists():
                        shutil.copy2(src_json, dest_mods / f"{mod_name}.json")
                    
                    src_assets = self.mods_dir / f"_{mod_name}"
                    if src_assets.exists():
                        dest_assets = dest_mods / f"_{mod_name}"
                        if dest_assets.exists():
                            shutil.rmtree(dest_assets)
                        shutil.copytree(src_assets, dest_assets)
            
            self.show_success()
            
        except Exception as e:
            self.status_label.setText("Installation failed.")
            QMessageBox.critical(self, "Error", str(e))
    
    def show_success(self):
        msg = QMessageBox(self)
        msg.setWindowTitle("Installation Complete")
        msg.setText("INSTALLATION COMPLETE")
        msg.setInformativeText("The mods have been successfully installed.\nYou can close the installer now.")
        msg.setIcon(QMessageBox.Icon.Information)
        msg.setStyleSheet(f"""
            QMessageBox {{
                background-color: {FearHungerPalette.BG_BLACK};
                color: {FearHungerPalette.FG_WHITE};
            }}
        """)
        
        ok_btn = QPushButton("OK")
        ok_btn.setFont(RetroFont.button(12))
        ok_btn.clicked.connect(self.close)
        msg.addButton(ok_btn, QMessageBox.ButtonRole.AcceptRole)
        
        msg.exec()


def main():
    app = QApplication(sys.argv)
    app.setStyle("Fusion")
    
    palette = QPalette()
    palette.setColor(QPalette.ColorRole.Window, QColor(FearHungerPalette.BG_BLACK))
    palette.setColor(QPalette.ColorRole.WindowText, QColor(FearHungerPalette.FG_WHITE))
    app.setPalette(palette)
    
    app.setStyleSheet(f"""
        QMainWindow, QWidget {{
            background-color: {FearHungerPalette.BG_BLACK};
        }}
    """)
    
    window = ModManagerInstaller()
    window.show()
    sys.exit(app.exec())


if __name__ == "__main__":
    main()