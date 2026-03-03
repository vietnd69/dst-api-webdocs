---
id: constructionplans
title: Constructionplans
description: Manages blueprint mappings for construction sites, enabling conversion of target prefabs into their corresponding construction site prefabs.
tags: [crafting, world, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 2c9b6308
system_scope: crafting
---

# Constructionplans

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`ConstructionPlans` maintains a mapping between target prefabs and their associated construction site prefabs. When a construction action is initiated, this component looks up the target prefab and spawns the corresponding construction site, replacing the original entity. It is typically attached to player entities or handheld items (e.g., blueprints) and works in conjunction with the `constructionsite` component.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("constructionplans")
inst.components.constructionplans:AddTargetPrefab("campfire", "campfire_fire")
inst.components.constructionplans:AddTargetPrefab("foundation", "foundation_plans")
-- Later, when targeting an existing campfire:
inst.components.constructionplans:StartConstruction(target_entity)
```

## Dependencies & tags
**Components used:** `constructionsite` (via `target.components.constructionsite` check)
**Tags:** Dynamically adds/removes `<prefab>_plans` tags (e.g., `campfire_plans`) to track known blueprint mappings.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `targetprefabs` | table | `{}` | Maps source prefab names (string) to their corresponding construction site prefab names (string). |

## Main functions
### `AddTargetPrefab(prefab, constructionprefab)`
* **Description:** Registers a mapping from a target prefab (e.g., `"campfire"`) to its construction site prefab (e.g., `"campfire_fire"`). Adds a tag `<prefab>_plans` if not already present.
* **Parameters:**  
  `prefab` (string) – name of the existing entity prefab that can be replaced.  
  `constructionprefab` (string) – name of the construction site prefab to spawn in its place.
* **Returns:** Nothing.
* **Error states:** None. Duplicate registrations for the same `prefab` are silently overwritten.

### `RemoveTargetPrefab(prefab)`
* **Description:** Removes the mapping for a given prefab and removes its associated `<prefab>_plans` tag.
* **Parameters:**  
  `prefab` (string) – name of the prefab whose mapping should be removed.
* **Returns:** Nothing.
* **Error states:** No effect if the prefab has no mapping.

### `StartConstruction(target)`
* **Description:** Attempts to spawn a construction site in place of the given `target` entity, based on the registered mapping for `target.prefab`. Removes the original entity and notifies the new site of construction start.
* **Parameters:**  
  `target` (entity) – the existing entity to be replaced by a construction site.
* **Returns:**  
  `product` (entity or `nil`) – the newly spawned construction site, or `nil` if construction fails.  
* **Error states:**  
  - Returns `nil, "MISMATCH"` if no mapping exists for `target.prefab`.  
  - Returns `nil` if the target already has a `constructionsite` component (prevents double-construction).  
  - Returns `nil` silently if `SpawnPrefab` fails.

### `OnRemoveFromEntity()`
* **Description:** Cleanup callback invoked when the component is removed from its entity. Removes all `<prefab>_plans` tags added by `AddTargetPrefab`.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None.
- **Pushes:** The component itself does not push events; however, `StartConstruction` calls `product:PushEvent("onstartconstruction")` on the spawned construction site entity.
