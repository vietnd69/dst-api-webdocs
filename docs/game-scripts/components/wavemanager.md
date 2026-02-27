---
id: wavemanager
title: Wavemanager
description: Manages procedural spawning of ocean wave visual effects (shimmer, shore) based on tile type, player position, and camera distance.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: cec24cbb
---

# Wavemanager

## Overview
This component dynamically spawns water surface visual effects (wave shimmer, shore waves) across the ocean floor tiles near the player. It runs on an update loop, spawning wave entities based on tile types, player proximity, and camera distance—scaling density and radius dynamically.

## Dependencies & Tags
- Requires `TheWorld.Map` to be available (world map interface).
- Relies on `ThePlayer` and `TheCamera` global objects.
- Calls `SpawnPrefab` to instantiate prefabs (`wave_shimmer`, `wave_shore`, `wave_shimmer_med`, `wave_shimmer_deep`).
- Registers itself for periodic updates via `inst:StartUpdatingComponent(self)` and may stop via `inst:StopUpdatingComponent(self)`.

No explicit component tags or additive/removals are observed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (assigned in constructor) | Reference to the owning entity (typically a world-level container). |
| `shimmer` | `table` | `nil` | Configuration map of wave spawning rules per tile type; keys are `WORLD_TILES.*` enum values, values include `per_sec`, `spawn_rate`, and `tryspawn` function. |
| `ripple_per_sec` | `number` | `10` | Target rate for ripple effects (currently unused in logic). |
| `ripple_idle_time` | `number` | `5` | Idle timeout before stopping ripples (currently unused in logic). |
| `shimmer_per_sec_mod` | `number` | `1.0` | Global multiplier scaling shimmer spawn rates; set to `≤0` triggers update loop termination. |
| `blockers` | `table` | `{}` | Map of blockers (`[entity] = distance`); wave spawning is prevented within this distance. |

## Main Functions

### `RegisterBlocker(inst, dist)`
* **Description:** Registers an entity as a blocker; no wave effects will spawn within `dist` units of this entity.
* **Parameters:**
  * `inst` (`Entity`): The entity acting as a blocker (e.g., a campfire,structure).
  * `dist` (`number`): Radius in units around the blocker where spawning is suppressed.

### `UnregisterBlocker(inst)`
* **Description:** Removes an entity from the blocker list, restoring normal wave spawning in its vicinity.
* **Parameters:**
  * `inst` (`Entity`): The previously registered blocker entity.

### `OnUpdate(dt)`
* **Description:** Core update loop. For each configured tile type, accumulates spawn probability over time (`spawn_rate += rate * dt`), and at each full unit of `spawn_rate`, attempts to spawn a wave at a random position within the shimmer radius around the player. Respects blockers and tile type constraints.
* **Parameters:**
  * `dt` (`number`): Delta time since last frame.

### `GetDebugString()`
* **Description:** Returns a debug-friendly string showing current shimmer radius and spawn rate multiplier (used for debugging/overlay).
* **Parameters:** None.

## Events & Listeners
None. This component does not register for or emit any events.

> **Note:** While the component periodically spawns prefabs, it does so via direct calls to `SpawnPrefab` rather than event dispatching; no `inst:PushEvent` or `inst:ListenForEvent` calls are present in the code.