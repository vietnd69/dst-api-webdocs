---
id: fireballstaff
title: Fireballstaff
description: A ranged weapon prefab that casts fireball projectiles with area-of-effect targeting and custom reticule logic.
tags: [combat, ranged, fire, targeting, fx]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ebbf8d1e
system_scope: combat
---

# Fireballstaff

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`fireballstaff` is a weapon prefab that enables area-of-effect (AoE) fireball casting. It leverages the `aoetargeting` component to provide visual reticule feedback and determines valid ground placement using a custom target function. When used, it spawns fireball projectiles and optional FX entities. This prefab is part of the Lava Arena event content and integrates with the game's networked entity system.

## Usage example
```lua
-- Typical usage in a Prefab postinit hook
inst:AddComponent("aoetargeting")
inst.components.aoetargeting:SetAllowRiding(false)
inst.components.aoetargeting.reticule.reticuleprefab = "reticuleaoe"
inst.components.aoetargeting.reticule.pingprefab = "reticuleaoeping"
inst.components.aoetargeting.reticule.targetfn = ReticuleTargetFn
inst.components.aoetargeting.reticule.validcolour = { 1, 0.75, 0, 1 }
inst.components.aoetargeting.reticule.invalidcolour = { 0.5, 0, 0, 1 }
```

## Dependencies & tags
**Components used:** `aoetargeting`, `animstate`, `transform`, `soundemitter`, `network`, `inventoryphysics`
**Tags:** Adds `rangedweapon`, `firestaff`, `pyroweapon`, `weapon`, `rechargeable`, `FX`, `NOCLICK` (for FX version)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `projectiledelay` | number | `4 * FRAMES` | Delay in frames before projectile launch, used to synchronize visual and game logic timing. |

## Main functions
### `ReticuleTargetFn()`
* **Description:** Determines the ground position where the fireball will land by raycasting along the player's forward direction up to 7 units. Stops at the first passable, unblocked point.
* **Parameters:** None.
* **Returns:** `Vector3` — the target ground position; returns origin `Vector3(0,0,0)` if no valid point is found.
* **Error states:** Returns origin vector if the raycast fails to find a valid location within range.

## Events & listeners
**None identified.**