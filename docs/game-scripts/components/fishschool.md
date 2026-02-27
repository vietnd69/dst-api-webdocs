---
id: fishschool
title: Fishschool
description: Manages a fish school entity that spawns fish when caught in a fishing net and automatically replenishes fish over time.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: f3a7fa57
---

# Fishschool

## Overview
The `Fishschool` component governs the behavior of a fish school entity in the game. It maintains a fish count (`fish_level`) up to a maximum (`max_fish_level`), supports periodic replenishment of fish, and spawns fish prefabs when a fishing net overlaps with the school. It also manages animation transitions based on the current fish level.

## Dependencies & Tags
- `inst.components.animator` (via `inst.AnimState`) for animation playback.
- Listens to the `"on_pre_net"` event (triggered when a net collides with the entity).

No components are added programmatically by this script. The component assumes the host entity already has an `AnimState` component and supports the `"on_pre_net"` collision event.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `max_fish_level` | `number` | `3` | The maximum number of fish the school can hold. |
| `fish_level` | `number` | `max_fish_level` (i.e., 3) | Current number of fish available in the school. |
| `fish_prefab_name` | `string?` | `nil` | The prefab name of the fish to spawn when the school is netted. |
| `replenish_task` | `DoTaskInTime?` | `nil` | A periodic task used to replenish fish; `nil` if not active. |

## Main Functions
### `StartReplenish(replenish_rate)`
* **Description:** Starts a periodic task that increases `fish_level` by 1 every `replenish_rate` seconds (default 10s) until `max_fish_level` is reached. Cancels any existing replenish task first. Also resets animations if `fish_level` was 0.
* **Parameters:**  
  `replenish_rate: number?` — Time interval (in seconds) between replenishment ticks. Defaults to `10`.

### `StopReplenish()`
* **Description:** Cancels the active replenish task (if any) and sets `replenish_task` to `nil`.

### `SetNettedPrefab(fishing_net_prefab)`
* **Description:** Sets the prefab name to spawn when the fish school is netted. Must be called before netting to ensure fish spawn.
* **Parameters:**  
  `fishing_net_prefab: string` — The name of the fish prefab to spawn.

### `OnPreNet(net)`
* **Description:** Triggered when a net overlaps the entity. If `fish_level > 0`, spawns `fish_level` copies of the configured fish prefab at the net's position, fires `"on_caught_in_net"` on each, sets `fish_level` to `0`, and plays the post-animation sequence.
* **Parameters:**  
  `net: table` — The net entity involved in the collision, used to retrieve its world position.

### `Replenish()`
* **Description:** Increments `fish_level` by 1 (up to `max_fish_level`). Plays the pre- and loop animations when transitioning from 0 → 1 fish.

## Events & Listeners
- Listens to `"on_pre_net"` → calls `OnPreNet(net)`
- **No events are pushed/triggers** by this component (all event consumption is inbound).