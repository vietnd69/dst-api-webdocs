---
id: halloweenpotionmoon
title: Halloweenpotionmoon
description: Consumes the potion to trigger transformation of a compatible target entity via the HalloweenMoonMutable component.
tags: [consumable, transformation, event]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 393242aa
system_scope: inventory
---

# Halloweenpotionmoon

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`HalloweenPotionMoon` is a component used on consumable items (typically potions) that trigger transformations of other entities during the Moon event. When used, it attempts to mutate a target entity by invoking its `halloweenmoonmutable` component. The potion itself is consumed after use—either as part of a stack or as a singleton item. This component supports optional custom logic via a callback function and integrates with inventory/container systems for item placement.

## Dependencies & tags
**Components used:** `halloweenmoonmutable`, `inventoryitem`, `stackable`
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `SetOnUseFn(fn)`
* **Description:** Sets an optional callback function that executes after the potion’s primary use logic completes.
* **Parameters:** `fn` (function) - a function with signature `fn(potion, doer, target, success, transformed_inst, container)`.
* **Returns:** Nothing.

### `Use(doer, target)`
* **Description:** Attempts to transform the `target` entity using its `halloweenmoonmutable` component. Afterward, the potion itself is consumed.
* **Parameters:**
  - `doer` (entity or `nil`) – the entity initiating the use.
  - `target` (entity or `nil`) – the entity to be transformed; must have the `halloweenmoonmutable` component for success.
* **Returns:** Nothing.
* **Error states:** 
  - If `target` is `nil` or lacks `halloweenmoonmutable`, `success` is `false`, no transformation occurs, but the potion is still consumed.
  - The callback set via `SetOnUseFn` always executes, regardless of success.

## Events & listeners
- **Pushes:** None directly. Events are emitted by the `halloweenmoonmutable` component during mutation (e.g., `onhalloweenmoonmutate`).

## Usage example
```lua
local potion = CreateEntity()
potion:AddComponent("halloweenpotionmoon")
potion:AddComponent("stackable")
potion.components.stackable:SetStackSize(3)

potion.components.halloweenpotionmoon:SetOnUseFn(function(inst, doer, target, success, new_inst, container)
    print("Potion used on", target and target.prefab or "nil", "→ success:", success)
end)

-- Later, when the player uses the potion:
potion.components.halloweenpotionmoon:Use(player, target_entity)
