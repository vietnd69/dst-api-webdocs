---
id: nightlight_flame
title: Nightlight Flame
description: A visual and audio effect entity that simulates a nightlight flame with configurable lighting levels and sound intensity.
tags: [fx, environment, lighting]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 66c30c1c
system_scope: fx
---

# Nightlight Flame

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`nightlight_flame` is a lightweight prefab used to render a visually consistent flame effect with dynamic lighting and sound parameters. It is not a standalone component but a prefabricated entity definition that integrates with the `firefx` component on the master simulation to assign lighting levels and configure animation/sound behavior. It uses `AnimState` and `SoundEmitter` to render visuals and play looped audio, and includes the `FX` tag for categorization.

## Usage example
```lua
-- Create an instance of the nightlight flame at a specific world position
local inst = SpawnPrefab("nightlight_flame")
inst.Transform:SetPosition(x, y, z)
-- The firefx component is added only on the master instance; client-side instances are pristines
```

## Dependencies & tags
**Components used:** `firefx` (added only on master simulation)
**Tags:** `FX`

## Properties
No public properties. The `firelevels` table is defined in the prefab file scope and assigned to `inst.components.firefx.levels` during initialization.

## Main functions
Not applicable — this is a prefab definition, not a component. It returns an entity instance via its `fn()` constructor. No custom methods are defined on the instance.

## Events & listeners
None identified.

## Additional notes
- The prefab is designed to be server-side authoritative: only the master simulation adds the `firefx` component and assigns `firelevels`. Client instances return early after setting up animation and sound assets.
- Animation bank and build are set to `"campfire_fire"`; bloom and multicolour effects are configured for soft, warm lighting.
- Four lighting levels (`level1` through `level4`) are defined with increasing radius (2 to 5), sound intensity (0.1 to 1), and unchanged visual intensity (0.8) and falloff (0.33). All use the same particle/sound asset and warm pinkish-white colour `{253, 179, 179}`.
- Dependencies include `firefx_light` (a referenced prefab, likely used as a child or visual附属 effect) and `sound/common.fsb` for audio.