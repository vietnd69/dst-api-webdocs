---
id: lavaarena_peghook
title: Lavaarena Peghook
description: A Lava Arena enemy mob prefab that tracks mobility state via the LavaArenaMobTracker and spawns projectiles and effects during combat.
tags: [combat, ai, boss]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d2aafe63
system_scope: entity
---

# Lavaarena Peghook

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `lavaarena_peghook` is a Lava Arena enemy mob prefab responsible for spawning and managing multiple sub-prefabs (projectile, spit FX, hit FX, splash FX, and damage-over-time effect) used in the arena combat system. It is registered with the `lavaarenamobtracker` component on server initialization to track its activity and lifecycle. The prefab itself contains no components or logic beyond entity setup — all gameplay behavior is handled by attached prefabs and external event handlers (e.g., `peghook_postinit`).

## Usage example
```lua
-- The prefab is instantiated automatically by the game when spawned in the Lava Arena.
-- As a modder, you would not typically spawn this prefab manually.
-- Example of spawning its projectile sub-prefab:
local projectile = SpawnPrefab("peghook_projectile")
if projectile ~= nil and projectile.components.complexprojectile then
    projectile.components.complexprojectile:FireProjectile(target, speed, damage)
end
```

## Dependencies & tags
**Components used:** None (the prefab does not add or directly access any components).
**Tags:** `LA_mob`, `monster`, `hostile`, `fossilizable`, `NOCLICK`, `FX`, `weapon`, `projectile`, `complexprojectile`, `CLASSIFIED`.

## Properties
No public properties are defined in this file.

## Main functions
None. This file defines only prefab constructors and helper functions used to build sub-prefabs; no public functions are exposed by the main `peghook` prefab instance.

## Events & listeners
- **Listens to:** `onremove` (on tails and `lavaarenapeghook_projectile`) to cleanup tracking entries; `animover` (on FX prefabs) to auto-remove entities after animation completes.
- **Pushes:** `startcorrosivedebuff` (from `peghook_dot`) when the damage-over-time effect initializes.

### Event listener details
- `onremove` (on tail FX entities): Removes the tail entity from the `tails` table used in `OnUpdateProjectileTail`.
- `animover`: Triggers `inst.Remove` for FX prefabs (`peghook_spitfx`, `peghook_hitfx`, `peghook_splashfx`) to clean up after animation ends.

### Spawned prefabs and associated events
- `peghook_projectile`: Fires projectiles; handled via `complexprojectile` component (externally defined).
- `peghook_spitfx`: Visual FX for spitting; listens to `animover` for self-removal.
- `peghook_hitfx`: Hit impact FX; no direct event listeners in this file (external `hitfx_postinit` may add listeners).
- `peghook_splashfx`: Splash animation; removed automatically after animation duration.
- `peghook_dot`: Damage-over-time effect; pushes `startcorrosivedebuff` on initialization.

> Note: Event handling logic for post-initialization hooks (`peghook_postinit`, `projectile_postinit`, etc.) is defined in external server data files (e.g., `event_server_data("lavaarena", "prefabs/lavaarena_peghook")`) and not included here.

