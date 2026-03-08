---
id: chest_terrarium_fire
title: Chest Terrarium Fire
description: Triggers ignition of nearby evil flowers when the terrarium chest is opened.
tags: [trap, fire, loot, environment]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: 7a7c84f4
system_scope: environment
---

# Chest Terrarium Fire

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
This scenario script defines behavior for a variant of the terrarium chest that acts as a trap: when opened, it ignites nearby `flower_evil` entities within a 6-unit radius. It leverages `chestfunctions.InitializeChestTrap` to integrate into the chest trap system and reuses components from `chest_terrarium` and `chestfunctions` for setup and cleanup. The ignition is performed via the `burnable` component's `Ignite` method.

## Usage example
This script is automatically invoked by the game when the terrarium chest with fire trap logic is loaded; it does not require manual instantiation.

## Dependencies & tags
**Components used:** `burnable` (via `ent.components.burnable:Ignite(true)`), `transform`, `health` (implicitly checked via `burnable`), `fueled` (implicitly used by `Ignite`), `propagator` (implicitly used by `Ignite`)
**Tags:** Checks for `flower` and `fireimmune`; uses `INLIMBO` entity filter tag.

## Properties
No public properties.

## Main functions
### `triggertrap(inst, scenariorunner, data)`
*   **Description:** Finds all `flower_evil` entities within 6 units of the chest and ignites them if they have a `burnable` component. Called when the chest is opened.
*   **Parameters:**  
    `inst` (entity) — the chest entity.  
    `scenariorunner` (entity) — the scenario runner entity (unused in this implementation).  
    `data` (table) — event payload data (unused in this implementation).
*   **Returns:** Nothing.
*   **Error states:** No-op if no matching entities are found; ignores entities missing `burnable` or `fireimmune`.

### `OnLoad(inst, scenariorunner)`
*   **Description:** Initializes the chest as a trap using `chestfunctions.InitializeChestTrap`, passing `triggertrap` as the activation callback and a 1.0-second delay before the trap triggers on chest opening.
*   **Parameters:**  
    `inst` (entity) — the chest entity being loaded.  
    `scenariorunner` (entity) — the scenario runner entity.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls).
- **Pushes:** None (no `inst:PushEvent` calls).