---
id: halloweenpotionmoon
title: Halloweenpotionmoon
description: Consumes a Halloween potion item to mutate a target entity via the HalloweenMoonMutable component.
tags: [halloween, transformation, consumable]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: components
source_hash: 393242aa
system_scope: entity
---

# Halloweenpotionmoon

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`HalloweenPotionMoon` is a component that enables an entity (typically a consumable item) to trigger a transformation on a target entity. It delegates the actual mutation logic to the `halloweenmoonmutable` component and supports custom post-use behavior via an optional callback. After successful use, the potion is consumed — either reducing stack size or removing the instance entirely.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("halloweenpotionmoon")
inst.components.halloweenpotionmoon:SetOnUseFn(function(self, doer, target, success, transformed, container)
    if success then
        print("Mutation succeeded!")
    end
end)
-- Later, when used:
inst.components.halloweenpotionmoon:Use(player, target_entity)
```

## Dependencies & tags
**Components used:** `halloweenmoonmutable`, `inventoryitem`, `stackable`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `onusefn` | function | `nil` | Optional callback invoked after use attempt. Signature: `(self, doer, target, success, transformed_inst, container)`. |

## Main functions
### `SetOnUseFn(fn)`
*   **Description:** Registers a callback function to be invoked when the potion is used, regardless of whether the mutation succeeded.
*   **Parameters:** `fn` (function) — function to execute on use. Receives the potion instance, the user, the target, a success boolean, the transformed instance (if any), and the container.
*   **Returns:** Nothing.

### `Use(doer, target)`
*   **Description:** Attempts to mutate the `target` entity using its `halloweenmoonmutable` component. Consumes this potion instance after the operation.
*   **Parameters:**  
  `doer` (Entity) — entity initiating the use (typically a player).  
  `target` (Entity or `nil`) — entity to mutate; must have the `halloweenmoonmutable` component to succeed.
*   **Returns:** Nothing.
*   **Error states:**  
  - If `target` is `nil` or lacks `halloweenmoonmutable`, mutation is skipped (`success = false`), but the potion is still consumed.  
  - Returns early without mutation if the target is dead (via `halloweenmoonmutable.Mutate`).

## Events & listeners
- **Pushes:** None (does not fire events directly).  
- **Listens to:** None.
