---
id: beebrain
title: Beebrain
description: Controls the AI behavior of bees, including foraging, returning to hive, evading threats, and responding to environmental conditions like fire or darkness.
tags: [ai, combat, environment, pollination]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 145db75c
system_scope: brain
---

# Beebrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`BeeBrain` defines the behavior tree for bee entities in DST. It orchestrates high-priority threat response (panic), combat tactics (attack while vulnerable or dodge during cooldown), and seasonal/environmental triggers (night, winter, fire at home) to guide bees toward returning to their home. When safe and capable, bees forage for flowers or wander near bee beacons. This brain integrates with components like `combat`, `pollinator`, `homeseeker`, `burnable`, and `knownlocations` to make context-aware decisions.

## Usage example
```lua
local inst = CreateEntity()
inst:AddBrain("beebrain")
-- BeeBrain automatically initializes and sets up its behavior tree on AddBrain.
-- It leverages components such as `combat` and `pollinator` for decision-making.
```

## Dependencies & tags
**Components used:** `combat`, `pollinator`, `homeseeker`, `burnable`, `knownlocations`  
**Tags:** Checks `beebeacon`, `INLIMBO`; no tags added or removed by this brain.

## Properties
No public properties.

## Main functions
### `OnStart()`
* **Description:** Initializes and assigns the behavior tree (`BT`) root node to `self.bt`. The behavior tree prioritizes panic, combat, environmental responses, foraging, and wandering in that order.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Does not raise errors under normal operation.

### `OnInitializationComplete()`
* **Description:** Records the bee’s initial position as its “home” location in `knownlocations` component.
* **Parameters:** None.
* **Returns:** Nothing.

### `FindBeeBeacon(self)`
* **Description:** Locates the nearest valid bee beacon within 30 units, caching the result for up to ~2–3 seconds to avoid repeated expensive searches.
* **Parameters:** `self` (table) — the brain instance.
* **Returns:** `Entity | nil` — the beacon entity if found and valid, otherwise `nil`.
* **Error states:** Returns `nil` if no beacon is found, or if the previously cached beacon becomes invalid/out of range.

### `GetBeeBeaconPos(self)`
* **Description:** Returns the 3D position of the cached bee beacon.
* **Parameters:** `self` (table) — the brain instance.
* **Returns:** `Vector | nil` — the beacon’s position (`x,y,z`) or `nil` if no beacon found.
* **Error states:** Returns `nil` if `FindBeeBeacon()` returns `nil`.

### `IsHomeOnFire(inst)`
* **Description:** Checks if the bee’s home entity (via `homeseeker.home`) exists and is currently burning.
* **Parameters:** `inst` (Entity) — the bee entity.
* **Returns:** `boolean` — `true` if home is set and burning, otherwise `false`.

### `GetRunAwayTarget(inst)`
* **Description:** Returns the bee’s current combat target for use in the `RunAway` behavior.
* **Parameters:** `inst` (Entity) — the bee entity.
* **Returns:** `Entity | nil` — the combat target (from `combat.target`).

## Events & listeners
None identified.

## Behavior tree priorities (executed top to bottom)
1. **Panic triggers** (`PanicTrigger`, `ElectricFencePanicTrigger`) — immediate flee if fire or electric fence detected.
2. **Combat** — attack if not in cooldown; otherwise, dodge using `RunAway`.
3. **Home-on-fire panic** — flee if home is burning.
4. **Seasonal/environmental return** — `GoHomeAction` if night (in caves), pollinator full, or winter.
5. **Bee beacon wandering** — wander near the nearest bee beacon if found.
6. **Foraging** — `FindFlower` action to collect pollen.
7. **General wandering** — wander near known “home” location.
