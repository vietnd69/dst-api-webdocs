---
id: moisture_replica
title: Moisture Replica
description: Tracks and replicates the wet state of an entity across the network for use inDon't Starve Together.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: network
source_hash: 0ac7b818
---

# Moisture Replica

## Overview  
This component acts as a network-replicated wrapper for an entity's "wet" state, ensuring consistency between the server and all clients by using a `net_bool` backing field. It does not store game logic but serves as a lightweight container for synchronizing the boolean `iswet` value.

## Dependencies & Tags  
- Uses the `net_bool` network primitive via `net_bool(inst.GUID, "moisture._iswet")`  
- Requires the entity (`inst`) to support GUID-based network replication  
- No additional components are required or added by this class  
- No tags are set or removed  

## Properties  

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed to constructor) | Reference to the entity the component belongs to |
| `_iswet` | `net_bool` | `nil` (initialized in `_ctor`) | Networked boolean representing whether the entity is wet |

## Main Functions  

### `SetIsWet(iswet)`
* **Description:** Sets the networked "wet" state of the entity. This change is automatically replicated to all clients.  
* **Parameters:**  
  - `iswet` (`boolean`) — The new wet state (`true` for wet, `false` for dry).

### `IsWet()`
* **Description:** Returns the current local value of the "wet" state, fetched from the networked boolean.  
* **Parameters:** None  
* **Returns:** `boolean` — `true` if the entity is wet, `false` otherwise.

## Events & Listeners  
None identified.