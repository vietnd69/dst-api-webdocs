---
id: hull
title: Hull
description: Manages visual and logical attachment of boat-related accessories (plank, lip) and handles entity attachment offsets during boat placement.
tags: [boat, decoration, attachment, world]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 836e5e96
system_scope: world
---

# Hull

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Hull` is a lightweight component used to manage visual attachments and placement behavior for boat-related prefabs. It handles attaching auxiliary entities (like planks or hull lips) to a boat, setting their world position relative to the boat, and managing their animation states during deployment. It also persists skin information for attached entities across save/load cycles.

This component does not implement core physics or behavior logic; instead, it serves as a helper for prefabs (typically boat sub-assemblies) that require visual alignment and animation coordination during world placement. It references `walkableplatform` for post-deployment item pushing but does not depend on it directly via component initialization.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("hull")
inst:AddComponent("walkableplatform") -- needed for full deployment behavior
inst.components.hull:SetPlank(plank_prefab)
inst.components.hull:SetBoatLip(lip_prefab, Vector3(1,1,1))
inst.components.hull:SetRadius(2.5)
-- Later, when deployed:
inst.components.hull:OnDeployed()
```

## Dependencies & tags
**Components used:** `walkableplatform` — accessed via `self.inst.components.walkableplatform` only during `OnDeployed`.
**Tags:** Adds `"ignoremouseover"` to the `boat_lip` entity if set.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `TheSim` entity | — | The entity instance the component is attached to. |
| `plank` | entity (optional) | `nil` | The plank entity reference; managed via `SetPlank`. |
| `boat_lip` | entity (optional) | `nil` | The lip entity reference; managed via `SetBoatLip`. |
| `radius` | number (optional) | `nil` | Hull radius value; set/get via `SetRadius`/`GetRadius`. |

## Main functions
### `FinishRemovingEntity(entity)`
* **Description:** Called when the attached entity (`entity`) fires its `"onremove"` event. Safely removes the entity if still valid.
* **Parameters:** `entity` (entity) — the entity being removed.
* **Returns:** Nothing.
* **Error states:** No-side-effect if `entity:IsValid()` returns `false`.

### `AttachEntityToBoat(obj, offset_x, offset_z, parent_to_boat)`
* **Description:** Attaches an entity (`obj`) to the boat (`self.inst`) using either world-position offset or entity hierarchy parenting.
* **Parameters:**  
  `obj` (entity) — the entity to attach.  
  `offset_x`, `offset_z` (numbers) — positional offsets relative to the boat.  
  `parent_to_boat` (boolean) — if `true`, uses parent-child hierarchy; otherwise sets absolute world position.
* **Returns:** Nothing.
* **Error states:** Registers a listener on `obj` for `"onremove"` — no error if `obj` is already removed.

### `SetPlank(obj)`
* **Description:** Assigns the `plank` property to the given entity reference.
* **Parameters:** `obj` (entity) — the plank entity.
* **Returns:** Nothing.

### `SetBoatLip(obj, scale)`
* **Description:** Assigns the `boat_lip` entity, registers it as a platform follower, attaches it to the boat, adds the `"ignoremouseover"` tag, and optionally sets its scale.
* **Parameters:**  
  `obj` (entity) — the lip entity.  
  `scale` (Vector3 or table, optional) — scale vector for the lip’s animation state.
* **Returns:** Nothing.

### `SetRadius(radius)`
* **Description:** Stores the hull radius in `self.radius`.
* **Parameters:** `radius` (number) — the radius value.
* **Returns:** Nothing.

### `GetRadius(radius)`
* **Description:** Returns the stored `radius` value. *Note: The parameter `radius` is unused; the function always returns `self.radius`.*
* **Parameters:** `radius` (number, unused) — no effect.
* **Returns:** `self.radius` (number or `nil`).

### `OnDeployed()`
* **Description:** Triggers deployment animations and post-place behaviors: pushes away items if `walkableplatform` exists, plays lip animations, and schedules plank placement animation.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No-op if `self.boat_lip`, `self.plank`, or `walkableplatform` are `nil`.

### `OnSave()`
* **Description:** Returns a table with skin information for the attached plank, used during save serialization.
* **Parameters:** None.
* **Returns:** `{plank_skinname = string, plank_skin_name = string}` or `{}` if no plank.

### `LoadPostPass(ents, data)`
* **Description:** Restores skin for the plank entity post-load using `TheSim:ReskinEntity`.
* **Parameters:**  
  `ents` (table) — unused in implementation.  
  `data` (table) — save data containing `plank_skinname` and `plank_skin_name`.
* **Returns:** Nothing.
* **Error states:** Does nothing if `plank_skinname` or `self.plank` is missing.

## Events & listeners
- **Listens to:** `"onremove"` on attached `obj` entities — triggers `FinishRemovingEntity`.
- **Pushes:** None identified.
