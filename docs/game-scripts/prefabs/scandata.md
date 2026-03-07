---
id: scandata
title: Scandata
description: A small, stackable consumable item used in Don't Starve Together for scanning or detecting entities and environmental data.
tags: [inventory, consumable, scanning]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b93b9c98
system_scope: inventory
---

# Scandata

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`scandata` is a lightweight inventory item prefab that functions as a stackable, consumable device for scanning entities and environmental information. It is attached to entities with standard inventory, floatable, and burnable properties, and integrates with DST’s core systems including stacking, inspection, and environmental interaction (e.g., ignition via hauntable mechanics). This prefab serves as the runtime entity instance for in-game "scandata" objects, used in scenarios such as map scanning or data retrieval features.

## Usage example
```lua
local inst = SpawnPrefab("scandata")
-- Optionally stack multiple items
inst.components.stackable:SetStackSize(5)
-- Items are automatically inspectable and stackable; no further setup required
```

## Dependencies & tags
**Components used:** `inventoryitem`, `stackable`, `inspectable`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size for this item (inherited from `stackable` component). |

## Main functions
*This prefab does not define any custom main functions; it relies entirely on component-provided methods.*

## Events & listeners
*This prefab does not register or emit custom events; event handling is delegated to attached components.*