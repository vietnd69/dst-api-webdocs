---
id: boatracecrew
title: Boatracecrew
description: Manages a crew of entities assigned to a boat, tracking members, handling their life-cycle events, and supporting network serialization.
tags: [crew, boat, network, lifecycle]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: a71a2af3
system_scope: entity
---

# Boatracecrew

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`BoatRaceCrew` is a component that manages a collection of crew members assigned to a boat entity. It handles adding/removing crew members, tracking the captain, listening for events that cause crew departure (e.g., death, removal, teleportation), and periodically updating crew status. It also implements save/load support via `OnSave` and `LoadPostPass`, and interfaces with the `crewmember` component to bind/unbind crew from the boat.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("boatracecrew")
inst.components.boatracecrew:SetTarget(some_target_entity)

local crewmember = some_crew_prefab
inst.components.boatracecrew:AddMember(crewmember, true)  -- Add as captain

inst.components.boatracecrew:SetCaptain(new_captain)       -- Replace captain
inst.components.boatracecrew:RemoveMember(old_captain)     -- Remove a member
```

## Dependencies & tags
**Components used:** `crewmember`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `members` | table (set of Entity) | `{}` | Map of crew member entities currently assigned to this crew. |
| `captain` | Entity or `nil` | `nil` | The currently designated captain entity. |
| `target` | Entity or `nil` | `nil` | The current target entity (e.g., a destination or objective). |
| `status` | string | `"assault"` | Current crew status; currently hardcoded in `OnUpdate`. |
| `_update_task` | Task or `nil` | periodic task | Scheduled task running every 2.0 seconds. |
| `on_member_added` | function or `nil` | `nil` | Optional callback `(inst, member)` fired when a member is added. |
| `on_member_removed` | function or `nil` | `nil` | Optional callback `(inst, member)` fired when a member is removed. |
| `on_crew_empty` | function or `nil` | `nil` | Optional callback `(inst)` fired when the last member is removed. |

## Main functions
### `SetTarget(target)`
*   **Description:** Sets or clears the crew’s target entity, and registers or removes an event listener for when the target is removed.
*   **Parameters:** `target` (Entity or `nil`) — the entity to be targeted.
*   **Returns:** Nothing.

### `AddMember(new_member, is_captain)`
*   **Description:** Adds a new crew member to the boat. Registers death/removal/teleport listeners, binds the member to this boat via `crewmember:SetBoat`, and optionally designates it as captain.
*   **Parameters:**  
    `new_member` (Entity) — entity to add to the crew.  
    `is_captain` (boolean) — if `true`, sets this member as the captain.
*   **Returns:** Nothing.
*   **Error states:** No effect if the member is already in `members`.

### `RemoveMember(member)`
*   **Description:** Removes a crew member, cleans up listeners and bindings, invokes optional callbacks, and triggers `on_crew_empty` if the crew becomes empty.
*   **Parameters:** `member` (Entity) — entity to remove from the crew.
*   **Returns:** Nothing.
*   **Error states:** Early return with no effect if the member is not currently in the crew.

### `SetCaptain(captain)`
*   **Description:** Assigns or clears the crew’s captain, managing an event listener on the captain entity.
*   **Parameters:** `captain` (Entity or `nil`) — entity to appoint as captain.
*   **Returns:** Nothing.

### `GetHeadingNormal()`
*   **Description:** Computes the normalized directional vector from the boat to the current target.
*   **Parameters:** None.
*   **Returns:** Two numbers (`x`, `z`) if a target exists, otherwise `nil`.

### `OnUpdate()`
*   **Description:** Currently hardcoded to set `self.status` to `"assault"`. Runs periodically via `_update_task`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnRemoveFromEntity()`
*   **Description:** Cleanup method called when the component is removed from its entity. Cancels the periodic update task and unregisters member listeners.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnRemoveEntity()`
*   **Description:** Cleanup method called when the entity itself is removed. Removes all crew members cleanly (invoking callbacks).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Serializes the crew’s members by their GUIDs for save/load.
*   **Parameters:** None.
*   **Returns:** `data` (table) and `data.members` (table of GUIDs), where `data.members` contains the GUIDs of all crew members.

### `LoadPostPass(newents, data)`
*   **Description:** Restores crew members after world load using saved GUIDs.
*   **Parameters:**  
    `newents` (table) — mapping of GUID to entity data.  
    `data` (table) — the saved data, specifically expecting `data.members`.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `onremove`, `death`, `teleported` — per crew member (via `AddMemberListeners`), triggering `RemoveMember`.  
  - `onremove` — on the captain, clearing `self.captain`.  
  - `onremove` — on the target, clearing `self.target`.
- **Pushes:** None. (Callbacks `on_member_added`, `on_member_removed`, and `on_crew_empty` are optional external hooks, not game events.)
