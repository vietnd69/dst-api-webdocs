---
id: waxpaper
title: Waxpaper
description: A small item that serves as light fuel and can ignite nearby flammable objects when exposed to heat.
tags: [fuel, flammable, item]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b019fb54
system_scope: inventory
---

# Waxpaper

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`waxpaper` is a lightweight, stackable inventory item that functions as a flammable fuel source. It is designed to ignite easily and provide short-duration lighting when used as fuel. The prefab integrates with multiple core systems: `stackable` for item stacking limits, `fuel` for fuel value contribution, `propagator` for fire spread mechanics, and `inventoryitem` for in-game handling. It is commonly used as an ignition aid for campfires or other heat-sensitive objects.

## Usage example
The waxpaper prefab is instantiated automatically by the game and not typically added to entities directly by modders. However, a modder might reference its components after acquisition:
```lua
-- When waxpaper is in the world or inventory, access its properties:
local fuel_value = inst.components.fuel.fuelvalue  -- e.g., TUNING.SMALL_FUEL
local max_stack = inst.components.stackable.maxsize  -- e.g., TUNING.STACK_SIZE_SMALLITEM
local flashpoint = inst.components.propagator.flashpoint  -- dynamic: 10–15 range
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `stackable`, `fuel`, `tradable`, `propagator`  
**Tags:** None explicitly added or removed during initialization.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fuelvalue` (from `fuel`) | number | `TUNING.SMALL_FUEL` | Amount of fuel provided when burned in a fire. |
| `maxsize` (from `stackable`) | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum number of waxpaper items that can stack in one inventory slot. |
| `flashpoint` (from `propagator`) | number | `10 + math.random() * 5` (10–15 range) | Temperature at which the item ignites and starts propagating flame to nearby objects. |

## Main functions
The waxpaper prefab does not define custom component methods; it relies entirely on standardized component behaviors. No additional public functions are defined beyond standard component APIs.

## Events & listeners
The waxpaper prefab does not register custom event listeners or emit game-logic events during initialization. It relies on built-in propagator/fuel/ignition hooks from `MakeSmallBurnable`, `MakeSmallPropagator`, and `MakeHauntableLaunchAndIgnite`.