---
id: wardrobescreen
title: Wardrobescreen
description: Manages the wardrobe UI for selecting and previewing character skins in Don't Starve Together.
tags: [ui, inventory, character, skin]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 72237714
system_scope: ui
---

# Wardrobescreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`WardrobeScreen` is a UI screen that allows players to select, preview, and apply skins for a given character. It displays character-specific equipment slots (base, body, hand, legs, feet), shows live previews via the `Puppet` widget, supports skin presets via `SkinPresetsPopup`, and tracks equipment changes relative to the saved loadout. It extends `Screen` and orchestrates multiple child widgets including `ClothingExplorerPanel`, `Subscreener`, and `KitcoonPuppet`.

## Usage example
```lua
local user_profile = TheState and TheState.user_profile or {}
local character = "walani"
local wardrobe = WardrobeScreen(user_profile, character)
TheFrontEnd:PushScreen(wardrobe)
```

## Dependencies & tags
**Components used:** None directly; uses widgets (`Puppet`, `KitcoonPuppet`, `ClothingExplorerPanel`, `Image`, `Text`, `Widget`) and screen helpers (`Subscreener`, `ScreenTooltip`).  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `user_profile` | table | `nil` | Profile containing saved skins and data. |
| `currentcharacter` | string | `nil` | Character ID string (e.g., `"walani"`). |
| `selected_skins` | table | `{}` | Currently applied/owned skin keys per slot (`base`, `body`, `hand`, `legs`, `feet`). |
| `preview_skins` | table | `{}` | Temporary preview skin keys; may include unowned items. |
| `skinmodes` | table | `nil` | Array of skin mode configs (scale, offset) for each view. |
| `view_index` | number | `1` | Index into `skinmodes` for current puppet view. |
| `portrait_view_index` | number | `#skinmodes + 1` | Special index used to toggle portrait view. |
| `showing_portrait` | boolean | `false` | Whether the portrait view (not puppet) is active. |
| `puppet` | Puppet | `nil` | Puppet instance for previewing equipped items. |
| `kit_puppet` | KitcoonPuppet | `nil` | Additional puppet for decorative display. |

## Main functions
### `WardrobeScreen(self, user_profile, character)`
*   **Description:** Constructor for `WardrobeScreen`. Initializes the UI layout, loads saved skins, sets up subscreens for each equipment slot, and prepares controls (buttons, focus).  
*   **Parameters:**  
    `user_profile` (table) — Profile object for per-character skin persistence.  
    `character` (string) — Character ID used to determine available skins and quotes.  
*   **Returns:** Nothing; `self` is returned by `Class`.  
*   **Error states:**None; relies on `TheInventory` and `TheFrontEnd` being initialized.

### `_SetSkinMode(skinmode)`
*   **Description:** Applies a specific skin mode (scale and position offset) to the preview puppet and updates the skin.  
*   **Parameters:**  
    `skinmode` (table) — Table with optional `scale` (number) and `offset` (array `{x, y}`) keys.  
*   **Returns:** Nothing.

### `_CycleView(reset)`
*   **Description:** Cycles between preview views (e.g., different puppet poses) and toggles the portrait view.  
*   **Parameters:**  
    `reset` (boolean, optional) — If `true`, forces reset to base view and hides portrait.  
*   **Returns:** Nothing.

### `_SetShowPortrait(show)`
*   **Description:** Toggles visibility between the character portrait (`heroportrait`) and the puppet (`puppet_root`).  
*   **Parameters:**  
    `show` (boolean) — `true` to show portrait and hide puppet; `false` to show puppet.  
*   **Returns:** Nothing.

### `_MakeMenu(subscreener)`
*   **Description:** Builds the horizontal menu of equipment slot buttons and returns the menu widget. Initializes tooltip and button widgets.  
*   **Parameters:**  
    `subscreener` (Subscreener) — Parent subscreener instance.  
*   **Returns:** `Widget` — The constructed menu.

### `_CloseScreen()`
*   **Description:** Saves the current loadout to `user_profile` and returns to the previous screen.  
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `_SaveLoadout()`
*   **Description:** Persists the current `selected_skins` to `user_profile` for `currentcharacter`.  
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `_LoadSkinPresetsScreen()`
*   **Description:** Pushes the `SkinPresetsPopup` screen to allow loading predefined skin sets.  
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `ApplySkinPresets(skins)`
*   **Description:** Applies a set of presets for each skin slot, using defaults if a slot is missing. Updates `selected_skins`, `preview_skins`, and refreshes all subscreens.  
*   **Parameters:**  
    `skins` (table) — Keys: `base`, `body`, `hand`, `legs`, `feet`; values: skin key strings.  
*   **Returns:** Nothing.

### `_LoadSavedSkins()`
*   **Description:** Loads saved skins for `currentcharacter` from `user_profile` and copies them into `preview_skins`. Calls `_RefreshAfterSkinsLoad()` to apply them.  
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `_RefreshAfterSkinsLoad()`
*   **Description:** Refreshes subscreens and applies skins to the preview puppet. Updates menu buttons and dirty state.  
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `_CheckDirty()`
*   **Description:** Compares current `selected_skins` to saved loadout; enables/disables the Reset button accordingly.  
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `_SelectSkin(item_type, item_key, is_selected, is_owned)`
*   **Description:** Updates `preview_skins` or `selected_skins` (if owned and selected) for the given slot, then reapplies skins to the preview.  
*   **Parameters:**  
    `item_type` (string) — Slot key (`"base"`, `"body"`, `"hand"`, `"legs"`, `"feet"`).  
    `item_key` (string) — Skin identifier (e.g., `"walani_base"`).  
    `is_selected` (boolean) — Whether the item is currently selected in the explorer panel.  
    `is_owned` (boolean) — Whether the player owns the item.  
*   **Returns:** Nothing.

### `_ApplySkins(skins)`
*   **Description:** Applies skin keys to the `Puppet` widget, updates portrait/quote, and checks dirty state.  
*   **Parameters:**  
    `skins` (table) — Skin keys to apply (usually `preview_skins`).  
*   **Returns:** Nothing.

### `_UpdateMenu(skins)`
*   **Description:** Syncs menu button labels with current skin keys (uses defaults if a slot is missing).  
*   **Parameters:**  
    `skins` (table) — Skin keys to display (usually `selected_skins`).  
*   **Returns:** Nothing.

### `_SetPortrait()`
*   **Description:** Sets portrait image and quote text for the preview based on the current base skin.  
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `OnBecomeActive()`
*   **Description:** Called when screen becomes active. Refreshes subscreens, shows unowned character popup if needed, and enables kit puppet.  
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `OnBecomeInactive()`
*   **Description:** Called when screen becomes inactive. Disables kit puppet.  
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `RefreshInventory(animateDoodad)`
*   **Description:** Updates the doodad counter display based on current currency.  
*   **Parameters:**  
    `animateDoodad` (boolean, optional) — Whether to animate the counter change.  
*   **Returns:** Nothing.

### `GetHelpText()`
*   **Description:** Returns localized help text listing controls and their functions.  
*   **Parameters:** None.  
*   **Returns:** string — Descriptive help string (e.g., `"A Accept  B Reset  X Skin Presets  D Cycle View"`).

### `OnControl(control, down)`
*   **Description:** Handles control input (keyboard/controller). Triggers close, reset, presets, or cycle actions.  
*   **Parameters:**  
    `control` (number) — `CONTROL_*` constant (e.g., `CONTROL_CANCEL`).  
    `down` (boolean) — Whether the control was pressed (`true`) or released (`false`).  
*   **Returns:** boolean — `true` if handled, `false` otherwise.

### `OnUpdate(dt)`
*   **Description:** Called every frame. Updates puppet emotes.  
*   **Parameters:**  
    `dt` (number) — Delta time in seconds.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None directly.  
- **Pushes:** None directly.  
