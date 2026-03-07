---
id: storytellingprop
title: Storytellingprop
description: Adds the 'storytellingprop' tag to an entity to indicate it is a decorative narrative object in the world.
tags: [tag, narrative, decorative]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: fb2fb904
system_scope: entity
---

# Storytellingprop

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Storytellingprop` is a lightweight component that marks an entity with the `"storytellingprop"` tag. Its primary purpose is to identify decorative or narrative objects in the game world—items that provide environmental storytelling context but do not participate in gameplay systems like physics, combat, or crafting. It automatically adds the tag upon component construction and removes it when the component is detached from its entity.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("storytellingprop")
-- The entity now carries the "storytellingprop" tag, e.g., for debugging or world filtering
assert(inst:HasTag("storytellingprop"))
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `"storytellingprop"` on construction; removes it when component is removed.

## Properties
No public properties

## Main functions
### `OnRemoveFromEntity()`
* **Description:** Removes the `"storytellingprop"` tag from the entity when this component is detached. This ensures tag hygiene and prevents stale tags on entities.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
None identified
