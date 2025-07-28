---
id: gamemodes
title: Game Modes
description: System for managing different game modes and their configurations in Don't Starve Together
sidebar_position: 2
slug: game-scripts/core-systems/gamemodes
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Game Modes

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `gamemodes.lua` module defines and manages different game modes in Don't Starve Together. It provides configuration settings for survival mechanics, spawning behavior, resource management, and specialized event modes like Lava Arena and Quagmire.

## Usage Example

```lua
-- Get current game mode properties
local ghost_enabled = GetGhostEnabled()
local spawn_mode = GetSpawnMode()
local has_renewal = GetHasResourceRenewal()

-- Check if a recipe is valid in current game mode
local is_valid = IsRecipeValidInGameMode("survival", "resurrectionstatue")
```

## Constants

### DEFAULT_GAME_MODE

**Value:** `"survival"`

**Status:** `stable`

**Description:** Default game mode used when the actual game mode cannot be determined from saved server slot.

### GAME_MODES

**Status:** `stable`

**Description:** Table containing all available game mode configurations.

**Available Game Modes:**
- `survival`: Standard Don't Starve Together gameplay
- `lavaarena`: Lava Arena event mode (internal)
- `quagmire`: Quagmire event mode (internal)

### GAME_MODES_ORDER

**Status:** `stable`

**Description:** Table defining the display order of game modes in UI spinners.

## Game Mode Properties

Each game mode in `GAME_MODES` contains the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `text` | string | Display text for the game mode |
| `description` | string | Detailed description of the game mode |
| `level_type` | LEVELTYPE | Type of level (SURVIVAL, LAVAARENA, QUAGMIRE) |
| `mod_game_mode` | boolean | Whether this is a modded game mode |
| `spawn_mode` | string | Spawning behavior ("fixed" or "scatter") |
| `resource_renewal` | boolean | Whether resources regenerate over time |
| `ghost_sanity_drain` | boolean | Whether ghosts drain sanity from living players |
| `ghost_enabled` | boolean | Whether ghost mode is available |
| `portal_rez` | boolean | Whether portal resurrection is enabled |
| `reset_time` | table/nil | Reset timing configuration |
| `invalid_recipes` | table/nil | List of recipes disabled in this mode |

### Specialized Properties

Some game modes have additional properties:

| Property | Type | Description |
|----------|------|-------------|
| `internal` | boolean | Internal game mode not shown in normal UI |
| `max_players` | number | Maximum number of players allowed |
| `override_item_slots` | number | Override default inventory slots |
| `drop_everything_on_despawn` | boolean | Drop all items when player despawns |
| `no_crafting` | boolean | Disable crafting system |
| `no_minimap` | boolean | Disable minimap display |
| `no_hunger` | boolean | Disable hunger mechanics |
| `no_sanity` | boolean | Disable sanity mechanics |
| `skin_tag` | string | Skin tag for cosmetic items ("LAVA", "VICTORIAN") |

## Functions

### AddGameMode(game_mode, game_mode_text) {#add-game-mode}

**Status:** `stable`

**Description:**
Adds a new modded game mode to the available game modes list.

**Parameters:**
- `game_mode` (string): Unique identifier for the new game mode
- `game_mode_text` (string): Display text for the game mode

**Returns:**
- (table): The created game mode configuration table

**Example:**
```lua
local custom_mode = AddGameMode("hardcore", "Hardcore Mode")
-- Creates a new game mode with default survival settings
```

### GetGameModeProperty(property) {#get-game-mode-property}

**Status:** `stable`

**Description:**
Gets a specific property from the current game mode, with world settings override support.

**Parameters:**
- `property` (string): Name of the property to retrieve

**Returns:**
- (any): The property value from world settings or game mode configuration

**Example:**
```lua
local ghost_drain = GetGameModeProperty("ghost_sanity_drain")
local spawn_mode = GetGameModeProperty("spawn_mode")
```

### GetGameModesSpinnerData(enabled_mods) {#get-game-modes-spinner-data}

**Status:** `stable`

**Description:**
Returns formatted data for UI spinners showing available game modes, including modded ones.

**Parameters:**
- `enabled_mods` (table): List of enabled mod names to include their game modes

**Returns:**
- (table): Array of spinner data with `text` and `data` fields

**Example:**
```lua
local mods = {"mod1", "mod2"}
local spinner_data = GetGameModesSpinnerData(mods)
-- Returns: {{text="Survival", data="survival"}, ...}
```

### GetGameModeTag(game_mode) {#get-game-mode-tag}

**Status:** `stable`

**Description:**
Gets the localized tag string for a game mode.

**Parameters:**
- `game_mode` (string): Game mode identifier

**Returns:**
- (string/nil): Localized tag string or nil if invalid

**Example:**
```lua
local tag = GetGameModeTag("survival")
-- Returns localized tag from STRINGS.TAGS.GAMEMODE
```

### GetGameModeString(game_mode) {#get-game-mode-string}

**Status:** `stable`

**Description:**
Gets the display string for a game mode. Used by C side code.

**Parameters:**
- `game_mode` (string): Game mode identifier

**Returns:**
- (string): Localized display string

**Example:**
```lua
local display_name = GetGameModeString("survival")
-- Returns "Survival" or localized equivalent
```

### GetGameModeDescriptionString(game_mode) {#get-game-mode-description-string}

**Status:** `stable`

**Description:**
Gets the description string for a game mode.

**Parameters:**
- `game_mode` (string): Game mode identifier

**Returns:**
- (string): Localized description string

**Example:**
```lua
local description = GetGameModeDescriptionString("survival")
```

### GetIsModGameMode(game_mode) {#get-is-mod-game-mode}

**Status:** `stable`

**Description:**
Checks if a game mode is from a mod.

**Parameters:**
- `game_mode` (string): Game mode identifier

**Returns:**
- (boolean): True if the game mode is modded

**Example:**
```lua
local is_modded = GetIsModGameMode("survival") -- false
local is_modded = GetIsModGameMode("custom_mode") -- true
```

## Game Mode Query Functions

### GetGhostSanityDrain() {#get-ghost-sanity-drain}

**Status:** `stable`

**Description:**
Checks if ghosts drain sanity from living players in the current game mode.

**Returns:**
- (boolean): True if ghost sanity drain is enabled

### GetIsSpawnModeFixed() {#get-is-spawn-mode-fixed}

**Status:** `stable`

**Description:**
Checks if the current game mode uses fixed spawn points.

**Returns:**
- (boolean): True if spawn mode is "fixed"

### GetSpawnMode() {#get-spawn-mode}

**Status:** `stable`

**Description:**
Gets the current spawn mode setting.

**Returns:**
- (string): Spawn mode ("fixed" or "scatter")

### GetHasResourceRenewal() {#get-has-resource-renewal}

**Status:** `stable`

**Description:**
Checks if resource renewal is enabled in the current game mode.

**Returns:**
- (boolean): True if resources regenerate over time

### GetGhostEnabled() {#get-ghost-enabled}

**Status:** `stable`

**Description:**
Checks if ghost mode is enabled, considering both world settings and revivable corpse mode.

**Returns:**
- (boolean): True if ghost mode is available

### GetPortalRez() {#get-portal-rez}

**Status:** `stable`

**Description:**
Checks if portal resurrection is enabled.

**Returns:**
- (boolean): True if portal resurrection is available

### GetResetTime() {#get-reset-time}

**Status:** `stable`

**Description:**
Gets the reset time configuration for the current game mode.

**Returns:**
- (table): Reset time configuration with `time` and `loadingtime` fields

**Example:**
```lua
local reset_config = GetResetTime()
-- Returns: {time = 120, loadingtime = 180}
```

## Utility Functions

### IsRecipeValidInGameMode(game_mode, recipe_name) {#is-recipe-valid-in-game-mode}

**Status:** `stable`

**Description:**
Checks if a recipe is valid/allowed in a specific game mode.

**Parameters:**
- `game_mode` (string): Game mode to check
- `recipe_name` (string): Name of the recipe to validate

**Returns:**
- (boolean): True if the recipe is allowed in the game mode

**Example:**
```lua
local valid = IsRecipeValidInGameMode("survival", "resurrectionstatue") -- true
```

### GetLevelType(game_mode) {#get-level-type}

**Status:** `stable`

**Description:**
Gets the level type for a specific game mode.

**Parameters:**
- `game_mode` (string): Game mode identifier

**Returns:**
- (LEVELTYPE): Level type constant

### GetMaxItemSlots(game_mode) {#get-max-item-slots}

**Status:** `stable`

**Description:**
Gets the maximum inventory slots for a game mode.

**Parameters:**
- `game_mode` (string): Game mode identifier

**Returns:**
- (number): Maximum item slots (uses MAXITEMSLOTS if not overridden)

### GetFarmTillSpacing(game_mode) {#get-farm-till-spacing}

**Status:** `stable`

**Description:**
Gets the farm till spacing for a game mode.

**Parameters:**
- `game_mode` (string): Game mode identifier (optional, uses current if not provided)

**Returns:**
- (number): Farm till spacing value

### GetGameModeMaxPlayers(game_mode) {#get-game-mode-max-players}

**Status:** `stable`

**Description:**
Gets the maximum player limit for a specific game mode.

**Parameters:**
- `game_mode` (string): Game mode identifier

**Returns:**
- (number/nil): Maximum players or nil if no limit specified

## Internal Functions

### GetWorldSetting(setting, default)

**Status:** `stable`

**Description:**
Internal function to get world settings with fallback to default values.

### GameModeError(game_mode)

**Status:** `stable`

**Description:**
Internal error handling for invalid game modes, with special handling for deprecated modes.

### GetGameMode(game_mode)

**Status:** `stable`

**Description:**
Internal function to safely get game mode configuration with error handling.

## Common Usage Patterns

### Checking Game Mode Features

```lua
-- Check if current game mode supports ghosts
if GetGhostEnabled() then
    -- Enable ghost-related functionality
end

-- Check resource renewal
if GetHasResourceRenewal() then
    -- Enable resource regeneration systems
end
```

### Validating Recipes

```lua
-- Check if a recipe is valid before allowing crafting
local current_mode = TheNet:GetServerGameMode()
if IsRecipeValidInGameMode(current_mode, recipe_name) then
    -- Allow crafting
else
    -- Show disabled message
end
```

### Adding Custom Game Modes

```lua
-- In mod code
local custom_mode = AddGameMode("mymod_hardcore", "Hardcore Mode")
custom_mode.ghost_enabled = false
custom_mode.resource_renewal = false
custom_mode.invalid_recipes = {"resurrectionstatue", "lifeamulet"}
```

## Related Modules

- [Constants](./constants.md): Game mode related constants and tuning values
- [World Settings](./worldsettings.md): World-specific setting overrides
- [Recipes](./recipes.md): Recipe validation and game mode restrictions
