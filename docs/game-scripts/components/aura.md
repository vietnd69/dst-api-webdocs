---
id: aura
title: Aura
description: Manages a periodic area-of-effect that applies a customizable test function to nearby entities.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: combat
source_hash: b5611d97
---

# Aura

## Overview
The Aura component creates a periodic, circular area of effect (AoE) around an entity. When enabled, it regularly scans for other entities within a configurable radius. A custom test function can be provided to filter which targets are affected. The component uses the `combat` component's `DoAreaAttack` method to apply its effects, making it ideal for continuous damage or status effects. It also broadcasts events to signal when it starts and stops affecting targets.

## Dependencies & Tags
**Dependencies:**
- `combat`: This component is used to perform the area attack and apply the effect to targets.

**Tags:**
This component does not add any tags to its owner. However, it will ignore entities possessing any of the following tags:
- `noauradamage`
- `INLIMBO`
- `notarget`
- `noattack`
- `flight`
- `invisible`
- `playerghost`

## Properties
| Property          | Type      | Default Value                                                                                  | Description                                                                                              |
| ----------------- | --------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `radius`          | number    | `3`                                                                                            | The radius of the aura's effect in game units.                                                           |
| `tickperiod`      | number    | `1`                                                                                            | The time in seconds between each aura tick.                                                              |
| `active`          | boolean   | `false`                                                                                        | Tracks if the aura is currently enabled and ticking.                                                     |
| `applying`        | boolean   | `false`                                                                                        | Tracks if the aura successfully affected at least one target on the previous tick.                       |
| `pretickfn`       | function  | `nil`                                                                                          | An optional function that is called on the owner entity at the start of each tick, before the AoE check. |
| `auratestfn`      | function  | `nil`                                                                                          | A custom function to validate potential targets. It receives the aura owner and the target as arguments. |
| `auraexcludetags` | table     | `{ "noauradamage", "INLIMBO", "notarget", "noattack", "flight", "invisible", "playerghost" }` | A list of tags that will cause an entity to be ignored by the aura.                                      |

## Main Functions
### `Enable(val)`
* **Description:** Enables or disables the aura's periodic tick. When enabled, it starts a periodic task. When disabled, it cancels the task and pushes a `stopaura` event if the aura was active.
* **Parameters:**
    * `val` (boolean): `true` to enable the aura, `false` to disable it.

### `OnTick()`
* **Description:** This function is executed at each interval defined by `tickperiod`. It first calls the `pretickfn` if one exists, then performs an area attack via the `combat` component, using `auratestfn` to filter targets. It then pushes `startaura` or `stopaura` events based on whether any targets were affected.

### `GetDebugString()`
* **Description:** Returns a formatted string containing the current state of the aura, including its radius, tick period, and whether it is active and applying its effect. This is primarily used for debugging purposes.
* **Parameters:** None.

## Events & Listeners
This component pushes the following events on its owner entity:
- **`startaura`**: Pushed when the aura tick successfully affects one or more targets, and was not affecting any on the previous tick.
- **`stopaura`**: Pushed when the aura tick affects no targets, but was affecting at least one on the previous tick. Also pushed when `Enable(false)` is called while the aura was applying.