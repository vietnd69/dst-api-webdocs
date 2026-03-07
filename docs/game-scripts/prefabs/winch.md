---
id: winch
title: Winch
description: Manages the mechanical winch structure that can lower and raise a claw to salvage submerged objects, while interacting with boat physics and inventory systems.
tags: [structure, salvage, boat, inventory, physics]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d9f862c4
system_scope: environment
---

# Winch

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `winch` component implements the logic for the heavy structure placed on boats to deploy and retrieve a claw for underwater salvage. It orchestrates the lowering and raising animation and state transitions, interacts with the `winchtarget` component on salvageable objects, modifies boat physics via `boatdrag`, and manages inventory (via `shelf`, `inventory`) to hold retrieved items or be loaded with payloads. It also integrates with state saving (`OnSave`/`OnLoad`), haunt mechanics, and burnable behavior.

## Usage example
```lua
local winch = SpawnPrefab("winch")
winch.Transform:SetPosition(x, y, z)
winch.components.activatable:CanActivate(player) -- check if winch is ready
winch.components.activatable:DoActivate(player) -- trigger lowering the claw
winch.components.inventory:GetItemInSlot(1) -- check if item is currently held/loaded
```

## Dependencies & tags
**Components used:** `inspectable`, `winch`, `heavyobstacleusetarget`, `activatable`, `boatdrag`, `lootdropper`, `workable`, `inventory`, `shelf`, `hauntable`, `burnable`, `submersible`, `pumpkincarvable`, `symbolswapdata`, `talker`  
**Tags added:** `structure`  
**Tags checked:** `winch_ready`, `inactive`, `burnt`, `fire`, `lowered_ground`, `takeshelfitem`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `sounds` | table | `sounds` (local) | Sound event names for various winch actions (e.g., `place`, `reel_slow`, `claw_hit_bottom`). |
| `_most_recent_interacting_player` | entity | `nil` | Tracks the last player who activated the winch for announcements. |
| `_boat_drag_task` | task | `nil` | Task that removes boat drag after winch claw has finished operation. |
| `_winch_update_task` | task | `nil` | Periodic task used during lowering to check for nearby salvageables. |
| `pumpkincarving_fx` | entity | `nil` | FX prefab used to display pumpkin carving visuals when a carved item is loaded. |

## Main functions
### `OnFullyLowered(inst)`
*   **Description:** Callback triggered when the winch claw reaches the ocean floor. Attempts to find and salvage a nearby `winchtarget` entity, adds the salvaged item to inventory, and starts raising the claw with an appropriate delay based on success.
*   **Parameters:** `inst` (entity) — the winch instance.
*   **Returns:** Nothing.
*   **Error states:** Silent if no salvageable entity is in range or the salvageable's `winchtarget:Salvage()` returns `nil`.

### `OnLoweringUpdate(inst)`
*   **Description:** Periodic callback during the lowering animation. Checks for proximity of a `winchtarget` and triggers immediate retrieval if the line length matches or exceeds the target’s depth.
*   **Parameters:** `inst` (entity) — the winch instance.
*   **Returns:** Nothing.

### `OnFullyRaised(inst)`
*   **Description:** Callback triggered when the winch fully retracts. Updates `winch_ready` state, `shelf.cantakeitem`, and `activatable.inactive` flags accordingly based on whether an item is held.
*   **Parameters:** `inst` (entity) — the winch instance.
*   **Returns:** Nothing.

### `OnStartLowering(inst)`
*   **Description:** Starts the periodic update task during lowering to monitor salvage targets.
*   **Parameters:** `inst` (entity) — the winch instance.
*   **Returns:** Nothing.

### `OnStartRaising(inst)`
*   **Description:** Sets the raising speed multiplier based on whether the winch holds an item, and cancels any ongoing update tasks.
*   **Parameters:** `inst` (entity) — the winch instance.
*   **Returns:** Nothing.

### `OnActivate(inst, doer)`
*   **Description:** Activation callback for the winch. If on a boat, initiates lowering. If on land (e.g., anchored), pushes a `claw_interact_ground` event. Updates the most recent interacting player.
*   **Parameters:** `inst` (entity), `doer` (entity) — the actor activating the winch.
*   **Returns:** `true` — success.

### `CanActivate(inst, doer)`
*   **Description:** Predicate determining whether the winch can be activated. Only allows activation if the `winch_ready` tag is present.
*   **Parameters:** `inst` (entity), `doer` (entity) — the actor.
*   **Returns:** `true` if `inst:HasTag("winch_ready")`; otherwise `false`.

### `MakeEmpty(inst)`
*   **Description:** Resets internal state and visuals after an item is removed (e.g., during unload or removal). Clears `shelf.cantakeitem`, resets `winch_ready` and `activatable.inactive`, and clears override symbols.
*   **Parameters:** `inst` (entity) — the winch instance.
*   **Returns:** Nothing.

### `Unload(inst)`
*   **Description:** Initiates unloading of the held item. After a delay, drops the item, plays a splash sound, and marks it as `force_no_repositioning` if it has `submersible` so it sinks properly.
*   **Parameters:** `inst` (entity) — the winch instance.
*   **Returns:** `true` if unloading was initiated, `false` if `shelf.cantakeitem` was `false`.

### `OnHaunt(inst, haunter)`
*   **Description:** Handles haunting logic. If the winch is ready, unburnt, and empty, has a 50% chance to automatically activate the winch upon haunt.
*   **Parameters:** `inst` (entity), `haunter` (entity) — the haunting actor.
*   **Returns:** Nothing.

### `OnUseHeavy(inst, doer, heavy_item)`
*   **Description:** Callback when a heavy item is used on the winch (via `heavyobstacleusetarget`). Removes item from actor inventory and places it into winch inventory, then triggers `OnFullyRaised` logic.
*   **Parameters:** `inst` (entity), `doer` (entity), `heavy_item` (entity) — item being loaded.
*   **Returns:** `true` — success if `heavy_item` is non-nil.

### `GetHeldItem(inst)`
*   **Description:** Helper that returns the item currently held in slot `1` of the winch’s inventory, or `nil`.
*   **Parameters:** `inst` (entity) — the winch instance.
*   **Returns:** `entity?` — held item or `nil`.

### `dropitems(inst)`
*   **Description:** Drops the held item if any, pushes `onsink` event if not a shelf-item and platform exists, then returns the item.
*   **Parameters:** `inst` (entity) — the winch instance.
*   **Returns:** `entity?` — dropped item or `nil`.

### `GetCurrentWinchDepth(inst)`
*   **Description:** Determines the effective depth at the winch’s position based on ocean tile info, clamped to a minimum (`PERCEIVED_DEPTH_MINIMUM = 2.8`) to ensure animations play fully at shallow depths.
*   **Parameters:** `inst` (entity) — the winch instance.
*   **Returns:** `number` — clamped depth value.

### `raise_claw(inst, delay)`
*   **Description:** Schedules claw raising after `delay` seconds. Performs a final check and announcement if no target was salvaged.
*   **Parameters:** `inst` (entity), `delay` (number?, default: `0`) — time before raising starts.
*   **Returns:** Nothing.

### `turn_on_boat_drag(inst, boat, duration)`
*   **Description:** Attaches boat drag to the winch’s parent boat and schedules a task to remove it after `duration`.
*   **Parameters:** `inst` (entity), `boat` (entity?), `duration` (number?).
*   **Returns:** Nothing.

### `turn_off_boat_drag(inst)`
*   **Description:** Removes boat drag from the winch’s parent boat and cancels the associated drag removal task.
*   **Parameters:** `inst` (entity) — the winch instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `onburnt` — triggers `onburnt` handler to drop items, remove components, and clear SG.
  - `onbuilt` — plays placement sound and animation.
  - `ondeconstructstructure` — drops held items.
  - `onremove` — drops held items.
  - `itemget` — handles item being placed on winch (`shelf`/`symbolswap`/`pumpkincarvable` handling).
  - `itemlose` — calls `MakeEmpty` when item is removed.
- **Pushes:**
  - `workinghit` — fired during hammering updates.
  - `onactivated` — fired upon successful activation (via `activatable`).
  - `on_salvaged` — fired on salvaged item.
  - `onsink` — pushed on dropped item (if applicable).
  - `CHEVO_heavyobject_winched` — event for achievements when a heavy object is winched.
  - `claw_interact_ground` — fired when winch is activated on land.

