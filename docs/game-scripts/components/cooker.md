---
id: cooker
title: Cooker
description: Validates and executes cooking operations for items placed on a cooking entity, ensuring required conditions are met and handling side effects like sound playback and event callbacks.
tags: [crafting, cooking, interaction]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 5bfc849f
system_scope: crafting
---

# Cooker

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Cooker` component enables an entity to cook other items by transforming cookable items into their cooked variants. It enforces cooking rules—such as requiring fuel, preventing burning or thrown items, and enforcing expert chef requirements for dangerous cookers—and handles the full cooking workflow, including product creation, state cleanup, and event callbacks.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("cooker")
inst:AddTag("cooker") -- Recommended for pristine prefabs
-- Optional: Configure behavior via callbacks
inst.components.cooker.oncookfn = function(cooker, newitem, chef)
    print(chef.prefab .. " cooked " .. newitem.prefab)
end
-- Later, when cooking is initiated:
inst.components.cooker:CookItem(item, chef)
```

## Dependencies & tags
**Components used:** `fueled`, `cookable`, `burnable`, `inventoryitem`, `projectile`  
**Tags:** Adds `"cooker"` on construction; removes `"cooker"` on entity removal. Checks `"dangerouscooker"` and `"expertchef"` tags conditionally.

## Properties
No public properties

## Main functions
### `CanCook(item, chef)`
*   **Description:** Determines whether the given item can be cooked by this entity under current conditions.
*   **Parameters:**  
    `item` (Entity) – The item to cook.  
    `chef` (Entity) – The entity performing the cooking action.  
*   **Returns:** `boolean` – `true` if cooking is allowed, `false` otherwise.
*   **Error states:** Returns `false` if `item` is `nil`, lacks `cookable` component, cooker lacks fuel (`fueled:IsEmpty()`), item is burning (`burnable:IsBurning()`), item is thrown (`projectile:IsThrown()`), or the cooker is `"dangerouscooker"` and chef is not `"expertchef"`.

### `CookItem(item, chef)`
*   **Description:** Attempts to cook the given item. If valid, creates the cooked product, plays cooking sound, invokes callbacks, and removes the original item.
*   **Parameters:**  
    `item` (Entity) – The item to cook.  
    `chef` (Entity) – The entity performing the cooking action.  
*   **Returns:** `Entity?` – The new cooked item entity on success, or `nil` if cooking was disallowed.
*   **Error states:** Returns `nil` if `CanCook` returns `false`. May return `nil` if `Cookable:Cook` itself produces `nil`.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls found).
- **Pushes:** `cooked` – via `ProfileStatsAdd("cooked_"..item.prefab)` for stat tracking.  
  Callbacks:  
  - `self.oncookitem(item, newitem)` – user-defined function, if assigned.  
  - `self.oncookfn(cooker, newitem, chef)` – user-defined function, if assigned.
