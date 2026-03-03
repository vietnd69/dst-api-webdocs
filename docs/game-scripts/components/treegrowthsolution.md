---
id: treegrowthsolution
title: Treegrowthsolution
description: Applies growth progression to a target tree entity, consuming the solution item after use.
tags: [growth, utility, environment, item]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: c6e49270
system_scope: environment
---

# Treegrowthsolution

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`TreeGrowthSolution` is a utility component that accelerates the growth of eligible tree entities. When applied to a target tree, it bypasses normal growth stages and forces the next growth step, then consumes the item (either decrementing stack size or removing the entity if unstackable). It is typically attached to consumable items like Tree Growth Solution.

## Usage example
```lua
local solution_item = CreateEntity()
solution_item:AddTag("instrument")
solution_item:AddComponent("stackable")
solution_item:AddComponent("treegrowthsolution")
solution_item.components.treegrowthsolution.fx_prefab = "treegrowthsolutionfx"

-- Later, apply it to a tree:
local tree = GetSomeTree()
solution_item.components.treegrowthsolution:GrowTarget(tree)
```

## Dependencies & tags
**Components used:** `growable`, `stackable`  
**Tags:** None added or checked by this component itself (but checks tags on target entities).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fx_prefab` | string or nil | `nil` | Optional FX prefab to spawn at the target's position during growth. |

## Main functions
### `GrowTarget(target)`
*   **Description:** Attempts to grow the provided target entity. Skips growth if the target has disqualifying tags (`no_force_grow`, `stump`, `fire`, or `burnt`). If growth succeeds, spawns optional FX, triggers growth via `growable:DoGrowth()` or a custom override function, and consumes the solution item (either reducing stack size or destroying the item entirely).
*   **Parameters:** `target` (Entity instance) — the tree or entity intended for growth.
*   **Returns:** `boolean` — `true` if growth was applied successfully, `false` otherwise.
*   **Error states:** Returns `false` early if the target has any prohibited tag or lacks a growth mechanism. Does not validate that the target is a tree beyond tag checks.

## Events & listeners
- **Listens to:** None.  
- **Pushes:** `stacksizechange` — indirectly via `stackable:SetStackSize()`.
