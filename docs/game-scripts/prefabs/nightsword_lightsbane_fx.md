---
id: nightsword_lightsbane_fx
title: Nightsword Lightsbane Fx
description: Creates and manages particle effects for the Nightsword Lightsbane weapon attack animation on the client.
tags: [fx, combat, weapon, visual, client]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e7916466
system_scope: fx
---

# Nightsword Lightsbane Fx

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`nightsword_lightsbane_fx` is a client-side prefab that generates visual particle effects (smoke and embers) during the Nightsword Lightsbane weapon's attack animation. It is spawned as a transient entity and emits particles only when its parent entity (typically a player) is performing the `"atk"` animation and is not mounted. The component interacts with the `rider` component on the parent to detect mount status and uses custom emitter logic to position effects based on the player’s facing direction.

This prefab does not function on dedicated servers and is purely cosmetic.

## Usage example
This prefab is not added manually by modders—it is spawned automatically by the game during Nightsword Lightsbane attacks.

```lua
-- Example: Manual spawn for testing (client-only)
local fx = SpawnPrefab("nightsword_lightsbane_fx")
fx.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `rider` (accessed via `parent.components.rider:GetMount()`)
**Tags:** Adds `FX`

## Properties
No public properties.

## Main functions
Not applicable.

## Events & listeners
Not applicable.

## Notes
- **Client-only**: The entity sets `inst.persists = false` and returns early if `TheNet:IsDedicated()` is true.
- **Envelope initialization**: Particle color and scale envelopes are registered exactly once via the `InitEnvelope()` function, which self-nilifies after first call.
- **Emitter logic**: Uses two emitters—smoke (alpha-blended, rotating, up to 32 particles) and embers (additive, bloom-enabled, up to 128 particles)—positioned and emitted only during a narrow window (`anim_time > 0.13`) of the `"atk"` animation.
- **Position adjustment**: When facing right (`GetCurrentFacing() == 1`), effects are offset using camera vectors (`TheCamera:GetRightVec()`, `TheCamera:GetDownVec()`) and constants `NIGHTSWORD_FX_OFFSETS.RIGHT` and `NIGHTSWORD_FX_OFFSETS.DOWN`.
- **Assets required**: `fx/animsmoke.tex`, `fx/pixel.tex`, `shaders/vfx_particle_pixelated_reveal.ksh`, `shaders/vfx_particle_add.ksh`.