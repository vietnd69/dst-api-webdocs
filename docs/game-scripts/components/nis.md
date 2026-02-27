---
id: nis
title: Nis
description: Manages narrative instruction sequences (NIS) by executing custom script logic, handling input to skip, and cleaning up resources on entity removal.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 04850956
---

# Nis

## Overview
The `Nis` component orchestrates narrative instruction sequences (NIS) — cinematic or dialogue-driven scripted events — by executing a user-defined script function in a coroutine. It handles input events (e.g., primary/secondary clicks) to allow skipping skippable sequences, initializes state via an optional init callback, and provides cleanup on cancellation or completion.

## Dependencies & Tags
- Relies on `TheInput` global for input event registration.
- Uses `KillThread` and `StartThread` for coroutine management (indicating integration with the game’s threading system).
- No standard component dependencies (e.g., no `inst:AddComponent(...)`) are declared.
- No entity tags are added or removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the entity this component is attached to (assigned in `_ctor`). |
| `playing` | `boolean` | `false` | Indicates whether the NIS is currently running. |
| `skippable` | `boolean` | `false` | Determines whether user input can cancel the NIS (not set by this component; must be set externally). |
| `data` | `table` | `{}` | Arbitrary data passed to `init`, `script`, and `cancel` callbacks. |
| `name` | `string` | `""` | Optional identifier for the NIS instance. |
| `inputhandlers` | `table` of `InputHandler` | `{}` | List of input handlers registered for skip-triggering controls. |
| `script` | `function` or `nil` | `nil` | The main script function to execute (signature: `fn(nis, data, lines)`). |
| `init` | `function` or `nil` | `nil` | Initialization callback executed once at the start (signature: `fn(data)`). |
| `cancel` | `function` or `nil` | `nil` | Cleanup callback executed on cancellation (signature: `fn(data)`). |
| `task` | `thread` or `nil` | `nil` | Handle to the running coroutine (set only during playback). |

## Main Functions
### `OnRemoveEntity()`
* **Description:** Cleans up all registered input handlers to prevent memory leaks when the entity (and thus the component) is removed from the world.  
* **Parameters:** None.

### `SetName(name)`
* **Description:** Sets the optional `name` property for identification/debugging purposes.  
* **Parameters:**  
  - `name` (`string`): A descriptive identifier for the NIS.

### `SetScript(fn)`
* **Description:** Assigns the main script function that defines the NIS behavior.  
* **Parameters:**  
  - `fn` (`function`): A function taking `(nis, data, lines)` as arguments, where `nis` is the NIS instance, `data` is the shared table, and `lines` is the input passed to `Play`.

### `SetInit(fn)`
* **Description:** Assigns the initialization callback, invoked once per `Play` call before the script runs.  
* **Parameters:**  
  - `fn` (`function`): A function taking `(data)` as an argument.

### `SetCancel(fn)`
* **Description:** Assigns the cancellation callback, invoked when `Cancel` is called.  
* **Parameters:**  
  - `fn` (`function`): A function taking `(data)` as an argument.

### `OnFinish()`
* **Description:** Finalizes the NIS by resetting the `playing` flag, clearing the `task`, and removing the parent entity.  
* **Parameters:** None.

### `Cancel()`
* **Description:** Aborts the current NIS: kills the running coroutine (if active), invokes the cancel callback (if defined), and calls `OnFinish`.  
* **Parameters:** None.

### `OnClick()`
* **Description:** Handles user input events. If `skippable` is `true`, triggers `Cancel()`.  
* **Parameters:** None.

### `Play(lines)`
* **Description:** Starts the NIS. Invokes `init` (if defined), then runs `script` in a coroutine. On completion (or if no script is defined), calls `OnFinish`.  
* **Parameters:**  
  - `lines` (`any`): Arbitrary data passed directly to the `script` function (typically narrative content or scene descriptors).

## Events & Listeners
- Listens for the following input events via `TheInput:AddControlHandler` (handlers stored in `inputhandlers`):
  - `CONTROL_PRIMARY`
  - `CONTROL_SECONDARY`
  - `CONTROL_ATTACK`
  - `CONTROL_INSPECT`
  - `CONTROL_ACTION`
  - `CONTROL_CONTROLLER_ACTION`  
- Calls `self:OnClick()` on any matching input press.
- Does **not** push or emit any events via `inst:PushEvent`.