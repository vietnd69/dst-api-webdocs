---
id: marblepillar
title: Marblepillar
description: A breakable environmental object that yields marble resources when mined, with visual feedback and loot drop mechanics.
tags: [environment, resource, mining, structure]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 25a9b1d4
system_scope: environment
---

# Marblepillar

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `marblepillar` prefab represents a tall stone pillar structure found in the game world. It is breakable via mining actions and drops marble resources upon completion. The component integrates with the `workable` system to define mining difficulty and behavior, and uses the `lootdropper` component to manage resource drops. Visual feedback is provided through animations that change based on remaining work progress, and sound/FX support is included for player interaction.

## Usage example
The prefab is instantiated automatically by the game when placed in the world (e.g., via worldgen or item spawn). Modders may reference its prefabs and loot table as follows:
```lua
-- Use the shared loot table for custom implementations
local loot = GetLootTable('marble_pillar')

-- Spawn the break effect and marble manually on custom logic
local fx = SpawnPrefab("rock_break_fx")
fx.Transform:SetPosition(inst:GetPosition())
local marble = SpawnPrefab("marble")
marble.Transform:SetPosition(inst:GetPosition())
```

## Dependencies & tags
**Components used:** `lootdropper`, `inspectable`, `workable`, `hauntable`, `snowcovered`  
**Tags:** None added or checked by this prefab's component logic.

## Properties
No public properties are defined or exposed by this prefab.

## Main functions
### `onworked(inst, worker, workleft)`
*   **Description:** Callback invoked when the pillar is mined. Triggers visual animation updates during mining and spawns loot/drops upon completion.
*   **Parameters:**
    *   `inst` (Entity) - The marblepillar entity instance.
    *   `worker` (Entity) - The entity performing the mining action.
    *   `workleft` (number) - Remaining work required to fully break the pillar.
*   **Returns:** Nothing.
*   **Error states:** If `workleft <= 0`, the entity is removed from the world. No error conditions are explicitly handled.

## Events & listeners
None.