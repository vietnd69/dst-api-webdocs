---
id: lunarrift_terraformer_explosion
title: Lunarrift Terraformer Explosion
description: A non-damaging visual FX entity that triggers a single-area explosion affecting nearby entities in the Lunarrift biome.
tags: [fx, world, explosion]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0c465e53
system_scope: fx
---

# Lunarrift Terraformer Explosion

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lunarrift_terraformer_explosion` is a transient visual FX prefab that represents the explosion effect of a Lunarrift terraformer. When spawned, it creates a brief visual and audio cue, then detonates after a short delay. The detonation checks for entities within a circular radius, applying damage via the `combat` component *only if* the entity has a non-dead `health` component. It is used exclusively for localized environmental effects in the Lunar Rift biome.

## Usage example
This prefab is not intended for manual instantiation by mods; it is spawned internally by the Lunarrift terraformer logic. A typical internal spawn call looks like:

```lua
TheWorld:SpawnPrefab("lunarrift_terraformer_explosion")
    .Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `Transform`, `AnimState`, `SoundEmitter`, `Network`, `health`, `combat`
**Tags:** Adds `FX`. Uses hard-coded tag filters (`_combat`, `DECOR`, `FX`, `flight`, `INLIMBO`, `invisible`, `lunar_aligned`, `noattack`, `NOCLICK`, `notarget`, `playerghost`) for entity filtering.

## Properties
No public properties. All configuration is encapsulated via local constants (`HIT_BY_EXPLOSION_RANGE`, `HIT_BY_EXPLOSION_*` tags) and `TUNING.RIFT_LUNAR1_TERRAFORM_EXPLOSION_DAMAGE`.

## Main functions
### `do_explosion(inst)`
* **Description:** Calculates the explosion’s position and finds all entities within range that match the filtering criteria, then applies damage via `combat:GetAttacked`. Intended for internal use only.
* **Parameters:** `inst` (Entity) — the explosion prefab instance.
* **Returns:** Nothing.
* **Error states:** Skips entities that are dead (as reported by `health:IsDead()`). Does nothing if `TheWorld.ismastersim` is false (the function is invoked only on the master simulation).

## Events & listeners
- **Listens to:** `animover` — fires `inst.Remove` to clean up the FX instance once its animation completes.
- **Pushes:** None.