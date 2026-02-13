---
id: aoeweapon_lunge
title: Aoeweapon Lunge
description: Implements a lunge-style area-of-effect weapon attack that damages and tosses targets along a defined path.
sidebar_position: 1

last_updated: 2026-02_13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# aoeweapon_lunge

## Overview
The `aoeweapon_lunge` component extends the functionality of `AOEWeapon_Base` to implement a specific type of area-of-effect attack characterized by a "lunge" motion. It defines properties for the lunge's side range and physics padding, and provides methods to perform a lunge attack from a starting point to a target point. This attack can damage hostile entities along its path and at its destination, and can also toss items. It supports custom callback functions for pre-lunge and post-lunge events, and can spawn visual trail effects.

## Dependencies & Tags
-   Relies on `inst.components.combat` being present on the attacking entity (`doer`).
-   Relies on `inst.components.weapon` being present on the component's parent entity (`self.inst`).
-   Adds the tag `"aoeweapon_lunge"` to the parent entity.

## Properties
| Property | Type | Default Value | Description |
|---|---|---|---|
| `siderange` | `number` | `1` | The horizontal radius used for detecting targets around the lunge path. Can be set via `SetSideRange()`. |
| `physicspadding` | `number` | `3` | Additional padding used when querying `TheSim:FindEntities` to ensure physics bodies are adequately covered. |
| `fxprefab` | `string` | `nil` | The prefab name for a visual effect to be spawned along the lunge path. Set via `SetTrailFX()`. |
| `fxspacing` | `number` | `nil` | The distance between individual `fxprefab` instances along the lunge path. Set via `SetTrailFX()`. |
| `onprelungefn` | `function` | `nil` | A callback function executed before the lunge attack calculations begin. Set via `SetOnPreLungeFn()`. |
| `onlungedfn` | `function` | `nil` | A callback function executed after the lunge attack calculations are complete. Set via `SetOnLungedFn()`. |
| `sound` | `string` | `nil` | The sound path to play when the lunge is performed. Set via `SetSound()`. |

## Main Functions
### `SetSideRange(range)`
*   **Description:** Sets the `siderange` property, which determines the width of the lunge attack's area of effect for target detection.
*   **Parameters:**
    *   `range`: (`number`) The new side range value.

### `SetOnPreLungeFn(fn)`
*   **Description:** Sets a callback function to be executed just before the lunge's hit and toss calculations begin. This allows for custom logic to run at the start of the lunge.
*   **Parameters:**
    *   `fn`: (`function`) The function to call. It receives `(inst, doer, startingpos, targetpos)` as arguments.

### `SetOnLungedFn(fn)`
*   **Description:** Sets a callback function to be executed after all the lunge's hit, toss, and FX calculations are complete. This allows for custom logic to run at the end of the lunge.
*   **Parameters:**
    *   `fn`: (`function`) The function to call. It receives `(inst, doer, startingpos, targetpos)` as arguments.

### `SetTrailFX(prefab, spacing)`
*   **Description:** Configures the visual effects to be spawned along the lunge path.
*   **Parameters:**
    *   `prefab`: (`string`) The prefab name of the visual effect to spawn.
    *   `spacing`: (`number`) The distance between instances of the `prefab` along the lunge path.

### `SetSound(path)`
*   **Description:** Sets the sound path to be played when the lunge attack is performed.
*   **Parameters:**
    *   `path`: (`string`) The asset path to the sound.

### `DoLunge(doer, startingpos, targetpos)`
*   **Description:** Executes the lunge attack. This function calculates the area of effect, identifies targets to hit, identifies items to toss, applies damage, and spawns visual effects. It temporarily modifies the `doer`'s combat properties (e.g., `ignorehitrange`, `EnableAreaDamage`) during calculations. It calls `self:OnHit()` for entities hit and `self:OnToss()` for items tossed (these methods are inherited from `AOEWeapon_Base`).
*   **Parameters:**
    *   `doer`: (`entity`) The entity performing the lunge attack (e.g., the player or mob). Must have a `combat` component.
    *   `startingpos`: (`vector3`) The world position where the lunge starts.
    *   `targetpos`: (`vector3`) The world position where the lunge ends.
*   **Returns:** `boolean` - `true` if the lunge operation was initiated, `false` otherwise (e.g., invalid parameters).

## Events & Listeners
None identified.