---
id: transformer
title: Transformer
description: This component enables an entity to transform into another prefab on command or in response to events, preserving its state, and later revert back to its original form.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: cd3b9815
---

# Transformer

## Overview
The `Transformer` component allows an entity to switch its identity to a different prefab (e.g., rabbit) and later revert to its original form, while persisting component and instance data across transformations. It supports transformation/reversion triggers via custom events, world state changes, or direct calls, and handles deferred actions during sleep states or off-screen transitions. Designed for entities that need temporary transformation behavior (e.g., character transformations, creature metamorphosis), it integrates seamlessly with DST’s `OnSave`/`OnLoad` lifecycle and networking.

## Dependencies & Tags
**Dependencies:**
- Requires the entity to have the `transform` component for `Transform:SetPosition(...)` calls.
- Relies on `TheWorld` for global event handling when event targets are not specified.
- Uses `SpawnPrefab(...)` internally — no special prefabs required beyond valid transform/revert targets.
  
**Tags:**
- None explicitly added or removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *(auto-assigned)* | Reference to the entity the component is attached to. |
| `transformPrefab` | `string` | `"rabbit"` | Name of the prefab to transform into. |
| `objectData` | `table` or `nil` | `nil` | Stores the original entity’s `component_data` and `prefab_data` used for reverting. Populated by `GetObjectData()` before transform. |
| `transformEvent` | `string` or `nil` | `nil` | Name of the event that triggers transformation. |
| `transformEventTarget` | `Entity` or `nil` | `nil` | Event listener target (e.g., entity or `TheWorld`) for transform event. |
| `revertEvent` | `string` or `nil` | `nil` | Name of the event that triggers reversion. |
| `revertEventTarget` | `Entity` or `nil` | `nil` | Event listener target for revert event. |
| `transformWorldEvent` | `string` or `nil` | `nil` | Name of a world-state event that may trigger transform (based on value match). |
| `transformWorldEventValue` | `any` or `nil` | `nil` | Expected value for `transformWorldEvent` to trigger transformation. |
| `revertWorldEvent` | `string` or `nil` | `nil` | Name of a world-state event that may trigger reversion. |
| `revertWorldEventValue` | `any` or `nil` | `nil` | Expected value for `revertWorldEvent` to trigger reversion. |
| `onTransform` | `function` or `nil` | `nil` | Callback invoked after successful transformation. |
| `onRevert` | `function` or `nil` | `nil` | Callback invoked after successful reversion. |
| `transformed` | `boolean` | `false` | Current transformation state: `true` if currently in transformed form. |
| `transformOffScreen` | `boolean` | `true` | If `true`, transforms occur only when the entity is asleep (e.g., off-screen); otherwise, transformation is immediate. |
| `queuedTransform` | `boolean` | `false` | `true` if a transform is pending (e.g., because entity is asleep). |
| `queuedRevert` | `boolean` | `false` | `true` if a revert is pending (e.g., because entity is asleep). |
| `onLoadCheck` | `function` or `nil` | `nil` | Callback for conditional transform/revert logic during `LoadPostPass`. |

## Main Functions

### `GetDebugString()`
* **Description:** Returns a debug string representation of the current transformation state (`"true"` or `"false"`).
* **Parameters:** None.

### `SetOnTransformFn(fn)`
* **Description:** Sets the callback function to be executed after the entity transforms.
* **Parameters:**  
  `fn` (`function`) — A function with no required arguments.

### `SetOnRevertFn(fn)`
* **Description:** Sets the callback function to be executed after the entity reverts.
* **Parameters:**  
  `fn` (`function`) — A function with no required arguments.

### `SetObjectData(data)`
* **Description:** Manually assigns the data used during reversion. Typically populated automatically via `GetObjectData()`.
* **Parameters:**  
  `data` (`table`) — An object containing `prefab`, `component_data`, and `prefab_data` fields.

### `GetObjectData()`
* **Description:** Captures the current entity’s state (prefab name, component states, and instance data) into `self.objectData` for use during reversion.
* **Parameters:** None.

### `RemoveSleepEvents()`
* **Description:** Removes all pending sleep-related event listeners (`entitysleep`) and clears the `queuedTransform`/`queuedRevert` flags.
* **Parameters:** None.

### `SetRevertEvent(event, target)`
* **Description:** Registers an event listener to trigger reversion when `event` is fired.
* **Parameters:**  
  `event` (`string`) — Name of the event to listen for.  
  `target` (`Entity` or `nil`) — Entity or world to listen on. Defaults to `TheWorld` if omitted.

### `SetTransformEvent(event, target)`
* **Description:** Registers an event listener to trigger transformation when `event` is fired.
* **Parameters:**  
  `event` (`string`) — Name of the event to listen for.  
  `target` (`Entity` or `nil`) — Entity or world to listen on. Defaults to `TheWorld` if omitted.

### `SetRevertWorldEvent(event, value)`
* **Description:** Registers a listener for a world state event; reversion occurs only if the event’s value matches `value`.
* **Parameters:**  
  `event` (`string`) — World state event name.  
  `value` (`any`) — Required event value to trigger revert.

### `SetTransformWorldEvent(event, value)`
* **Description:** Registers a listener for a world state event; transformation occurs only if the event’s value matches `value`.
* **Parameters:**  
  `event` (`string`) — World state event name.  
  `value` (`any`) — Required event value to trigger transform.

### `SetOnLoadCheck(check)`
* **Description:** Assigns a predicate function used in `LoadPostPass` to determine whether to transform or revert after loading.
* **Parameters:**  
  `check` (`function`) — A function that takes the entity as argument and returns `true` (should transform) or `false` (should revert).

### `Transform()`
* **Description:** Spawns a new entity of `self.transformPrefab`, copies position, passes transformation state to the new entity’s `Transformer` component, and removes the original entity.
* **Parameters:** None.

### `TransformOnSleep()`
* **Description:** Queues a transformation to occur later upon the entity’s next `entitysleep` event. Adds a one-time listener for `"entitysleep"`.
* **Parameters:** None.

### `StartTransform()`
* **Description:** Initiates transformation if conditions allow (`transformOffScreen` and sleep state), queues if deferred, or skips if already transformed.
* **Parameters:** None.

### `Revert()`
* **Description:** Spawns a new entity of the original prefab (from `objectData.prefab`), restores all saved component/instance data, and removes the transformed entity.
* **Parameters:** None.

### `RevertOnSleep()`
* **Description:** Queues a reversion to occur later upon the entity’s next `entitysleep` event. Adds a one-time listener for `"entitysleep"`.
* **Parameters:** None.

### `StartRevert()`
* **Description:** Initiates reversion if conditions allow (`transformOffScreen` and sleep state), queues if deferred, or skips if not transformed.
* **Parameters:** None.

### `OnSave()`
* **Description:** Serializes transformation state (flags, events, data, callbacks) for saving to disk. Returns GUIDs for event targets.
* **Parameters:** None.  
* **Returns:** `(data, refs)` where `data` is the serialized table and `refs` contains GUIDs for networked entity references.

### `OnLoad(data)`
* **Description:** Restores transformation state and re-queues pending transforms/reverts from save data.
* **Parameters:**  
  `data` (`table`) — Deserialized `Transformer` data from `OnSave()`.

### `LoadPostPass(ents, data)`
* **Description:** Post-load logic that:  
  - Applies `onLoadCheck` to decide transform/revert.  
  - Reattaches event listeners with resolved entity references (via `ents`).  
* **Parameters:**  
  `ents` (`table`) — Mapping of GUIDs to `{ entity = ... }`.  
  `data` (`table`) — Save data (used to resolve event targets).

## Events & Listeners
- Listens for:
  - `"entitysleep"` → triggers `StartTransform` or `StartRevert` (via local helper functions) when `queuedTransform`/`queuedRevert` is set.
  - Custom events passed to `SetTransformEvent(...)` or `SetRevertEvent(...)` → triggers `StartTransform` or `StartRevert`.
  - World state events (via `SetTransformWorldEvent(...)` / `SetRevertWorldEvent(...)`) → triggers `StartTransformWorld` or `StartRevertWorld`, which verify value match before acting.
- Pushes no events.