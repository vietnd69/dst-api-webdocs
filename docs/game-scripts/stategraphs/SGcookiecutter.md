---
id: SGcookiecutter
title: Sgcookiecutter
description: Defines the state machine and behavioral logic for the Cookiecutter character, handling transitions between swimming, walking, drilling into boats, combat, death, and electrocution states.
tags: [ai, stategraph, entity, combat, locomotion]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 4c380c7f
system_scope: entity
---

# Sgcookiecutter

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGcookiecutter` is the stategraph for the Cookiecutter entity — a mobile, boat-drilling predator in DST. It defines a complete finite state machine (FSM) that orchestrates movement (walking, swimming, jumping, running), boat drilling (with associated animations and particle effects), combat (via area attacks), and environmental responses (electrocution, sinking, death on land vs. water). It relies heavily on components like `locomotor`, `health`, `combat`, `cookiecutterdrill`, `lootdropper`, and `boatphysics`, and dynamically adjusts animation layer and physics collision masks based on whether the entity is in water or on land/boat.

## Usage example
The `SGcookiecutter` stategraph is not instantiated manually — it is automatically loaded and attached to the Cookiecutter prefab during entity creation. A modder would reference it indirectly by customizing behavior via components or extending the state machine via common state helpers such as `CommonStates.AddSleepStates` and `CommonStates.AddElectrocuteStates`.

```lua
-- This stategraph is referenced internally by the Cookiecutter prefab.
-- Example of how it is exported:
return StateGraph("cookiecutter", states, events, "resurface", actionhandlers)
```

## Dependencies & tags
**Components used:**
- `boatphysics`: reads `velocity_x`, `velocity_z` to calculate boat-relative positions during resurfacing.
- `combat`: calls `DoAreaAttack` for jumping and drilling hit attacks.
- `cookiecutterdrill`: calls `ResetDrilling`, `ResumeDrilling`, `PauseDrilling`, `FinishDrilling`, `GetIsDoneDrilling`.
- `eater`: reads `lasteattime` and writes to it during post-drill.
- `health`: checks `IsDead`, and modifies `invincible`.
- `locomotor`: uses `WalkForward`, `RunForward`, `Stop`, `StopMoving`, `Clear`, and `walkspeed`.
- `lootdropper`: calls `DropLoot` on death.

**Tags:** Adds/Removes `NOCLICK`, `moving`, `running`, `busy`, `idle`, `drilling`, `drilling_pst`, `jumping`, `nointerrupt`, `noattack`, `nosleep`, `sleeping`, `electrocute` (via `CommonStates.AddElectrocuteStates`). Checks `swimming`, `noattack`, `nointerrupt`, etc., during state transitions.

## Properties
No public properties — this is a stategraph definition, not a component.

## Main functions
This file exports a single `StateGraph` constructor call and defines internal state behavior via state tables and event handlers. No standalone functions are exported.

### State handlers (internal)
The following are not exported functions but core logic sections embedded in the state definitions.

#### `SetInvincible(inst, invincible)`
* **Description:** Sets the `invincible` property on the `health` component if present and the entity is alive. Used during states like `run_start` to grant temporary invincibility.
* **Parameters:** `inst` (Entity instance), `invincible` (boolean).
* **Returns:** Nothing.

#### `SetSortOrderIsInWater(inst, in_water)`
* **Description:** Updates sort order and layer for rendering and collision based on whether the entity is in water (`true`) or on land/boat (`false`). Activates ground collision mask on water entry and restores full mask on exit.
* **Parameters:** `inst` (Entity instance), `in_water` (boolean).
* **Returns:** Nothing.

#### `UpdateWalkSpeedAndHopping(inst)`
* **Description:** Dynamically sets `walkspeed` in the `locomotor` component based on the validity of `inst.target_wood`. If valid, uses `APPROACH_SPEED`; otherwise, uses `WANDER_SPEED`. Called on every update in movement states.
* **Parameters:** `inst` (Entity instance).
* **Returns:** Nothing.

### State definitions (selected highlights)

#### `"idle"`
* **Description:** Default state when the entity is not moving. Initiates a looping `idle` animation and stops physics. Forces the entity into water (`in_water = true`) and lowers render layer.

#### `"resurface"`
* **Description:** Handles transition from underwater to surface. Sets `NOCLICK`, plays `resurface` anim, repositions if `should_relocate` via `FindSwimmableOffset`. Timeline removes `NOCLICK` and state tags mid-anim. On `animover`, returns to `idle`.

#### `"gohome"`
* **Description:** Initiates return home (`inst:DoReturnHome()`). Plays `leave` animation and goes home on `animover`.

#### `"death"` / `"death_boat"`
* **Description:** Handles entity death. `death` occurs while in water (render layer set below ground), `death_boat` occurs on land (physics collision removed). Both call `DropLoot`.

#### `"walk"` / `"walk_start"` / `"walk_stop"`
* **Description:** Standard walking states with walk-speed locomotion. `walk` loops animation and renews timeout to continue walking. `walk_start` and `walk_stop` transition into and out of looping walk.

#### `"run"` / `"run_start"` / `"run_stop"`
* **Description:** High-speed movement states with invincibility via `SetInvincible(true)`, tagged as `running`, `noattack`, `nosleep`, `nointerrupt`. `run_stop` transitions to `idle` via timeline after animation.

#### `"eat"`
* **Description:** Transition state that immediately jumps to `"jump_pre"` with optional target point.

#### `"jump_pre"` → `"jumping"` → `"jump_pst_water"` or `"jump_pst_boat"`
* **Description:** Handles jumping out of water and landing either in water or on a boat. During `"jumping"`, collision mask is changed to `GROUND`, `DoAreaAttack` is called once, and final landing determines whether `"jump_pst_water"` or `"jump_pst_boat"` is entered. `"jump_pst_boat"` automatically triggers `"drill"` upon exit.

#### `"drill"`
* **Description:** Boat-drilling state. Repeats animation, spawns fluff particles (by wood material: grass/kelp), and starts drilling via `cookiecutterdrill:ResumeDrilling`. `onupdate` checks `GetIsDoneDrilling` to exit early. On exit, `cookiecutterdrill:PauseDrilling` is called and particles tasks are cancelled.

#### `"drill_pst"`
* **Description:** Post-drill cooldown. Sets `NOCLICK`, stops physics, plays `drill_pst` anim. Timeline calls `FinishDrilling` and sets `lasteattime`. After timeout, goes to `"resurface"`.

#### `"drill_hit"`
* **Description:** Triggered on attack interruption while drilling. Plays `hit` anim, fires area attack via `DoAreaAttack`, and returns to `"drill"` on `animqueueover`.

## Events & listeners
- **Listens to:**
  - `attacked` — reacts based on state and water condition: flee (if in water, go to `idle`) or transition to `drill_hit`.
  - `onsink` — if not dead and not already jumping/drilling/electrocuting, goes to `drill_pst` or `gohome`.
  - `gohome` — defers or immediately transitions to `gohome`.
  - `death` — transitions to `death` or `death_boat` depending on water state.
  - `gotosleep` — if swimming and not interrupted, transitions to `sleep` or `sleeping`.
  - `teleported` — on teleport, goes to `jump_pst_water`.
  - `OnLocomote` — handled by `CommonHandlers.OnLocomote(true, true)`; monitors movement changes.
  - `animover`, `animqueueover`, `ontimeout` — used for state transitions (e.g., `"animover"` moves to `idle`, `"animqueueover"` returns to `"drill"`).

- **Pushes:** No events are directly pushed by this stategraph.
