---
id: teleporter
title: Teleporter
description: Manages inter- and intra-world teleportation of entities, including followers and items, with support for migration, camera transitions, and walkable offset alignment.
tags: [teleport, world, entity, migration]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 486b596e
system_scope: world
---

# Teleporter

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `teleporter` component enables teleportation of entities between locations (local or across worlds) and handles associated logic such as follower synchronization, item handling, camera transitions, and walkable offset alignment. It is typically added to portal-like prefabs (e.g., Teleporters, Wormholes) and coordinates with `leader`, `inventory`, `container`, `locomotor`, `amphibiouscreature`, `drownable`, `follower`, and `inventoryitem` components to ensure safe and consistent teleportation of dependents.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("teleporter")
inst.components.teleporter:Target(other_teleporter_entity)
inst.components.teleporter:SetEnabled(true)

-- Trigger teleport for a player
inst.components.teleporter:Activate(player_entity)

-- Or trigger a migration
inst.components.teleporter:MigrationTarget("caves", 100, 5, -200)
inst.components.teleporter:Activate(player_entity)
```

## Dependencies & tags
**Components used:** `locomotor`, `amphibiouscreature`, `drownable`, `leader`, `inventory`, `container`, `inventoryitem`, `follower`
**Tags:** Adds `teleporter` when active; removes it on deactivation or removal from entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `targetTeleporter` | `Entity?` | `nil` | Reference to the destination teleporter entity. Also used for local teleportation. |
| `targetTeleporterTemporary` | `Entity?` | `nil` | Temporary override for the destination teleporter (used in one-way exits). |
| `migration_data` | `{worldid: string, x: number, y: number, z: number}?` | `nil` | Data for cross-world migration; if present, overrides local teleport. |
| `enabled` | boolean | `true` | Whether teleportation is enabled. Affects `IsActive()` result. |
| `selfmanaged` | boolean? | `nil` | If set, the same teleporter instance handles both sending and receiving (e.g., for circular loops). |
| `offset` | number | `2` | Desired minimum offset from teleporter center where entities land. |
| `numteleporting` | number | `0` | Count of entities currently teleporting (including items and followers). |
| `teleportees` | `table<Entity: true>` | `{}` | Set of entities registered for teleportation. |
| `travelcameratime` | number | `3` | Seconds to wait before fading camera in for players. |
| `travelarrivetime` | number | `4` | Seconds to wait before completing teleport for players. |
| `saveenabled` | boolean | `true` | Whether to save the targetTeleporter and migration_data on save. |
| `items` | `table<Entity: true>` | `{}` | Set of items currently in-flight during teleport. |

## Main functions
### `IsActive()`
* **Description:** Checks if the teleporter is ready to teleport (enabled and has a valid target, temporary target, or migration data).
* **Parameters:** None.
* **Returns:** `boolean` — `true` if teleportation can be initiated.
* **Error states:** None.

### `IsBusy()`
* **Description:** Checks if the teleporter is currently handling any teleporting entities.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `numteleporting > 0` or `teleportees` is non-empty.

### `IsTargetBusy()`
* **Description:** Checks if the destination teleporter (if present) is currently busy.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `targetTeleporter` exists and its `teleporter` component reports `IsBusy()` as `true`.

### `RegisterTeleportee(doer)`
* **Description:** Registers an entity to be teleported next time `Activate()` is called. Prevents the entity from being removed prematurely.
* **Parameters:** `doer` (`Entity`) — The entity to register.
* **Returns:** Nothing.
* **Error states:** Registers each entity only once; duplicates are ignored.

### `UnregisterTeleportee(doer)`
* **Description:** Removes a registered teleportee. Used internally via `onremove` event listener.
* **Parameters:** `doer` (`Entity`) — The entity to unregister.
* **Returns:** Nothing.

### `UseTemporaryExit(doer, temporaryexit)`
* **Description:** Activates a one-way exit (e.g., for a exit portal). Temporarily sets `targetTeleporterTemporary` and applies reduced `travelarrivetime`.
* **Parameters:**  
  `doer` (`Entity`) — The entity initiating teleport.  
  `temporaryexit` (`Entity`) — The exit destination (usually the same as `inst` for one-way exits).  
* **Returns:** `boolean` — Result of `Activate(doer)`.
* **Error states:** None.

### `Activate(doer)`
* **Description:** Initiates teleportation for the calling entity and its followers or inventory items. Handles migration if `migration_data` is set.
* **Parameters:** `doer` (`Entity`) — The primary entity initiating teleport.
* **Returns:** `boolean` — `true` if teleport succeeded, `false` if `IsActive()` is `false` or migration target world is unavailable.
* **Error states:** Returns `false` if `migration_data.worldid` is invalid or unreachable.

### `Teleport(obj)`
* **Description:** Moves a single entity to the target teleporter’s position, applying walkable/swimmable offset. Enforces terrain restrictions (ocean vs land).
* **Parameters:** `obj` (`Entity`) — Entity to teleport.
* **Returns:** Nothing.
* **Error states:** No-op if `targetTeleporter` is `nil`; returns early if terrain incompatibility (e.g., land entity to ocean) is detected.

### `ReceivePlayer(doer, source, skiptime)`
* **Description:** Handles the arrival phase for a player, scheduling camera fades and state transitions.
* **Parameters:**  
  `doer` (`Entity`) — The player entity.  
  `source` (`Entity?`) — Source teleporter (optional).  
  `skiptime` (`number?`) — Time reduction for camera/arrival phases (clamped).  
* **Returns:** Nothing.
* **Error states:** If `skiptime` is `nil`, no camera fade is scheduled.

### `ReceiveItem(item, source)`
* **Description:** Handles arrival of a teleporting item (e.g., Chest’s Eyebone). Applies physics and visual effects.
* **Parameters:**  
  `item` (`Entity`) — The item entity.  
  `source` (`Entity?`) — Source teleporter (optional).  
* **Returns:** Nothing.

### `Target(otherTeleporter)`
* **Description:** Sets the destination teleporter entity.
* **Parameters:** `otherTeleporter` (`Entity?`) — The teleporter to link to; `nil` clears it.
* **Returns:** Nothing.

### `MigrationTarget(worldid, x, y, z)`
* **Description:** Sets migration data for cross-world teleportation.
* **Parameters:**  
  `worldid` (`string?`) — Target world ID (e.g., `"caves"`); `nil` clears it.  
  `x, y, z` (`number`) — Destination coordinates in the target world.  
* **Returns:** Nothing.

### `GetTarget()`
* **Description:** Returns the currently set destination teleporter.
* **Parameters:** None.
* **Returns:** `Entity?` — The `targetTeleporter` or `nil`.

### `SetEnabled(enabled)`
* **Description:** Enables or disables teleportation.
* **Parameters:** `enabled` (`boolean`) — New enabled state.
* **Returns:** Nothing.

### `GetEnabled()`
* **Description:** Returns whether teleportation is enabled.
* **Parameters:** None.
* **Returns:** `boolean`.

### `OnSave()`
* **Description:** Serializes teleporter state for persistence.
* **Parameters:** None.
* **Returns:**  
  `data` (`table`) — Saved data (`target`, `migration_data`, `items`).  
  `references` (`table<string>`) — List of referenced entity GUIDs for post-pass resolution.

### `OnLoad(data, newents)`
* **Description:** Loads saved items into the teleporter during entity load.
* **Parameters:**  
  `data` (`table`) — Saved data.  
  `newents` (`table<GUID: Entity>`) — Mapped entity instances.  
* **Returns:** Nothing.

### `LoadPostPass(newents, savedata)`
* **Description:** Resolves the destination teleporter reference after `newents` is fully populated.
* **Parameters:**  
  `newents` (`table<GUID: Entity>`) — Mapped entity instances.  
  `savedata` (`table?`) — Raw savedata (contains `target` GUID).  
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a debug-friendly status string.
* **Parameters:** None.
* **Returns:** `string` — e.g., `"Enabled: T Target: 12345"`.

## Events & listeners
- **Listens to:**  
  - `onremove` on teleportee entities (via `inst:ListenForEvent`) to unregister them automatically.  
- **Pushes:**  
  - `doneteleporting` — fired when an entity or item completes teleport. Includes the entity as event data.  
  - Also fires `ms_playerdespawnandmigrate` via `TheWorld` when migration is triggered.  
- **Callback hooks (via fields):**  
  - `self.onActivate` — called during `Activate()` (first); signature: `(teleporter_inst, doer, migration_data)`.  
  - `self.onActivateByOther` — called during `ReceivePlayer()` / `ReceiveItem()`; signature: `(teleporter_inst, source, doer/item)`.  
  - `self.OnDoneTeleporting` — optional hook after `doneteleporting` is pushed; signature: `(teleporter_inst, obj)`.
