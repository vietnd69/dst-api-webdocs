---
id: fuel
title: Fuel
description: Manages fuel properties and behavior for entities, including fuel type tagging and fuel consumption events.
tags: [inventory, item, network]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: d5c01b6a
system_scope: entity
---

# Fuel

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `fuel` component defines how an entity behaves as fuel—primarily by tracking its fuel value and type, managing associated tags, and notifying other systems when the item is consumed as fuel. It is typically attached to inventory items such as firewood, coal, or other burnable materials. When the item is taken as fuel (e.g., by a campfire), it fires events and optionally invokes a callback function.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("fuel")
inst.components.fuel:SetOnTakenFn(function(inst, taker)
    print(inst.prefab .. " was used as fuel by " .. taker.prefab)
end)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds/removes `"<fueltype>_fuel"` tags dynamically based on fuel type (e.g., `"burnable_fuel"`, `"organic_fuel"`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fuelvalue` | number | `1` | Quantity of fuel provided by this item. Not directly used by this component but exposed for other systems (e.g., fires) to read. |
| `fueltype` | string (from `FUELTYPE.*` constants) | `FUELTYPE.BURNABLE` | The type of fuel (e.g., `"burnable"`, `"organic"`), which determines the tag added/removed. |
| `ontaken` | function or `nil` | `nil` | Optional callback invoked when the item is consumed as fuel. Signature: `function(inst, taker)`. |

## Main functions
### `SetOnTakenFn(fn)`
*   **Description:** Sets a callback function to be invoked when the fuel item is taken/consumed.  
*   **Parameters:** `fn` (function or `nil`) — the function to call on fuel consumption; takes `inst` (the fuel item) and `taker` (the entity consuming it) as arguments.  
*   **Returns:** Nothing.

### `Taken(target)`
*   **Description:** Reports that the fuel item has been consumed as fuel by a target entity. Fires the `"fueltaken"` event and invokes the `ontaken` callback (if set).  
*   **Parameters:** `target` (entity instance) — the entity that consumed the fuel.  
*   **Returns:** Nothing.

## Events & listeners
- **Pushes:**  
  - `"fueltaken"` — fired when `Taken(target)` is called. Payload: `{taker = target}`.

- **Listens to:**  
  - None identified (internal tag updates are handled via the property handler `onfueltype`, not event listeners).

## Notes
- Tag updates for fuel type are handled automatically when the `fueltype` property is assigned (via the metatable handler `onfueltype`), ensuring the entity always has the correct `"<fueltype>_fuel"` tag.
- When the component is removed from an entity, it cleans up its tag via `OnRemoveFromEntity()`.
