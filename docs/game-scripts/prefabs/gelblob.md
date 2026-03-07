---
id: gelblob
title: Gelblob
description: Manages the gelblob enemy's lifecycle, including size progression, player suspension/eating mechanics, loot dropping, and chunk-based reabsorption.
tags: [combat, ai, boss, inventory, loot]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 80e2b2b4
system_scope: entity
---

# Gelblob

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `gelblob` prefab implements the Gelblob boss enemy. It manages its health-based size progression (small/medium/big), proximity tracking of nearby entities, suspension and digestion of players, item absorption for growth, and dynamic chunk generation when shrinking. It also handles networked state for client-side FX and persistence synchronization.

This component integrates closely with the `health`, `combat`, `inventory`, `lootdropper`, `planardamage`, and `sanityaura` components. It defines multiple related prefabs (`gelblob`, `gelblob_back_fx`, `gelblob_small_fx`, `gelblob_item_fx`, and `gelblobspawningground`) to handle different aspects of the entity.

## Usage example
```lua
-- Create the main Gelblob instance
local inst = SpawnPrefab("gelblob")

-- Manually trigger growth/absorption if needed
if inst and inst.components and inst.Absorb then
    inst:Absorb()
end

-- Spawn a gelblob chunk manually (e.g., after shrinking)
local chunk = SpawnPrefab("gelblob_small_fx")
chunk.components.entitytracker:TrackEntity("mainblob", inst)
chunk:Toss(dist, angle)
```

## Dependencies & tags
**Components used:** `health`, `combat`, `planarentity`, `planardamage`, `inspectable`, `inventory`, `lootdropper`, `sanityaura`, `entitytracker`, `timer`.

**Tags added by main entity:** `blocker`, `shadow_aligned`, `stronggrip`, `equipmentmodel`.

**Tags added by small chunks (`gelblob_small_fx`):** `canbebottled`.

**Tags added by back FX (`gelblob_back_fx`) and item FX (`gelblob_item_fx`):** `FX`.

**Tags added by spawner (`gelblobspawningground`):** `gelblobspawningground`, `NOBLOCK`, `NOCLICK`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.size` | string | `"_big"` | Current size tag (`"_small"`, `"_med"`, `"_big"`), affects animation and behavior. |
| `inst.level` | number | `NUM_LEVELS` (`12`) | Health level index (0 to 12) representing growth stage. |
| `inst.leftvars` | number | `0` | Bitmask representing which left-side visual props are active. |
| `inst.rightvars` | number | `0` | Bitmask representing which right-side visual props are active. |
| `inst._contact_radius` | number | `1.2` (main) / `0.4` (chunk) | Distance required to attach to a target. |
| `inst._uncontact_radius` | number | `1.35` (main) / `1` (chunk) | Distance at which an attachment breaks. |
| `inst._suspend_radius` | number | `0.5` | Max distance to trigger suspension on players. |
| `inst._suspendedplayer` | EntityRef | `nil` | Reference to the currently suspended (eaten) player. |
| `inst._digestcount` | number | `0` | Number of digest hits dealt while suspending. |
| `inst._targets` | table | `{}` | Map of nearby entities currently attached (entity → FX). |
| `inst._untargets` | table | `{}` | Temporary table used during proximity updates. |
| `inst._suspendtask` | TaskHandle | `nil` | Periodic task handling digestion and equipment theft. |
| `inst.despawning` | boolean | `false` | Set when the blob is being removed via `DoDespawn`. |
| `inst.persists` | boolean | `true` (main), `false` (FX) | Determines persistence in world save/load. |

## Main functions
### `Absorb()`
*   **Description:** Increases the blob's health and level, triggering size-up state transitions (e.g., `grow_med`, `grow_big`). Does nothing if the blob is dead.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Early return if `inst.components.health:IsDead()` is `true`.

### `OnContactChanged(contacted, uncontacted)`
*   **Description:** Handles state changes when contact state with nearby entities changes. Triggers the `"jiggle"` event on the stategraph if contact changed.
*   **Parameters:** `contacted` (boolean) – whether new entities were attached; `uncontacted` (boolean) – whether existing attachments were lost.
*   **Returns:** Nothing.

### `DoDespawn()`
*   **Description:** Kills the blob (via `health:Kill()`) and clears its loot table so it drops nothing. Sets `inst.despawning` to `true`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SuspendItem(item)`
*   **Description:** Drops all inventory items, then equips the given item. Releases any suspended player first.
*   **Parameters:** `item` (Entity) – the item to equip.
*   **Returns:** Nothing.

### `ReleaseSuspended(explode)`
*   **Description:** Ends suspension of the current player, triggers "spitout" and "exit_gelblob" events, optionally dealing self-damage and playing sound if `explode` is `true`.
*   **Parameters:** `explode` (boolean) – whether to detonate the blob upon release.
*   **Returns:** Nothing.

### `SetLifespan(lifespan)`
*   **Description (Small chunks only):** Starts a `"lifespan"` timer. When the timer expires, the chunk will vanish.
*   **Parameters:** `lifespan` (number) – duration in seconds.
*   **Returns:** Nothing.

### `Toss(dist, angle)`
*   **Description (Small chunks only):** Launches the chunk with physics velocity, plays animation, and cancels all timers/tasks. Called when spawning from shrinking.
*   **Parameters:** `dist` (number) – distance magnitude to toss; `angle` (number) – direction in radians.
*   **Returns:** Nothing.

### `ReleaseFromBottle()`
*   **Description (Small chunks only):** Simulates extraction from a bottle (e.g., by Biofuel Ammo Affliction) — plays animation and wakes up proximity logic.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ReleaseFromAmmoAfflicted()`
*   **Description (Small chunks only):** Special release logic when exiting the ammo-affliction state; marks the chunk as un-bottleable and makes it non-persistent.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `KillFX(quick)`
*   **Description (Small chunks only):** Destroys the FX blob. If `quick` is `true`, plays a "splash" animation before removal; otherwise calls `ErodeAway`.
*   **Parameters:** `quick` (boolean) – whether to use instant removal FX.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `healthdelta` – handled by `OnHealthDelta` to trigger size reduction/shrink effects.
  - `equip` – handled by `OnEquip` to manage visual symbols (e.g., `"swap_object"`, `"backpack"`).
  - `unequip` – handled by `OnUnequip` to clear visual symbols.
  - `dropitem` – handled by `OnDropItem` to spawn item splash FX.
  - `playersuspended` – handled by `OnPlayerSuspended` to begin eating a player.
  - `suspendedplayerdied` – handled by `OnSuspendedPlayerDied` to clean up after a suspended player dies.
  - `death` – handled by `OnDeath` to drop loot, cleanup, and remove/destroy entity.
  - `"startlongaction"` (on small chunks) – handled by `OnStartLongAction` to track collectors during AI actions.
  - `"timerdone"` (on small chunks) – handled by `Small_OnTimerDone` to remove chunks after lifespan expires.
  - `"onremove"` (on entities and FX) – used to clean up tracking tables andFX.

- **Pushes:**  
  - `"spitout"` – on the suspended player (see `ReleaseSuspended`).
  - `"exit_gelblob"` – on the suspended player to signal successful release.
  - `"suspended"` – on players when they enter the suspend radius.
  - `"abouttospit"` – on the suspended player before spitting.
  - `"jiggle"` – stategraph event during digest or absorption.
  - `"ms_registergelblobspawningground"` – sent by the spawner entity.
  - `"entity_droploot"` – fired by `DropLoot`.