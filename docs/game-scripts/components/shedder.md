---
id: shedder
title: Shedder
description: Manages periodic or burst shedding of items from an entity at a specified height.
tags: [loot, environment, spawn]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 8598794c
system_scope: entity
---

# Shedder

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Shedder` is a component that enables an entity to drop (shed) items into the world either periodically or in bursts. It is typically used for seasonal or behavioral loot mechanics — for example, Bearger shedding meat at intervals. The component handles spawning prefabs at a configurable height above the entity and optionally applies initial velocity to shed items.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("shedder")
inst.components.shedder.shedItemPrefab = "meat"
inst.components.shedder.shedHeight = 6.5
inst.components.shedder:StartShedding(60)  -- shed every 60 seconds
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `shedItemPrefab` | string? | `nil` | Prefab name of the item to shed. If `nil`, no item spawns. |
| `shedHeight` | number | `6.5` | Vertical (Y) offset above the entity’s position where items are spawned. |
| `shedTask` | Task? | `nil` | Internal periodic task handle for scheduled shedding. |

## Main functions
### `StartShedding(interval)`
* **Description:** Starts a periodic shedding task that triggers item shedding at regular intervals. Cancels any existing shedding task first.
* **Parameters:** `interval` (number?, optional) — time in seconds between sheds. Defaults to `60` if not provided.
* **Returns:** Nothing.
* **Error states:** Does not error; silently cancels prior shed task if already running.

### `StopShedding()`
* **Description:** Cancels the periodic shedding task, stopping further automatic shedding.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No-op if no shed task is active.

### `DoSingleShed()`
* **Description:** Spawns a single item based on `shedItemPrefab` at a randomized horizontal position around the entity, at the configured `shedHeight`. Returns the spawned item instance.
* **Parameters:** None.
* **Returns:** `item` (GObject? or `nil`) — the spawned item, or `nil` if `shedItemPrefab` is `nil` or spawning failed.
* **Error states:** Returns `nil` if `SpawnPrefab` fails or if `shedItemPrefab` is `nil`. Position jitter is applied within ±0.5 world units in X and Z.

### `DoMultiShed(max, random)`
* **Description:** Spawns multiple items in quick succession, applying outward radial velocity to each. Ideal for "burst" shedding effects (e.g., explosion-style dispersal).
* **Parameters:**
  * `max` (number) — number of items to shed (or upper bound if `random` is `true`).
  * `random` (boolean) — if `true`, actual count is randomized between `1` and `max`.
* **Returns:** Nothing.
* **Error states:** Skips velocity application if an item lacks `Physics` or if physics is inactive. Velocity magnitude is fixed at `4` units/second.

## Events & listeners
- **Listens to:** `onremove` — triggers `StopShedding` via `Shedder.OnRemoveFromEntity` when the component is removed from its entity.
- **Pushes:** None.
