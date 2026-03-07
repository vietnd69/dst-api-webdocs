---
id: hitsparks_fx
title: Hitsparks Fx
description: Creates visual spark particle effects at impact points with dynamic colour flashing via the colouradder component, used for combat hit feedback in lava arena and similar scenarios.
tags: [fx, combat, visual]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1307ad8b
system_scope: fx
---

# Hitsparks Fx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`hitsparks_fx` is a prefab factory that generates non-persistent, non-networked visual effect entities used to render dynamic spark effects on hit. It spawns a short-lived entity with an animation, applies flash-colour pulses via the `colouradder` component, and coordinates positioning using transform data from the target (and optionally attacker/projectile). It relies on `updatelooper` to time the flash steps and `colouradder` to layer colour over the target entity. Designed specifically for lava arena hit feedback but reusable for generic combat hits.

## Usage example
```lua
-- Spawn a basic hit sparks effect at a target's location
local fx = Prefab("hitsparks_fx", fn, assets)()
fx:Setup(attacker, target, projectile, {1, 0.5, 0})  -- red-orange flash
```

## Dependencies & tags
**Components used:** `updatelooper`, `colouradder`, `animstate`, `transform`, `network`
**Tags:** Adds `FX` to spawned effect entities.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `target` | entity reference | `nil` | Entity being hit; used to position and colour-add flash. |
| `flashstep` | number | `0` | Internal counter for flash progression (1–4). |
| `flashcolour` | table of `{r,g,b}` or `nil` | `nil` | Optional base colour used to tint flash steps. |
| `OnRemoveEntity` | function | `nil` | Callback triggered when the FX is removed. |
| `flip` | `net_bool` proxy | `nil` | Networked boolean controlling horizontal flip of animation. |
| `black` | `net_bool` proxy | `nil` | Networked boolean for black-tinted animation mode. |

## Main functions
### `PushColour(inst, r, g, b)`
* **Description:** Ensures the `colouradder` component exists on `inst.target` and pushes a new colour layer using `inst` as the source. Alpha is fixed at `0`.
* **Parameters:**
  * `inst` (entity) — Effect instance acting as the colour source.
  * `r`, `g`, `b` (numbers) — RGB colour values in `[0,1]`.
* **Returns:** Nothing.

### `PopColour(inst)`
* **Description:** Removes the colour layer previously added by `PushColour`, using `inst` as the source key.
* **Parameters:**
  * `inst` (entity) — Effect instance used as the source when pushing colour.
* **Returns:** Nothing.

### `UpdateFlash(inst)`
* **Description:** Incrementally modifies the flash intensity using `colouradder` over four steps (fade-in/fade-out). Stops when `flashstep >= 4` and removes itself from `updatelooper`.
* **Parameters:**
  * `inst` (entity) — Effect instance running the flash loop.
* **Returns:** Nothing.
* **Error states:** Returns early without change if `inst.target` is invalid or flash sequence complete.

### `StartFlash(inst, target, flashcolour)`
* **Description:** Initializes the flash effect: adds `updatelooper`, registers `UpdateFlash` for updates, records `target` and optional `flashcolour`, then triggers the first flash step.
* **Parameters:**
  * `inst` (entity) — Effect instance.
  * `target` (entity) — Entity being hit (used to set `inst.target`).
  * `flashcolour` (table or `nil`) — `{r,g,b}` base colour or `nil` for white flash.
* **Returns:** Nothing.

### `Setup(inst, attacker, target, projectile, flashcolour)`
* **Description:** Positions the effect at the hit point relative to the target's radius and orientation. Uses projectile or attacker angle to offset the spawn point. Then starts the flash.
* **Parameters:**
  * `inst` (entity) — Effect instance.
  * `attacker` (entity or `nil`) — Entity initiating the hit.
  * `target` (entity) — Entity being hit.
  * `projectile` (entity or `nil`) — Projectile involved, if any.
  * `flashcolour` (table or `nil`) — Flash tint.
* **Returns:** Nothing.

### `SetupReflect(inst, attacker, target, projectile, flashcolour)`
* **Description:** Positions and orients the effect for reflected projectiles. Computes direction vector and uses `math.atan2` to derive rotation. Applies a 90-degree offset.
* **Parameters:**
  * Same as `Setup`, plus internal directional calculation logic.
* **Returns:** Nothing.

### `SetupPiercing(inst, attacker, target, projectile, flashcolour, inverted, offset_y)`
* **Description:** Positions and orients the effect along the projectile's path for piercing hits. Adjusts rotation by `+180` degrees if `inverted` is false. Supports custom `offset_y`.
* **Parameters:**
  * Same as `Setup`, plus:
    * `inverted` (boolean) — Controls whether rotation is reversed.
    * `offset_y` (number or `nil`) — Custom vertical offset; defaults to `1 + math.random()`.
* **Returns:** Nothing.

### `PlaySparksAnim(proxy, horizontal)`
* **Description:** Spawns and configures a temporary local-only entity to play the spark animation. Handles flip, black tint, scale, and orientation.
* **Parameters:**
  * `proxy` (entity proxy) — Reference entity for animation mirroring (`proxy.flip`, `proxy.black`).
  * `horizontal` (boolean) — If true, sets `ANIM_ORIENTATION.OnGround`.
* **Returns:** Nothing.

### `MakeFX(name, horizontal, setupfn)`
* **Description:** Factory function that returns a prefab definition for hitspark variants. Configures networked proxies, sets non-persistent, auto-deletes after 1 second, and schedules local animation spawn.
* **Parameters:**
  * `name` (string) — Prefab name (`"hitsparks_fx"`, `"hitsparks_reflect_fx"`, `"hitsparks_piercing_fx"`).
  * `horizontal` (boolean) — Passed to `PlaySparksAnim`.
  * `setupfn` (function) — One of `Setup`, `SetupReflect`, or `SetupPiercing`.
* **Returns:** Prefab definition function.

## Events & listeners
- **Listens to:** `animover` — Removes the entity when the spark animation completes (set in `PlaySparksAnim`).
