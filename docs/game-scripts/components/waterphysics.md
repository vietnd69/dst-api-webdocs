---
id: waterphysics
title: Waterphysics
description: Applies basic physical properties to entities that interact with water, specifically defining their bounciness (restitution).
tags: [physics, water, entity]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 8a16ae08
system_scope: physics
---
# Waterphysics

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`WaterPhysics` is a minimal component that stores a single physical property—restitution (bounciness)—for an entity. It is intended for use in contexts where entities interact with water-based environments and need configurable bounce behavior. The component currently only initializes the `restitution` value and provides no further logic or event handling, suggesting it is likely used in conjunction with higher-level physics or locomotion systems.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("waterphysics")
inst.components.waterphysics.restitution = 0.8
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `restitution` | number | `1` | Coefficient of restitution (bounciness) used when the entity interacts with water. A value of `1` implies perfect elasticity; lower values indicate energy loss on bounce. |

## Main functions
No public functions beyond the constructor are defined.

## Events & listeners
None identified
