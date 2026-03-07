---
id: healingstaff
title: Healingstaff
description: A ranged weapon prefab that provides AOE targeting support and projectile casting functionality in DST's Lava Arena event.
tags: [combat, ranged, aoe, event]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c28a8e13
system_scope: combat
---

# Healingstaff

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `healingstaff` prefab defines a ranged weapon used in the Lava Arena event. It provides AOE targeting through the `aoetargeting` component, using a custom reticule with a fixed-range ground target logic. The weapon supports projectile casting via its `castfxfn`, which creates a visual FX entity (`blossom_cast_fx`) for animation and network synchronization.

## Usage example
```lua
-- Example: Spawn healingstaff and inspect AOE reticule configuration
local inst = Prefab("healingstaff", fn, assets, prefabs)()
if inst.components.aoetargeting then
    print(inst.components.aoetargeting.reticule.targetfn)
    print(inst.components.aoetargeting.reticule.validcolour)
end
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `soundemitter`, `network`, `inventory`, `aoetargeting`  
**Tags:** Adds `rangedweapon`, `weapon`, `rechargeable`

## Properties
No public properties.

## Main functions
### `ReticuleTargetFn()`
*   **Description:** Computes the ground target position for the AOE reticule. Iterates inward from 6 units to 0 units along the player's forward direction, returning the first passable, unblocked point within healing range (6 units) — effectively a walk-towards target fallback for better usability.
*   **Parameters:** None.
*   **Returns:** `Vector3` — the computed target position in world space.
*   **Error states:** Returns origin `Vector3(0,0,0)` if no valid position is found within the loop.

## Events & listeners
None identified.