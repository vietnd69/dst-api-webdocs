---
id: digester
title: Digester
description: This component periodically consumes items from an associated entity's inventory, optionally filtered by a custom function.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# Digester

## Overview
The Digester component provides functionality for an entity to periodically "digest" (consume) items from its own inventory. It schedules a recurring task to select and remove one item, which can be filtered by an optional custom function. The digestion process automatically pauses when the inventory is empty of eligible items and resumes when new items are added.

## Dependencies & Tags
This component relies on the presence of the `inventory` component on the `inst` (the parent entity). It also checks for the `"irreplaceable"` tag on items within the inventory, excluding any such tagged items from digestion.

## Properties
| Property         | Type               | Default Value | Description                                                                                                                                              |
| :--------------- | :----------------- | :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `inst`           | `Entity`           | `N/A`         | A reference to the parent entity this component is attached to.                                                                                          |
| `digesttime`     | `number`           | `20`          | The time in seconds between each attempt to digest an item.                                                                                              |
| `itemstodigestfn`| `function` / `nil` | `nil`         | An optional function that, if provided, will be called with `(inst, item)` for each item. It should return `true` if the item is eligible for digestion. |
| `task`           | `PeriodicTask`     | `N/A`         | The scheduled periodic task responsible for calling `TryDigest()`. It can be `nil` if no task is currently active.                                       |

## Main Functions
### `TryDigest()`
*   **Description:** Attempts to digest an item from the entity's inventory. It first checks if the entity has an `inventory` component. It then iterates through all items in the inventory, building a list of items that are not tagged `"irreplaceable"` and (if `itemstodigestfn` is set) pass the custom filter function. If eligible items are found, one is chosen randomly and consumed. If no eligible items are found, the periodic digestion task is cancelled.
*   **Parameters:** None.

## Events & Listeners
*   `inst:ListenForEvent("gotnewitem", function())`: Listens for the "gotnewitem" event, which is pushed when the entity receives a new item. If the digestion task (`self.task`) is not currently active (e.g., it was cancelled because the inventory was empty), this listener will restart the periodic digestion task.