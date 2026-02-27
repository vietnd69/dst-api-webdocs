---
id: furnituredecor
title: Furnituredecor
description: A component that tracks whether an entity is placed on a furniture object and manages associated visual and behavioral state, including a "furnituredecor" tag.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: c8b15c7b
---

# Furnituredecor

## Overview
The `FurnitureDecor` component tracks whether an entity is placed on a furniture item, manages the `"furnituredecor"` tag for optimized rendering or behavior, and supports optional callback hooks when the entity is placed or removed from furniture.

## Dependencies & Tags
- Adds/Removes Tag: `"furnituredecor"` via `AddOrRemoveTag` (controlled by `enabled` state)
- Does *not* add the tag by default in `_ctor` (the tag addition is commented out), relying instead on runtime toggling via the `enabled` setter.
- No other components are directly added or required.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *(injected)* | The entity instance this component is attached to. |
| `enabled` | `boolean` | `true` | Controls whether the `"furnituredecor"` tag is present on the entity. |
| `on_furniture` | `boolean?` | `nil` | Tracks whether the entity is currently placed on a furniture object (`true` when on furniture, `nil` otherwise). |
| `decor_animation` | `string` | `"idle"` | A hint for animation state (currently unused in this codebase snippet). |

## Main Functions
### `onenabled(self, enabled)`
* **Description:** Internal setter function invoked when the `enabled` property is assigned. It adds or removes the `"furnituredecor"` tag based on the new value.
* **Parameters:**  
  - `enabled` (`boolean`): The new enabled state.

### `SetEnabled(enabled)`
* **Description:** Sets the `enabled` state and ensures `onenabled` is triggered (via property assignment, as defined in the class metatable).
* **Parameters:**  
  - `enabled` (`boolean`): Whether the `"furnituredecor"` tag should be active.

### `IsOnFurniture()`
* **Description:** Returns whether the entity is currently placed on a furniture item.
* **Parameters:** None.

### `PutOnFurniture(furniture)`
* **Description:** Marks the entity as being placed on furniture and invokes the optional `onputonfurniture` callback, if set.
* **Parameters:**  
  - `furniture` (`Entity?`): The furniture object the entity is placed on (passed to the callback, if any).

### `TakeOffFurniture(furniture)`
* **Description:** Clears the "on furniture" state and invokes the optional `ontakeofffurniture` callback, if set.
* **Parameters:**  
  - `furniture` (`Entity?`): The furniture object the entity was removed from (passed to the callback, if any).

## Events & Listeners
- Listens for no events itself.
- Does not push events directly.
- Supports optional callback properties:
  - `self.onputonfurniture` — callable on `PutOnFurniture`
  - `self.ontakeofffurniture` — callable on `TakeOffFurniture`