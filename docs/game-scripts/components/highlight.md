---
id: highlight
title: Highlight
description: Manages dynamic highlight color overlays for entities, supporting persistent highlighting, flashing effects, and per-entity color overrides.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: ui
source_hash: 97bdf38b
---

# Highlight

## Overview
This component adds a visual highlight effect to an entity (and optionally its child entities) by modifying its `AnimState`'s highlight color. It supports persistent highlighting (e.g., when an item is hovered or targeted), temporary flashing (e.g., during damage or selection feedback), and dynamic color blending from multiple sources: base color, highlight color override, and flash transitions.

## Dependencies & Tags
- **Requires:** `AnimState` component (used to apply color changes via `AnimState:SetHighlightColour`)
- **Uses:** `easing` module (`easing.outCubic`) for smooth flash transitions
- **Tag Behavior:** Conditionally applies highlight based on `"player"` tag or line-of-sight (`CanEntitySeeTarget`) — no tags are added/removed programmatically by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed to constructor) | Reference to the owner entity. |
| `highlit` | `boolean?` | `nil` | Whether the entity is currently highlighted. |
| `base_add_colour_red/green/blue` | `number` | `0` | Persistent base color offset added to the highlight. |
| `highlight_add_colour_red/green/blue` | `number?` | `nil` | Override color used during highlighting (e.g., white-ish default or custom per-entity color). |
| `flashadd` | `number` | (undefined until `Flash`) | Peak value of the flash color offset. |
| `flashtimein` / `flashtimeout` | `number` | (undefined until `Flash`) | Duration (in seconds) of the flash's rising and falling phases. |
| `t` | `number` | `0` | Internal timer tracking progress within flash transitions. |
| `flashing` | `boolean` | `false` | Whether a flash effect is active. |
| `goingin` | `boolean` | `false` | Direction of current flash: `true` = fading in, `false` = fading out. |
| `flash_val` | `number?` | `nil` | Current interpolated flash color offset value. |

## Main Functions

### `SetAddColour(col)`
* **Description:** Sets the persistent base highlight color (e.g., for ambient or background lighting effects). Immediately applies the new color unless flashing is active.  
* **Parameters:**  
  - `col` (`Vector3` or table-like): RGB color offset where `col.x`, `col.y`, `col.z` correspond to red, green, and blue components.

### `Flash(toadd, timein, timeout)`
* **Description:** Initiates a temporary flash effect using a cubic easing function. The flash starts at `0`, ramps up to `toadd` over `timein` seconds, then fades back to `0` over `timeout` seconds. Automatically starts/stops entity updates as needed.  
* **Parameters:**  
  - `toadd` (`number`): Peak additive color value applied during the flash peak (RGB channels use the same value).  
  - `timein` (`number`): Duration (in seconds) of the ascending (fading-in) phase.  
  - `timeout` (`number`): Duration (in seconds) of the descending (fading-out) phase.

### `OnUpdate(dt)`
* **Description:** Drives the flash animation each frame. Handles cleanup on entity invalidation (stops updates or removes the component). Updates `flash_val` using easing, and calls `ApplyColour()` when active.  
* **Parameters:**  
  - `dt` (`number`): Time elapsed since the last frame (in seconds).

### `ApplyColour()`
* **Description:** Computes the total additive color (sum of base, highlight override, and current flash value) and applies it to the entity's `AnimState` (and optionally its `highlightchildren`). If `AnimState` is missing, no action is taken.  
* **Parameters:** None.

### `Highlight(r, g, b)`
* **Description:** Activates a highlight on the entity. If the entity is visible to the player or is a player, applies a color override (default `.2, .2, .2` or custom from `highlightoverride`); otherwise, clears the override. Sets `highlit = true`. Does not apply color if flashing is in progress (waits until flash ends).  
* **Parameters:**  
  - `r`, `g`, `b` (`number?`): Optional explicit RGB override values; if provided, used instead of `highlightoverride` or default.

### `UnHighlight()`
* **Description:** Deactivates the highlight by setting `highlit = nil`. Does *not* immediately remove the component or color override fields (commented out in code), but will remove the component if not currently flashing.  
* **Parameters:** None.

### `OnRemoveFromEntity()`
* **Description:** Cleans up highlight color when the component is removed: resets highlight color to default (no offset) on the entity and its children.  
* **Parameters:** None.

## Events & Listeners
None identified.