---
id: aoeweapon_lunge
title: Aoeweapon Lunge
description: Extends the base AOE weapon component to enable lunge attacks that hit multiple targets along a trajectory path.
tags: [combat, weapon, aoe]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: root
source_hash: 12ecd771
system_scope: combat
---

# Aoeweapon Lunge

> Based on game build **714014** | Last updated: 2026-03-20

## Overview
`AOEWeapon_Lunge` is a combat component that extends `AOEWeapon_Base` to enable lunge-style attacks. When triggered, it calculates a trajectory between a starting position and target position, then hits all valid entities along that path. It handles damage application, visual effects, sound playback, and optional callback functions for pre and post-lunge events. This component is typically attached to weapon prefabs that perform sweeping or thrusting attacks.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("aoeweapon_lunge")
inst.components.aoeweapon_lunge:SetSideRange(2)
inst.components.aoeweapon_lunge:SetOnPreLungeFn(function(inst, doer, start, target)
    -- Setup before lunge
end)
inst.components.aoeweapon_lunge:DoLunge(doer, start_pos, target_pos)
```

## Dependencies & tags
**Components used:** `combat`, `health`, `weapon`, `aoeweapon_base`
**Tags:** Adds `aoeweapon_lunge` to the entity on initialization.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `siderange` | number | `1` | Lateral range from the lunge trajectory for hit detection. |
| `physicspadding` | number | `3` | Additional padding added to physics radius calculations. |
| `fxprefab` | string | `nil` | Prefab name for visual trail effects spawned during lunge. |
| `fxspacing` | number | `nil` | Distance between spawned FX prefabs along the trail. |
| `onprelungefn` | function | `nil` | Callback function executed before the lunge begins. |
| `onlungedfn` | function | `nil` | Callback function executed after the lunge completes. |
| `sound` | string | `nil` | Sound path played during the lunge attack. |

## Main functions
### `SetSideRange(range)`
*   **Description:** Configures the lateral detection range for targets during the lunge.
*   **Parameters:** `range` (number) - distance from the trajectory line for hit detection.
*   **Returns:** Nothing.

### `SetOnPreLungeFn(fn)`
*   **Description:** Registers a callback function to execute before the lunge attack begins.
*   **Parameters:** `fn` (function) - callback with signature `(inst, doer, startingpos, targetpos)`.
*   **Returns:** Nothing.

### `SetOnLungedFn(fn)`
*   **Description:** Registers a callback function to execute after the lunge attack completes.
*   **Parameters:** `fn` (function) - callback with signature `(inst, doer, startingpos, targetpos)`.
*   **Returns:** Nothing.

### `SetTrailFX(prefab, spacing)`
*   **Description:** Configures visual effects that spawn along the lunge trajectory path.
*   **Parameters:** `prefab` (string) - prefab name for FX entities. `spacing` (number) - distance between FX spawns.
*   **Returns:** Nothing.

### `SetSound(path)`
*   **Description:** Sets the sound to play during the lunge attack.
*   **Parameters:** `path` (string) - sound bank path.
*   **Returns:** Nothing.

### `DoLunge(doer, startingpos, targetpos)`
*   **Description:** Executes the lunge attack, detecting and hitting all valid targets along the trajectory from starting position to target position. Handles damage, FX, and callbacks.
*   **Parameters:** `doer` (entity) - the entity performing the lunge. `startingpos` (table) - start coordinates with `x` and `z` fields. `targetpos` (table) - end coordinates with `x` and `z` fields.
*   **Returns:** `true` if lunge executed successfully, `false` if validation fails (missing positions, doer, or combat component).
*   **Error states:** Returns `false` if `startingpos`, `targetpos`, `doer`, or `doer.components.combat` is missing or nil. Skips dead targets and entities in limbo.

## Events & listeners
None identified.