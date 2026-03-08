---
id: sleepingspider_spiderambush
title: Sleepingspider Spiderambush
description: Triggers a spider queen ambush when the scenario entity is attacked, spawning spider warriors around it and ending the scenario.
tags: [combat, boss, scenario, ambush, ai]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: 2bc4b10c
system_scope: world
---

# Sleepingspider Spiderambush

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
This scenario script handles the ambush behavior of the "Sleeping Spider" encounter. It activates when the scenario entity is attacked, spawning three spider warriors in a circular formation around the point of attack and waking the entity (by disabling hibernation). It integrates with the `sleeper` component to manage the entity's hibernation state and registers event listeners to detect attacks. Upon activation, it clears the scenario to prevent re-triggering.

## Usage example
This scenario script is not added directly via `AddComponent`. Instead, it is referenced by name in scenario definitions (e.g., in world generation tasksets or `scenarios.lua`) and invoked automatically during gameplay via the scenario runner system.

## Dependencies & tags
**Components used:** `sleeper`
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `OnLoad(inst, scenariorunner)`
*   **Description:** Initializes the scenario state when the game loads (including on resume from save). Sets the entity's stategraph to `"sleep"`, enables hibernation via `sleeper.hibernate = true`, and registers an `"attacked"` event callback to trigger the ambush.
*   **Parameters:**  
    `inst` (GEntity) – The scenario entity instance.  
    `scenariorunner` (ScenarioRunner) – The scenario runner managing this entity's scenario lifecycle.
*   **Returns:** Nothing.
*   **Error states:** None.

### `OnWakeUp(inst, scenariorunner, data)`
*   **Description:** Spawns three spider warriors in a circular arrangement around the entity's position, creates a `"poopcloud"` FX at each spawn point, assigns the player attacker as the spider warrior's follow target, disables hibernation, and clears the scenario to prevent reactivation.
*   **Parameters:**  
    `inst` (GEntity) – The scenario entity instance.  
    `scenariorunner` (ScenarioRunner) – The scenario runner.  
    `data` (table) – Event data, expected to contain `attacker` (a player entity).
*   **Returns:** Nothing.
*   **Error states:** Spawns are skipped if `TileGroupManager:IsImpassableTile(...)` returns `true` for a candidate point.

### `OnDestroy(inst)`
*   **Description:** Cleans up by removing the `"attacked"` event listener registered during `OnLoad`.
*   **Parameters:** `inst` (GEntity) – The scenario entity instance.
*   **Returns:** Nothing.

### `OnCreate(inst, scenariorunner)`
*   **Description:** Placeholder stub; no logic implemented.
*   **Parameters:**  
    `inst` (GEntity) – The scenario entity instance.  
    `scenariorunner` (ScenarioRunner) – The scenario runner.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `attacked` – triggers `OnWakeUp`.
- **Pushes:** None.