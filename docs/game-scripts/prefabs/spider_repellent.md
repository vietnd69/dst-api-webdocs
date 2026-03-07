---
id: spider_repellent
title: Spider Repellent
description: A consumable item that repels spiders while reducing stack usage over time.
tags: [spider, repellent, consumable, inventory]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 55610a03
system_scope: inventory
---

# Spider Repellent

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `spider_repellent` prefab is a wearable inventory item that actively repels spider-type entities within a defined radius. When equipped, it applies a repellent effect using the `repellent` component, configured to target `spider` tags while excluding `spiderqueen`. It uses the `finiteuses` component to track consumption, degrading over time until it expires and self-destructs. The item is also designed to be floatable, burnable, and hauntable.

## Usage example
```lua
local inst = SpawnPrefab("spider_repellent")
inst.components.repellent:SetRadius(5.0)  -- Customize radius if needed
inst.components.finiteuses:SetTotalUses(10)
```

## Dependencies & tags
**Components used:** `inventoryitem`, `inspectable`, `repellent`, `finiteuses`, `smallburnable`, `smallpropagator`, `hauntablelaunch`
**Tags:** Adds `spider` (via `repellent:AddRepelTag`), ignores `spiderqueen` (via `repellent:AddIgnoreTag`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `repellent.radius` | number | `TUNING.SPIDER_REPELLENT_RADIUS` | Radius in world units where spider repellency is active. |
| `repellent.use_amount` | number | `10` | Number of uses consumed per repellent activation cycle. |
| `finiteuses.maxuses` | number | `10` (set by `SetUseAmount`) | Total number of uses before exhaustion. |
| `scrapbook_specialinfo` | string | `"SPIDERREPELLENT"` | Key used by the scrapbook UI for special info rendering. |

## Main functions
### `inst:Remove()`
* **Description:** Removes the instance from the world (called automatically when `finiteuses` is exhausted).
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Safe to call multiple times; no side effects beyond first removal.

## Events & listeners
- **Listens to:** `onfinished` — implicitly via `finiteuses:SetOnFinished`, triggers `inst:Remove()` when depleted.
- **Pushes:** None directly. Relies on `finiteuses` component for exhaustion events.