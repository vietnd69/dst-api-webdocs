---
id: teleporter
title: Teleporter
description: This component enables teleportation between paired destinations, supports migration between worlds, and manages teleporting players, items, and followers.

sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 486b596e
---

# Teleporter

## Overview
The `Teleporter` component is a core system in the Entity Component System that handles teleportation logic for entities such as players, items, and followers. It coordinates pairing with a target teleporter, manages entry/exit timing, ensures safe placement (including walkable terrain checks), and supports cross-world migration via `migration_data`. It also tracks active teleportees and saves/loads state to ensure items in transit persist correctly.

## Dependencies & Tags
- Adds/removes the `"teleporter"` tag from the entity based on whether the teleporter is active (`IsActive()`).
- Relies on components: `Transform`, `Physics` (for teleportation), `locomotor`, `amphibiouscreature`, `drownable`, `inventoryitem`, `leader`, `follower`, `container`.
- Internal event listeners: `"onremove"` (on teleportees being removed).
- Uses `TheWorld.Map`, `TheShard`, `Shard_IsWorldAvailable` for world and terrain checks.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `targetTeleporter` | `Entity?` | `nil` | The target teleporter entity to teleport *to* (persistent across saves). |
| `targetTeleporterTemporary` | `Entity?` | `nil` | Temporary override target (used for immediate/exact entry teleportation). |
| `migration_data` | `{ worldid: string, x: number, y: number, z: number }?` | `nil` | World migration coordinates (non-nil indicates cross-world teleport). |
| `enabled` | `boolean` | `true` | Whether teleporting is currently enabled. |
| `offset` | `number` | `2` | Radial buffer radius used to find safe landing spots around the target position. |
| `numteleporting` | `number` | `0` | Count of entities currently teleporting through this teleporter (player or item). |
| `teleportees` | `table<Entity: true>` | `{}` | List of entities registered as teleportees (used for cleanup on removal). |
| `items` | `table<Entity: true>` | `{}` | Items currently in transit (tracked during teleport). |
| `saveenabled` | `boolean` | `true` | Whether to save `targetTeleporter` and `migration_data` on world save. |
| `selfmanaged` | `boolean?` | `nil` | If set, the same teleporter instance acts as both sender and receiver. |
| `travelcameratime` | `number` | `3` | Time (in seconds) before camera fade completes. |
| `travelarrivetime` | `number` | `4` | Total time (in seconds) for teleport completion sequence. |
| `onActivate` | `function(inst, doer, migration_data)?` | `nil` | Callback invoked when teleportation is initiated. |
| `onActivateByOther` | `function(inst, source, entity)?` | `nil` | Callback invoked when receiving a teleporting player or item. |

## Main Functions

### `SetActiveTag()`
* **Description:** Internal helper `onavailable` function that adds or removes the `"teleporter"` tag based on whether `IsActive()` is true.
* **Parameters:** Not directly called by user code; used as a callback in the metatable for property changes (`targetTeleporter`, `migration_data`, `enabled`).

### `IsActive()`
* **Description:** Returns `true` if the teleporter is enabled and has a valid destination (temporary, persistent, or migration data).
* **Parameters:** None.

### `IsBusy()`
* **Description:** Returns `true` if any entity is currently teleporting through this teleporter (either as sender or receiver).
* **Parameters:** None.

### `IsTargetBusy()`
* **Description:** Returns `true` if the *target* teleporter is currently busy teleporting another entity.
* **Parameters:** None.

### `RegisterTeleportee(doer)`
* **Description:** Registers an entity as a teleportee, and sets up an `"onremove"` event listener to automatically unregister if the entity is removed before teleport completes.
* **Parameters:**
  * `doer` (Entity): The entity that will be teleporting (e.g., player, item, follower).

### `UnregisterTeleportee(doer)`
* **Description:** Removes an entity from the `teleportees` list and cancels the associated `"onremove"` listener.
* **Parameters:**
  * `doer` (Entity): The entity to unregister.

### `UseTemporaryExit(doer, temporaryexit)`
* **Description:** Sets a temporary teleport destination and initiates teleportation (e.g., for instant exits like Chester’s Eyebone), adjusting timing for short journeys.
* **Parameters:**
  * `doer` (Entity): The entity initiating teleportation.
  * `temporaryexit` (Entity): The teleporter to use as an immediate destination.

### `Activate(doer)`
* **Description:** Initiates teleportation for the given entity (and its followers), handling world migration if `migration_data` is set. Triggers callbacks, teleports the entity and followers, and sends events to the target teleporter.
* **Parameters:**
  * `doer` (Entity): The primary entity to teleport (e.g., player).

### `Teleport(obj)`
* **Description:** Performs the actual location change for an entity, computing a safe offset and terrain type (land/water) before teleporting via `Physics:Teleport()` or `Transform:SetPosition()`.
* **Parameters:**
  * `obj` (Entity): The entity to teleport.

### `ReceiveItem(item, source)`
* **Description:** Handles arrival of a teleporting item at the destination teleporter. Adds the item to the local scene, delays its re-appearance, and triggers physical "pop-in" effects.
* **Parameters:**
  * `item` (Entity): The teleporting item.
  * `source` (Entity): The teleporter where the item originated.

### `ReceivePlayer(doer, source, skiptime)`
* **Description:** Handles arrival of a teleporting player at the destination teleporter. Manages camera fades and state transitions based on timing and `"teleportarrivestate"`.
* **Parameters:**
  * `doer` (Entity): The teleporting player.
  * `source` (Entity): The source teleporter.
  * `skiptime` (number?): Optional time to reduce delay (e.g., for fast exits).

### `Target(otherTeleporter)`
* **Description:** Sets the persistent target teleporter for this teleporter (used for long-term pairing).
* **Parameters:**
  * `otherTeleporter` (Entity): The destination teleporter entity.

### `MigrationTarget(worldid, x, y, z)`
* **Description:** Sets or clears migration data to enable teleportation to another world (and location).
* **Parameters:**
  * `worldid` (string?): The target world ID (`nil` clears it).
  * `x`, `y`, `z` (number): Destination coordinates in the target world.

### `GetTarget()`
* **Description:** Returns the currently set persistent target teleporter.
* **Parameters:** None.

### `SetEnabled(enabled)`
* **Description:** Enables or disables teleporting functionality.
* **Parameters:**
  * `enabled` (boolean): Whether the teleporter should be enabled.

### `GetEnabled()`
* **Description:** Returns whether teleporting is currently enabled.
* **Parameters:** None.

### `OnSave()`
* **Description:** Prepares save data, including target teleporter GUID, migration data, and items in transit.
* **Parameters:** None.
* **Returns:** `{ data: table, references: table<string> }` — Save record and referenced entity GUIDs.

### `OnLoad(data, newents)`
* **Description:** Loads items that were teleporting when the world saved, placing them back in transit at the destination.
* **Parameters:**
  * `data` (table): Saved data from `OnSave()`.
  * `newents` `(table<string, Entity>)`: Map of saved GUIDs to current entities.

### `LoadPostPass(newents, savedata)`
* **Description:** Resolves the saved `targetTeleporter` GUID to an entity after load and linking is complete.
* **Parameters:**
  * `newents` `(table<string, Entity>)`: Map of GUIDs to loaded entities.
  * `savedata` (table): The full world save data (includes `target` field).

### `GetDebugString()`
* **Description:** Returns a human-readable debug string for logging or editor UI.
* **Parameters:** None.
* **Returns:** `string`: e.g., `"Enabled: T Target: Entity(12345)"`.

### `PushDoneTeleporting(obj)`
* **Description:** Fires the `"doneteleporting"` event and optional `OnDoneTeleporting` callback for a completed teleportation.
* **Parameters:**
  * `obj` (Entity): The entity that finished teleporting.

## Events & Listeners
- **Listens:**
  - `"onremove"` on each registered teleportee entity (cleans up `teleportees` table).
- **Triggers:**
  - `"doneteleporting"` event on the teleporter entity with the object (player or item) as payload.
  - `"ms_playerdespawnandmigrate"` event via `TheWorld` when migrating across worlds.