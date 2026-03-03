---
id: moontrader
title: Moontrader
description: Manages acceptance and processing of offerings for moon-based trading interactions, typically used by entities like Moon Moths or Moon Altars.
tags: [trading, moon, inventory, interaction]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 8156d3a7
system_scope: entity
---

# Moontrader

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`MoonTrader` handles the logic for accepting or rejecting offerings made by other entities (typically players) to a moon trader entity (e.g., Moon Moth). It provides customizable validation (`canaccept`) and reward (`onaccept`) callbacks, manages item transfer/Consumption (including stack splitting), and ensures clean removal of the offered item upon successful acceptance. It is typically attached to trader or altar prefabs and integrates with `inventoryitem`, `stackable`, and gameplay state components.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("moontrader")

inst.components.moontrader:SetCanAcceptFn(function(trader, item, giver)
    return item.prefab == "moonrock" and giver:HasTag("player"), "Must be a player holding a Moon Rock"
end)

inst.components.moontrader:SetOnAcceptFn(function(trader, giver, item)
    giver.components.inventory:GiveItem("moonlight_crystal")
    giver.components.sanity:DoDelta(20)
end)
```

## Dependencies & tags
**Components used:** `inventoryitem`, `stackable`  
**Tags:** Adds `moontrader` to the owning instance.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `canaccept` | function\|nil | `nil` | Optional callback `(trader, item, giver) -> (success: boolean, reason: string?)` to validate offerings. |
| `onaccept` | function\|nil | `nil` | Optional callback `(trader, giver, item) -> nil` to execute side effects after accepting an item. |

## Main functions
### `SetCanAcceptFn(fn)`
*   **Description:** Sets the validation function used to determine whether an offering is accepted. Called during `AcceptOffering`.
*   **Parameters:** `fn` (function\|nil) — A callback taking `(trader, item, giver)` and returning `(success: boolean, reason?: string)`.
*   **Returns:** Nothing.

### `SetOnAcceptFn(fn)`
*   **Description:** Sets the side-effect handler function, invoked after successful validation and item removal. Typically used to grant rewards.
*   **Parameters:** `fn` (function\|nil) — A callback taking `(trader, giver, item)`.
*   **Returns:** Nothing.

### `AcceptOffering(giver, item)`
*   **Description:** Processes an offering attempt. Validates via `canaccept`, splits or removes the item from the giver, invokes `onaccept` if provided, and deletes the item.
*   **Parameters:**
    *   `giver` (Entity) — The entity attempting to give the item.
    *   `item` (Entity) — The item being offered.
*   **Returns:** `true` on success; `false, reason` on rejection.
*   **Error states:** Returns `false, reason` if `canaccept` returns a falsy result. Item is removed only on success; otherwise the offering remains unchanged.

## Events & listeners
None identified.
