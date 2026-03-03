---
id: acidlevel
title: Acidlevel
description: Manages acid rain damage and effects for entities, tracking accumulated acid exposure and applying damage to health, equipment, and perishable items over time.
tags: [environment, combat, inventory]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: c27bf3b6
system_scope: environment
---

# Acidlevel

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Acidlevel` tracks the level of acid exposure on an entity during acid rain events and applies damage accordingly. It works in conjunction with `moisture`, `health`, `inventory`, `armor`, `fueled`, `perishable`, and `waterproofer` components to calculate and distribute acid rain damage. The component monitors the world state for `isacidraining` and `israining` to start/stop periodic tasks and supports mod overrides via callback functions.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("acidlevel")

-- Set custom callback for when acid rain starts
inst.components.acidlevel:SetOnStartIsAcidRainingFn(function(ent)
    print("Acid rain started for", ent_prefab)
end)

-- Manually adjust acid level
inst.components.acidlevel:SetPercent(0.5)
```

## Dependencies & tags
**Components used:** `health`, `inventory`, `armor`, `fueled`, `perishable`, `moisture`, `rainimmunity`, `waterproofer`, `inventoryitem`, `inventory`  
**Tags:** Checks `acidrainimmune` on entity and equipment; manages `isacidsizzling` on items via `inventoryitem` component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `max` | number | `100` | Maximum acid level value. |
| `current` | number | `0` | Current accumulated acid level. |
| `ignoreacidrainticks` | boolean | `nil` | If set, prevents acid rain damage ticks. |
| `overrideacidraintick` | function | `nil` | Optional mod override function for custom acid rain tick behavior. |
| `onstartisacidrainingfn` | function | `nil` | Callback triggered when acid rain starts. |
| `onstopisacidrainingfn` | function | `nil` | Callback triggered when acid rain stops. |
| `onstartisrainingfn` | function | `nil` | Callback triggered when regular rain starts. |
| `onstopisrainingfn` | function | `nil` | Callback triggered when regular rain stops. |

## Main functions
### `SetIgnoreAcidRainTicks(ignoreacidrainticks)`
*   **Description:** Enables or disables acid rain damage ticks. When toggling from enabled to disabled, triggers the `onstartisacidrainingfn` callback; vice versa triggers `onstopisacidrainingfn`.
*   **Parameters:** `ignoreacidrainticks` (boolean) - whether to skip acid rain damage ticks.
*   **Returns:** Nothing.

### `SetOverrideAcidRainTickFn(fn)`
*   **Description:** Sets a function to override default acid rain tick behavior. The function receives `(inst, damage)` and may return a modified damage value; returning `0` skips further default processing.
*   **Parameters:** `fn` (function) - the override function.
*   **Returns:** Nothing.

### `OnIsAcidRaining(isacidraining)`
*   **Description:** Handles world state change for acid rain. Starts/stops a periodic task (`DoAcidRainTick`) and triggers start/stop callbacks.
*   **Parameters:** `isacidraining` (boolean) - current acid rain state.
*   **Returns:** Nothing.

### `OnIsRaining(israining)`
*   **Description:** Handles world state change for regular rain. Starts/stops a periodic task (`DoRainTick`) and triggers start/stop callbacks.
*   **Parameters:** `israining` (boolean) - current rain state.
*   **Returns:** Nothing.

### `DoDelta(delta)`
*   **Description:** Adjusts the current acid level by `delta`, clamping between `0` and `max`, and fires `acidleveldelta` event with percent changes.
*   **Parameters:** `delta` (number) - amount to add to current acid level.
*   **Returns:** Nothing.

### `GetPercent()`
*   **Description:** Returns the current acid level as a percentage of `max`.
*   **Parameters:** None.
*   **Returns:** number (0.0 to 1.0).

### `SetPercent(percent)`
*   **Description:** Sets the acid level to a given percentage of `max`.
*   **Parameters:** `percent` (number) - desired percentage (0.0 to 1.0).
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a formatted string of current/max acid level.
*   **Parameters:** None.
*   **Returns:** string - e.g., `"50.00 / 100.00"`.

## Events & listeners
- **Listens to:** `isacidraining`, `israining` — via `WatchWorldState` to trigger state changes.
- **Pushes:** `acidleveldelta` — fired on `DoDelta`, with payload `{ oldpercent, newpercent }`.
