---
id: mosquitobrain
title: Mosquitobrain
description: Controls the AI decision-making behavior for the mosquito entity, coordinating movement, combat, and homing logic via behavior trees.
tags: [ai, brain, combat, locomotion]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 0f5581cf
system_scope: brain
---

# Mosquitobrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Mosquitobrain` defines the behavior tree for the mosquito entity. It orchestrates high-priority survival responses (panic, fleeing), social behavior (following a leader), spatial constraints (leashing, wandering), combat engagement (chase and attack), and homing logic (returning home during winter or day). It leverages reusable behavior nodes from `behaviours/` and supports dynamic re-evaluation via `WhileNode` conditions.

## Usage example
```lua
local inst = CreateEntity()
-- ... entity setup ...
inst:AddBrain("mosquitobrain")
-- The brain automatically initializes its behavior tree in OnStart()
-- and reacts to in-game conditions via its behavior tree nodes.
```

## Dependencies & tags
**Components used:** `combat`, `follower`, `homeseeker`, `knownlocations`
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `GoHomeAction(inst)`
* **Description:** Creates an action to guide the entity to its home location, if one exists and is valid. Used by the `DoAction` behavior node.
* **Parameters:** `inst` (Entity) — the entity instance.
* **Returns:** `BufferedAction` if home is valid; otherwise `nil`.

### `GetLeader(inst)`
* **Description:** Retrieves the entity's current leader via the `follower` component.
* **Parameters:** `inst` (Entity) — the entity instance.
* **Returns:** Entity leader, or `nil`.

### `WanderTarget(inst)`
* **Description:** Determines a target position for wandering: combat target's position (if valid), leader's position (if present and valid), or home location.
* **Parameters:** `inst` (Entity) — the entity instance.
* **Returns:** `Vector3` target position, or `nil` if no source is available.

### `ShouldGoHome(inst)`
* **Description:** Determines if the entity should attempt to return home based on world state.
* **Parameters:** `inst` (Entity) — the entity instance.
* **Returns:** `true` if `TheWorld.state.iswinter` is true, or if it is day and `inst.override_stay_out` is false.

### `GetNoLeaderHomePos(inst)`
* **Description:** Returns the home position only if the entity has no leader.
* **Parameters:** `inst` (Entity) — the entity instance.
* **Returns:** `Vector3` home position if no leader; otherwise `nil`.

### `ShouldChaseAndAttack(inst)`
* **Description:** Checks whether the entity can initiate or resume chasing/attacking (no combat target *or* attack cooldown has elapsed).
* **Parameters:** `inst` (Entity) — the entity instance.
* **Returns:** `true` if `combat.target` is `nil` or `combat:InCooldown()` returns `false`.

### `ShouldRunAway(inst)`
* **Description:** Determines if the entity should flee (combat target exists *and* attack is in cooldown).
* **Parameters:** `inst` (Entity) — the entity instance.
* **Returns:** `true` if `combat.target` is non-`nil` *and* `combat:InCooldown()` returns `true`.

### `GetRunawayTarget(inst)`
* **Description:** Returns the current combat target as the source to flee *from*.
* **Parameters:** `inst` (Entity) — the entity instance.
* **Returns:** Entity target to flee from (typically the aggressor).

### `OnStart()`
* **Description:** Initializes the brain's behavior tree root node with prioritized behavior nodes: panic triggers, following, leashing, chase-and-attack, home returning, fleeing, and wandering.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
None.
