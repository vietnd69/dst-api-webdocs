---
id: SGwagdrone_flying
title: Sgwagdrone Flying
description: Manages the flight, hovering, movement, and animation state transitions for the Wagnificent Drone entity during active combat.
tags: [locomotion, ai, combat, fx, sound]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 41155b51
system_scope: locomotion
---

# Sgwagdrone Flying

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGwagdrone_flying` is a `StateGraph` that controls the flight behavior of the Wagnificent Drone, a boss entity in DST. It manages transitions between idle, running (moving), landing, and attack states, while handling unique hover physics for each state via specialized update functions. It integrates with the `locomotor` and `workable` components to control motion, orientation, and workability state, and triggers sound, lighting, and visual effects during animation frames.

## Usage example
```lua
-- Attaching the stategraph to a Wagnificent Drone entity
inst.sg = StateGraph("wagdrone_flying")
inst:AddComponent("locomotor")
inst:AddComponent("workable")

-- Trigger state transitions via events
inst:PushEvent("activate", commander)   -- starts the drone if turned off
inst:PushEvent("doattack")              -- initiates an attack sequence
inst:PushEvent("deactivate")            -- turns the drone off
inst:PushEvent("despawn")               -- begins shutdown and despawn
```

## Dependencies & tags
**Components used:** `locomotor`, `workable`  
**Tags checked:** `idle`, `moving`, `running`, `off`, `busy`, `attack`, `canrotate`, `nointerrupt`  
**Tags added:** `NOCLICK` (when despawning and in `off_idle`)  

## Properties
No public properties are declared directly in this stategraph definition. State-specific values are stored in `inst.sg.statemem` (e.g., `t`, `hoverstate`, `flicker`) and `inst.sg.mem` (e.g., `todespawn`, `turnon`, `turnoff`).

## Main functions
This file defines a stategraph, not a component, so it has no traditional methods. Instead, it defines:
- **Event handlers** (via `EventHandler`) that respond to external events and trigger state transitions.
- **State update functions** (e.g., `UpdateIdleHover`, `UpdateRunHover`) that run each frame in specific states to compute vertical hover motion and physics.

The following update functions are referenced by state `onupdate` callbacks:
### `UpdateIdleHover(inst, dt)`
* **Description:** Computes and applies hover motion in the `idle` state using a sine wave to simulate gentle floating.
* **Parameters:** `inst` (Entity), `dt` (number, time since last frame).
* **Returns:** Nothing.
* **Error states:** No explicit errors; skips update if `IsPaused(inst)` returns `true`.

### `UpdateRunHover(inst, dt)`
* **Description:** Manages hover motion during forward movement (`run` and `run_start` states), including a initial dip before rising to cruise height.
* **Parameters:** `inst` (Entity), `dt` (number).
* **Returns:** Nothing.
* **Error states:** Skips update if `IsPaused(inst)` is `true`.

### `UpdateRunStopHover(inst, dt)`
* **Description:** Handles hover motion during the `run_stop` transition, including a final dip before returning to idle height.
* **Parameters:** `inst` (Entity), `dt` (number).
* **Returns:** Nothing.
* **Error states:** Skips update if `IsPaused(inst)` is `true`.

### `UpdateLanding(inst, dt)`
* **Description:** Simulates landing physics in `turnoff` and `turnon` states using constant acceleration (gravity) to smoothly descend to the ground.
* **Parameters:** `inst` (Entity), `dt` (number).
* **Returns:** Nothing.
* **Error states:** Skips update if `IsPaused(inst)` is `true`.

### `UpdateAttackHover(inst, dt)`
* **Description:** Manages complex hover behavior during attacks, with three phases: charging (rising), recoil (dipping), and settling (returning to idle height). Also controls flickering light effects.
* **Parameters:** `inst` (Entity), `dt` (number).
* **Returns:** Nothing.
* **Error states:** Skips update if `IsPaused(inst)` is `true`.

### `SetFlyingPhysics(inst, enable)`
* **Description:** Toggles collision group and colliders to enable/disable interaction with terrain and flyers when transitioning between flying and grounded states.
* **Parameters:** `inst` (Entity), `enable` (boolean).
* **Returns:** Nothing.

### `SetSoundLoop(inst, name)`
* **Description:** Manages looping ambient sounds (`idle`, `run`) and kills unrelated sounds when changing states.
* **Parameters:** `inst` (Entity), `name` (string or `nil`).
* **Returns:** Nothing.

### `SetFlicker(inst, c)`
* **Description:** Sets the additive color intensity and light intensity for the drone’s flickering warning lights during attacks.
* **Parameters:** `inst` (Entity), `c` (number, 0–0.2+).
* **Returns:** Nothing.

### `SetShadowScale(inst, scale)`
* **Description:** Adjusts the size and softness of the drone’s dynamic shadow during `turnon`/`turnoff` transitions.
* **Parameters:** `inst` (Entity), `scale` (number, 0.04–1.1).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `locomote` – detects movement intent and triggers `run_start` or `run_stop`.
  - `doattack` – initiates the `attack` state.
  - `activate` – turns the drone on (from `off_idle` → `turnon`).
  - `deactivate` – turns the drone off (from flying → `turnoff` → `off_idle`).
  - `despawn` – schedules drone cleanup, turns off and transitions to `off_idle`.
  - `animover` – fires on animation completion to transition to next state.
  - `animqueueover` – fires after animation queue finishes (e.g., post-attack).
- **Pushes:** None (this stategraph does not fire custom events; it only responds to external triggers).