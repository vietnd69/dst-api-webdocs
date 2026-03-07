---
id: fireball_projectile
title: Fireball Projectile
description: Creates and configures projectile prefabs and their impact effects for Lava Arena gameplay, including visual tails and hit fx.
tags: [fx, projectile, lavaarena]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 92fb9a52
system_scope: fx
---

# Fireball Projectile

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
This file defines prefabs for three types of Lava Arena projectiles (`fireball_projectile`, `blossom_projectile`, `gooball_projectile`) and their corresponding impact effects (`fireball_hit_fx`, `blossom_hit_fx`, `gooball_hit_fx`). It uses helper functions to construct projectile entities with optional visual tails and integrate with server-side event hooks via `event_server_data`. The projectiles are instantiated only on the client for tail rendering but fully initialized on the master simulation.

## Usage example
```lua
local fireball_prefab = Prefab("fireball_projectile", ...)
-- Typically instantiated via the game's projectile component or game logic:
local inst = PrefabFn("fireball_projectile")
inst.Transform:SetPosition(x, y, z)
inst.components.projectile:Launch(direction, speed)
```

## Dependencies & tags
**Components used:** None identified (relies on prefab-level operations and `event_server_data` callbacks).
**Tags:** Adds `FX`, `NOCLICK`, and `projectile` tags to instantiated entities.

## Properties
No public properties

## Main functions
### `MakeProjectile(name, bank, build, speed, lightoverride, addcolour, multcolour, hitfx)`
* **Description:** Constructs a projectile prefab with configurable visual appearance, speed, and particle effects. It creates a non-persistent entity with a trailing tail effect rendered on the client.
* **Parameters:**
  * `name` (string) — The name of the prefab to create.
  * `bank` (string) — AnimState bank name.
  * `build` (string) — AnimState build name.
  * `speed` (number) — Tail particles movement speed.
  * `lightoverride` (number) — Light intensity override (0 disables).
  * `addcolour` (table or nil) — RGBA values passed to `SetAddColour`.
  * `multcolour` (table or nil) — RGBA values passed to `SetMultColour`.
  * `hitfx` (string or nil) — Prefab name for the impact effect.
* **Returns:** Prefab instance.
* **Error states:** None identified.

### `CreateTail(bank, build, lightoverride, addcolour, multcolour)`
* **Description:** Creates and configures a single tail particle entity for visual trailing. It plays a "disappear" animation and automatically removes itself when the animation completes.
* **Parameters:**
  * `bank` (string) — AnimState bank.
  * `build` (string) — AnimState build.
  * `lightoverride` (number) — Light override intensity.
  * `addcolour` (table or nil) — Additive color values.
  * `multcolour` (table or nil) — Multiplicative color values.
* **Returns:** Entity (`inst`) with `FX` and `NOCLICK` tags.
* **Error states:** None identified.

### `OnUpdateProjectileTail(inst, bank, build, speed, lightoverride, addcolour, multcolour, hitfx, tails)`
* **Description:** Called periodically on the client to spawn new tail particles behind the projectile and align them with its movement.
* **Parameters:**
  * `inst` (entity) — The projectile entity.
  * `bank`, `build`, `speed`, `lightoverride`, `addcolour`, `multcolour`, `hitfx` — As in `MakeProjectile`.
  * `tails` (table) — A key-value set tracking active tail particles.
* **Returns:** Nothing.
* **Error states:** Tail creation only occurs if the projectile is visible on client.

### `fireballhit_fn`, `blossomhit_fn`, `gooballhit_fn`
* **Description:** Standard functions returning impact effect prefabs with fixed configurations for each projectile type.
* **Parameters:** None.
* **Returns:** Entity instance on successful creation.
* **Error states:** Returns early on non-master instances.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.