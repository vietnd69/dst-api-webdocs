---
id: cookiecutterdrill
title: Cookiecutterdrill
description: This component manages the progress of a drilling operation, typically by a Cookie Cutter entity, to inflict damage and create a leak on a boat.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: 6407c4f4
---

# Cookiecutterdrill

## Overview
This component is responsible for managing the state and progress of a drilling action performed by an entity, such as a Cookie Cutter. It tracks drilling progress over time, determines when the drilling is complete, and upon completion, triggers damage to a boat's hull and spawns a new boat leak at the drill's position. It also manages the sound associated with the drilling action.

## Dependencies & Tags
This component interacts with the following other components:
*   `boat.components.hullhealth`: When drilling is finished, it may apply damage to the `hullhealth` component of the boat entity.
*   `self.inst.components.eater`: When drilling is finished, it may update the `lasteattime` property of the drill's own `eater` component.
None identified.

## Properties
| Property | Type | Default Value | Description |
| :------- | :--- | :------------ | :---------- |
| `drill_progress` | `number` | `0` | The current accumulated progress of the drilling operation, measured in seconds. |
| `drill_duration` | `number` | `10` | The total time, in seconds, required for the drilling operation to be considered complete. |
| `leak_type` | `string` | `"med_leak"` | A string identifier for the type of leak that will be spawned on the boat upon successful drilling. |
| `leak_damage` | `number` or `nil` | `nil` | The amount of damage to inflict on the boat's `hullhealth` component when drilling finishes. If `nil`, no damage is applied. |
| `sound` | `string` | `"turnoftides/common/together/boat/damage"` | The sound path to be played when the drilling operation finishes. |
| `sound_intensity` | `number` | `0.8` | The intensity or volume at which the `sound` will be played. |

## Main Functions
### `OnEntitySleep()`
*   **Description:** Called when the entity that owns this component goes to sleep. It stops the component from updating its internal state.
*   **Parameters:** None.

### `GetIsDoneDrilling()`
*   **Description:** Checks if the current drilling progress has met or exceeded the required duration.
*   **Parameters:** None.

### `ResetDrilling()`
*   **Description:** Resets the `drill_progress` back to zero, effectively restarting the drilling process.
*   **Parameters:** None.

### `ResumeDrilling()`
*   **Description:** Starts or resumes the component's update cycle, allowing `drill_progress` to increase.
*   **Parameters:** None.

### `PauseDrilling()`
*   **Description:** Stops the component's update cycle, pausing the `drill_progress`.
*   **Parameters:** None.

### `FinishDrilling()`
*   **Description:** Completes the drilling operation. It stops the component from updating, resets progress, damages the boat's hull (if `leak_damage` is set), and triggers the creation of a new boat leak. It also updates the last eat time of the drill's `eater` component if present.
*   **Parameters:** None.

### `OnUpdate(dt)`
*   **Description:** This function is called every frame when the component is updating. It increments the `drill_progress` by the elapsed delta time.
*   **Parameters:**
    *   `dt`: (`number`) The time elapsed since the last frame.

## Events & Listeners
*   **Pushes Event:** `spawnnewboatleak` on the `boat` entity when `FinishDrilling()` is called. This event includes the position (`pt`), leak size (`leak_size`), and a flag to play sound effects (`playsoundfx`).