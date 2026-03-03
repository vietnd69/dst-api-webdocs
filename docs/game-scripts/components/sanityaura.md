---
id: sanityaura
title: Sanityaura
description: Computes and provides sanity-affecting aura values for an entity within a defined radius.
tags: [sanity, aura, environmental]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 74bb3dde
system_scope: entity
---

# Sanityaura

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`SanityAura` is a lightweight component that allows an entity to emit a sanity-modifying aura. It is attached to entities (e.g., structures like Shadow Palaces, Beefalo King) that influence nearby players’ sanity over time. The component exposes methods to retrieve both base and distance-falloff-aware aura values relative to a given observer entity. It automatically adds the `sanityaura` tag upon instantiation and removes it when detached from an entity.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("sanityaura")
-- Set a fixed positive aura value (e.g., +10 sanity/sec within range)
inst.components.sanityaura.aura = 10
-- Optionally customize aura and falloff logic via functions
inst.components.sanityaura.aurafn = function(entity, observer) return 20 end
inst.components.sanityaura.fallofffn = function(entity, observer, distsq) return 1 + distsq * 0.01 end
inst.components.sanityaura.max_distsq = 400  -- 20 unit radius
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Adds `sanityaura` on instantiation; removes `sanityaura` when removed from entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Ent` (table) | `nil` | Reference to the entity that owns this component. |
| `aura` | number | `0` | Base aura value used when no custom `aurafn` is defined. |
| `max_distsq` | number or `nil` | `nil` | Cached maximum squared distance for aura effect; defaults to `TUNING.SANITY_EFFECT_RANGE^2` if `nil`. |
| `aurafn` | function or `nil` | `nil` | Optional callback `fn(entity, observer) -> number` to compute dynamic aura value per observer. |
| `fallofffn` | function or `nil` | `nil` | Optional callback `fn(entity, observer, distsq) -> number` to compute custom falloff divisor. |

## Main functions
### `GetBaseAura(observer)`
* **Description:** Returns the unmodified (non-falloff) aura value for a given observer. Ignores distance and `max_distsq`. Primarily used by the client for diagnostic or UI purposes.
* **Parameters:** `observer` (Ent) — the entity for which the aura is being evaluated.
* **Returns:** `number` — the base aura value (either `self.aura` or `self.aurafn(self.inst, observer)`).
* **Error states:** Returns `self.aura` (a number) if `aurafn` is `nil`; otherwise calls `aurafn`, which should return a number.

### `GetAura(observer)`
* **Description:** Returns the falloff-adjusted aura value for a given observer, accounting for distance and optional custom falloff. Used by the game’s sanity system to apply real-time effects.
* **Parameters:** `observer` (Ent) — the entity for which the aura is being evaluated.
* **Returns:** `number` — the effective aura value at the observer’s position (may be `0` if out of range).
* **Error states:** Returns `0` if the squared distance between `observer` and `self.inst` exceeds `self.max_distsq` or the default `SANITY_EFFECT_RANGE_SQ`. Divisor is never less than `1`.

## Events & listeners
None identified.
