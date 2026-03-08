---
id: loadoutselect
title: Loadoutselect
description: Manages the player character skinning and skill tree UI context, including skin selection, previewing, and navigation between wardrobe and skill tree modes.
tags: [ui, character, skin, inventory]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: b318ee18
system_scope: ui
---

# Loadoutselect

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`LoadoutSelect` is a `Widget` that renders the character loadout (wardrobe/skin selection) screen. It handles display of character portraits, animated puppets, clothing explorer panels for body/hand/legs/feet/base items, skin presets, and toggles between the wardrobe and skill tree contexts. It interacts with user profile data, inventory currency, and character skin definitions to support real-time skin previewing and selection.

## Usage example
```lua
local loadout = LoadoutSelect(user_profile, "wXM", "normal_skin", false, false, false, selected_skins)
loadout:SetDefaultMenuOption()
-- Add to parent widget and manage focus, events, and context switching via SwitchContext()
```

## Dependencies & tags
**Components used:** None (widget-only; no component methods invoked via `inst.components.X`).  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `user_profile` | table | `nil` | User profile object for loading/saving skins and currency. |
| `currentcharacter` | string | `nil` | Prefab name of the currently selected character. |
| `show_puppet` | boolean | `true` | Whether to display the 3D puppet (false for "random" character). |
| `have_base_option` | boolean | `true` | Whether the character supports a base outfit option. |
| `skinmodes` | table | `{}` | List of skin mode definitions (e.g., anim_bank, scale, offset). |
| `selected_skinmode` | table | `skinmodes[1]` | Currently active skin mode (affects puppet scale/position). |
| `view_index` | number | `1` | Index into `skinmodes` for view cycling. |
| `preview_skins` | table | `{}` | Temporary skin selection for previewing (before committing). |
| `selected_skins` | table | `{}` | Persisted skin selection for the character. |
| `currentContext` | string | `"wardrobe"` | Current UI context (`"wardrobe"` or `"skills"`). |
| `can_show_skilltree` | boolean | `true` | Whether the current character has a defined skill tree. |

## Main functions
### `SetDefaultMenuOption()`
* **Description:** Sets the active subscreen in the subscreener to `"base"` (if available) or `"body"`.
* **Parameters:** None.
* **Returns:** Nothing.

### `SwitchContext()`
* **Description:** Toggles between the wardrobe (skin selection) and skill tree contexts. Hides/shows relevant UI elements and updates focus.
* **Parameters:** None.
* **Returns:** Nothing.

### `:SetDirectionsOfFocus()`
* **Description:** Configures directional focus navigation between the subscreener menu, presets button, and skill tree default focus.
* **Parameters:** None.
* **Returns:** Nothing.

### `:_CycleView(reset)`
* **Description:** Cycles the view between puppet and portrait modes (if supported). When `reset` is true, forces the view back to the first skinmode and hides the portrait.
* **Parameters:** `reset` (boolean) – if true, resets view to skinmode index `1`.
* **Returns:** Nothing.

### `:_SetSkinMode(skinmode)`
* **Description:** Applies a given skinmode definition to the puppet (scale and position) and reapplies current skins.
* **Parameters:** `skinmode` (table) – skin mode configuration (e.g., `scale`, `offset`, `anim_bank`).
* **Returns:** Nothing.

### `:_ApplySkins(skins, skip_change_emote)`
* **Description:** Applies a skin table (`base`, `body`, `hand`, `legs`, `feet`) to the puppet and updates portrait/quote. Calls validation helpers before applying.
* **Parameters:**  
  * `skins` (table) – skin selection to apply.  
  * `skip_change_emote` (boolean) – whether to skip emote animations.  
* **Returns:** Nothing.

### `:_SelectSkin(item_type, item_key, is_selected, is_owned)`
* **Description:** Updates preview and selected skins based on user interaction with an explorer panel. Applies skins immediately.
* **Parameters:**  
  * `item_type` (string) – `"base"`, `"body"`, `"hand"`, `"legs"`, or `"feet"`.  
  * `item_key` (string) – selected skin prefab identifier.  
  * `is_selected` (boolean) – whether the item is currently selected in the UI.  
  * `is_owned` (boolean) – whether the player owns the item.  
* **Returns:** Nothing.

### `:_RefreshAfterSkinsLoad()`
* **Description:** Refreshes clothing explorer panels and reapplies skins after initial skin data is loaded.
* **Parameters:** None.
* **Returns:** Nothing.

### `:_LoadSkinPresetsScreen()`
* **Description:** Pushes the `SkinPresetsPopup` screen to allow loading saved skin presets.
* **Parameters:** None.
* **Returns:** Nothing.

### `:_LoadItemSkinsScreen()`
* **Description:** Pushes the `DefaultSkinSelectionPopup` screen for managing item skins (starting inventory defaults).
* **Parameters:** None.
* **Returns:** Nothing.

### `:ApplySkinPresets(skins)`
* **Description:** Applies a skin preset table (`base`, `body`, `hand`, `legs`, `feet`) to the loadout, replacing current selection. Handles defaults for missing keys.
* **Parameters:** `skins` (table) – skin preset to apply.
* **Returns:** Nothing.

### `:OnControl(control, down)`
* **Description:** Handles keyboard/controller input for view cycling, presets, item skins, and skill tree toggle.
* **Parameters:**  
  * `control` (enum) – control ID (e.g., `CONTROL_MENU_MISC_3`).  
  * `down` (boolean) – whether the control was pressed (not released).  
* **Returns:** `true` if input was handled; `false` otherwise.

### `:RefreshInventory(animateDoodad)`
* **Description:** Updates the currency counter (doodads) display.
* **Parameters:** `animateDoodad` (boolean) – whether to animate the counter change.
* **Returns:** Nothing.

### `:OnUpdate(dt)`
* **Description:** Updates puppet emotes every frame.
* **Parameters:** `dt` (number) – delta time in seconds.
* **Returns:** Nothing.

### `:GetHelpText()`
* **Description:** Returns a localized, concatenated string of current control hints (e.g., keybind + label).
* **Parameters:** None.
* **Returns:** `string` – help text for all relevant controls.

## Events & listeners
- **Listens to:** `debug_rebuild_skilltreedata` (global) – triggers `SwitchContext()` twice if in `"skills"` context.
- **Pushes:** None (no `inst:PushEvent` calls observed in source).