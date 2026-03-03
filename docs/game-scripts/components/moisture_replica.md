---
id: moisture_replica
title: Moisture Replica
description: Tracks and synchronizes whether an entity is wet across the network in Don't Starve Together.
tags: [network, environment, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 0ac7b818
system_scope: network
---

# Moisture Replica

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Moisture` is a minimal network-replicated component that tracks the wet state (`true`/`false`) of an entity. It uses `net_bool` to ensure synchronization between server and clients, making it suitable for networked state that affects gameplay visuals or logic (e.g., wetness from rain or water). It is typically attached to entities that can become wet, such as characters or certain objects.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("moisture_replica")
inst.components.moisture_replica:SetIsWet(true)
if inst.components.moisture_replica:IsWet() then
    print("Entity is wet")
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the entity that owns this component. |
| `_iswet` | `net_bool` | `nil` | Networked boolean representing whether the entity is wet. |

## Main functions
### `SetIsWet(iswet)`
* **Description:** Updates the networked wet state of the entity.
* **Parameters:** `iswet` (boolean) — `true` if the entity is wet, `false` otherwise.
* **Returns:** Nothing.
* **Error states:** None.

### `IsWet()`
* **Description:** Returns the current wet state locally.
* **Parameters:** None.
* **Returns:** `true` if the entity is wet, `false` otherwise.
* **Error states:** None.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified
