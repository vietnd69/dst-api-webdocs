---
id: pocketwatch_portal
title: Pocketwatch Portal
description: Manages the creation and lifecycle of pocketwatch-based teleportation portals, including marking recall points and spawning portal entrance/exit pairs for inter- and intra-world travel.
tags: [teleportation, inventory, world, recall]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: dce9a2b8
system_scope: world
---

# Pocketwatch Portal

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`pocketwatch_portal` is a player-held item prefab that enables recall teleportation. When used, it either marks the player's current position (if unmarked) or spawns a two-part portal system (entrance and exit) for teleporting back to the marked location. It integrates with several components to handle marking, recharge management, recall logic, and network synchronization for portals. It relies heavily on `PocketWatchCommon`, `teleporter`, `recallmark`, and `rechargeable`.

## Usage example
```lua
local inst = SpawnPrefab("pocketwatch_portal")
inst.components.recallmark:MarkPosition(10, 20, 30) -- marks a recall point
inst.components.rechargeable:SetCharge(0) -- discharges it
inst.components.pocketwatch.inactive = false -- marks as active
```

## Dependencies & tags
**Components used:** `inventoryitem`, `recallmark`, `rechargeable`, `pocketwatch`, `inspectable`, `teleporter`, `timer`, `talker`, `sanity`, `positionalwarp`, `container`, `inventory`.  
**Tags:** Added/removed dynamically on entity, includes `FX`, `INLIMBO`, `ignorewalkableplatforms`, `CLASSIFIED`, `pocketwatchcaster`, `nowormholesanityloss` for internal logic; `pocketwatch_portal` and variants.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `queued_close` | boolean | `false` | Tracks if the portal entrance has been scheduled for delayed removal after teleporting finishes. Used only on `pocketwatch_portal_entrance`. |

## Main functions
### `DoCastSpell(inst, doer, target, pos)`
*   **Description:** Core logic for activating the pocketwatch. If recall is marked, spawns entrance and exit portal pair and transfers charge from old watch if used in crafting; otherwise marks current position. Handles shard unavailability and inventory slot replacement.
*   **Parameters:**  
    - `inst` (`Entity`) – The pocketwatch instance.  
    - `doer` (`Entity`) – The entity using the watch (typically a player).  
    - `target` (`Entity`) – Unused in this function.  
    - `pos` (`Vector3`) – Position used for fallback placement if needed.  
*   **Returns:**  
    - `true` on successful recall mark or portal spawn.  
    - `false, "SHARD_UNAVAILABLE"` if marked position belongs to an unavailable shard.  
    - `false, reason?` if marking failed.  
*   **Error states:** Returns early with failure if shard is unavailable; otherwise fails silently if no walkable offset found for portal entrance.

### `SpawnExit(inst, worldid, x, y, z)`
*   **Description:** Configures the portal entrance's teleporter to target either an existing portal exit in the same world or a remote world via migration data. Creates the exit prefab if local.
*   **Parameters:**  
    - `inst` (`Entity`) – The portal entrance instance.  
    - `worldid` (`string?`) – Target world ID; if nil or current shard, local exit is spawned.  
    - `x`, `y`, `z` (`number`) – Destination coordinates.  
*   **Returns:** Nothing.
*   **Error states:** None explicitly handled; reliance on `SpawnPrefab` success.

### `CloseEntrance(inst)`
*   **Description:** Closes and removes the portal entrance after teleporting completes or a timeout. Animates the end state, kills loop SFX, fades light out, and deletes child overlays/underlays.
*   **Parameters:** `inst` (`Entity`) – The portal entrance instance.  
*   **Returns:** Nothing.
*   **Error states:** Defers removal if teleport is still in progress (`IsBusy()`), scheduling via `"doneteleporting"` event.

### `OnActivate(inst, doer)`
*   **Description:** Side effects applied when a player activates the portal entrance. Silences the player, and applies sanity loss unless they have specific tags.
*   **Parameters:**  
    - `inst` (`Entity`) – The portal entrance instance.  
    - `doer` (`Entity`) – The player using the portal.  
*   **Returns:** Nothing.
*   **Error states:** None; always performs sanity change if tags absent.

### `GetStatus(inst)`
*   **Description:** Determines the status of the portal entrance for inspection (e.g., in UI tooltips). Returns `"DIFFERENTSHARD"` if the target is in another shard.
*   **Parameters:** `inst` (`Entity`) – The portal entrance instance.  
*   **Returns:** `"DIFFERENTSHARD"` (string) if `migration_data` is set; otherwise `nil`.  
*   **Error states:** None.

## Events & listeners
- **Listens to:**  
  - `"timerdone"` – Triggers portal closure, SFX, and light state changes based on timer name (`"closeportal"`, `"start_loop_sfx"`, `"turn_on_light"`).  
  - `"lightdirty"` (client) – Updates light frame and radius on non-master.  
  - `"doneteleporting"` – After teleport completes, calls `CloseExit` or delays if busy.  
  - `"onremove"` (on portal exit/entrance) – Cleans up the paired portal if either is removed.  
- **Pushes:**  
  - `"lightdirty"` – Broadcasts light frame changes to clients (via `net_smallbyte`, `net_bool`).