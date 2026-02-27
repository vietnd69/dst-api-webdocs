---
id: itemaffinity
title: Itemaffinity
description: Grants a single non-stacking sanity bonus to a character based on the highest-priority compatible item currently held in their inventory.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: 706be926
---

# Itemaffinity

## Overview
The `ItemAffinity` component enables a character to gain a temporary sanity bonus when carrying specific items or items with certain tags. Only the highest-priority matching item’s bonus is applied at any given time—no stacking occurs. The component automatically refreshes the active bonus whenever items are added to or removed from the character’s inventory.

## Dependencies & Tags
**Component Dependencies:**
- `inst.components.inventory` — used to check for item presence.
- `inst.components.sanity.externalmodifiers` — used to apply and remove sanity bonuses.

**Tags:**  
None added or removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `affinities` | `table` | `{}` | A list of affinity records; each record defines a mapping (`prefab` or `tag`), a `sanity_bonus`, and a `priority` used to resolve conflicts. |

## Main Functions

### `AddAffinity(prefab, tag, sanity_bonus, priority)`
* **Description:** Registers a new item affinity rule. If `prefab` is provided, the bonus applies when that specific item is held; if `tag` is provided, the bonus applies to any item matching the tag. Higher `priority` values override lower ones. The active sanity bonus is recalculated immediately.
* **Parameters:**
  - `prefab`: Optional string — the prefab name of the item to check for.
  - `tag`: Optional string — the tag to match against inventory items (used if `prefab` is nil).
  - `sanity_bonus`: number — the sanity value to apply while the item is carried.
  - `priority`: number — relative priority of this affinity; higher values take precedence.

### `RemoveAffinity(prefab)`
* **Description:** Removes the affinity rule associated with a specific `prefab`. The active sanity bonus is recalculated and applied if another affinity matches.
* **Parameters:**
  - `prefab`: string — the prefab name whose affinity should be removed.

### `RefreshAffinity()`
* **Description:** Re-evaluates all registered affinities in priority order and applies the bonus from the first matching item (by `prefab` or `tag`) currently in the character’s inventory. Removes any previously applied modifier before reapplying.
* **Parameters:** None.

### `SortAffinities()`
* **Description:** Sorts the `affinities` list in descending order of `priority` (highest first). Called internally during `RefreshAffinity()`.

## Events & Listeners
- **Listens for:**
  - `"itemget"` — triggers `RefreshAffinity()` when an item is picked up.
  - `"itemlose"` — triggers `RefreshAffinity()` when an item is lost (e.g., dropped or consumed).
  - `"dropitem"` — triggers `RefreshAffinity()` when an item is explicitly dropped.