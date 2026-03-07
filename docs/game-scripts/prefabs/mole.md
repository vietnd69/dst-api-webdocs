---
id: mole
title: Mole
description: Controls the behavior and state transitions of the mole creature, including underground/aboveground physics, inventory management, and home-seeking logic.
tags: [entity, ai, inventory, physics]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f299a544
system_scope: entity
---

# Mole

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `mole` prefab defines the behavior of the mole creature, a small underground animal that periodically emerges to forage. It integrates multiple components including locomotion, health, combat, inventory, and sleeper logic. Key behaviors include managing physics for underground/aboveground states, transferring inventory to a molehill when returning home, and dropping items if the molehill is dug up. It supports trapping mechanics (though `trappable = false` on `lootdropper`) and interacts with the `SGmole` state graph and `molebrain` for AI.

## Usage example
```lua
-- Example of spawning and configuring a mole (typically done internally)
local inst = Prefab("mole", fn, assets, prefabs)()

-- Components attached automatically:
-- inst.components.health, .inventory, .locomotor, .sleeper, .cookable, etc.
```

## Dependencies & tags
**Components used:** `locomotor`, `health`, `combat`, `eater`, `lootdropper`, `inventory`, `inventoryitem`, `inspectable`, `sleeper`, `knownlocations`, `tradable`, `cookable`, `hauntable`.  
**Tags added:** `animal`, `prey`, `mole`, `smallcreature`, `canbetrapped`, `baitstealer`, `cattoy`, `catfood`, `whackable`, `stunnedbybomb`, `cookable`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `isunder` | boolean | `false` (initially true due to `SetUnderPhysics`) | Indicates whether the mole is underground (`true`) or aboveground (`false`). Managed by `SetUnderPhysics`/`SetAbovePhysics`. |
| `needs_home_time` | number | `nil` | Unix timestamp when the mole needs to seek home; set after `TestForMakeHome` is called. |
| `last_above_time` | number | `0` | Last time the mole was aboveground. |
| `make_home_delay` | number | `math.random(5, 10)` | Delay (seconds) before checking if home is needed. |
| `peek_interval` | number | `math.random(15, 25)` | Interval (seconds) for random peeking behavior. |
| `scrapbook_speechstatus` | string | `"ABOVEGROUND"` | Used for scrapbook display context. |

## Main functions
### `SetUnderPhysics(inst)`
*   **Description:** Configures physics and tags for the underground state. Disables drawing and restricts collision to characters and world/obstacles.
*   **Parameters:** `inst` (entity) - The mole entity instance.
*   **Returns:** Nothing.

### `SetAbovePhysics(inst)`
*   **Description:** Configures physics and tags for the aboveground state. Re-enables drawing and sets character physics.
*   **Parameters:** `inst` (entity) - The mole entity instance.
*   **Returns:** Nothing.

### `displaynamefn(inst)`
*   **Description:** Returns the appropriate display name based on the mole's state (underground vs. aboveground or held).
*   **Parameters:** `inst` (entity) - The mole entity instance.
*   **Returns:** String: either `STRINGS.NAMES.MOLE_UNDERGROUND` or `STRINGS.NAMES.MOLE_ABOVEGROUND`.

### `getstatus(inst)`
*   **Description:** Returns a status string describing the mole's current state.
*   **Parameters:** `inst` (entity) - The mole entity instance.
*   **Returns:** String: `"HELD"`, `"UNDERGROUND"`, or `"ABOVEGROUND"`.

### `TestForMakeHome(inst)`
*   **Description:** Sets `needs_home_time` if the mole lacks a valid home reference, triggering a home-seeking call.
*   **Parameters:** `inst` (entity) - The mole entity instance.
*   **Returns:** Nothing.

### `OnAttacked(inst, data)`
*   **Description:** When the mole is attacked, prompts nearby moles (`tag: "mole"` within 30 units) to return home.
*   **Parameters:**  
  `inst` (entity) - The attacked mole.  
  `data` (table) - Attack event data (unused, per comment).
*   **Returns:** Nothing.

### `OnWentHome(inst)`
*   **Description:** Transfers the mole's inventory to its associated molehill (`homeseeker.home`) and returns the state graph to `"idle"`.
*   **Parameters:** `inst` (entity) - The mole entity instance.
*   **Returns:** Nothing.

### `OnHomeDugUp(inst)`
*   **Description:** Drops all inventory items (keeping held items) and stuns the mole if alive when its home is dug up.
*   **Parameters:** `inst` (entity) - The mole entity instance.
*   **Returns:** Nothing.

### `OnCookedFn(inst)`
*   **Description:** Plays a death sound when the mole is cooked.
*   **Parameters:** `inst` (entity) - The mole entity instance.
*   **Returns:** Nothing.

### `onpickup(inst)`
*   **Description:** Cancels ongoing state graph tasks and stops sounds upon trapping or picking up the mole.
*   **Parameters:** `inst` (entity) - The mole entity instance.
*   **Returns:** Nothing.

### `ondrop(inst)`
*   **Description:** Stops sounds, forces `"stunned"` state, and checks if home needs to be made.
*   **Parameters:** `inst` (entity) - The mole entity instance.
*   **Returns:** Nothing.

### `hauntable_reaction(inst)`
*   **Description:** Handles hauntable interactions; randomly triggers a `"MOLEPEEK"` buffered action.
*   **Parameters:** `inst` (entity) - The mole entity instance.
*   **Returns:** Boolean: `true` if peek action was performed, `false` otherwise.

### `OnSleep(inst)`
*   **Description:** Kills all sounds when the mole enters sleep mode.
*   **Parameters:** `inst` (entity) - The mole entity instance.
*   **Returns:** Nothing.

### `OnRemove(inst)`
*   **Description:** Kills all sounds when the mole is removed.
*   **Parameters:** `inst` (entity) - The mole entity instance.
*   **Returns:** Nothing.

### `OnSave(inst, data)`
*   **Description:** Saves the time elapsed since `needs_home_time` was set.
*   **Parameters:**  
  `inst` (entity) - The mole entity instance.  
  `data` (table) - Save data table.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Loads saved `needs_home_time` calculation.
*   **Parameters:**  
  `inst` (entity) - The mole entity instance.  
  `data` (table) - Loaded save data table.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `attacked` — triggers `OnAttacked` to rally nearby moles.  
  `onwenthome` — triggers `OnWentHome` for inventory transfer.  
  `molehill_dug_up` — triggers `OnHomeDugUp` to drop items.  
  `enterlimbo` — triggers `OnRemove` to stop sounds.  
- **Pushes:**  
  `ontrapped` — fired in `onpickup` via `inst:PushEvent`.