---
id: deployhelper
title: Deployhelper
description: Manages activation and deactivation of deployable helper entities based on recipe or key triggers within a specified range.
tags: [deployment, trigger, entity, helper]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 9741f135
system_scope: world
---

# Deployhelper

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Deployhelper` is a singleton-style component that tracks deployable helper entities and triggers them when certain deployment conditions are met (e.g., placing a specific recipe or using a deploy key). It is not added directly to entities via `AddComponent`; instead, helper prefabs manually register themselves into a global registry (`DEPLOY_HELPERS`) and expose behavior hooks. It interacts with the `wallupdating` system via `StartWallUpdatingComponent`/`StopWallUpdatingComponent` to manage delayed activation logic.

## Usage example
```lua
local helper_inst = CreateEntity()
helper_inst:AddComponent("deployhelper")
helper_inst.components.deployhelper:AddRecipeFilter("campfire")
helper_inst.components.deployhelper.onenablehelper = function(inst, enabled, recipe, placer)
    if enabled then
        -- Light the helper (e.g., start emitting light)
        inst.components.light:Enable(true)
    else
        inst.components.light:Enable(false)
    end
end
-- The helper will activate when a campfire is placed within range
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `recipefilters` | table or `nil` | `nil` | Optional map of recipe names (`{ [recipename] = true }`) that trigger this helper. |
| `keyfilters` | table or `nil` | `nil` | Optional map of deploy keys (`{ [key] = true }`) that trigger this helper. |
| `delay` | number or `nil` | `nil` | Internal counter used to delay activation/deactivation (2 ticks = ~1 second). |
| `onenablehelper` | function or `nil` | `nil` | Callback invoked when helper is enabled/disabled: `(inst, enabled, recipe, placerinst)`. |
| `onstarthelper` | function or `nil` | `nil` | Callback invoked immediately when helper starts (e.g., for instant effects): `(inst, recipe, placerinst)`. |
| `canenablehelper` | function or `nil` | `nil` | Optional predicate function: `(inst) -> boolean`. Controls whether the helper can be enabled. |

## Main functions
### `DeployHelper:AddRecipeFilter(recipename)`
* **Description:** Registers a recipe name that will activate this helper when that recipe is deployed.
* **Parameters:** `recipename` (string) – the name of the recipe to match.
* **Returns:** Nothing.
* **Error states:** No error handling; silently overwrites/extends the `recipefilters` table.

### `DeployHelper:AddKeyFilter(key)`
* **Description:** Registers a deploy key that will activate this helper when used.
* **Parameters:** `key` (string) – the deploy key identifier (typically `placerinst.deployhelper_key`).
* **Returns:** Nothing.
* **Error states:** No error handling; silently overwrites/extends the `keyfilters` table.

### `DeployHelper:StartHelper(recipename, placerinst)`
* **Description:** Initiates helper activation. Applies a 2-tick delay, starts wall updates, and invokes `onenablehelper`/`onstarthelper` callbacks.
* **Parameters:**
  * `recipename` (string or `nil`) – name of the recipe being deployed, if applicable.
  * `placerinst` (ThePlayer or Entity) – the entity performing the deployment.
* **Returns:** Nothing.
* **Error states:** Only proceeds if `not inst:IsAsleep()`. Sleep state is checked once to decide whether to proceed.

### `DeployHelper:StopHelper()`
* **Description:** Cancels helper activation, clears delay, stops wall updates, and invokes `onenablehelper` with `enabled=false`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Only has effect if `delay` is non-`nil`. Otherwise, no-op.

### `DeployHelper:OnWallUpdate()`
* **Description:** Callback from `wallupdating` system; decrements delay counter and auto-stops helper after delay expires.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Stops helper when `delay <= 1`.

## Events & listeners
- **Listens to:** `ondespawn`/`onremove` (via `OnRemoveEntity`/`OnRemoveFromEntity`) – removes self from global registry.
- **Pushes:** None identified.

## Global functions
### `TriggerDeployHelpers(x, y, z, range, recipe, placerinst)`
* **Description:** Global helper used during placement to check and activate all registered helpers within `range` of the placement point.
* **Parameters:**
  * `x`, `y`, `z` (numbers) – world coordinates of deployment.
  * `range` (number) – raw radius; squared internally.
  * `recipe` (Recipe or `nil`) – the recipe being deployed.
  * `placerinst` (Entity) – the player/entity placing the item.
* **Returns:** Nothing.
* **Error states:** Filters helpers using:
  * No filters → always match.
  * Recipe match → only if `recipefilters` includes `recipe.name`.
  * Key match → only if `placerinst.deployhelper_key` exists and is in `keyfilters`.
  * Additional `canenablehelper` predicate is checked if defined.
