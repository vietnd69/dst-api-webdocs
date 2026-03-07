---
id: warg_gooicing
title: Warg Gooicing
description: A projectile component that applies slime-like sticky damage to targets, pinning them or dealing direct damage on impact.
tags: [combat, projectile, sticky, boss]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 23a11a56
system_scope: combat
---

# Warg Gooicing

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`warg_gooicing` is a projectile prefab used by Wargs during the Winter Feast event. Upon impact with a surface or entity, it attempts to stick to a valid target using the `pinnable` component; if pinning fails or the target is already pinned/dead, it deals direct damage via the `combat` component. The projectile is short-lived, non-persistent, and designed for rapid deployment during boss encounters.

## Usage example
This component is not manually added to entities by modders. It is instantiated internally as a projectile prefabricated with the `warg_gingerbread_bomb` model. Example usage within mod code (e.g., to spawn manually) would be:
```lua
local proj = SpawnPrefab("warg_gooicing")
proj.Transform:SetPosition(x, y, z)
proj._caster = mywarg
proj.Physics:PushVelocity(vx, vy, vz)
```

## Dependencies & tags
**Components used:** `pinnable`, `health`, `combat`, `locomotor`, `transform`, `animstate`, `soundemitter`, `physics`, `network`  
**Tags:** Adds `projectile`; checks `_combat`, `INLIMBO`, `fire`, `burnt`, `gingerbread`

## Properties
No public properties. The component defines only local constants and internal state (e.g., `GOO_TARGET_MUST_TAGS`, `splashfxlist`) and uses instance fields like `inst._caster`.

## Main functions
### `doprojectilehit(inst, other)`
*   **Description:** Core logic executed on projectile impact. Determines a target within `TUNING.WARG_GOO_RADIUS` (or uses `other`), then attempts to pin it using `pinnable:Stick()` if eligible, otherwise deals damage. Triggers sound/visual splat effects.
*   **Parameters:**  
    `inst` (Entity) — the projectile instance.  
    `other` (Entity?, optional) — specific hit target; if omitted, auto-targeting via `FindEntity()` is used.  
*   **Returns:** Nothing.  
*   **Error states:** No target meets criteria (`other == nil` or `other == caster` or missing `combat` component) → defaults to ground/surface impact.

### `TestProjectileLand(inst)`
*   **Description:** Periodically checks if the projectile has landed on the ground (Y ≤ physics radius + 0.05). If so, triggers `doprojectilehit` and removes the projectile.
*   **Parameters:** `inst` (Entity) — the projectile instance.  
*   **Returns:** Nothing.  

### `oncollide(inst, other)`
*   **Description:** Physics collision callback. Triggers `doprojectilehit` if colliding with a valid `_combat`-tagged entity that is not `gingerbread`.
*   **Parameters:** `inst` (Entity) — the projectile. `other` (Entity) — the colliding entity.  
*   **Returns:** Nothing.  
*   **Error states:** Skips impact logic if `other` is invalid, missing `_combat` tag, or has `gingerbread` tag.

### `projectilefn()`
*   **Description:** Prefab constructor. Sets up physics, animation, sound, and tags; adds `locomotor` and collision callbacks on the master sim only.
*   **Parameters:** None (used as `Prefab` callback).  
*   **Returns:** Entity instance (`inst`) fully configured for projectile behavior.  
*   **Error states:** Client-side replicas skip physics setup (`if not TheWorld.ismastersim then return inst end`).

## Events & listeners
- **Listens to:** None (uses periodic tasks instead of events).
- **Pushes:** None (external events like `"pinned"` are pushed by `pinnable:Stick()`, not this component directly).