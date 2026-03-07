---
id: carnivaldecor
title: Carnivaldecor
description: Tracks and reports the decorative value of an entity for carnival ranking systems by integrating with nearby CarnivalDecorRanker components.
tags: [carnival, decoration, world]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: entity
source_hash: 3f9d7ba1
system_scope: world
---

# Carnivaldecor

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`CarnivalDecor` is an entity component that enables an object to contribute to carnival decoration rankings. When attached to an entity, it registers the object with nearby `carnivaldecorranker` components (within `TUNING.CARNIVAL_DECOR_RANK_RANGE` units) by notifying them of its presence and value. It automatically manages registration during placement and removal, and maintains a `carnivaldecor` tag on its host entity. This component works in tandem with `CarnivalDecorRanker` to dynamically track overall decoration scores in the world.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("carnivaldecor")
-- Value is 1 by default; can be customized by overriding in subclass or via prototype
print(inst.components.carnivaldecor:GetDecorValue()) -- returns 1
```

## Dependencies & tags
**Components used:** `carnivaldecorranker` (accessed via `inst.components.carnivaldecorranker` on ranker entities)
**Tags:** Adds `carnivaldecor` on initialization; removes it on entity/component removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `value` | number | `1` | Decorative score贡献 of this entity, returned by `GetDecorValue()`. |

## Main functions
### `GetDecorValue()`
* **Description:** Returns the decorative value of this entity, used by `CarnivalDecorRanker` components to compute cumulative scores.
* **Parameters:** None.
* **Returns:** `number` — the current decorative value (typically `1`, unless overridden in a subclass).
* **Error states:** None — always returns a numeric value.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.
