---
id: balloon_held_child
title: Balloon Held Child
description: Manages network synchronization and client-side animation of a held balloon prop attached to an entity.
tags: [network, animation, prop, server, client]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0628e7d7
system_scope: network
---

# Balloon Held Child

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`balloon_held_child` is a networked prefab component used to represent a held balloon attached to an entity (e.g., a child character or proxy). It synchronizes balloon appearance (color, symbol overrides) and runtime state (e.g., deflation event) from the master simulation to clients. It spawns a `balloon_held_child_client` instance for animation and visual rendering on the client, and handles updates via net variables and events.

The component is tied to `fueled` components via event listening to trigger deflation behavior. It does not contain gameplay logic itself but serves as a view/proxy layer for balloon state.

## Usage example
```lua
-- Server-side setup (e.g., when equipping a balloon item):
inst:AddComponent("balloon_held_child")
inst.components.balloon_held_child:SetupFromBaseItem(baseitem, owner, false, colour_idx)

-- The component automatically creates a client-side counterpart and begins syncing.
```

## Dependencies & tags
**Components used:** `fueled` (only via event listening; not added or required directly), `network`, `transform`, `animstate`, `soundemitter`  
**Tags:** Adds `DECOR` on the master prefab, `FX` on the client prefab.

## Properties
No public properties. State is managed via internal net variables (`_colour_idx`, `_swap_build`, `_swap_sym`, `_deflate_event`) and `_isrunning`.

## Main functions
### `SetupFromBaseItem(baseitem, owner, picked_up_from_ground, colour_idx)`
* **Description:** Configures this instance to match a source balloon item. Sets parent entity, synchronizes color and symbol overrides via net variables, and registers a listener to update overrides and trigger deflation when the base item’s fuel section changes.
* **Parameters:**  
  `baseitem` (Entity) – the original balloon item prefab instance.  
  `owner` (Entity) – the entity that will hold this balloon.  
  `picked_up_from_ground` (boolean) – unused in implementation.  
  `colour_idx` (number?, optional) – color index override (defaults to `0`).  
* **Returns:** Nothing.
* **Error states:** None identified.

### `SpawnClientObject(inst)`
* **Description:** Internal constructor helper that spawns the `balloon_held_child_client` prefab, attaches it as a child of the owner, and configures animation overrides and sync tasks. Called automatically on non-dedicated clients during prefab initialization.
* **Parameters:** `inst` (Entity) – the master instance.  
* **Returns:** Nothing. Assigns `inst.client_obj`.
* **Error states:** No-op if `owner` is `nil`.

## Events & listeners
- **Listens to:**  
  - `onfueldsectionchanged` (on `baseitem` when `fueled` is present) – triggers deflation on client and updates override symbols.  
  - `onremove` (on `inst`) – destroys the client object.  
  - `ballon_held_child.deflateevent` (on client only) – triggers `"deflate"` state in the state graph.
- **Pushes:**  
  - `sg_update_running_state` – fired when the running state of the owner changes (detected via `moving` state tag or tag).  
  - `ballon_held_child.deflateevent` (networked via `_deflate_event`) – signals client to deflate.