---
id: wagdrone_rolling
title: Wagdrone Rolling
description: Manages the state, movement, visuals, and connectivity logic for the Wagdrone Rolling boss enemy during its rolling phase.
tags: [combat, ai, boss, network]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 2d00a4bf
system_scope: entity
---

# Wagdrone Rolling

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
This prefab defines the behavior of the rolling phase of the Wagdrone boss in DST. It handles visual effects (such as flickering lights and beam connections between multiple Wagdrone Rollings), health, combat stats, locomotion (using direct drive for non-pathfinding movement), and state persistence across saves/loads. It interacts closely with the `wagdrone_rollingbrain` for AI behavior, and reuses shared helper functions from `WagdroneCommon` for friendability, hacking, and teleportation prevention.

## Usage example
```lua
--Typical instantiation inside the game's prefabs system (not user-facing)
return Prefab("wagdrone_rolling", fn, assets, prefabs)
```

## Dependencies & tags
**Components used:** `inspectable`, `locomotor`, `health`, `combat`, `updatelooper`, `workable` (conditional)  
**Tags added:** `scarytoprey`, `mech`, `electricdamageimmune`, `soulless`, `lunar_aligned`, `wagdrone`, `wagdrone_rolling`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `flicker` | `net_bool` | `false` | Networked boolean controlling whether flicker effects and beams are active. |
| `beams` | table | `{}` | Map of nearby Wagdrone Rollings → laser wire FX prefabs to maintain bidirectional beam connections. |
| `ConnectBeams` | function | defined inline | Iterates over nearby Wagdrone Rollings within range and creates beam FX between pairs ≥4 units apart. |
| `DisconnectBeams` | function | defined inline | Removes all laser wire FX and clears the `beams` map. |
| `SetBrainEnabled` | function | defined inline | Assigns or removes the `wagdrone_rollingbrain` based on boolean input. |
| `OnSave`, `OnLoad`, `OnPreLoad`, `OnLoadPostPass`, `OnEntitySleep`, `MakeFriendly` | function | defined inline | Lifecycle hooks for saving, loading, sleep behavior, and friendability setup via `WagdroneCommon`. |

## Main functions
### `ConnectBeams(inst)`
* **Description:** Scans for other Wagdrone Rollings within 15 units; for each distinct pair ≥4 units apart, spawns a `wagdrone_laserwire_fx` and registers bidirectional beam links.
* **Parameters:** `inst` (Entity) — the current Wagdrone Rolling instance.
* **Returns:** Nothing.
* **Error states:** Uses `assert` to verify beam consistency; fails fast if beams are mismatched.

### `DisconnectBeams(inst)`
* **Description:** Removes all registered laser wire FX and clears beam mappings. Called automatically on entity removal or when beams are no longer needed.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `SetBrainEnabled(inst, enable)`
* **Description:** Enables or disables the AI brain by assigning the `wagdrone_rollingbrain` or `nil` accordingly.
* **Parameters:**  
  `enable` (boolean) — whether to activate the brain.
* **Returns:** Nothing.

### `OnUpdateFlicker(inst)`
* **Description:** Randomly modulates highlight color using `easing.inOutQuad` to create a flicker effect, but only executes on alternating update cycles (via `flickerdelay` toggle).
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `OnFlickerDirty(inst)`
* **Description:** Conditionally adds/removes `OnUpdateFlicker` from the `updatelooper` based on the `flicker` value. Clears highlight override when disabled.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `RegisterBeam(inst, other, fx)`
* **Description:** Registers a beam connection from `inst` to `other` via the shared FX prefab. Activates flicker and plays ambient beam sounds if this is the first beam.
* **Parameters:**  
  `inst` (Entity) — source Wagdrone Rolling.  
  `other` (Entity) — target Wagdrone Rolling.  
  `fx` (Prefab) — laser wire FX instance.
* **Returns:** Nothing.

### `UnregisterBeam(inst, other)`
* **Description:** Removes a beam entry; shuts off flicker and beam sounds if this was the last beam.
* **Parameters:** `inst`, `other` (Entities).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `flickerdirty` — triggers `OnFlickerDirty` on non-master clients to sync flicker state.  
- **Pushes:**  
  - None (this prefab does not fire custom events).