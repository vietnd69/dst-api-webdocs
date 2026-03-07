---
id: hutch_fishbowl
title: Hutch Fishbowl
description: Manages the lifecycle, state, and respawn behavior of a Hutch-following item in the game world, including inventory interaction and persistent state across sessions.
tags: [inventory, respawn, leadership, prefab]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 81986746
system_scope: world
---

# Hutch Fishbowl

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `hutch_fishbowl` prefab represents an interactive inventory item that binds to and controls a `hutch` entity. When held in inventory, it periodically scans for a missing hutch and respawns it. When held, it uses the `inventoryitem`, `inspectable`, and `leader` components to manage its state, icon, and leadership over the spawned `hutch`. It supports persistent state saving and loading across game sessions.

The component logic is embedded directly in the prefab definition function (`fn`) and runs only on the master simulation (server), as indicated by `if not TheWorld.ismastersim then return inst end`.

## Usage example
```lua
-- This prefab is instantiated by the engine and should not be manually created.
-- However, a modder may interact with it as follows:

local fishbowl = SpawnPrefab("hutch_fishbowl")
-- Ensure it's bound to a hutch (triggered automatically on first spawn)
fishbowl.components.inventoryitem.owner = player
-- The fishbowl will respawn the hutch after 1 second if missing or lost
```

## Dependencies & tags
**Components used:** `inventoryitem`, `inspectable`, `leader`, `animstate`, `minimapentity`, `transform`, `network`, `physics`
**Tags added:** `hutch_fishbowl`, `irreplaceable`, `nonpotatable`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fishAlive` | string | `"hutch_fishbowl"` | Base icon name for alive state (modified by skin). |
| `fishDead` | string | `"hutch_fishbowl_dead"` | Base icon name for dead state (modified by skin). |
| `isFishAlive` | boolean | `true` | Indicates whether the associated hutch is currently alive (present). |
| `currentIcon` | string | `nil` | Currently active icon name, used for UI. |
| `respawntime` | number | `nil` | Absolute game time when respawn should occur. |
| `respawntask` | task | `nil` | Task reference for delayed respawn. |
| `fishalivetask` | task | `nil` | Task reference to revive the fishbowl after respawn delay. |
| `fixtask` | task | `nil` | Task reference for deferred hutch repair logic (runs after 1s). |

## Main functions
### `RefreshFishBowlIcon(inst)`
* **Description:** Updates the inventory item icon based on current state (`fishAlive`/`fishDead`) and applied skin (if any), via `ChangeImageName`.
* **Parameters:** `inst` (entity instance) — the fishbowl instance.
* **Returns:** Nothing.
* **Error states:** No side effects if skin name is missing — reverts to default icon.

### `FishAlive(inst, instant)`
* **Description:** Switches the fishbowl to the alive state, updates icon, and plays relevant animation (`revive` → `idle_loop` or immediate `idle_loop` if `instant`).
* **Parameters:**  
  - `inst` (entity) — the fishbowl instance.  
  - `instant` (boolean) — if `true`, plays animation immediately without transition.
* **Returns:** Nothing.

### `FishDead(inst, instant)`
* **Description:** Switches the fishbowl to the dead state, updates icon, and plays death animation (`die` → `dead` or immediate `dead` if `instant`).
* **Parameters:**  
  - `inst` (entity) — the fishbowl instance.  
  - `instant` (boolean) — if `true`, plays animation immediately.
* **Returns:** Nothing.

### `GetSpawnPoint(pt)`
* **Description:** Finds a valid walkable point near the fishbowl's position (within `SPAWN_DIST = 30`), avoiding holes via `NoHoles`.
* **Parameters:** `pt` (Vector3) — center point to search around.
* **Returns:** `Vector3?` — a valid spawn point, or `nil` if none found.

### `SpawnHutch(inst)`
* **Description:** Spawns a new `hutch` prefab at the calculated spawn point relative to the fishbowl, orientations it toward the fishbowl.
* **Parameters:** `inst` (entity) — the fishbowl instance.
* **Returns:** `entity?` — the newly spawned hutch, or `nil` on failure.
* **Error states:** Returns `nil` if no valid spawn point exists; does not fail fatally.

### `StopRespawn(inst)`
* **Description:** Cancels all pending respawn-related tasks (`respawntask`, `fishalivetask`) and resets associated timers.
* **Parameters:** `inst` (entity) — the fishbowl instance.
* **Returns:** Nothing.

### `RebindHutch(inst, hutch)`
* **Description:** Attaches leadership of an existing or provided hutch to this fishbowl. Activates the alive state and listens for hutch death to restart respawn.
* **Parameters:**  
  - `inst` (entity) — the fishbowl instance.  
  - `hutch` (entity?) — optional hutch entity; defaults to first entity with tag `"hutch"` if `nil`.
* **Returns:** `boolean` — `true` if binding succeeded, `false` otherwise.
* **Error states:** May return `nil` (implicitly) if hutch not found.

### `RespawnHutch(inst)`
* **Description:** Ensures a hutch exists by rebinding or spawning, resetting all respawn timers.
* **Parameters:** `inst` (entity) — the fishbowl instance.
* **Returns:** Nothing.

### `StartRespawn(inst, time)`
* **Description:** Schedules a respawn task (if `time > 0`) and transitions to dead state.
* **Parameters:**  
  - `inst` (entity) — the fishbowl instance.  
  - `time` (number?) — respawn delay in seconds; defaults to `0`.
* **Returns:** Nothing.

### `FixHutch(inst)`
* **Description:** Deferred repair function (runs after 1s) that attempts to rebind a hutch or re-initiate respawn if hutch is missing and owner exists.
* **Parameters:** `inst` (entity) — the fishbowl instance.
* **Returns:** Nothing.

### `OnPutInInventory(inst)`
* **Description:** Hooks into `inventoryitem`'s put-in-inventory event; schedules a deferred hutch check/repair.
* **Parameters:** `inst` (entity) — the fishbowl instance.
* **Returns:** Nothing.

### `OnSave(inst, data)`
* **Description:** Stores remaining respawn time in `respawntimeremaining` if respawn is pending.
* **Parameters:**  
  - `inst` (entity) — the fishbowl instance.  
  - `data` (table) — save data table.
* **Returns:** Nothing.

### `OnLoad(inst, data)`
* **Description:** Restores respawn state from save data; revives if respawn complete, or schedules continuation of respawn timer.
* **Parameters:**  
  - `inst` (entity) — the fishbowl instance.  
  - `data` (table?) — loaded data table or `nil`.
* **Returns:** Nothing (early-exits if `data == nil`).

### `GetStatus(inst)`
* **Description:** Provides inspect status text for UI (e.g., `inspector` mod or debug UI).
* **Parameters:** `inst` (entity) — the fishbowl instance.
* **Returns:** `"WAITING"` if fish is dead (`not inst.isFishAlive`), otherwise `nil`.

## Events & listeners
- **Listens to:**  
  - `"death"` — on the bound hutch (via `inst:ListenForEvent`), triggers respawn via `StartRespawn`.  
  - `"onremove"` — on leader (via `follower.lua`’s listener, handled in `SetLeader`), stops leashing and loyalty tasks (external component).
- **Pushes:**  
  - `"leaderchanged"` — fired by `follower.lua` when leader is set or changed (external event).  
  - `"imagechange"` — fired by `inventoryitem:ChangeImageName()` when icon changes.  
  - `"death"` — pushed externally on hutch death; not directly by fishbowl, but triggers responses.

