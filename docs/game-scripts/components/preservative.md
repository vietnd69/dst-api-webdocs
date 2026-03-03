---
id: preservative
title: Preservative
description: Stores configuration for how preservation affects item decay rates, primarily used by the game's preservation and spoilage systems.
tags: [decay, inventory, preservation]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: c61174fc
system_scope: inventory
---

# Preservative

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Preservative` is a simple configuration component that defines how preservation mechanics modify an entity's decay behavior. It is typically attached to items (e.g., preserved foods, salt, ice) that influence spoilage rates of other items (e.g., in storage containers). The component exposes two configurable parameters: `percent_increase` (multiplier for decay rate) and `divide_effect_by_stack_size` (whether effect is spread across stacked items).

This component does not directly manage decay logic — instead, it provides configuration data to external systems (e.g., the `preservable` or `container` components) that implement actual spoilage calculations.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("preservative")
inst.components.preservative.percent_increase = 1.5 -- increases preservation effect by 50%
inst.components.preservative.divide_effect_by_stack_size = false
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `percent_increase` | number | `1` | Multiplier applied to the base spoilage reduction effect (e.g., `1` = neutral, `< 1` = slows decay, `> 1` = accelerates spoilage). |
| `divide_effect_by_stack_size` | boolean | `true` | If `true`, the effect is divided by stack size (e.g., effect per item); if `false`, the full effect applies regardless of stack size. |

## Main functions
No main functions are defined in this component.

## Events & listeners
None identified
