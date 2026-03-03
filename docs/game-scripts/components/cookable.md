---
id: cookable
title: Cookable
description: Enables an entity to be transformed into a cooked product when processed in a cooking station.
tags: [cooking, inventory, crafting]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 302486cf
system_scope: crafting
---

# Cookable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Cookable` allows an entity to be processed into a new cooked item via cooking devices (e.g., campfire, crock pot). It stores the product definition (either a static prefab name or a factory function) and handles the creation of the output item upon cooking. When applied to an entity, it adds the `cookable` tag and registers a callback function that executes during the cooking process. It optionally synchronizes perishability from the original item to the cooked product, reducing spoilage by half for non-small-creature items.

This component is typically added to raw food prefabs and interacts with the `perishable` component to preserve freshness in the cooked output.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("cookable")
inst.components.cookable:SetProduct(" cooked_item_name")
inst.components.cookable:SetOnCookedFn(function(inst, cooker, chef)
    -- custom logic (e.g., sound, effects)
end)
```

## Dependencies & tags
**Components used:** `perishable` (read-only access via `GetPercent`/`SetPercent` for spoilage transfer)
**Tags:** Adds `cookable` tag to the entity on initialization; removes it on component removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `product` | string or function | `nil` | The prefab name or a callable that returns a prefab name/function for the cooked result. |
| `oncooked` | function | `nil` | Optional callback invoked when cooking completes; signature: `fn(inst, cooker, chef)`. |

## Main functions
### `SetOnCookedFn(fn)`
* **Description:** Sets the callback function executed during cooking. Useful for side effects like particle effects, sounds, or custom logic.
* **Parameters:** `fn` (function) — A function accepting three arguments: the cooked entity (`inst`), the cooking device (`cooker`), and the cooking character (`chef`).
* **Returns:** Nothing.
* **Error states:** No validation; setting `nil` disables the callback.

### `Cook(cooker, chef)`
* **Description:** Performs the cooking action. Executes the `oncooked` callback (if set), spawns the product prefab, and—if both original and product have `perishable` components and the item is not a `smallcreature`—adjusts the product's spoilage level based on the original’s freshness.
* **Parameters:**  
  - `cooker` (Entity) — The cooking device or appliance used.  
  - `chef` (Entity) — The character performing the cooking.
* **Returns:** `Entity?` — The newly spawned product entity, or `nil` if no product is defined or spawn fails.
* **Error states:**  
  - Returns `nil` if `self.product` is `nil`.  
  - Spoilage transfer is skipped if `self.inst:HasTag("smallcreature")` is true, or if either entity lacks a `perishable` component.

## Events & listeners
- **Pushes:** No events are fired by this component itself. Event-driven behavior is expected via the `oncooked` callback.
