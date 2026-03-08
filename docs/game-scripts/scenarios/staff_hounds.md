---
id: staff_hounds
title: Staff Hounds
description: Manages a scenario-based trap that springs when an item is placed in an inventory, instantly hibernating nearby hounds and releasing them upon pickup.
tags: [combat, scenario, trap]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: 2e1a7cb4
system_scope: scenario
---

# Staff Hounds

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
This scenario helper script implements a trap mechanism for staff-based items that affects hound entities. It detects hounds within a radius, forces them into hibernation via the `sleeper` component and stategraph, and stores references to them. When the item is placed in an inventory, the trap is triggered: nearby players take sanity damage, precipitation is forced, and stored hounds are woken up after a brief delay. It depends heavily on the `sleeper`, `health`, `sanity`, and `inventoryitem` components.

## Usage example
This scenario is attached to an item prefab via the `scenarios` system; typical usage involves registering `OnLoad` and `OnDestroy` hooks during prefab initialization:
```lua
local prefabs = require "prefabs/staff_hounds"
prefabs.OnLoad(inst, scenariorunner)
inst:ListenForEvent("ondestroy", function() prefabs.OnDestroy(inst, scenariorunner) end)
```
Note: `scenariorunner` is provided by the scenario framework and manages scenario lifecycle.

## Dependencies & tags
**Components used:** `sleeper`, `health`, `sanity`, `inventoryitem`  
**Tags:** Checks for `hound`, `pet_hound`, `INLIMBO` (via `TRAP_MUST_TAGS` and `TRAP_CANT_TAGS`)

## Properties
No public properties. This module exports only functional hooks.

## Main functions
### `settrap_hounds(inst)`
*   **Description:** Scans for hound entities within a 20-unit radius, forces them into hibernation (`hibernate = true`) and transitions their stategraph to `"forcesleep"`, and returns a table of affected hounds.
*   **Parameters:** `inst` (Entity) — the entity hosting this scenario logic (typically the staff item).
*   **Returns:** `table` — list of hound entities that were put to sleep (may be empty).
*   **Error states:** Skips entities where `v == nil` or `v.sg == nil`.

### `IsValidHound(hound)`
*   **Description:** Validates that a hound entity is suitable for trap activation or wake-up.
*   **Parameters:** `hound` (Entity) — candidate hound.
*   **Returns:** `boolean` — `true` if hound is valid; `false` otherwise.
*   **Error states:** Returns `false` if hound is invalid, in limbo, dead (via `health:IsDead()`), or not visible.

### `WakeHound(inst, hound)`
*   **Description:** Wakes a valid hound by transitioning its stategraph to `"wake"`.
*   **Parameters:**  
    `inst` (Entity) — hosting instance (unused, but passed via task),  
    `hound` (Entity) — hound to wake.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if hound is invalid or lacks a `"wake"` state.

### `TriggerTrap(inst, scenariorunner, data, hounds)`
*   **Description:** Springs the trap — inflicts huge sanity loss on the placing player, forces rain, and schedules wake-up for stored hounds. Clears the scenario afterward.
*   **Parameters:**  
    `inst` (Entity) — host item,  
    `scenariorunner` (ScenarioRunner) — used to clear the scenario,  
    `data` (table) — contains `player` (Entity or `nil`),  
    `hounds` (table) — list of previously trapped hounds.
*   **Returns:** Nothing.
*   **Error states:** Gracefully handles missing `player`, missing `sanity` component, and missing hound components.

### `OnLoad(inst, scenariorunner)`
*   **Description:** Initializes the trap. Sets up `hounds` via `settrap_hounds`, and registers `scene_putininventoryfn` to respond to `"onputininventory"` events.
*   **Parameters:** `inst` (Entity), `scenariorunner` (ScenarioRunner).
*   **Returns:** Nothing.

### `OnDestroy(inst)`
*   **Description:** Cleans up event listeners and stored callback to prevent memory leaks.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onputininventory` — triggers `TriggerTrap` and clears the scenario.
- **Pushes:** No events. Relies on global event `"ms_forceprecipitation"` and hound stategraph transitions.