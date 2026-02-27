---
id: simplebook
title: Simplebook
description: Adds a simple interactive component that allows an entity to be "read", optionally executing a custom callback when read.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 78df29c0
---

# Simplebook

## Overview
The `Simplebook` component enables an entity to act as a readable object (e.g., a book or note). When an entity with this component is "read" (typically via player interaction), it checks line-of-sight/visibility and, if valid, executes an optional callback function (`onreadfn`) provided externally. It also automatically adds and removes the `"simplebook"` tag on attachment/removal from an entity.

## Dependencies & Tags
- **Component Tags:** Adds the `"simplebook"` tag to the entity on initialization; removes it on `OnRemoveFromEntity`.
- **External Dependencies:** Relies on the global function `CanEntitySeeTarget(doer, target)` for visibility checks.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *(assigned from constructor)* | Reference to the owning entity. |
| `onreadfn` | `function?` | `nil` | Optional callback function that executes when the book is read. Signature: `function(inst, doer)`. Not initialized in the constructor but used by the `Read` method. |

## Main Functions

### `Read(doer)`
* **Description:** Handles the "read" action on the entity. First verifies that the `doer` (e.g., a player) can see the book. If visible and an `onreadfn` callback is set, it invokes the callback with the book entity and the `doer` as arguments. Returns `false` if the action fails (e.g., not visible); otherwise returns `nil`.
* **Parameters:**
  * `doer` (**Entity**): The entity performing the read action (typically a player).

## Events & Listeners
None.