---
id: gift_surprise
title: Gift Surprise
description: Triggers surprise effects when unwrapped or picked up, spawning entities and re-targeting combatants based on gift contents.
tags: [scenario, gift, surprise, combat, event]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: 50f6a484
system_scope: entity
---

# Gift Surprise

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`gift_surprise` is a scenario script that enables interactive surprise behaviors for in-world objects like gifts and trees. When an entity with this scenario triggers (via being unwrapped or picked up), it scans nearby entities within a fixed radius, then schedules delayed transformations or unwrapping actions on matching entities. It is designed to support scenario-based storytelling and event-based world interactions, particularly around holiday or gift-giving mechanics. The script does not implement a component itself but provides lifecycle hooks for scenario runners to attach logic to entities.

## Usage example
```lua
-- Attached to an entity in a scenario file
local inst = ...
local scenariorunner = TheModConfigManager:GetScenarioRunner()
inst:AddComponent("giftsurprise") -- Note: This script provides scenario hooks, not a component
-- Ensure the entity has required tags and components (e.g., `unwrappable`) for surprise behavior to function
```

## Dependencies & tags
**Components used:** `combat`, `unwrappable`  
**Tags:** Checks `winter_tree`, `unwrappable`; adds `houndfriend` during surprise transformation.  
**External references:** Uses `TheSim:FindEntities`, `FRAMES`, `SpawnPrefab`, `DoTaskInTime`.

## Properties
No public properties.

## Main functions
### `SurpriseExclamationMark(inst, doer)`
*   **Description:** Scans for nearby entities within `SURPRISE_RANGE` (`15` units) matching either `winter_tree` or `unwrappable` tags, then schedules their transformation or unwrapping with a random delay (0 to `BASE_TIME`).
*   **Parameters:**  
  `inst` (Entity) – The triggering entity (typically the gift or tree).  
  `doer` (Entity or `nil`) – The entity that triggered the action (e.g., player unwrapping).  
*   **Returns:** Nothing.  
*   **Error states:** Uses `math.random()` for delay; no explicit error handling. If `TransformIntoLeif()` or `Unwrap()` fails internally, the script does not propagate errors.

### `OnLoad(inst, scenariorunner)`
*   **Description:** Registers event listeners for `unwrapped` and optionally `onpickup` events to trigger `SurpriseExclamationMark`. Stores the trigger callback on `inst.giftsurprise_triggerfn`.
*   **Parameters:**  
  `inst` (Entity) – The entity the scenario is attached to.  
  `scenariorunner` (ScenarioRunner) – The scenario manager instance used to clear the scenario after triggering.  
*   **Returns:** Nothing.

### `OnDestroy(inst, scenariorunner)`
*   **Description:** Removes previously registered event listeners to prevent memory leaks or stale callbacks when the entity is destroyed.
*   **Parameters:**  
  `inst` (Entity) – The entity being destroyed.  
  `scenariorunner` (ScenarioRunner) – Not used in this function.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `unwrapped` – fires the surprise trigger when the entity is unwrapped.  
  - `onpickup` – fires the surprise trigger if the entity is *not* a `jiggle`-tagged gift (i.e., non-gift items trigger on pickup).  
- **Pushes:** None directly (but triggers callbacks that may push events like `unwrapped`, `unwrappeditem`, or transform-related events in child entities).