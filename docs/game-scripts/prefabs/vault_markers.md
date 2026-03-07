---
id: vault_markers
title: Vault Markers
description: Registers and manages server-side-only entity markers for vault world generation and navigation logic.
tags: [world, vault, spawn, navigation]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 508b75a7
system_scope: world
---

# Vault Markers

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`vault_markers` defines several prefabs that act as server-side-only positional markers used during world generation and runtime to identify specific zones in the Vault (e.g., center, corridor exits, lobby connections). These markers are exclusively created on the master simulation and registered/unregistered via world-level events. They do not exist or function on clients and are tied to the `vault_floor_helper` component for validation and conflict resolution.

## Usage example
```lua
-- Typically instantiated automatically by the worldgen system.
-- Example usage in a mod to reference a marker:
local marker = MakeEntity("vaultmarker_vault_center")
marker.Transform:SetPosition(x, y, z)
-- Marker will auto-register with vault_floor_helper on server
```

## Dependencies & tags
**Components used:** None directly — the component `vaultroom` is conditionally added to `vaultmarker_vault_center` only.  
**Tags:** Adds `CLASSIFIED` (internal use only), non-networked.  
**Connected functions:** Uses `vault_floor_helper:TryToSetMarker(inst)` (from `vault_floor_helper.lua`).

## Properties
No public properties.

## Main functions
### `UpdateNetvars(inst)`
*   **Description:** Validates and registers the marker with the `vault_floor_helper` component on the world entity, resolving potential conflicts by removing duplicate or conflicting markers. Retries automatically until `vault_floor_helper` becomes available.
*   **Parameters:** `inst` (entity) — the marker entity instance.
*   **Returns:** Nothing.
*   **Error states:** If `vault_floor_helper` is not yet present, reschedules itself for immediate execution.

### `OnAdd(inst)`
*   **Description:** Initialization callback run after the entity is fully added. Ensures the entity only exists on the master simulation and registers it with the world via the `ms_register_vault_marker` event.
*   **Parameters:** `inst` (entity) — the marker instance.
*   **Returns:** Nothing.
*   **Error states:** Immediately removes the entity if created on a client (non-master-sim). Calls `UpdateNetvars` only for `vaultmarker_vault_center`.

### `OnLoad(inst)`
*   **Description:** Ensures deferred initialization is executed upon restore from save, canceling any pending task and re-running `OnAdd`.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `OnRemove(inst)`
*   **Description:** Cleanup callback executed when the marker is removed. Unregisters the marker via the `ms_unregister_vault_marker` event.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove` — triggers `OnRemove`.
- **Pushes:** `ms_register_vault_marker(inst)` — fires on master simulation after successful registration.  
- **Pushes:** `ms_unregister_vault_marker(inst)` — fires on master simulation when the marker is removed.