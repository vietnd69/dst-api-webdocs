---
id: transistor
title: Transistor
description: A consumable item that can be launched to damage or destroy nearby objects and entities, primarily used in combat scenarios.
tags: [combat, item, throwable]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b8ce2bbd
system_scope: inventory
---

# Transistor

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `transistor` is an inventory-based consumable item prefab. It functions as a throwable weapon that can damage or destroy nearby entities and structures upon use. It is built as an entity with animation, physics, and network support, and integrates with the `stackable` and `inventoryitem` components for gameplay functionality.

## Usage example
```lua
-- Typically used internally by the game when spawning the item.
-- Example for modders creating custom prefabs that include transistor behavior:
local inst = Prefab("myitem", function() return ThePrefabs.transistor() end)
-- The transistor prefab is preconfigured with stackable, inventoryitem, and inspectable components.
```

## Dependencies & tags
**Components used:** `stackable`, `inspectable`, `inventoryitem`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `maxsize` | number | `TUNING.STACK_SIZE_LARGEITEM` | Maximum stack size for the item, set via the `stackable` component. |

## Main functions
Not applicable. This is a prefab constructor; no custom functional methods are defined. Behavior is handled by attached components (`stackable`, `inventoryitem`, etc.).

## Events & listeners
Not applicable. This prefab does not define any event listeners or custom event pushes.