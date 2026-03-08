---
id: itemslot
title: Itemslot
description: A UI widget that displays an inventory item slot with support for highlighting, background layers, labels, and tile placement.
tags: [ui, inventory, widget]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 84919dde
system_scope: ui
---

# Itemslot

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`ItemSlot` is a UI widget used to represent interactive inventory slots in the game's user interface. It extends the base `Widget` class and provides visual feedback (e.g., scaling highlights) and layout management for an item's visual representation (`tile`), background layers (`bgimage`, `bgimage2`), labels, and optional read-only indicator. It integrates with DST's UI system to handle focus transitions and dynamic content updates.

## Usage example
```lua
local itemslot = ItemSlot("images/inventory.xml", "slot.tex", owner)
itemslot:SetLabel("10", {1, 1, 1})
itemslot:SetTile(some_item_visual)
itemslot:SetOnTileChangedFn(function(tile)
    print("New tile added:", tile ~= nil and "yes" or "no")
end)
```

## Dependencies & tags
**Components used:** None (this is a pure UI widget, not a server-side component).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | Entity or table | `nil` | The entity or context owner of this slot (provided at construction). |
| `bgimage` | Image | `nil` | Primary background image, created from constructor args. |
| `tile` | Widget or nil | `nil` | The main visual content (e.g., item icon) placed in the slot. |
| `bgimage2` | Image or nil | `nil` | Optional secondary background layer. |
| `label` | Text or nil | `nil` | Optional text label (e.g., stack count) overlaid on the slot. |
| `readonlyvisual` | Image or nil | `nil` | Dark overlay used to visually indicate a read-only slot. |
| `highlight_scale` | number | `1.3` | Scale factor applied during highlight states. |
| `base_scale` | number | `1` | Normal, non-highlight scale. |
| `big` | boolean | `false` | Internal flag indicating whether the highlight scaling is active. |
| `highlight` | boolean | `nil` | Internal flag tracking whether the LockHighlight state is active. |
| `ontilechangedfn` | function or nil | `nil` | Callback invoked when `tile` changes. |

## Main functions
### `LockHighlight()`
* **Description:** Activates a persistent highlight state, scaling the slot upward. Does nothing if already locked.
* **Parameters:** None.
* **Returns:** Nothing.

### `UnlockHighlight()`
* **Description:** Removes the persistent highlight and returns to the base state, or (if `big` is `true`) restores the large highlight. Reverses `LockHighlight`.
* **Parameters:** None.
* **Returns:** Nothing.

### `Highlight()`
* **Description:** Temporarily scales the slot up to `highlight_scale`. Does not persist beyond `DeHighlight` or focus loss.
* **Parameters:** None.
* **Returns:** Nothing.

### `DeHighlight()`
* **Description:** Scales the slot back to the base size if currently highlighted and not in `LockHighlight` mode.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnGainFocus()`
* **Description:** Called when the widget gains keyboard/controller focus. Triggers `Highlight()`.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnLoseFocus()`
* **Description:** Called when the widget loses focus. Triggers `DeHighlight()`.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetTile(tile)`
* **Description:** Replaces the current `tile` (content) with a new widget. If a `tile` was previously set, it is killed (removed). Manages draw order to ensure proper layering of `tile`, `label`, and `readonlyvisual`. Invokes the `ontilechangedfn` callback if set.
* **Parameters:** `tile` (Widget or nil) — The new content widget or `nil` to clear the slot.
* **Returns:** Nothing.

### `SetOnTileChangedFn(fn)`
* **Description:** Registers a callback that runs whenever `SetTile()` changes the `tile`.
* **Parameters:** `fn` (function or nil) — Function taking one argument: the new `tile` value (or `nil`).
* **Returns:** Nothing.

### `SetBGImage2(atlas, img, tint)`
* **Description:** Sets or updates the optional secondary background layer. Creates the image if it does not exist, or updates its texture. Removes it if `atlas` or `img` is `nil`. Adjusts draw order to ensure layers appear beneath `tile` and `label`.
* **Parameters:**  
  `atlas` (string or nil) — Texture atlas file path (e.g., `"images/ui.xml"`).  
  `img` (string or nil) — Image name inside the atlas (e.g., `"white.tex"`).  
  `tint` (table or nil) — Optional `{r, g, b, a}` color table passed to `SetTint`.
* **Returns:** Nothing.

### `SetLabel(msg, colour)`
* **Description:** Creates or updates the text label (e.g., for stack count). Removes the label if `msg` is `nil`.
* **Parameters:**  
  `msg` (string or nil) — Text to display. If `nil`, removes the label.  
  `colour` (table) — RGB(A) color table passed to `SetColour`.
* **Returns:** Nothing.

### `SetReadOnlyVisuals(enabled)`
* **Description:** Toggles a dark overlay to visually indicate a read-only slot (no interaction). Overlay is created or destroyed as needed; uses a fixed darkness scale.
* **Parameters:** `enabled` (boolean) — Whether to enable the read-only overlay.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls).
- **Pushes:** None (no `inst:PushEvent` calls).