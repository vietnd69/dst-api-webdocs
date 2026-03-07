---
id: fishschool
title: Fishschool
description: Manages a fish school entity that spawns fish when caught by a fishing net and replenishes its fish over time.
tags: [environment, entity, loot]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: f3a7fa57
system_scope: entity
---

# Fishschool

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`FishSchool` is a component that represents a school of fish which can be caught using a fishing net. It tracks the current number of fish available (`fish_level`) up to a maximum (`max_fish_level`), controls animation states for visual feedback, and periodically replenishes fish. When a net interacts with the school (`on_pre_net` event), it spawns individual fish prefabs and consumes all remaining fish.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("fishschool")
inst.components.fishschool:SetNettedPrefab("antchovies")
inst.components.fishschool:StartReplenish(30)  -- Replenish every 30 seconds
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `max_fish_level` | number | `3` | Maximum number of fish the school can hold. |
| `fish_level` | number | `max_fish_level` | Current number of fish available to be caught. |
| `fish_prefab_name` | string? | `nil` | Name of the prefab to spawn when caught (set via `SetNettedPrefab`). |
| `replenish_task` | Task? | `nil` | Reference to the periodic task responsible for fish replenishment. |

## Main functions
### `StartReplenish(replenish_rate)`
* **Description:** Starts a periodic task that calls `Replenish()` at the specified interval. If a replenishment task is already running, it is cancelled and replaced.
* **Parameters:** `replenish_rate` (number, optional) — time in seconds between replenishment ticks. Defaults to `10` if omitted.
* **Returns:** Nothing.

### `StopReplenish()`
* **Description:** Cancels any active replenishment task and clears the `replenish_task` reference.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetNettedPrefab(fishing_net_prefab)`
* **Description:** Sets the prefab name to be spawned when the fish school is caught by a net.
* **Parameters:** `fishing_net_prefab` (string) — the name of the prefab entity to spawn.
* **Returns:** Nothing.

### `OnPreNet(net)`
* **Description:** Triggered when the fish school entity is targeted by a fishing net. Spawns one instance of `fish_prefab_name` for each remaining fish, positions them at the net's location, and pushes `on_caught_in_net` on each spawned fish. Sets `fish_level` to `0` and plays the post-animation.
* **Parameters:** `net` (Entity) — the fishing net entity that triggered this event.
* **Returns:** Nothing.
* **Error states:** Does nothing if `fish_level <= 0`. Does nothing if `fish_prefab_name` is `nil`.

### `Replenish()`
* **Description:** Increases `fish_level` by `1`, up to `max_fish_level`. If fish were depleted (`fish_level == 0`), it plays the "group_pre" animation followed by looping "group_loop1" to reset visual state.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `on_pre_net` — handled by `OnPreNet` to catch fish when a net interacts with the school.  
- **Pushes:** Nothing.
