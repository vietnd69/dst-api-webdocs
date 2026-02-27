---
id: trap
title: Trap
description: Manages trap logic including setting, baiting, triggering, looting, and state persistence for traps in the game world.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 22cae9e1
---

# Trap

## Overview
The `Trap` component governs the behavior of static traps in the game: it handles setting the trap, accepting bait, detecting and capturing eligible targets within range, managing spring logic (including loot generation and starvation timers), and persisting state across saves. It interacts with the Entity Component System by attaching to a trap entity, adding/removing tags, listening for world/player events, and coordinating with other components like `timer`, `health`, `inventoryitem`, and `lootdropper`.

## Dependencies & Tags
- **Requires:** `timer` component (added if missing on initialization)
- **Listens to events:** `timerdone`, `ondropped`, `onpickup`
- **Adds/removes tags:**  
  - Adds `"canbait"` when trap is set and has no bait  
  - Adds `"trapsprung"` when trap is sprung  
  - Removes both tags on removal from entity or state reset

## Properties

| Property         | Type      | Default Value | Description |
|------------------|-----------|---------------|-------------|
| `inst`           | `Entity`  | —             | The entity instance the component is attached to. |
| `bait`           | `Entity?` | `nil`         | The bait item currently placed in the trap (if any). |
| `issprung`       | `boolean` | `false`       | Whether the trap has been triggered. |
| `isset`          | `boolean` | `false`       | Whether the trap is currently active (set and baited, waiting for a target). |
| `range`          | `number`  | `1.5`         | Radius (in tiles) around the trap to scan for targets. |
| `targettag`      | `string`  | `"smallcreature"` | Tag used to identify eligible target entities. |
| `checkperiod`    | `number`  | `0.75`        | Interval (in seconds) between target checks. |
| `onharvest`      | `function?` | `nil`       | Callback invoked when the trap is harvested. |
| `onbaited`       | `function?` | `nil`       | Callback invoked when bait is placed in the trap. |
| `onspring`       | `function?` | `nil`       | Callback invoked when the trap springs. |
| `task`           | `PeriodicTask?` | `nil`   | Reference to the scheduled update task for periodic scanning. |
| `target`         | `Entity?` | `nil`         | The entity currently trapped (valid only when sprung and not yet harvested). |
| `lootprefabs`    | `{string}?` | `nil`     | List of prefabs to spawn as loot when the trap is harvested. |
| `lootdata`       | `table?`  | `nil`         | Custom data passed to loot entities via `restoredatafromtrap`. |
| `numsouls`       | `number?` | `nil`         | Number of souls associated with the trapped creature (e.g., Wortox souls). |
| `starvednumsouls`| `number?` | `nil`         | Number of souls to grant if the creature starves while trapped. |
| `starvedlootprefabs` | `{string}?` | `nil` | Loot spawned if the creature starves (generated during starvation). |

## Main Functions

### `Set()`
* **Description:** Activates the trap for trapping: sets `isset = true`, clears prior state, and begins periodic target scanning. Must be called after `SetBait`.
* **Parameters:** None.

### `Reset(sprung)`
* **Description:** Clears trap state (bait, target, loot, timers, etc.). If `sprung` is `true`, marks the trap as sprung but not yet harvested.
* **Parameters:**
  * `sprung` (`boolean?`): Optional flag indicating whether the trap was sprung.

### `SetBait(bait)`
* **Description:** Places a bait item into the trap. Validates that the item is a bait and updates internal state and animation offset. Triggers the `onbaited` callback if defined.
* **Parameters:**
  * `bait` (`Entity`): The bait item entity (must have a `bait` component).

### `RemoveBait()`
* **Description:** Removes the current bait from the trap, resetting the bait reference and associated component links.
* **Parameters:** None.

### `StartUpdate()` / `StopUpdating()`
* **Description:** `StartUpdate` begins the periodic scanning loop (via `DoPeriodicTask`) to check for eligible targets within range. `StopUpdating` cancels the current scan task.
* **Parameters:** None.

### `OnEntityWake()` / `OnEntitySleep()`
* **Description:** Adjusts the update task when the trap enters/leaves sleep mode (e.g., far from players). Slows the update rate during sleep and restores it on wake.
* **Parameters:** None.

### `OnUpdate(dt)`
* **Description:** Core scanning logic. If the trap is set (`isset == true`), searches for an eligible entity within `range`. On finding one, triggers `DoTriggerOn`.
* **Parameters:**
  * `dt` (`number`): Time since last update (unused directly but passed by task system).

### `DoTriggerOn(target)`
* **Description:** Handles the spring event when a target is found. Pushes `"springtrap"` to the trap entity, `"trapped"` (or `"safelydisarmedtrap"`) to the target, and stops further scanning.
* **Parameters:**
  * `target` (`Entity`): The entity that triggered the trap.

### `DoSpring()`
* **Description:** Executes the full spring sequence when a target is captured: sets `issprung = true`, records loot and soul counts, starts the starvation timer, removes the target, and handles bait consumption or bait stealing.
* **Parameters:** None.

### `Harvest(doer)`
* **Description:** Harvests the trap, spawning loot, granting souls (if applicable), updating perishable items with time-in-trap, and resetting or rearming the trap depending on finite uses.
* **Parameters:**
  * `doer` (`Entity?`): The entity harvesting the trap (player/character), used for giving loot and sending soul events.

### `OnTrappedStarve()`
* **Description:** Called when the starvation timer completes. Spawns spoiled loot based on `starvedlootprefabs`, pushes `"starvedtrapsouls"` event if applicable, and resets the trap.
* **Parameters:** None.

### `StartStarvation()` / `StopStarvation()`
* **Description:** Starts/stops the "foodspoil" timer for the trapped creature (if perishable). `StartStarvation` also populates `starvedlootprefabs`.
* **Parameters:** None.

### `AcceptingBait()`
* **Description:** Returns `true` if the trap is set and not yet baited.
* **Parameters:** None.

### `IsBaited()`, `IsFree()`, `IsSprung()`, `HasLoot()`
* **Description:** Simple boolean helpers for trap state.
* **Parameters:** None.

### `GetDebugString()`
* **Description:** Returns a debug-friendly string summarizing the trap’s state (e.g., `"SET! Bait:mouse Loot:cheese"`).
* **Parameters:** None.

### `SetOnHarvestFn(fn)` / `SetOnBaitedFn(fn)` / `SetOnSpringFn(fn)`
* **Description:** Registers a callback to be invoked on harvest, bait placement, or spring events, respectively.
* **Parameters:**
  * `fn` (`function`): Callback function accepting the trap entity and optionally the target/bait.

### `OnSave()` / `OnLoad(data)` / `LoadPostPass(newents, savedata)`
* **Description:** Persists trap state to disk and restores it on load, including bait GUID, loot, souls, and timer state.
* **Parameters:** Standard save/load data and new entities map.

## Events & Listeners
- **Listens for:**
  - `"timerdone"` → calls `OnTimerDone` (triggers `OnTrappedStarve` when timer is `"foodspoil"`)
  - `"ondropped"` → calls `OnDropped` (resets trap to `Set()`)
  - `"onpickup"` → calls `OnPickup` (resets trap to `Reset()`)

- **Emits:**
  - `"springtrap"` (on trap activation, including during load)
  - `"harvesttrap"` (when harvested, with optional `doer` and `sprung`)
  - `"trapped"` (pushed to the target entity)
  - `"safelydisarmedtrap"` (if target is untrappable)
  - `"ontrapped"` (pushed to the target before removal)
  - `"starvedtrapsouls"` (via `TheWorld` when creature starves and has souls)
  - `"harvesttrapsouls"` (to harvester when harvesting soul-storing trap)

## Events & Listeners