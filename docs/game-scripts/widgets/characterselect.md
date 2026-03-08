---
id: characterselect
title: Characterselect
description: Manages the character selection UI widget, displaying a central portrait with navigation controls and optional additional characters.
tags: [ui, navigation, character]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: a57fc12c
system_scope: ui
---

# Characterselect

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Characterselect` is a UI widget that presents a horizontally-scrolling carousel of selectable characters for lobby or character setup screens. It constructs an interactive portrait layout with left/right navigation buttons and supports keyboard/controller input via scroll events. It relies on external systems to provide the list of available characters and skin data but is otherwise self-contained.

## Usage example
```lua
local CharacterSelect = require "widgets/characterselect"

local selectWidget = CharacterSelect(
    owner, -- Entity or context object
    nil,   -- unused parameter (retained for legacy reasons)
    function() print("Portrait changed") end,
    {"wolfgang", "woodie"} -- additional characters beyond default
)

-- Later, retrieve the selected character:
local selected = selectWidget:GetCharacter()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `widget` (inherited from `Widget` base class).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `Entity?` | `nil` | Context owner passed to the constructor; currently unused. |
| `OnPortraitSelected` | function? | `nil` | Callback invoked when the selected character portrait changes. |
| `proot` | `Widget` | — | Root UI widget child container. |
| `heroportrait` | `Image` | — | Large central character portrait. |
| `leftsmallportrait`, `leftportrait`, `rightportrait`, `rightsmallportrait` | `ImageButton` | — | Smaller side portraits for navigation hints. |
| `left_arrow`, `right_arrow` | `ImageButton` | — | Interactive arrow buttons for portrait cycling. |
| `characters` | table | `{}` | List of selectable character prefabs. |
| `characterIdx` | number | `1` | 1-based index into `characters` of the currently selected character. |
| `repeat_time` | number | `0` | Timer for repeated scroll input when using controller. |

## Main functions
### `WrapIndex(index)`
* **Description:** Wraps a given index into valid range for the `characters` table, supporting circular indexing (e.g., wrapping `0` to `#characters`, or `#characters+1` to `1`).
* **Parameters:** `index` (number) — the index to wrap.
* **Returns:** number — the wrapped index (always `>= 1` and `<= #characters`).
* **Error states:** Returns `1` if `characters` is empty (though this is an invalid state).

### `BuildCharactersList(additionalCharacters)`
* **Description:** Initializes all portrait UI elements and populates the internal `characters` list. Adds left/right navigation buttons and side portrait placeholders.
* **Parameters:** `additionalCharacters` (table) — list of extra character prefabs to append to the default list.
* **Returns:** Nothing.
* **Error states:** Does not validate presence of character prefabs; relies on upstream data (`GetSelectableCharacterList()` and `MODCHARACTEREXCEPTIONS_DST`).

### `SetPortrait()`
* **Description:** Updates the texture and tint of all portrait UI elements based on the current `characterIdx`. Chooses skins using `PREFAB_SKINS` and appends `"_none"` for base-game characters.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Does nothing if `self.characters[self.characterIdx]` is `nil`. Tinting of side portraits uses hardcoded alpha values.

### `Scroll(dir)`
* **Description:** Adjusts `characterIdx` by `±1` based on `dir`, wrapping as needed, and refreshes the portrait display.
* **Parameters:** `dir` (number) — negative for left, positive for right, zero has no effect.
* **Returns:** Nothing.

### `SelectRandomCharacter()`
* **Description:** Finds `"random"` in the `characters` list and selects it if present.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No-op if `"random"` is not in `characters`.

### `GetCharacter()`
* **Description:** Returns the currently selected character prefab name.
* **Parameters:** None.
* **Returns:** string? — the character prefab name, or `nil` if `characterIdx` is out of range.

## Events & listeners
- **Listens to:** None identified.  
- **Pushes:** None identified.  
