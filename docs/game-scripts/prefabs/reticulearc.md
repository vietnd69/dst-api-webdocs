---
id: reticulearc
title: Reticulearc
description: Creates visual FX entities (reticule arcs) used for targeting orping indicators, with optional animated scaling and color fading.
tags: [fx, visual, ui]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9fd280ca
system_scope: fx
---

# Reticulearc

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`reticulearc` is a prefab factory function that generates two similar FX prefabs: one static (`reticulearc`) and one with a dynamic ping animation (`reticulearcping`). These prefabs render a visual arc effect—typically used for targeting reticles or ping indicators—and rely on the `Transform`, `AnimState`, and task system (`DoPeriodicTask`, `DoTaskInTime`) to manage appearance and animation. The component itself is not a traditional `Component`; it is a factory returning `Prefab` definitions via the `MakeReticule` helper.

## Usage example
```lua
-- Spawn a static reticule arc
local static_arc = SpawnPrefab("reticulearc")
static_arc.Transform:SetPosition(x, y, z)

-- Spawn a pinging reticule arc (auto-animates and removes itself after ~0.5s)
local pinging_arc = SpawnPrefab("reticulearcping")
pinging_arc.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `FX` and `NOCLICK` to the created entity.

## Properties
No public properties

## Main functions
### `MakeReticule(name, ping)`
* **Description:** Factory function that returns a `Prefab` for a reticule arc entity. When instantiated, it creates an FX entity with an `AnimState`, transforms, and optional ping animation.
* **Parameters:**
  * `name` (string) — Prefab name (e.g., `"reticulearc"`, `"reticulearcping"`).
  * `ping` (boolean) — If `true`, the entity runs a periodic ping animation task that scales and fades the arc before self-removing after ~0.5 seconds.
* **Returns:** `Prefab` — A prefabricated entity definition ready for instantiation (e.g., via `SpawnPrefab(name)`).
* **Error states:** None identified.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified  

> Note: The `reticulearc` prefab uses internal task functions (`DoPeriodicTask`, `DoTaskInTime`) and the `UpdatePing` callback to drive animation. These are not externally exposed events.
