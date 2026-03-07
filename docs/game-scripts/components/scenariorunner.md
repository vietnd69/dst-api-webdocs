---
id: scenariorunner
title: Scenariorunner
description: Manages loading, executing, and cleaning up scenario scripts associated with an entity.
tags: [scenario, lifecycle, script]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 6e41873c
system_scope: world
---

# Scenariorunner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Scenariorunner` is a component that enables an entity to execute scenario-specific logic defined in external Lua modules. It handles script initialization (via `OnCreate` and `OnLoad` hooks), tracks whether the scenario has been run once, and supports cleanup via `OnDestroy`. It is typically attached to entities involved in dynamic world events or scripted sequences (e.g., bosses, arena triggers, event structures), and integrates with DST’s save/load system.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("scenariorunner")

-- Associate and run a scenario script
inst.components.scenariorunner:SetScript("lava_arena")
inst.components.scenariorunner:Run()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scriptname` | string or `nil` | `nil` | Name of the currently assigned scenario script (without path or `.lua`). |
| `script` | table or `nil` | `nil` | The loaded scenario script module (expects `OnCreate`, `OnLoad`, and optionally `OnDestroy`). |
| `hasrunonce` | boolean | `false` | Whether the `OnCreate` hook has already executed for this scenario. |

## Main functions
### `OnLoad(data)`
* **Description:** Restores component state from saved data during world load. Typically called automatically by DST’s save system.
* **Parameters:**  
  `data` (table or `nil`) — Save data containing `scriptname` and `hasrunonce`.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Collects component state to persist to disk during world save. Typically called automatically by DST’s save system.
* **Parameters:** None.
* **Returns:**  
  `data` (table) — A table containing `scriptname` (if present) and `hasrunonce`.

### `SetScript(name)`
* **Description:** Assigns and loads a scenario script from `scenarios/` by name. Prints a warning if a script is already assigned.
* **Parameters:**  
  `name` (string) — The filename (without extension) of the scenario script (e.g., `"lava_arena"`).
* **Returns:** Nothing.
* **Error states:** Asserts if the loaded script does not export either `OnCreate` or `OnLoad`.

### `Run()`
* **Description:** Executes the scenario logic. Runs `OnCreate` once (only if `hasrunonce` is `false`), then always runs `OnLoad` if present. If no `OnLoad` exists, clears the scenario.
* **Parameters:** None.
* **Returns:** Nothing.

### `ClearScenario()`
* **Description:** Immediately terminates and removes the scenario: calls `OnDestroy` (if defined) and removes the component from `self.inst`.
* **Parameters:** None.
* **Returns:** Nothing.

### `Reset()`
* **Description:** Clears the scenario without removing the component. Calls `OnDestroy` (if defined), then resets all state (`script`, `scriptname`, `hasrunonce`).
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified
