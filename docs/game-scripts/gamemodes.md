---
id: gamemodes
title: Gamemodes
description: Central configuration and utility system for managing game modes, including built-in and mod-defined modes, their properties, and runtime queries.
tags: [world, game_mode, configuration]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 77dac360
system_scope: world
---

# Gamemodes

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `gamemodes` module serves as the authoritative registry and accessor for game modes in DST. It defines the `GAME_MODES` table containing configuration for built-in modes (e.g., `survival`, `lavaarena`, `quagmire`), supports mod-registered game modes via `AddGameMode`, and provides utility functions to query game mode properties at runtime—either from the world settings or the active server game mode. It does not implement an ECS component but is a top-level script providing global APIs.

## Usage example
```lua
-- Query current game mode configuration
local current_mode = TheNet:GetServerGameMode()
local mode_data = GetGameMode(current_mode)

-- Check if a recipe is valid in the current mode
if IsRecipeValidInGameMode(current_mode, "resurrectionstatue") then
    -- enable recipe UI
end

-- Register a custom modded game mode (called during mod's main.lua)
AddGameMode("my_custom_mode", "My Custom Mode")
```

## Dependencies & tags
**Components used:** `worldsettings` (accessed via `TheWorld.components.worldsettings`)
**Tags:** None identified.

## Properties
No public properties. This module exposes only functions and a global `GAME_MODES` table.

## Main functions
### `AddGameMode(game_mode, game_mode_text)`
*   **Description:** Registers a new mod-defined game mode in `GAME_MODES`. Must be called during mod initialization. The entry is marked as `modded_mode = true`.
*   **Parameters:**  
  `game_mode` (string) - Unique identifier for the mode (e.g., `"my_custom_mode"`).  
  `game_mode_text` (string) - Human-readable label displayed in UI.
*   **Returns:** The newly created mode table (also stored in `GAME_MODES[game_mode]`).

### `GetGameMode(game_mode)`
*   **Description:** Retrieves the configuration table for the specified game mode. Falls back to `GAME_MODE_ERROR` on unknown or deprecated modes.
*   **Parameters:**  
  `game_mode` (string) - The mode identifier (e.g., `"survival"`, `"lavaarena"`).
*   **Returns:** (table) Mode configuration; never `nil`. Returns `GAME_MODES.survival` for deprecated `"wilderness"`/`"endless"` outside frontend; otherwise `GAME_MODE_ERROR`.

### `GetGameModeProperty(property)`
*   **Description:** Gets a specific game mode property. Prioritizes value from `worldsettings` if available, otherwise falls back to the active server game mode's value.
*   **Parameters:**  
  `property` (string) - Key of the property to retrieve (e.g., `"ghost_enabled"`, `"no_hunger"`).
*   **Returns:** (any) Property value, or `nil` if neither source provides it.

### `GetGameModesSpinnerData(enabled_mods)`
*   **Description:** Builds and returns sorted UI spinner data for game mode selection menus. Includes built-in and mod-registered modes (filtered by `modinfo.game_modes`).
*   **Parameters:**  
  `enabled_mods` (table or `nil`) - List of enabled mod IDs. If `nil`, only built-in modes are included.
*   **Returns:** (table) Array of `{ text = string, data = string }`, sorted by `GAME_MODES_ORDER` priority.

### `GetGameModeString(game_mode)`
*   **Description:** Returns the localized or stored text label for a game mode (used by UI). For compatibility with C code.
*   **Parameters:**  
  `game_mode` (string) - Mode identifier.
*   **Returns:** (string) Display name (e.g., `STRINGS.UI.GAMEMODES.SURVIVAL`). Falls back to `"custom"` or `"unknown"` for invalid modes.

### `GetGameModeDescriptionString(game_mode)`
*   **Description:** Returns the hover text/description for a game mode. Supports legacy `hover_text` and falls back to localization keys.
*   **Parameters:**  
  `game_mode` (string) - Mode identifier.
*   **Returns:** (string) Description text.

### `GetIsModGameMode(game_mode)`
*   **Description:** Checks if a game mode is mod-defined (not built-in). Used by server listing to identify modded servers.
*   **Parameters:**  
  `game_mode` (string) - Mode identifier.
*   **Returns:** (boolean) `true` if `mod_game_mode = true`, otherwise `false`.

### `GetGhostSanityDrain()`, `GetIsSpawnModeFixed()`, `GetSpawnMode()`, `GetHasResourceRenewal()`, `GetGhostEnabled()`, `GetPortalRez()`, `GetResetTime()`
*   **Description:** Convenience getters that wrap `GetWorldSetting` and fall back to `GetGameModeProperty`. Reflect core gameplay rules derived from world or game mode settings.
*   **Parameters:** None (all take no arguments).
*   **Returns:** Types vary per function:  
  `GetGhostSanityDrain()` → boolean  
  `GetSpawnMode()` → string  
  `GetResetTime()` → `{ time = number, loadingtime = number }`  
  Others → boolean.

### `IsRecipeValidInGameMode(game_mode, recipe_name)`
*   **Description:** Determines if a recipe is allowed in the specified game mode by checking against `invalid_recipes`.
*   **Parameters:**  
  `game_mode` (string) - Mode identifier.  
  `recipe_name` (string) - Recipe identifier (e.g., `"resurrectionstatue"`).
*   **Returns:** (boolean) `true` if the recipe is not in the mode's `invalid_recipes` list.

### `GetLevelType(game_mode)`
*   **Description:** Retrieves the level type enum (`LEVELTYPE.*`) for a game mode.
*   **Parameters:**  
  `game_mode` (string) - Mode identifier.
*   **Returns:** (enum) `LEVELTYPE.*`.

### `GetMaxItemSlots(game_mode)`
*   **Description:** Gets the item slot limit, either `override_item_slots` from game mode or the default `MAXITEMSLOTS`.
*   **Parameters:**  
  `game_mode` (string) - Mode identifier.
*   **Returns:** (number) Slot count.

### `GetFarmTillSpacing(game_mode)`
*   **Description:** Gets the custom spacing used for farm tilling in this game mode, falling back to `TUNING.FARM_TILL_SPACING`.
*   **Parameters:**  
  `game_mode` (string or `nil`) - Mode identifier (defaults to current server mode if `nil`).
*   **Returns:** (number) Tilling spacing value.

### `GetGameModeMaxPlayers(game_mode)`
*   **Description:** Gets the per-mode maximum player count. Only non-`nil` for `quagmire`.
*   **Parameters:**  
  `game_mode` (string) - Mode identifier.
*   **Returns:** (number or `nil`) Max player count, or `nil` if unset.

## Events & listeners
None identified.
