---
id: digester
title: Digester
description: Periodically digests random non-irreplaceable items from an entity's inventory at fixed intervals.
tags: [inventory, automation, periodic]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 9edda1dd
system_scope: inventory
---

# Digester

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Digester` component enables an entity to automatically consume (digest) one random non-irreplaceable item from its own inventory at a fixed time interval (`digesttime`, defaulting to `20` seconds). It is typically attached to entities that function as organic processing units (e.g., compost bins or biological digesters) and works in tandem with the `inventory` component. If no digestible items are present, the periodic task is automatically cancelled until a new item is added.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("inventory")
inst:AddComponent("digester")
-- Optionally set a custom digestion predicate
inst.components.digester.itemstodigestfn = function(ent, item)
    return item:HasTag("food")
end
```

## Dependencies & tags
**Components used:** `inventory`
**Tags:** Checks `irreplaceable` tag on individual items; does not manage entity-level tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `digesttime` | number | `20` | Interval in seconds between digest attempts. |
| `itemstodigestfn` | function or `nil` | `nil` | Optional predicate function `(entity, item) -> boolean` that determines whether an item should be digestible. If `nil`, all non-`irreplaceable` items are digestible. |
| `task` | Task or `nil` | `nil` (initialized after construction) | The active periodic task for digest attempts; `nil` when no digest loop is running. |

## Main functions
### `TryDigest()`
* **Description:** Attempts to digest one item from the entity's inventory. It collects all digestible items (those without the `irreplaceable` tag, optionally filtered by `itemstodigestfn`), then consumes a random one using `inventory:ConsumeByName`. If no digestible items exist, it cancels the periodic task.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** If `self.inst.components.inventory` is missing, the function does nothing and returns immediately. If no digestible items are found, the current periodic task (`self.task`) is cancelled and set to `nil`.

## Events & listeners
- **Listens to:** `gotnewitem` - Restarts the digest periodic task if it was previously cancelled due to empty inventory.
- **Pushes:** None.
