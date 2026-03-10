---
id: characterutil
title: Characterutil
description: Utility functions for loading character assets such as portraits, names, avatars, and titles, and for computing character-specific starting inventory.
tags: [assets, ui, character]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: ae2b38b5
system_scope: ui
---

# Characterutil

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`characterutil` provides helper functions for loading and managing character-related UI assets, including oval portraits, hero names (grey/gold), avatars, and titles. It also supports querying starting inventory per character and formatting in-game death messages. This is a standalone utility module — not an Entity Component System component — and is used primarily by UI screens (e.g., character selection, morgue, loadouts).

## Usage example
```lua
local image_widget = makewidget("image")
-- Load an oval portrait for Wilson with his formal skin
SetSkinnedOvalPortraitTexture(image_widget, "wilson", "wilson_formal")

-- Load a grey hero name for Winona
SetHeroNameTexture_Grey(image_widget, "winona")

-- Get Wilson's starting inventory (excluding bonus items)
local items = GetUniquePotentialCharacterStartingInventoryItems("wilson", false)

-- Get a formatted title string
local title = GetCharacterTitle("wilson", "wilson_formal")
```

## Dependencies & tags
**Components used:** None (module-level utility).
**Tags:** None — this file does not modify entity tags or interact with components.

## Properties
No public properties.

## Main functions
### `SetSkinnedOvalPortraitTexture(image_widget, character, skin)`
* **Description:** Loads the skinned oval portrait (e.g., `wilson_none_oval.tex`) into the given `image_widget`. Falls back to the unskinned portrait if the skinned oval is missing.
* **Parameters:**  
  `image_widget` (widget) — The UI widget to apply the texture to.  
  `character` (string) — Character name (e.g., `"wilson"`).  
  `skin` (string) — Full skin name (e.g., `"wilson_formal"`).  
* **Returns:** `true` if the oval portrait atlas was found and loaded successfully; `false` otherwise (e.g., for non-skinnable characters or missing files).  
* **Error states:** Prints an error message to console if the resolved portrait name is invalid.

### `SetOvalPortraitTexture(image_widget, character)`
* **Description:** Loads the default (none-skin) oval portrait for a skinnable character, or the unskinned shield portrait otherwise.
* **Parameters:**  
  `image_widget` (widget) — The UI widget to apply the texture to.  
  `character` (string) — Character name (e.g., `"wilson"`).  
* **Returns:** `true` if the oval was loaded; `false` otherwise.

### `SetHeroNameTexture_Grey(image_widget, character)`
* **Description:** Loads the grey variant of the character’s name image (e.g., `images/names_wilson.xml`).
* **Parameters:**  
  `image_widget` (widget) — The UI widget to apply the texture to.  
  `character` (string) — Character name (e.g., `"wilson"`).  
* **Returns:** `true` if the atlas was found; `false` if not. Note: `SetTexture` may still fail silently if the specific texture file is missing.

### `SetHeroNameTexture_Gold(image_widget, character)`
* **Description:** Loads the gold variant of the name image (localized). Falls back to grey if gold is missing (e.g., for modded characters).
* **Parameters:**  
  `image_widget` (widget) — The UI widget to apply the texture to.  
  `character` (string) — Character name (e.g., `"wilson"`).  
* **Returns:** `true` if either gold or the fallback grey texture was loaded; `false` only if both fail.

### `GetCharacterAvatarTextureLocation(character)`
* **Description:** Returns the atlas and texture paths for the character’s avatar (head image). Used for mod support, though currently unused in core.
* **Parameters:**  
  `character` (string) — Character name (e.g., `"wilson"`, `"random"`, or a mod character name).  
* **Returns:** Two strings: `avatar_location` (atlas path) and `avatar_name.tex` (texture name).  
* **Notes:** `"random"` is handled like a real character. Modded characters use `MOD_AVATAR_LOCATIONS`. Unknown or unregistered mod characters default to `"mod"` or `"unknown"`.

### `GetCharacterTitle(character, skin)`
* **Description:** Returns the display title for the character (e.g., “The Engineer” for Winona), using skin-specific name if available.
* **Parameters:**  
  `character` (string) — Character name.  
  `skin` (string or nil) — Skin name (e.g., `"wilson_formal"`). If empty or `nil`, returns the default title.  
* **Returns:** A localized string (e.g., `STRINGS.NAMES[...]` or `STRINGS.CHARACTER_TITLES[character]`).

### `GetKilledByFromMorgueRow(data)`
* **Description:** Formats and standardizes the "killed by" string for morgue (death log) entries, applying special handling for special cases (e.g., Charlie, darkness, moose).
* **Parameters:**  
  `data` (table) — A morgue row table containing fields like `killed_by`, `character`, and `pk`.  
* **Returns:** A properly capitalized, localized string (e.g., `"Charlie"`, `"Darkness"`, or `"Moose"`), or the raw `killed_by` value if it’s a player kill (`pk = true`).  
* **Notes:** Uses `STRINGS.NAMES` for localization and `tchelper` to capitalize names (e.g., `"moose1"` → `"Moose1"`). `"nil"` and `"unknown"` are remapped.

### `GetUniquePotentialCharacterStartingInventoryItems(character, with_bonus_items)`
* **Description:** Computes the list of items a character starts with in the current game mode, optionally including seasonal/bonus items. Duplicates are removed.
* **Parameters:**  
  `character` (string) — Character name (e.g., `"wilson"`). Must be uppercase when looked up in `TUNING`.  
  `with_bonus_items` (boolean) — Whether to include seasonal and extra starting items (e.g., holiday-themed).  
* **Returns:** A deduplicated list (array) of item prefabs (strings) suitable for spawning at game start.  
* **Notes:** Performs a shallow copy of the base `TUNING.GAMEMODE_STARTING_ITEMS[...]` table to avoid mutation. Seasonal items are added in alphabetical order via `orderedPairs(SEASONS)`.

## Events & listeners
None — this module contains no event listeners or event pushes.