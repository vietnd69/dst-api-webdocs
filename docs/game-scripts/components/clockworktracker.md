---
id: clockworktracker
title: Clockworktracker
description: Tracks and manages clockwork chess piece followers (rooks, knights, bishops) attached to an entity, enforcing type-specific follower limits.
tags: [chess, follower, limit]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: components
source_hash: c7421089
system_scope: entity
---

# Clockworktracker

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`Clockworktracker` monitors clockwork chess piece entities (rook, knight, bishop) that follow an owning entity. It enforces per-type follower limits, tracks entity lifecycle events, and automatically removes itself when no clockwork pieces remain. The component integrates with the `follower` system to detect when tracked entities change leaders or are removed from the world.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("clockworktracker")
inst:AddTag("chessfriend") -- Increases base follower limit

-- Add a clockwork knight
local knight = SpawnPrefab("clockworkknight")
inst.components.clockworktracker:AddClockwork(knight)

-- Check current counts
local knight_count = inst.components.clockworktracker:GetCountForType("knight")
local can_add = inst.components.clockworktracker:CanAddClockwork(knight)

-- Override max followers for a specific type
inst.components.clockworktracker:OverrideMaxFollowersForType("rook", 5)
```

## Dependencies & tags
**External dependencies:**
- `TUNING.CLOCKWORK_MAX_FOLLOWING` -- base max followers for non-chessfriend entities
- `TUNING.CLOCKWORK_MAX_FOLLOWING_CHESSFRIEND` -- increased max for chessfriend-tagged entities
- `IsSpecialEventActive` -- checks if YOTH event is active for unlimited knights

**Components used:**
- `follower` -- calls `SetLeader(nil)` when reducing max followers below current count

**Tags:**
- `rook` -- checked to identify rook-type clockwork
- `knight` -- checked to identify knight-type clockwork
- `bishop` -- checked to identify bishop-type clockwork
- `chessfriend` -- increases base follower limit when present on tracker owner

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | --- | The entity that owns this component. |
| `ents` | table | `{rook, knight, bishop}` | Tracks clockwork entities by chess type. Each type has `num` (count) and `ents` (entity set). |
| `_onclockworkremoved` | function | --- | Callback fired when a tracked entity is removed from the world. |
| `_onclockworkleaderchanged` | function | --- | Callback fired when a tracked entity's leader changes. |

## Main functions
### `OnRemoveFromEntity()`
* **Description:** Cleanup function called when the component is removed from its entity. Unregisters all event listeners from tracked clockwork entities.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `GetChessType(ent)`
* **Description:** Determines the chess piece type of an entity by checking for `rook`, `knight`, or `bishop` tags.
* **Parameters:** `ent` -- entity instance to check
* **Returns:** String chess type (`"rook"`, `"knight"`, `"bishop"`) or `nil` if no chess type tag found.
* **Error states:** None

### `OverrideMaxFollowersForType(chesstype, max)`
* **Description:** Sets a custom maximum follower count for a specific chess type. If the new max is lower than the current count, excess followers are detached via `follower:SetLeader(nil)`. The component auto-removes itself if all types have zero followers and no overridden max values remain.
* **Parameters:**
  - `chesstype` -- string chess type (`"rook"`, `"knight"`, `"bishop"`)
  - `max` -- number or `nil` to clear the override
* **Returns:** nil
* **Error states:** Errors if an excess follower entity lacks a `follower` component when `SetLeader(nil)` is called — no nil guard present before accessing `ent.components.follower`.

### `HasOverriddenMax()`
* **Description:** Checks if any chess type has a custom max follower override set.
* **Parameters:** None
* **Returns:** `true` if any type has an overridden max, `false` otherwise.
* **Error states:** None

### `GetCountForType(chesstype)`
* **Description:** Returns the current number of tracked followers for a specific chess type.
* **Parameters:** `chesstype` -- string chess type (`"rook"`, `"knight"`, `"bishop"`)
* **Returns:** Number count, or `0` if the type is invalid.
* **Error states:** None

### `GetMaxForType(chesstype)`
* **Description:** Calculates the effective maximum follower count for a chess type. During the YOTH special event, knights have unlimited followers (`math.huge`). Otherwise, uses `TUNING` constants based on whether the owner has the `chessfriend` tag.
* **Parameters:** `chesstype` -- string chess type (`"rook"`, `"knight"`, `"bishop"`)
* **Returns:** Number max followers (may be `math.huge` for knights during YOTH).
* **Error states:** None

### `CanAddClockwork(ent)`
* **Description:** Checks if a clockwork entity can be added as a follower without exceeding the type-specific limit.
* **Parameters:** `ent` -- clockwork entity instance
* **Returns:** `true` if under the limit, `false` if at or over capacity.
* **Error states:** None

### `AddClockwork(ent)`
* **Description:** Registers a clockwork entity as a tracked follower. Sets up event listeners for `onremove` and `leaderchanged` events on the entity. Does nothing if the entity is already tracked or has no valid chess type.
* **Parameters:** `ent` -- clockwork entity instance
* **Returns:** nil
* **Error states:** None

### `RemoveClockwork(ent)`
* **Description:** Unregisters a clockwork entity from tracking. Removes event listeners and decrements the type count. If all followers are removed and no max overrides exist, the component removes itself from the owner entity.
* **Parameters:** `ent` -- clockwork entity instance
* **Returns:** nil
* **Error states:** None

## Events & listeners
- **Listens to:**
  - `onremove` (on tracked entities) -- triggers `_onclockworkremoved` to clean up when a clockwork piece is destroyed
  - `leaderchanged` (on tracked entities) -- triggers `_onclockworkleaderchanged` to remove tracking if the entity's new leader is not the tracker owner
- **Pushes:** None identified