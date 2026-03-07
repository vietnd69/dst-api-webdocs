---
id: otter
title: Otter
description: A hostile ocean-dwelling monster that steals items, shares combat targets with nearby allies, and drops loot upon death.
tags: [combat, ai, monster, loot, water]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 05f389f0
system_scope: entity
---

# Otter

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `otter` prefab defines a hostile, amphibious monster that patrols near water, steals items from players, shares combat targets with nearby otters, and drops loot (including a rare `messagebottle`) when defeated. It is constructed entirely through component composition—no custom component classes are defined—and relies on external systems like `combat`, `locomotor`, `knownlocations`, and `timer`. It uses a custom brain (`otterbrain.lua`) and state graph (`SGotter.lua`) for behavioral logic.

## Usage example
This prefab is instantiated by the game's world generation and spawners; modders typically reference it as a dependency rather than creating it manually. A typical usage in a spawner would be:
```lua
local otter = SpawnPrefab("otter")
otter.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `amphibiouscreature`, `combat`, `eater`, `embarker`, `health`, `inspectable`, `inventory`, `knownlocations`, `locomotor`, `lootdropper`, `sleeper`, `thief`, `timer`  
**Tags added:** `hostile`, `likewateroffducksback`, `monster`, `scarytooceanprey`, `otter`  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `hop_distance` | number | `nil` (temporarily set in `EnterWater`) | Stores the base hop distance before entering water. |
| `TossFish` | function | `nil` | Exposed public method for fish-throwing logic. |

## Main functions
### `TossFish(inst, item)`
*   **Description:** Extracts and launches loot from a captured ocean-fishable creature (e.g., `kelp` or `smallpig`), then removes the original item and starts a short cooldown timer.
*   **Parameters:** `inst` (entity) — the otter; `item` (entity) — the source fish item.
*   **Returns:** `true` if loot was launched, `false` otherwise.
*   **Error states:** Returns `false` if `item` lacks the `oceanfishable_creature` tag or has no defined `fish_def.loot`.

### `EnterWater(inst)`
*   **Description:** Adjusts movement properties when the otter enters water: increases hop distance and disables the dynamic shadow.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `ExitWater(inst)`
*   **Description:** Restores land-based movement properties when exiting water: reverts hop distance and re-enables the dynamic shadow.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `Retarget(inst)`
*   **Description:** Helper used by the `combat` component to find valid new targets within a short range, excluding entities with specific forbidden tags and requiring at least one of a set of required tags.
*   **Parameters:** `inst` (entity).
*   **Returns:** Entity or `nil`.

### `KeepTarget(inst, target)`
*   **Description:** Helper used by `combat` to determine if the otter should maintain its current target based on proximity.
*   **Parameters:** `inst` (entity), `target` (entity).
*   **Returns:** `true` if target is within `OTTER_KEEPTARGET_DISTANCE`, otherwise `false`.

### `is_ally_a_valid_otter(ally)`
*   **Description:** Predicate used during `ShareTarget` to verify an ally is a living otter.
*   **Parameters:** `ally` (entity).
*   **Returns:** `true` if ally has the `otter` tag and is not dead.

## Events & listeners
- **Listens to:** `newcombattarget` — stubbed, no current logic.
- **Listens to:** `attacked` — sets attacker as target and shares aggro with one nearby otter.
- **Listens to:** `onattackother` — shares aggro with the otter’s current target with one nearby otter.
- **Listens to:** `gotnewitem` — resets or starts a 10-second timer to dump loot at home.