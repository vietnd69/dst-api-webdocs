---
id: herd
title: Herd
description: Manages a group of herd members (e.g., beefalo) around a central entity, handling membership, gathering, merging, position updates, and persistence.
tags: [herd, group, entity, movement]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 6412205e
system_scope: entity
---

# Herd

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Herd` manages a dynamic group of entities (called "members") centered on a host entity, such as a beefalo herd lead. It supports adding/removing members based on proximity and tags, merging with other herds, updating the host entity's position to follow members, and persisting members across save/load cycles. It relies on `health` to avoid dead members, `knownlocations` to share herd position with members, and `herdmember` to establish bidirectional membership links. The component operates via a periodic task (approx. every 2–8 seconds) and integrates with `combat` and `knownlocations` for context-aware behavior.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("herd")
inst.components.herd:SetMemberTag("beefalo")
inst.components.herd:SetGatherRange(15)
inst.components.herd:SetMaxSize(6)
inst.components.herd:SetOnFullFn(function() print("Herd is full!") end)
inst.components.herd:OnUpdate() -- trigger gathering/merging immediately
```

## Dependencies & tags
**Components used:** `health`, `knownlocations`, `herdmember`, `combat`.  
**Tags:** Adds `herd` to host entity internally; uses `herdmember` and optional `membertag` on members; checks `debuffed`, `herd`, and custom `membertag`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity that owns the herd. |
| `maxsize` | number | `12` | Maximum number of members allowed in the herd. |
| `members` | table | `{}` | Map of member entities to `true`. |
| `membercount` | number | `0` | Current number of members. |
| `membertag` | string or `nil` | `nil` | Optional tag required for membership (e.g., `"beefalo"`). |
| `membersearchtags` | table or `nil` | `nil` | Tags used in `TheSim:FindEntities(...)`, set by `SetMemberTag`. |
| `gatherrange` | number or `nil` | `nil` | Radius around host to scan for new members. |
| `updaterange` | number or `nil` | `nil` | Radius within which members contribute to host position update. |
| `onempty` | function or `nil` | `nil` | Callback fired when herd becomes empty. |
| `onfull` | function or `nil` | `nil` | Callback fired when herd reaches `maxsize`. |
| `addmember` | function or `nil` | `nil` | Callback fired when a member is added. |
| `removemember` | function or `nil` | `nil` | Callback fired when a member is removed. |
| `updatepos` | boolean | `true` | Whether host position updates based on members. |
| `updateposincombat` | boolean | `false` | Whether host updates position even if a member is in combat. |
| `nomerging` | boolean | *not initialized* | Commented-out in source; not used. |
| `task` | `DoTaskInTime` | — | Periodic task used for `OnUpdate`. |

## Main functions
### `SetMemberTag(tag)`
*   **Description:** Sets the optional tag members must have to join this herd, and configures `membersearchtags` accordingly.
*   **Parameters:** `tag` (string or `nil`) — e.g., `"beefalo"`. If `nil`, `membersearchtags` is cleared.
*   **Returns:** Nothing.

### `SetGatherRange(range)`
*   **Description:** Sets the radius around the host entity within which to search for new members during `GatherNearbyMembers`.
*   **Parameters:** `range` (number) — distance in game units.
*   **Returns:** Nothing.

### `SetUpdateRange(range)`
*   **Description:** Sets the radius within which alive, non-hostile members affect the host's position update.
*   **Parameters:** `range` (number) — distance in game units.
*   **Returns:** Nothing.

### `SetMaxSize(size)`
*   **Description:** Sets the maximum number of members allowed in the herd.
*   **Parameters:** `size` (number) — positive integer.
*   **Returns:** Nothing.

### `SetOnEmptyFn(fn)`
*   **Description:** Registers a callback that fires when the herd becomes empty (i.e., `membercount == 0`).
*   **Parameters:** `fn` (function) — signature `fn(hostInst)`.
*   **Returns:** Nothing.

### `SetOnFullFn(fn)`
*   **Description:** Registers a callback that fires when the herd reaches `maxsize`.
*   **Parameters:** `fn` (function) — signature `fn(hostInst)`.
*   **Returns:** Nothing.

### `SetAddMemberFn(fn)`
*   **Description:** Registers a callback that fires whenever a member is successfully added.
*   **Parameters:** `fn` (function) — signature `fn(hostInst, memberInst)`.
*   **Returns:** Nothing.

### `SetRemoveMemberFn(fn)`
*   **Description:** Registers a callback that fires whenever a member is successfully removed.
*   **Parameters:** `fn` (function) — signature `fn(hostInst, memberInst)`.
*   **Returns:** Nothing.

### `IsFull()`
*   **Description:** Returns whether the herd has reached its maximum size.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if `membercount >= maxsize`, otherwise `false`.

### `AddMember(inst)`
*   **Description:** Adds an entity as a member if it is not already a member, and updates associated state (listeners, `knownlocations`, `herdmember`, callbacks).
*   **Parameters:** `inst` (`Entity`) — the member entity to add.
*   **Returns:** Nothing.
*   **Error states:** Silently ignores if `inst` is already in `members`. Does not check `maxsize` (assertion commented out), so overflows are possible but non-fatal.

### `RemoveMember(inst)`
*   **Description:** Removes a member from the herd, cleans up listeners, resets position tracking in `knownlocations`, unsets `herdmember`, and fires removal callbacks.
*   **Parameters:** `inst` (`Entity`) — the member entity to remove.
*   **Returns:** Nothing.
*   **Error states:** Silently ignores if `inst` is not in `members`.

### `GatherNearbyMembers()`
*   **Description:** Scans the area around the host (within `gatherrange`) for eligible members (tagged, alive, not already in a herd), and adds them up to capacity.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `gatherrange` is `nil` or the herd is full. Skips members that already have `"herd"` in `knownlocations`, preventing cross-herd assignment.

### `MergeNearbyHerds()`
*   **Description:** Attempts to merge small, nearby herds (same `membertag`, `<4` members, combined size ≤ `maxsize`) into this herd, then deletes the source herd entity.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `nomerging` is truthy, `gatherrange` is `nil`, or the herd is full. Skips non-conforming herds or invalid entities.

### `OnUpdate()`
*   **Description:** The periodic update handler that runs `GatherNearbyMembers`, `MergeNearbyHerds`, and position updates for the host based on member locations. Also syncs herd position to members via `knownlocations`.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Details:** Filters members by tag, `health:IsDead()`, and `combat.target`; computes average position of valid members; updates host position; and informs members of current herd location. Removes invalid members (missing `herdmember` or wrong tag).

### `OnRemoveFromEntity()`
*   **Description:** Called when component is removed from an entity (e.g., via `OnRemoveComponent`). Cancels the update task and removes listeners from all members.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnRemoveEntity()`
*   **Description:** Called when the host entity is being removed from the world. Removes all members from the herd.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Saves the herd state (list of member GUIDs) for persistence.
*   **Parameters:** None.
*   **Returns:** `{ members = { GUID1, GUID2, ... } }`, and returns the members list as second return value (used by DST's save system).
*   **Error states:** Returns empty table if no members.

### `LoadPostPass(newents, savedata)`
*   **Description:** Restores members after a save/load, mapping saved GUIDs to entity instances in `newents`.
*   **Parameters:**  
    `newents` (table) — GUID → `{ GUID, entity }` lookup table.  
    `savedata.members` (table) — list of member GUIDs from `OnSave`.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove`, `death` — attached per member to call `RemoveMember` when a member leaves or dies.  
- **Pushes:** None directly; relies on callbacks (`onempty`, `onfull`, `addmember`, `removemember`) to notify external logic.
