---
id: bandage_butterflywings
title: Bandage Butterflywings
description: A consumable item that restores health and sanity when used, requiring the "walter_camp_firstaid" skill to trigger the sanity bonus.
tags: [consumable, sanity, healing, crafting]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 773ad429
system_scope: inventory
---

# Bandage Butterflywings

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`bandage_butterflywings` is a craftable item prefab that functions as a healing consumable. When used, it restores a medium-small amount of health per butterfly wing ingredient. Additionally, if the user has the "walter_camp_firstaid" skill activated, using this item also grants a small sanity restore per wing used. The component integrates with the `healer`, `stackable`, and `skilltreeupdater` systems to manage health restoration, stacking behavior, and skill-dependent sanity effects.

## Usage example
```lua
local inst = SpawnPrefab("bandage_butterflywings")
inst.components.stackable:SetStackSize(5)
-- When used via inventory or crafting, healer logic triggers automatically
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `stackable`, `healer`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `CACHED_WINGS_RECIPE_COST` | number | `nil` (cached at load) | Number of butterfly wings required by the recipe; used to scale health/sanity effects. |
| `inst.components.healer.health` | number | `TUNING.HEALING_MEDSMALL * CACHED_WINGS_RECIPE_COST` | Total health restored per use. |
| `inst.components.stackable.maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size for this item. |

## Main functions
### `OnHealFn(inst, target, doer)`
*   **Description:** Custom callback triggered when the item heals a target. Applies a small sanity restore (`SANITY_SMALL`) per wing ingredient to the *doer*, but only if they have the "walter_camp_firstaid" skill activated.
*   **Parameters:**
    *   `inst` (Entity) – The bandage item instance.
    *   `target` (Entity) – The entity receiving the health heal.
    *   `doer` (Entity) – The entity performing the heal (usually the player).
*   **Returns:** Nothing.
*   **Error states:** Returns early with no effect if `target.components.sanity` is missing or if `doer.components.skilltreeupdater` is missing or the skill is not activated.

### `CacheWingsRecipeCost(default)`
*   **Description:** Caches the number of butterfly wings required by the `bandage_butterflywings` recipe at startup to avoid repeated lookups. Falls back to `default` if the recipe or ingredients are invalid.
*   **Parameters:** `default` (number) – Fallback value (typically `DEFAULT_COST = 3`).
*   **Returns:** Number – The total wing count from the recipe, or `default` if invalid.

## Events & listeners
None identified.
