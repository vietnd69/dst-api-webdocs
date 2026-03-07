---
id: boatrotator
title: Boatrotator
description: Manages the rotation direction synchronization between a character entity and its current boat platform.
tags: [locomotion, boat, platform]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 01830615
system_scope: locomotion
---

# Boatrotator

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`BoatRotator` ensures that a character’s rotation stays synchronized with the boat they are currently standing on. When the player boards or unboards a boat, this component updates their orientation and registers/removes itself from the boat’s rotation system. It works in conjunction with the `boatring` component to propagate rotation direction changes across all rotators attached to a given boat.

## Usage example
```lua
local inst = TheEntityIterator():Find(function(e) return e:HasTag("character") end)
if inst then
    inst:AddComponent("boatrotator")
    -- Rotation sync happens automatically when the character boards a boat
end
```

## Dependencies & tags
**Components used:** `boatring` (via `boat.components.boatring`), `transform`, `stategraph`  
**Tags:** Checks for `boat` tag on platform entities.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `boat` | entity or `nil` | `nil` | Reference to the current boat entity the character is on. |
| `OnBoatRemoved` | function | `function() self.boat = nil end` | Callback handler fired when the boat entity is removed. |
| `OnBoatDeath` | function | `function() self:OnDeath() end` | Callback handler fired when the boat entity dies. |
| `_setup_boat_task` | task or `nil` | `nil` | Delayed task used to initialize boat reference on component construction. |

## Main functions
### `SetRotationDirection(dir)`
*   **Description:** Sets the rotation direction of the boat the character is currently on. Non-zero directions are normalized to `-1` (counterclockwise) or `+1` (clockwise); zero stops rotation. Updates all rotators on the boat via the boat’s `boatring` component and broadcasts a `rotationdirchanged` event.
*   **Parameters:** `dir` (number) - Target rotation direction (positive for clockwise, negative for counterclockwise, zero for stopped).
*   **Returns:** Nothing.
*   **Error states:** Returns early without action if the current platform is `nil`, lacks a `boatring` component, or is missing the `boat` tag.

### `SetBoat(boat)`
*   **Description:** Assigns or clears the boat association for the character. When assigning, it matches the character’s rotation to the boat’s, registers as a rotator, updates the `direction` memory slot in the character’s stategraph, and may refresh the `idle` state if active. Sets up cleanup event listeners when a boat is assigned.
*   **Parameters:** `boat` (entity or `nil`) - The boat entity to associate, or `nil` to detach.
*   **Returns:** Nothing.
*   **Error states:** No-op if the new boat is identical to the current one.

### `OnDeath()`
*   **Description:** Handles the boat’s death event by clearing the boat association.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnRemoveFromEntity()`
*   **Description:** Cleans up pending setup task when the component is removed from its entity.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnRemoveEntity()`
*   **Description:** Ensures boat association is cleared when the owning entity is removed.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `onremove` (from boat) — triggers `OnBoatRemoved`.  
  - `death` (from boat) — triggers `OnBoatDeath`.  
- **Pushes:** None directly. However, `SetRotationDirection` causes the boat to `PushEvent("rotationdirchanged", dir)`.
