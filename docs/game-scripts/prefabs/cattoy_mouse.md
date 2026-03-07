---
id: cattoy_mouse
title: Cattoy Mouse
description: A throwable toy item that attracts and interacts with catcoon-type creatures using locomotion and animation states.
tags: [locomotion, inventory, catcoon, toy]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a97bffe9
system_scope: entity
---

# Cattoy Mouse

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`cattoy_mouse` is a lightweight inventory item that serves as a toy for catcoon-related entities (e.g., Kitcoons). It is designed to be thrown or dropped, where it exhibits randomized movement patterns upon being "played with" by a catcoon. The component leverages the `locomotor` and `cattoy` components to manage motion and interaction logic. It is not used for crafting but functions as a consumable environmental prop that triggers behavioral responses in nearby feline creatures.

## Usage example
```lua
local mouse = CreateEntity()
mouse.entity:AddTransform()
mouse.entity:AddAnimState()
mouse.entity:AddSoundEmitter()
mouse.entity:AddDynamicShadow()
mouse.entity:AddNetwork()

-- Add components
mouse:AddComponent("locomotor")
mouse.components.locomotor:EnableGroundSpeedMultiplier(false)
mouse.components.locomotor:SetTriggersCreep(false)
mouse.components.locomotor.runspeed = 7

mouse:AddComponent("inventoryitem")
mouse.components.inventoryitem.nobounce = true
mouse.components.inventoryitem:SetSinks(true)

mouse:AddComponent("cattoy")
mouse.components.cattoy:SetOnPlay(function(inst) print("Playing with mouse!") end)

mouse:AddComponent("fuel")
mouse.components.fuel.fuelvalue = TUNING.SMALL_FUEL
```

## Dependencies & tags
**Components used:** `locomotor`, `inventoryitem`, `cattoy`, `fuel`, `inspectable`, `hauntable`, `burnable`, `propagator`  
**Tags added:** `cattoy`, `kitcoonfollowtoy`, `donotautopick`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `panic_task` | `Task` | `nil` | Periodic task that updates movement direction during play. |
| `end_panic_task` | `Task` | `nil` | Delayed task that cancels panic movement after ~61 frames. |
| `animbank` | string | `"cattoy_mouse"` | Animation bank used by `AnimState`. |
| `animbuild` | string | `"cattoy_mouse"` | Build name used by `AnimState`. |

## Main functions
No custom public methods exist on the prefab instance itself. Interaction is handled through callbacks registered on attached components (e.g., `SetOnPlay` on `cattoy`). Internal helper functions (`panic_update`, `panic_cancel`) are used exclusively for controlling behavior during play sessions.

## Events & listeners
- **Listens to:** None directly in this file. Interaction is handled via callback registration in `cattoy:SetOnPlay(...)`.
- **Pushes:** None directly in this file. The `locomotor` and `cattoy` components may emit events (e.g., `locomote` on start/stop of motion), but this prefab does not define listeners for such events.
