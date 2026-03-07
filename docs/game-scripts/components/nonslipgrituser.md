---
id: nonslipgrituser
title: Nonslipgrituser
description: Manages nonslip grit sources (e.g., items) on an entity and propagates delta updates to them.
tags: [inventory, item, movement]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 6afda8c5
system_scope: entity
---

# Nonslipgrituser

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`NonslipGritUser` tracks nonslip grit sources attached to an entity—typically items in its inventory—and delegates `DoDelta` calls to active grit sources. It works in conjunction with `NonslipGritSource` to apply or update nonslip effects (e.g., preventing slipping on oil). The component automatically removes itself when no valid grit sources remain attached.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("nonslipgrituser")

-- Add a grit source (e.g., an item with a nonslipgritsource component)
inst.components.nonslipgrituser:AddSource(grit_item, "grit_item_id")

-- During gameplay (e.g., in a update loop or tick)
inst.components.nonslipgrituser:DoDelta(dt)
```

## Dependencies & tags
**Components used:** `inventory`, `nonslipgritsource`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_sources` | `SourceModifierList` | `nil` (assigned in constructor) | Internal list tracking active grit sources. Uses boolean values. |

## Main functions
### `AddSource(src, key)`
*   **Description:** Registers a grit source (e.g., an item) as active. The source must have a `nonslipgritsource` component.
*   **Parameters:**  
    `src` (Entity) – the entity providing the grit effect.  
    `key` (string) – a unique identifier for this source, used for removal and duplication tracking.
*   **Returns:** Nothing.
*   **Error states:** If `src.components.nonslipgritsource` is missing, behavior is undefined—`SourceModifierList` will still track it, but `DoDelta` will silently skip it.

### `RemoveSource(src, key)`
*   **Description:** Removes a registered grit source. If no sources remain after removal, the `nonslipgrituser` component is automatically stripped from `self.inst`.
*   **Parameters:**  
    `src` (Entity) – the grit source entity to remove.  
    `key` (string) – the identifier used when adding the source.
*   **Returns:** Nothing.

### `DoDelta(dt)`
*   **Description:** Scans the entity’s inventory for items with a `nonslipgritsource` component and invokes `DoDelta(dt)` on each. This allows grit sources to apply per-frame nonslip effects (e.g., oil buildup).
*   **Parameters:**  
    `dt` (number) – elapsed time since last frame.
*   **Returns:** Nothing.
*   **Error states:** Returns early (with no effect) if `self.inst.components.inventory` is missing or if no valid grit sources are found.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.
