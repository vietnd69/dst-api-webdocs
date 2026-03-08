---
id: skinsandequipmentpuppet
title: Skinsandequipmentpuppet
description: A UI widget that renders a character skin and equipment preview puppet, handling character selection fallback, skin overrides, and animation updates.
tags: [ui, character, skin, puppet, equipment]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: d891e74e
system_scope: ui
---

# Skinsandequipmentpuppet

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SkinsAndEquipmentPuppet` is a UI widget that displays a stylized character preview with dynamic skin and equipment overlays. It inherits from `SkinsPuppet`, extends it with equipment-specific visual logic (e.g., tools, torso items, hats), and ensures fallback to a valid default character if the requested one is invalid or unavailable (e.g., a mod character in an incompatible context). It manages dynamic symbol overrides, animation sequences, and a truncated name label.

## Usage example
```lua
local SkinsAndEquipmentPuppet = require "widgets/skinsandequipmentpuppet"

local puppet = SkinsAndEquipmentPuppet("wilson", {1, 1, 1}, {1.2, 1.2})
puppet:InitSkins({
    prefab = "wilson",
    name = "PlayerOne",
    base_skin = "default",
    body_skin = "",
    hand_skin = "gloves",
    legs_skin = "pants",
    feet_skin = "boots"
})
puppet:SetTool("swap_staffs")
puppet:SetHat("wizardhat")
puppet:SetTorso("torso_amulets")
puppet:StartAnimUpdate()
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `character` | string | `nil` | The resolved character prefab name (after fallback validation). |
| `name` | Text widget | `nil` | Child text element used to display the player's name. |
| `has_body` | boolean | `false` | Tracks whether a body skin was provided (affects torso item display). |
| `has_base` | boolean | `false` | Tracks whether a base skin was provided (affects hat display). |
| `timetonewanim` | number | `nil` | Internal timer controlling transitions between idle and animated states. |

## Main functions
### `DoInit(colour)`
*   **Description:** Initializes the widget with colour tinting and optional torso tuck overrides; creates the name label text widget.
*   **Parameters:** `colour` (table) — A table of four numbers `{r, g, b, a}` used to tint the puppet via `SetMultColour`.
*   **Returns:** Nothing.

### `InitSkins(player_data)`
*   **Description:** Applies skin and equipment data from `player_data`, updating character, base, clothing, and name. Skips overrides if no valid body/base skin exists (to avoid hiding clothing with gear).
*   **Parameters:** `player_data` (table or `nil`) — Expected keys: `prefab` (string), `name` (string), `base_skin` (string or `nil`), `body_skin`, `hand_skin`, `legs_skin`, `feet_skin` (all strings).
*   **Returns:** Nothing.
*   **Error states:** If `player_data` is `nil` or missing keys, defaults to current character and empty skin state.

### `SetTool(tool)`
*   **Description:** Applies an equipment tool override (e.g., a staff) and switches arm animations to the carrying pose.
*   **Parameters:** `tool` (string) — The tool symbol name; special handling for `"swap_staffs"` to pick red/blue variant.
*   **Returns:** Nothing.

### `SetTorso(torso)`
*   **Description:** Applies a torso item (e.g., amulet or gear) only if no body skin was provided (`has_body` is `false`).
*   **Parameters:** `torso` (string) — The torso item symbol name; supports `"torso_amulets"` for random amulet selection.
*   **Returns:** Nothing.

### `SetHat(hat)`
*   **Description:** Applies a hat or helmet override only if no base skin was provided (`has_base` is `false`); manages hair/HEAD/HAT animation states.
*   **Parameters:** `hat` (string) — The hat symbol name.
*   **Returns:** Nothing.

### `StartAnimUpdate()`
*   **Description:** Begins the idle animation loop with a randomized start time and activates the periodic update callback (`OnUpdate`).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Handles periodic animation transitions; after a random delay, pushes a short non-idle animation followed by returning to idle.
*   **Parameters:** `dt` (number) — Time elapsed since last frame.
*   **Returns:** Nothing.

### `OnGainFocus()`
*   **Description:** Shows the name label and resets the animation timer to allow immediate animation change.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnLoseFocus()`
*   **Description:** Hides the name label when the widget is not in focus (e.g., scrolled out of view).
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
*   **Listens to:** None identified.  
*   **Pushes:** None identified.