#!/bin/bash

# Check for Python 3
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed. Installing..."
    sudo pacman -S --noconfirm python
fi

# Check for Tkinter
if ! python3 -c "import tkinter" &> /dev/null; then
    echo "Tkinter is not installed. Installing..."
    sudo pacman -S --noconfirm tk
fi

# Run the installer
echo "Starting Fear & Hunger Mod Manager Installer..."
python3 installer/install.py
