---
id: moontrader
title: Moontrader
description: A component that enables an entity to accept and process offerings from players, optionally validating offers and triggering custom logic upon acceptance.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 8156d3a7
---

# Moontrader

## Overview
The `Moontrader` component allows an entity (typically a structure or NPC) to accept offerings—physical items provided by players. It supports custom validation logic via a callback function (`canaccept`) and custom post-acceptance behavior via another callback (`onaccept`). When an offering is accepted, the item is consumed (removed from the game world) and the appropriate callbacks are invoked. The component also automatically adds the `"moontrader"` tag to the owning entity.

## Dependencies & Tags
- **Dependencies:** None (does not require other components to function).
- **Tags added:** `"moontrader"` (added to the entity via `inst:AddTag("moontrader")` in the constructor).

## Properties

| Property    | Type     | Default Value | Description |
|-------------|----------|---------------|-------------|
| `inst`      | `Entity` | *(inherited)* | Reference to the entity the component is attached to. |
| `canaccept` | `function?` | `nil` | Optional callback function `fn(inst, item, giver)` that returns `success (bool), reason (string?)`. If `nil`, no validation is performed. |
| `onaccept`  | `function?` | `nil` | Optional callback function `fn(inst, giver, item)` invoked after a successful offering acceptance. |

## Main Functions

### `SetCanAcceptFn(fn)`
* **Description:** Sets the validation callback function used to determine whether an offering should be accepted. If not set, all offerings are implicitly accepted (barring item handling errors).
* **Parameters:**
  - `fn` (*function*): A function with signature `fn(inst, item, giver) -> success (bool), reason? (string)`. Must return `true` and optionally a rejection reason.

### `SetOnAcceptFn(fn)`
* **Description:** Sets the post-acceptance callback function executed after a successful offering. Typically used for reward logic, feedback, or state changes.
* **Parameters:**
  - `fn` (*function*): A function with signature `fn(inst, giver, item)`, where `item` is the offering (possibly dereferenced from a stack).

### `AcceptOffering(giver, item)`
* **Description:** Processes an incoming offering. Validates via `canaccept`, retrieves/dereferences stackable items, invokes `onaccept` on success, and removes the item from the game.
* **Parameters:**
  - `giver` (*Entity*): The player/entity providing the item.
  - `item` (*Entity*): The offering item entity.
* **Returns:** `true` on success; `false, reason` if validation failed.

## Events & Listeners
None.