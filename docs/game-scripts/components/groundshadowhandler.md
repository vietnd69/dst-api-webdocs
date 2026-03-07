---
id: groundshadowhandler
title: Groundshadowhandler
description: Manages a ground shadow effect that dynamically scales and positions beneath an entity based on its vertical height.
tags: [fx, environment, rendering]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: d94a49fe
system_scope: fx
---

# Groundshadowhandler

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`GroundShadowHandler` is a client-side component that creates and maintains a dynamic ground shadow entity beneath its host. The shadow scales and repositions in real time based on the host entity’s vertical position (`Y`-axis), giving a sense of depth and height variation relative to the ground plane. It is typically attached to prefabs that require visually grounded shadowing without complex physics or server-side replication.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("groundshadowhandler")
inst.components.groundshadowhandler:SetSize(2.0, 1.5)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Creates and manages a shadow entity with tags: `FX`, `CLASSIFIED`, `NOCLICK`, `NOBLOCK`. Does not modify host entity tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed to constructor) | The entity to which this component is attached. |
| `ground_shadow` | `Entity` or `nil` | `nil` | The shadow entity instance, created via `groundshadowprefabfn`. |
| `original_width` | number | `0` | Stored width of the shadow before dynamic scaling. |
| `original_height` | number | `0` | Stored height of the shadow before dynamic scaling. |

## Main functions
### `SetSize(width, height)`
* **Description:** Sets the base dimensions of the shadow and configures the underlying `DynamicShadow` component.
* **Parameters:**  
  `width` (number) — base horizontal width of the shadow.  
  `height` (number) — base vertical height of the shadow.
* **Returns:** Nothing.
* **Error states:** If the shadow entity has been removed (`ground_shadow == nil`), calling this function has no effect.

### `OnUpdate(dt)`
* **Description:** Called each frame to update the shadow’s position and scale. Moves the shadow directly under the host entity (at `Y = 0`) and scales it inversely with the host’s height above ground.  
* **Parameters:**  
  `dt` (number) — delta time in seconds since last frame (unused directly, but passed for consistency).
* **Returns:** Nothing.
* **Error states:** Exits early if `ground_shadow` is `nil` or the host entity is no longer valid.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified
