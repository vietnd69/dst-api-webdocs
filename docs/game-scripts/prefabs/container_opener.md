---
id: container_opener
title: Container opener
description: Represents a lightweight, hidden entity that acts as a proxy reference link between a container and its opener, facilitating networked attachment and lifecycle synchronization.
tags: [network, container, lifecycle]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d6e1bfe0
system_scope: network
---

# Container opener

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `container_opener` prefab is a specialized, hidden entity used to maintain a persistent reference link between a container and the entity that opened it (e.g., a player). It is created automatically during container interaction and ensures proper attachment to the container's proxy or replica—enabling lifecycle synchronization (e.g., cleanup when the opener or parent container is removed) and networked state management.

It is *not* a functional component but a utility prefab attached to the container as `container_opener`, and only instantiated on the master simulation. The client-side copy uses a mirrored `OnEntityReplicated` hook to replicate the relationship.

## Usage example
```lua
-- The container opener is typically not manually created by modders.
-- It is implicitly managed by the container system, e.g., when a container is opened:
inst:PushEvent("open", { opener = player })
-- This triggers internal logic that spawns and attaches a container_opener.
```

## Dependencies & tags
**Components used:** `container_proxy`, `container` (via replica)
**Tags:** Adds `CLASSIFIED` tag; no dynamic tag changes.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_parent` | entity reference or `nil` | `nil` | Stores a reference to the container entity's parent (e.g., player) for cleanup callbacks. |
| `OnRemoveEntity` | function or `nil` | `nil` | Callback registered on `_parent`'s `onremove` event to clear the opener reference. |

## Main functions
### `OnEntityReplicated(inst)`
* **Description:** Client-side initialization hook. Executes when the entity is replicated from the server. Locates the parent entity, and attempts to attach the opener to the container’s replica or component proxy.
* **Parameters:** `inst` (entity) — the newly replicated `container_opener` instance.
* **Returns:** Nothing.
* **Error states:** If neither `replica.container` nor `components.container_proxy` is available on the parent, it falls back to storing a direct reference on `_parent.container_opener` and registers a local cleanup callback.

### `OnRemoveEntity(inst)`
* **Description:** Cleanup callback triggered when the `_parent` entity is removed. Ensures the opener reference in the parent is cleared to prevent stale pointers.
* **Parameters:** `inst` (entity) — the container_opener instance (the callback itself).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove` on `_parent` (via `inst:ListenForEvent`) — triggers `OnRemoveEntity` when the parent is destroyed.
- **Pushes:** None.

## Notes
- This prefab exists only to support the internal container system and is not intended for direct instantiation or manipulation by modders.
- The `CLASSIFIED` tag suppresses display in inventory and debug views.
- `inst.persists = false` ensures the opener is never saved to world data.