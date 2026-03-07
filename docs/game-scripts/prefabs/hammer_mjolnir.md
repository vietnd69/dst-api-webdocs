---
id: hammer_mjolnir
title: Hammer Mjolnir
description: Defines the Hammer Mjolnir weapon prefab and associated FX prefabs for the Lava Arena event, including reticule targeting and area-of-effect capabilities.
tags: [combat, weapon, lavaarena, fx, aoeweapon]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 055866f6
system_scope: combat
---

# Hammer Mjolnir

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `hammer_mjolnir.lua` file defines the *Hammer Mjolnir* weapon prefab used in the Lava Arena event. It sets up the item's visual, audio, and interaction properties, including integration with the `aoetargeting` component for area-of-effect targeting via a reticule. The prefab is not a standalone component but a `Prefab` definition that initializes an entity with necessary transforms, animations, network sync, and tags such as `weapon`, `tool`, `aoeweapon_leap`, and `rechargeable`. It also defines supporting FX entities (`hammer_mjolnir_crackle`, `hammer_mjolnir_cracklebase`, `hammer_mjolnir_cracklehit`) used during attacks.

## Usage example
```lua
local hammer = Prefab("hammer_mjolnir", fn, assets, prefabs)
local inst = CreateEntity()
inst:AddTag("hammer")
-- The full prefab is typically instantiated via the returned Prefab directly,
-- e.g., SpawnPrefab("hammer_mjolnir") or via game events in the Lava Arena.
```

## Dependencies & tags
**Components used:** `aoetargeting`  
**Tags added:** `hammer`, `tool`, `weapon`, `aoeweapon_leap`, `rechargeable`, `FX`, `NOCLICK` (on FX prefabs)

## Properties
No public properties.

## Main functions
### `ReticuleTargetFn()`
* **Description:** Calculates the target position on the ground for the hammer’s leap attack. Casts a ray from the player forward to find the first passable, unblocked point within a max distance of `7` units.
* **Parameters:** None.
* **Returns:** `Vector3` — the ground position where the reticule should appear; defaults to `Vector3()` if no valid point found.

### `fn()`
* **Description:** The main constructor function for the `hammer_mjolnir` prefab. Sets up the entity with transform, animation, sound, and network components, configures inventory physics, assigns animation bank and build, plays the idle animation, and initializes the `aoetargeting` component with a custom reticule and color scheme.
* **Parameters:** None.
* **Returns:** `Entity` — the initialized weapon instance.

### `cracklefn()`
* **Description:** Constructor for the `hammer_mjolnir_crackle` FX entity (used for impact/attack visual effects). Sets animation, bloom shader, and orientation; adds `FX` and `NOCLICK` tags.
* **Parameters:** None.
* **Returns:** `Entity` — the FX entity.

### `cracklebasefn()`
* **Description:** Constructor for `hammer_mjolnir_cracklebase`, a static projected FX visual (e.g., ground marker). Configures layer, sort order, and scale; disables persistence (`persists = false`).
* **Parameters:** None.
* **Returns:** `Entity`.

### `MakeCrackleHit(name, withsound)`
* **Description:** Factory function that returns a `Prefab` for the looping crackle hit FX entity. Optionally includes sound emitter.
* **Parameters:**  
  * `name` (string) — the name of the prefab to generate.  
  * `withsound` (boolean) — whether to attach a `SoundEmitter`.  
* **Returns:** `Prefab` — a prefab definition for a looping crackle FX entity.

## Events & listeners
- **Pushes:** Events are delegated via `event_server_data("lavaarena", "prefabs/hammer_mjolnir").hammer_postinit(inst)`, `crackle_postinit(inst)`, `cracklehit_postinit(inst)`. These are custom server-side hooks, not built-in DST events.