---
id: warg_mutated_fx
title: Warg Mutated Fx
description: Manages animated fire and ember effects used by the mutated warg’s flamethrower attack, handling collision, temperature damage, visual fading, and particle reuse.
tags: [fx, combat, aoe, lighting]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: eef9ab7f
system_scope: fx
---

# Warg Mutated Fx

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`warg_mutated_breath_fx` and `warg_mutated_ember_fx` are FX prefabs responsible for visual and functional effects of the mutated warg’s flamethrower attack. The breath FX acts as an AOE damage zone that applies coldfire temperature effects and applies damage per tick, while embers are ground-aligned particles that can produce fizzle effects and serve as slippery hazards when iced. Both prefabs support fading, reuse via object pooling, and synchronization across networked clients. They are typically spawned by the warg’s combat logic and interact with the `combat`, `planardamage`, `temperature`, `updatelooper`, and `slipperyfeettarget` components.

## Usage example
```lua
-- Spawn a breath FX and configure its parameters
local fx = SpawnPrefab("warg_mutated_breath_fx")
fx:SetFXOwner(warg, warg)  -- owner = attacker
fx:ConfigureDamage(50, 15) -- default damage, planar damage
fx:RestartFX(1, "latefade", nil, true, false) -- tall flame, no ice

-- Spawn and configure an ember FX
local ember = SpawnPrefab("warg_mutated_ember_fx")
ember:SetFXOwner(warg)
ember:RestartFX(0.8, "nofade")
ember:SetIced() -- makes it slippery and cold
```

## Dependencies & tags
**Components used:** `combat`, `planardamage`, `temperature`, `updatelooper`, `slipperyfeettarget`
**Tags:** Adds `FX`, `NOCLICK` to both prefabs.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | Entity? | `nil` | The entity that spawned this FX (for pooling and cleanup). |
| `attacker` | Entity? | `owner` | The entity performing the attack (used for damage computation and ally checks). |
| `tallflame` | boolean | `false` | Indicates whether the breath flame is a tall variant. |
| `icedember` | boolean | `false` | (Only for ember FX) Marks the ember as icy, enabling slippery behavior. |
| `fadeoption` | string? | `nil` | Controls fade timing: `"latefade"`, `"nofade"`, or default. |
| `scale` | number | `1` | Local scale applied to the FX. |
| `brightness` | net_tinybyte | `7` | Networked brightness value; drives visual glow via `OverrideBrightness`. |
| `fade` | net_smallbyte | `2` | (Ember only) Networked fade value controlling opacity and lifetime. |
| `fizzle` | net_smallbyte | `0` | (Ember only) Controls fizzle animation and fizzle timing. |
| `targets` | table | `{}` | Tracks per-target cooldowns (tick-based) to avoid duplicate hits. |
| `spawn_embers_task` | Task? | `nil` | Delayed task to spawn embers during flame lifecycle. |
| `kill_fx_task` | Task? | `nil` | Delayed task to terminate FX (fade then remove). |
| `kill_ember_task` | Task? | `nil` | (Ember only) Delayed task to begin ember fadeout. |
| `updatingbrightness` | boolean | `false` | Tracks whether brightness updates are active. |
| `updating` | boolean | `false` | (Ember only) Tracks fade update loop status. |
| `damage_configured` | boolean | `false` | Internal flag to restore original combat/planardamage values after AOE. |
| `embers` | Entity? | `nil` | (Breath only) Child ember FX instance; reused from pool if available. |

## Main functions
### `SetFXOwner(inst, owner, attacker)`
*   **Description:** Sets the owner and optional attacker entity references for this FX. Used by the FX to access pools and determine attack context (e.g., ally checks).
*   **Parameters:** 
    - `owner` (Entity) — the spawning entity (for pooling and cleanup).
    - `attacker` (Entity?) — optional; defaults to `owner`.
*   **Returns:** Nothing.

### `RestartFX(inst, scale, fadeoption, targets, tallflame, icedember)`
*   **Description:** Initializes or reactivates the FX. Plays animations, sets up tasks (spawn embers, fade/kill), configures scale, and begins the AOE hit loop for the breath FX.
*   **Parameters:** 
    - `scale` (number?) — local scale multiplier; defaults to `1`.
    - `fadeoption` (string?) — `"latefade"` or `"nofade"`; others trigger immediate fade start.
    - `targets` (table?) — initial target tracking table; defaults to `{}`.
    - `tallflame` (boolean) — if `true`, uses tall flame variant and longer duration.
    - `icedember` (boolean) — (Ember only) marks the FX as icy.
*   **Returns:** Nothing.

### `ConfigureDamage(inst, default_damage, base_planar_damage)`
*   **Description:** Temporarily overrides combat and planar damage for AOE application, then restores original values after each hit iteration.
*   **Parameters:** 
    - `default_damage` (number) — damage to use for `combat.defaultdamage`.
    - `base_planar_damage` (number) — damage to use for `planardamage.basedamage`.
*   **Returns:** Nothing.

### `ExtendFx(inst, time)`
*   **Description:** Extends the remaining lifetime of the FX by rescheduling the kill and ember spawn tasks.
*   **Parameters:** 
    - `time` (number) — ignored in current implementation; duration is recomputed from `tallflame`.
*   **Returns:** Nothing.

### `KillFX(inst, fadeoption)`
*   **Description:** Initiates the FX termination sequence: plays a fade-out animation, cancels pending tasks, and removes child embers or returns them to the pool. If `fadeoption` is `"nofade"`, starts immediate fade first.
*   **Parameters:** 
    - `fadeoption` (string?) — if `"nofade"`, triggers `StartFade` before anim fade.
*   **Returns:** Nothing.

### `OnUpdateHitbox(inst)`
*   **Description:** (Breath FX only) Runs every tick while active. Computes AOE collision against valid entities in range, applies coldfire temperature effect, and triggers `combat:DoAttack` once per target per frame window (configurable via `hit_frames`).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetIced(inst)`
*   **Description:** (Ember FX only) Marks the FX as icy, enables the `iced` visual, and attaches the `slipperyfeettarget` component to allow it to be detected as a slippery zone.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ember_RestartFX(inst, scale, fadeoption)`
*   **Description:** (Ember FX only) Restarts the ember FX with randomized animation, frame, orientation, scale, and color transparency based on `fadeoption`.
*   **Parameters:** 
    - `scale` (number?) — scale multiplier.
    - `fadeoption` (string?) — `"nofade"`, `"latefade"`, or default; affects initial color and fizzle timing.
*   **Returns:** Nothing.

### `ember_KillFX(inst)`
*   **Description:** (Ember FX only) Starts the fade-out process, potentially delayed for icy embers using a fixed duration.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** 
  - `animqueueover` — triggers `OnAnimQueueOver` to return breath FX to the owner’s flame pool or remove it.
  - `brightnessdirty` — triggers `OnBrightnessDirty` on non-_master sim to update brightness.
  - `fadedirty` — triggers `ember_OnFadeDirty` on non-_master sim to update ember fading.
- **Pushes:** No events directly, but relies on `inst.components.updatelooper` to manage update functions.
