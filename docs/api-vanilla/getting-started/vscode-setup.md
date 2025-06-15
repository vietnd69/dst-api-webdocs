---
id: vscode-setup
title: Setting Up VSCode
sidebar_position: 15
last_updated: 2023-07-06
---

# Setting Up VSCode for DST Modding

Visual Studio Code (VSCode) is a powerful, lightweight code editor that works well for Don't Starve Together mod development. This guide will walk you through setting up VSCode with extensions and configurations specifically tailored for DST modding.

## Why Use VSCode for DST Modding?

- **Lua Support**: Built-in syntax highlighting and formatting for Lua files
- **Extensions**: Rich ecosystem of extensions for DST modding
- **Integrated Terminal**: Run and test mods directly from the editor
- **Git Integration**: Version control your mods easily
- **Customizable**: Adapt the editor to your workflow
- **Free and Cross-Platform**: Works on Windows, macOS, and Linux

## Installation

1. Download and install VSCode from the [official website](https://code.visualstudio.com/)
2. Launch VSCode after installation

## Essential Extensions for DST Modding

### 1. Lua Language Support

Install the Lua language extension to get syntax highlighting, code completion, and linting for Lua files:

1. Open the Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X` on macOS)
2. Search for "Lua"
3. Install "Lua" by sumneko

### 2. DST API Extension

The Don't Starve Together API extension provides autocompletion and documentation for DST's API:

1. Open the Extensions view
2. Search for "dst-lan"
3. Install "Don't Starve Together API Complete Extension"

This extension is maintained on GitHub: [b1inkie/dst-api](https://github.com/b1inkie/dst-api)

### 3. Lua Debug

For debugging your mods:

1. Open the Extensions view
2. Search for "Local Lua Debugger"
3. Install "Local Lua Debugger" by tomblind

## Configuring VSCode for DST Modding

### Workspace Settings

Create a `.vscode` folder in your mod directory and add a `settings.json` file with these recommended settings:

```json
{
  "Lua.diagnostics.globals": [
    "GLOBAL",
    "TheWorld",
    "ThePlayer",
    "TheNet",
    "TheSim",
    "TUNING",
    "STRINGS",
    "ACTIONS",
    "EQUIPSLOTS",
    "RECIPETABS",
    "TECH",
    "SpawnPrefab",
    "CreateEntity",
    "AddComponent"
  ],
  "Lua.workspace.library": [
    // Add path to your DST installation's scripts directory
    "[Steam Directory]/steamapps/common/Don't Starve Together/data/scripts"
  ],
  "Lua.workspace.preloadFileSize": 1000,
  "editor.tabSize": 4,
  "editor.insertSpaces": true,
  "files.encoding": "utf8",
  "files.trimTrailingWhitespace": true
}
```

> **Note**: Adjust the path to your DST installation as needed.

### Snippets

Create a `lua.json` file in the `.vscode` folder with useful snippets for DST modding:

```json
{
  "Create Basic Prefab": {
    "prefix": "dstprefab",
    "body": [
      "local assets = {",
      "    -- Add your assets here",
      "}",
      "",
      "local prefabs = {",
      "    -- Add your prefabs here",
      "}",
      "",
      "local function fn()",
      "    local inst = CreateEntity()",
      "    ",
      "    inst.entity:AddTransform()",
      "    inst.entity:AddAnimState()",
      "    inst.entity:AddNetwork()",
      "    ",
      "    MakeInventoryPhysics(inst)",
      "    ",
      "    inst.AnimState:SetBank(\"${1:bank}\")",
      "    inst.AnimState:SetBuild(\"${2:build}\")",
      "    inst.AnimState:PlayAnimation(\"${3:idle}\")",
      "    ",
      "    inst.entity:SetPristine()",
      "    ",
      "    if not TheWorld.ismastersim then",
      "        return inst",
      "    end",
      "    ",
      "    inst:AddComponent(\"inspectable\")",
      "    inst:AddComponent(\"inventoryitem\")",
      "    ",
      "    return inst",
      "end",
      "",
      "return Prefab(\"${4:prefab_name}\", fn, assets, prefabs)"
    ],
    "description": "Creates a basic DST prefab template"
  },
  "Add Component": {
    "prefix": "dstcomponent",
    "body": [
      "inst:AddComponent(\"${1:component}\")",
      "inst.components.${1:component}:${2:SetSomeProperty}(${3:value})"
    ],
    "description": "Adds a component to an entity"
  }
}
```

## Setting Up Your Mod Project

### Folder Structure

Create a consistent folder structure for your mods:

```
my_mod/
├── modinfo.lua        # Mod metadata
├── modmain.lua        # Main mod file
├── scripts/           # Custom scripts
│   ├── prefabs/       # Custom prefabs
│   ├── components/    # Custom components
│   └── widgets/       # Custom UI widgets
├── anim/              # Custom animations
├── images/            # Images and icons
└── .vscode/           # VSCode configuration
    ├── settings.json
    └── lua.json
```

### Linking to Your DST Mods Folder

For easier testing, you can create a symbolic link from your development folder to the DST mods folder:

#### Windows:
```
mklink /D "C:\Program Files (x86)\Steam\steamapps\common\Don't Starve Together\mods\my_mod" "C:\path\to\your\development\my_mod"
```

#### macOS/Linux:
```
ln -s /path/to/your/development/my_mod "/path/to/steam/steamapps/common/Don't Starve Together/mods/my_mod"
```

## Useful VSCode Keyboard Shortcuts

| Action | Windows | macOS |
|--------|---------|-------|
| Open Command Palette | `Ctrl+Shift+P` | `Cmd+Shift+P` |
| Quick Open File | `Ctrl+P` | `Cmd+P` |
| Find in Files | `Ctrl+Shift+F` | `Cmd+Shift+F` |
| Toggle Terminal | `` Ctrl+` `` | `` Cmd+` `` |
| Format Document | `Shift+Alt+F` | `Shift+Option+F` |
| Go to Definition | `F12` | `F12` |
| Rename Symbol | `F2` | `F2` |

## Troubleshooting

### Lua Language Server Issues

If you encounter issues with the Lua language server:

1. Reload VSCode (`Ctrl+Shift+P` > "Developer: Reload Window")
2. Check if your Lua path is correctly set in settings.json
3. Make sure your DST scripts path exists and is accessible

### Extension Not Working

If the DST API extension isn't working:

1. Make sure you have the latest version of VSCode (1.73.0+)
2. Check the extension's output channel for errors
3. Try reinstalling the extension

## Additional Resources

- [VSCode Documentation](https://code.visualstudio.com/docs)
- [Lua Language Server Documentation](https://github.com/sumneko/lua-language-server/wiki)
- [Don't Starve Together API Complete Extension](https://github.com/b1inkie/dst-api)
- [Local Lua Debugger Documentation](https://github.com/tomblind/local-lua-debugger-vscode)

## See also

- [Installation](installation.md) - For setting up the basic DST modding environment
- [First Mod](first-mod.md) - For creating your first DST mod
- [Debugging and Testing](debugging-and-testing.md) - For testing your mods
- [Troubleshooting Guide](troubleshooting-guide.md) - For resolving common modding issues 
