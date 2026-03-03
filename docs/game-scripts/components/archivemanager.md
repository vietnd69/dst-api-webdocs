---
id: archivemanager
title: Archivemanager
description: Controls and tracks whether the Archives world state is energized, managing the `ARCHIVES_ENERGIZED` world state tag.
tags: [world, state, archive]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 1a55252b
system_scope: world
---

# Archivemanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Archivemanager` is a server-only component that manages the energized state of the Archives world state. It is responsible for toggling the `ARCHIVES_ENERGIZED` global world state tag and broadcasting state changes via events. This component is intended to be attached to a world-level entity and only exists on the master simulation (server), as enforced by the `TheWorld.ismastersim` assertion.

## Usage example
```lua
-- Attaching the component to a world-level entity
local world_entity = CreateEntity()
world_entity:AddComponent("archivemanager")

-- Energizing the Archives
world_entity.components.archivemanager:SwitchPowerOn(true)

-- Checking current power state
local is_energized = world_entity.components.archivemanager:GetPowerSetting()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Reads/writes `ARCHIVES_ENERGIZED` via `WORLDSTATETAGS.SetTagEnabled("ARCHIVES_ENERGIZED", enabled)`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *none* | Reference to the entity the component is attached to. |
| `_power_enabled` | boolean | `false` | Internal state tracking whether the Archives are energized. |

## Main functions
### `SwitchPowerOn(setting)`
* **Description:** Enables or disables the energized state of the Archives by updating the `ARCHIVES_ENERGIZED` world state tag and firing a corresponding event.
* **Parameters:** `setting` (boolean) — target state (`true` to energize, `false` to de-energize).
* **Returns:** Nothing.
* **Error states:** No-op if the current `_power_enabled` state already matches `setting`.

### `GetPowerSetting()`
* **Description:** Returns the current energized state of the Archives.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if energized, `false` otherwise.

### `GetDebugString()`
* **Description:** Returns a debug-friendly string representation of the current power state.
* **Parameters:** None.
* **Returns:** `string` — `"true"` or `"false"`.

## Events & listeners
- **Pushes:**  
  - `"arhivepoweron"` — fired when power is switched *on* (note: intentionally misspelled in source).  
  - `"arhivepoweroff"` — fired when power is switched *off*.
