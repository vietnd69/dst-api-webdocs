---
id: archivemanager
title: Archivemanager
description: Manages the power state of the Archive structure and synchronizes world state tags.
tags: [archive, structure, world]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: components
source_hash: 1a55252b
system_scope: world
---

# Archivemanager

> Based on game build **714014** | Last updated: 2026-03-20

## Overview
`Archivemanager` is a server-only component responsible for controlling the power state of Archive structures. It toggles a private power flag and synchronizes this state with the global `WORLDSTATETAGS` system using the `ARCHIVES_ENERGIZED` tag. This component asserts that it only exists on the master simulation (`TheWorld.ismastersim`), preventing it from running on clients.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("archivemanager")

-- Turn power on
inst.components.archivemanager:SwitchPowerOn(true)

-- Check current state
local is_on = inst.components.archivemanager:GetPowerSetting()
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** Modifies the world state tag `ARCHIVES_ENERGIZED` via `WORLDSTATETAGS`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity | `nil` | The entity instance that owns this component. |

## Main functions
### `SwitchPowerOn(setting)`
*   **Description:** Toggles the internal power state and updates the world state tag. Pushes an event corresponding to the new state.
*   **Parameters:** `setting` (boolean) - `true` to enable power, `false` to disable.
*   **Returns:** Nothing.
*   **Error states:** No effect if the requested `setting` matches the current internal state.

### `GetPowerSetting()`
*   **Description:** Retrieves the current power state of the archive.
*   **Parameters:** None.
*   **Returns:** `boolean` - `true` if power is enabled, `false` otherwise.

### `GetDebugString()`
*   **Description:** Returns a string representation of the current power state for debugging purposes.
*   **Parameters:** None.
*   **Returns:** `string` - The string result of `tostring(_power_enabled)`.

## Events & listeners
-   **Listens to:** None.
-   **Pushes:** `arhivepoweron` - Fired when power is switched on (note the typo in the event name).
-   **Pushes:** `arhivepoweroff` - Fired when power is switched off (note the typo in the event name).