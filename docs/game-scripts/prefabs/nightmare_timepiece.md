---
id: nightmare_timepiece
title: Nightmare Timepiece
description: Manages visual and state transitions of the Nightmare Timepiece based on the current nightmare phase in DST.
tags: [inventory, visual, world_state, item]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 46713099
system_scope: inventory
---

# Nightmare Timepiece

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `nightmare_timepiece` prefab represents an inventory item that visually reflects the current nightmare phase (e.g., calm, warn, wild, dawn). It uses world state listeners to update its animation and inventory icon dynamically. When held by a player, it marks them as a `nightmaretracker`, enabling them to observe the nightmare cycle. The component is not a standalone component but a full prefab definition—its behavior is implemented via core entity setup and event callbacks.

## Usage example
```lua
-- The nightmare timepiece is spawned as a prefab, not manually added as a component.
-- Example of how the game attaches it to a player:
inst.components.inventory:GiveItem(inst prefabs["nightmare_timepiece"])
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `transform`, `animstate`, `network`
**Tags:** Adds `nightmaretracker` to the holder when held; checks `inventory`, `inventoryitem`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_owner` | `GEntity?` | `nil` | The entity currently holding the timepiece. Used to track ownership and clean up state on removal. |
| `scrapbook_speechstatus` | `string` | `"WARN"` | Controls the speech bubble state in scrapbook UI. |
| `scrapbook_anim` | `string` | `"idle_1"` | Animation name used in the scrapbook view. |
| `scrapbook_specialinfo` | `string` | `"NIGHTMARETIMEPIECE"` | Identifier string for scrapbook info rendering. |

## Main functions
### `GetStatus(inst)`
* **Description:** Returns a string describing the current nightmare phase status (e.g., `"WARN"`, `"CALM"`, `"WANING"`), used by the `inspectable` component to populate UI text.
* **Parameters:** `inst` (`GEntity`) — the timepiece instance.
* **Returns:** `string` — one of: `"WARN"`, `"CALM"`, `"DAWN"`, `"NOMAGIC"`, `"WAXING"`, `"STEADY"`, or `"WANING"`.
* **Error states:** Returns `"NOMAGIC"` when nightmare phases are not active (`isnightmarewild`, `isnightmarewarn`, `isnightmarecalm`, `isnightmaredawn` are all false), and selects from waxing/steady/waning if `nightmaretimeinphase` is defined.

### `OnNightmarePhaseChanged(inst, phase)`
* **Description:** Updates the timepiece's animation and inventory icon to match the current nightmare phase (e.g., `"calm"`, `"warn"`, `"wild"`, `"dawn"`).
* **Parameters:**  
  - `inst` (`GEntity`) — the timepiece instance.  
  - `phase` (`string`) — current phase name (e.g., `"wild"`).  
* **Returns:** Nothing.  
* **Error states:** Falls back to `DEFAULT_STATE` (`anim="idle_1"`, `inventory="nightmare_timepiece"`) if `phase` is unknown.

### `topocket(inst, owner)`
* **Description:** Attaches the timepiece to a new owner, adding the `nightmaretracker` tag and setting up cleanup on removal. Only activates once per owner change.
* **Parameters:**  
  - `inst` (`GEntity`) — the timepiece instance.  
  - `owner` (`GEntity`) — entity that picked up the item.  
* **Returns:** Nothing.  
* **Error states:** Uses `GetGrandOwner()` to resolve indirect owners (e.g., if inside a container). Ensures idempotency by skipping if owner is unchanged.

### `toground(inst)`
* **Description:** Cleans up ownership state when the timepiece is dropped or the owner is removed. Removes the `nightmaretracker` tag and nullifies `_owner`.
* **Parameters:** `inst` (`GEntity`) — the timepiece instance.
* **Returns:** Nothing.
* **Error states:** No-op if `_owner` is `nil` or if the owner still holds the item (checked via `inventory:Has()`).

## Events & listeners
- **Listens to:**  
  - `"onputininventory"` — triggers `topocket()` when placed in an inventory.  
  - `"ondropped"` — triggers `toground()` when dropped.  
  - `"onremove"` — registered on owner; triggers `toground()` when the owner entity is destroyed.  
- **Pushes:** None directly.
- **World state listeners:**  
  - `"nightmarephase"` — triggers `OnNightmarePhaseChanged()` whenever the world’s nightmare phase changes.