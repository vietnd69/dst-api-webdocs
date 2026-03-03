---
id: beargerbrain
title: Beargerbrain
description: Controls the behavior tree and AI logic for the Bearger boss, managing combat, foraging, and seasonal movement patterns.
tags: [ai, combat, boss, season, locomotion]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: db526e95
system_scope: brain
---

# Beargerbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Beargerbrain` implements the decision-making system for the Bearger boss entity using a Behavior Tree (`BT`). It orchestrates high-priority behaviors such as charging and ramming, combat encounters, seasonal foraging (including stealing and harvesting food), and wander movement patterns tied to seasonal travel distances. It relies heavily on the `combat`, `inventory`, `eater`, `container`, `stewer`, `dryer`, `crop`, `harvestable`, `pickable`, and `knownlocations` components, and integrates custom behaviors like `ChaseAndRam`, `ChaseAndAttack`, and `Wander`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("brain")
inst.components.brain:Start("beargerbrain")
-- The brain automatically initializes and runs its behavior tree
```

## Dependencies & tags
**Components used:** `combat`, `inventory`, `eater`, `container`, `crop`, `dryer`, `stewer`, `harvestable`, `pickable`, `timer`, `knownlocations`, `workable`  
**Tags:** `lunar_aligned` (affects panic behavior), `beehive`, `honeyed`  
**Constants used:** `SEE_FOOD_DIST`, `SEE_STRUCTURE_DIST`, `MAX_CHASE_TIME`, `GIVE_UP_DIST`, `MAX_CHARGE_DIST`, `OUTSIDE_CATAPULT_RANGE`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.seenbase` | boolean | `nil` | Set to `true` when Bearger has detected near player structures (used in `ShouldEatFoodFn`). |
| `inst.wanderdirection` | number | `nil` | Stores the current wander direction angle (set and retrieved via `GetWanderDirection`/`SetWanderDirection`). |
| `inst.canrunningbutt` | boolean | `true` | Controls whether Bearger can enter ramming states; disabled during `GroundPound` timer. |

## Main functions
### `OnStart()`
*   **Description:** Initializes and assigns the behavior tree root node, defining priority-based behavior execution including panic (non-mutated only), charge/ram, chase/attack, foraging, wandering, and idle states.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnInitializationComplete()`
*   **Description:** Records Bearger’s starting position as the “spawnpoint” for seasonal travel planning (used only in autumn and summer).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `EatFoodAction(inst)`
*   **Description:** Searches inventory and surroundings for edible items and attempts `PICKUP`/`PICK`/`EAT` actions. Prioritizes honeyed items via `PICKUP`, otherwise selects the first edible target.
*   **Parameters:** `inst` (Entity) — Bearger instance.
*   **Returns:** `BufferedAction` or `nil`.
*   **Error states:** Returns early with `nil` if Bearger is in a busy state and not “wantstoeat”, or if `inventory`/`eater` components are missing.

### `StealFoodAction(inst)`
*   **Description:** Searches for structured food sources (stewers, drying racks, farms, beeboxes, containers, pickables) in order of priority and returns a buffered action to harvest/steal them.
*   **Parameters:** `inst` (Entity) — Bearger instance.
*   **Returns:** `BufferedAction` or `nil`.
*   **Error states:** Returns `nil` if inventory is full, `inventory`/`eater` components are missing, or Bearger is in a busy state.

### `AttackHiveAction(inst)`
*   **Description:** Finds and targets a beehive within range if Bearger has the `eater` component and the hive is a valid combat target.
*   **Parameters:** `inst` (Entity) — Bearger instance.
*   **Returns:** `BufferedAction` or `nil`.

### `ShouldEatFoodFn(inst)`
*   **Description:** Determines whether Bearger is near a player base (within `SEE_STRUCTURE_DIST` of ≥2 structures with tag `"structure"`) and returns `true` if so.
*   **Parameters:** `inst` (Entity) — Bearger instance.
*   **Returns:** `true` if `inst.seenbase` is true or base is detected; otherwise `false`.
*   **Error states:** Returns `false` if Bearger lacks the `eater` component.

### `GetHome(inst)`
*   **Description:** Returns the spawnpoint location only in summer season (used as home for wander planning).
*   **Parameters:** `inst` (Entity) — Bearger instance.
*   **Returns:** `Vector3` (position) or `nil`.

### `GetTargetDistance(inst)`
*   **Description:** Returns the travel distance threshold based on current season (summer/autumn).
*   **Parameters:** `inst` (Entity) — Bearger instance.
*   **Returns:** `number` — `TUNING.BEARGER_SHORT_TRAVEL` in summer, `TUNING.BEARGER_LONG_TRAVEL` in autumn, `0` otherwise.

### `OceanDistanceTest(inst, target)`
*   **Description:** Returns Bearger’s effective attack range (`TUNING.BEARGER_ATTACK_RANGE - 0.25`) only if Bearger can reach the target from shore and is not currently `GroundPound`-affected and the target is not a beehive; otherwise returns `OUTSIDE_CATAPULT_RANGE`.
*   **Parameters:** `inst` (Entity) — Bearger instance; `target` (Entity) — target entity.
*   **Returns:** `number`.

### `InRamDistance(inst, target)`
*   **Description:** Returns `true` if Bearger is far enough from the target to initiate a charge/ram. For land targets, returns `true` when >10 units away. For water/boat targets, checks reachability from shore.
*   **Parameters:** `inst` (Entity) — Bearger instance; `target` (Entity) — target entity.
*   **Returns:** `boolean`.

## Events & listeners
None identified.
