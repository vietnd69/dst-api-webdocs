---
id: glommerwings
title: Glommerwings
description: A consumable item that provides medium-large fuel value and functions as burnable/propagator with hauntable properties in DST.
tags: [fuel, consumable, hauntable]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3d5e2cec
system_scope: inventory
---

# Glommerwings

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`glommerwings` is a prefabricated item entity that provides medium-large fuel value and supports combustion mechanics (burnable, propagator) and hauntable behavior. As a prefab, it defines the core structure of the Glommer Wings item used in DST — inserted into inventories and used in fuel sources such as Fire Pits and Lanterns. It uses standard inventory physics, floatable rendering, and network sync via the ECS framework.

## Usage example
```lua
-- In a mod, you might create a Glommer Wings instance like so:
local wings = Prefab("glommerwings", nil, nil)
-- or, more commonly, spawn it via TheWorld:PushEvent("spawnprefab", {prefab = "glommerwings", ...})
-- The component behavior is already embedded in the prefab definition.
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `fuel`, `burnable`, `propagator`, `hauntablelaunch`, `transform`, `animstate`, `network`, `physics`, `floatable`.  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fuelvalue` | number | `TUNING.MED_LARGE_FUEL` | Amount of fuel provided when consumed in a fuel-based device. |

## Main functions
Not applicable — this is a prefab definition, not a component class. No component methods are defined; behavior is initialized in the prefab factory function `fn()`.

## Events & listeners
None identified — no custom event listeners or event pushes are defined in the prefab source.