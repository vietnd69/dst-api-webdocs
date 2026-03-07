---
id: coolant
title: Coolant
description: A reusable item component that provides zero waterproofer effectiveness and is intended for use as a consumable or launchable item in the game.
tags: [inventory, waterproofer, item]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 85095d83
system_scope: inventory
---

# Coolant

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`coolant` is a simple item prefab that serves as a base inventory item with minimal functionality. It is primarily used for visual or launch purposes (e.g., in crafting or as a projectile in minigames), and explicitly sets `waterproofer` effectiveness to `0`, indicating it offers no water resistance. The item is stackable, floatable, and supports inspection and hauntable launching.

## Usage example
```lua
local inst = TheWorld:SpawnPrefab("coolant")
inst.components.stackable:SetCount(5)
inst.components.inventoryitem:GoToInventory()
```

## Dependencies & tags
**Components used:** `stackable`, `waterproofer`, `inspectable`, `inventoryitem`, `hauntable_launch`  
**Tags:** `waterproofer`, `coolant`

## Properties
No public properties.

## Main functions
The component does not define any custom methods beyond those inherited from base components (`stackable`, `waterproofer`, etc.). Initialization logic resides in the prefab function (`fn`) rather than a component class.

## Events & listeners
None identified.