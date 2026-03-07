---
id: icebox_crystal_fx
title: Icebox Crystal Fx
description: A non-persistent visual effect entity that plays a looping animation for an icebox crystal interaction.
tags: [fx, visual, environment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: cde8d882
system_scope: fx
---

# Icebox Crystal Fx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`icebox_crystal_fx` is a lightweight visual-only prefab that renders an animation sequence to indicate an icebox crystal-related effect (e.g., activation or response). It uses a non-physical, non-simulated entity with an animation state and transform, primarily for display purposes. The entity plays a "pre" animation once, then transitions to a "loop" animation and is automatically removed after completion. It is only spawned on the master simulation to ensure consistent behavior.

## Usage example
This prefab is not intended to be added directly as a component; it is instantiated as a standalone entity. A typical usage pattern in mod code would be:

```lua
local inst = SpawnPrefab("icebox_crystal_fx")
if inst ~= nil then
    inst.Transform:SetPosition(x, y, z)
end
```

The prefab handles its own lifecycle and automatically removes itself.

## Dependencies & tags
**Components used:** `animstate`, `transform`, `network`
**Tags:** Adds `FX`; sets entity as `pristine` (non-persistent).

## Properties
No public properties.

## Main functions
### `Kill()`
*   **Description:** Initiates immediate termination of the effect. If not already scheduled, it schedules the "pst" (post) animation to play and then removes the entity after a short delay.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
None identified.