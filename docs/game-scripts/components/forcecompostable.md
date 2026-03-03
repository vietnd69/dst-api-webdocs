---
id: forcecompostable
title: Forcecompostable
description: Marks an entity as capable of being composted, with optional green/brown categorization for composting mechanics.
tags: [environment, crafting]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 8de3ece8
system_scope: environment
---

# Forcecompostable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`ForceCompostable` is a lightweight component that designates an entity as compostable and optionally assigns it a green or brown classification, which the composting system uses to determine composition behavior and visual state in compost bins. It does not implement composting logic itself but provides the necessary metadata for other systems (e.g., `compostbin`) to process the item.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("compostable")
inst:AddComponent("forcecompostable")
inst.components.forcecompostable.green = true
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Requires `compostable` tag on the entity; does not modify tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `green` | boolean | `false` | Indicates if the item is "green" (e.g., organic waste like vegetables). |
| `brown` | boolean | `false` | Indicates if the item is "brown" (e.g., dry materials like leaves or sticks). |

## Main functions
No public methods beyond property accessors.

## Events & listeners
None identified
