---
id: unevenground
title: Unevenground
description: Periodically detects and notifies nearby players of uneven ground terrain in a circular area around the entity.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 264c1795
---

# Unevenground

## Overview
This component monitors the area around an entity and periodically broadcasts a `unevengrounddetected` event to all nearby living players, signaling the presence of uneven terrain within a defined radius. It integrates with the DST Entity Component System to support dynamic terrain responses—such as visual effects or gameplay adjustments—based on terrain irregularities.

## Dependencies & Tags
* Depends on: `inst.Transform` (for world position), `inst:IsAsleep()`, `inst:DoTaskInTime()`, `inst:DoPeriodicTask()`, `inst:PushEvent()`
* Tags: None explicitly added or removed.
* Relies on `AllPlayers` global list and player tags like `"playerghost"`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the host entity (set in constructor). |
| `enabled` | `boolean` | `true` | Controls whether detection is active; can be toggled via `Enable()`/`Disable()`. |
| `radius` | `number` | `3` | Radius (in world units) of the uneven ground effect area. |
| `detectradius` | `number` | `15` | Maximum distance from the entity at which players will receive detection events. |
| `detectperiod` | `number` | `0.6` | Time interval (in seconds) between consecutive detection events. |
| `detecttask` | `Task` | `nil` | Reference to the active periodic task; `nil` when stopped. |

## Main Functions

### `Start()`
* **Description:** Begins the periodic terrain detection if not already running. Schedules a delayed task (`OnStartTask`) that initiates the main periodic loop. Ignores calls when `enabled` is false or the entity is asleep.
* **Parameters:** None.

### `Stop()`
* **Description:** Cancels and nullifies the periodic detection task, halting all events until re-enabled. Used internally by `Disable()` and lifecycle hooks.
* **Parameters:** None.

### `Enable()`
* **Description:** Activates the component if currently disabled. Restarts detection *only* if the entity is awake; otherwise, defers until `OnEntityWake`.
* **Parameters:** None.

### `Disable()`
* **Description:** Deactivates the component, stopping detection and clearing the task. Does *not* affect the `enabled` state permanently—subsequent `Enable()` calls will resume.
* **Parameters:** None.

### `OnEntityWake()`
* **Description:** Lifecycle callback triggered when the entity wakes from sleep. Restarts detection if the component is enabled.
* **Parameters:** None (auto-invoked by the engine).

### `OnEntitySleep()`
* **Description:** Alias to `Stop()`. Triggered when the entity goes to sleep, pausing detection until wake-up.
* **Parameters:** None (auto-invoked by the engine).

### `OnRemoveFromEntity()`
* **Description:** Alias to `Stop()`. Ensures cleanup and prevents dangling tasks when the component is removed from the entity.
* **Parameters:** None (auto-invoked by the engine).

## Events & Listeners
* **Pushes Events:**
  * `unevengrounddetected` — Broadcast to all non-ghost players within `detectradius` (squared). Carries payload `{ inst = inst, radius = self.radius, period = self.detectperiod }`.
* **Does Not Listen For:** No `inst:ListenForEvent` calls are present; this component only emits events.