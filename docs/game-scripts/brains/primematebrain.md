---
id: primematebrain
title: Primematebrain
description: Implements AI behavior for the Primemate character, managing actions like boat rowing, leak repair, fleeing, wandering, chasing, and abandoning a boat when it sinks.
tags: [ai, boat, combat, locomotion, NPC]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: eb8a480c
system_scope: brain
---

# Primematebrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`PrimemateBrain` defines the behavior tree for the Primemate NPC, a character capable of operating and maintaining a boat. It handles high-priority actions such as fleeing from danger (`PanicTrigger`), abandoning a sinking boat, repairing boat leaks, rowing when needed, following the boat, and wandering freely. The brain integrates with multiple components—`combat`, `crewmember`, `health`, `inventory`, `knownlocations`, `timer`, and `walkableplatform`—to make context-aware decisions based on the Primemate’s state, environment, and boat condition.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("primemate")
inst:AddComponent("brain")
inst.components.brain:SetBrain("primematebrain")
```

## Dependencies & tags
**Components used:** `boatleak`, `combat`, `crewmember`, `health`, `inventory`, `knownlocations`, `timer`, `walkableplatform`  
**Tags:** None added or removed by this brain itself.

## Properties
No public properties.

## Main functions
### `PrimemateBrain:OnStart()`
* **Description:** Initializes the behavior tree root node sequence for the Primemate. Defines the full priority-ordered decision stack, from emergency flee states to idle wandering.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None.

### `ShouldRunFn(inst, hunter)` *(local)*
* **Description:** A legacy callback skeleton (currently commented out) intended to determine if the Primemate should flee from a given `hunter`. Unused in current code.
* **Parameters:** 
  - `inst` (EntityInstance) — the Primemate entity.
  - `hunter` (EntityInstance) — the potential threat.
* **Returns:** `nil` (always, due to active code being commented out).
* **Error states:** Not applicable.

### `findmaxwanderdistfn(inst)` *(local)*
* **Description:** Computes the maximum wandering distance for the Primemate. If on a boat, it caps the distance to one unit less than the platform’s radius to prevent off-boat wandering.
* **Parameters:** 
  - `inst` (EntityInstance) — the Primemate entity.
* **Returns:** 
  - `number` — the maximum wander distance (default `20`, reduced on boats).
* **Error states:** Returns default `MAX_WANDER_DIST` if no platform or platform radius is available.

### `findwanderpointfn(inst)` *(local)*
* **Description:** Determines the wander destination point. If a “home” location is known, returns it; otherwise, defaults to the current boat’s world position if on a boat.
* **Parameters:** 
  - `inst` (EntityInstance) — the Primemate entity.
* **Returns:** 
  - `Vector3` or `nil` — the target position.
* **Error states:** Returns `nil` if no “home” location exists and no boat is present.

### `rowboat(inst)`
* **Description:** Creates a buffered row action if the Primemate is part of the boat crew and needs to row (i.e., a movement direction is set and the boat is not in assault range).
* **Parameters:** 
  - `inst` (EntityInstance) — the Primemate entity.
* **Returns:** 
  - `BufferedAction` — action to perform rowing, or `nil` if not needed.
* **Error states:** Returns `nil` if the crewmember component is missing, `Shouldrow()` returns `false`, or no valid walkable offset near the boat center can be found.

### `shouldfix(inst)` *(local)*
* **Description:** Checks whether the Primemate can and should repair a leak (i.e., has a `boatpatch` item and a leaking entity within 4 units of the boat center). Sets internal state (`inst.fixboat`) if so.
* **Parameters:** 
  - `inst` (EntityInstance) — the Primemate entity.
* **Returns:** 
  - `boolean` — `true` if repair is possible, `nil` otherwise.
* **Error states:** Returns `nil` if a cooldown timer (`patch_boat_cooldown`) is active or no repair item/leak is found.

### `fixboat(inst)`
* **Description:** Creates a buffered action to repair a specific leak using a `boatpatch` item.
* **Parameters:** 
  - `inst` (EntityInstance) — the Primemate entity.
* **Returns:** 
  - `BufferedAction` — action to perform repair, or `nil` if impossible.
* **Error states:** Returns `nil` if the cooldown timer is active, no `boatpatch` item is found, or no leak target is within 4 units.

### `GetBoat(inst)` *(local)*
* **Description:** Helper function to return the entity’s current platform (typically the boat).
* **Parameters:** 
  - `inst` (EntityInstance) — the Primemate entity.
* **Returns:** 
  - `EntityInstance` or `nil` — the boat entity.
* **Error states:** Returns `nil` if not on a platform.

### `DoAbandon(inst)`
* **Description:** Initiates an abandon-boat action when the boat is dead and the Primemate is still aboard. Computes a safe exit point just outside the boat’s edge.
* **Parameters:** 
  - `inst` (EntityInstance) — the Primemate entity.
* **Returns:** 
  - `BufferedAction` — action to abandon the boat, or `nil` if no action is needed.
* **Error states:** Returns `nil` if the boat is not dead or no platform is present.

### `cangettotarget(inst)`
* **Description:** Determines if the Primemate can reach its combat target from the current boat position, considering attack range and platform overlap.
* **Parameters:** 
  - `inst` (EntityInstance) — the Primemate entity.
* **Returns:** 
  - `boolean` — `true` if target is reachable, `false` otherwise.
* **Error states:** Returns `true` if not on a boat and has a target; returns `false` if target is too far relative to combined attack range and platform radius.

## Events & listeners
None identified.

## Constants
* `MIN_FOLLOW_DIST` = `5`
* `TARGET_FOLLOW_DIST` = `7`
* `MAX_FOLLOW_DIST` = `10`
* `RUN_AWAY_DIST` = `7`
* `STOP_RUN_AWAY_DIST` = `15`
* `SEE_FOOD_DIST` = `10`
* `MAX_WANDER_DIST` = `20`
* `MAX_CHASE_TIME` = `60`
* `MAX_CHASE_DIST` = `40`
* `TIME_BETWEEN_EATING` = `30`
* `LEASH_RETURN_DIST` = `15`
* `LEASH_MAX_DIST` = `20`
* `NO_LOOTING_TAGS` = `{ "INLIMBO", "catchable", "fire", "irreplaceable", "heavy", "outofreach", "spider" }`
* `NO_PICKUP_TAGS` = copy of `NO_LOOTING_TAGS` + `"_container"`
* `PICKUP_ONEOF_TAGS` = `{ "_inventoryitem", "pickable", "readyforharvest" }`
* `NO_TAGS` = `{ "FX", "NOCLICK", "DECOR", "INLIMBO" }`
