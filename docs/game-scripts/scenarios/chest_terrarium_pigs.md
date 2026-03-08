---
id: chest_terrarium_pigs
title: Chest Terrarium Pigs
description: Triggers a trap when a specific chest is opened, transforming nearby pigs into werepigs and setting them to attack the triggering player.
tags: [trap, ai, transformation, event]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: 41a0e434
system_scope: event
---

# Chest Terrarium Pigs

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`chest_terrarium_pigs` is a scenario-specific trap handler used in the Terrarium event chest mechanics. When attached to a chest via `OnLoad`, it registers a trap function that—upon chest opening—identifies nearby pigs within a 16-unit radius and transforms them into werepigs. Transformed pigs are set to target the player who opened the chest, if valid. This behavior leverages the `werebeast` and `combat` components to enforce state changes and aggression.

The script depends on `chestfunctions` for trap initialization and cleanup, and on `chest_terrarium` for shared `OnCreate` behavior.

## Usage example
```lua
-- Typically used internally by chest prefabs in the Terrarium event.
-- The component is attached automatically via scenario configuration:
--   inst:AddComponent("chest_terrarium_pigs")
-- followed by calling OnLoad during chest setup:
chest_terrarium_pigs.OnLoad(inst, scenariorunner)
```

## Dependencies & tags
**Components used:** `werebeast`, `health`, `combat`
**Tags:** Checks `pig` and `werepig` tags via `FindEntities`; no tags are added/removed directly by this script.

## Properties
No public properties.

## Main functions
### `transform(ent, player)`
*   **Description:** Transforms a pig entity into a werepig and sets its combat target to the player.
*   **Parameters:** 
    *   `ent` (Entity) — The pig entity to transform.
    *   `player` (Entity or `nil`) — The player to target; may be `nil`.
*   **Returns:** Nothing.
*   **Error states:** Transformation and targeting occur only if `ent` has a `werebeast` component, is not already in were-pig state, has a `health` component, and is not dead.

### `triggertrap(inst, scenariorunner, data)`
*   **Description:** Scans for nearby pigs (excluding those already werepigs) within 16 units and schedules their transformation with a staggered delay.
*   **Parameters:** 
    *   `inst` (Entity) — The chest entity where the trap is triggered.
    *   `scenariorunner` (ScenarioRunner) — Scenario runner instance.
    *   `data` (table or `nil`) — Optional trigger data containing `data.player` (the triggering player).
*   **Returns:** Nothing.
*   **Error states:** Uses staggered timers (`0.25 * (i-1) + 0.25 * math.random()`) to prevent simultaneous transformation; does not act on pigs without `werebeast` or already in were-pig state.

### `OnLoad(inst, scenariorunner)`
*   **Description:** Initializes the chest as a trap by registering the `triggertrap` callback with `chestfunctions`.
*   **Parameters:** 
    *   `inst` (Entity) — The chest entity.
    *   `scenariorunner` (ScenarioRunner) — Scenario runner instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.
