---
id: hull
title: Hull
description: Manages the attachment, positioning, deployment, and save/load logic for boat hull components such as planks and lip assets.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 836e5e96
---

# Hull

## Overview
The `Hull` component handles the dynamic attachment, positioning, and lifecycle management of visual and functional entities associated with a boat hull—such as the deployable plank and the boat lip—alongside save/load synchronization and deployment animations.

## Dependencies & Tags
- Relies on `inst.entity` for parenting (`obj.entity:SetParent`).
- Adds the `"ignoremouseover"` tag to the `boat_lip` entity during setup.
- Listens to `"onremove"` event on attached entities to ensure cleanup.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `ENTITY` | (passed to constructor) | Reference to the entity this component is attached to (typically a boat). |
| `plank` | `ENTITY?` | `nil` | Reference to the plank entity (deployable bridge). |
| `boat_lip` | `ENTITY?` | `nil` | Reference to the boat lip entity (visual/functional edge of the hull). |
| `radius` | `number?` | `nil` | Optional radius value, typically used for placement logic or interactability. |

## Main Functions

### `FinishRemovingEntity(entity)`
* **Description:** Safely removes an attached entity if it is still valid after being notified of removal.
* **Parameters:**  
  `entity` (`ENTITY`) — The entity to remove.

### `AttachEntityToBoat(obj, offset_x, offset_z, parent_to_boat)`
* **Description:** Attaches an entity (e.g., plank or lip) to the boat. Handles both parent-child hierarchy and world-space positioning, and registers a cleanup listener.
* **Parameters:**  
  `obj` (`ENTITY`) — The entity to attach.  
  `offset_x` (`number`) — X-axis offset relative to the boat's position.  
  `offset_z` (`number`) — Z-axis offset relative to the boat's position.  
  `parent_to_boat` (`boolean`) — If `true`, makes `obj` a child of the boat's transform; otherwise, sets world position directly.

### `SetPlank(obj)`
* **Description:** Assigns the plank entity to this component.
* **Parameters:**  
  `obj` (`ENTITY`) — The plank entity.

### `SetBoatLip(obj, scale)`
* **Description:** Assigns and configures the boat lip entity, adds it as a platform follower, attaches it to the boat, and optionally applies scaling.
* **Parameters:**  
  `obj` (`ENTITY`) — The boat lip entity.  
  `scale` (`Vector3? | number?`) — Optional scale factor (passed as `scale, scale, scale` to `AnimState:SetScale`).

### `SetRadius(radius)`
* **Description:** Sets the radius value for the hull component.
* **Parameters:**  
  `radius` (`number`) — The radius to store.

### `GetRadius(radius)`
* **Description:** Returns the stored radius value.  
*Note: Parameter `radius` is unused and appears to be an error in the original code.*  
* **Parameters:**  
  *(None used)*

### `OnDeployed()`
* **Description:** Triggers animations and side effects when the hull is deployed — including placing items, animating the plank and lip, and pushing away overlapping items.
* **Parameters:**  
  *(None)*

### `OnSave()`
* **Description:** Returns save data for the plank’s skin, if present.
* **Parameters:**  
  *(None)*  
* **Returns:**  
  `{ plank_skinname: string?, plank_skin_name: string? }` — Save data table.

### `LoadPostPass(ents, data)`
* **Description:** Restores the plank’s skin after loading by calling `TheSim:ReskinEntity`.
* **Parameters:**  
  `ents` — Unused in this function (standard LoadPostPass signature).  
  `data` (`table`) — Save data containing skin identifiers.

## Events & Listeners
- Listens for `"onremove"` on attached entities via `obj:ListenForEvent("onremove", ...)` to trigger `FinishRemovingEntity`.
- Calls `self.inst:DoTaskInTime` internally (not an event listener itself).
- Pushes no events directly.
- `TheSim:ReskinEntity` is used internally but does not emit events directly via this component.

---