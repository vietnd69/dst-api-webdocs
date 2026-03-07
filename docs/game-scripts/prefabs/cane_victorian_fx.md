---
id: cane_victorian_fx
title: Cane Victorian Fx
description: A particle effect prefab that emits sparkling visual particles along the movement path of an entity, such as a walking or flying character.
tags: [fx, visual, particle]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a4563a51
system_scope: fx
---

# Cane Victorian Fx

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`cane_victorian_fx` is a standalone effect prefab that generates a trail of sparkling visual particles along an entity's movement trajectory. It is designed to visually accompany player or character movement, often used for magical or elegant footstep effects. The effect dynamically adjusts particle emission rate based on movement speed and is only active on non-dedicated clients.

## Usage example
```lua
local fx = SpawnPrefab("cane_victorian_fx")
fx.Transform:SetPosition(x, y, z)
fx:AddComponent("_locomotor")
fx.components.locomotor:Enable(true)
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** Adds `FX`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `last_pos` | Vector3 | Initial position | Stores the previous position each frame to calculate movement speed for particle emission rate. |

## Main functions
Not applicable — this prefab is instantiated via `SpawnPrefab("cane_victorian_fx")` and does not expose functional methods beyond internal effect initialization.

## Events & listeners
Not applicable — this prefab does not register or fire any events.

