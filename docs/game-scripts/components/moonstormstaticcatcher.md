---
id: moonstormstaticcatcher
title: Moonstormstaticcatcher
description: This component allows an entity to capture and hold onto Moonstorm Static entities by interacting with their capturable state.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: d5e982e0
---

# Moonstormstaticcatcher

## Overview
This component provides the logic for an entity (typically a player or mob) to target, catch, and hold Moonstorm Static entities. It handles range and validity checks before initiating capture, and supports callback execution upon successful capture.

## Dependencies & Tags
- Depends on the target entity having a `moonstormstaticcapturable` component.
- The catcher entity must support the `IsValid()` check and `GetPhysicsRadius()` methods (standard for most entities).
- No explicit tags are added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (assigned via constructor) | Reference to the entity that owns this component. |
| `target` | `Entity?` | `nil` | The currently targeted Moonstorm Static entity, if any. |
| `oncaughtfn` | `function?` | `nil` | Optional callback function invoked when a successful catch occurs; signature: `fn(inst, doer)`. |

## Main Functions

### `SetOnCaughtFn(fn)`
* **Description:** Sets a callback function to be executed upon successful capture of a Moonstorm Static entity.
* **Parameters:**
  * `fn (function)` — A function to be called with arguments `(catcher_entity, doer_entity)` when a catch completes successfully.

### `Catch(target, doer)`
* **Description:** Attempts to catch the given Moonstorm Static entity. Performs validity, proximity, and capturability checks. On success, invokes the capturable component's `OnCaught` method and the optional callback.
* **Parameters:**
  * `target (Entity)` — The target Moonstorm Static entity to catch.
  * `doer (Entity)` — The entity performing the catch action (e.g., the player).
* **Returns:**
  * `true` on success.
  * `false, "MISSED"` on failure due to invalid target, insufficient proximity, or the target being unavailable for capture.

### `OnTarget(target)`
* **Description:** Begins targeting a Moonstorm Static entity. If a different target is already active, it untargets that first. Records the new target and notifies its `moonstormstaticcapturable` component.
* **Parameters:**
  * `target (Entity)` — The Moonstorm Static entity to begin targeting.

### `OnUntarget(target)`
* **Description:** Ends targeting of a Moonstorm Static entity. If a specific target is passed and matches the current target, or if no target is passed, it untargets the stored target and notifies its capturable component.
* **Parameters:**
  * `target (Entity?, optional)` — Optionally specify which target to untarget; if omitted or `nil`, untargets the stored target.

## Events & Listeners
- Listens for entity removal via `OnRemoveFromEntity()` → calls `OnUntarget()`.
- No `inst:ListenForEvent` or `inst:PushEvent` calls are present in the component code.