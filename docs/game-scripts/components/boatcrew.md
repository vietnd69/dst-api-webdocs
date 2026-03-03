---
id: boatcrew
title: Boatcrew
description: Manages the crew roster, AI behavior state, and loot tracking for a boat entity in pirate encounters.
tags: [ai, crew, loot, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: e3b594bc
system_scope: entity
---

# Boatcrew

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Boatcrew` is a core component for managing pirate boat crews during gameplay. It maintains the list of crew members, tracks their loot, determines AI behavior states (e.g., `hunting`, `assault`, `retreat`, `delivery`), and coordinates crew-related events such as cheer animations and member removal. It works closely with `crewmember`, `boatphysics`, and `piratespawner` components to synchronize behavior across the server and client.

## Usage example
```lua
local boat = CreateEntity()
boat:AddComponent("boatcrew")

boat.components.boatcrew:SetMemberTag("pirate")
boat.components.boatcrew:SetAddMemberFn(function(boat, member) ... end)
boat.components.boatcrew:AddMember(captain_entity, true)

boat.components.boatcrew:SetTarget(enemy_boat)
```

## Dependencies & tags
**Components used:** `boatphysics`, `crewmember`, `inventory`, `piratespawner`, `stackable`, `vanish_on_sleep`  
**Tags:** Checks for `"crewmember"` and optionally `self.membertag`; removes `"vanish_on_sleep"` and `"boatcrew"` when crew count drops below `1`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `members` | table | `{}` | Map of crew member entity instances (as keys) to `true` values. |
| `membercount` | number | `0` | Count of crew members currently on the boat. |
| `membertag` | string or `nil` | `nil` | Optional tag used to narrow crew search. |
| `loot_per_member` | number | `TUNING.BOATCREW_LOOT_PER_MEMBER` | Loot threshold per crew member to trigger victory condition. |
| `captain` | Entity instance or `nil` | `nil` | The designated captain entity. |
| `tinkertargets` | table | `{}` | Map of GUIDs for reserved target entities. |
| `gatherrange` | number or `nil` | `nil` | Range for gathering behavior (not set in constructor). |
| `updaterange` | number or `nil` | `nil` | Range update threshold (set via `SetUpdateRange`). |
| `addmember` | function or `nil` | `nil` | Optional callback when a member is added. |
| `removemember` | function or `nil` | `nil` | Optional callback when a member is removed. |
| `heading` | number or `nil` | `nil` | Desired heading (in degrees) for movement direction. |
| `target` | Entity instance, Vector3, or `nil` | `nil` | Current AI target (boat, position, etc.). |
| `flee` | boolean or `nil` | `nil` | If `true`, forces `retreat` behavior. |
| `status` | string | `"hunting"` | Current AI behavior state. |
| `task` | Task | Periodic task (every `2` seconds) | Drives `OnUpdate` to evaluate AI state. |

## Main functions
### `TestForLootToSteal()`
* **Description:** Checks if any non-captain crew member has loot to steal (i.e., items lacking the `"personal_possession"` tag).
* **Parameters:** None.
* **Returns:** `true` if at least one crew member (other than the captain) has stealable loot; otherwise `false`.

### `TestForVictory()`
* **Description:** Determines if the crew has achieved victory via exceeding per-member loot threshold or if any crew member has been marked with a `victory` flag.
* **Parameters:** None.
* **Returns:** `true` if victory condition is met; otherwise `false`.

### `CrewCheer()`
* **Description:** Triggers a cheer event for all crew members not yet marked as `victory`, with randomized delays.
* **Parameters:** None.
* **Returns:** Nothing.

### `CountPirateLoot()`
* **Description:** Sums the stack size of all non-personal items in each crew member's inventory.
* **Parameters:** None.
* **Returns:** Total count of pirate loot as a number.

### `CountCrew()`
* **Description:** Returns the current number of crew members.
* **Parameters:** None.
* **Returns:** `number` — crew count.

### `OnRemoveFromEntity()`
* **Description:** Cleans up when the component is removed from the entity but the entity persists. Cancels the periodic update task and removes listeners from all crew members.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnRemoveEntity()`
* **Description:** Cleans up when the entity itself is being destroyed. Removes all crew members.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetMemberTag(tag)`
* **Description:** Configures the optional search tag used for identifying valid crew members during spawning.
* **Parameters:** `tag` (string or `nil`) — Tag string to append to `"crewmember"` in searches.
* **Returns:** Nothing.

### `areAllCrewOnBoat()`
* **Description:** Verifies whether all crew members are currently on the same platform as the boat.
* **Parameters:** None.
* **Returns:** `true` if all members match `member:GetCurrentPlatform() == member.components.crewmember.boat`; otherwise `false`.

### `GetHeadingNormal()`
* **Description:** Computes the normalized direction vector the boat should move toward, based on current `target` or `heading`, and adjusts for boat velocity and retreat logic.
* **Parameters:** None.
* **Returns:** `Vector3` — Normalized heading direction (y-component is `0`), or `nil` if no heading can be computed.

### `SetHeading(heading)`
* **Description:** Sets the absolute heading (in degrees) for the boat.
* **Parameters:** `heading` (number) — Desired heading in degrees.
* **Returns:** Nothing.

### `SetTarget(target)`
* **Description:** Sets the current AI target. Accepts an entity with `GetPosition` or a `Vector3`.
* **Parameters:** `target` (Entity instance, Vector3, or `nil`) — Target for AI behavior.
* **Returns:** Nothing.

### `SetUpdateRange(range)`
* **Description:** Sets the range threshold for update decisions.
* **Parameters:** `range` (number) — Range value for proximity checks.
* **Returns:** Nothing.

### `SetAddMemberFn(fn)`
* **Description:** Sets the callback invoked when a member is added.
* **Parameters:** `fn` (function or `nil`) — Callback signature: `fn(boat_inst, member_inst)`.
* **Returns:** Nothing.

### `SetRemoveMemberFn(fn)`
* **Description:** Sets the callback invoked when a member is removed.
* **Parameters:** `fn` (function or `nil`) — Callback signature: `fn(boat_inst, member_inst)`.
* **Returns:** Nothing.

### `SetCaptain(captain)`
* **Description:** Assigns or clears the captain. Registers cleanup listener for captain removal to automatically clean up the boat component if no crew remains.
* **Parameters:** `captain` (Entity instance or `nil`) — New captain entity.
* **Returns:** Nothing.

### `AddMember(inst, setcaptain)`
* **Description:** Adds a crew member entity to the crew and configures member state.
* **Parameters:**  
  - `inst` (Entity instance) — Member to add.  
  - `setcaptain` (boolean) — If `true`, designates `inst` as captain.
* **Returns:** Nothing.

### `RemoveMember(inst)`
* **Description:** Removes a crew member from the crew and updates associated state.
* **Parameters:** `inst` (Entity instance) — Member to remove.
* **Returns:** Nothing.
* **Error states:** No-op if `inst` is not in `self.members`.

### `checktinkertarget(target)`
* **Description:** Checks if a target has been reserved (e.g., for tinker actions).
* **Parameters:** `target` (Entity instance) — Target to check.
* **Returns:** `true` if reserved; otherwise `nil`.

### `reserveinkertarget(target)`
* **Description:** Marks a target as reserved for tinker actions.
* **Parameters:** `target` (Entity instance) — Target to reserve.
* **Returns:** Nothing.

### `removeinkertarget(target)`
* **Description:** Removes the reservation for a target.
* **Parameters:** `target` (Entity instance) — Target to unreserve.
* **Returns:** Nothing.

### `IsCrewOnDeck()`
* **Description:** Verifies whether all crew members are on the same platform as the boat (shallow check vs. `areAllCrewOnBoat` which also validates the `crewmember` component's reference).
* **Parameters:** None.
* **Returns:** `true` if all members are on `self.inst`; otherwise `false`.

### `OnUpdate()`
* **Description:** Called periodically to evaluate and update the crew's AI state based on loot, victory flags, and target presence.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes crew member GUIDs for world save.
* **Parameters:** None.
* **Returns:** `data`, `data.members` — Table containing `members` as an array of GUIDs.

### `LoadPostPass(newents, savedata)`
* **Description:** Deserializes crew members after world load by GUID.
* **Parameters:**  
  - `newents` (table) — Map of GUID to `newent` tables from save load.  
  - `savedata` (table) — Saved crew data from `OnSave`.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"onremove"` on self (removes ship data via `piratespawner`)  
  - `"onremove"`, `"death"`, `"teleported"` on each crew member (triggers `_onmemberkilled`, which calls `RemoveMember`)  
  - `"onremove"` on the captain (triggers automatic crew cleanup)  
- **Pushes:** `"cheer"` event on individual crew members during `CrewCheer`.
