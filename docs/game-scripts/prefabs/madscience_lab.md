---
id: madscience_lab
title: Madscience Lab
description: Manages the mad science lab structure's experimental crafting workflow, including stage progression, sound, and particle effects during recipe processing.
tags: [crafting, structure, animation, fx]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 02b3694a
system_scope: crafting
---

# Madscience Lab

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `madscience_lab` prefab implements the Mad Science Lab structure, a special crafting component used during the Halloween event. It handles experimental recipe execution via staged animation progression, sound feedback, and particle effects. It integrates with the `madsciencelab`, `prototyper`, `workable`, `inspectable`, and `lootdropper` components to provide a complete workflow: activation → staging → completion → loot delivery. Non-master simulation instances are lightweight and non-persistent, returning early from constructors to avoid duplication.

## Usage example
```lua
-- Typical usage within the game engine; manual instantiation is rare.
-- When the lab is built, the component is added automatically:
inst:AddComponent("madsciencelab")
inst.components.madsciencelab.stages = SCIENCE_STAGES
inst.components.madsciencelab.OnStageStarted = OnStageStarted
inst.components.madsciencelab.OnScienceWasMade = OnScienceWasMade
```

## Dependencies & tags
**Components used:** `hauntable`, `inspectable`, `lootdropper`, `madsciencelab`, `prototyper`, `workable`
**Tags:** `structure`, `madsciencelab`, `FX`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `stage` | number | `nil` | Current stage index in `SCIENCE_STAGES`. Set internally via `MadScienceLab:SetStage`. |
| `stages` | table | `SCIENCE_STAGES` | Array of stage configuration tables (time, anim, fire_anim, etc.). |
| `name` | string | `nil` | Optional recipe name for logging/debugging. |
| `product` | string | `nil` | Name of the item to produce upon successful experiment completion. |

## Main functions
### `IsMakingScience()`
* **Description:** Returns whether the lab is currently processing a recipe (i.e., has an active science task).
* **Parameters:** None.
* **Returns:** `boolean` — true if a science task is active (`self.task ~= nil`), otherwise false.

### `StartMakingScience(product, name)`
* **Description:** Starts a new science experiment using the specified product and optional name. Resets the lab to stage 1 and triggers animation and sound changes.
* **Parameters:**
  * `product` (string) — The prefab name of the item to produce upon success.
  * `name` (string?, optional) — Optional human-readable recipe name used for debugging/logging.
* **Returns:** Nothing.
* **Error states:** Does not validate existence of `product`; rely on recipe validation upstream.

### `OnStageStarted(inst, stage)`
* **Description:** Internal callback invoked when the current stage begins. Handles animation switching, sound updates, and particle effect transitions (e.g., fire effects). Called by the `madsciencelab` component.
* **Parameters:**
  * `inst` (Entity) — The lab instance.
  * `stage` (number) — The stage index (1-indexed).
* **Returns:** Nothing.

### `OnScienceWasMade(inst, experiement_id)`
* **Description:** Internal callback invoked when a science experiment completes. Calculates the loot result (based on weighted random selection), spawns and launches the resulting items toward the nearest player, and resets the lab for idle animation.
* **Parameters:**
  * `inst` (Entity) — The lab instance.
  * `experiement_id` (string) — Key from `EXPERIMENT_RESULTS` dict (e.g., `"halloween_experiment_bravery"`).
* **Returns:** Nothing.
* **Error states:** If `experiement_id` is missing or weighted selection yields `nil`, defaults to spawning 1 item.

## Events & listeners
- **Listens to:**
  * `onbuilt` — Triggers `onbuilt()` to play placement animation and sound.
  * `animover` (bound in `OnInactive` and `OnFireFXOver`) — Reverts to idle animation after cooking finishes or fire FX ends.
- **Pushes:**
  * No direct events are pushed by this component or its callbacks.

## Properties — Additional FX entities
| Property | Type | Description |
|----------|------|-------------|
| `inst._goop` | Entity | Child FX entity (goop overlay) with its own `AnimState`, parented to the lab. |
| `inst._glow` | Entity | Child FX entity (glow overlay) with bloom shader, parented to the lab. |
| `inst._firefx` | Entity | Temporary fire FX entity (spawned on `MakeFireFx`, removed on `RemoveFireFx`). |
| `inst.highlightchildren` | table | References child entities (`_glow`) for highlight management. |

## Constants & Tables (internal)
- `SCIENCE_STAGES`: Array of stage definitions (e.g., `time`, `anim`, `fire_anim`). Determines animation and sound timing.
- `EXPERIMENT_RESULTS`: Maps experiment IDs (e.g., `halloween_experiment_bravery`) to outcome tables (e.g., `halloweenpotion_bravery_small` → weight `2`).
- `NUM_TO_SPAWN`: Weighted tables mapping each outcome prefab to a distribution of how many to spawn (e.g., `halloweenpotion_bravery_small` uses `SMALL_TO_SPAWN` distribution).

## FX Prefabs
The file also defines supporting FX prefabs:
- `madscience_lab_goop`: Goop overlay with bloom, shows goop anim (lab hidden).
- `madscience_lab_fire`: Fire particle with dynamic animation from current stage, non-persistent.
- `madscience_lab_glow`: Glow overlay with bloom, shows glow anim (lab/goop hidden), registers `OnEntityReplicated` on client to reparent highlight tracking.

## Notes
- The lab only fully initializes on the master simulation (`TheWorld.ismastersim`); client instances return early with minimal setup.
- The `prototyper` component is conditionally added and later removed during active science work (removed in `OnStageStarted`, added in `OnInactive`).
- The lab uses `weighted_random_choice()` for loot selection and `FindClosestPlayer()` + `LaunchAt()` to deliver results to players.
- `getstatus()` returns `"MIXING"` when science is in progress for use by `inspectable`.
- `onhammered()` triggers loot drop and destroys the lab instantly.
