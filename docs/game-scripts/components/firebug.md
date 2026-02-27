---
id: firebug
title: Firebug
description: Periodically spawns a fire prefab and triggers a talker announcement at randomized intervals after a delay, optionally skipping activation based on sanity thresholds.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: a55dcb73
---

# Firebug

## Overview
This component controls a periodic behavior where the entity spawns a fire prefab at its location and emits a predefined sound/announcement after an initial delay, then repeats at randomized intervals. It supports disabling via a sanity threshold and manages its own update loop lifecycle.

## Dependencies & Tags
- Requires components: `talker`, `transform`, and optionally `sanity`
- No tags are added or removed
- Uses global functions: `GetString`, `SpawnPrefab`, `math.random`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `time_to_fire` | `number` | `60` | Time (in seconds) remaining until the next fire event. |
| `time_interval` | `number` | `120` | Base interval (in seconds) between fire events. |
| `time_variance` | `number` | `120` | Maximum random variance (in seconds) added to `time_interval` to compute next fire time. |
| `sanity_threshold` | `number?` | `nil` | If set, the behavior is skipped while sanity is *at or above* this threshold during insanity mode. |
| `prefab` | `string?` | `nil` | Prefab name of the fire to spawn; if `nil`, no fire is spawned. |
| `enabled` | `boolean` | `false` (initially) | Whether the component is active and updating. Set to `true` on construction. |

## Main Functions
### `Enable(enable)`
* **Description:** Enables the component. If not already enabled, starts the update loop via `StartUpdatingComponent`.
* **Parameters:** `enable` — Optional boolean (unused in current implementation; method always enables if called).

### `Disable()`
* **Description:** Disables the component. Stops the update loop via `StopUpdatingComponent` if currently active.
* **Parameters:** None.

### `OnUpdate(dt)`
* **Description:** Core logic invoked each frame. Decrements `time_to_fire` until it expires, then triggers a talker announcement and optionally spawns a fire prefab. Resets `time_to_fire` with a randomized interval.
* **Parameters:** `dt` — Time (in seconds) since last frame.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string showing current state.
* **Parameters:** None.

## Events & Listeners
- Listens to component update (via `StartUpdatingComponent`/`StopUpdatingComponent`) but no explicit `ListenForEvent` calls.
- Does not push or trigger any events.