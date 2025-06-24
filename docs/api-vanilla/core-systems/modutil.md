---
id: modutil
title: Mod Utilities
description: Core utility functions and environment setup for mod development
sidebar_position: 106
slug: /core-systems/modutil
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Mod Utilities

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `modutil` module provides essential utility functions for mod development, including error handling, environment setup, configuration management, and integration with the game's various systems. It serves as the foundation for mod development in Don't Starve Together.

## Usage Example

```lua
-- Error handling in mods
modassert(condition, "This must be true")
moderror("Something went wrong")
modprint("Debug information")

-- Get mod configuration
local config_value = GetModConfigData("option_name")

-- Character management
AddModCharacter("mycharacter", "MALE", {"forest", "cave"})
RemoveDefaultCharacter("wilson")
```

## Error Handling Functions

### moderror(message, level) {#moderror}

**Status:** `stable`

**Description:**
Reports mod errors with proper context and mod identification. Behavior depends on whether mod debug printing is enabled - will assert if enabled, otherwise prints a warning.

**Parameters:**
- `message` (string): Error message to display
- `level` (number): Optional stack level for error reporting (default: 1)

**Example:**
```lua
moderror("Invalid configuration value")
moderror("Function called with wrong parameters", 2)
```

### modassert(test, message) {#modassert}

**Status:** `stable`

**Description:**
Assert function for mods that uses moderror for reporting. Only triggers if the test condition fails.

**Parameters:**
- `test` (any): Condition to test (truthy/falsy)
- `message` (string): Error message if assertion fails

**Returns:**
- (any): The test value if successful

**Example:**
```lua
local value = modassert(some_value, "Value cannot be nil")
modassert(#items > 0, "Items list must not be empty")
```

### modprint(...) {#modprint}

**Status:** `stable`

**Description:**
Debug print function for mods. Only outputs if mod debug printing is enabled in the mod index settings.

**Parameters:**
- `...` (any): Values to print

**Example:**
```lua
modprint("Debug info:", player_count, world_state)
modprint("Mod initialized successfully")
```

## Release ID System

### CurrentRelease.GreaterOrEqualTo(release_id) {#current-release-greater-or-equal-to}

**Status:** `stable`

**Description:**
Checks if the current game version supports a specific release ID, allowing mods to conditionally use features based on game version.

**Parameters:**
- `release_id` (string): Release ID to check

**Returns:**
- (boolean): True if current version supports the release

**Example:**
```lua
if CurrentRelease.GreaterOrEqualTo("R35_SANITYTROUBLES") then
    -- Use sanity trouble features
    inst.components.sanity:AddSanityPenalty("darkness", -5)
end
```

### CurrentRelease.PrintID() {#current-release-print-id}

**Status:** `stable`

**Description:**
Prints the current release ID to console for debugging purposes.

**Example:**
```lua
CurrentRelease.PrintID()
-- Output: "Current Release ID: ReleaseID.R37_LUNAR_CAGE"
```

## Configuration Management

### GetModConfigData(optionname, modname, get_local_config) {#get-mod-config-data}

**Status:** `stable`

**Description:**
Retrieves configuration values for mod settings. This is an internal function - mods should use the environment version provided during initialization.

**Parameters:**
- `optionname` (string): Name of the configuration option
- `modname` (string): Mod identifier (required when calling outside modmain)
- `get_local_config` (boolean): Whether to get client-local config (optional)

**Returns:**
- (any): Configuration value, or nil if not found

**Example:**
```lua
-- Within mod environment (modname automatically provided)
local difficulty = GetModConfigData("difficulty_level")
local show_debug = GetModConfigData("debug_mode")

-- Manual call with modname
local value = GetModConfigData("option", "workshop-12345", false)
```

## Character Management

### AddModCharacter(name, gender, modes) {#add-mod-character}

**Status:** `stable`

**Description:**
Registers a new mod character with the game, including gender assignment and custom skin modes for animation states.

**Parameters:**
- `name` (string): Character prefab name
- `gender` (string): Character gender ("MALE", "FEMALE", "ROBOT", "NEUTRAL", "PLURAL")
- `modes` (table): Optional skin mode definitions for character animation states

**Example:**
```lua
-- Basic character registration
AddModCharacter("mycharacter", "FEMALE")

-- Character with custom skin modes
AddModCharacter("mycharacter", "FEMALE", {
    { type = "normal_skin", play_emotes = true },
    { type = "ghost_skin", anim_bank = "ghost", idle_anim = "idle", scale = 0.75, offset = { 0, -25 } },
    { type = "powered_skin", anim_bank = "mycharacter_powered", scale = 1.1 }
})
```

### RemoveDefaultCharacter(name) {#remove-default-character}

**Status:** `stable`

**Description:**
Removes a default game character from the character selection list.

**Parameters:**
- `name` (string): Character name to remove

**Example:**
```lua
RemoveDefaultCharacter("wilson")
RemoveDefaultCharacter("willow")
```

## Environment Setup Functions

The modutil system provides numerous environment setup functions that are automatically added to mod environments. These functions enable mods to integrate with various game systems:

### World Generation

- `AddLevel(level)`: Add custom world level
- `AddTask(task)`: Add world generation task
- `AddTaskSet(taskset)`: Add task set for level generation
- `AddRoom(room)`: Add custom room type
- `AddStartLocation(location)`: Add spawn location option

### Customization and UI

- `AddRecipeFilter(filter)`: Add crafting recipe filter
- `AddIngredientValues(values)`: Add ingredient nutritional values
- `AddCharacterSelectPostInit(fn)`: Add character select screen modifications
- `AddMainPostInit(fn)`: Add main menu modifications
- `AddGamePostInit(fn)`: Add post-game initialization

### Tiles and Terrain

- `AddTile(tile)`: Register custom ground tile
- `AddTileData(data)`: Add tile behavior data
- `AddNoiseFunction(name, fn)`: Add terrain noise function

### Post-Initialization Systems

- `AddPlayerPostInit(fn)`: Add player initialization callback
- `AddPrefabPostInit(prefab, fn)`: Add prefab modification callback
- `AddComponentPostInit(component, fn)`: Add component modification callback
- `AddClassPostConstruct(class, fn)`: Add class constructor callback
- `AddStategraphPostInit(sg, fn)`: Add stategraph modification callback
- `AddBrainPostInit(brain, fn)`: Add brain modification callback

### Recipe and Crafting

- `AddRecipe2(name, ingredients, tech, config)`: Add crafting recipe (new system)
- `AddRecipe(name, ingredients, tech, config)`: Add crafting recipe (legacy)
- `AddDeconstructRecipe(prefab, ingredients)`: Add deconstruction recipe
- `AddCookerRecipe(cooker, recipe)`: Add cooking recipe

### Actions and Interactions

- `AddAction(action)`: Register custom action
- `AddComponentAction(type, component, fn)`: Add component action
- `AddStategraphAction(action)`: Add stategraph action
- `AddStategraphActionHandler(sg, action, handler)`: Add action handler

### Assets and Resources

- `RegisterInventoryItemAtlas(atlas, prefab)`: Register inventory atlas
- `RegisterSkinAtlas(atlas, build)`: Register skin atlas
- `LoadPOFile(path, lang)`: Load localization file
- `ModAssets`: Table for mod asset registration

### Networking

- `AddModRPCHandler(namespace, name, fn)`: Add RPC handler
- `AddShardModRPCHandler(namespace, name, fn)`: Add shard RPC handler
- `AddUserCommand(command)`: Add user console command
- `AddVoteCommand(command)`: Add voting command

### Cooking and Food

- `AddCookerRecipe(cooker, recipe)`: Add recipe to specific cooker
- `AddFoodData(name, food_data)`: Add food nutritional data
- `AddIngredientValues(values)`: Add ingredient cooking values

### Localization

- `STRINGS`: Global strings table for localization
- `LoadPOFile(path, lang)`: Load translation files
- `CreatePrefabSkinStrings(prefab)`: Create skin name strings

### UI and Interface

- `AddModScreenPostInit(screen, fn)`: Modify game screens
- `AddOptionScreenPostInit(fn)`: Modify options screen
- `AddFrontEndAssets(assets)`: Add frontend-specific assets

## Internal Environment Functions

### InsertPostInitFunctions(env, isworldgen, isfrontend)

**Status:** `stable`

**Description:**
Internal function that sets up the mod environment with all necessary post-initialization functions and utilities. This creates the sandboxed environment that mods execute within.

**Parameters:**
- `env` (table): Environment table to populate
- `isworldgen` (boolean): Whether this is world generation context
- `isfrontend` (boolean): Whether this is frontend context

## Utility Functions

### ModInfoname(name) {#mod-info-name}

**Status:** `stable`

**Description:**
Returns a formatted mod name string including both the mod ID and display name for better identification in logs and error messages.

**Parameters:**
- `name` (string): Mod identifier

**Returns:**
- (string): Formatted name string

**Example:**
```lua
local formatted = ModInfoname("workshop-12345")
-- Output: "workshop-12345 (Better Farming Mod)"
```

## Class Modification

### AddClassPostConstruct(package, postfn)

**Status:** `stable`

**Description:**
Adds a post-construction callback to a class loaded from a package, allowing mods to modify class instances after creation.

**Parameters:**
- `package` (string): Package path to the class
- `postfn` (function): Function to call after construction

### AddGlobalClassPostConstruct(package, classname, postfn)

**Status:** `stable`

**Description:**
Adds a post-construction callback to a global class, useful for modifying game classes.

**Parameters:**
- `package` (string): Package path where class is defined
- `classname` (string): Name of the global class
- `postfn` (function): Function to call after construction

## Environment Variables

Mods receive these environment variables automatically:

- `modname`: Current mod identifier
- `modassert`: Mod assertion function
- `moderror`: Mod error reporting function
- `postinitfns`: Table of post-initialization functions
- `postinitdata`: Table of post-initialization data

## Integration

The mod utilities integrate with:
- **Error System**: Standardized error reporting and debugging
- **Configuration**: Mod settings and options management
- **Character System**: Custom character registration
- **Asset Loading**: Mod-specific asset integration
- **Networking**: RPC and communication systems
- **UI System**: Interface modifications and additions

## Related Modules

- [Mods](./mods.md): Core mod loading and management system
- [Mod Index](./modindex.md): Mod registry and information management
- [Mod Compatibility](./modcompatability.md): Version upgrade and compatibility handling
