---
id: soul
title: Soul
description: Assigns the 'soul' tag to an entity, primarily used for identification and gameplay logic.
tags: [tagging, entity]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: b98a5720
system_scope: entity
---

# Soul

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Soul` component is a simple tagging component that adds the `"soul"` tag to the entity it is attached to. It does not provide any additional state, timers, or functionality beyond tag assignment. This component is typically added during prefab initialization to consistently mark entities that qualify as "souls" (e.g., Abigail, ghost characters, or spirit-type entities) for use in conditional logic elsewhere in the codebase.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("soul")
-- Later in code:
if inst:HasTag("soul") then
    -- Special soul-handling logic
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `"soul"` to the entity.

## Properties
No public properties

## Main functions
No public functions — the component's only behavior occurs in the constructor.

## Events & listeners
None identified
