---
id: wagdrone_projectile
title: Wagdrone Projectile
description: Manages the behavior and impact effects of a wagdrone's electric projectile during its descent and impact phases in DST.
tags: [combat, fx, projectile, lightning]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1d66ea03
system_scope: fx
---

# Wagdrone Projectile

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wagdrone_projectile` is a client-side prefab for rendering a wagdrone's electric projectile during flight and impact. It handles visual effects such as light intensity, animation states, and base flashes upon hitting the ground. It interacts with the `combat`, `updatelooper`, and `health` components for logic execution on the master simulation, while managing FX-specific tasks like frame synchronization and cleanup on the client. This entity is spawned as part of the wagdrone's attack sequence and briefly performs area-of-effect electric damage at impact.

## Usage example
```lua
-- Typically instantiated internally by wagdrone logic; usage in mods would be advanced:
local projectile = Prefab("wagdrone_projectile_fx", fn, assets)()
projectile.Launch(projectile, x, y, z)  -- triggers flight → impact sequence
```

## Dependencies & tags
**Components used:** `updatelooper`, `combat` (on master), `transform`, `animstate`, `soundemitter`, `light`, `network`, `follower`  
**Tags:** `FX`, `NOCLICK`, `notarget`, `wagdrone_projectile` (internal)  
**Networked:** `showbase` (client-server sync via `net_bool`)

## Properties
No public properties. The following local/state variables are used internally in `OnUpdate`:
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `targets` | table | `nil` → `{}` after impact | Tracks entities already damaged during the hit phase. |
| `fadet` | number | `0` | Accumulates elapsed time since impact for light intensity fading. |
| `fadeflicker` | number | `0` | Simple frame counter (mod 4) used to simulate flicker. |

## Main functions
### `Launch(inst, x, y, z)`
* **Description:** Initiates the projectile's flight trajectory. Sets physics velocity downward, enables light, stops follower parenting, and starts the update loop.
* **Parameters:**  
  `x`, `y`, `z` (number) — World coordinates for the projectile's launch position.
* **Returns:** Nothing.
* **Error states:** None documented.

### `AttachTo(inst, parent)`
* **Description:** Attaches the projectile to a parent entity using the `Follower` component for synchronized movement. Plays a looping charging sound.
* **Parameters:**  
  `parent` (Entity) — Entity to follow (typically the wagdrone).
* **Returns:** Nothing.

### `OnUpdate(inst, dt)`
* **Description:** Core logic for projectile descent and impact. Handles physics fall, light adjustment, impact detection, and area-of-effect electric attacks upon landing.
* **Parameters:**  
  `dt` (number) — Delta time in seconds.
* **Returns:** Nothing.
* **Error states:** Returns early during descent (`y >= 0.1`) to continue physics fall; damage logic only runs after impact (`y < 0.1`). Non-viable or dead targets are skipped.

### `DisableHits(inst, OnUpdate)`
* **Description:** Shuts down hit detection after the impact duration. Disables the base flash effect and removes the update function.
* **Parameters:**  
  `OnUpdate` (function) — The update function to remove from `updatelooper`.
* **Returns:** Nothing.

### `OnShowBase(inst)`
* **Description:** Creates and configures a client-only FX entity (`wagdrone_projectile`) that mirrors the projectile's current frame for a ground-flash visual effect upon impact.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Early return if `showbase` is `false`. Only runs on the master client when not dedicated server.

## Events & listeners
- **Listens to:** `showbasedirty` — Triggers `OnShowBase` on the client to regenerate the FX effect.
- **Pushes:** None directly (relies on `combat:DoAttack` and `v:PushEventImmediate("electrocute")` for event dispatch to target entities).