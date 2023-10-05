!include "MUI.nsh"

RequestExecutionLevel admin

!macro CompileTimeIfFileExist path define
!tempfile tmpinc
!system 'IF EXIST "${path}" echo !define ${define} > "${tmpinc}"'
!include "${tmpinc}"
!delfile "${tmpinc}"
!undef tmpinc
!macroend

!macro modImport modName
  File /r ..\www\mods\${modName}.js
  File /r ..\www\mods\${modName}.json
  File /nonfatal /r ..\www\mods\_${modName}



!macroend

# define name of installer
OutFile ".\installers\RPGModManagerInstall.exe"

InstType "Full Install"
InstType "Multiplayer Only"

 PageEx license
   LicenseText "../README.md"
   LicenseData "../LICENSE"
 PageExEnd
Page components

#Get our game dir
!define MUI_DIRECTORYPAGE_TEXT_TOP "Select the folder containing the game.exe file of the game you would like to install the mod manager onto."
!define MUI_TEXT_DIRECTORY_TITLE "Game Folder"
!define MUI_TEXT_DIRECTORY_SUBTITLE "Select Game Folder"
!define MUI_DIRECTORYPAGE_TEXT_DESTINATION "Game Folder"
!insertmacro MUI_PAGE_DIRECTORY

Page instfiles
UninstPage uninstConfirm
UninstPage instfiles


Section "RPG Maker Mod Loader (Required)" 
  SectionIn 1 2
  # common files here
    SetOutPath $INSTDIR
    File ..\README.md
    
    SetOutPath $INSTDIR\www
    File ..\www\index.html
    
    SetOutPath $INSTDIR\www\mods
    File /r ..\www\mods\commonLibs
SectionEnd
 
Section "-Fear and Hunger Mod API" SEC_FUNGER
  SectionIn 1 2
    # ENG files here
SectionEnd
 
Section "-hidden" #set outpath to mods folder
  SetOutPath $INSTDIR\www\mods
SectionEnd

Section "Multiplayer" SEC_MULTIPLAYER
  SectionIn 1 2
    !insertmacro modImport "multiplayer"
SectionEnd

Section "Randomizer" SEC_RANDOM
  SectionIn 1
    !insertmacro modImport "randomiser"
SectionEnd

Section "Unlocked Blood Portal" SEC_BP
  SectionIn 1
    !insertmacro modImport "unlockedBloodPortal"
SectionEnd

Section "Better Saves" SEC_BS
  SectionIn 1
    !insertmacro modImport "betterSaves"
SectionEnd

Section "Quick Saves" SEC_QS 
  SectionIn 1
    !insertmacro modImport "quickSave"
SectionEnd

Section "Better Crow Mauler" SEC_BM
  SectionIn 1
    !insertmacro modImport "betterCrowMauler"
SectionEnd

Section "Dev Tools" SEC_DT
  SectionIn 1
    !insertmacro modImport "devTools"
SectionEnd

Section "Overworld Hurting" SEC_OH
  SectionIn 1
    !insertmacro modImport "overworldHurting"
SectionEnd

Section "BBgirlMod" SEC_BBGRL
  SectionIn 1
    !insertmacro modImport "bbgirlMod"
SectionEnd

Section "Easy Empty Scroll" SEC_EES
  SectionIn 1
    !insertmacro modImport "easyEmptyScroll"
SectionEnd





