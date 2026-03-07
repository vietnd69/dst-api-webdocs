---
id: alterguardian_laser
title: Alterguardian Laser
description: A temporary damage-dealing projectile used by the Alterguardian boss that creates visual FX, scorches the ground, and triggers knockback, freezing thawing, and sanity effects on hit targets.
tags: [combat, boss, fx, knockback]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f5761b0b
system_scope: combat
---

# Alterguardian Laser

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `alterguardian_laser` is a short-lived prefabricated entity that functions as a projectile for the Alterguardian boss's phase-3 laser attack. When spawned and triggered, it performs area-of-effect combat detection, applies damage and status effects (freezing thawing, temperature increase, sanity loss), and triggers knockback. It also spawns associated visual FX (scorch marks, smoke trails, hit sparks) and modifies lighting. It is not persisted and is removed shortly after activation.

This prefab exists in multiple variants:
- `alterguardian_laser` — full-featured laser with animation, light, and FX.
- `alterguardian_laserempty` — minimal variant for cases where visual FX are not desired.
- `alterguardian_laserscorch` — handles ground burn FX with time-based colour fading.
- `alterguardian_lasertrail` — smoke trail FX with optional fast-forward support.
- `alterguardian_laserhit` — client-only hit marker FX attached to a target entity.

## Usage example
```lua
local laser = SpawnPrefab("alterguardian_laser")
laser.Transform:SetPosition(x, y, z)
laser.caster = caster
laser.Trigger(0, nil, nil, false, 1, nil, nil, 1, 1, nil)
```

## Dependencies & tags
**Components used:** `combat`, `light`, `animstate`, `transform`, `network`, `colouradder`, `bloomer`, `freezable`, `temperature`, `sanity`, `workable`, `pickable`, `mine`, `inventory`, `inventoryitem`, `health`, `childspawner`, `spawner`

**Tags added/checked:** Adds `notarget`, `hostile`, `FX`, `NOCLICK`, `CLASSIFIED` to appropriate variants. Checks tags like `heavyarmor`, `heavybody`, `_inventoryitem`, `stump`, `intense`, and workable actions (`CHOP`, `HAMMER`, `MINE`, `DIG`, `NPC_workable`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `caster` | entity or nil | `nil` | The entity responsible for firing the laser; used for attack attribution and knockback source. |
| `overridedmg` | number or nil | `nil` | Temporary override damage value applied during laser impact. |
| `overridepdp` | number or nil | `nil` | Temporary override `playerdamagepercent` used when `caster` is a player. |
| `persists` | boolean | `false` | Set to false to prevent saving; laser is always ephemeral. |
| `task` | task or nil | `nil` | Internal timer task used for self-destruction. |
| `_fade` | net_byte | (client) or (server) | Networked byte used by scorch FX to track fade progress. |
| `flash` | number | `0` | Internal variable used by laser hit FX to manage flash intensity on the target. |

## Main functions
### `Trigger(delay, targets, skiptoss, skipscorch, scale, scorchscale, hitscale, heavymult, mult, forcelanded)`
*   **Description:** Schedules the laser to activate. If a task is already running, cancels it first. Calls `DoDamage` after the delay or immediately if `delay` is `0`.
*   **Parameters:**
    - `delay` (number) — delay in seconds before damage logic executes.
    - `targets`, `skiptoss` (table, nil) — tracking tables used internally to avoid duplicate processing.
    - `skipscorch` (boolean, optional) — if true, no ground scorch is spawned.
    - `scale`, `scorchscale`, `hitscale` (number, nil) — scale multipliers for laser hit FX, scorch FX, and hit radius respectively.
    - `heavymult`, `mult` (number, nil) — knockback strength multipliers for heavy-armoured or regular targets.
    - `forcelanded` (boolean, nil) — passed to knockback event.
*   **Returns:** Nothing.
*   **Error states:** If `delay` is non-zero, it schedules a delayed task; otherwise, executes immediately.

### `OverrideDamage(damage, playerdamagepercent)`
*   **Description:** Sets temporary override values for damage and player damage percentage applied during this laser's lifetime.
*   **Parameters:**
    - `damage` (number) — damage value to apply (stored in `inst.overridedmg`).
    - `playerdamagepercent` (number) — `playerdamagepercent` override (stored in `inst.overridepdp`).
*   **Returns:** Nothing.

### `SetTarget(target)`
*   **Description:** Attaches the hit FX (`alterguardian_laserhit`) to a target entity. Applies bloom and additive colour flash effects, then schedules periodic updates that fade them out.
*   **Parameters:**
    - `target` (entity) — entity to visually mark as hit.
*   **Returns:** Nothing.
*   **Error states:** Cancels the initial removal task and exits early if `target` becomes invalid.

### `UpdateHit(inst, target)`
*   **Description:** Periodic callback used by `alterguardian_laserhit` to fade flash and bloom effects on the hit target.
*   **Parameters:**
    - `inst` (entity) — the hit FX instance.
    - `target` (entity) — the target being marked.
*   **Returns:** Nothing.
*   **Error states:** Removes itself automatically when flash reaches `0`.

### `Scorch_OnUpdateFade(inst)` and `Scorch_OnFadeDirty(inst)`
*   **Description:** Internal functions managing the colour fading of the scorch FX (`alterguardian_laserscorch`). `Scorch_OnUpdateFade` decrements the `_fade` counter periodically; `Scorch_OnFadeDirty` adjusts the additive and highlight colours based on the current fade stage (blue tint, normal tint, fade-out).
*   **Parameters:**
    - `inst` (entity) — the scorch FX instance.
*   **Returns:** Nothing.

### `FastForwardTrail(inst, pct)`
*   **Description:** Fast-forwards the smoke trail animation to a specified percentage (used for precise visual timing). Cancels any existing removal task and reschedules it.
*   **Parameters:**
    - `inst` (entity) — the trail FX instance.
    - `pct` (number, clamped `0` to `1`) — animation progress as a fraction.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `fadedirty` — used by `alterguardian_laserscorch` on client to update visual state after a `_fade` change.
  - `onremove` — registered automatically by `bloomer` and `colouradder` components when associated FX sources are removed.
- **Pushes:**
  - `onalterguardianlasered` — sent to each entity struck by the laser before applying effects.
  - `knockback` — sent with `{ knocker, radius, strengthmult, forcelanded }` for knockback-capable targets.
  - `fadedirty` — server-side only; triggers client-side update for scorch fade.
  - `spawnnewboatleak` — sent to platforms if the laser hits near a boat.
  - `healthdelta`, `sanitydelta`, `temperaturedelta` — internally via `Health:DoDelta`, `Sanity:DoDelta`, `Temperature:DoDelta`.