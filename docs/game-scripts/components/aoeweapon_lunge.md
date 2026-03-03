---
id: aoeweapon_lunge
title: Aoeweapon Lunge
description: Implements a forward-lunge area-of-effect weapon mechanic that calculates directional hit and toss zones, then triggers OnHit/OnToss callbacks with physics-aware overlap checks.
tags: [combat, aoe, movement]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 12ecd771
system_scope: combat
---

# Aoeweapon Lunge

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`AOEWeapon_Lunge` extends `AOEWeapon_Base` to provide a directional lunge-style attack. It computes a swept rectangular zone from a starting point toward a target position, detecting entities that fall within this area (for damage via `OnHit`) and tossable items (for physical tossing via `OnToss`). It also optionally spawns trail FX and supports custom pre/post-lunge callbacks. Designed for mobile or charging attack types (e.g., spear throws, boomerang thrusts), it uses precise line-segment distance checks against physics radiuses.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("aoeweapon_lunge")
inst:AddComponent("weapon")
inst:AddComponent("combat")

inst.components.aoeweapon_lunge:SetSideRange(1.5)
inst.components.aoeweapon_lunge:SetTrailFX("sparks", 1.0)
inst.components.aoeweapon_lunge:SetSound("sound/actions/lunge")

inst.components.aoeweapon_lunge:DoLunge(inst, Vector3(0, 0, 0), Vector3(5, 0, 0))
```

## Dependencies & tags
**Components used:** `aoeweapon_base`, `combat`, `health`, `weapon`  
**Tags:** Adds `"aoeweapon_lunge"` to the host entity via `inst:AddTag("aoeweapon_lunge")`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `siderange` | number | `1` | Half-width (in world units) of the lunge sweep area, added to each target's physics radius. |
| `physicspadding` | number | `3` | Extra padding (in world units) added to detection radii to ensure overlap robustness. |
| `fxprefab` | string\|nil | `nil` | Prefab name for trail effect; `nil` disables trail spawning. |
| `fxspacing` | number\|nil | `nil` | Spacing (in world units) between trail FX; ignored if `fxprefab` is `nil`. |
| `onprelungefn` | function\|nil | `nil` | Callback `(entity, doer, startpos, targetpos)` executed before hit/toss processing. |
| `onlungedfn` | function\|nil | `nil` | Callback `(entity, doer, startpos, targetpos)` executed after hit/toss processing. |
| `sound` | string\|nil | `nil` | Path to sound to play (not used directly by this class;留给 subclasses or manual triggering). |

## Main functions
### `SetSideRange(range)`
* **Description:** Sets the lateral tolerance (half-width) for hit/toss detection, which combines with each target's radius to define the effective sweep width. Larger values increase the “sweepiness” of the attack.
* **Parameters:** `range` (number) — the new side range value in world units.
* **Returns:** Nothing.

### `SetOnPreLungeFn(fn)`
* **Description:** Registers a callback invoked immediately before hit/toss computations begin. Useful for pre-attack visual or sound effects, state changes, or logging.
* **Parameters:** `fn` (function\|nil) — signature: `fn(entity, doer, startpos: Vector3, targetpos: Vector3)`.
* **Returns:** Nothing.

### `SetOnLungedFn(fn)`
* **Description:** Registers a callback invoked at the end of the lunge, after FX trail and all hit/toss processing are complete.
* **Parameters:** `fn` (function\|nil) — signature: `fn(entity, doer, startpos: Vector3, targetpos: Vector3)`.
* **Returns:** Nothing.

### `SetTrailFX(prefab, spacing)`
* **Description:** Configures a trail of FX entities spawned along the lunge path. The trail uses a sine-based fade in density and motion based on progress.
* **Parameters:**  
  `prefab` (string\|nil) — prefab name to spawn; `nil` disables trail.  
  `spacing` (number\|nil) — separation distance between spawned FX (ignored if `prefab` is `nil`).
* **Returns:** Nothing.

### `DoLunge(doer, startingpos, targetpos)`
* **Description:** Executes the lunge attack: computes hit and toss zones from `startingpos` to `targetpos` using swept line segments, damages/interacts with hit targets, and tosses eligible items. Also spawns FX trail if configured. Modifies the `combat` component's area damage and temporarily adjusts weapon damage.
* **Parameters:**  
  `doer` (Entity) — the entity performing the attack; must have a `combat` component.  
  `startingpos` (Vector3) — world position where the lunge begins (`x`, `z` used, `y` ignored).  
  `targetpos` (Vector3) — world position where the lunge ends (`x`, `z` used, `y` ignored).
* **Returns:** `true` on successful execution; `false` if missing required data (e.g., `nil` positions or `doer` lacks `combat`).
* **Error states:** Returns `false` early if `startingpos`, `targetpos`, `doer`, or `doer.components.combat` are `nil`. Entities are skipped if `IsInLimbo()`, `IsDead()` (via `health:IsDead()`), or mismatch tag filters (`self.notags`, `self.combinedtags`). Item tosses are filtered via `TOSS_MUSTTAGS`/`TOSS_CANTTAGS` and vertical height (`pv._ < 0.2`). The function preserves original weapon stats (`attackwear`, `damage`) on exit.

## Events & listeners
None identified.
