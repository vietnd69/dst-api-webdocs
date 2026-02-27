---
id: grabbable
title: Grabbable
description: A deprecated component that adds the "grabbable" tag to an entity and optionally allows custom grab permission logic via a callback function.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: inventory
source_hash: 24a74a28
---

# Grabbable

## Overview
This deprecated component grants an entity the `grabbable` tag and optionally supports a custom function (`cangrabfn`) to determine whether a specific actor (`doer`) can grab the entity. As noted in the code, its functionality has been superseded by the `inventoryitem.grabbableoverridetag` mechanism.

## Dependencies & Tags
- Adds the `"grabbable"` tag to the entity on construction.
- Removes the `"grabbable"` tag when the component is removed from the entity (in `OnRemoveFromEntity`).
- Depends on the `inst` entity object supporting `AddTag`, `RemoveTag`, and event system capabilities.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *(passed to constructor)* | The entity to which this component is attached. |
| `cangrabfn` | `function?` | `nil` | Optional callback function `(inst, doer) → boolean` that overrides default grab permission logic. If set, it determines whether `doer` can grab `inst`; otherwise, `CanGrab` returns `false`. |

## Main Functions

### `SetCanGrabFn(fn)`
* **Description:** Assigns a custom function to control whether the entity can be grabbed by a given actor.
* **Parameters:**
  - `fn` *(function or nil)*: A callback accepting two arguments (`inst`, `doer`) and returning a boolean.

### `CanGrab(doer)`
* **Description:** Checks whether the entity can be grabbed by the specified actor (`doer`).
* **Parameters:**
  - `doer` *(Entity)*: The entity attempting to grab this item.
* **Returns:** `true` if a custom `cangrabfn` is set and returns `true`; otherwise `false`.

## Events & Listeners
None. This component does not register or dispatch any events.