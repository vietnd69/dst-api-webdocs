---
id: wagdrone_parts
title: Wagdrone Parts
description: A repair item that restores wagdrones to full functionality and converts broken or unfriendly wagdrones into friendly ones.
tags: [repair, drone, item, crafting]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f8de4ae1
system_scope: crafting
---

# Wagdrone Parts

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wagdrone_parts` is a consumable item prefab used to repair broken or unfriendly `wagdrone_rolling` entities. When used on a compatible wagdrone, it fully restores the drone's health (sets finiteuses to 100%) and triggers repair effects, or converts an unfriendly drone to a friendly one if it lacks a `finiteuses` component. It is stackable and designed for reuse in crafting recipes or inventory use.

The component interacts primarily with the `useabletargeteditem`, `stackable`, and `finiteuses` components, and relies on logic defined in `wagdrone_common.lua`.

## Usage example
```lua
local parts = SpawnPrefab("wagdrone_parts")
parts.components.stackable:SetStackSize(3) -- Stack up to 3 in inventory

-- Later, when using the item on a broken drone
local drone = GetEntityNearPlayer("wagdrone_rolling")
if drone and drone.components.finiteuses and drone.components.finiteuses:GetPercent() < 1 then
    parts.components.useabletargeteditem:UseOn(drone, player)
end
```

## Dependencies & tags
**Components used:** `finiteuses`, `stackable`, `useabletargeteditem`, `inspectable`, `inventoryitem`, `hauntable`
**Tags:** Checks `wagdrone`, `HAMMER_workable`, `_inventoryitem`; no tags added or removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `UseableTargetedItem_ValidTarget` | function | `UseableTargetedItem_ValidTarget` | Callback determining whether a target is repairable by this item. |
| `pickupsound` | string | `"metal"` | Sound played when the item is picked up. |

## Main functions
### `OnUsed(inst, target, user)`
*   **Description:** Called when the item is used on a target. Repairs friendly drones by fully healing them (sets finiteuses to 100%), or converts broken/unfriendly drones (those without a `finiteuses` component) to friendly state. Removes the item from inventory after use.
*   **Parameters:**  
    `inst` (Entity) — the wagdrone_parts entity instance.  
    `target` (Entity?) — the target entity being used on. May be `nil` or invalid.  
    `user` (Entity) — the entity using the item (typically a player).  
*   **Returns:** `true` on successful repair/conversion; `false` and `"CANNOT_FIX_DRONE"` if the target is invalid or not a compatible drone.
*   **Error states:** Early return with `false` if `target` is invalid, does not persist, or is not a `wagdrone_rolling`. Does nothing if `target` lacks expected components.

### `UseableTargetedItem_ValidTarget(inst, target, doer)`
*   **Description:** Predicate function determining if a given target can be repaired. Ensures the target has the `wagdrone` tag and at least one of the tags: `HAMMER_workable` or `_inventoryitem`.
*   **Parameters:**  
    `inst` (Entity) — the wagdrone_parts entity instance.  
    `target` (Entity) — the candidate target entity.  
    `doer` (Entity) — the entity attempting the action.  
*   **Returns:** `true` if the target is a valid repair target; `false` otherwise.

### `ResetInUse(inst)`
*   **Description:** Internal helper that clears the `inuse` state on the item after use. Ensures the item doesn’t remain locked in use state.
*   **Parameters:** `inst` (Entity) — the item instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.
