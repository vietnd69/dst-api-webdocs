---
id: summoningitem
title: Summoningitem
description: A placeholder component with no functional behavior, intended for future extension or as a stub in the component registry.
tags: [stub]
sidebar_position: 1

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: components
source_hash: 1fac26b9
system_scope: entity
---

# Summoningitem

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`SummoningItem` is a minimal stub component that exists solely to register a component name in the game's component system. It initializes only with a reference to its owning entity (`self.inst`) and provides no additional logic, properties, or event handling. This component likely serves as a placeholder for future functionality related to summoning mechanics, or as a marker tag for inventory or gameplay items that are meant to be identified as "summoning items" without yet implementing behavior.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("summoningitem")
-- No further interaction is possible with this component in the current implementation.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
No public functions

## Events & listeners
None identified
