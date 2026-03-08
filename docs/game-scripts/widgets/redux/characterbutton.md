---
id: characterbutton
title: Characterbutton
description: A clickable UI button widget used in character selection screens to represent a character, displaying its avatar and lock state.
tags: [ui, character, selection]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 0b587e05
system_scope: ui
---

# Characterbutton

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`CharacterButton` is a specialized UI widget extending `ImageButton` for use in character selection menus. It visually represents a character with an animated head, applies tinting based on ownership (locked vs unlocked), and shows a lock icon for unowned characters. It integrates with the `characterutil.lua` module to resolve character data and ownership.

## Usage example
```lua
local CharacterButton = require "widgets/redux/characterbutton"
local btn = CharacterButton("walter", nil, function()
    print("Character selected!")
end)
btn:SetCharacter("walter")
```

## Dependencies & tags
**Components used:** None (this is a pure UI widget with no `inst:AddComponent` calls).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `herocharacter` | string or `"random"` | `nil` | The character identifier (e.g., `"walter"`, `"random"`). |
| `ongainfocus` | function or `nil` | `nil` | Callback invoked when the button gains focus. |
| `lock_img` | Image | `nil` | Reference to the lock icon image child. |
| `head_anim` | UIAnim | `nil` | The animated head widget. |
| `head_animstate` | AnimState | `nil` | Animation state for the head. |
| `image` | Image (inherited) | `nil` | Base image widget (inherited from `ImageButton`). |

## Main functions
### `_SetupHead()`
* **Description:** Initializes and configures the head animation widget. Sets up the animation bank, plays the idle loop, and prepares rendering.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetCharacter(hero)`
* **Description:** Updates the button's visual representation for the given character. Adjusts animation time, scale, position, skin, and tint/lock state based on ownership.
* **Parameters:** `hero` (string) — the character name (e.g., `"walter"`, `"random"`).
* **Returns:** Nothing.

### `RefreshInventory()`
* **Description:** Triggers a refresh of the button’s character display by re-calling `SetCharacter`. Intended for use when inventory or ownership state may have changed.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Pushes:** `onclick` — fired when the button is clicked (inherited from `ImageButton`).
- **Listens to:** None directly (focus callbacks are provided via `cbPortraitFocused` on construction and stored as `self.ongainfocus`, but no `inst:ListenForEvent` calls are present in this file).