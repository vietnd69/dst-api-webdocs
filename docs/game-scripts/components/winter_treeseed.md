---
id: winter_treeseed
title: Winter Treeseed
description: Stores and manages the identifier for the winter tree prefab to be spawned when a treeseed breaks dormancy.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: b7b365c0
---

# Winter Treeseed

## Overview
This component holds a reference to a winter tree prefab name and provides a setter to update it. It acts as a simple configuration store for winter-related tree-spawning logic in the Entity Component System, likely used by a larger seed or growth system.

## Dependencies & Tags
None identified.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `winter_tree` | `string` | `"winter_tree"` | Prefab name of the winter tree that will be used when the seed matures or is planted. |

## Main Functions

### `SetTree(tree)`
* **Description:** Updates the stored prefab name for the winter tree.
* **Parameters:**
  * `tree` (`string`): The new prefab name to assign as the target winter tree.

## Events & Listeners
None.