---
id: sharkboi_fx
title: Sharkboi Fx
description: Generates visual effects for Sharkboi's ice-based attacks and swipe actions.
tags: [fx, visual, entity]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 2b233050
system_scope: fx
---

# Sharkboi Fx

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`sharkboi_fx.lua` defines five Prefab factories that create temporary, non-interactive visual effect entities for the Sharkboi character. Each effect corresponds to a specific attack animation (e.g., swipe, ice plow, ice impact, ice trail, ice hole), using dedicated animation banks and builds. The effects are client-safe (non-mastersim-safe logic is skipped on clients), do not persist across sessions, and are automatically removed upon animation completion.

## Usage example
```lua
-- Example: Spawn a swipe effect at the world position of an actor
local swipe = Prefab("sharkboi_swipe_fx")
if swipe then
    local fx = swipe()
    fx.Transform:SetPosition(x, y, z)
end
```

## Dependencies & tags
**Components used:** None  
**Tags:** Adds `FX`, `NOCLICK` to all generated entities.

## Properties
No public properties

## Main functions
### `swipe_fn()`
*   **Description:** Constructs a swipe visual effect entity. Plays the `"atk1"` animation on the `"sharkboi_swipe_fx"` bank. On the master simulation, adds a `Reverse` function that triggers `"atk2"` animation.
*   **Parameters:** None.
*   **Returns:** A fully initialized `Entity` instance (prefab instance).
*   **Error states:** None.

### `iceplow_fn()`
*   **Description:** Constructs an ice plow visual effect. Randomly selects one of two variations (`1` or `2`) and plays a sequence: `iceplowX_pre` → `iceplowX_idle` (with random scale flipping). After ~1.35–1.65 seconds, triggers a post-animation (`iceplowX_pst`) and removes the entity.
*   **Parameters:** None.
*   **Returns:** A fully initialized `Entity` instance.
*   **Error states:** None.

### `iceimpact_fn()`
*   **Description:** Constructs an ice impact visual effect. Plays the `"ice_impact"` animation once and removes the entity upon completion.
*   **Parameters:** None.
*   **Returns:** A fully initialized `Entity` instance.
*   **Error states:** None.

### `icetrail_fn()`
*   **Description:** Constructs an ice trail visual effect. Randomly selects one of three crack variations (`1`, `2`, or `3`), plays `crackX_pre` → `crackX_idle`, optionally flips horizontal scale, and schedules automatic removal after 2 seconds with a post-animation (`crackX_pst`).
*   **Parameters:** None.
*   **Returns:** A fully initialized `Entity` instance.
*   **Error states:** None.

### `icehole_fn()`
*   **Description:** Constructs an ice hole visual effect. Plays the `"icehole_pst"` animation once (not ground-oriented) and removes the entity upon completion.
*   **Parameters:** None.
*   **Returns:** A fully initialized `Entity` instance.
*   **Error states:** None.

## Events & listeners
- **Listens to:** `animover` — All effect entities register listeners for this event to auto-remove themselves when animation finishes.  
- **Pushes:** None.