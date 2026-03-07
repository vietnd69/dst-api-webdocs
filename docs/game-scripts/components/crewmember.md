---
id: crewmember
title: Crewmember
description: Manages the rowing behavior and boat association for entities acting as crew members on boats.
tags: [locomotion, boat, rowing]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 00e655ff
system_scope: entity
---

# Crewmember

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Crewmember` is an entity component that enables an entity to function as a rower aboard a boat. It manages the entity’s association with a boat, tracks whether rowing is necessary, applies rowing force, and coordinates with the `boatcrew` or `boatracecrew` components to drive boat movement. The component automatically adds or removes the `crewmember` tag based on its enabled state.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("crewmember")
inst.components.crewmember:SetBoat(someboat)
inst.components.crewmember:Enable(true)
inst.components.crewmember:Row()
```

## Dependencies & tags
**Components used:** `boatcrew`, `boatracecrew`, `boatphysics`  
**Tags:** Adds `crewmember` when enabled; removes `crewmember` when disabled or on removal from entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `enabled` | boolean | `true` | Controls whether the entity can row. Disabling it also removes the entity from the crew. |
| `max_velocity` | number | `4` | Maximum rowing speed applied to the boat. |
| `max_target_dsq` | number | `TUNING.CREWMEMBER_TARGET_DSQ` | Squared distance threshold to determine if the boat is close enough to its assault target to stop rowing. |
| `force` | number | `1` | Rowing force magnitude applied per frame. |
| `boat` | entity or `nil` | `nil` | Reference to the boat the crewmember is assigned to. |
| `_on_boat_removed` | function | `function() self.boat = nil end` | Event callback triggered when the boat is removed from the world. |

## Main functions
### `Shouldrow()`
* **Description:** Determines whether the crewmember should currently be rowing. Evaluates boat state (e.g., target presence, assault status, proximity) and crewmember membership.
* **Parameters:** None.
* **Returns:** `true`, `false`, or `nil` — `nil` means rowing is not applicable or disallowed.
* **Error states:** Returns `nil` if the crewmember is not on the stored boat, or if the boat has no crew component or no rowing direction set.

### `SetBoat(boat)`
* **Description:** Assigns or clears the boat association for this crewmember. Registers or unregisters event listeners to safely handle boat removal.
* **Parameters:** `boat` (entity or `nil`) — the boat entity to join, or `nil` to disassociate.
* **Returns:** Nothing.

### `GetBoat()`
* **Description:** Returns the currently assigned boat.
* **Parameters:** None.
* **Returns:** The `boat` entity, or `nil` if unassigned.

### `Leave()`
* **Description:** Removes this crewmember from its boat’s crew via the `boatcrew:RemoveMember()` method.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnLeftCrew()`
* **Description:** Invokes the optional `leavecrewfn` callback if defined, typically used to trigger custom cleanup or logic upon crew departure.
* **Parameters:** None.
* **Returns:** Nothing.

### `Enable(enabled)`
* **Description:** Enables or disables rowing ability. Disabling automatically removes the crewmember from its boat.
* **Parameters:** `enabled` (boolean) — whether to enable rowing.
* **Returns:** Nothing.

### `Row()`
* **Description:** Applies rowing force to the boat based on current crew status, target, and direction logic. Calls `boat:PushEvent("rowed", self.inst)` after application.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Returns early without effect if the crewmember is not assigned to a valid boat or if the boat lacks `boatcrew`/`boatracecrew` or `boatphysics` components.

### `GetDebugString()`
* **Description:** Returns a debug-friendly string including the associated boat and whether the component is disabled.
* **Parameters:** None.
* **Returns:** String formatted as `"herd:<boat_ref> disabled"` or `"herd:<boat_ref>"`.

## Events & listeners
- **Listens to:** `onremove` (on assigned boat) — sets `self.boat = nil` when the boat is removed from the world.
- **Pushes:** `rowed` — fired on the boat entity with `self.inst` passed as the event data.
