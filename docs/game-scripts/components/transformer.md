---
id: transformer
title: Transformer
description: Manages switching an entity between two prefabs based on events or world state, preserving component and prefab data across transformations.
tags: [entity, network, save, transformation]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: cd3b9815
system_scope: entity
---

# Transformer

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Transformer` enables an entity to transform into a different prefab and later revert to its original form. It records the entity's state (including all component data) prior to transformation, stores it internally, and restores it upon reversion. The component supports event-driven or world-state-driven transformation triggers, optionally deferring the transformation until the entity goes to sleep (`entitysleep` event). It also provides full save/load support via `OnSave` and `OnLoad` callbacks, and handles cross-game state persistence in `LoadPostPass`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("transformer")
inst.components.transformer:SetTransformPrefab("beequeen")
inst.components.transformer:SetTransformEvent("do_transform")
inst.components.transformer:SetRevertEvent("do_revert")
-- When "do_transform" is fired on TheWorld, the entity will transform
-- When "do_revert" is fired on TheWorld, the entity will revert
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds or checks tags via the entity instance itself (not managed directly by this component).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (set in constructor) | The entity instance this component belongs to. |
| `transformPrefab` | string | `"rabbit"` | Prefab name to spawn on transformation. |
| `objectData` | table or `nil` | `nil` | Stored prefab and component state used for reversion. |
| `transformEvent` | string or `nil` | `nil` | Event name triggering transformation. |
| `transformEventTarget` | `Entity` or `nil` | `nil` | Entity context where `transformEvent` is listened (usually `TheWorld`). |
| `revertEvent` | string or `nil` | `nil` | Event name triggering reversion. |
| `revertEventTarget` | `Entity` or `nil` | `nil` | Entity context where `revertEvent` is listened. |
| `onTransform` | function or `nil` | `nil` | Optional callback invoked on transformation completion. |
| `onRevert` | function or `nil` | `nil` | Optional callback invoked on reversion completion. |
| `transformed` | boolean | `false` | Whether the entity is currently in transformed state. |
| `transformOffScreen` | boolean | `true` | If `true`, transformation/reversion is deferred until the entity goes to sleep (`entitysleep`). |
| `queuedTransform` | boolean | `false` | Whether transformation is queued due to sleeping with `transformOffScreen=true`. |
| `queuedRevert` | boolean | `false` | Whether reversion is queued due to sleeping with `transformOffScreen=true`. |

## Main functions
### `SetTransformPrefab(prefab)`
* **Description:** Sets the prefab name to spawn during transformation.
* **Parameters:** `prefab` (string) — name of the prefab to spawn.
* **Returns:** Nothing.

### `SetTransformEvent(event, target)`
* **Description:** Registers a listener for `event` to trigger transformation. Automatically schedules a 0.1s delayed listen to avoid race conditions.
* **Parameters:**  
  - `event` (string) — event name to listen for.  
  - `target` (`Entity` or `nil`) — entity context to attach listener (defaults to `TheWorld` if `nil`).
* **Returns:** Nothing.

### `SetRevertEvent(event, target)`
* **Description:** Registers a listener for `event` to trigger reversion. Automatically schedules a 0.1s delayed listen to avoid race conditions.
* **Parameters:**  
  - `event` (string) — event name to listen for.  
  - `target` (`Entity` or `nil`) — entity context to attach listener (defaults to `TheWorld` if `nil`).
* **Returns:** Nothing.

### `SetTransformWorldEvent(event, value)`
* **Description:** Registers a listener for a world state change event (e.g., `onmoonphasechange`) that triggers transformation *only* if the event’s value matches the optional `value` parameter.
* **Parameters:**  
  - `event` (string) — world state event name.  
  - `value` (any) — if provided, transformation occurs only when `event` fires with this value; if `nil`, any value triggers transformation.
* **Returns:** Nothing.

### `SetRevertWorldEvent(event, value)`
* **Description:** Registers a listener for a world state change event (e.g., `onmoonphasechange`) that triggers reversion *only* if the event’s value matches the optional `value` parameter.
* **Parameters:**  
  - `event` (string) — world state event name.  
  - `value` (any) — if provided, reversion occurs only when `event` fires with this value; if `nil`, any value triggers reversion.
* **Returns:** Nothing.

### `SetOnTransformFn(fn)`
* **Description:** Sets the callback invoked after transformation finishes.
* **Parameters:** `fn` (function) — callback function (no parameters or return value expected).
* **Returns:** Nothing.

### `SetOnRevertFn(fn)`
* **Description:** Sets the callback invoked after reversion finishes.
* **Parameters:** `fn` (function) — callback function (no parameters or return value expected).
* **Returns:** Nothing.

### `SetObjectData(data)`
* **Description:** Manually sets the `objectData` used for reversion. Usually called internally after `GetObjectData()`.
* **Parameters:** `data` (table) — a serialized state (must contain `prefab`, `component_data`, `prefab_data` keys).
* **Returns:** Nothing.

### `GetObjectData()`
* **Description:** Serializes the current entity’s state (prefab name, all `OnSave()` results from components, and `OnSave(self.inst, data)` result from the prefab itself) into `self.objectData`.
* **Parameters:** None.
* **Returns:** Nothing (writes to `self.objectData`).

### `SetOnLoadCheck(check)`
* **Description:** Assigns a predicate function used during `LoadPostPass` to determine whether to transform or revert after loading.
* **Parameters:** `check` (function) — callback: `fn(inst) → boolean`; returns `true` for transformed state desired.
* **Returns:** Nothing.

### `StartTransform()`
* **Description:** Begins transformation immediately if conditions allow (`transformOffScreen` and sleeping state), otherwise defers via `TransformOnSleep()`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No-op if already transformed (`self.transformed == true`).

### `StartRevert()`
* **Description:** Begins reversion immediately if conditions allow (`transformOffScreen` and sleeping state), otherwise defers via `RevertOnSleep()`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No-op if not currently transformed (`self.transformed == false`).

### `Transform()`
* **Description:** Spawns `self.transformPrefab`, copies position, applies stored `objectData` and relevant event handlers to the new instance, then removes the original entity.
* **Parameters:** None.
* **Returns:** Nothing.

### `Revert()`
* **Description:** Spawns the original prefab (from `self.objectData.prefab`), restores component and prefab data via `OnLoad`, then removes the current transformed entity.
* **Parameters:** None.
* **Returns:** Nothing.

### `TransformOnSleep()`
* **Description:** Queues a pending transformation and registers a one-time listener for the `entitysleep` event.
* **Parameters:** None.
* **Returns:** Nothing.

### `RevertOnSleep()`
* **Description:** Queues a pending reversion and registers a one-time listener for the `entitysleep` event.
* **Parameters:** None.
* **Returns:** Nothing.

### `RemoveSleepEvents()`
* **Description:** Clears pending sleep-event callbacks and resets `queuedTransform` and `queuedRevert`.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes the component state for network and save file persistence.
* **Parameters:** None.
* **Returns:** `data` (table) — serialized state; `refs` (table) — list of GUIDs to resolve in `LoadPostPass`.
* **Details:** Includes `queuedTransform`, `queuedRevert`, `transformPrefab`, `transformed`, `objectData`, all event fields, and targets’ GUIDs.

### `OnLoad(data)`
* **Description:** Restores state after loading, setting events/queued states as in `LoadPostPass`. Does *not* handle entity references — handled by `LoadPostPass`.
* **Parameters:** `data` (table) — deserialized data from `OnSave()`.
* **Returns:** Nothing.

### `LoadPostPass(ents, data)`
* **Description:** Resolves `transformEventTarget` and `revertEventTarget` using the `ents` map, and re-registers events. Also triggers `onLoadCheck` to re-evaluate desired state post-load.
* **Parameters:**  
  - `ents` (table) — entity ID-to-instance map from the save file.  
  - `data` (table) — deserialized component state.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `entitysleep` — triggers deferred transformation/reversion via `StartTransform`/`StartRevert`.
  - Any event set via `SetTransformEvent()` or `SetRevertEvent()` — triggers immediate transformation/reversion.
  - Any world state event set via `SetTransformWorldEvent()`/`SetRevertWorldEvent()` — triggers transformation/reversion if value condition is met.

- **Pushes:** None identified (does not fire custom events).
