---
id: critterbuff_lunarmoth
title: Critterbuff Lunarmoth
description: Creates a temporary lighting FX entity that fades in/out and flickers to simulate a lunar moth's glow effect.
tags: [fx, light, buff]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 981a47f0
system_scope: fx
---

# Critterbuff Lunarmoth

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`critterbuff_lunarmoth` is a prefab that instantiates a small, dynamic light entity used for visual effects — specifically to simulate the glow of a lunar moth. It includes fade-in/fade-out animation, periodic flickering, and network synchronization. The component is self-contained, creating its own transform, light, and network components internally, and is not designed to be added as a component to other entities.

## Usage example
```lua
-- Instantiate the FX entity (e.g., after a critter transforms)
local fx = SpawnPrefab("critterbuff_lunarmoth")
if fx ~= nil then
    fx:SetPoint("BOTTOM", inst, "TOP", 0, 2)
    fx:EnableLight(true, false) -- fade in over time
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `FX`, `NOCLICK`, and `NOBLOCK` to the instance.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_fade` | `net_smallbyte` | `0` | Networked counter tracking fade progress (0 to `2 * FADE_FRAMES + 1`). |
| `EnableLight` | function | `nil` (client: `nil`, server: assigned) | Public method to toggle light state with optional instant toggle. |

## Main functions
### `EnableLight(enable, instant)`
* **Description:** Toggles the light on or off with optional smooth fading. On the server, the light remains enabled for the duration of the fade cycle. On the client, it ensures visual consistency.
* **Parameters:**  
  `enable` (boolean) — `true` to turn on, `false` to turn off.  
  `instant` (boolean) — if `true`, skip fade and set immediate value.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `fadedirty` — triggers `OnFadeDirty` on the client to synchronize visual state after `_fade` changes.
- **Pushes:** None identified.