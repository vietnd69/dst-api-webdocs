---
id: lunar_grazer_brain
title: Lunar Grazer Brain
description: Implements the AI behavior tree for the Lunar Grazer entity, managing combat, movement, and despawn logic based on target status and entity state.
tags: [ai, combat, behavior-tree]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 9afee4b5
system_scope: brain
---

# Lunar Grazer Brain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`LunarGrazerBrain` defines the behavior tree for the Lunar Grazer entity in DST. It orchestrates combat engagement, strafing movement, and despawn mechanics using a hierarchical behavior tree (`BT`). The brain integrates with several components — `combat`, `health`, `grogginess`, `sleeper`, and `knownlocations` — to adapt its behavior based on the target’s state (e.g., sleeping/knocked out) and the entity’s own condition. It is added automatically to the Lunar Grazer prefab and is not intended for manual instantiation.

## Usage example
This component is attached internally to the Lunar Grazer prefab and does not require manual setup. The behavior tree is initialized on entity spawn via `OnStart()`.

## Dependencies & tags
**Components used:**
- `combat` — `HasTarget()`, `InCooldown()`, `target`
- `health` — `IsHurt()`
- `grogginess` — `IsKnockedOut()`
- `sleeper` — `IsAsleep()`
- `knownlocations` — `GetLocation()`

**Tags:** Uses `debris` and `invisible` via `sg:HasStateTag()`; checks `dismounting` state tag.

## Properties
No public properties exposed for external modification.

## Main functions
### `OnStart()`
* **Description:** Constructs and initializes the behavior tree for the Lunar Grazer. Sets up a hierarchical state machine handling debris recovery, combat engagement (including strafing behavior and sleep-aware attacks), loitering while waiting for a target, and wandering near home. If no target appears after loitering, the entity triggers a `lunar_grazer_despawn` event.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Does not return errors; relies on behavioral node composition for state transitions.

## Events & listeners
- **Listens to:** None directly — but pushes events via `inst:PushEvent(...)`.
- **Pushes:**
  - `lunar_grazer_respawn` — fired when debris state ends and entity should re-engage.
  - `lunar_grazer_despawn` — fired if the entity loiters without acquiring a target near its home location.
