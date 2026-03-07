---
id: frostbreath
title: Frostbreath
description: A client-side particle effect prefab that emits a rotating, fading white breath-like visual.
tags: [fx, visual, particle]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0ca04eb5
system_scope: fx
---

# Frostbreath

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`frostbreath` is a lightweight, non-persistent particle effect prefab used to render a short-lived, rotating white particle burst—typically to simulate frost or breath effects. It is intended for client-only use: dedicated servers skip instantiation of its rendering logic. The effect uses a custom shader and pre-defined colour and scale envelopes to animate transparency and size over time.

## Usage example
```lua
-- Spawn the frostbreath effect at a given position
local inst = SpawnPrefab("frostbreath")
inst.Transform:SetPosition(x, y, z)
inst.Emit()
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** Adds `FX` tag to the entity; does not modify other tags.

## Properties
No public properties.

## Main functions
### `Emit()`
* **Description:** Spawns a single rotating particle with randomized angular velocity and lifetime. The particle is added to the internal VFX effect and rendered with a white-to-transparent fade and expanding scale envelope.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** On dedicated servers, this function is replaced by `empty_func`, so calling it has no effect.

## Events & listeners
None identified.