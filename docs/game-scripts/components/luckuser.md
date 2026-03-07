---
id: luckuser
title: Luckuser
description: Manages luck modifiers and adjusts hounded target behavior based on cumulative luck value.
tags: [luck, combat, ai, modifier]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 2d451c3c
system_scope: entity
---

# Luckuser

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Luckuser` is an entity component that tracks and aggregates luck modifiers via a `SourceModifierList`, then dynamically influences the `houndedtarget` component’s behavior based on the net luck value. When luck is negative, it increases the entity’s attractiveness to Hound thieves; positive luck has no such effect. This component is designed to be attached to entities (e.g., characters or critters) whose luck status affects enemy targeting behavior.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("luckuser")

-- Apply a luck modifier
inst.components.luckuser:SetLuckSource(2, "special_item")

-- Retrieve current luck value
local current_luck = inst.components.luckuser:GetLuck()

-- Remove a modifier
inst.components.luckuser:RemoveLuckSource("special_item")
```

## Dependencies & tags
**Components used:** `houndedtarget` (accessed via `self.inst.components.houndedtarget`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `luckmodifiers` | `SourceModifierList` | `SourceModifierList(inst, 0, SourceModifierList.additive)` | Aggregates luck modifier sources and computes net luck value. |

## Main functions
### `OnRemoveFromEntity()`
*   **Description:** Cleanup handler called when the component is removed from an entity. Resets modifier lists and refreshes internal luck state.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetLuck()`
*   **Description:** Returns the current net luck value (sum of all modifiers).
*   **Parameters:** None.
*   **Returns:** `number` — The aggregated luck value.

### `SetLuckSource(luck, source)`
*   **Description:** Adds or updates a luck modifier source. If `luck` is `0`, it removes the source instead.
*   **Parameters:**
    *   `luck` (number) — The luck value to apply for this source.
    *   `source` (string) — Identifier for the modifier source (used for adding/removing).
*   **Returns:** Nothing.
*   **Error states:** Passing `luck == 0` has the side effect of removing the source rather than setting it.

### `RemoveLuckSource(source)`
*   **Description:** Removes a specific luck modifier source.
*   **Parameters:** `source` (string) — Identifier of the modifier to remove.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a formatted debug string for UI or console output.
*   **Parameters:** None.
*   **Returns:** `string` — A string of the form `"luck: X.XX"`.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.

### `_UpdateLuck_Internal()`
*   **Description:** Internal method invoked after modifier changes to synchronize `houndedtarget` behavior with current luck. If net luck is negative, it modifies `target_weight_mult` and `hound_thief_sources` in `houndedtarget`. If luck is non-negative, it clears those modifiers.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Side effects:** May add `houndedtarget` component if not present. Always modifies or removes modifiers using source `"misfortune"`.
