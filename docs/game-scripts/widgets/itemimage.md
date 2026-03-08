---
id: itemimage
title: Itemimage
description: Renders a visual item frame with dynamic skin/icon display, new/unlocked status indicators, and click interaction handling in UI screens.
tags: [ui, inventory, rendering]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: d873642c
system_scope: ui
---

# Itemimage

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`ItemImage` is a UI widget that visually represents an item or skin in the game’s interface, such as the inventory or skin selection screens. It manages the display of item icons using animation frames, shows whether the item is newly unlocked, handles hover and selection states (with scaling and animations), and supports optional click callbacks. It relies on the `UIAnim`, `Image`, and `Text` widgets to construct its visual state and does not depend on any core entity components.

## Usage example
```lua
local item_image = ItemImage(screen, "base", "axebone", "axebone_001", nil, OnItemClick)

-- Update the displayed item
item_image:SetItem("base", "axe", "axe_001")

-- Mark with a warning indicator
item_image:Mark(true)

-- Programmatically select/unselect
item_image:Select()
item_image:Unselect()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `screen` | table or nil | `nil` | Reference to the parent screen widget (used for focus/collection timestamp access). |
| `type` | string or nil | `nil` | Item type (e.g., `"base"`, `"vanity"`). |
| `name` | string or nil | `nil` | Internal item name used to resolve build/skin symbols. |
| `item_id` | string or nil | `nil` | Unique item identifier string. |
| `clickFn` | function or nil | `nil` | Optional callback executed on item selection (signature: `function(type, name, item_id)`). |
| `frame` | UIAnim | instance | The animated frame widget used to render the item. |
| `new_tag` | Text | instance | The "NEW" label shown for newly unlocked items. |
| `warn_marker` | Image | instance | The yellow exclamation mark shown for items requiring attention. |
| `rarity` | string | `"common"` | Current item rarity, affecting the frame background symbol. |
| `warning` | boolean | `false` | Whether the warning marker is active. |
| `clicked` | boolean | `false` | Whether the item is currently selected (clicked). |
| `disable_selecting` | boolean | `false` | When `true`, prevents selection triggers on `CONTROL_ACCEPT`. |
| `image_scale` | number | `0.6` | Base scale factor for the frame (applied by default). |

## Main functions
### `SetItem(type, name, item_id, timestamp)`
* **Description:** Updates the displayed item based on type/name and updates new/unlocked indicators. Accepts `nil`/empty values to render an empty frame.
* **Parameters:**
  * `type` (string or nil) — Item type string (e.g., `"vanity"`); if `""` and `name == ""`, it triggers the empty-frame behavior.
  * `name` (string or nil) — Internal item name used to look up builds and rarity.
  * `item_id` (string or nil) — Unique ID for the item (stored but not used internally beyond storage).
  * `timestamp` (number or nil) — Unix timestamp of when the item was unlocked; used to compare against the screen’s collection timestamp.
* **Returns:** Nothing.
* **Error states:** No special error behavior. If `type` and `name` are both empty/`nil`, renders an empty frame with default `"common"` rarity.

### `ClearFrame()`
* **Description:** Resets the widget to its empty-frame state, clearing all overrides and hiding the `NEW` tag and warning marker.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetItemRarity(rarity)`
* **Description:** Overrides the current item’s rarity and updates the frame background symbol accordingly.
* **Parameters:**
  * `rarity` (string) — Rarity name (e.g., `"common"`, `"rare"`); defaults to `"common"` if `nil`.
* **Returns:** Nothing.

### `Mark(value)`
* **Description:** Shows or hides the warning (exclamation) marker based on the boolean flag.
* **Parameters:**
  * `value` (boolean) — `true` to show, `false` to hide.
* **Returns:** Nothing.

### `PlaySpecialAnimation(name, pushdefault)`
* **Description:** Plays a one-shot animation on the frame (e.g., `"shake"`), optionally pushing the default `"idle_on"` animation afterward.
* **Parameters:**
  * `name` (string) — Animation name to play.
  * `pushdefault` (boolean) — If `true`, pushes `"idle_on"` as a looping animation after `name` finishes.
* **Returns:** Nothing.

### `PlayDefaultAnim()`
* **Description:** Immediately plays the `"idle_on"` animation in a loop.
* **Parameters:** None.
* **Returns:** Nothing.

### `DisableSelecting()`
* **Description:** Enables internal flag to prevent selection behavior on `CONTROL_ACCEPT`.
* **Parameters:** None.
* **Returns:** Nothing.

### `Select()`
* **Description:** Applies the selected visual state (embiggened scale, sets `clicked = true`). Does *not* trigger click callback.
* **Parameters:** None.
* **Returns:** Nothing.

### `Unselect()`
* **Description:** Removes the selected visual state (normal scale, sets `clicked = false`).
* **Parameters:** None.
* **Returns:** Nothing.

### `Embiggen()`
* **Description:** Scales the frame up by `1.18`× the base scale (used for selection/hover).
* **Parameters:** None.
* **Returns:** Nothing.

### `Shrink()`
* **Description:** Resets the frame scale to the base `image_scale`.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnGainFocus()`
* **Description:** UI focus handler. Plays `"hover"` animation, embiggens the frame, plays a mouseover sound, and notifies the parent screen of the focus change.
* **Parameters:** None (inherited from widget system).
* **Returns:** Nothing.

### `OnLoseFocus()`
* **Description:** UI focus lost handler. Shrinks the frame (if not clicked) and resets to default animation.
* **Parameters:** None (inherited from widget system).
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Input handler for `CONTROL_ACCEPT`. Executes click logic only on button release (`down == false`) and triggers `clickFn` if set.
* **Parameters:**
  * `control` (string) — Control identifier (must be `"accept"`).
  * `down` (boolean) — `true` when pressed, `false` when released.
* **Returns:** `true` if the event was handled; `false` or `nil` otherwise.

### `OnEnable()` / `OnDisable()`
* **Description:** Lifecycle handlers that ensure proper focus behavior when the widget is enabled/disabled.
* **Parameters:** None (inherited).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified