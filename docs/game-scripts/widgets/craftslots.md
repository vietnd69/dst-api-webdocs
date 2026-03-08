---
id: craftslots
title: Craftslots
description: Manages a dynamic set of crafting interface slots, handling visibility, popup enabling, and slot-specific operations for the crafting HUD.
tags: [ui, crafting, interface]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 29298fc1
system_scope: ui
---

# Craftslots

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`CraftSlots` is a UI widget responsible for managing a dynamic collection of `CraftSlot` instances, typically used in crafting interfaces (e.g., the inventory crafting tab). It inherits from `Widget` and provides high-level operations such as adjusting the number of visible slots, showing/hiding all slots, enabling popup tooltips, refreshing slot contents, and opening/closing individual slots programmatically. It acts as a container and coordinator for `CraftSlot` children without managing internal state beyond slot references and visibility control.

## Usage example
```lua
local craftslots = CraftSlots(4, player)
player:AddChild(craftslots)
craftslots:SetNumSlots(3) -- show only first 3 slots
craftslots:EnablePopups()
craftslots:Refresh()
craftslots:Open(2)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `nil` | The entity (typically a player) that owns the crafting context for the slots. |
| `slots` | table of CraftSlot | `{}` | Array of `CraftSlot` instances managed by this widget. |
| `CRAFTING_ATLAS` | string | value of `"hud_atlas"` or `HUD_ATLAS` | The UI atlas used for slot texture rendering. |

## Main functions
### `SetNumSlots(num)`
* **Description:** Adjusts the number of visible slots to `num`. If `num` is greater than or equal to the current number of slots, all slots are shown. Otherwise, all slots are hidden first, then only the first `num` slots are shown.
* **Parameters:** `num` (number) – desired number of visible slots.
* **Returns:** Nothing.

### `HideAll()`
* **Description:** Hides all managed `CraftSlot` instances.
* **Parameters:** None.
* **Returns:** Nothing.

### `ShowAll()`
* **Description:** Shows all managed `CraftSlot` instances.
* **Parameters:** None.
* **Returns:** Nothing.

### `EnablePopups()`
* **Description:** Enables popup tooltips on all managed `CraftSlot` instances.
* **Parameters:** None.
* **Returns:** Nothing.

### `Refresh()`
* **Description:** Calls `Refresh()` on every managed slot, typically to update visual state (e.g., icon, count, crafting availability) based on current inventory or recipe state.
* **Parameters:** None.
* **Returns:** Nothing.

### `Open(idx)`
* **Description:** Opens the slot at index `idx` (e.g., to present its crafting recipe UI). No-op if `idx` is out of bounds.
* **Parameters:** `idx` (number) – 1-based index of the slot to open.
* **Returns:** Nothing.
* **Error states:** Silent no-op if `idx <= 0` or `idx > #self.slots`.

### `LockOpen(idx)`
* **Description:** Permanently locks the slot at index `idx` in the open state (prevents it from closing automatically, e.g., on UI interaction). No-op if `idx` is out of bounds.
* **Parameters:** `idx` (number) – 1-based index of the slot to lock open.
* **Returns:** Nothing.
* **Error states:** Silent no-op if `idx <= 0` or `idx > #self.slots`.

### `Clear()`
* **Description:** Clears all managed slots (e.g., removes recipe references, resets icons).
* **Parameters:** None.
* **Returns:** Nothing.

### `CloseAll()`
* **Description:** Closes all currently open slots.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
None identified