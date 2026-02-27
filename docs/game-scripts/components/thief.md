---
id: thief
title: Thief
description: A component enabling an entity to steal stealable items from other entities' inventories or containers, optionally attacking the victim first.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
---

# Thief

## Overview
The `Thief` component provides the logic for an entity to steal items from victims (players or other entities) by interacting with their `inventory` or `container` components. If no specific item is targeted, it selects a random stealable item (i.e., one not tagged with `"nosteal"`). It optionally triggers a combat attack before stealing and notifies listeners via a configurable callback and game events.

## Dependencies & Tags
- Relies on the victim having either an `inventory` component (for player-like entities) or a `container` component (for container-like entities such as chests or monsters with loot).
- Relies on the thief having a `combat` component when `attack = true`.
- Relies on the victim having `equippable`, `inventoryitem`, and `owner` components under specific conditions when `attack = true`.
- Tags: None added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the entity this component is attached to. |
| `stolenitems` | `table` | `{}` (empty table) | Deprecated array intended to hold references to stolen items; no longer used and may be removed in future. |
| `onstolen` | `function?` | `nil` | Optional callback function set via `SetOnStolenFn`, invoked after a successful steal with arguments `(thief, victim, item)`. |

## Main Functions

### `SetOnStolenFn(fn)`
* **Description:** Sets the optional callback function to be executed whenever an item is successfully stolen.
* **Parameters:**
  * `fn` (`function?`): A function of the form `function(thief, victim, item)` that will be called after each successful steal operation. Pass `nil` to clear.

### `StealItem(victim, itemtosteal, attack)`
* **Description:** Attempts to steal an item from a victim. If `itemtosteal` is provided, that specific item is stolen; otherwise, a random stealable item is selected. If `attack` is true, the thief attacks the victim before stealing (using `combat:DoAttack`). Supports stealing from inventory-based victims (e.g., players) or container-based victims (e.g., mobs with loot or chests).
* **Parameters:**
  * `victim` (`Entity`): The target entity from which to steal.
  * `itemtosteal` (`GameObject?`, optional): A specific item to steal. If omitted, a random stealable item is selected.
  * `attack` (`boolean`, optional): Whether to attack the victim before stealing. Defaults to `false` if omitted. If true and the victim is equipped and owned, the thief attacks the *owner* (not the victim directly).

## Events & Listeners
- Listens for no events itself.
- Emits the following event on the victim entity upon successful theft:
  - `onitemstolen` with payload `{ item = item, thief = self.inst }`