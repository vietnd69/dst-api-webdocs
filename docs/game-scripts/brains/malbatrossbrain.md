---
id: malbatrossbrain
title: Malbatrossbrain
description: Controls the AI behavior of the Malbatross boss, managing combat aggression, drowning logic, dive attacks, and land departure.
tags: [ai, boss, combat, locomotion, environment]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 7bbb5238
system_scope: brain
---

# Malbatrossbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Malbatrossbrain` is a behavior tree-based AI controller for the Malbatross boss entity. It orchestrates high-level behaviors such as chasing and attacking players, fleeing and diving back into water, eating fish, attacking ocean trawlers, and departing from land after staying too long. It interacts primarily with the `combat`, `knownlocations`, `container`, and `inventoryitem` components, and uses several behavior modules (`chaseandattack`, `runaway`, `wander`, `doaction`) to implement decision-making logic.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("brain")
inst.brain = MalbatrossBrain(inst)
inst.brain:OnStart()
inst.brain:OnInitializationComplete()
```

## Dependencies & tags
**Components used:** `combat`, `knownlocations`, `container`, `inventoryitem`  
**Tags:** Checks `swoop`, `notarget`, `playerghost`, `INLIMBO`, `outofreach`, `FX`, `oceanfish`, `oceanfishable`, `oceantrawler`

## Properties
No public properties

## Main functions
### `OnStart()`
* **Description:** Initializes and starts the Malbatross behavior tree. Constructs a priority-based root node that evaluates threat-based actions first (e.g., fleeing, facing target, chasing), then opportunistic actions (e.g., eating, attacking trawlers), and finally idle wandering.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnInitializationComplete()`
* **Description:** Records the Malbatross’s starting position as `"spawnpoint"` in `knownlocations` for reference during wander decisions.
* **Parameters:** None.
* **Returns:** Nothing.

### `CheckForFleeAndDive(inst)`
* **Description:** Determines whether the Malbatross should initiate a swoop or splash (dive) attack based on proximity to its combat target and internal state flags (`willswoop`, `readytoswoop`, `willdive`, `readytodive`). Fires `"doswoop"` or `"dosplash"` events accordingly.
* **Parameters:** `inst` (entity) — the Malbatross entity instance.
* **Returns:** The combat target entity if a dive/swoop condition is triggered, otherwise `nil`.
* **Error states:** May return `nil` if target is absent, too far, or state flags are not met.

### `GetEatAction(inst)`
* **Description:** Scans for nearby valid fish (tagged `oceanfish`/`oceanfishable`) that are not held and not on passable terrain. Constructs an `"EAT"` buffered action if hungry.
* **Parameters:** `inst` (entity) — the Malbatross entity instance.
* **Returns:** A `BufferedAction` for `"EAT"` or `nil` if not hungry or no valid target found.

### `LookForTrawlerAction(inst)`
* **Description:** Identifies ocean trawlers (`oceantrawler`) with full containers while hungry. Forces the Malbatross to face the trawler, then decides between `"HAMMER"` (attack container) or `"doswoop"` (dive attack) based on `DIVE_ATTACK_CHANCE`.
* **Parameters:** `inst` (entity) — the Malbatross entity instance.
* **Returns:** The target entity if an action is constructed, otherwise `nil`.

### `GetCombatFaceTargetFn(inst)`
* **Description:** Returns a valid combat target for face behavior only if the Malbatross is not fleeing and is within range of `"home"` location. Excludes targets tagged `"notarget"` or `"playerghost"`.
* **Parameters:** `inst` (entity) — the Malbatross entity instance.
* **Returns:** A target entity or `nil`.

### `KeepCombatFaceTargetFn(inst, target)`
* **Description:** Continues facing a target if the Malbatross is within `"home"` range, unless a new close player is found (which triggers a `SetTarget` call and ends the staredown state).
* **Parameters:**  
  `inst` (entity) — the Malbatross entity instance.  
  `target` (entity) — the currently faced target.
* **Returns:** `true` if the target remains valid, `nil` otherwise.

### `GetNewHome(inst)`
* **Description:** Updates the `"home"` location in `knownlocations` to a point away from the current position using `GetWanderAwayPoint`. Schedules a delayed task to forget this location after 30 seconds.
* **Parameters:** `inst` (entity) — the Malbatross entity instance.
* **Returns:** Nothing.

### `GetWanderPos(inst)`
* **Description:** Returns the stored `"home"` or `"spawnpoint"` location if present, for use in wander behavior.
* **Parameters:** `inst` (entity) — the Malbatross entity instance.
* **Returns:** A position (typically `Vector3` or location object) or `nil`.

### `GetHomePos(inst)`
* **Description:** Returns `"home"` location; if not present, triggers `GetNewHome` to set it.
* **Parameters:** `inst` (entity) — the Malbatross entity instance.
* **Returns:** A position object.

### `ShouldLeaveLand(inst)`
* **Description:** Monitors if the Malbatross remains on solid land. After more than 5 seconds, fires a `"depart"` event to prompt it to leave the land and return to water.
* **Parameters:** `inst` (entity) — the Malbatross entity instance.
* **Returns:** `nil`.

## Events & listeners
- **Listens to:** None directly.
- **Pushes:** `"doswoop"` (with target), `"dosplash"`, `"depart"` (from land departure logic).
