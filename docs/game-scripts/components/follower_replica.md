---
id: follower_replica
title: Follower Replica
description: Manages networked references to an entity's leader or item owner for follower behavior synchronization between client and server.
tags: [network, entity, leader, follower]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 00bdfa10
system_scope: network
---

# Follower Replica

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Follower` is a network-replicated component that tracks the relationship between an entity and its leader or item owner. It uses `net_entity` to synchronize leadership or item-ownership state across the network (server to client). This component is typically attached to follower entities (e.g., pets, minions, or items held by followers) to ensure consistent awareness of who they follow or serve on both sides of the network boundary.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("follower_replica")

-- Set the leader entity
local leader = TheWorld.components.leaderboard:GetLeader()
inst.components.follower_replica:SetLeader(leader)

-- Or set an item owner
inst.components.follower_replica:SetItemOwner(someOwner)

-- Retrieve the effective leader (preferring item owner if set)
local effectiveLeader = inst.components.follower_replica:GetLeader()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_leader` | `net_entity` | `nil` | Networked reference to the entity's leader. |
| `_itemowner` | `net_entity` | `nil` | Networked reference to the entity's item owner (higher priority than leader). |

## Main functions
### `SetLeader(leader)`
* **Description:** Sets the networked leader reference for this follower entity. The leader is used when no item owner is set.
* **Parameters:** `leader` (`entity` or `nil`) — the entity that acts as the leader, or `nil` to clear the reference.
* **Returns:** Nothing.

### `SetItemOwner(owner)`
* **Description:** Sets the networked item owner reference. This takes precedence over `_leader` when determining the effective leader via `GetLeader()`.
* **Parameters:** `owner` (`entity` or `nil`) — the entity that owns the item/follower, or `nil` to clear the reference.
* **Returns:** Nothing.

### `GetLeader()`
* **Description:** Returns the effective leader: the item owner if set, otherwise the leader. This is used for logic that needs a single authoritative "follow target".
* **Parameters:** None.
* **Returns:** `entity?` — the effective leader entity, or `nil` if neither `_itemowner` nor `_leader` is set.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified
