---
id: electric_charged_fx
title: Electric Charged Fx
description: Generates a transient visual and lighting effect that simulates an electric discharge, optionally binding to a target entity to produce a flashing tint effect.
tags: [fx, light, animation, electric]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ae6600f8
system_scope: fx
---

# Electric Charged Fx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`electric_charged_fx` is a non-persistent FX prefab that creates a short-lived discharge animation with associated light emission. It plays a single animation (`discharged`) with bloom and dynamic light intensity decay. Optionally, it supports binding to a target entity (via `SetTarget`) to produce a blinking-tint effect over time, leveraging the `colouradder` and `updatelooper` components. The effect is designed for temporary visual feedback (e.g., electrical shocks) and does not persist across sessions.

## Usage example
```lua
local fx = SpawnPrefab("electricchargedfx")
fx.Transform:SetPosition(x, y, z)
-- Optional: bind to a target entity for a flashing tint effect
if target ~= nil then
    fx:SetTarget(target)
end
```

## Dependencies & tags
**Components used:** `colouradder`, `freezable`, `updatelooper` (via external calls); internally adds `Transform`, `AnimState`, `SoundEmitter`, `Light`, `Network`, and `UpdateLooper`.
**Tags:** Adds `FX`.

## Properties
No public properties.

## Main functions
### `StartFX(proxy, animindex, build)`
*   **Description:** Instantiates and configures the electric discharge effect entity. Attaches the FX prefab to the proxy entity's position and parent, plays the `discharged` animation, and sets up periodic lighting and sound updates. Automatically schedules entity removal after animation completion or timeout.
*   **Parameters:** `proxy` (EntityProxy) - source entity for position and parent context; `animindex` (unused), `build` (unused).
*   **Returns:** Nothing.
*   **Error states:** On dedicated servers (`TheNet:IsDedicated()`), the `SoundEmitter` is not added; light and animation are still configured.

### `SetTarget(inst, target)`
*   **Description:** Binds the FX effect to a target entity to trigger a progressive flashing tint effect. Adds an `UpdateLooper` component with `OnUpdateFlash` as the update function and immediately applies initial tint. Registers an `OnRemoveEntity` callback to clean up target tint.
*   **Parameters:** `inst` (Entity) - this FX instance; `target` (Entity) - the entity to flash with tint.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if the `updatelooper` component is already present on `inst`.

## Events & listeners
- **Listens to:** `animover` - triggers cleanup logic (e.g., removal if `killfx` is true).
- **Pushes:** None directly; relies on entity lifecycle events (`onremove` in `colouradder`) for cleanup coordination.