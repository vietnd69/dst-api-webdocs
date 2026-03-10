---
id: entityreplica
title: Entityreplica
description: Extends EntityScript to support networked replication of specific components between server and clients.
tags: [network, replication, component]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 0f20c19e
system_scope: network
---

# Entityreplica

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`Entityreplica` is a core system extension for `EntityScript` that enables automatic network synchronization of designated components between the server and clients. It defines which components are eligible for replication (via `REPLICATABLE_COMPONENTS`) and manages the creation and lifecycle of their corresponding replica classes on clients (e.g., `health_replica`, `inventory_replica`). This is essential for multiplayer consistency—ensuring that remote clients have a shadow version of critical server-side components.

## Usage example
```lua
-- In a mod or prefab definition, register a custom replicable component:
AddReplicableComponent("my_custom_component")

-- The game will then automatically attempt to replicate "my_custom_component"
-- on entities that have the `_my_custom_component` tag (server) or `__my_custom_component` tag (client).
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `_name` and removes `__name` (server); adds `__name` (client); checks `_name` and `__name` for replication state.

## Properties
No public properties.

## Main functions
### `ValidateReplicaComponent(name, cmp)`
*   **Description:** Validates whether a component should be replicated by checking for the presence of the `_name` tag.  
*   **Parameters:**  
    - `name` (string) — the component name to validate.  
    - `cmp` (table) — the component instance.  
*   **Returns:** `cmp` if the `_name` tag exists; otherwise `nil`.

### `ReplicateComponent(name)`
*   **Description:** Creates and attaches the replica version of a component on clients (or marks it for replication on server).  
*   **Parameters:**  
    - `name` (string) — the name of the component to replicate (must be in `REPLICATABLE_COMPONENTS`).  
*   **Returns:** Nothing.  
*   **Error states:**  
    - Silently returns if `name` is not in `REPLICATABLE_COMPONENTS`.  
    - Asserts and crashes if the corresponding `name_replica.lua` file is missing or does not define a valid class.  
    - Prints a warning if the replica component already exists.

### `UnreplicateComponent(name)`
*   **Description:** Removes a component from replication (server-side only). Marks it for future removal on clients by toggling tags.  
*   **Parameters:**  
    - `name` (string) — the component name to un-replicate.  
*   **Returns:** Nothing.  
*   **Error states:** No-op on clients; only has effect on the master simulation (`TheWorld.ismastersim`).

### `PrereplicateComponent(name)`
*   **Description:** Performs both `ReplicateComponent` and `UnreplicateComponent` in sequence—used during initialization to ensure a clean replica state.  
*   **Parameters:**  
    - `name` (string) — the component name to (re)prime for replication.  
*   **Returns:** Nothing.

### `ReplicateEntity()`
*   **Description:** Triggers on clients after entity deserialization to rebuild replica components based on tags. Called automatically during entity construction.  
*   **Parameters:** None.  
*   **Returns:** Nothing.  
*   **Error states:** If `OnEntityReplicated` is defined on the entity, it will be called after all eligible components are replicated.

### `TryAttachClassifiedToReplicaComponent(classified, name)`
*   **Description:** Attaches classified data (e.g., extra context like item inventory or quest data) to an existing replica component.  
*   **Parameters:**  
    - `classified` (table) — data object to attach (signature depends on the replica component’s `AttachClassified` method).  
    - `name` (string) — the replica component name.  
*   **Returns:** `true` if the replica component exists and accepted the classified data; otherwise `false`.

### `AddReplicableComponent(name)`
*   **Description:** Exposed to mods for registering custom components as replicable.  
*   **Parameters:**  
    - `name` (string) — the component name to add to `REPLICATABLE_COMPONENTS`.  
*   **Returns:** Nothing.

## Events & listeners
None identified.