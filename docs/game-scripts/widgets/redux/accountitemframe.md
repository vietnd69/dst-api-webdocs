---
id: accountitemframe
title: Accountitemframe
description: Manages the visual state and animation of an account item frame UI widget, including appearance based on item properties, ownership, and interaction state.
tags: [ui, animation, skin]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 149b865d
system_scope: ui
---

# Accountitemframe

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`AccountItemFrame` is a UI widget that wraps the `accountitem_frame` animation asset to visually represent items in the skins/lobby screens. It provides methods to dynamically update appearance based on item key (e.g., rarity, build icon), ownership status (owned/unowned/locked), activity state (selected/focused), and special attributes like being new or DLC-related. It extends `UIAnim` and manages multiple animation layers for overlays (e.g., `LOCK`, `NEW`, `IC_WEAVE`, `DLC`, `SELECT`, `FOCUS`, `TINT`) using the game’s animation system.

## Usage example
```lua
local frame = AccountItemFrame()
frame:SetItem("BEEFALO_HORN")
frame:SetActivityState(true, true, false, false)
frame:SetAge(true)
frame:SetWeavable(true)
frame:SetLocked()
```

## Dependencies & tags
**Components used:** None (pure UI widget, no entity components accessed via `inst.components.X`)
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `age_text` | `Text` widget | `nil` (created in constructor) | Text label displaying "NEW" overlay, rotated and positioned absolutely within the frame. |
| `inst` | `Entity` | inherited from `UIAnim` | The owning entity instance for the widget. |

## Main functions
### `SetItem(item_key)`
* **Description:** Updates the frame’s visual appearance based on the provided item key, setting its build icon, rarity frame background, and optional event icon. Automatically hides extra layers before applying changes.
* **Parameters:** `item_key` (string) — a key used to index item tables (e.g., `MISC_ITEMS`). Must be a valid string.
* **Returns:** Nothing.
* **Error states:** Throws an assertion error if `item_key` is not a string.

### `_SetBuild(build)`
* **Description:** Overrides the `SWAP_ICON` symbol with the specified build animation asset to show the item’s visual representation.
* **Parameters:** `build` (string) — the name of the build symbol to use (e.g., `"beefalo_horn"`).
* **Returns:** Nothing.

### `_SetRarity(rarity)`
* **Description:** Overrides the `SWAP_frameBG` symbol to display the appropriate background frame for the item’s rarity.
* **Parameters:** `rarity` (string) — the rarity identifier used to look up the correct frame symbol.
* **Returns:** Nothing.

### `_SetEventIcon(item_key)`
* **Description:** Conditionally shows a special event icon layer (e.g., seasonal or one-time event marker) if defined for the item.
* **Parameters:** `item_key` (string) — the item key used to look up an associated event icon.
* **Returns:** Nothing.

### `SetWeavable(weavable)`
* **Description:** Shows or hides the `IC_WEAVE` layer to indicate whether the item can be woven (e.g., custom skin customization).
* **Parameters:** `weavable` (boolean) — whether the item is weavable.
* **Returns:** Nothing.

### `SetBlank()`
* **Description:** Resets the frame to a neutral/default state by clearing all override symbols, playing the base `"icon"` animation, and hiding all extra layers.
* **Parameters:** None.
* **Returns:** Nothing.

### `HideFrame()`
* **Description:** Hides the main frame geometry and its background layer (e.g., for empty or placeholder slots).
* **Parameters:** None.
* **Returns:** Nothing.

### `_HideExtraLayers()`
* **Description:** Hides all optional overlay layers (`TINT`, `LOCK`, `NEW`, `SELECT`, `FOCUS`, `IC_WEAVE`, `DLC`, and all dynamic event icons), and hides the `age_text` label. Called during initialization and before applying new item states.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetLocked()`
* **Description:** Shows the `TINT` and `LOCK` layers to indicate the item is locked/unavailable.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetUnowned()`
* **Description:** Shows only the `TINT` layer to indicate the item is unowned but not locked.
* **Parameters:** None.
* **Returns:** Nothing.

### `PlayUnlock()`
* **Description:** Triggers the unlock animation sequence. Hides the lock overlay, waits 0.5s to remove the tint, plays the `"unlock"` animation once, then plays the `"icon"` animation on loop.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetActivityState(is_active, is_owned, is_unlockable, is_dlc_owned)`
* **Description:** Sets the frame’s state based on four flags: selection state (`is_active`), ownership (`is_owned`), unlockability (`is_unlockable`), and DLC ownership (`is_dlc_owned`). Controls selection (`SELECT`), lock/tint, and DLC (`DLC`) overlays.
* **Parameters:**
  * `is_active` (boolean) — whether the item is currently selected/active.
  * `is_owned` (boolean) — whether the player owns the item.
  * `is_unlockable` (boolean) — whether the item can be unlocked (implies locked if unowned).
  * `is_dlc_owned` (boolean) — whether the item belongs to a DLC the player owns.
* **Returns:** Nothing.

### `SetAge(is_new)`
* **Description:** Controls the "new" state by showing/hiding the `NEW` overlay and the `age_text` label, then resets the base animation to `"icon"` loop.
* **Parameters:** `is_new` (boolean) — if true, shows the new item indicator.
* **Returns:** Nothing.

### `SetStyle_Highlight()`
* **Description:** Plays the `"hover"` animation, typically used when the item is hovered or focused in a menu.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetStyle_Normal()`
* **Description:** Plays the `"icon"` animation in loop mode, returning the frame to its default idle state.
* **Parameters:** None.
* **Returns:** Nothing.

### `ShowFocus(f)`
* **Description:** Shows or hides the `FOCUS` layer, typically used for keyboard/controller navigation focus in the lobby menu.
* **Parameters:** `f` (boolean) — whether focus should be shown.
* **Returns:** Nothing.

### `ShowSelect(s)`
* **Description:** Toggles selection highlight style — calls `SetStyle_Highlight()` if `s` is true, otherwise `SetStyle_Normal()`.
* **Parameters:** `s` (boolean) — whether the item is selected/highlighted.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified (uses `DoTaskInTime` for delayed side effects, not event listeners).
- **Pushes:** None identified.