---
id: moistureabsorbersource
title: Moistureabsorbersource
description: Provides a source of drying capability for entities equipped with moisture absorption items.
tags: [moisture, item, inventory, drying]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 4ffead68
system_scope: entity
---

# Moistureabsorbersource

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`MoistureAbsorberSource` is a component that marks an entity as capable of providing drying functionality to other entities — specifically those with the `moisture` and `moistureabsorberuser` components. It is designed for inventory items (e.g., dry gear) that reduce moisture levels when equipped or held. The component integrates with `MakeComponentAnInventoryItemSource`, enabling automatic integration with the inventory system and handling of ownership changes (e.g., equip/unequip). It supports customizable drying rate and application logic via callbacks.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("moistureabsorbersource")

-- Define a custom drying rate function
inst.components.moistureabsorbersource:SetGetDryingRateFn(function(item, rate)
    return rate * 0.8  -- Reduce drying rate by 20%
end)

-- Define a custom drying application function
inst.components.moistureabsorbersource:SetApplyDryingFn(function(item, rate, dt)
    -- custom logic, e.g., play sound or consume item durability
end)
```

## Dependencies & tags
**Components used:** `moisture`, `moistureabsorberuser`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `getdryingratefn` | function | `nil` | Optional callback for calculating drying rate; signature: `(item, rate) → new_rate`. |
| `applydryingfn` | function | `nil` | Optional callback for applying drying effect; signature: `(item, rate, dt)`. |

## Main functions
### `SetGetDryingRateFn(fn)`
*   **Description:** Sets a custom function to compute the drying rate for this source. Used when the item is attached to a moisture-consuming entity.
*   **Parameters:** `fn` (function or `nil`) — A function that accepts the source item and base `rate`, returning the adjusted rate.
*   **Returns:** Nothing.

### `GetDryingRate(rate)`
*   **Description:** Calculates and returns the effective drying rate for this source. Applies optional rate modification and a global efficiency multiplier if `rate > 0`.
*   **Parameters:** `rate` (number) — Base drying rate from the consuming entity.
*   **Returns:** `number` — The adjusted drying rate, or `0` if no function is set.

### `SetApplyDryingFn(fn)`
*   **Description:** Sets a custom function to handle the visual or gameplay effect when drying is applied.
*   **Parameters:** `fn` (function or `nil`) — A function that accepts the source item, `rate`, and `dt` (delta time).
*   **Returns:** Nothing.

### `ApplyDrying(rate, dt)`
*   **Description:** Executes the drying application callback (if set) to process the drying effect.
*   **Parameters:**  
  - `rate` (number) — Drying rate passed to the callback.  
  - `dt` (number) — Time step for the update.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.
