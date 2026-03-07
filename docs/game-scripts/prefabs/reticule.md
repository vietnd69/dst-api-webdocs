---
id: reticule
title: Reticule
description: A visualfx entity that displays a ground-oriented animation, used as an in-world cursor or indicator.
tags: [fx, visual, ui]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8c9156b2
system_scope: fx
---

# Reticule

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `reticule` prefab creates a lightweight, non-networked, non-interactive visual effect entity intended for use as an in-world cursor or placement indicator. It renders a simple animated sprite at a fixed orientation on the ground layer, below most world elements. It is not persisted, does not participate in interaction or physics, and is typically spawned temporarily to guide player actions.

## Usage example
```lua
local reticule = SpawnPrefab("reticule")
reticule.Transform:SetPosition(x, y, z)
reticule.AnimState:PlayAnimation("hover")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `FX`, `NOCLICK`

## Properties
No public properties

## Main functions
### `fn()`
*   **Description:** Prefab constructor function that initializes and configures the reticule entity.
*   **Parameters:** None.
*   **Returns:** The fully constructed entity instance (`inst`).
*   **Error states:** None — this is a simple instantiation function with no conditional logic.

## Events & listeners
None identified
