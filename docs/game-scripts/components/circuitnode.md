---
id: circuitnode
title: Circuitnode
description: Manages networked connections between entities within a specified range, enabling bidirectional node relationships for circuit-based logic.
tags: [network, circuit, connection, world]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 52087934
system_scope: world
---

# Circuitnode

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`CircuitNode` implements a connection system that allows entities to discover and link to other entities with matching tags within a radial range. It supports bidirectional connection tracking, optional platform segregation, and footprint-aware distance checks. The component is typically used in objects like switches, wires, or sensors that need to dynamically form logical circuits with nearby compatible nodes. It does not directly manage game state but serves as a foundational utility for building reactive systems.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("circuitnode")
inst.components.circuitnode:SetRange(6)
inst.components.circuitnode:SetConnectAcrossPlatforms(false)
inst.components.circuitnode:SetOnConnectFn(function(inst, other) print("Connected to", other.prefab) end)
inst.components.circuitnode:ConnectTo("switch_target")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `range` | number | `5` | Search radius (in game units) for connecting nodes. |
| `footprint` | number | `0` | Adjustment subtracted from `range` for distance checks when `rangeincludesfootprint` is enabled. |
| `connectsacrossplatforms` | boolean | `true` | If `false`, prevents connections across different physics platforms. |
| `rangeincludesfootprint` | boolean | `false` | When `true`, effective range is reduced by `footprint` during distance calculations. |
| `nodes` | table | `nil` | Internal map of connected nodes (`{ [node_inst] = true }`). |
| `numnodes` | number | `0` | Count of currently connected nodes. |
| `onconnectfn` | function | `nil` | Optional callback invoked when a new node connects. |
| `ondisconnectfn` | function | `nil` | Optional callback invoked when a node disconnects. |

## Main functions
### `ConnectTo(tag)`
*   **Description:** Scans for entities within range that possess the specified `tag` and have an enabled `circuitnode` component. Establishes bidirectional connections to qualifying entities.
*   **Parameters:** `tag` (string or `nil`) — Tag to search for. If `nil`, no connections are made.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `tag` is `nil`.

### `Disconnect()`
*   **Description:** Terminates all current connections, removing bidirectional links and resetting internal state.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `AddNode(node)`
*   **Description:** Registers a new connection to the specified `node` entity. Must be called by both ends to establish a bidirectional link.
*   **Parameters:** `node` (entity instance) — The entity to connect to.
*   **Returns:** Nothing.
*   **Error states:** Silently ignores attempts to connect an already-connected node or if `nodes` table is `nil`.

### `RemoveNode(node)`
*   **Description:** Removes a connection to the specified `node` entity. Must be called by both ends to fully disconnect.
*   **Parameters:** `node` (entity instance) — The entity to disconnect from.
*   **Returns:** Nothing.
*   **Error states:** Silently ignores attempts to remove a non-connected node or if `nodes` table is `nil`.

### `ForEachNode(fn)`
*   **Description:** Iterates over all connected nodes, invoking `fn` for each.
*   **Parameters:** `fn` (function) — Callback called as `fn(self_inst, node_inst)` for each connection.
*   **Returns:** Nothing.

### `SetRange(range)`
*   **Description:** Updates the radius used in future `ConnectTo` calls.
*   **Parameters:** `range` (number) — New search radius.
*   **Returns:** Nothing.

### `SetFootprint(footprint)`
*   **Description:** Sets the footprint value used when `rangeincludesfootprint` is enabled.
*   **Parameters:** `footprint` (number) — Footprint size to subtract from effective range.
*   **Returns:** Nothing.

### `SetOnConnectFn(fn)`
*   **Description:** Assigns a callback executed when a node connects.
*   **Parameters:** `fn` (function or `nil`) — Signature: `function(self_inst, connected_node_inst)`.
*   **Returns:** Nothing.

### `SetOnDisconnectFn(fn)`
*   **Description:** Assigns a callback executed when a node disconnects.
*   **Parameters:** `fn` (function or `nil`) — Signature: `function(self_inst, disconnected_node_inst)`.
*   **Returns:** Nothing.

### `IsEnabled()`
*   **Description:** Reports whether the node is active (i.e., has initialized its `nodes` table).
*   **Parameters:** None.
*   **Returns:** `true` if `nodes` is non-`nil`, otherwise `false`.

### `IsConnected()`
*   **Description:** Reports whether the node has at least one active connection.
*   **Parameters:** None.
*   **Returns:** `true` if `numnodes > 0`, otherwise `false`.

### `NumConnectedNodes()`
*   **Description:** Returns the total number of active connections.
*   **Parameters:** None.
*   **Returns:** `numnodes` (number).

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified
