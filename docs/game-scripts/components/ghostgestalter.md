---
id: ghostgestalter
title: Ghostgestalter
description: Manages activation tags and mutation logic for ghost-based entities in the Entity Component System.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 8e806889
---

# Ghostgestalter

## Overview
The `Ghostgestalter` component manages activation-related tags (e.g., `standingactivation`, `quickactivation`, `activatable_forceright`, `activatable_forcenopickup`) for an entity, enabling dynamic control over how the entity responds to interaction types (e.g., standing, quick, right-click, or force-pickup activation). It also supports optional mutation logic via a customizable function (`domutatefn`) and ensures proper cleanup of tags upon removal.

## Dependencies & Tags
**Dependencies:**
- None identified (relies only on standard engine APIs: `inst:AddOrRemoveTag`, `inst:RemoveTag`, `Class` framework).

**Tags Added/Removed:**
- `standingactivation`
- `quickactivation`
- `activatable_forceright`
- `activatable_forcenopickup`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the owning entity instance. |
| `OnActivate` | `function?` | `nil` | Callback function invoked on activation; provided at construction. |
| `standingaction` | `boolean` | `false` | Whether the entity supports standing activation. |
| `quickaction` | `boolean` | `false` | Whether the entity supports quick activation. |
| `forcerightclickaction` | `boolean` | `false` | Whether the entity requires force-right-click activation. |
| `forcenopickupaction` | `boolean` | `false` | Whether the entity is non-pickupable (requires force activation). |
| `domutatefn` | `function?` | `nil` | Optional mutation function accepting `(inst, doer)` and returning a value. |

## Main Functions
### `OnRemoveFromEntity()`
* **Description:** Removes all activation-related tags from the entity when the component is removed (e.g., on entity destruction or component unregistration).  
* **Parameters:** None.

### `DoMutate(doer)`
* **Description:** Executes the optional `domutatefn` mutation callback (if set) with the entity and activator as arguments. Returns the result of the callback.  
* **Parameters:**  
  - `doer`: The entity performing the mutation (e.g., player).

## Events & Listeners
* Listens for changes to `standingaction`, `quickaction`, `forcerightclickaction`, and `forcenopickupaction` via direct function hooks defined in the class metatable (not `ListenForEvent`). These are *property setters*—when assigned (e.g., `component.standingaction = true`), the corresponding callback (`onstandingaction`, etc.) runs, updating the relevant tag.