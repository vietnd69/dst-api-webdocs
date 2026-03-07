---
id: eyeflame
title: Eyeflame
description: A visual effects prefab that creates a flickering fire-like particle effect using two layered particle emitters with custom shaders, textures, and envelopes.
tags: [fx, visual, vfx]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1c9bca74
system_scope: fx
---

# Eyeflame

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`eyeflame` is a non-networked, FX-tagged prefab responsible for rendering a dynamic fire-like visual effect. It uses the `VFXEffect` component with two emitters: one for a rotating, semi-transparent smoke/core particle layer (`FIRE`) and another for a brighter, additive flame layer (`FIRE2`). The effect relies on pre-initialized color and scale envelopes, custom shaders, and per-frame particle emission logic. It is typically instantiated as a child entity of other prefabs (e.g., torches, fire pits) to provide localized visual feedback.

## Usage example
```lua
-- Create an eyeflame entity and attach it to a parent
local flame = CreatePrefab("eyeflame")
flame.Transform:SetPosition(x, y, z)
parent.entity:AddChild(flame.entity)
```

## Dependencies & tags
**Components used:** `VFXEffect`, `Transform`
**Tags:** Adds `FX`; sets `persists = false` (non-persistent)

## Properties
No public properties

## Main functions
### `fn()`
*   **Description:** The prefab constructor function. Initializes the entity, adds a `Transform` and `VFXEffect` components, configures two particle emitters with shaders, envelopes, and particle emission behavior, and returns the fully configured entity.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) — a fully initialized `eyeflame` prefab instance.
*   **Error states:** Returns `nil` if `CreateEntity()` fails.

## Events & listeners
None identified.