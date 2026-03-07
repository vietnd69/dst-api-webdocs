---
id: icebox_porcelain_fx
title: Icebox Porcelain Fx
description: Renders a short-lived visual effect for porcelain-related interactions, playing an initial pre-animation followed by a looping animation until explicitly destroyed.
tags: [fx, visual]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3c9b7b47
system_scope: fx
---

# Icebox Porcelain Fx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`icebox_porcelain_fx` is a lightweight, non-persistent prefab used to render a transient visual effect, typically for porcelain item interactions (e.g., breaking porcelain in the Icebox). It uses animation states (`pre`, `loop`, `pst`) to control playback, starts with a pre-animation, transitions to a loop, and is scheduled for automatic removal after completion. The prefab is client-safe and only actively managed on the master simulation.

## Usage example
This prefab is instantiated internally by the game during specific interactions and is not typically added directly by modders. As a reference, here is how the underlying logic would be invoked if manually created:
```lua
local inst = SpawnPrefab("icebox_porcelain_fx")
inst.Transform:SetPosition(x, y, z)
inst.Kill() -- triggers immediate termination with post-animation
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `FX` via `inst:AddTag("FX")`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_killtask` | Task or `nil` | `nil` | Stores the scheduled task for entity removal. |

## Main functions
### `Kill(inst)`
*   **Description:** Schedules the entity for removal. If no kill task exists, calculates remaining animation time to align removal with animation completion and schedules `OnKillTask`. If already scheduled, does nothing.
*   **Parameters:** `inst` (Entity) — the instance to destroy.
*   **Returns:** Nothing.
*   **Error states:** If called before animation starts, `GetCurrentAnimationLength()` may be `0`, leading to immediate or incorrect timing.

### `OnKillTask(inst)`
*   **Description:** Internal helper that plays the post-animation (`pst`) and schedules entity removal after animation duration + padding (`2 * FRAMES`).
*   **Parameters:** `inst` (Entity) — the instance being destroyed.
*   **Returns:** Nothing.
*   **Error states:** None documented; assumes valid `AnimState` state.

## Events & listeners
None identified

## Assets
The prefab references the following assets:
- `anim/ice_box.zip` (static bank)
- `anim/dynamic/icebox_porcelain.zip` (dynamic animation)
- `anim/dynamic/icebox_porcelain.dyn` (dynamic animation data)