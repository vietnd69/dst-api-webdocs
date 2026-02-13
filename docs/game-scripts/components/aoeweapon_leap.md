---
id: aoeweapon_leap
title: Aoeweapon Leap
description: Implements a leap-style area-of-effect attack that damages and tosses targets around a chosen landing position.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# aoeweapon_leap

## Overview
This component extends `AOEWeapon_Base` and is designed to handle "leap" type Area of Effect (AoE) attacks for an entity. It defines the radius for both damaging and tossing targets around a specific landing position. It manages the temporary modification of the doer's combat properties (e.g., ignoring hit range, disabling area damage) during the leap sequence, identifies targets within its AoE, applies damage, and can toss specific items within its range.

## Dependencies & Tags
*   **Inherits from:** `components/aoeweapon_base`
*   **Requires (on doer entity):** `combat` component (e.g., `doer.components.combat`)
*   **Requires (on component's instance):** `weapon` component (optional, if present, its damage/wear properties are temporarily modified)
*   **Added Tags:**
    *   `aoeweapon_leap`: Added to the component's instance.
*   **Tags used for target filtering (internal to `DoLeap` for tossing):**
    *   `_inventoryitem` (MUSTTAGS)
    *   `locomotor`, `INLIMBO` (CANTTAGS)

## Properties
| Property         | Type       | Default Value | Description                                                                                             |
| :--------------- | :--------- | :------------ | :------------------------------------------------------------------------------------------------------ |
| `aoeradius`      | `number`   | `4`           | The primary radius for applying AoE effects (damage and tossing) around the target position.            |
| `physicspadding` | `number`   | `3`           | Additional padding added to `aoeradius` when searching for entities, accounting for physics radii.      |
| `onpreleapfn`    | `function` | `nil`         | A callback function executed just before the leap effects (damage/toss) are applied.                    |
| `onleaptfn`      | `function` | `nil`         | A callback function executed after all leap effects (damage/toss) have been applied.                    |

## Main Functions
### `SetAOERadius(radius)`
*   **Description:** Sets the radius for the Area of Effect.
*   **Parameters:**
    *   `radius`: (`number`) The new radius value.

### `SetOnPreLeapFn(fn)`
*   **Description:** Sets a callback function to be executed just before the leap's effects are applied.
*   **Parameters:**
    *   `fn`: (`function`) The function to call. It receives `(inst, doer, startingpos, targetpos)` as arguments.

### `SetOnLeaptFn(fn)`
*   **Description:** Sets a callback function to be executed after all of the leap's effects have been applied.
*   **Parameters:**
    *   `fn`: (`function`) The function to call. It receives `(inst, doer, startingpos, targetpos)` as arguments.

### `DoLeap(doer, startingpos, targetpos)`
*   **Description:** Initiates the leap attack sequence. This is the core function of the component, handling target identification, damage application, and item tossing at a specified target location.
*   **Parameters:**
    *   `doer`: (`entity`) The entity performing the leap. Must have a `combat` component.
    *   `startingpos`: (`vector3`) The world position from which the `doer` initiates the leap.
    *   `targetpos`: (`vector3`) The world position where the `doer` lands and the AoE effects are centered.

## Events & Listeners
None identified for this specific component. (Note: The base class `AOEWeapon_Base` typically handles pushing `areaattack` events when `OnHit` is called.)