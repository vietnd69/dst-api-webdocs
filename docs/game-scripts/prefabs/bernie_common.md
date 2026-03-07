---
id: bernie_common
title: Bernie Common
description: Provides utility functions to determine when Bernie the Yeti becomes aggressive based on Willow's sanity and skill choices.
tags: [sanity, ai, combat, willow]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f06a0c4b
system_scope: ai
---

# Bernie Common

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`bernie_common.lua` is a shared utility module (not a component) that exports two predicate functions used to trigger Bernie the Yeti's aggressive behavior. It evaluates Willow’s sanity thresholds and skill activation status to determine if Bernie should enter "hot-headed" mode. It relies on the `sanity` and `skilltreeupdater` components of the leader (typically Willow) to make these decisions.

## Usage example
```lua
local bernie_common = require "prefabs/bernie_common"
local is_crazy = bernie_common.isleadercrazy(inst, player)
local is_hotheaded = bernie_common.hotheaded(inst, player)
```

## Dependencies & tags
**Components used:** `sanity`, `skilltreeupdater`  
**Tags:** Uses tag filtering via `TheSim:FindEntities` with `HOTHEAD_MUST_TAGS = { "_combat", "hostile" }`, `HOTHEAD_CANT_TAGS = { "INLIMBO", "player", "companion" }`, and `HOTHEAD_ONEOF_TAGS = { "brightmare", "lunar_aligned", "shadow_aligned", "shadow" }`.

## Properties
No public properties.

## Main functions
### `isleadercrazy(inst, leader)`
*   **Description:** Returns `true` if the leader’s sanity state qualifies as “crazy” for Bernie’s purposes. A leader is considered crazy if either they are currently insane, or their sanity falls below specific thresholds while the corresponding Willow skill (`willow_berniesanity_1` or `willow_berniesanity_2`) is activated.
*   **Parameters:**  
    `inst` – The entity invoking the check (unused, kept for API consistency).  
    `leader` – The entity whose sanity and skills are evaluated (typically Willow).
*   **Returns:** `true` or `false`.
*   **Error states:** Returns `nil` if `leader` is `nil` or lacks `sanity` or `skilltreeupdater` components.

### `hotheaded(inst, player)`
*   **Description:** Returns `true` if there are hostile combat-capable entities within 20 units of `inst`, *and* the Willow skill `willow_bernieai` is activated.
*   **Parameters:**  
    `inst` – The entity acting as the spatial origin for proximity check (e.g., Bernie).  
    `player` – The Willow character (used for skill check).
*   **Returns:** `true` or `false`.
*   **Error states:** Returns `false` if no qualifying targets are found or `willow_bernieai` is not activated. May return `nil` if `player.components.skilltreeupdater` is missing.

## Events & listeners
None identified.