---
id: nightsword_cotl_fx
title: Nightsword Cotl Fx
description: Creates and manages visual particle effects (smoke and ember trails) triggered by the Nightsword player character during attack animations.
tags: [combat, fx, visual]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d88a6b7d
system_scope: fx
---

# Nightsword Cotl Fx

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`nightsword_cotl_fx` is a lightweight FX prefab that spawns and updates particle effects synced to the Nightsword character's attack animations. It does not own business logic but acts as a visual feedback system: when attached and activated (typically via spawn or attach logic in the parent prefab), it listens for animation events on its parent entity and emits smoke and ember particles accordingly. The component is non-persistent, tagged with `"FX"`, and excluded from dedicated server initialization.

## Usage example
```lua
-- Typically added automatically as part of the Nightsword character prefab
-- Not intended for direct manual instantiation by modders.
-- Example of internal usage:
local fx = SpawnPrefab("nightsword_cotl_fx")
fx.entity:SetParent(nightsword_character)
```

## Dependencies & tags
**Components used:** `rider` (via `parent.components.rider:GetMount()`)
**Tags:** Adds `"FX"`.

## Properties
No public properties. All configuration is internal and set during initialization.

## Main functions
### `fn()`
* **Description:** Constructor function that creates the FX entity, sets up VFX emitters for smoke and ember, registers a per-frame emitter callback, and initializes envelope definitions (only once). This function is passed to `Prefab()` and executed once when the prefab is instantiated.
* **Parameters:** None.
* **Returns:** The fully initialized entity instance (`inst`).
* **Error states:** On dedicated servers, returns early after minimal setup (`inst` without VFX); prints an error message if the parent facing direction is unhandled.

## Events & listeners
- **Listens to:** None — instead uses a `EmitterManager` callback invoked every simulation tick (via `TheSim:GetTickTime()` cycle) to evaluate and respond to animation state changes on the parent.
- **Pushes:** None — this is a passive FX system with no external event emission.
