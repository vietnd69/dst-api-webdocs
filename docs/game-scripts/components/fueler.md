---
id: fueler
title: Fueler
description: Tracks and manages the fuel properties and consumption behavior of an entity within the game's burning system.
tags: [fuel, entity, inventory]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 95b40cf8
system_scope: entity
---

# Fueler

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Fueler` is an entity component that associates a fuel type and consumption behavior with an object. It enables the game to recognize the entity as burnable or otherwise usable as fuel (e.g., in campfires, fire pits), and automatically manages associated tags (e.g., `burnable_fuel`) to reflect its current fuel classification. The component supports optional callback logic when the fuel is consumed.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("fueler")
inst.components.fueler:SetOnTakenFn(function(fuel, taker)
    print(fuel.prefab .. " was used as fuel by " .. taker.prefab)
end)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds or removes `"{fueltype}_fuel"` tags based on the current `fueltype` (e.g., `burnable_fuel`, `wood_fuel`). These tags are used to categorize and identify fuel sources during interactions.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fuelvalue` | number | `1` | A numeric multiplier or capacity value used when determining fuel duration (not currently used in this file but available for external use). |
| `fueltype` | string (FUELTYPE.*) | `FUELTYPE.BURNABLE` | Enumerated constant defining the type of fuel (e.g., `BURNABLE`, `WOOD`, `MANA`). Controls the dynamic tag added/removed. |
| `ontaken` | function or nil | `nil` | Optional callback function invoked when the fuel is consumed. |

## Main functions
### `SetOnTakenFn(fn)`
*   **Description:** Sets a callback to execute when the fuel entity is taken/consumed (e.g., placed into a fire).
*   **Parameters:** `fn` (function or nil) — a function that accepts two arguments: `fuel` (the entity with this component) and `target` (the consumer, e.g., a fire pit).
*   **Returns:** Nothing.

### `Taken(target)`
*   **Description:** Triggers the "fuel consumed" event and invokes the `ontaken` callback if set.
*   **Parameters:** `target` (Entity) — the entity consuming the fuel (e.g., fire, campfire).
*   **Returns:** Nothing.

### `OnRemoveFromEntity()`
*   **Description:** Cleanup function called when the component is removed from its entity; removes the associated fuel tag to prevent stale tag accumulation.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Pushes:**  
  `fueltaken` — fired when `Taken(target)` is called. Payload contains `{taker = target}`. Used by other systems (e.g., fire management) to update state, sound, or FX.

- **Listens to:**  
  `fueltype` property changes (via the class metatable hook `fueltype = onfueltype`) — internally triggers tag updates when `fueltype` is reassigned.
