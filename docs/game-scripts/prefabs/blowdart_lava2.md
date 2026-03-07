---
id: blowdart_lava2
title: Blowdart Lava2
description: A lava arena-specific blowdart weapon prefab that uses reticule-based targeting and spawns distinct projectile types with visual tail effects.
tags: [weapon, arena, projectile, reticule, fx]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 285d9a71
system_scope: combat
---

# Blowdart Lava2

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`blowdart_lava2` is a weapon prefab designed for the Lava Arena game mode. It implements reticule-based targeting via the `aoetargeting` and `reticule` components, allowing players to aim with a persistent, smooth-rotating reticule that follows mouse input. It defines three prefabs: the parent weapon (`blowdart_lava2`), a standard projectile (`blowdart_lava2_projectile`), and an explosive variant (`blowdart_lava2_projectile_explosive`). The projectile prefabs generate animated tail FX and are responsible for in-flight visual feedback. This prefab integrates with the event system via `event_server_data` hooks for server-side initialization.

## Usage example
```lua
-- Typical usage occurs automatically when the Lava Arena loads the weapon prefab
-- Manually constructing an instance requires:
local inst = Prefab("blowdart_lava2", fn, assets, prefabs)()

-- After instantiation, it is ready to be equipped and used as a weapon with reticule targeting
-- Projectile spawning is handled internally by the game's combat/projectile systems when fired.
```

## Dependencies & tags
**Components used:** `aoetargeting`, `animstate`, `network`, `transform`
**Tags:** Adds `blowdart`, `sharp`, `weapon`, `rechargeable` to the parent weapon; `FX`, `NOCLICK` to FX tail entities; `projectile` to projectiles.

## Properties
No public properties are defined or documented in the constructor. Internal state is stored on entity instance fields (e.g., `inst.projectiledelay`, `inst.thintailcount`, `inst._fade`), but these are not part of the public API.

## Main functions
Not applicable. This file returns prefabs via `Prefab(...)` calls; no standalone public functions beyond the prefab constructors (`fn`, `projectilefn`, `projectileexplosivefn`) are exported. The internal helper functions (`ReticuleTargetFn`, `ReticuleMouseTargetFn`, `ReticuleUpdatePositionFn`, `CreateTail`, `OnUpdateProjectileTail`, `commonprojectilefn`) are implementation details and not called directly by modders.

## Events & listeners
- **Listens to:** `animover` — registered on FX tail entities to auto-remove the entity when animation completes (`inst:ListenForEvent("animover", inst.Remove)`).
- **Pushes:** None. (Event dispatch is handled via `event_server_data("lavaarena", ...).blowdart_postinit` / `projectile_postinit` hooks, not direct `PushEvent` calls.)
