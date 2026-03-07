---
id: constructionsite_replica
title: Constructionsite Replica
description: Provides a network-replicated interface for client-side access to construction site state, mirroring server-side construction data.
tags: [network, crafting, entity]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 6ff83648
system_scope: network
---

# Constructionsite Replica

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`constructionsite_replica` is a client-side component that synchronizes and exposes key construction site state (such as enabled status, builder assignment, and slot counts) from the server. It works in conjunction with the server-side `constructionsite` component and maintains a lightweight `constructionsite_classified` entity for replicated data. This component ensures the client has read access to essential construction state without requiring direct server component access.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("constructionsite_replica")
inst.components.constructionsite_replica:SetEnabled(true)
inst.components.constructionsite_replica:SetBuilder(some_builder)
inst.components.constructionsite_replica:SetSlotCount(1, 3)
```

## Dependencies & tags
**Components used:** `constructionsite` (accessed via `inst.components.constructionsite` on the server), `classified` (via `constructionsite_classified` prefab)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_enabled` | `net_bool` | `net_bool(inst.GUID, "constructionsite._enabled")` | Networked boolean indicating if the construction site is enabled. |
| `classified` | `Entity?` | `nil` | Reference to the `constructionsite_classified` entity; exists only on client or if late-attached. |

## Main functions
### `OnRemoveEntity()`
* **Description:** Cleans up the `classified` entity on the server when the host entity is removed.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Only acts when `TheWorld.ismastersim` is true and `classified` is not `nil`.

### `AttachClassified(classified)`
* **Description:** Attaches an existing `constructionsite_classified` entity to this component and registers a listener so it detaches automatically if the classified entity is removed.
* **Parameters:** `classified` (Entity) — the classified entity to attach.
* **Returns:** Nothing.

### `DetachClassified()`
* **Description:** Detaches the current `classified` entity and clears associated listeners and references.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetEnabled(enabled)`
* **Description:** (Server-only) Sets whether the construction site is enabled by updating the networked `_enabled` boolean.
* **Parameters:** `enabled` (boolean) — new state of the construction site.
* **Returns:** Nothing.

### `SetBuilder(builder)`
* **Description:** (Server-only) Sets the builder of the construction site on the classified entity. If no `constructionsite` component is attached yet, asserts that `builder` is `nil`.
* **Parameters:** `builder` (Entity or `nil`) — the entity acting as builder; if `nil`, builder is cleared.
* **Returns:** Nothing.

### `SetSlotCount(slot, num)`
* **Description:** (Server-only) Updates the material count for a specific construction slot via the classified entity.
* **Parameters:**  
  - `slot` (string or number) — the slot identifier.  
  - `num` (number) — the number of materials required in that slot.
* **Returns:** Nothing.

### `IsEnabled()`
* **Description:** (Client or server) Returns whether the construction site is enabled.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if enabled, `false` otherwise.

### `IsBuilder(guy)`
* **Description:** (Client or server) Checks if the given entity is currently assigned as the builder.
* **Parameters:** `guy` (Entity or `nil`) — the entity to check.
* **Returns:** `boolean` — `true` if `guy` is the current builder, `false` otherwise.
* **Error states:** On client, if `constructionsite` component is not present, returns `true` only if `classified` exists and `guy == ThePlayer`.

### `GetSlotCount(slot)`
* **Description:** (Client or server) Returns the required material count for the specified slot.
* **Parameters:** `slot` (string or number) — the slot identifier.
* **Returns:** `number` — material count required for the slot; `0` if `classified` is `nil` on client.
* **Error states:** On client, returns `0` if `classified` is `nil`; on server, delegates to `constructionsite:GetSlotCount(slot)`.

### `GetIngredients()`
* **Description:** (Client or server) Returns the construction plan ingredients for the prefab.
* **Parameters:** None.
* **Returns:** `table` — the ingredients table from `CONSTRUCTION_PLANS[self.inst.prefab]`, or empty table if not found.

## Events & listeners
- **Listens to:** `onremove` — fired when the `classified` entity is removed; triggers `DetachClassified`.
- **Pushes:** None identified.
