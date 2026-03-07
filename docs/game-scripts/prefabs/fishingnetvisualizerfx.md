---
id: fishingnetvisualizerfx
title: Fishingnetvisualizerfx
description: Renders a one-shot visual effect for fishing net interactions, such as splash or hit animations, without persisting or affecting gameplay state.
tags: [fx, visual, nonblocking]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c0b91d01
system_scope: fx
---

# Fishingnetvisualizerfx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`fishingnetvisualizerfx` is a lightweight, non-persistent entity prefab designed solely for rendering a single visual effect (e.g., a splash or net impact animation) when a fishing net is used. It creates an entity with animation, sound, and transform capabilities, plays a one-time "hit" animation, and automatically removes itself when the animation completes. It does not interact with gameplay logic, physics, or networking beyond basic client-server separation.

## Usage example
```lua
-- Automatically instantiated via the game's prefab system when needed.
-- Typically spawned using CreatePrefabInstance("fishingnetvisualizerfx", position)
-- No manual component management is required.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `NOBLOCK`, `FX`

## Properties
No public properties

## Main functions
### `fn()`
*   **Description:** Constructor function that builds and configures the effect entity. It is invoked internally by the prefab system when the prefab is instantiated.
*   **Parameters:** None.
*   **Returns:** `inst` — the fully configured entity (or `nil` on non-master clients).
*   **Error states:** Returns `nil` on non-master simulations (e.g., clients) only if `TheWorld.ismastersim` evaluates to `false`; otherwise returns the fully initialized instance.

## Events & listeners
- **Listens to:** `animover` — triggers immediate entity removal via `inst:Remove()` when the animation finishes.  
- **Pushes:** None identified