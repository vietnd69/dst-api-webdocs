---
id: occupier
title: Occupier
description: Stores and manages ownership information for an entity, typically used for map regions or structures claimed by a specific entity (e.g., a boss or character).
tags: [map, ownership, region]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 47604145
system_scope: entity
---

# Occupier

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Occupier` is a lightweight component that provides simple ownership semantics for an entity. It allows storing and retrieving a reference to the entity that "owns" or "occupies" the host entity, such as a claimed zone or structure. It does not perform any logic itself—its sole purpose is to hold and expose ownership state.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("occupier")
inst.components.occupier:SetOwner(some_entity)
local owner = inst.components.occupier:GetOwner()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `Guid` or `Entity` or `nil` | `nil` | Reference to the entity that occupies or claims this instance. |

## Main functions
### `GetOwner()`
* **Description:** Returns the current owner of this entity.
* **Parameters:** None.
* **Returns:** The owner entity, or `nil` if no owner is set.

### `SetOwner(owner)`
* **Description:** Sets the owner of this entity.
* **Parameters:** `owner` (Entity or `nil`) — the entity to set as owner.
* **Returns:** Nothing.

## Events & listeners
None identified
