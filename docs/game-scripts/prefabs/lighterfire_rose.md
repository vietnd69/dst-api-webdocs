---
id: lighterfire_rose
title: Lighterfire Rose
description: Creates a decorative rose-shaped fire particle effect with two distinct particle types (smoke and petals) using envelope-based color and scale animations.
tags: [fx, visual, environment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: cb97de00
system_scope: fx
---

# Lighterfire Rose

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lighterfire_rose` is a prefab that generates a visually distinct rose-patterned fire effect, consisting of two particle streams: a central smoke trail and radial rose petals. It is implemented by delegating to `MakeLighterFire` from `lighterfire_common.lua`, and customizing behavior through `common_postinit` and `master_postinit` callbacks. The effect uses VFX effects with color and scale envelopes, dynamic emission rates based on movement, and separate render pipelines for smoke and petals.

## Usage example
```lua
local inst =_prefab lighterfire_rose
if not TheNet:IsDedicated() then
    inst.components.visualtransform:SetPosition(0, 2, 0)
end
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** None identified.

## Properties
No public properties.

## Main functions
This prefab does not define custom public functions beyond those inherited from `MakeLighterFire` in `lighterfire_common.lua`, which are not exposed in the provided source.

## Events & listeners
None identified.