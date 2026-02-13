---
id: archivemanager
title: Archivemanager
description: Controls the archive system's global power state, toggling a world state tag and notifying listeners when power changes.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: world
---

# archivemanager

## Overview
The `archivemanager` component is a master simulation-only component responsible for managing the "power state" of an archive-related game mechanic. It controls a global world state tag (`ARCHIVES_ENERGIZED`) and broadcasts events to the entity it is attached to when its power state changes. This component acts as a central control point for power-related interactions with an "archive" system within the game world.

## Dependencies & Tags
None identified as direct component dependencies for the host entity.
This component interacts with the global `WORLDSTATETAGS` utility to set and unset the `"ARCHIVES_ENERGIZED"` world state tag. It does not add or remove any specific tags from the entity it is attached to.

## Properties
| Property | Type | Default Value | Description |
| :------- | :--- | :------------ | :---------- |
| `inst` | `table` | `self` | A reference to the entity that this component is attached to. |

## Main Functions
### `SwitchPowerOn(setting)`
*   **Description:** This function is used to toggle the power state of the archive manager. It updates an internal private flag (`_power_enabled`), sets or unsets the global `ARCHIVES_ENERGIZED` world state tag, and pushes a corresponding event to the entity.
*   **Parameters:**
    *   `setting`: `boolean`. If `true`, power is turned on; if `false`, power is turned off.

### `GetPowerSetting()`
*   **Description:** Returns the current power state of the archive manager.
*   **Parameters:** None.

### `GetDebugString()`
*   **Description:** Returns a string representation of the current power state, primarily for debugging purposes.
*   **Parameters:** None.

## Events & Listeners
This component pushes the following events:
*   `"arhivepoweron"`: Triggered when `SwitchPowerOn(true)` is successfully called and the power state changes from off to on.
*   `"arhivepoweroff"`: Triggered when `SwitchPowerOn(false)` is successfully called and the power state changes from on to off.