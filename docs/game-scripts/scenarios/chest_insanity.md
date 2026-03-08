---
id: chest_insanity
title: Chest Insanity
description: Handles the logic for spawning sanity-based trap rocks when an "insanity chest" is opened, using the chest trap framework.
tags: [trap, sanity, loot, chest]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: 32ed6b7f
system_scope: world
---

# Chest Insanity

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
This scenario script defines the behavior of an "insanity chest" — a special chest that, when opened, spawns a ring of `sanityrock` prefabs around the player. The rocks behave differently depending on whether the player is currently sane: they animate as "raised and active" if the player is sane, otherwise as "lowered and inactive". The script uses `chestfunctions` to integrate with the chest trap system and ensures trap logic runs on chest load.

## Usage example
The component is not added directly; it is used as a scenario callback by the game's scenario system. Typical integration looks like this:
```lua
-- In the scenario configuration (not shown here)
OnLoad = chest_insanity.OnLoad,
```
When a chest with this scenario is loaded and opened, the `triggertrap` function executes.

## Dependencies & tags
**Components used:** `finiteuses`, `sanity`
**Tags:** Checks `sanity` → `IsSane()`; no tags added or removed.

## Properties
No public properties.

## Main functions
### `triggertrap(inst, scenariorunner, data)`
*   **Description:** Executes the trap effect when the chest is opened. Spawns a ring of `sanityrock` prefabs around the chest at radius ~10 units. Each rock is hidden initially, then revealed sequentially with a delay. Rock animations depend on the player's sanity status.
*   **Parameters:**
    *   `inst` (Entity) — The chest entity.
    *   `scenariorunner` (ScenarioRunner) — Scenario runner instance.
    *   `data` (table) — Contains `player` (Entity), the player who opened the chest.
*   **Returns:** Nothing.
*   **Error states:** If `data.player` or `data.player.components.sanity` is `nil`, the sanity check is skipped and rocks default to inactive animation.

## Events & listeners
None.