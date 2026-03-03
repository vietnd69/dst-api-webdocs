---
id: squadmember
title: Squadmember
description: Manages an entity's membership in a named squad, tracking other members and broadcasting squad join/leave events.
tags: [squad, group, event, ai]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: ac1b27e1
system_scope: entity
---

# Squadmember

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`SquadMember` enables an entity to belong to a named squad (e.g., `beefalo_herd`, `tentacle_horde`) and maintain bidirectional awareness of other squad members. It facilitates dynamic squad membership tracking via events (`ms_joinsquad_*` and `ms_leavesquad_*`) and supports synchronization across clients in multiplayer. This component is typically attached to entities that participate in group behavior, such as beefalo or other social creatures.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("squadmember")
inst.components.squadmember:JoinSquad("beefalo_herd")
print(inst.components.squadmember:GetSquadName()) -- "beefalo_herd"
for member in pairs(inst.components.squadmember:GetOtherMembers()) do
    print("Squadmate:", member:GetDebugString())
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `squad` | string or `nil` | `""` | The name of the squad this entity belongs to; empty string or `nil` means not in a squad. |
| `others` | table | `{}` | Dictionary mapping other squad member entities to `true`. |

## Main functions
### `IsInSquad()`
* **Description:** Returns whether the entity is currently in a squad (i.e., `squad` is non-empty).
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `squad` is a non-empty string, otherwise `false`.

### `GetSquadName()`
* **Description:** Returns the name of the squad this entity belongs to.
* **Parameters:** None.
* **Returns:** `string` — the squad name, or empty string if not in a squad.

### `GetOtherMembers()`
* **Description:** Returns a table of all other entities currently in the same squad.
* **Parameters:** None.
* **Returns:** `table` — a dictionary where keys are entity instances and values are `true`. Includes only members currently tracked via event callbacks.

### `JoinSquad(squadname)`
* **Description:** Assigns this entity to a squad and registers for join/leave events of that squad. Existing squad membership is dropped first. If `squadname` is `nil` or empty, it behaves like leaving any current squad without joining a new one.
* **Parameters:** `squadname` (string or `nil`) — the name of the squad to join.
* **Returns:** Nothing.
* **Error states:** If already in the same squad, no action is taken.

### `LeaveSquad()`
* **Description:** Removes this entity from its current squad, cleans up tracking of other members, and fires a leave event for the old squad.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Safe to call multiple times; no-op if not in a squad.

### `GetDebugString()`
* **Description:** Returns a multi-line debug string summarizing the entity's squad membership and list of squadmates.
* **Parameters:** None.
* **Returns:** `string` or `nil` — if in a squad, returns a formatted string like `"<squadname>\n  entity1\n  entity2"`, otherwise `nil`.

## Events & listeners
- **Listens to:**  
  - `ms_joinsquad_<squadname>` (on `TheWorld`) — triggers when another entity joins the same squad; adds the new member to `others` and sets up mutual tracking.  
  - `ms_leavesquad_<squadname>` (on `self.inst`) — triggered when another squad member leaves; removes that member from `others`.  
  - `onremove` (on `self.inst`) — triggered when a tracked squad member is removed; removes it from `others`.  
- **Pushes:**  
  - `ms_leavesquad_<squadname>` — fired on `self.inst` when leaving a squad (not broadcast on `TheWorld`).  

SquadMember does not push `ms_joinsquad_*` events; joining is exclusively communicated via global `TheWorld` event callbacks.
