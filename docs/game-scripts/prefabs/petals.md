---
id: petals
title: Petals
description: A plant-based consumable item that can be dried into a different product and haunts under certain conditions.
tags: [crafting, drying, haunt, consumable, decoration]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5ceddb01
system_scope: inventory
---

# Petals

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `petals` prefab represents a small, decorative, and consumable item in the game—primarily used as a craftable food ingredient, cat toy, or vase decoration. It integrates with multiple core systems: it is edible, perishable, stackable, fuelable, dryable, and hauntable. It supports networked replication and can transform into `petals_evil` (a haunted variant) or `petals_dried` (a dried variant) under specific conditions. The prefab is optimized by adding the `dryable` tag early and registering干燥 support for both pristine and dried states.

## Usage example
```lua
local inst = SpawnPrefab("petals")
inst.Transform:SetPosition(x, y, z)
-- Example: Dry the item using the dryable component
if inst.components.dryable then
    inst.components.dryable:Dry()
end
-- Example: Haunt the item manually (if conditions allow)
if inst.components.hauntable then
    inst.components.hauntable:TryHaunt(some_haunter)
end
```

## Dependencies & tags
**Components used:**  
`edible`, `fuel`, `inspectable`, `inventoryitem`, `perishable`, `stackable`, `tradable`, `upgrader`, `vasedecoration`, `dryable`, `hauntable` (via `MakeHauntableLaunchAndPerish` and `AddHauntableCustomReaction`), and utility functions `MakeInventoryPhysics`, `MakeInventoryFloatable`, `MakeSmallBurnable`, `MakeSmallPropagator`, `MakeHauntableLaunchAndPerish`, `AddHauntableCustomReaction`.

**Tags added:**  
`cattoy`, `vasedecoration`, `dryable`

## Properties
No public properties are defined directly on the `petals` prefab. Property values are set on its attached components in the constructor (see usage example and component usage).

## Main functions
Not applicable — this is a prefab factory function (`fn`) and does not define custom instance methods.

## Events & listeners
- **Listens to:** None defined directly.
- **Pushes:**  
  - `despawnedfromhaunt` — fired when the original `petals` entity is replaced by `petals_evil`. Payload: `{ haunter = haunter, newPrefab = new }`.  
  - (Via `petals_evil` spawning logic) `spawnedfromhaunt` — fired on the new entity. Payload: `{ haunter = haunter, oldPrefab = inst }`.

The `OnHaunt` function (defined locally) is registered as a custom reaction via `AddHauntableCustomReaction`, and handles hauntable logic, entity replacement, and event propagation.
