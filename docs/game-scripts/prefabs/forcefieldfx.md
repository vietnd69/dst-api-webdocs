---
id: forcefieldfx
title: Forcefieldfx
description: Renders a visual and lighting effect for a forcefield, animating its opening/closing and managing dynamic light intensity.
tags: [fx, visual, light]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d3811654
system_scope: fx
---

# Forcefieldfx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`forcefieldfx` is a client-side prefab that visually represents a forcefield opening, idling, and closing, while simultaneously managing a dynamic light effect. It uses animation states and a networked light frame value to synchronize visual intensity across clients. The light intensity scales with the animation frame to create a smooth fade-in/fade-out effect.

## Usage example
```lua
local inst = Prefab("forcefieldfx", nil, nil)
inst.transform:SetPosition(x, y, z)
inst:AddTag("forcefieldfx")
inst:ListenForEvent("kill", function() inst.components.forcefieldfx and inst.components.forcefieldfx.kill_fx and inst.components.forcefieldfx:kill_fx() end)
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_lightframe` | `net_tinybyte` | `0` → `1` | Networked frame value (0–6) controlling light radius and animation phase. |
| `_islighton` | `net_bool` | `true` | Controls whether the light is active (on/off). |
| `_lighttask` | `task` | `nil` | Periodic task driving light animation updates. |

## Main functions
### `kill_fx(inst)`
*   **Description:** Initiates the forcefield closure animation, sets the light off, and schedules the entity for removal after 0.6 seconds.
*   **Parameters:** `inst` (entity) — the forcefield effect instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `lightdirty` — triggers `OnLightDirty` to restart or maintain the light animation loop on clients.