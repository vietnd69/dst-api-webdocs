---
id: touchstonetracker
title: Touchstonetracker
description: Tracks which touchstones have been used by the player and persists this data across sessions and shards.
tags: [touchstone, save, network, world]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: a63507ee
system_scope: world
---

# Touchstonetracker

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`TouchStoneTracker` maintains a record of touchstones used by the player entity within the current game shard, and preserves usage data from previous shards for cross-session continuity. It listens for `usedtouchstone` events, updates the networked `player_classified` component with the list of used touchstones, and handles saving/loading of usage data via session identifiers.

## Usage example
```lua
local inst = ThePlayer
inst:AddComponent("touchstonetracker")
-- Automatically activated by the game on player spawn.
-- When a touchstone is used, the game calls:
inst:PushEvent("usedtouchstone", { touchstone = some_touchstone_prefab })
-- Later, check if a touchstone was used:
if not inst.components.touchstonetracker:IsUsed(some_touchstone) then
    -- perform logic
end
```

## Dependencies & tags
**Components used:** `player_classified`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `used` | table | `{}` | A map of touchstone IDs (number) → `true` for touchstones used in the current session/shard. |
| `used_foreign` | table | `{}` | A map of session IDs (string) → array of touchstone IDs used in previous sessions. |

## Main functions
### `GetDebugString()`
*   **Description:** Returns a human-readable string listing all used touchstone IDs in the current session.
*   **Parameters:** None.
*   **Returns:** string — formatted as `"Used: id1, id2, id3"` where IDs are space-separated.
*   **Error states:** Returns empty string if no touchstones have been used.

### `IsUsed(touchstone)`
*   **Description:** Checks whether the given touchstone prefab has been used in the current session.
*   **Parameters:** `touchstone` (entity) — a touchstone entity with a `GetTouchStoneID()` method.
*   **Returns:** boolean — `true` if the touchstone's ID is in `self.used`, otherwise `false`.

### `OnSave()`
*   **Description:** Serializes the used touchstone data for persistence. Includes both current session data and foreign (previously saved) session data.
*   **Parameters:** None.
*   **Returns:** table — `{ usedinsessions = { [session_id] = {id1, id2, ...}, ... } }`.

### `OnLoad(data)`
*   **Description:** Loads previously saved touchstone usage data. Separates data by session ID: current session data populates `self.used`, while other sessions populate `self.used_foreign`.
*   **Parameters:** `data` (table or nil) — serialized data returned by `OnSave()`.
*   **Returns:** Nothing.
*   **Error states:** Silently ignores malformed or missing data (e.g., `data == nil` or `data.usedinsessions == nil`).

### `OnRemoveFromEntity()`
*   **Description:** Cleans up before component removal. Clears `player_classified`'s used touchstones and unregisters the `usedtouchstone` listener.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `TransferComponent(newinst)`
*   **Description:** Copies all used touchstone data (current and foreign) from this component instance to a new component on a different entity (e.g., during character transfer).
*   **Parameters:** `newinst` (entity) — the destination entity whose `touchstonetracker` component will receive the data.
*   **Returns:** Nothing.
*   **Error states:** Assumes `newinst.components.touchstonetracker` exists and is valid.

## Events & listeners
- **Listens to:** `usedtouchstone` — triggers `OnUsedTouchStone`, which in turn calls `OnUsedTouchStoneID` to record the touchstone as used.
- **Pushes:** None.
