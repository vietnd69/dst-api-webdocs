---
id: container_proxy
title: Container Proxy
description: This component provides a proxy interface for an entity to act as a container, managing open/close states and delegating to a master container component.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: inventory
source_hash: f556982d
---

# Container Proxy

## Overview
The `ContainerProxy` component allows an entity to function as a visual or networked proxy for an actual container. It doesn't hold items itself but manages the client-side opening and closing animations, network synchronization, and delegates the core container logic (like item storage and transfer) to a designated "master" container component on another entity. This is often used for visually separate container representations that interact with a central inventory. It handles distinctions between master simulation (server) and client-only logic for opening states.

## Dependencies & Tags
This component explicitly interacts with the `container` component on its `master` entity and the `inventory` component on the `doer` (the entity opening the container).

## Properties
| Property          | Type      | Default Value | Description                                                                   |
| :---------------- | :-------- | :------------ | :---------------------------------------------------------------------------- |
| `inst`            | `Entity`  | `self`        | A reference to the parent entity this component is attached to.               |
| `ismastersim`     | `boolean` | `TheWorld.ismastersim` | Cached flag indicating if the component is running on the master simulation.  |
| `_cannotbeopened` | `net_bool`| `false`       | A networked boolean that, when true, prevents the container from being opened. |
| `master`          | `Entity`  | `nil`         | *(Server-only)* The actual container entity that this component proxies for. |
| `openlist`        | `table`   | `{}`          | *(Server-only)* A table mapping `doer` entities to their `container_opener` prefabs. |
| `opencount`       | `number`  | `0`           | *(Server-only)* The current number of players actively interacting with the container. |
| `onopenfn`        | `function`| `nil`         | *(Server-only)* A callback function executed when the container is opened for the first time by any player. |
| `onclosefn`       | `function`| `nil`         | *(Server-only)* A callback function executed when the container is fully closed by all players. |
| `_onmasteropenother` | `function` | `nil`      | *(Server-only)* Internal callback for `onopenother` event from the master. |
| `_onmasterclose` | `function` | `nil`      | *(Server-only)* Internal callback for `onclose` event from the master. |
| `container_opener`| `Entity`  | `nil`         | *(Client-only)* A reference to the visual `container_opener` prefab attached to the client's inventory. |

## Main Functions
### `OnRemoveEntity()`
* **Description:** Called when the entity this component is attached to is removed. On the master simulation, it ensures the container is closed for all users and detaches from any master container.
* **Parameters:** None.

### `SetCanBeOpened(canbeopened)`
* **Description:** Sets whether the proxy container can be opened by players. This state is synchronized over the network.
* **Parameters:**
    * `canbeopened`: (`boolean`) If `true`, the container can be opened; if `false`, it cannot.

### `CanBeOpened()`
* **Description:** Checks if the proxy container is currently set to be openable.
* **Parameters:** None.

### `IsOpenedBy(guy)`
* **Description:** Determines if a specific `guy` (player entity) currently has this container open. Handles both master and client simulation checks.
* **Parameters:**
    * `guy`: (`Entity`) The entity to check if it's currently opening this container.

### `AttachOpener(container_opener)`
* **Description:** *(Client-only)* Associates a visual `container_opener` prefab with this proxy on the client. This opener typically represents the client's connection to the proxy container.
* **Parameters:**
    * `container_opener`: (`Entity`) The `container_opener` prefab entity to attach.

### `GetMaster()`
* **Description:** *(Server-only)* Returns the entity that hosts the actual `container` component this proxy is managing.
* **Parameters:** None.

### `SetMaster(ent)`
* **Description:** *(Server-only)* Sets or clears the `master` entity for this proxy. When a new master is set, it subscribes to `onopenother` and `onclose` events from the master to properly manage its own proxy state.
* **Parameters:**
    * `ent`: (`Entity`) The entity to become the new master, or `nil` to clear the current master.

### `SetOnOpenFn(fn)`
* **Description:** *(Server-only)* Sets a callback function to be executed when the container is opened for the first time by any player.
* **Parameters:**
    * `fn`: (`function`) The function to call. It receives `self.inst` as its only argument.

### `SetOnCloseFn(fn)`
* **Description:** *(Server-only)* Sets a callback function to be executed when the container is fully closed by all players.
* **Parameters:**
    * `fn`: (`function`) The function to call. It receives `self.inst` as its only argument.

### `Open(doer)`
* **Description:** *(Server-only)* Initiates the process of opening the container for a specific `doer`. It delegates the actual container opening to the `master` container, spawns a `container_opener` prefab for the `doer`, updates internal tracking, and triggers the `onopenfn` if it's the first `doer`.
* **Parameters:**
    * `doer`: (`Entity`) The entity attempting to open the container.

### `Close(doer)`
* **Description:** *(Server-only)* Closes the container for a specific `doer`, or for all current `doer`s if `doer` is `nil`. This function primarily delegates the closing action to the `master` container component. The actual cleanup and state updates occur in `OnClose` after the master has processed the close.
* **Parameters:**
    * `doer`: (`Entity`, optional) The entity for whom to close the container. If `nil`, closes for all.

### `OnClose(doer)`
* **Description:** *(Server-only)* Handles the actual state changes and cleanup when the master container reports that a `doer` has closed the container. It removes the `container_opener` prefab, updates internal tracking, and triggers the `onclosefn` if all players have closed the container.
* **Parameters:**
    * `doer`: (`Entity`) The entity that has closed the container.

### `OnUpdate(dt)`
* **Description:** *(Server-only)* This function directly calls the `OnUpdate` method of the `master` entity's `container` component, passing its own instance (`self`) and the delta time. This allows the master container's update logic to run as if it were the proxy itself, provided it's designed to accept this.
* **Parameters:**
    * `dt`: (`number`) The delta time since the last update.

## Events & Listeners
*   **Listens For:**
    *   `onremove`: Listened for on the `container_opener` entity (client-only, in `AttachOpener`) to nullify the reference when the opener is removed.
    *   `onopenother`: Listened for on the `master` entity (server-only, in `SetMaster`) to receive notifications when the master container opens for another entity.
    *   `onclose`: Listened for on the `master` entity (server-only, in `SetMaster`) to receive notifications when the master container closes.
*   **Pushes/Triggers:**
    *   `onopenother`: Pushed to the `master` entity (server-only, in `Open`) when this proxy is opened by a `doer`. Data: `{ doer = doer, other = self.inst }`.
    *   `oncloseother`: Pushed to the `master` entity (server-only, in `OnClose`) when this proxy is closed by a `doer`. Data: `{ doer = doer, other = self.inst }`.