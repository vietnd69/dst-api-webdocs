---
id: murderable
title: Murderable
description: Adds the `murderable` tag to an entity, marking it as a valid target for murder-related game logic.
tags: [tag, entity]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: da4e1201
system_scope: entity
---

# Murderable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Murderable` component assigns the `murderable` tag to the entity it is attached to. This tag signals to other systems (e.g., AI, actions, or gameplay rules) that the entity can be murdered. It is a simple tag-based marker used for behavioral and rule-based filtering across the game.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("murderable")
-- The entity now has the "murderable" tag and can be detected via `inst:HasTag("murderable")`
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `murderable` on construction; removes `murderable` on component removal.

## Properties
No public properties

## Main functions
### `OnRemoveFromEntity()`
* **Description:** Called when the component is removed from its entity. Removes the `murderable` tag.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
None identified
