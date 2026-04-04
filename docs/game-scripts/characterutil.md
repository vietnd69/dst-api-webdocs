---
id: characterutil
title: Characterutil
description: Provides utility functions for loading character portraits, avatars, titles, and starting inventory data.
tags: [character, ui, portrait, inventory]
sidebar_position: 10

last_updated: 2026-03-21
build_version: 714014
change_status: stable
category_type: root
source_hash: ae2b38b5
system_scope: player
---

# Characterutil

> Based on game build **714014** | Last updated: 2026-03-21

## Overview
`characterutil` is a utility module providing helper functions for loading and managing character-related visual assets and data. It handles portrait textures (oval and hero name), avatar locations, character titles, morgue death data formatting, and starting inventory item resolution. This module is used primarily by UI screens and character selection systems to display character information correctly.

## Usage example
```lua
local characterutil = require("characterutil")

-- Load a skinned oval portrait into a widget
local widget = ImageWidget()
characterutil.SetSkinnedOvalPortraitTexture(widget, "wilson", "wilson_formal")

-- Get character starting inventory items
local starting_items = characterutil.GetUniquePotentialCharacterStartingInventoryItems("wilson", true)

-- Get character title for display
local title = characterutil.GetCharacterTitle("wilson", "wilson_formal")
```

## Dependencies & tags
**Components used:** None (utility module, not an ECS component)
**Tags:** None identified (does not add/remove entity tags)

## Properties
No public properties (this is a utility module with standalone functions, not a class with state)

## Main functions
### `SetSkinnedOvalPortraitTexture(image_widget, character, skin)`
*   **Description:** Loads the oval portrait texture for a skinned character into the specified image widget. Checks if the character supports skins and attempts to load the appropriate portrait atlas.
*   **Parameters:** 
    *   `image_widget` (ImageWidget) - The widget to set the texture on.
    *   `character` (string) - Character identifier (e.g., `"wilson"`).
    *   `skin` (string) - Skin identifier (e.g., `"wilson_formal"`).
*   **Returns:** `boolean` - `true` if the oval portrait atlas was found and loaded, `false` otherwise.
*   **Error states:** Prints an error message to console if the portrait file is not valid. Falls back to unskinned shield portrait if skinned version is unavailable.

### `SetOvalPortraitTexture(image_widget, character)`
*   **Description:** Loads the oval portrait texture for a character using the default skin. Wrapper around `SetSkinnedOvalPortraitTexture` with default skin parameter.
*   **Parameters:** 
    *   `image_widget` (ImageWidget) - The widget to set the texture on.
    *   `character` (string) - Character identifier (e.g., `"wilson"`).
*   **Returns:** `boolean` - `true` if the oval portrait atlas was found, `false` otherwise.

### `SetHeroNameTexture_Grey(image_widget, character)`
*   **Description:** Loads the grey hero name texture for the specified character into the image widget.
*   **Parameters:** 
    *   `image_widget` (ImageWidget) - The widget to set the texture on.
    *   `character` (string) - Character identifier (e.g., `"wilson"`).
*   **Returns:** `boolean` - `true` if the hero name atlas was found, `nil` otherwise.

### `SetHeroNameTexture_Gold(image_widget, character)`
*   **Description:** Loads the gold hero name texture for the specified character. Falls back to grey version if gold texture is unavailable (common for mod characters).
*   **Parameters:** 
    *   `image_widget` (ImageWidget) - The widget to set the texture on.
    *   `character` (string) - Character identifier (e.g., `"wilson"`).
*   **Returns:** `boolean` - `true` if the gold hero name atlas was found, result of grey fallback otherwise.

### `GetCharacterAvatarTextureLocation(character)`
*   **Description:** Returns the atlas and texture path for a character's avatar image. Handles normal characters, mod characters, and edge cases like `"random"` or unknown names.
*   **Parameters:** 
    *   `character` (string) - Character identifier.
*   **Returns:** `string, string` - Atlas path and texture filename.
*   **Error states:** Returns `"mod"` or `"unknown"` avatar paths for invalid character names.

### `GetCharacterTitle(character, skin)`
*   **Description:** Retrieves the display title for a character. Uses skin name if provided, otherwise falls back to character title from `STRINGS`.
*   **Parameters:** 
    *   `character` (string) - Character identifier.
    *   `skin` (string, optional) - Skin identifier.
*   **Returns:** `string` - The character title for display.

### `GetKilledByFromMorgueRow(data)`
*   **Description:** Processes morgue death data to format the killer name for display. Handles special cases like PK names, nil values, and remaps certain death causes.
*   **Parameters:** 
    *   `data` (table) - Morgue row data containing `killed_by`, `character`, `pk`, and `morgue_random` fields.
*   **Returns:** `string` - Formatted killer name with proper capitalization.
*   **Error states:** Returns empty string if `killed_by` is `nil`.

### `GetUniquePotentialCharacterStartingInventoryItems(character, with_bonus_items)`
*   **Description:** Retrieves the list of starting inventory items for a character based on game mode and season settings. Removes duplicates to ensure unique items only.
*   **Parameters:** 
    *   `character` (string) - Character identifier.
    *   `with_bonus_items` (boolean) - Whether to include seasonal and extra starting items.
*   **Returns:** `table` - Array of item prefab names for starting inventory.
*   **Error states:** Returns empty table if no starting items are defined for the character.

## Events & listeners
Not applicable (this is a utility module with standalone functions, not an ECS component that listens to or pushes events)