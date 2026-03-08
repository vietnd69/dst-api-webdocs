---
id: itemimage
title: Itemimage
description: A UI widget for displaying item icons with support for ownership count, unlock animations, and state-based styling in account item lists.
tags: [ui, inventory, account]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: e7d1f490
system_scope: ui
---

# Itemimage

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`ItemImage` is a UI widget subclassed from `Button`, designed for use within scrolling lists (e.g., in account item inventory screens). It displays an item's icon via an `AccountItemFrame`, shows the item's owned count, supports unlock animations, and handles focus-based scaling and highlight states. It is typically used to render items in the marketplace, inventory, or skin selection UIs.

## Usage example
```lua
local item_image = ItemImage(user_profile, screen)
item_image:SetItem("base", "slurtle_shell", "acc_item_123", 1678886400)
item_image:Mark(true) -- Show warning marker (e.g., marketplace listing conflict)
item_image:ScaleToSize(108) -- Adjust scale to fit desired widget size
item_image:PlayUnlock() -- Trigger unlock animation
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `user_profile` | table or `nil` | `nil` | User profile object used to determine item acquisition status. |
| `screen` | table or `nil` | `nil` | Parent screen context, used to conditionally show hover text. |
| `image_scale` | number | `0.6` | Base scale factor for the item frame. |
| `frame` | `AccountItemFrame` | — | Child widget holding the item icon and animation state. |
| `owned_count` | `Text` | — | Text widget showing the quantity of owned items (e.g., `x3`). |
| `warning` | boolean | `false` | Whether a warning state is active. |
| `warn_marker` | `Image` | — | Yellow exclamation icon displayed when `warning` is `true`. |
| `type` | string or `nil` | `nil` | Last-set item type (e.g., `"base"`, `"dlc"`), often unused. |
| `name` | string | `"empty"` (after `ClearFrame`) | Last-set item name/key. |
| `rarity` | string | `"common"` | Rarity derived from item name via `GetRarityForItem`. |

## Main functions
### `PlayUnlock()`
*   **Description:** Plays the unlock animation sequence on the item frame.  
*   **Parameters:** None.  
*   **Returns:** Nothing.  

### `PlaySpecialAnimation(name, pushdefault)`
*   **Description:** Plays a named animation (e.g., sale highlight) on the item frame. Optionally queues the default `"icon"` animation afterward.  
*   **Parameters:**  
  *   `name` (string) — Animation name to play (non-looping).  
  *   `pushdefault` (boolean) — If `true`, pushes the `"icon"` animation onto the stack after the special animation finishes.  
*   **Returns:** Nothing.  

### `PlayDefaultAnim()`
*   **Description:** Plays the default `"icon"` animation on the item frame, looping it.  
*   **Parameters:** None.  
*   **Returns:** Nothing.  

### `SetItem(type, name, item_id, timestamp)`
*   **Description:** Populates the widget with item data. Updates rarity, item frame content, and sets the item as "new" if its `timestamp` exceeds the user's collection timestamp. Clears the warning marker.  
*   **Parameters:**  
  *   `type` (string or `nil`) — Item type (e.g., `"base"`, `"dlc"`); may be empty or `"base"`.  
  *   `name` (string or `nil`) — Item name/key (required; if empty, `ClearFrame` is called).  
  *   `item_id` (string or `nil`) — Account-unique item identifier (not used directly here).  
  *   `timestamp` (number or `nil`) — Acquisition timestamp for freshness detection.  
*   **Returns:** Nothing.  
*   **Error states:** Raises an assertion error if `name` is `nil` or an empty string.  

### `ClearFrame()`
*   **Description:** Resets the widget to a blank state, hiding all content and setting default fallback values.  
*   **Parameters:** None.  
*   **Returns:** Nothing.  

### `Mark(value)`
*   **Description:** Sets or clears the warning state. Shows or hides the yellow exclamation marker accordingly.  
*   **Parameters:**  
  *   `value` (boolean) — `true` to show warning marker, `false` to hide.  
*   **Returns:** Nothing.  

### `Embiggen()`
*   **Description:** Increases the item frame scale to `image_scale × 1.18`, used when the widget gains focus.  
*   **Parameters:** None.  
*   **Returns:** Nothing.  

### `Shrink()`
*   **Description:** Restores the item frame scale to `image_scale`, used when focus is lost.  
*   **Parameters:** None.  
*   **Returns:** Nothing.  

### `ScaleToSize(side)`
*   **Description:** Dynamically adjusts the item frame scale to fit a target display size (assumes 192×192 assets, adjusted for resolution and padding). Updates `image_scale` accordingly.  
*   **Parameters:**  
  *   `side` (number) — Target width/height in pixels.  
*   **Returns:** Nothing.  

### `SetInteractionState(is_active, is_owned, is_interaction_target, is_unlockable, is_dlc_owned)`
*   **Description:** Configures visual state of the item frame based on interaction context (e.g., marketplace viewing, ownership, DLC status).  
*   **Parameters:**  
  *   `is_active` (boolean) — Whether the item is active in current context.  
  *   `is_owned` (boolean) — Whether the user owns the item.  
  *   `is_interaction_target` (boolean) — Whether this item is the current interaction target (e.g., selected in a list).  
  *   `is_unlockable` (boolean) — Whether the item is unlockable.  
  *   `is_dlc_owned` (boolean) — Whether the associated DLC is owned.  
*   **Returns:** Nothing.  

### `ApplyDataToWidget(context, widget_data, data_index)`
*   **Description:** High-level data binding method for use in scrolling lists. Calls `SetItem`, updates owned count, sets weavability, configures hover text (if enabled), and manages focus states.  
*   **Parameters:**  
  *   `context` (table) — Contains `screen` reference.  
  *   `widget_data` (table or `nil`) — Item data structure with keys: `item_key`, `item_id`, `acquire_timestamp`, `owned_count`.  
  *   `data_index` (any) — Index in the list (unused here).  
*   **Returns:** Nothing.  

## Events & listeners
None identified