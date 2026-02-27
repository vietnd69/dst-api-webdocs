---
id: scenariorunner
title: Scenariorunner
description: Executes scenario-specific logic by loading and invoking lifecycle callbacks (OnCreate, OnLoad, OnDestroy) on demand during gameplay.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 6e41873c
---

# Scenariorunner

## Overview
The `Scenariorunner` component enables an entity to dynamically execute custom scenario logic—typically used in modding to inject world-initialization or runtime behavior defined in external script files. It manages the loading, execution, saving, and cleanup of such scenario scripts by invoking standardized callback functions (`OnCreate`, `OnLoad`, `OnDestroy`) at appropriate times.

## Dependencies & Tags
* **Component Dependency**: Relies on the entity having no mandatory components beyond `inst` (the owning entity instance) passed to its constructor.  
* **Tags**: None added or removed by this component.  
* **Note**: Does *not* automatically register events—it assumes external orchestration (e.g., via `WorldPostInit` or `ClientWorldPostInit`) triggers the `:Run()` call.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity this component is attached to. |
| `scriptname` | `string?` | `nil` | Name (filename) of the loaded scenario script (without path), e.g., `"example"` for `scenarios/example.lua`. |
| `script` | `table?` | `nil` | Module object returned by `require("scenarios/...")`, expected to expose optional callbacks. |
| `hasrunonce` | `boolean` | `false` | Flag indicating whether the `OnCreate` callback (if present) has been executed. |

## Main Functions

### `SetScript(name)`
* **Description**: Loads a scenario script by name, validates that it exports at least one required callback (`OnCreate` or `OnLoad`), and stores it internally. Emits a warning if a script is already assigned.
* **Parameters**:
  * `name` (`string`): The scenario filename (without extension or path).

### `Run()`
* **Description**: Executes the scenario lifecycle. If `OnCreate` exists and `hasrunonce` is `false`, it runs `OnCreate` and marks `hasrunonce = true`. Then, it *always* attempts to run `OnLoad`. If no `OnLoad` is defined, it calls `:ClearScenario()`.
* **Parameters**: None.

### `ClearScenario()`
* **Description**: Removes the `scenariorunner` component from the entity and invokes the scenario's `OnDestroy` callback (if defined).
* **Parameters**: None.

### `Reset()`
* **Description**: Tears down the current scenario by invoking `OnDestroy` (if present), then clears `script`, `scriptname`, and resets `hasrunonce` to `false`, allowing the component to be reused.
* **Parameters**: None.

### `OnLoad(data)`
* **Description**: Restores state from saved data—specifically `scriptname` (if present, calls `SetScript`) and `hasrunonce`.
* **Parameters**:
  * `data` (`table?`): Saved state, typically containing keys `scriptname` (string) and `hasrunonce` (boolean).

### `OnSave()`
* **Description**: Returns a serializable table containing the current state (`hasrunonce` and optionally `scriptname`).
* **Parameters**: None.
* **Returns** (`table`): `{ hasrunonce = bool, [scriptname] = string? }`

## Events & Listeners
None identified. This component does not register or emit events directly; it operates synchronously via explicit method calls.