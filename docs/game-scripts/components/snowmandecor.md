---
id: snowmandecor
title: Snowmandecor
description: Marks an entity as a decorated snowman, likely for cosmetic or gameplay identification purposes.
tags: [visual, entity, decorative]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 063ac314
system_scope: entity
---

# Snowmandecor

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Snowmandecor` is a minimal component that serves as a tagging mechanism for entities representing decorated snowmen. It does not implement any logic beyond initialization and primarily exists to enable identification and potential action registration via external systems (e.g., `componentactions.lua`). It integrates with DST's ECS by being attached to relevant prefabs via `inst:AddComponent("snowmandecor")`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("snowmandecor")
-- The component is now attached; actions may be registered elsewhere
-- (e.g., in componentactions.lua) based on the presence of this component.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
No documented main functions beyond the constructor.

## Events & listeners
Not applicable
