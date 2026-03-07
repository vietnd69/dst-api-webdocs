---
id: featherpencil
title: Featherpencil
description: A consumable cat toy that breaks when drawn with and can be used as low-value fuel or igniter.
tags: [inventory, fuel, consumable, item, crafting]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 24c29fa8
system_scope: inventory
---

# Featherpencil

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `featherpencil` prefab represents an in-game item that functions as a decorative cat toy and drawing tool. When drawn on with (e.g., by the player using the Draw action), it is consumed (removed from the game). It also provides minimal fuel value and supports basic burn/propagator behavior, making it useful for igniting fires in survival contexts.

The component behavior is implemented via `fuel`, `stackable`, `inventoryitem`, `drawingtool`, and helper utilities like `MakeSmallBurnable`, `MakeHauntableLaunchAndIgnite`, and `MakeSmallPropagator`.

## Usage example
```lua
local inst = SpawnPrefab("featherpencil")
inst.components.stackable:Get(1) -- retrieves one pencil, decrementing stack
inst.components.drawingtool:SetOnDrawFn(function(inst) -- custom draw logic override
    print("Feather pencil used for drawing!")
    inst:Remove()
end)
```

## Dependencies & tags
**Components used:** `inventoryitem`, `stackable`, `fuel`, `drawingtool`, `inspectable`, `snowmandecor`
**Tags:** Adds `cattoy` tag; uses tags from helper functions (`burnable`, `propagator`, `ignite`, `hauntable_launch`, `hauntable_ignite`, `hauntable` where applicable via `MakeSmallBurnable`, `MakeSmallPropagator`, `MakeHauntableLaunchAndIgnite`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fuelvalue` | number | `TUNING.SMALL_FUEL` | Fuel value used when burning in a fire or campfire. |

## Main functions
### `OnDrawFn(inst)`
* **Description:** Callback executed when the featherpencil is used as a drawing tool (e.g., during player drawing actions). Immediately destroys the item by removing it from the world.
* **Parameters:** `inst` (Entity) — the featherpencil instance being drawn on.
* **Returns:** Nothing.
* **Error states:** No error conditions; always removes the instance.

### `SetOnDrawFn(fn)` *(inherited from `drawingtool` component)*
* **Description:** Attaches a custom draw handler function to the `drawingtool` component. Overriding this allows mods to customize drawing behavior instead of relying on the default `OnDrawFn` which destroys the item.
* **Parameters:** `fn` (function) — a callback taking `inst` as its sole argument.
* **Returns:** Nothing.

## Events & listeners
None identified.