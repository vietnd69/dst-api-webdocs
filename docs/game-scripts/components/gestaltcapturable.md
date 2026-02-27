---
id: gestaltcapturable
title: Gestaltcapturable
description: Provides logic for tracking and managing the capturable state of a Gestalt entity, including targeting, capture, and tag management.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: bb2c573f
---

# Gestaltcapturable

## Overview
This component manages whether a Gestalt entity can be targeted and captured, primarily by the Gestalt Cage. It tracks targeting entities (e.g., Gestalt Cages), exposes state via properties and callbacks, and maintains the `gestaltcapturable` tag on the entity.

## Dependencies & Tags
- Adds/removes the `gestaltcapturable` tag via `AddOrRemoveTag` and `RemoveTag`.
- Interacts with the `gestaltcage` component (via external calls to `OnTargeted`, `OnUntargeted`, and `OnCaptured`).
- Listens to `"onremove"` events on targeting objects to clean up targeting state.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (passed to constructor) | Reference to the parent entity instance. |
| `level` | `number` | `1` | The capture level of the Gestalt; used by capture logic. |
| `enabled` | `boolean` | `true` | Whether the entity is currently capturable. |
| `targeters` | `table` | `{}` | Map of entities (e.g., Gestalt Cages) currently targeting this Gestalt. |
| `ontargetedfn` | `function?` | `nil` | Optional callback invoked when targeting begins. |
| `onuntargetedfn` | `function?` | `nil` | Optional callback invoked when targeting ends. |
| `oncapturedfn` | `function?` | `nil` | Optional callback invoked upon successful capture. |
| `_onremovetargeter` | `function` | (internal) | Handler to remove a targeter when the targeting entity is removed. |

## Main Functions

### `SetEnabled(enabled)`
* **Description:** Sets whether the entity is currently capturable. This also updates the `gestaltcapturable` tag on the entity.
* **Parameters:**
  - `enabled` (boolean): Whether to enable or disable capturability.

### `IsEnabled()`
* **Description:** Returns whether capturability is currently enabled.
* **Parameters:** None.

### `SetLevel(level)`
* **Description:** Sets the capture level (e.g., for Gestalt tiering).
* **Parameters:**
  - `level` (number): The new capture level.

### `GetLevel()`
* **Description:** Returns the current capture level.
* **Parameters:** None.

### `SetOnTargetedFn(fn)`
* **Description:** Registers a callback to be invoked when targeting begins (i.e., first targeter adds itself).
* **Parameters:**
  - `fn` (function): A function accepting the target entity (`inst`) as its only argument.

### `SetOnUntargetedFn(fn)`
* **Description:** Registers a callback to be invoked when targeting ends (i.e., last targeter removes itself).
* **Parameters:**
  - `fn` (function): A function accepting the target entity (`inst`) as its only argument.

### `SetOnCapturedFn(fn)`
* **Description:** Registers a callback to be invoked upon capture (e.g., when a Gestalt Cage completes the capture process).
* **Parameters:**
  - `fn` (function): A function accepting three arguments: `inst` (target entity), `obj` (the capturer, e.g., cage), and `doer` (the player/component performing the capture).

### `IsTargeted()`
* **Description:** Returns whether the entity is currently being targeted (i.e., one or more targeters exist).
* **Parameters:** None.

### `OnTargeted(obj)`
* **Description:** Called by a targeter (e.g., Gestalt Cage) to indicate it is now targeting this entity. Initializes targeting logic and triggers events/callbacks if first targeter.
* **Parameters:**
  - `obj` (Entity): The targeting entity being registered.

### `OnUntargeted(obj)`
* **Description:** Called by a targeter to indicate it is no longer targeting this entity. Removes the targeter and triggers events/callbacks if no targeters remain.
* **Parameters:**
  - `obj` (Entity): The targeting entity being removed.

### `OnCaptured(obj, doer)`
* **Description:** Called upon successful capture to trigger callbacks and push a `"gestaltcaptured"` event on the doer (if present).
* **Parameters:**
  - `obj` (Entity): The capturing entity (e.g., Gestalt Cage).
  - `doer` (Entity | nil): The entity performing the capture (e.g., the player). May be `nil`.

## Events & Listeners
- **Listens for:**
  - `"onremove"` on each targeting entity (`obj`) — triggers cleanup via `OnUntargeted(obj)`.
  - When targeting begins (i.e., first targeter added): pushes `"gestaltcapturable_targeted"` on `self.inst`.
  - When targeting ends (i.e., last targeter removed): pushes `"gestaltcapturable_untargeted"` on `self.inst`.
  - Upon capture: pushes `"gestaltcaptured"` on the `doer` entity (if provided).