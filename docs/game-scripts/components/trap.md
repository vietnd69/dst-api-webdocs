---
id: trap
title: Trap
description: Manages trap logic including setting, baiting, springing, harvesting, and loot generation for traps in the game.
tags: [combat, trap, loot, inventory, ai]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 22cae9e1
system_scope: entity
---
# Trap

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Trap` is an entity component that implements full trap lifecycle management: setting the trap, accepting bait, detecting and springing on valid targets, storing trapped entities as loot, handling spoilage over time, and harvesting to release loot. It integrates with `timer`, `bait`, `inventory`, `lootdropper`, `perishable`, `health`, `eater`, and `finiteuses` components, and supports networked save/load via `OnSave`/`OnLoad`. Traps can be used by players or AI to capture small creatures for resource farming.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("trap")
inst.components.trap:Set()
inst.components.trap:SetBait(SpawnPrefab("worms"))
inst.components.trap:SetOnHarvestFn(function(trap) print("Trap harvested!") end)
```

## Dependencies & tags
**Components used:** `timer`, `perishable`, `lootdropper`, `inventory`, `inventoryitem`, `health`, `eater`, `finiteuses`, `bait`  
**Tags added/removed:** Adds/Removes `canbait`, `trapsprung` depending on state  
**Tags checked:** `smallcreature`, `INLIMBO`, `untrappable`, `mole`, `baitstealer`, `edible_*`, `molebait`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `bait` | `entity` or `nil` | `nil` | The bait entity currently placed in the trap. |
| `issprung` | boolean | `false` | Whether the trap has been sprung (and is no longer active). |
| `isset` | boolean | `false` | Whether the trap is active and waiting for a target. |
| `range` | number | `1.5` | Detection radius around the trap for targets. |
| `targettag` | string | `"smallcreature"` | Tag required (in addition to other checks) for a valid target. |
| `checkperiod` | number | `0.75` | Seconds between target checks when trap is set. |
| `onharvest` | function or `nil` | `nil` | Callback triggered on trap harvest. |
| `onbaited` | function or `nil` | `nil` | Callback triggered when bait is added. |
| `onspring` | function or `nil` | `nil` | Callback triggered when trap springs (args: trap, target, bait). |
| `target` | `entity` or `nil` | `nil` | The most recently detected target (valid only until springing). |
| `lootprefabs` | `table` or `nil` | `nil` | List of prefabs to drop on harvest. |
| `lootdata` | any or `nil` | `nil` | Custom data saved for `restoredatafromtrap()` on harvested items. |
| `numsouls` | number or `nil` | `nil` | Number of souls to award on harvest if trapped alive. |
| `starvednumsouls` | number or `nil` | `nil` | Number of souls to award on spoilage completion if starved. |
| `starvedlootprefabs` | `table` or `nil` | `nil` | Loot generated when the trapped item spoils completely. |

## Main functions
### `Set()`
* **Description:** Activates the trap for detection. Resets state (except bait is removed) and starts periodic target scanning.
* **Parameters:** None.
* **Returns:** Nothing.

### `Reset(sprung)`
* **Description:** Clears all trap state (loot, target, timers, bait). If `sprung` is `true`, marks trap as permanently sprung (used on spoilage failure).
* **Parameters:** `sprung` (boolean, optional) — forces `issprung = true` even if trap is idle.
* **Returns:** Nothing.

### `SetBait(bait)`
* **Description:** Attaches a bait entity to the trap. Removes any existing bait first. Adds `bait` to trap’s loot on harvest and removes bait after springing or spoilage.
* **Parameters:** `bait` (`entity` or `nil`) — The bait entity to place in the trap.
* **Returns:** Nothing.

### `RemoveBait()`
* **Description:** Safely clears `self.bait`, resetting related bait component references and animation offsets.
* **Parameters:** None.
* **Returns:** Nothing.

### `IsBaited()`
* **Description:** Returns `true` if the trap is set, not sprung, and has bait attached.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if baited and ready.

### `IsFree()`
* **Description:** Returns `true` if no bait is currently attached (trap may or may not be set).
* **Parameters:** None.
* **Returns:** `boolean` — `true` if free of bait.

### `HasLoot()`
* **Description:** Returns `true` if the trap currently holds loot (i.e., a trapped entity or generated loot list).
* **Parameters:** None.
* **Returns:** `boolean` — `true` if loot is pending harvest.

### `IsSprung()`
* **Description:** Returns `true` if the trap has been sprung (even if still holding loot).
* **Parameters:** None.
* **Returns:** `boolean` — `true` if the trap has sprung.

### `Harvest(doer)`
* **Description:** Completes trap harvesting: drops loot, awards souls, handles perishable updates, and resets or re-arms the trap depending on finiteuses count.
* **Parameters:** `doer` (`entity` or `nil`) — The actor harvesting the trap (for soul events).
* **Returns:** Nothing.
* **Error states:** No effect if trap is not `issprung`.

### `StartStarvation()`
* **Description:** Initializes the spoilage timer (based on trapped entity’s `perishremainingtime` or default), and precomputes starved loot and soul counts.
* **Parameters:** None.
* **Returns:** Nothing.

### `StopStarvation()`
* **Description:** Cancels the spoilage timer and clears `starvedlootprefabs`.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnTrappedStarve()`
* **Description:** Called when the spoilage timer completes. Drops starved loot (spoiled food or configured prefabs), awards souls, and resets the trap.
* **Parameters:** None.
* **Returns:** Nothing.

### `DoTriggerOn(target)`
* **Description:** Triggers the spring event on the given `target`, pushes `springtrap`/`safelydisarmedtrap` events, and stops detection updates.
* **Parameters:** `target` (`entity`) — The entity to spring on.
* **Returns:** Nothing.

### `DoSpring()`
* **Description:** Finalizes spring logic: saves loot and soul counts, generates starvation data, removes/bait or captures new bait, fires `onspring` callback, and marks trap as sprung.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Returns a serializable state table and an entity-GUID dependency list for saving.
* **Parameters:** None.
* **Returns:** 
  * Table with keys `sprung`, `isset`, `bait`, `loot`, `souls`, `starvedsouls`, `starvedloot`, `lootdata`.
  * Array containing bait GUID (if any) for save dependency resolution.
* **Error states:** Bait GUID is included but not saved directly in the first table (handled via dependency array).

### `OnLoad(data)`
* **Description:** Loads trap state from saved data; supports legacy string-type `loot` and `starvedloot`. Restarts update task if trap was set.
* **Parameters:** `data` (table) — The saved state table.
* **Returns:** Nothing.

### `LoadPostPass(newents, savedata)`
* **Description:** Restores the bait entity reference after `newents` is populated during map load.
* **Parameters:** 
  * `newents` (table) — Map of GUIDs to entity objects.
  * `savedata` (table) — The parsed save data, containing `bait` GUID.
* **Returns:** Nothing.

### `SetOnHarvestFn(fn)`
* **Description:** Assigns a callback to run when the trap is harvested.
* **Parameters:** `fn` (function) — Callback with signature `fn(trap)`.
* **Returns:** Nothing.

### `SetOnSpringFn(fn)`
* **Description:** Assigns a callback to run when the trap springs.
* **Parameters:** `fn` (function) — Callback with signature `fn(trap, target, bait)`.
* **Returns:** Nothing.

### `SetOnBaitedFn(fn)`
* **Description:** Assigns a callback to run when bait is added.
* **Parameters:** `fn` (function) — Callback with signature `fn(trap, bait)`.
* **Returns:** Nothing.

### `BaitTaken(target)`
* **Description:** Invoked when a `baitstealer` or matching tag entity takes bait; triggers spring if tag matches.
* **Parameters:** `target` (`entity`) — The entity that took the bait.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a human-readable string summarizing current state (e.g., `"SET! Bait:worms Target:rabbit Loot:rabbit"`).
* **Parameters:** None.
* **Returns:** `string` — Debug summary.

### `StartUpdate()`, `StopUpdating()`, `OnEntitySleep()`, `OnEntityWake()`
* **Description:** Helper methods to manage the periodic target-check task, including reduced frequency during sleep.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `timerdone` — triggers `OnTrappedStarve()` when `foodspoil` timer finishes.
- **Listens to:** `ondropped` — calls `Set()` to re-arm trap after being dropped.
- **Listens to:** `onpickup` — calls `Reset()` to clear loot when picked up.
- **Pushes:** `springtrap` — fired when trap springs (with `{trap = self.inst}` and optionally `{loading = true}`).
- **Pushes:** `harvesttrap` — fired when trap is harvested (with `{doer = doer, sprung = true}`).
- **Pushes:** `safelydisarmedtrap` — fired when trap springs on an untrappable entity (with `{trap = self.inst}`).
- **Pushes (via target):** `trapped` — fired on the trapped entity (with `{trap = self.inst}`).
- **Pushes (via target):** `ontrapped` — fired on the trapped entity (with `{trapper = self.inst, bait = self.bait}`).
- **Pushes (via target or world):** `harvesttrapsouls` or `starvedtrapsouls` — awards souls on harvest or spoilage.
