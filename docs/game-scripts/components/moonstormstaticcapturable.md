---
id: moonstormstaticcapturable
title: Moonstormstaticcapturable
description: This component enables an entity to be tracked as a static target for moonstorm capture mechanisms, supporting targeted and caught state notifications via callbacks and events.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 1f5d4e0d
---

# Moonstormstaticcapturable

## Overview
This component provides the core logic for marking an entity as a static capturable target within the Moonstorm system. It tracks which objects are currently "targeting" it (via `moonstormstaticcatcher` components), manages transitions between targeted and untargeted states, and notifies registered callbacks or events when capture-related milestones occur (targeting, untargeting, or successful capture).

## Dependencies & Tags
- Adds/Removes the `"moonstormstaticcapturable"` tag on entity enablement and removal (via `AddOrRemoveTag`/`RemoveTag`)
- Assumes coexistence with `moonstormstaticcatcher` components that call its `OnTargeted`, `OnUntargeted`, and `OnCaught` methods

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `enabled` | `boolean` | `true` | Controls whether the entity currently registers as a capturable target (affects tag presence) |
| `targeters` | `table` | `{}` | Map of targeting objects (keys are entity instances), used to track active targets |
| `ontargetedfn` | `function?` | `nil` | Optional callback invoked when the first targeter is added |
| `onuntargetedfn` | `function?` | `nil` | Optional callback invoked when the last targeter is removed |
| `oncaughtfn` | `function?` | `nil` | Optional callback invoked on successful capture (`(inst, targeter, doer)`) |

## Main Functions
### `SetEnabled(enabled)`
* **Description:** Enables or disables the capturable behavior by adding or removing the `"moonstormstaticcapturable"` tag from the entity.
* **Parameters:**  
  `enabled` (boolean): Whether the capturable state should be active.

### `IsEnabled()`
* **Description:** Returns the current enabled state.
* **Parameters:** None

### `SetOnTargetedFn(fn)`
* **Description:** Registers a callback to execute when the entity transitions to a targeted state (i.e., when the first targeter is added).
* **Parameters:**  
  `fn` (function): A callback accepting the entity instance as its sole argument.

### `SetOnUntargetedFn(fn)`
* **Description:** Registers a callback to execute when the entity transitions to an untargeted state (i.e., when the last targeter is removed).
* **Parameters:**  
  `fn` (function): A callback accepting the entity instance as its sole argument.

### `SetOnCaughtFn(fn)`
* **Description:** Registers a callback to execute when the entity is successfully captured.
* **Parameters:**  
  `fn` (function): A callback accepting `(inst, targeter_obj, doer_obj)` arguments.

### `IsTargeted()`
* **Description:** Returns `true` if at least one object is currently targeting this entity.
* **Parameters:** None

### `OnTargeted(obj)`
* **Description:** Records a new targeter (`obj`), triggers the `"moonstormstaticcapturable_targeted"` event and `ontargetedfn` if this was the first targeter.
* **Parameters:**  
  `obj` (Entity): The object (typically a `moonstormstaticcatcher`) initiating targeting.

### `OnUntargeted(obj)`
* **Description:** Removes a targeter (`obj`), triggers the `"moonstormstaticcapturable_untargeted"` event and `onuntargetedfn` if this was the last targeter.
* **Parameters:**  
  `obj` (Entity): The object ceasing to target this entity.

### `OnCaught(obj, doer)`
* **Description:** Handles successful capture: invokes `oncaughtfn` and pushes a `"moonstormstatic_caught"` event on the `doer`.
* **Parameters:**  
  `obj` (Entity): The targeter that performed the capture.  
  `doer` (Entity?): The entity responsible for executing the capture (e.g., a player or AI).

## Events & Listeners
- **Listens for `"onremove"` on targeters:** Cleans up internal tracking when a targeter entity is removed from the world.
- **Pushes events:**
  - `"moonstormstaticcapturable_targeted"`: Emitted when the first targeter is added (only once per targeting session).
  - `"moonstormstaticcapturable_untargeted"`: Emitted when the last targeter is removed (only once per untargeting session).
  - `"moonstormstatic_caught"`: Pushed on the `doer` when capture completes.