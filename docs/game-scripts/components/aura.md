---
id: aura
title: Aura
description: Manages periodic area-of-effect damage or effects around an entity.
tags: [combat, area, damage, effect]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: components
source_hash: b5611d97
system_scope: combat
---

# Aura

> Based on game build **714014** | Last updated: 2026-03-20

## Overview
The `Aura` component applies periodic effects, typically damage, to entities within a specific radius. It relies on the `combat` component to perform area attacks and manages internal scheduling to trigger these effects at set intervals. State changes regarding whether the aura is currently affecting targets are communicated via events.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("aura")
inst.components.aura.radius = 5
inst.components.aura.tickperiod = 2
inst.components.aura.auratestfn = function(inst, target) return true end
inst.components.aura:Enable(true)
```

## Dependencies & tags
**Components used:** `combat`
**Tags:** Excludes `noauradamage`, `INLIMBO`, `notarget`, `noattack`, `flight`, `invisible`, `playerghost`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `radius` | number | `3` | The effective range of the aura around the entity. |
| `tickperiod` | number | `1` | Time in seconds between each aura effect tick. |
| `active` | boolean | `false` | Indicates if the aura scheduling task is currently running. |
| `applying` | boolean | `false` | Indicates if the aura successfully hit targets in the last tick. |
| `pretickfn` | function | `nil` | Optional function called before each tick logic executes. |
| `auratestfn` | function | `nil` | Optional custom function to validate potential targets. |
| `auraexcludetags` | table | `{...}` | List of tags used to exclude entities from aura effects. |
| `_fn` | function | `function` | Internal wrapper for `auratestfn` bound to the instance. |

## Main functions
### `Enable(val)`
*   **Description:** Toggles the aura scheduling task on or off. Manages the internal `active` state and cancels or creates periodic tasks accordingly.
*   **Parameters:** `val` (any) - If `val ~= false`, the aura enables; otherwise, it disables.
*   **Returns:** Nothing.
*   **Error states:** If disabling while `applying` is `true`, pushes a `stopaura` event.

### `OnTick()`
*   **Description:** Executes the logic for a single aura tick. Calls `pretickfn` if set, then invokes `combat:DoAreaAttack` to apply effects to nearby entities.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Updates `applying` state based on whether hits occurred (`> 0`) and pushes `startaura` or `stopaura` events if the state changes.

### `GetDebugString()`
*   **Description:** Returns a formatted string containing current radius, active state, tick period, and applying status for debugging purposes.
*   **Parameters:** None.
*   **Returns:** `string` - Debug information.

## Events & listeners
-   **Listens to:** None (internally manages tasks via `inst:DoPeriodicTask`).
-   **Pushes:** `startaura` - Fired when the aura begins applying effects to targets.
-   **Pushes:** `stopaura` - Fired when the aura stops applying effects or is disabled.