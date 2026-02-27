---
id: touchstonetracker
title: Touchstonetracker
description: Tracks which touchstones have been used by the player in the current and other shards.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: a63507ee
---

# Touchstonetracker

## Overview
This component maintains a record of used touchstones for the current shard (`self.used`) and persistently stores data for foreign shards (`self.used_foreign`) across save/load cycles. It listens for the `"usedtouchstone"` event to update its state and synchronizes this data with the player's classified data via `player_classified`.

## Dependencies & Tags
- **Component Dependency:** Relies on `inst.player_classified` (only if present) to propagate used touchstone IDs.
- **Event Listener:** Registers for the `"usedtouchstone"` event on its instance.
- **Tags:** None explicitly added or removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (assigned via constructor) | The entity this component belongs to. |
| `used` | `table (map)` | `{}` | Tracks used touchstone IDs for the current shard. Keys are integer IDs; values are `true`. |
| `used_foreign` | `table (map)` | `{}` | Stores used touchstone IDs from other shards (session-persistent). Keys are session identifiers; values are arrays of IDs. |

## Main Functions
### `OnUsedTouchStoneID(id)`
* **Description:** Marks a touchstone ID as used in the current shard, and optionally updates `player_classified` with the updated list. Does nothing if `id <= 0`.
* **Parameters:**
  * `id` (integer): The unique touchstone ID to mark as used.

### `IsUsed(touchstone)`
* **Description:** Returns whether the given touchstone entity has been used in the current shard.
* **Parameters:**
  * `touchstone` (Entity): A touchstone entity. Must implement `:GetTouchStoneID()`.

### `OnSave()`
* **Description:** Aggregates used touchstone IDs into a save data structure, distinguishing between the current shard and foreign shards. Required for world save persistence.
* **Parameters:** None.
* **Returns:** Table of the form `{ usedinsessions = { [session_id] = { id1, id2, ... }, ... } }`.

### `OnLoad(data)`
* **Description:** Restores used touchstone state from save data. Updates `self.used` for the current shard and `self.used_foreign` for other sessions.
* **Parameters:**
  * `data` (table?): Save data containing `usedinsessions`.

### `OnRemoveFromEntity()`
* **Description:** Cleans up on component removal: clears `player_classified` used list and unregisters the event listener.
* **Parameters:** None.

### `TransferComponent(newinst)`
* **Description:** Transfers all tracked used touchstone data (current + foreign) to a new component instance, typically used during entity re-spawning or world transfer.
* **Parameters:**
  * `newinst` (Entity): The destination entity with a `touchstonetracker` component.

### `GetDebugString()`
* **Description:** Returns a comma-separated string listing all used touchstone IDs in the current shard, for debugging purposes.
* **Parameters:** None.
* **Returns:** `string`

## Events & Listeners
- **Listens to:**
  - `"usedtouchstone"` → Calls `OnUsedTouchStone`, which in turn calls `OnUsedTouchStoneID`.
- **Triggers:**
  - Indirectly via `player_classified:SetUsedTouchStones(used)` when `used` list changes (no event itself).