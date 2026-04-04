---
id: bernie_common
title: Bernie Common
description: Provides utility functions for evaluating Willow's sanity state and enemy proximity for Bernie AI behavior.
tags: [utility, ai, willow, sanity]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: root
source_hash: f06a0c4b
system_scope: entity
---

# Bernie Common

> Based on game build **714014** | Last updated: 2026-03-20

## Overview
`bernie_common` is a utility module that encapsulates shared logic for Bernie-related entities. It primarily provides helper functions to determine if a leader entity (typically Willow) meets specific sanity thresholds or skill tree conditions, and to detect nearby hostile entities based on alignment tags. This module is typically required by Bernie prefab scripts or stategraphs to influence AI decision-making.

## Usage example
```lua
local bernie_common = require("prefabs/bernie_common")

-- Check if the leader meets sanity conditions for Bernie activation
local is_crazy = bernie_common.isleadercrazy(inst, leader)

-- Check if there are hostile entities nearby based on Willow's skills
local is_hotheaded = bernie_common.hotheaded(inst, player)
```

## Dependencies & tags
**Components used:** `sanity`, `skilltreeupdater`, `transform`
**Tags:** Filters entities using `_combat`, `hostile`, `INLIMBO`, `player`, `companion`, `brightmare`, `lunar_aligned`, `shadow_aligned`, `shadow`.

## Properties
No public properties

## Main functions
### `isleadercrazy(inst, leader)`
*   **Description:** Evaluates whether the specified `leader` entity is considered "crazy" based on sanity percentage or unlocked Willow skill tree nodes. This determines if Bernie should enter an aggro state.
*   **Parameters:**
    *   `inst` (Entity) - The entity instance calling the function (unused in logic).
    *   `leader` (Entity) - The leader entity (typically Willow) to check sanity skills against.
*   **Returns:** `true` if sanity conditions are met, otherwise `nil`.
*   **Error states:** Returns `nil` if `leader` does not have the `sanity` or `skilltreeupdater` components.

### `hotheaded(inst, player)`
*   **Description:** Scans the environment around `inst` for hostile entities that match specific alignment tags. This is used to determine if Bernie should engage combat based on Willow's "Hotheaded" skill.
*   **Parameters:**
    *   `inst` (Entity) - The entity instance used to get the world position for the search.
    *   `player` (Entity) - The player entity checked for the `willow_bernieai` skill activation.
*   **Returns:** `true` if valid targets are found within range, otherwise `nil`.
*   **Error states:** Returns `nil` if the player has not activated the required skill or no entities match the tag filters.

## Events & listeners
None identified.