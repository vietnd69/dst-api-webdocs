---
id: lighterfire_glass
title: Lighterfire Glass
description: Creates a glass-effect visual fire particle system with distinct ember emissions that scale with movement speed.
tags: [fx, visual, particle]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: fc041c95
system_scope: fx
---

# Lighterfire Glass

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lighterfire_glass` is a visual prefab that generates a glass-styled fire particle effect with two distinct particle types: a primary flame particle and ember particles. It reuses logic from `lighterfire_common.lua` to handle lifecycle and network management, while the local `common_postinit` function configures VFX effect parameters and particle emission behavior. The effect dynamically adjusts ember emission rates based on entity movement speed.

## Usage example
```lua
local inst = Prefab("lighterfire_glass")
inst:AddComponent("finiteuses")
inst:AddComponent("inspectable")
inst:AddComponent("factory")
-- Standard DST prefab initialization applies; no direct component interaction needed
-- The visual effect is automatically attached when the entity spawns and renders locally
```

## Dependencies & tags
**Components used:** None identified — this is a prefab script that relies on VFX system APIs (`AddVFXEffect`, `EmitterManager`).
**Tags:** None identified.

## Properties
No public properties.

## Main functions
Not applicable — this file defines a prefab initialization function chain, not a component with public methods.

## Events & listeners
Not applicable — this file does not register or emit game events.

