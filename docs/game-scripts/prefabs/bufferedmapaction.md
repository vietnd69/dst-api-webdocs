---
id: bufferedmapaction
title: Bufferedmapaction
description: Classified prefab entity that handles map-based action targeting, synchronizing action requests between client and server via netvars and triggering the player controller's map screen.
tags: [prefab, map, action, network]
sidebar_position: 10

last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: aa400f5f
system_scope: entity
---

# Bufferedmapaction

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`bufferedmapaction.lua` registers a classified prefab entity used for map-based action targeting. The prefab creates a networked entity that attaches to a target entity and synchronizes action requests between client and server. On the client, it listens for action dirty events and triggers `playercontroller:PullUpMap()` to open the map screen. On the server, it stores the doer reference and handles action setup. The prefab is referenced by its name `"bufferedmapaction"` and is typically instantiated internally by the action system rather than directly spawned by mods.

## Usage example
```lua
-- This prefab is typically created internally by the action system.
-- Direct spawn example for debugging:
local inst = SpawnPrefab("bufferedmapaction")
inst.Transform:SetPosition(0, 0, 0)

-- Server-side setup (master only):
if TheWorld.ismastersim and inst.SetupMapAction then
    local target = SomeEntity
    local action = ACTIONS.EXPLORE
    local doer = ThePlayer
    inst.SetupMapAction(action, target, doer)
end

-- Client-side action retrieval:
if not TheWorld.ismastersim and inst.GetAction then
    local action = inst.GetAction()
end
```

## Dependencies & tags
**External dependencies:**
- `ACTIONS_BY_ACTION_CODE` -- global table mapping action codes to action definitions
- `RPC.DoActionOnMap` -- RPC handler for canceling map targets on server
- `ThePlayer` -- local player entity reference for client-side map triggering
- `TheWorld` -- world entity for mastersim check and network replication

**Components used:**
- `playercontroller` -- accessed via `player.components.playercontroller:PullUpMap()` to open map screen

**Tags:**
- `CLASSIFIED` -- added in fn(); marks entity as hidden from normal entity queries

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `action` | net_ushortint | --- | Stores the action code. Dirty event: `actiondirty`. Synced from server to client. |
| `assets` | table | `nil` | Assets array passed to Prefab() — empty in this file. |
| `prefabs` | table | `nil` | Dependent prefabs array — empty in this file. |

## Main functions
### `fn()`
* **Description:** Prefab constructor. Creates the entity, adds transform and network components, declares the `action` netvar, and assigns function references. Splits initialization based on `TheWorld.ismastersim`: client receives event listeners and read-only accessors; server receives setup functions and doer validation. Returns `inst` for the prefab system.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** None — runs on every host (client and server) with appropriate branching.

### `CreateIcon(target, icondata)` (local)
* **Description:** Creates a classified mini-map icon entity parented to the target. Sets the icon image, priority, and display properties (draws over fog of war, no cache). Used when the action dirty event fires on the client to visualize the map target.
* **Parameters:**
  - `target` -- entity to parent the icon to
  - `icondata` -- table containing `icon`, `selectedicon`, `priority`, `selectedpriority` fields
* **Returns:** created icon entity instance
* **Error states:** Errors if `target` or `icondata` is nil (no guard present in source).

### `OnActionDirty(inst)` (local)
* **Description:** Client-only callback triggered when the `action` netvar changes. Retrieves the local player, gets the parent target entity, creates a map icon if icondata exists, and calls `playercontroller:PullUpMap()` to open the map screen focused on the target.
* **Parameters:** `inst` -- bufferedmapaction entity instance
* **Returns:** None
* **Error states:** Errors if `inst.entity:GetParent()` returns nil (no guard before accessing target.bufferedmapaction_icondata). `ThePlayer` and `playercontroller` are guarded.

### `OnEntityReplicated(inst)` (local)
* **Description:** Client-only callback when the entity is replicated from server. Sets the parent entity's `bufferedmapaction` reference to this instance and registers a listener for `cancelmaptarget` events that sends an RPC to the server to cancel the map target.
* **Parameters:** `inst` -- bufferedmapaction entity instance
* **Returns:** None
* **Error states:** None — guards against nil parent before accessing parent.bufferedmapaction.

### `OnRemoveEntity(inst)` (local)
* **Description:** Cleanup callback when the entity is removed. Clears the parent entity's `bufferedmapaction` reference if it points to this instance, preventing dangling references.
* **Parameters:** `inst` -- bufferedmapaction entity instance
* **Returns:** None
* **Error states:** None — guards against nil parent and mismatched reference.

### `GetAction(inst)` (local)
* **Description:** Returns the action definition from `ACTIONS_BY_ACTION_CODE` using the stored action code value. Used on client to read the current action type.
* **Parameters:** `inst` -- bufferedmapaction entity instance
* **Returns:** Action definition table or `nil` if action code is invalid.
* **Error states:** None — returns nil if action code is not in `ACTIONS_BY_ACTION_CODE` table (expected behavior, not a crash).

### `IsDoer_Client(inst, doer)` (local)
* **Description:** Client-side doer validation. Returns true if the provided `doer` matches `ThePlayer`. Used to verify action ownership on the client.
* **Parameters:**
  - `inst` -- bufferedmapaction entity instance
  - `doer` -- entity to check
* **Returns:** `true` if doer is the local player, `false` otherwise.
* **Error states:** None — handles nil doer gracefully.

### `IsDoer_Server(inst, doer)` (local)
* **Description:** Server-side doer validation. Returns true if the provided `doer` matches the stored `inst.doer` reference. Used to verify action ownership on the server.
* **Parameters:**
  - `inst` -- bufferedmapaction entity instance
  - `doer` -- entity to check
* **Returns:** `true` if doer matches stored doer, `false` otherwise.
* **Error states:** None — handles nil doer gracefully.

### `SetupMapAction(inst, action, target, doer)` (local)
* **Description:** Server-only setup function. Stores the action code in the netvar, sets the parent entity reference, stores the doer, and registers a `cancelmaptarget` listener that removes this entity if the matching doer cancels. Calls `OnActionDirty` immediately if the doer has a HUD (triggers map open on client).
* **Parameters:**
  - `inst` -- bufferedmapaction entity instance
  - `action` -- action definition table with `code` field
  - `target` -- entity to attach the action to
  - `doer` -- player entity initiating the action
* **Returns:** None
* **Error states:** Errors if `action`, `target`, or `doer` is nil (no guards present in source). Also errors on `doer.HUD` access if doer is nil (no guard before this check).

## Events & listeners
**Listens to:**
- `actiondirty` (client only) -- triggers `OnActionDirty`; fires when the `action` netvar changes value. Opens the map screen for the local player.
- `cancelmaptarget` (client and server) -- triggers removal of this entity when the matching doer cancels the map target. Client variant sends `SendRPCToServer(RPC.DoActionOnMap, nil, nil, nil, target)` to cancel on server. Server variant removes this entity directly via `inst:Remove()` when matching doer cancels.

**World state watchers:**
None identified.

**Pushes:**
None identified — this prefab does not fire events on its entity.