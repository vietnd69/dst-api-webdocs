---
title: Getting Started with DST Lua API
description: Introduction to Don't Starve Together modding and API usage
sidebar_position: 1
slug: /getting-started
last_updated: 2023-06-15
build_version: 676042
change_status: stable
---

# Getting Started with DST Lua API

Welcome to the Don't Starve Together (DST) Lua API documentation! This guide will help you understand the fundamental concepts and structure of the DST Lua API, which is used to create mods for the game.

## Version History

| Date | Build | Changes |
|------|-------|---------|
| 2023-06-15 | 675312 | Initial documentation |

## Introduction to DST Modding

Don't Starve Together is a multiplayer survival game developed by Klei Entertainment. The game is highly moddable, allowing players and developers to create custom content and modify gameplay through Lua scripting.

### What is the DST Lua API?

The DST Lua API is a comprehensive set of functions, components, and systems that allow modders to interact with the game's core functionality. Through this API, you can:

- Create new items, characters, creatures, and structures
- Modify existing game mechanics and behaviors
- Add new gameplay features and systems
- Create custom UI elements and screens
- Change world generation and environmental features

## Prerequisites

Before diving into DST modding, you should have:

- Basic programming knowledge
- Familiarity with Lua programming language
- Understanding of Don't Starve Together gameplay mechanics
- A copy of Don't Starve Together on Steam

## Setting Up Your Modding Environment

1. **Install Don't Starve Together**: Ensure you have the game installed through Steam.

2. **Find Your Mods Directory**:
   - Windows: `C:\Users\[YourUsername]\Documents\Klei\DoNotStarveTogether\mods\`
   - Mac: `~/Documents/Klei/DoNotStarveTogether/mods/`
   - Linux: `~/.klei/DoNotStarveTogether/mods/`

3. **Create a New Mod**:
   - Create a new folder in your mods directory
   - Name it according to your mod (e.g., `my_first_mod`)

4. **Basic Mod Structure**:
   ```
   my_first_mod/
   ├── modinfo.lua       # Mod metadata and configuration
   ├── modmain.lua       # Main entry point for your mod
   ├── scripts/          # Custom scripts folder
   ├── anim/             # Custom animations
   └── images/           # Images and icons
   ```

## Understanding the Core Systems

DST's codebase is organized around several core systems:

### Entity-Component System

The game uses an entity-component architecture:

- **Entities**: Base objects in the world (players, creatures, items)
- **Components**: Modular pieces of functionality attached to entities
- **Prefabs**: Templates for creating entities with predefined components

### Script Organization

The API scripts are organized in several key directories:

- **actions.lua**: Defines player actions like chopping, mining, etc.
- **behaviours/**: AI behavior scripts
- **brains/**: AI decision-making scripts
- **components/**: Entity component definitions
- **prefabs/**: Entity template definitions
- **stategraphs/**: State machine definitions for entities

## Creating Your First Mod

Here's a simple example of a "Hello World" mod:

1. Create `modinfo.lua`:

```lua
name = "My First Mod"
description = "A simple hello world mod"
author = "Your Name"
version = "1.0.0"

-- Compatibility
dst_compatible = true
dont_starve_compatible = false
reign_of_giants_compatible = false
all_clients_require_mod = true
```

2. Create `modmain.lua`:

```lua
-- Print a message when the mod loads
print("Hello DST World!")

-- Add a global function that can be called from the console
GLOBAL.HelloDST = function()
    print("Hello from my first DST mod!")
    -- You can test this by typing HelloDST() in the console
end
```

## Next Steps

Now that you understand the basics, you can explore:

- [Core Systems](../core-systems/index.md): Learn about the fundamental systems that power DST
- [Components](../components/index.md): Study the component system for adding behaviors to entities
- [Game Mechanics](../game-mechanics/index.md): Understand how key game systems function

## Resources and Community

- [Klei Forums](https://forums.kleientertainment.com/forums/forum/26-dont-starve-together-mods-and-tools/): Official forums for DST modding
- [DST Modding Wiki](https://dontstarvemodding.fandom.com/wiki/Don%27t_Starve_Modding_Wiki): Community-maintained wiki with modding resources
- [Steam Workshop](https://steamcommunity.com/app/322330/workshop/): Browse existing mods for inspiration

## API Documentation Structure

This documentation is organized by system and functionality:

- **Getting Started**: Introduction and setup guides
- **Core Systems**: Fundamental game systems like actions, recipes, and tuning
- **Components**: Entity components and their functionality
- **Game Mechanics**: Key gameplay systems like health, hunger, and sanity
- **World Management**: World generation, seasons, and environment

Use the sidebar navigation to explore the different sections of the API documentation.
