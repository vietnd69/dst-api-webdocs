---
id: debuffable
title: Debuffable
description: Manages application, tracking, and removal of debuff effects on an entity, including persistence across save/load cycles and entity transfers.
tags: [combat, effects, persistence]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: a49e4125
system_scope: entity
---

# Debuffable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `debuffable` component enables an entity to receive and maintain debuff effects, such as status conditions or visual overlays applied by other entities (e.g., `debuff` components). It tracks active debuffs by name, handles their lifecycle (creation, extension, removal), and ensures network sync and persistence across saves. It also manages tag state (`debuffable`) and supports dynamic placement of debuff visuals via follow-symbol configuration.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("debuffable")

-- Add a debuff effect
inst.components.debuffable:AddDebuff("poison", "poisonfx", { damage = 1.0 }, nil)

-- Check for presence of a debuff
if inst.components.debuffable:HasDebuff("poison") then
    print("Target is poisoned")
end

-- Update follow symbol for debuff visuals (e.g., after animation change)
inst.components.debuffable:SetFollowSymbol("WALK", 0, 0.5, 0)
```

## Dependencies & tags
**Components used:** `debuff` (via `ent.components.debuff`)
**Tags:** Adds `debuffable` when enabled; removes it when disabled.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `enable` | boolean | `true` | Whether debuff application is allowed. |
| `followsymbol` | string | `""` | The animation symbol name debuff visuals should follow. |
| `followoffset` | Vector3 | `Vector3(0, 0, 0)` | Offset from the target's position for debuff visuals. |
| `debuffs` | table | `{}` | Map of debuff names to internal records containing the debuff entity and removal callback. |

## Main functions
### `IsEnabled()`
* **Description:** Returns whether the component is currently allowing debuff application.
* **Parameters:** None.
* **Returns:** `true` if debuffs can be added; otherwise `false`.

### `Enable(enable)`
* **Description:** Enables or disables debuff application. Disabling also removes all existing debuffs unless marked `keepondespawn`.
* **Parameters:** `enable` (boolean) — whether to enable debuff processing.
* **Returns:** Nothing.

### `AddDebuff(name, prefab, data, buffer)`
* **Description:** Creates or extends a debuff effect. If a debuff with `name` does not exist, it spawns a new prefab; otherwise, it extends the existing debuff.
* **Parameters:** 
  - `name` (string) — unique identifier for the debuff type.
  - `prefab` (string) — name of the prefab to spawn for this debuff.
  - `data` (table, optional) — arbitrary data passed to the debuff.
  - `buffer` (any, optional) — additional context passed to the debuff.
* **Returns:** The spawned or extended debuff entity (`ent`), or `nil` if debuff is disabled or spawn fails.

### `RemoveDebuff(name)`
* **Description:** Removes a debuff by name, cleaning up its entity and callbacks.
* **Parameters:** `name` (string) — identifier of the debuff to remove.
* **Returns:** Nothing.
* **Error states:** No effect if `name` is not currently tracked.

### `HasDebuff(name)`
* **Description:** Checks whether a debuff with the given name is currently active.
* **Parameters:** `name` (string) — identifier to check.
* **Returns:** `true` if present; otherwise `false`.

### `GetDebuff(name)`
* **Description:** Retrieves the debuff entity associated with the given name.
* **Parameters:** `name` (string) — identifier of the debuff.
* **Returns:** The debuff entity (`ent`) or `nil` if not found.

### `SetFollowSymbol(symbol, x, y, z)`
* **Description:** Updates the follow symbol and offset for all active debuff visuals, allowing them to reattach to updated animation tracks.
* **Parameters:** 
  - `symbol` (string) — new animation symbol to follow.
  - `x`, `y`, `z` (number) — offset coordinates.
* **Returns:** Nothing.

### `RemoveOnDespawn()`
* **Description:** Removes all debuffs that do *not* have `keepondespawn` enabled (checked on the debuff's `debuff` component). Used on despawn/cleanup.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes active debuff entities for persistence. Only includes debuff data if any are active.
* **Parameters:** None.
* **Returns:** A table with fields `debuffs` (serialized debuff save records) and `add_component_if_missing = true`, or `nil` if no debuffs exist.

### `OnLoad(data)`
* **Description:** Restores debuffs from saved data during world load. Skips existing debuffs to avoid duplicates.
* **Parameters:** `data` (table, optional) — debuff data from `OnSave()`.
* **Returns:** Nothing.

### `TransferComponent(newinst)`
* **Description:** Migrates debuff state from the current component to a new entity’s `debuffable` component (e.g., on character transfer).
* **Parameters:** `newinst` (GEntity) — target entity instance.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a human-readable string listing all active debuff prefabs. Used for debugging.
* **Parameters:** None.
* **Returns:** String with count and list of debuff prefabs (one per line).

## Events & listeners
- **Listens to:** `onremove` (per debuff entity) — triggers removal of the debuff from the internal list and fires `ondebuffremoved` if defined.
- **Pushes:** `ondebuffadded` (if defined) — fired when a debuff is added; callback receives `(self.inst, name, ent, data, buffer)`.
- **Pushes:** `ondebuffremoved` (if defined) — fired when a debuff is removed; callback receives `(self.inst, name, debuff)`.
