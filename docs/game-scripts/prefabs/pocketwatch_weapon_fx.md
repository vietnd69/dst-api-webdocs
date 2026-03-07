---
id: pocketwatch_weapon_fx
title: Pocketwatch Weapon Fx
description: Spawns a particle effect for the pocketwatch weapon’s attack animation, emitting rotating sparkles with animated UVs and dynamic emission rates based on the owner’s state and movement.
tags: [fx, weapon, animation, visual]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 15e4e8d6
system_scope: fx
---

# Pocketwatch Weapon Fx

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
This prefab instantiates a visual effect (VFX) entity used to render particle effects during the pocketwatch weapon's attack animations. It creates rotating, glowing sparkles with time-varying color and scale envelopes, emitted from a spherical region around the entity’s position. The emission rate dynamically responds to the owner’s `age_state` (`"old"`, `"normal"`, or otherwise) and movement delta, clamped and interpolated for smooth transitions. The effect is only spawned on non-dedicated clients and has no persistent network replication.

## Usage example
```lua
-- Typically spawned as a child effect by the pocketwatch weapon prefab during animation frames
local fx = SpawnPrefab("pocketwatch_weapon_fx")
fx.Transform:SetWorldPosition(entity:GetWorldPosition())
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** Adds `FX`; checks owner tags `attack`, and owner `AnimState` for specific pocketwatch attack animations.

## Properties
No public properties.

## Main functions
This is a prefab definition (`return Prefab(...)`) with no user-callable methods. Initialization logic is embedded in its factory function `fn()`.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.
