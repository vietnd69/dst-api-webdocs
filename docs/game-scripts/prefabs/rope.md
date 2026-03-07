---
id: rope
title: Rope
description: A simple consumable item used as fuel, tradable as a cat toy, and flammable in the environment.
tags: [inventory, fuel, environment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 39482899
system_scope: inventory
---

# Rope

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `rope` prefab defines an item used primarily as a fuel source and tradable cat toy. It is instantiated as an inventory object with physical, animated, and networked properties. When added to the world on the master simulation, it gains additional functionality: `inventoryitem`, `inspectable`, `stackable`, `fuel`, and `tradable` components. It is also configured to burn and ignite under specific conditions via `MakeSmallBurnable`, `MakeSmallPropagator`, and `MakeHauntableLaunchAndIgnite`.

## Usage example
```lua
local inst = SpawnPrefab("rope")
if inst ~= nil then
    inst.Transform:SetPosition(x, y, z)
    inst:PushEvent("ignite", { igniter = some_actor })
end
```

## Dependencies & tags
**Components used:** `fuel` (only on master sim)
**Tags:** Adds `cattoy`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fuelvalue` | number | `TUNING.MED_FUEL` | The amount of fuel provided when burned; set on the `fuel` component after it is added. |
| `pickupsound` | string | `"cloth"` | Sound effect played when the item is picked up. |
| `AnimState` | `AnimState` (readonly) | - | Provides animation and build state (`anim/rope.zip`, build `"rope"`, plays `"idle"`). |

## Main functions
Not applicable.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** `ignite` — can be pushed manually (e.g., via `inst:PushEvent("ignite", { igniter = ... })`) to trigger burning behavior configured via `MakeSmallBurnable` and `MakeHauntableLaunchAndIgnite`.