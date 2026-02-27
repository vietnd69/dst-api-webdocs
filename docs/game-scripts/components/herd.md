---
id: herd
title: Herd
description: Manages a group of herd-member entities, handling membership, flocking behavior, gathering, and merging logic for dynamic group dynamics.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 6412205e
---

# Herd

## Overview
The `Herd` component manages a dynamic collection of entities marked as herd members (e.g., beefalo, penguins), enforcing size limits, automatically gathering nearby eligible members, merging with compatible smaller herds, and updating the herd's position based on its members' locations. It integrates with components like `health`, `knownlocations`, and `herdmember`, and persists membership across saves.

## Dependencies & Tags
- **Components used:** `health`, `knownlocations`, `herdmember`, `combat`, `transform`
- **Tags added:** `"herd"` (via `HERD_TAGS`)
- **Tag requirements for members:** `"herdmember"` and optionally a custom tag set via `SetMemberTag`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity this component is attached to (the herd leader). |
| `maxsize` | `number` | `12` | Maximum number of members allowed in this herd. |
| `members` | `table` | `{}` | Dictionary mapping member entities (keys) to `true`. |
| `membercount` | `number` | `0` | Current number of members in the herd. |
| `membertag` | `string?` | `nil` | Optional tag required for a member to be accepted (e.g., `"beefalo"`). |
| `membersearchtags` | `table?` | `nil` | Tags used in entity searches; set to `{"herdmember", membertag}` if `membertag` is non-nil. |
| `gatherrange` | `number?` | `nil` | Radius around the herd leader to scan for new members. |
| `updaterange` | `number?` | `nil` | Radius within which members influence the herd leader's position update. |
| `onempty` | `function?` | `nil` | Callback triggered when the herd becomes empty. |
| `onfull` | `function?` | `nil` | Callback triggered when the herd reaches `maxsize`. |
| `addmember` | `function?` | `nil` | Callback triggered on successful member addition. |
| `removemember` | `function?` | `nil` | Callback triggered on member removal. |
| `updatepos` | `boolean` | `true` | Whether to update the herd leader’s position based on members. |
| `updateposincombat` | `boolean` | `false` | Whether to include members in combat for position averaging. |
| `task` | `Timer` | — | Periodic update task scheduled at launch (random delay 6–8 seconds). |
| `nomerging` | `boolean?` | `nil` | (Commented-out) Optional flag to disable herd merging. |

## Main Functions

### `SetMemberTag(tag)`
* **Description:** Sets the required tag for members; updates `membersearchtags` for entity searches. Set to `nil` to remove tag requirement.
* **Parameters:**  
  `tag` (`string?`) — Optional tag string (e.g., `"beefalo"`).

### `SetGatherRange(range)`
* **Description:** Configures the radius around the herd leader within which new members are gathered.
* **Parameters:**  
  `range` (`number`) — Search radius in world units.

### `SetUpdateRange(range)`
* **Description:** Configures the radius within which member positions contribute to updating the herd leader’s location.
* **Parameters:**  
  `range` (`number`) — Update radius in world units.

### `SetMaxSize(size)`
* **Description:** Updates the maximum number of members allowed in the herd.
* **Parameters:**  
  `size` (`number`) — New maximum herd size.

### `SetOnEmptyFn(fn)`
* **Description:** Sets the callback function executed when the herd becomes empty.
* **Parameters:**  
  `fn` (`function`) — Function taking the herd leader entity as argument.

### `SetOnFullFn(fn)`
* **Description:** Sets the callback function executed when the herd reaches capacity.
* **Parameters:**  
  `fn` (`function`) — Function taking the herd leader entity as argument.

### `SetAddMemberFn(fn)`
* **Description:** Sets a custom callback invoked when a member is added.
* **Parameters:**  
  `fn` (`function`) — Function `(herdLeader, member)`.

### `SetRemoveMemberFn(fn)`
* **Description:** Sets a custom callback invoked when a member is removed.
* **Parameters:**  
  `fn` (`function`) — Function `(herdLeader, member)`.

### `IsFull()`
* **Description:** Returns whether the herd has reached its maximum capacity.
* **Parameters:** None.  
* **Returns:** `boolean` — `true` if `membercount >= maxsize`.

### `AddMember(inst)`
* **Description:** Adds an entity to the herd if not already present; registers listeners, updates `knownlocations` and `herdmember`, and triggers callbacks. Ensures `membercount` matches actual size.
* **Parameters:**  
  `inst` (`Entity`) — The entity to add as a member.

### `RemoveMember(inst)`
* **Description:** Removes an entity from the herd; cleans up listeners, clears location memory, updates `herdmember`, and triggers callbacks. Fires `onempty` if the herd becomes empty.
* **Parameters:**  
  `inst` (`Entity`) — The member entity to remove.

### `GatherNearbyMembers()`
* **Description:** Scans for eligible herd members within `gatherrange`, checks tag and status requirements, and adds up to capacity.
* **Parameters:** None.  
* **Eligibility checks:** Must be tagged `"herdmember"` (and optionally `membertag`), not already in a herd, not dead, and not currently assigned to another herd.

### `MergeNearbyHerds()`
* **Description:** Finds and absorbs small, compatible herds (same `membertag`, `<4 members`) within `gatherrange`, merging their members and deleting the merged herd.
* **Parameters:** None.  
* **Constraints:** Requires `gatherrange` set, herd not full, `nomerging` not enabled, and merged herd size ≤ `maxsize`.

### `OnUpdate()`
* **Description:** Core update logic run periodically: gathers members, merges nearby herds, and updates herd leader position (if `updatepos` is enabled and members exist).
* **Parameters:** None.  
* **Position update behavior:** Averages positions of members in `updaterange`, excluding those in combat unless `updateposincombat` is true. Supports a custom `updateposfn` override.

### `GetDebugString()`
* **Description:** Returns a formatted string with herd state for debugging (member counts, range, and nearby tagged entities).
* **Parameters:** None.  
* **Returns:** `string` — Debug data.

### `OnRemoveFromEntity()` / `OnRemoveEntity()`
* **Description:** Cleans up the component on removal: cancels the update task and removes listeners from all members.
* **Parameters:** None.

### `OnSave()`
* **Description:** Serializes the herd’s member list by GUID for saving.
* **Parameters:** None.  
* **Returns:** `table` — Contains `members = { GUID, ... }`.

### `LoadPostPass(newents, savedata)`
* **Description:** Reconstructs member references after world load using saved GUIDs.
* **Parameters:**  
  `newents` (`table`) — Mapping of GUIDs to loaded entities.  
  `savedata` (`table`) — Saved data (specifically `savedata.members`).

## Events & Listeners
- **Listens for `"onremove"` and `"death"` events on each member**, triggering `RemoveMember`.
- **Triggers events via callbacks** (`onempty`, `onfull`, `addmember`, `removemember`) but does *not* push global events.