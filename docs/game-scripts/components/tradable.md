---
id: tradable
title: Tradable
description: Stores a numeric gold value for an entity, used to determine its worth in trade transactions.
tags: [trade, economy, entity]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: c3b7e338
system_scope: economy
---
# Tradable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Tradable` is a simple component that assigns a numeric gold value to an entity. It is used by the game's economy and trading systems to determine how much an item or entity is worth when bought, sold, or traded. The component itself only stores the value; higher-level logic in other systems (e.g., trader prefabs or UI) interprets and acts on this value.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("tradable")
inst.components.tradable.goldvalue = 50
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `goldvalue` | number | `0` | The integer gold value assigned to the entity. |

## Main functions
No public functions are defined beyond property access.

## Events & listeners
None identified
