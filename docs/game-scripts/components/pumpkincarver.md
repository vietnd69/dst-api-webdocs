---
id: pumpkincarver
title: Pumpkincarver
description: A placeholder component with no functional logic, likely reserved for future implementation of pumpkin carving mechanics.
tags: [crafting, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 0b349a22
system_scope: entity
---

# Pumpkincarver

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Pumpkincarver` is a minimal component that currently contains no functional implementation beyond initializing the component instance. It registers no events, defines no properties, and exposes no methods beyond the constructor. According to the comment in the source, actions related to pumpkin carving are registered in `componentactions.lua`, suggesting this component is a work-in-progress skeleton for future pumpkin-carving gameplay.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("pumpkincarver")
-- No methods or properties are currently available on this component
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
No main functions are defined beyond the constructor.

## Events & listeners
None identified
