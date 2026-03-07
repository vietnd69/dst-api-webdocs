---
id: wagboss_beam
title: Wagboss Beam
description: Handles the visual and gameplay effects of the Wagboss beam attack, including targeting, AoE damage, and ring animation synchronization.
tags: [combat, fx, boss]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 50b8566c
system_scope: fx
---

# Wagboss Beam

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wagboss_beam` is a non-persistent FX prefab that represents the Wagboss's beam attack. It serves as a central controller for both visual effects (including ring marker and light behavior) and gameplay logic (AoE damage, lunar burn application, and environmental interaction). It uses the `combat`, `planardamage`, and `updatelooper` components to manage damage application, area-of-effect targeting, and frame-accurate animation synchronization.

## Usage example
```lua
-- The prefab is instantiated internally by the Wagboss AI/brain.
-- Example of adding tracking support manually (not typical for end-user mods):
local beam = Prefab("wagboss_beam_fx")
beam.components.combat:SetDefaultDamage(0)
beam.components.planardamage:SetBaseDamage(TUNING.WAGBOSS_BEAM_PLANAR_DAMAGE)
beam:DoTaskInTime(6, function(b) b:Remove() end)
```

## Dependencies & tags
**Components used:** `updatelooper`, `combat`, `planardamage`, `colouradder` (added dynamically), `health` (used via `DoDelta`, `RegisterLunarBurnSource`, `UnregisterLunarBurnSource`, `IsDead`, `lastlunarburnpulsetick`), `grogginess` (used via `MaximizeGrogginess`), `workable`, `pickable`, `rider`, `inventoryitem`, `mine`, `spawner`, `childspawner`, `commander`.  
**Tags:** Adds `FX`, `NOCLICK` to itself and `ring`; dynamically adds `colouradder` to affected entities.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `targets` | table | `nil` | Map of affected entities (key: entity, value: tick when last hit). Initialized on beam activation. |
| `coloured1`, `coloured2` | table | `{}` | Double-buffered maps tracking current colour intensity applied per entity (for fade-out). Initialized on beam activation. |
| `firsthit` | boolean | `true` | Used to distinguish initial vs. repeated hits. Reset each frame in `UpdateBeamAOE`. |
| `trackingt`, `trackinglen` | number | `0` / `0` | Tracking progress (current time and animation length) for smooth transition to the target. |
| `target` | entity | `nil` | The entity the beam is currently tracking toward. |
| `caster` | entity | `nil` | Optional reference to the entity casting the beam (for commander check). |
| `ring` | entity | `nil` | Local-only ring marker entity (created only on non-dedicated clients). |
| `fadet` | number | `0` | Time counter for the post-beam colour fade-out phase. |

## Main functions
### `StartPreSound(inst)`
*   **Description:** Starts the initial rising swoosh sound (`"rifts5/wagstaff_boss/beam_up"`).
*   **Parameters:** `inst` (entity) — the beam entity.
*   **Returns:** Nothing.

### `TrackTarget(inst, target, x0, z0)`
*   **Description:** Initiates beam tracking toward a specific target entity during the pre-animation phase. Adjusts position to slightly overshoot the target before locking on.
*   **Parameters:**  
    - `inst` (entity) — the beam entity.  
    - `target` (entity) — the target entity to track.  
    - `x0` (number) — initial X position.  
    - `z0` (number) — initial Z position.
*   **Returns:** Nothing.
*   **Error states:** Only activates if the beam is in `"beam_pre"` animation and `inst.target` is not already set.

### `UpdateTracking(inst, dt)`
*   **Description:** Smoothly moves the beam toward the tracked target using an `outQuad` easing curve over the duration of the pre-animation.
*   **Parameters:** `inst` (entity), `dt` (number) — delta time (scaled).
*   **Returns:** Nothing.
*   **Error states:** Cancels itself and clears `inst.target` if the target becomes invalid or tracking time exceeds animation length.

### `StartBeamAOE(inst)`
*   **Description:** Enables area-of-effect targeting logic and begins the loop sound. Called after the pre-animation completes.
*   **Parameters:** `inst` (entity) — the beam entity.
*   **Returns:** Nothing.

### `UpdateBeamAOE(inst, dt)`
*   **Description:** Main loop logic for applying beam effects (damage, harvesting, tossing items, lunar burns). Runs every frame while the beam is active (during loop and post).
*   **Parameters:** `inst` (entity), `dt` (number) — unused (actual time tracked internally via ticks).
*   **Returns:** Nothing.
*   **Error states:**  
    - Skips entities with `FX`, `DECOR`, `INLIMBO`, `flight`, or `invisible` tags.  
    - Respects `commander` membership (soldiers are immune).  
    - Removes lunar burn source when target leaves beam or dies.

### `KillFx(inst)`
*   **Description:** Transitions to the post-animation (`"beam_pst"`), stops the loop sound, schedules entity removal, and cleans up colour and lunar burn effects on affected entities.
*   **Parameters:** `inst` (entity) — the beam entity.
*   **Returns:** Nothing.

### `UpdateColouredFade(inst, dt)`
*   **Description:** Applies fade-out easing to the colour overlay applied to affected entities during the post-animation.
*   **Parameters:** `inst` (entity), `dt` (number) — delta time.
*   **Returns:** Nothing.

### `UpdateBeamLightPre(inst)`
*   **Description:** Animates the beam light radius during the pre-animation (ramps up after frame 28).
*   **Parameters:** `inst` (entity) — the beam entity.
*   **Returns:** Nothing.

### `UpdateBeamLightPst(inst)`
*   **Description:** Animates the beam light radius and final state during the post-animation.
*   **Parameters:** `inst` (entity) — the beam entity.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `animsyncdirty` (client-side only) — triggers `OnAnimSync_Client` for animation synchronization.  
  - `animover` (client-side only) — triggers `inst.Remove` to destroy the entity after the post-animation.  
  - `onremove` (for `ring` entity) — used by `colouradder` logic to clean up colour sources when entities are removed.
- **Pushes:**  
  - None directly (relies on attached components to push events such as `healthdelta`, `picked`, etc.).