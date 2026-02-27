---
id: shop
title: Shop
description: A component that manages shop-related configuration and spawns merchant items at a specific location above the entity.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: ec36853b
---

# Shop

## Overview
This component provides configuration for shop UI display (via `tab` and `title`) and a method to physically spawn a list of items as loot drops above the entity's current position in the world. It does not handle inventory management,交易 logic, or UI rendering itself—it focuses on item spawning and metadata storage.

## Dependencies & Tags
- `Transform` component (required for `GetWorldPosition`)
- `Physics` component (used conditionally when spawning items; per-item dependency)

No explicit component additions or tag modifications are performed.

## Properties

| Property | Type     | Default Value | Description                                      |
|----------|----------|---------------|--------------------------------------------------|
| `inst`   | `Entity` | `nil`         | The owning entity instance (assigned in constructor) |
| `tab`    | `string` | `""`          | Default tab identifier for the shop UI           |
| `title`  | `string` | `"Shop"`      | Display title used for the shop UI               |

## Main Functions

### `SetStartTab(tab)`
* **Description:** Sets the initial tab identifier to be used by the shop UI.
* **Parameters:**
  * `tab` (`string`): The tab name to set as the starting view.

### `SetTitle(title)`
* **Description:** Sets the display title of the shop.
* **Parameters:**
  * `title` (`string`): The title string to use.

### `DeliverItems(items)`
* **Description:** Spawns each item prefab in the `items` list as a physical object above the entity's position. Items are spawned with randomized velocities if they have physics, or randomized horizontal offsets otherwise.
* **Parameters:**
  * `items` (`table`): A list (array-like table) of prefab names (strings) to spawn. Throws an assertion failure if `nil`.

## Events & Listeners
None.