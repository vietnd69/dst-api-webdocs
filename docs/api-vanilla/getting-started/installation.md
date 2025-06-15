---
id: installation
title: Installation
sidebar_position: 2
last_updated: 2023-07-06
slug: /api/installation
---

# Installation and Setup for Don't Starve Together Modding

This guide will walk you through setting up your development environment for creating Don't Starve Together mods.

## System Requirements

Before you begin, ensure your system meets these requirements:

- **Don't Starve Together**: Installed via Steam
- **Operating System**: Windows, macOS, or Linux
- **Text Editor**: Any code editor (VS Code, Sublime Text, Notepad++, etc.)
- **Image Editor**: For creating mod icons and textures (optional)

## Setting Up Your Modding Environment

### Step 1: Install Don't Starve Together

If you haven't already, install Don't Starve Together through Steam:

1. Open Steam
2. Search for "Don't Starve Together"
3. Purchase and download the game
4. Wait for installation to complete

### Step 2: Locate the Game Directory

Find your game installation directory:

**Windows**:
```
C:\Program Files (x86)\Steam\steamapps\common\Don't Starve Together
```
or
```
C:\Steam\steamapps\common\Don't Starve Together
```

**macOS**:
```
~/Library/Application Support/Steam/steamapps/common/Don't Starve Together
```

**Linux**:
```
~/.steam/steam/steamapps/common/Don't Starve Together
```

### Step 3: Set Up Your Mods Directory

DST looks for mods in specific locations:

**For Steam Workshop Mods**:
```
[Steam Directory]/steamapps/workshop/content/322330/
```

**For Local Development**:
```
[Game Directory]/mods/
```

Create a folder for your mod in the local mods directory:
```
[Game Directory]/mods/my_first_mod/
```

### Step 4: Enable the Console

The console is essential for debugging:

1. Open `[Game Documents]/DoNotStarveTogether/settings.ini`
2. Find or add the line `ENABLECONSOLE = true`
3. Save the file

**Game Documents Location**:

**Windows**:
```
%USERPROFILE%\Documents\Klei\DoNotStarveTogether\
```

**macOS/Linux**:
```
~/Documents/Klei/DoNotStarveTogether/
```

### Step 5: Install Recommended Tools

These tools will help with mod development:

1. **Visual Studio Code** with Lua extension
   - Download: [https://code.visualstudio.com/](https://code.visualstudio.com/)
   - Install the "Lua" extension by sumneko

2. **Spriter** (for animation work)
   - Used by Klei for character animations
   - Alternative: Use any animation tool you're comfortable with

3. **GIMP or Photoshop** (for texture work)
   - For creating and editing textures and icons

### Step 6: Set Up a Test Environment

Create a dedicated world for testing:

1. Launch Don't Starve Together
2. Click "Play" → "Host Game"
3. Create a new world with these settings:
   - World: Standard
   - Season Start: Default
   - Day Length: Long
   - Resources: Plenty
   - Enable cheats (c_godmode(), c_freecrafting())

### Step 7: Create Basic Mod Files

Create these essential files in your mod folder:

1. **modinfo.lua** - Mod metadata
```lua
name = "My First Mod"
description = "This is my first DST mod!"
author = "Your Name"
version = "1.0.0"
dst_compatible = true
dont_starve_compatible = false
all_clients_require_mod = false
client_only_mod = false
```

2. **modmain.lua** - Main mod code
```lua
print("Hello from My First Mod!")
```

3. **modicon.tex** and **modicon.xml** - Mod icon
   - Create a 184x184 pixel image
   - Export as TEX/XML using Klei's texture tools or community tools

## Using the Developer Console

The console is your primary debugging tool:

1. **Open the Console**: Press the tilde key (`~`)
2. **Common Commands**:
   ```
   c_godmode()              -- Toggles god mode
   c_spawn("prefab_name")   -- Spawns an entity
   c_give("prefab_name")    -- Gives an item to your character
   c_reveal()               -- Reveals the map
   c_reset()                -- Resets the current world
   ```
3. **Mod-specific Commands**:
   ```
   TheSim:GetScreenSize()   -- Gets screen dimensions
   print(ThePlayer.prefab)  -- Prints player character name
   dumptable(TheWorld)      -- Dumps world data for inspection
   ```

## Testing Your Mods

To test your mod:

1. Launch Don't Starve Together
2. Click "Play" → "Host Game"
3. Click "Mods" tab
4. Enable your mod from the list
5. Configure any mod settings
6. Start the game

While testing, use these keyboard shortcuts:
- `Ctrl+R` - Reload the current world (keeps mods enabled)
- `~` - Open console for debugging
- `F12` - Take a screenshot (saved to game directory)

## Debugging Tips

1. **Use print statements**:
   ```lua
   print("Variable value:", my_variable)
   ```

2. **Inspect tables**:
   ```lua
   print(dumptable(my_table, 1))  -- 1 is the depth level
   ```

3. **Check for errors in log**:
   - Look for error messages in the console
   - Check `[Game Documents]/DoNotStarveTogether/client_log.txt`

4. **Test incrementally**:
   - Make small changes and test frequently
   - Isolate features to debug them separately

## Setting Up a Local Dedicated Server (Advanced)

For testing multiplayer mods:

1. **Install the Dedicated Server**:
   - In Steam, go to Library → Tools
   - Install "Don't Starve Together Dedicated Server"

2. **Configure Server**:
   - Create a `cluster.ini` file in your cluster directory
   - Set up mod configuration in `modoverrides.lua`

3. **Launch Server**:
   - Use the provided launch scripts
   - Connect to "localhost" from the game client

## Next Steps

Now that your environment is set up, you're ready to create your first mod. Continue to the [First Mod](first-mod.md) guide to get started with actual mod development.

For more advanced setup options, including version control and automated testing, refer to the [Debugging and Testing](debugging-and-testing.md) guide.
