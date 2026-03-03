---
id: furnituredecor
title: Furnituredecor
description: Manages the visual and logical state of furniture decorations, such as being enabled and whether it's placed on furniture.
tags: [furniture, visual, state]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: c8b15c7b
system_scope: entity
---

# Furnituredecor

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`FurnitureDecor` manages whether an entity is visually and logically treated as a furniture decoration. It controls the presence of the `furnituredecor` tag based on its `enabled` state, and tracks whether the item is placed on top of furniture. The component provides hooks for custom logic via `onputonfurniture` and `ontakeofffurniture` callbacks.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("furnituredecor")

-- Optional: Set custom callbacks
inst.components.furnituredecor.onputonfurniture = function(inst, furniture)
    print("Item placed on furniture: " .. furniture.prefab)
end

inst.components.furnituredecor.ontakeofffurniture = function(inst, furniture)
    print("Item removed from furniture: " .. furniture.prefab)
end

-- Place on furniture
inst.components.furnituredecor:PutOnFurniture(some_furniture)
inst.components.furnituredecor:SetEnabled(false)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds or removes `furnituredecor` tag based on `enabled` state.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `enabled` | boolean | `true` | Controls whether the `furnituredecor` tag is present. |
| `on_furniture` | boolean or nil | `nil` | `true` when the item is placed on furniture; `nil` otherwise. |
| `decor_animation` | string | `"idle"` | Animation state name used for furniture decorations. |
| `onputonfurniture` | function (optional) | `nil` | Callback invoked when the item is placed on furniture. Signature: `fn(inst, furniture)` |
| `ontakeofffurniture` | function (optional) | `nil` | Callback invoked when the item is removed from furniture. Signature: `fn(inst, furniture)` |

## Main functions
### `SetEnabled(enabled)`
* **Description:** Updates the enabled state and adds or removes the `furnituredecor` tag accordingly.
* **Parameters:** `enabled` (boolean) – whether the item should be considered a furniture decoration.
* **Returns:** Nothing.
* **Error states:** No side effects if `enabled` is unchanged.

### `IsOnFurniture()`
* **Description:** Returns whether the item is currently placed on a furniture entity.
* **Parameters:** None.
* **Returns:** `true` if `on_furniture == true`, otherwise `false`.

### `PutOnFurniture(furniture)`
* **Description:** Marks the item as being placed on furniture and invokes the `onputonfurniture` callback if defined.
* **Parameters:** `furniture` (Entity instance) – the furniture entity the item is placed on.
* **Returns:** Nothing.

### `TakeOffFurniture(furniture)`
* **Description:** Marks the item as no longer placed on furniture and invokes the `ontakeofffurniture` callback if defined.
* **Parameters:** `furniture` (Entity instance) – the furniture entity the item is removed from.
* **Returns:** Nothing.

### `OnRemoveFromEntity()`
* **Description:** Ensures the `furnituredecor` tag is removed when the component is removed from an entity.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
Not applicable.
