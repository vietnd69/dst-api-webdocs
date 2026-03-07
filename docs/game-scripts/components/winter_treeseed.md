---
id: winter_treeseed
title: Winter Treeseed
description: Stores and manages theprefab name reference for a winter tree associated with a winter tree seed entity.
tags: [seed, tree, environment, map]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: b7b365c0
system_scope: world
---

# Winter Treeseed

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Winter_TreeSeed` is a minimal component that holds a reference to a winter tree prefab name. It is attached to seed entities and allows runtime configuration of which `winter_tree` prefab will be planted or associated. This component serves as a lightweight configuration store with no internal logic, event handling, or side effects.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("winter_treeseed")
inst.components.winter_treeseed:SetTree("special_winter_tree")
-- Later, other systems may read inst.components.winter_treeseed.winter_tree
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *(assigned by ECS)* | The entity instance this component is attached to. |
| `winter_tree` | string | `"winter_tree"` | The prefab name of the winter tree this seed references. |

## Main functions
### `SetTree(tree)`
*   **Description:** Updates the stored prefab name for the associated winter tree.
*   **Parameters:** `tree` (string) — the prefab name to assign as the target winter tree (e.g., `"winter_tree"`, `"cave_winter_tree"`).
*   **Returns:** Nothing.

## Events & listeners
None identified
