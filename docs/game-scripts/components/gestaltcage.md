---
id: gestaltcage
title: Gestaltcage
description: Manages targeting and capturing of Gestalt-type creatures by holding them temporarily and converting them into a filled gestalt cage upon successful capture.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: ad598264
---

# Gestaltcage

## Overview
This component enables an entity (typically a gestalt cage item) to target valid Gestalt creatures, and when the `Capture` function is invoked, it exchanges the current entity for a level-specific gestalt_cage_filled prefab containing the captured creature. It coordinates with the target's `gestaltcapturable` component to manage the capture lifecycle.

## Dependencies & Tags
- **Component Dependencies:**
  - `inst.components.gestaltcapturable` (on the target entity) — required for capture validity and state tracking
  - `inst.components.inventoryitem` (on the cage entity itself) — optionally used to determine grand owner position for placement

- **Tags:** None explicitly added or removed by this component.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (assigned in constructor) | Reference to the entity this component is attached to (typically a gestalt cage). |
| `target` | `Entity?` | `nil` | Current entity being targeted for capture. Null or invalid targets are ignored. |

> Note: `inst` is assigned via the constructor parameter, while `target` is initialized to `nil`.

## Main Functions

### `Capture(target, doer)`
* **Description:** Attempts to capture the specified `target` using the `doer` (usually the player performing the action). Validates targeting, proximity, and capturability, then replaces the current gestalt cage entity with a filled gestalt cage prefab based on the target's Gestalt level.  
* **Parameters:**
  * `target` (`Entity`): The Gestalt creature to capture. Must be valid and have a functional `gestaltcapturable` component.
  * `doer` (`Entity`): The entity initiating the capture (typically the player). Must be within 1 tile of the target.

* **Returns:**  
  * `true` (on success)  
  * `false, "MISSED"` (on failure) — failure reasons include invalid target, out-of-range doer, or un-capturable target.

### `OnTarget(target)`
* **Description:** Sets a new target for capture if it is valid and implements the `gestaltcapturable` component. Automatically clears any previous target via `OnUntarget` before assigning the new one.  
* **Parameters:**
  * `target` (`Entity`): The entity to mark as the current target.

### `OnUntarget(target)`
* **Description:** Clears the current target (if specified) or all targets (if called with no argument), and notifies the target’s `gestaltcapturable` component that it is no longer being targeted.  
* **Parameters:**
  * `target` (`Entity?`, optional): If provided, only clears if this matches the currently stored target. If `nil`, clears regardless of value.

### `OnRemoveFromEntity()`
* **Description:** Automatically called when the component is removed from its entity. Ensures any lingering target is properly released by invoking `OnUntarget()`.

## Events & Listeners
None. This component does not register event listeners or push events directly. It communicates via direct method calls (e.g., `target.components.gestaltcapturable:OnTargeted(...)`).