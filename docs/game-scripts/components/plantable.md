---
id: plantable
title: Plantable
description: Initializes core growth parameters for plants, such as grow time and final product.
tags: [plant, growth, environment]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 166b1cdf
system_scope: environment
---

# Plantable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Plantable` is a minimal component that stores initial growth configuration for plant prefabs. It defines how long a plant takes to mature (`growtime`) and what item it produces when fully grown (`product`). This component does not implement growth logic itself but serves as a data container for higher-level systems (e.g., `grower`, `farmplot`, or custom worldgen logic) to read and act upon.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("plantable")
inst.components.plantable.growtime = 180
inst.components.plantable.product = "turnip_seeds"
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `growtime` | number | `120` | Time in seconds required for the plant to fully grow. |
| `product` | string or nil | `nil` | Prefab name of the item produced upon maturation. |

## Main functions
Not applicable.

## Events & listeners
None identified.
