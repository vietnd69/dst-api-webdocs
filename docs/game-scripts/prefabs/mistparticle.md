---
id: mistparticle
title: Mistparticle
description: Creates a non-networked visual effect entity that emits a static mist particle system using configured texture, shader, and envelope settings.
tags: [fx, environment, vfx]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 41ef5bbd
system_scope: fx
---

# Mistparticle

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`mistparticle` is a prefab definition that constructs a non-persistent visual effect entity for rendering mist effects in the environment. It uses the `emitter` component and a VFX effect system to spawn particles over time with fixed configuration. This entity is intended for localized environmental visuals (e.g., fog in caves or marshes), does not synchronize over the network, and has no active logic beyond initialization.

## Usage example
```lua
local mist = Prefab("mist", fn, assets)
local inst = CreateEntity()
inst:AddComponent("transform")
inst:AddComponent("emitter")
inst.Transform:SetPosition(x, y, z)
-- ... configure emitter via inst.components.emitter ...
```

## Dependencies & tags
**Components used:** `emitter`
**Tags:** Adds `FX`

## Properties
No public properties.

## Main functions
Not applicable.

## Events & listeners
None identified.
