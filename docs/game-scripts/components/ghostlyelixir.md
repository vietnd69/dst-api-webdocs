---
id: ghostlyelixir
title: Ghostlyelixir
description: Handles the application of ghostly elixir effects to a target entity, consuming the item upon successful application.
tags: [consumable, inventory, utility, network]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 40f16510
system_scope: inventory
---

# Ghostlyelixir

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Ghostlyelixir` is a component that enables an entity to act as a ghostly elixir item—consumable by players or other entities to trigger specific gameplay effects. It integrates with the `ghostlyelixirable` and `stackable` components to determine the recipient and manage item consumption. The component is typically attached to elixir prefabs and ensures proper cleanup after use.

## Usage example
```lua
local inst = SpawnPrefab("ghostlyelixir")
inst.components.ghostlyelixir.doapplyelixerfn = function(elixir, doer, target)
    -- Custom effect logic here
    return true
end
-- Later, during inventory interaction:
inst.components.ghostlyelixir:Apply(player, player)
```

## Dependencies & tags
**Components used:** `inventoryitem`, `stackable`, `ghostlyelixirable`  
**Tags:** Adds `ghostlyelixir` on instantiation; removes `ghostlyelixir` on removal from entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `doapplyelixerfn` | function | `nil` | Optional callback function `(elixir, doer, target) -> (boolean success, string? reason)` defining custom application logic. |

## Main functions
### `Apply(doer, target)`
*   **Description:** Attempts to apply the elixir's effect to the specified target. Delegates final recipient determination to `ghostlyelixirable:GetApplyToTarget()`, invokes `doapplyelixerfn` if defined, and consumes the elixir upon success.
*   **Parameters:**  
    `doer` (Entity) - The entity performing the application (e.g., a player).  
    `target` (Entity) - The intended recipient; if the target has the `elixir_drinker` tag, the true owner is resolved via `inventoryitem.owner`.
*   **Returns:**  
    `boolean success` – `true` if the elixir was applied and consumed; `false` otherwise.  
    `string? reason` – (optional) A localizable string explaining failure, if returned by `doapplyelixerfn`.
*   **Error states:** Returns `false` if `target` lacks `inventoryitem.owner` when `elixir_drinker` is present, or if `doapplyelixerfn` is `nil` or returns `false`.

### `OnRemoveFromEntity()`
*   **Description:** Cleans up the `ghostlyelixir` tag when the component is removed from its entity.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
None identified.
