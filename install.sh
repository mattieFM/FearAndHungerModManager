#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Fear & Hunger Mod Manager Installer"
echo "================================"

if ! command -v python3 &> /dev/null; then
    echo "Python 3 not found. Please install python3."
    exit 1
fi

if python3 -c "import PyQt6" 2>/dev/null; then
    echo "Using Qt6 GUI..."
    python3 "$SCRIPT_DIR/installer/qt_installer.py"
elif python3 -c "import PyQt5" 2>/dev/null; then
    echo "Using Qt5 GUI..."
    python3 "$SCRIPT_DIR/installer/qt_installer.py"
elif python3 -c "import tkinter" 2>/dev/null; then
    echo "Using Tkinter GUI (fallback)..."
    python3 "$SCRIPT_DIR/installer/install.py"
else
    echo "No GUI toolkit found. Please install one of:"
    echo "  - PyQt6: pip install PyQt6 (recommended)"
    echo "  - PyQt5: pip install PyQt5"
    echo "  - Tkinter: (usually included with Python)"
    echo ""
    echo "Or install on Arch Linux: sudo pacman -S python-pyqt6"
    exit 1
fi