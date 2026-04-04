---
id: aoeweapon_leap
title: Aoeweapon Leap
description: Extends AOEWeapon_Base to provide leap attack functionality with area-of-effect damage and target tossing.
tags: [combat, weapon, aoe, leap]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: components
source_hash: 7aba6739
system_scope: combat
---

# Aoeweapon Leap

> Based on game build **714014** | Last updated: 2026-03-20

## Overview
`Aoeweapon_Leap` is a combat component that extends `AOEWeapon_Base` to enable leap-based area-of-effect attacks. When triggered via `DoLeap`, it damages all valid entities within a radius around the target position and can toss lightweight inventory items. This component is typically attached to weapons or abilities that perform jumping attacks, working alongside the `combat` and `weapon` components to modify damage output during the leap sequence.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("aoeweapon_leap")
inst.components.aoeweapon_leap:SetAOERadius(5)
inst.components.aoeweapon_leap:SetOnPreLeapFn(function(inst, doer, start, target)
    -- Prepare leap animation
end)
inst.components.aoeweapon_leap:DoLeap(doer, start_pos, target_pos)
```

## Dependencies & tags
**Components used:** `aoeweapon_base` (parent), `combat`, `health`, `weapon`
**Tags:** Adds `aoeweapon_leap` to the entity instance.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `aoeradius` | number | `4` | Radius in world units for area damage detection. |
| `physicspadding` | number | `3` | Additional padding added to radius for physics calculations. |
| `onpreleapfn` | function | `nil` | Callback function invoked before leap execution. |
| `onleaptfn` | function | `nil` | Callback function invoked after leap completion. |
| `damage` | number | inherited | Damage value inherited from parent class. |
| `notags` | table | inherited | Entity tags to exclude from targeting. |
| `combinedtags` | table | inherited | Entity tags to include for targeting. |

## Main functions
### `SetAOERadius(radius)`
*   **Description:** Configures the area-of-effect radius for the leap attack.
*   **Parameters:** `radius` (number) - The new radius value in world units.
*   **Returns:** Nothing.

### `SetOnPreLeapFn(fn)`
*   **Description:** Registers a callback function to execute before the leap begins.
*   **Parameters:** `fn` (function) - Function with signature `(inst, doer, startingpos, targetpos)`.
*   **Returns:** Nothing.

### `SetOnLeaptFn(fn)`
*   **Description:** Registers a callback function to execute after the leap completes.
*   **Parameters:** `fn` (function) - Function with signature `(inst, doer, startingpos, targetpos)`.
*   **Returns:** Nothing.

### `DoLeap(doer, startingpos, targetpos)`
*   **Description:** Executes the leap attack, dealing area damage to entities near the target position and tossing eligible inventory items. Temporarily disables area damage on the doer's combat component during execution.
*   **Parameters:**
    *   `doer` (entity) - The entity performing the leap (must have `combat` component).
    *   `startingpos` (table) - Starting position table with `x`, `y`, `z` fields.
    *   `targetpos` (table) - Target landing position table with `x`, `y`, `z` fields.
*   **Returns:** `true` on successful execution, `false` if validation fails.
*   **Error states:** Returns `false` if `startingpos`, `targetpos`, or `doer` is nil, or if `doer` lacks a `combat` component.

## Events & listeners
None identified. This component does not register any event listeners via `ListenForEvent` nor push custom events via `PushEvent`.