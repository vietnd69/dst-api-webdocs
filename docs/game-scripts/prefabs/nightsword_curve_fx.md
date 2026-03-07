---
id: nightsword_curve_fx
title: Nightsword Curve Fx
description: Generates visual particle effects (smoke, sparks, embers) synchronized with the Nightsword weapon's attack animation.
tags: [fx, combat, animation]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c9f46535
system_scope: fx
---

# Nightsword Curve Fx

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`nightsword_curve_fx` is a lightweight effect prefab that emits animated particle systems during the Nightsword weapon's attack animation. It is not a component itself, but a standalone prefab containing a `VFXEffect` component (via `AddVFXEffect`) and uses the entity's parent to trigger emissions when the `atk` animation is playing. It depends on the `rider` component to detect if the weapon is being used by a mounted entity.

## Usage example
This prefab is automatically instantiated by the game when the Nightsword weapon performs an attack. It is not meant to be manually added to entities.

```lua
-- Not intended for direct use by modders; spawned internally during weapon attacks.
-- Example internal spawning pattern (simplified):
-- local fx = SpawnPrefab("nightsword_curve_fx")
-- fx.Transform:SetPosition(entity.Transform:GetWorldPosition())
```

## Dependencies & tags
**Components used:** `rider` (via `inst.entity:GetParent().components.rider:GetMount()`)
**Tags:** Adds `FX`

## Properties
No public properties. All state is held in local variables inside the `fn()` constructor (e.g., `burst_state`, emitters, coefficients).

## Main functions
No public methods are exposed. All logic resides in the constructor function `fn` and emitter callback registered via `EmitterManager:AddEmitter`. Key behavior is triggered automatically by the effect system.

## Events & listeners
None. This prefab does not register event listeners or push custom events. It responds to animation state by polling `AnimState` every frame via `EmitterManager`.
