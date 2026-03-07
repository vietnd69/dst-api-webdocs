---
id: sentryward
title: Sentryward
description: A deployable map-revealing structure that provides illumination and reveals fog of war; it can be hammered to collect loot and deactivates when burnt.
tags: [structure, lighting, map, exploration]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 09473943
system_scope: environment
---

# Sentryward

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `sentryward` prefab is a deployable structure that reveals fog of war and provides light in dark areas. It is constructed via the `sentryward_placer` and automatically registers a global map icon upon placement. The prefab integrates with several core systems: it burns like other wooden structures, exposes loot when hammered, and supports map revealing functionality while active.

## Usage example
```lua
-- Creating and deploying a sentryward programmatically:
local inst = Prefab("sentryward")
inst.Transform:SetPosition(x, y, z)
inst.components.workable:SetWorkLeft(4)
inst.components.maprevealer:Start() -- if starting in active state
inst.components.lootdropper:DropLoot() -- to manually trigger loot drop
```

## Dependencies & tags
**Components used:** `burnable`, `lootdropper`, `maprevealer`, `workable`, `inspectable`, `propagator`, `hauntable`, `obstacle`, `transform`, `animstate`, `soundemitter`, `minimapentity`, `network`

**Tags:** Adds `structure`, `maprevealer`, `burnable`, `hammerable`. Checks `burnt` to suppress animation overrides and prevent map revealing.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `icon` | `EntityRef` | `nil` | Reference to the spawned `globalmapicon` entity; initialized in `init()` unless burnt. |
| `animstate.bank` | string | `"sentryward"` | Animation bank used for the sentryward. |
| `animstate.build` | string | `"sentryward"` | Build name used for animation lookup. |

## Main functions
### `onhammered(inst)`
*   **Description:** Callback invoked when the sentryward is fully hammered; drops loot, spawns a collapse effect, and removes the entity.
*   **Parameters:** `inst` (EntityRef) – the sentryward instance being hammered.
*   **Returns:** Nothing.

### `onhit(inst)`
*   **Description:** Callback invoked on partial hammering; plays the "hit" animation followed by the idle loop (unless burnt).
*   **Parameters:** `inst` (EntityRef) – the sentryward instance.
*   **Returns:** Nothing.

### `onbuilt(inst)`
*   **Description:** Callback invoked after construction completes; plays placement sound and animation, transitions to idle loop.
*   **Parameters:** `inst` (EntityRef) – the sentryward instance.
*   **Returns:** Nothing.

### `onburnt(inst)`
*   **Description:** Callback invoked when the sentryward is fully burnt; stops map revealing and removes the global map icon if present.
*   **Parameters:** `inst` (EntityRef) – the burnt sentryward instance.
*   **Returns:** Nothing.

### `onsave(inst, data)`
*   **Description:** Serialization hook; records if the sentryward is currently burnt or burning.
*   **Parameters:** 
  - `inst` (EntityRef) – the sentryward instance.
  - `data` (table) – the save data table.
*   **Returns:** Nothing.

### `onload(inst, data)`
*   **Description:** Deserialization hook; reapplies burnt state if `data.burnt` is true.
*   **Parameters:** 
  - `inst` (EntityRef) – the sentryward instance.
  - `data` (table?) – saved data, may be `nil`.
*   **Returns:** Nothing.

### `init(inst)`
*   **Description:** Initializes the global map icon *only* for pristine (non-burnt) instances.
*   **Parameters:** `inst` (EntityRef) – the sentryward instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `burntup` – triggers `onburnt` when the structure finishes burning.
- **Listens to:** `onbuilt` – triggers `onbuilt` after the structure is fully built.
- **Pushes:** `entity_droploot` (via `lootdropper:DropLoot`) – fires when loot is spawned.