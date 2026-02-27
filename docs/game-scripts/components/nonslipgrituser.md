---
id: nonslipgrituser
title: NonslipGritUser
description: Manages non-slip grit consumption by detecting and forwarding delta updates to applicable items in the entity's inventory.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: inventory
source_hash: 6afda8c5
---

# NonslipGritUser

## Overview
This component enables an entity (typically the player) to consume non-slip grit items from their inventory by tracking active grit sources and delegating per-frame delta processing to those items.

## Dependencies & Tags
- **Component Dependencies:** Relies on the entity having an `inventory` component to scan for grit sources.
- **Component Removal:** Automatically removes itself from the entity when no grit sources remain active (see `RemoveSource`).
- **No tags** are added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the owning entity, set in constructor. |
| `_sources` | `SourceModifierList` | `SourceModifierList(inst, false, SourceModifierList.boolean)` | Internal list tracking active grit sources; stores boolean state per source. |

## Main Functions

### `AddSource(src, key)`
* **Description:** Registers a grit source (typically an item in inventory) as active. The source is stored in `_sources` with a `true` value.
* **Parameters:**
  - `src`: The source identifier (usually the item instance).
  - `key`: A string key uniquely identifying this source (used to differentiate multiple instances or usages).

### `RemoveSource(src, key)`
* **Description:** Unregisters a grit source. If no sources remain active after removal, the component removes itself from the entity.
* **Parameters:**
  - `src`: The source identifier to remove.
  - `key`: The key used when adding the source.

### `DoDelta(dt)`
* **Description:** Called each game tick (via the world’s update loop). Finds the first item in the entity’s inventory that has a `nonslipgritsource` component and invokes its `DoDelta(dt)` method.
* **Parameters:**
  - `dt`: Delta time (number), passed directly to the grit source’s `DoDelta`.

## Events & Listeners
None.