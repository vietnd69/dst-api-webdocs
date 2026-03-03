---
id: itemaffinity
title: Itemaffinity
description: Manages a priority-based sanity bonus for characters based on specific items carried in inventory.
tags: [sanity, inventory, character]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 706be926
system_scope: entity
---

# Itemaffinity

> Based on game build **7140014** | Last updated: 2026-03-03

## Overview
`ItemAffinity` assigns a single active sanity bonus to an entity based on items it carries in its inventory. The bonus is drawn from one item at a time — the highest-priority item that is present — ensuring no stacking occurs. It integrates with the `sanity` component by modifying its `externalmodifiers` list and updates dynamically when inventory changes via events (`itemget`, `itemlose`, `dropitem`). It depends on the `inventory` component for presence checks.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("itemaffinity")
inst:AddComponent("sanity")
inst:AddComponent("inventory")

-- Add an affinity for a specific item prefab
inst.components.itemaffinity:AddAffinity("lantern", nil, 5, 10)

-- Add an affinity for items with a specific tag (lower priority)
inst.components.itemaffinity:AddAffinity(nil, "candle", 3, 5)

-- Remove an existing affinity
inst.components.itemaffinity:RemoveAffinity("lantern")
```

## Dependencies & tags
**Components used:** `sanity`, `inventory`
**Tags:** None added or removed directly by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `affinities` | table of tables | `{}` | List of affinity records, each with fields `prefab` (string or `nil`), `tag` (string or `nil`), `sanity_bonus` (number), and `priority` (number). Sorted descending by `priority` internally. |

## Main functions
### `AddAffinity(prefab, tag, sanity_bonus, priority)`
* **Description:** Registers a new sanity bonus rule. A valid rule must specify exactly one of `prefab` or `tag`. Rules are sorted by `priority` (higher first); only the highest-priority matching item is applied.
* **Parameters:**
  * `prefab` (string or `nil`) — The prefab name of the item to match; `nil` if matching by tag only.
  * `tag` (string or `nil`) — The tag name to match; `nil` if matching by prefab only.
  * `sanity_bonus` (number) — The sanity value applied when the item is found.
  * `priority` (number) — Relative priority; higher values take precedence.
* **Returns:** Nothing.
* **Error states:** No explicit validation — passing `nil` for both `prefab` and `tag` will result in no match and no bonus applied.

### `RemoveAffinity(prefab)`
* **Description:** Removes a previously registered affinity by matching `prefab` exactly.
* **Parameters:** `prefab` (string) — The prefab name of the affinity to remove.
* **Returns:** Nothing.
* **Error states:** Silently does nothing if no matching affinity exists.

### `RefreshAffinity()`
* **Description:** Clears existing external modifiers and reapplies the sanity bonus from the highest-priority matching item (by prefab or tag). This is called automatically when inventory changes or when affinities are added/removed.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None. Always applies at most one modifier via `sanity.externalmodifiers`.

## Events & listeners
- **Listens to:**
  - `itemget` — Triggers refresh when an item is acquired.
  - `itemlose` — Triggers refresh when an item is lost.
  - `dropitem` — Triggers refresh when an item is dropped.
- **Pushes:** None.
