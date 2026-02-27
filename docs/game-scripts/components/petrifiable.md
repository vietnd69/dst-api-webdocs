---
id: petrifiable
title: Petrifiable
description: Controls the petrification state of an entity, including timed delays, chaining to nearby entities, and save/load persistence.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: f691186b
---

# Petrifiable

## Overview
This component manages the petrification logic for an entity, enabling delayed or immediate petrification, propagation ("chaining") to nearby petrifiable entities within range, and proper handling of sleep/wake states and persistence across sessions.

## Dependencies & Tags
- Adds the `"petrifiable"` tag to the entity upon initialization.
- Relies on the entity having `FindEntity`, `DoTaskInTime`, `RemoveEventCallback`, `ListenForEvent`, `PushEvent`, and `RemoveTag` available in its context (standard engine functions).
- No additional component dependencies are explicitly added by this script.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the owning entity. Set in constructor. |
| `onPetrifiedFn` | `function?` | `nil` | Optional callback invoked when petrification completes. |
| `petrified` | `boolean` | `false` | Indicates whether the entity is currently petrified. |
| `_petrifytask` | `Task?` | `nil` | Pending task scheduled to trigger petrification. |
| `_waketask` | `Task?` | `nil` | Pending task scheduled to wake the entity (used only when petrifying while asleep). |

## Main Functions

### `Petrifiable:Petrify(immediate)`
* **Description:** Initiates the petrification process for the entity. If `immediate` is `true` (or omitted), petrification occurs after a short random delay. If `immediate` is `false` and the entity is asleep, it schedules a wake timer; otherwise, it schedules a delayed petrify task.
* **Parameters:**
  * `immediate` (optional, `boolean?`): If not `false`, petrification proceeds after a short delay. If `false`, behavior depends on sleep state.

### `Petrifiable:SetPetrifiedFn(fn)`
* **Description:** Registers a callback function to be executed when petrification completes (i.e., when `DoPetrify` finishes chaining).
* **Parameters:**
  * `fn` (function): A function that accepts the entity instance as its sole argument.

### `Petrifiable:IsPetrified()`
* **Description:** Returns whether the entity is currently in the petrified state.
* **Parameters:** None.

### `Petrifiable:OnRemoveFromEntity()`
* **Description:** Cleans up tasks and removes tags/events upon component removal. If not already petrified, unregisters the entity from world-wide petrifiable tracking and removes the `"petrifiable"` tag.
* **Parameters:** None.

### `Petrifiable:OnSave()`
* **Description:** Serializes the current petrified state and any pending wake timer for save/load compatibility.
* **Parameters:** None.
* **Returns:** `nil` if not petrified; otherwise, a table containing `remainingtime` for the wake task.

### `Petrifiable:OnLoad(data)`
* **Description:** Restores petrified state and pending tasks from saved data.
* **Parameters:**
  * `data` (table?): Saved state containing `remainingtime`.

### `Petrifiable:GetDebugString()`
* **Description:** Returns a debug-friendly string summarizing the petrified state and remaining times of pending tasks.
* **Parameters:** None.
* **Returns:** `string`

## Events & Listeners

- **Listens to:**
  - `"entitywake"` — triggers `OnEntityWake` to handle scheduled wake tasks.
- **Pushes:**
  - `"ms_registerpetrifiable"` — when component is added and entity is petrifiable.
  - `"ms_unregisterpetrifiable"` — when component is removed and entity is not yet petrified.
  - Custom event (via callback) `onPetrifiedFn(inst)` — invoked after petrification logic completes.

### Helper Internal Events & Listeners

- `OnEntityWake(inst)` — internal callback invoked when the entity wakes up naturally or via scheduled task. Handles scheduling petrify tasks if none exist.
- `DoChainPetrify(...)` — schedules chained petrification for nearby entities if applicable.
- `DoPetrify(inst, self, OnEntityWake)` — performs core petrification logic and initiates chaining.
- `DoWake(inst, self, OnEntityWake)` — completes the wake process by invoking the callback and cleaning up.