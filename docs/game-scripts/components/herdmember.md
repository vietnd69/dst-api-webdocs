---
id: herdmember
title: Herdmember
description: Tracks herd membership for an entity and manages herd creation or rejoining when enabled.
tags: [herd, entity, group, ai, locomotion]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: fdcac55f
system_scope: world
---

# Herdmember

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Herdmember` is a lightweight component attached to entities (typically mobs like Beefalo or Pigs) to manage their association with a `Herd`. It tracks which herd the entity belongs to, enables/disables herd participation (via a tag), and can spawn or reassign a herd instance when the member is enabled or leaves. It works closely with the `herd` and `health` components — particularly ensuring only alive, non-dead members can join or form herds.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("herdmember")
inst.components.herdmember:SetHerdPrefab("beefaloherd") -- optional override
inst.components.herdmember:CreateHerd() -- immediately create/join a herd
inst.components.herdmember:Leave() -- remove from current herd
```

## Dependencies & tags
**Components used:** `health`, `herd` (via external calls), `knownlocations` (via herd, indirectly).
**Tags:** Adds `"herdmember"` when enabled; removes `"herdmember"` when disabled or on removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `enabled` | boolean | `true` | Controls whether the entity is considered part of a herd (adds/removes `"herdmember"` tag). |
| `herd` | Herd instance or `nil` | `nil` | Reference to the herd this member belongs to. |
| `herdprefab` | string | `"beefaloherd"` | Prefab name used to spawn a new herd when needed. |
| `task` | ScheduleTask or `nil` | `nil` | Delayed task used to reinitialize herd membership after leaving. |

## Main functions
### `SetHerd(herd)`
* **Description:** Assigns a herd instance to this member. Does *not* automatically add the member to the herd; it merely sets the reference.
* **Parameters:** `herd` (Herd instance or `nil`) — the herd this member will belong to.
* **Returns:** Nothing.

### `SetHerdPrefab(prefab)`
* **Description:** Updates the prefab name used when spawning a new herd.
* **Parameters:** `prefab` (string) — the prefab name, e.g., `"beefaloherd"`.
* **Returns:** Nothing.

### `GetHerd()`
* **Description:** Returns the currently assigned herd instance.
* **Parameters:** None.
* **Returns:** Herd instance or `nil`.

### `CreateHerd()`
* **Description:** Spawns a new herd prefab at the member’s current location and calls `GatherNearbyMembers()` on the herd. Only executes if the member is enabled, not currently in a valid herd, and (if the `health` component exists) is not dead.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No effect if `enabled` is `false`, `health:IsDead()` is `true`, or spawning fails.

### `Leave()`
* **Description:** Removes this member from its current herd (if valid), and schedules re-initialization after a 5-second delay (unless disabled).
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No effect if `self.herd` is `nil` or invalid.

### `Enable(enabled)`
* **Description:** Toggles herd participation. If disabling and in a herd, immediately removes from herd; if enabling and no valid herd, schedules herd initialization.
* **Parameters:** `enabled` (boolean) — whether to enable herd membership.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a string useful for debugging, indicating the herd reference and whether the member is disabled.
* **Parameters:** None.
* **Returns:** string — format: `"herd:<herd_ref> disabled"` or `"herd:<herd_ref>"`.

### `OnRemoveFromEntity()`
* **Description:** Cleanup function called when the component is removed from its entity. Cancels pending task and removes `"herdmember"` tag.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.

### Constructor notes
- The constructor schedules `OnInit` to run after `8.1` seconds (`self.inst:DoTaskInTime(8.1, OnInit)`). This delay ensures the herd system’s sampling rate (documented as `HERDSAMPLER823`) is not violated. `OnInit` in turn calls `CreateHerd()`.
- `enabled` is handled as a property with an observer (`onenabled`) to automatically add/remove the `"herdmember"` tag.
