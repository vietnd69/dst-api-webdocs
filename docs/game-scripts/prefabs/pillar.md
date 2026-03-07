---
id: pillar
title: Pillar
description: Creates and configures static environmental pillar prefabs with conditional physics, tags, and sound emitter support.
tags: [environment, static, physics]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: fa4b6fc5
system_scope: environment
---

# Pillar

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `pillar` prefab factory defines reusable prefabs for static environmental pillars used in the game world (e.g., ruins, algae formations, cave columns). It establishes core entity components (`Transform`, `AnimState`, `Network`) and conditionally adds `SoundEmitter`, obstacle physics, and special tags like `charge_barrier` and `quake_on_charge`. The component is not a reusable entity component but a prefab generator — each returned instance is a distinct entity type initialized via `Prefab()`.

## Usage example
```lua
-- The prefabs are typically used internally by the game via `require("prefabs/pillar")`
-- Example of spawning one manually:
local inst = Prefab("pillar_ruins", makefn("pillar_ruins", true), makeassetlist("pillar_ruins"))()
inst.Transform:SetPosition(x, y, z)
TheWorld:PushEvent("shake", { source = inst }) -- triggers visual shake effect
```

## Dependencies & tags
**Components used:** `Transform`, `AnimState`, `Network`, `SoundEmitter` (conditional), `MakeObstaclePhysics` (conditional helper).
**Tags:** Adds `charge_barrier`, `quake_on_charge` for `pillar_ruins`; adds `NOBLOCK` when `collide` is `false`.

## Properties
No public properties.

## Main functions
### `makeassetlist(name)`
* **Description:** Returns a list containing the animation asset reference for a given pillar name.
* **Parameters:** `name` (string) — base name of the pillar (e.g., `"pillar_ruins"`).
* **Returns:** `{ Asset("ANIM", "anim/"..name..".zip") }` — an array with one `Asset` object.

### `doshake(inst)`
* **Description:** Plays the `hit` animation followed by the `idle` animation on the entity’s `AnimState`. Intended to simulate a shake/vibration effect.
* **Parameters:** `inst` (Entity) — the pillar entity instance.
* **Returns:** Nothing.

### `makefn(name, collide)`
* **Description:** Factory function returning a closure that constructs a pillar entity. Sets up components, animation bank, build, physics, and tags based on `name` and `collide`.
* **Parameters:**  
  - `name` (string) — identifier used for animation bank and build.  
  - `collide` (boolean) — if `true`, applies obstacle physics with radius `2.35`; otherwise adds the `NOBLOCK` tag.  
* **Returns:** A function that, when called, creates and returns a configured entity instance.
* **Error states:** If `name == "pillar_ruins"` and the instance is not master (i.e., client-side), it still adds `SoundEmitter` and the tags, but the master sim branch is skipped.

### `pillar(name, collide)`
* **Description:** Wraps `makefn` and `makeassetlist` into a `Prefab` definition.
* **Parameters:**  
  - `name` (string) — passed to `makefn` and `makeassetlist`.  
  - `collide` (boolean) — passed to `makefn`.  
* **Returns:** A `Prefab` definition object (suitable for return in `prefabs/pillar.lua`).

## Events & listeners
- **Listens to:** `shake` — triggers `doshake` callback on the pillar entity (only on master sim).
- **Pushes:** None.