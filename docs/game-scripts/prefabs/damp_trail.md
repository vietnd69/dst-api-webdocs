---
id: damp_trail
title: Damp Trail
description: Renders a visual trail effect with animated segments that auto-fade out after a duration.
tags: [fx, animation, visual]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: fd97fcad
system_scope: fx
---

# Damp Trail

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`damp_trail` is a simple FX prefab that creates a one-shot animated trail effect with a pre-fade-post playback sequence. It is used to visually represent transient phenomena such as damp footsteps or environmental traces. The prefab loads a dedicated animation bank and build, handles animation state transitions, and automatically removes itself after completing the full animation cycle.

## Usage example
```lua
local inst = SpawnPrefab("damp_trail")
if inst ~= nil then
    inst.Transform:SetPosition(x, y, z)
    -- variation, scale, duration
    inst.SetVariation(inst, 1, Vector3(1, 1, 1):Get(), 3.0)
end
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** Adds `FX`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `trailname` | string or nil | `nil` | Name of the animation sequence (e.g., `"trail1"`). Set via `SetVariation`. |
| `duration` | number | `0` | Duration in seconds before the fade-out stage begins. Set via `SetVariation`. |
| `task` | Task or nil | `nil` | Reference to the pending delayed task managing the fade transition. |

## Main functions
### `SetVariation(inst, rand, scale, duration)`
* **Description:** Configures and starts the trail animation sequence. Only executes if `trailname` is `nil`, preventing reconfiguration after initialization.
* **Parameters:**  
  `rand` (number) – integer used to select the animation variant (e.g., `trail1`, `trail2`).  
  `scale` (Vector3) – uniform scale applied to the effect via `Transform:SetScale`.  
  `duration` (number) – time in seconds before the animation transitions to the post stage.
* **Returns:** Nothing.
* **Error states:** No-op if `trailname` is already set (idempotent after first call).

### `Refresh(inst)`
* **Description:** Resets the fade timer, delaying the transition to the post-animation. Used to extend the active trail duration.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No-op if `trailname` or `task` is `nil`.

## Events & listeners
- **Listens to:** `animover` – triggers `OnAnimOver` to advance animation state or remove the entity.
- **Pushes:** None identified.