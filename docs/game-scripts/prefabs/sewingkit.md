---
id: sewingkit
title: Sewingkit
description: Provides a consumable inventory item for repairing wearable equipment, using a finite number of uses and applying a fixed repair value.
tags: [crafting, inventory, repair]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a061bbfc
system_scope: inventory
---

# Sewingkit

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`sewing_kit` is a prefab that implements a reusable repair tool for wearable equipment in DST. It utilizes the `finiteuses` component to track remaining repair operations and the `sewing` component to define the repair behavior. When used on a wearable item, it triggers a repair event on the user and consumes one use, eventually depleting and removing the item entirely.

## Usage example
```lua
local inst = SpawnPrefabs("sewing_kit")
inst.Transform:SetPosition(0, 0, 0)
-- The sewing kit is now ready for use by players
-- Each repair consumes one use; upon depletion, the item is removed
```

## Dependencies & tags
**Components used:** `finiteuses`, `sewing`, `inspectable`, `inventoryitem`, `transform`, `animstate`, `network`
**Tags:** Adds `usesdepleted` when `finiteuses` reaches zero (via `finiteuses` behavior)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_specialinfo` | string | `"SEWINGKIT"` | Identifies the item for scrapbook display purposes. |
| `repair_value` (via `sewing` component) | number | `TUNING.SEWINGKIT_REPAIR_VALUE` | The durability amount restored per repair. |

## Main functions
This prefab does not define any custom top-level methods beyond the constructor logic. Its behavior is implemented entirely through attached components.

## Events & listeners
- **Listens to:** None (this prefab does not register event listeners directly).
- **Pushes:** `repair` — fired on the entity performing the repair (`doer`) when `onsewn` is triggered by the `sewing` component.
- **Pushes (via `finiteuses`):** `percentusedchange` — fired when current uses change; `usesdepleted` tag is added when uses reach zero.
- **Pushes (via `finiteuses`):** Calls `inst.Remove` when uses are exhausted (via `SetOnFinished`).