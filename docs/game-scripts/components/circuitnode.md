---
id: circuitnode
title: Circuitnode
description: This component enables an entity to form and manage connections with other compatible entities within a specified range, facilitating networked behaviors.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# Circuitnode

## Overview
The `Circuitnode` component allows an entity to establish and maintain connections with other entities that also possess a `Circuitnode` component. It provides functionality to discover nearby connectable entities, manage a list of connected nodes, and trigger callbacks when connections are made or broken. This component is fundamental for creating systems that require networked interactions, such as power grids, logic circuits, or proximity-based activations, by defining a range, connection rules (e.g., across platforms), and custom connection/disconnection logic.

## Dependencies & Tags
This component implicitly depends on other entities having the `circuitnode` component attached for connections to be formed. No direct component additions or tag manipulations are performed by this script itself on its host entity.

## Properties
| Property | Type | Default Value | Description |
| :------- | :--- | :------------ | :---------- |
| `inst` | `Entity` | - | A reference to the entity this component is attached to. |
| `range` | `number` | `5` | The maximum distance within which this circuit node can connect to other circuit nodes. |
| `footprint` | `number` | `0` | An optional value representing the physical 'footprint' or size of the node, used to adjust connection range calculations. |
| `numnodes` | `number` | `0` | The current count of other circuit nodes connected to this instance. |
| `connectsacrossplatforms` | `boolean` | `true` | Determines if this node can connect to other nodes located on different platforms (e.g., land vs. ocean). |
| `rangeincludesfootprint` | `boolean` | `false` | If true, the `footprint` value of the target node is subtracted from the `range` when checking connection distance. |
| `nodes` | `table` | `nil` (initially) | A table used to store references to currently connected circuit nodes. Initialized to `{}` when the first connection is attempted. |
| `onconnectfn` | `function` | `nil` | A callback function that is invoked when this node successfully connects to another node. Arguments are `(self.inst, connected_node)`. |
| `ondisconnectfn` | `function` | `nil` | A callback function that is invoked when this node disconnects from another node. Arguments are `(self.inst, disconnected_node)`. |

## Main Functions
### `OnRemoveEntity()`
* **Description:** Clears the `ondisconnectfn` callback and initiates a full disconnection from all currently connected nodes when the entity is being removed.
* **Parameters:** None.

### `IsEnabled()`
* **Description:** Checks if the circuit node system is active, which is determined by whether the `nodes` table has been initialized (i.e., if `ConnectTo` has been called at least once or `AddNode` directly).
* **Parameters:** None.

### `IsConnected()`
* **Description:** Returns true if this circuit node is currently connected to one or more other circuit nodes.
* **Parameters:** None.

### `NumConnectedNodes()`
* **Description:** Returns the total number of circuit nodes currently connected to this instance.
* **Parameters:** None.

### `ConnectTo(tag)`
* **Description:** Scans the area around the entity within its `range` for other entities possessing a `circuitnode` component and the specified `tag`. It then attempts to establish a connection with all suitable entities found, respecting platform and footprint rules.
* **Parameters:**
    * `tag` (`string`): The tag required for a target entity to be considered for connection.

### `Disconnect()`
* **Description:** Disconnects this circuit node from all currently connected circuit nodes. It iterates through all connections and calls `RemoveNode` for each.
* **Parameters:** None.

### `SetRange(range)`
* **Description:** Sets the connection range for this circuit node.
* **Parameters:**
    * `range` (`number`): The new range value.

### `SetFootprint(footprint)`
* **Description:** Sets the footprint value for this circuit node, which can modify range calculations.
* **Parameters:**
    * `footprint` (`number`): The new footprint value.

### `SetOnConnectFn(fn)`
* **Description:** Assigns a callback function to be executed when this circuit node successfully connects to another node.
* **Parameters:**
    * `fn` (`function`): The function to call, which receives `(self.inst, connected_node)` as arguments.

### `SetOnDisconnectFn(fn)`
* **Description:** Assigns a callback function to be executed when this circuit node disconnects from another node.
* **Parameters:**
    * `fn` (`function`): The function to call, which receives `(self.inst, disconnected_node)` as arguments.

### `AddNode(node)`
* **Description:** Establishes a connection with a specific `node` entity. If the connection is new, it increments the connected node count, triggers the `onconnectfn` callback, and then tells the `node` to reciprocally connect to this instance.
* **Parameters:**
    * `node` (`Entity`): The entity (with a `circuitnode` component) to connect to.

### `RemoveNode(node)`
* **Description:** Removes an existing connection with a specific `node` entity. It decrements the connected node count, triggers the `ondisconnectfn` callback, and then tells the `node` to reciprocally disconnect from this instance.
* **Parameters:**
    * `node` (`Entity`): The entity to disconnect from.

### `ForEachNode(fn)`
* **Description:** Iterates over all currently connected circuit nodes and executes a provided function for each one.
* **Parameters:**
    * `fn` (`function`): The function to execute for each connected node, which receives `(self.inst, connected_node)` as arguments.