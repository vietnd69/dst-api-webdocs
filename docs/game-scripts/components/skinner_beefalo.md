---
id: skinner_beefalo
title: Skinner Beefalo
description: Manages wearable equipment slots (body, feet, head, horn, tail) and skin application for beefalo entities.
tags: [equipment, skin, animation, beefalo, clothing]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 144d6ff8
system_scope: entity
---

# Skinner Beefalo

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Skinner_Beefalo` manages cosmetic equipment slots for beefalo entities. It tracks equipped clothing items per slot (`beef_body`, `beef_feet`, `beef_head`, `beef_horn`, `beef_tail`), updates animation symbol overrides when clothing changes, and persists clothing state across saves. It interacts with the `AnimState` component to apply skin builds and with `BEEFALO_CLOTHING` lookup tables for clothing metadata.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("skinner_beefalo")

-- Equip a new head item
inst.components.skinner_beefalo:SetClothing("beefalo_head_robot")

-- Check current clothing
local current = inst.components.skinner_beefalo:GetClothing()
print(current.beef_head) -- prints "beefalo_head_robot"

-- Clear all clothing
inst.components.skinner_beefalo:ClearAllClothing()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `clothing` | table | `{ beef_body = "", beef_horn = "", beef_head = "", beef_feet = "", beef_tail = "" }` | Holds equipped item names indexed by slot type. |

## Main functions
### `SetClothing(name)`
* **Description:** Equips a valid beefalo clothing item. Updates the corresponding slot and triggers an `onclothingchanged` event, followed by rebuilding animation overrides.
* **Parameters:** `name` (string) — the item name (key from `BEEFALO_CLOTHING`).
* **Returns:** Nothing.
* **Error states:** Has no effect if `name` is not valid (validated via `IsValidBeefaloClothing`).

### `GetClothing()`
* **Description:** Returns a copy of the current clothing table.
* **Parameters:** None.
* **Returns:** table — e.g., `{ beef_body = "...", beef_head = "..." }`.

### `IsClothingDifferent(newclothes)`
* **Description:** Compares current clothing with a candidate set. Returns `true` if any slot differs.
* **Parameters:** `newclothes` (table, optional) — candidate clothing table keyed by slot names.
* **Returns:** boolean — `true` if any mismatch, `false` otherwise.

### `HideAllClothing(anim_state)`
* **Description:** Removes all active clothing symbol overrides *without* modifying the `clothing` table.
* **Parameters:** `anim_state` (AnimState) — the animation state to clear overrides on.
* **Returns:** Nothing.

### `ClearAllClothing()`
* **Description:** Clears all clothing slots, fires `onclothingchanged` for each, and rebuilds animation overrides.
* **Parameters:** None.
* **Returns:** Nothing.

### `ClearClothing(type)`
* **Description:** Clears a single clothing slot by type, fires `onclothingchanged`, and does *not* rebuild animation overrides (caller must invoke `ApplyBuildOverrides` if needed).
* **Parameters:** `type` (string) — slot key (e.g., `"beef_head"`).
* **Returns:** Nothing.

### `ApplyTargetSkins(skins, player)`
* **Description:** Assigns item skins directly to the entity via `AnimState:AssignItemSkins`, then reapplies clothing via `ClearAllClothing` and sequential `SetClothing` calls.
* **Parameters:**
  * `skins` (table) — must contain keys: `beef_body`, `beef_feet`, `beef_horn`, `beef_tail`, `beef_head`.
  * `player` (Entity) — required to obtain `userid`.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Returns the current clothing state for serialization.
* **Parameters:** None.
* **Returns:** table — `{ clothing = self.clothing }`.

### `reloadclothing(clothing)`
* **Description:** Restores clothing state (used on world load or save restore). Validates data and fires `onclothingchanged` per slot, then rebuilds animation overrides.
* **Parameters:** `clothing` (table, optional) — clothing table to apply (usually from save data).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None.
- **Pushes:** `onclothingchanged` — fired when any clothing slot is set or cleared. Payload: `{ type = string, name = string }`, where `name` is the item name (empty string when cleared).
