---
id: constructionsite
title: Constructionsite
description: Manages the state and materials required to construct a building or object at a construction site.
tags: [crafting, inventory, world]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 855e8ce0
system_scope: crafting
---

# Constructionsite

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Constructionsite` tracks which builder is working on a site, records consumed materials, and determines when construction is complete. It is attached to entities that serve as intermediate steps during building construction (e.g., foundations, structures like foundations or houndholes). It interacts closely with `ConstructionBuilder`, `Inventory`, and `InventoryItem` to manage item consumption and builder state, and uses `Stats` to log construction events for telemetry.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("constructionsite")
inst.components.constructionsite:SetConstructionPrefab("hut")
inst.components.constructionsite:Enable()
inst.components.constructionsite:AddMaterial("planks", 10)
if inst.components.constructionsite:IsComplete() then
    inst.components.constructionsite:OnConstruct(builder, items)
end
```

## Dependencies & tags
**Components used:** `constructionbuilder`, `inventory`, `inventoryitem`, `stackable`, `container`
**Tags:** Adds `constructionsite` to the entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `materials` | table | `{}` | Maps prefab name strings to `{amount = number, slot = number?}` tables tracking how many of each item have been added. |
| `builder` | entity or `nil` | `nil` | Reference to the entity currently building at this site. |
| `constructionprefab` | string or `nil` | `nil` | Name of the final prefab this site is constructing. |
| `enabled` | boolean | `true` | Whether construction is permitted at this site. |
| `onstartconstructionfn` | function or `nil` | `nil` | Callback invoked when construction starts. |
| `onstopconstructionfn` | function or `nil` | `nil` | Callback invoked when construction stops. |
| `onconstructedfn` | function or `nil` | `nil` | Callback invoked when construction completes. |

## Main functions
### `ForceStopConstruction()`
*   **Description:** Immediately halts ongoing construction by invoking `StopConstruction()` on the attached builder's `ConstructionBuilder` component, if present.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Enable()`
*   **Description:** Enables construction at this site by setting `enabled` to `true`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Disable()`
*   **Description:** Disables construction, drops all currently stored materials, and stops any active builder.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `IsEnabled()`
*   **Description:** Returns whether construction is currently allowed.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if enabled, otherwise `false`.

### `SetConstructionPrefab(prefab)`
*   **Description:** Sets the target prefab name for this construction site, used to determine required materials via `CONSTRUCTION_PLANS`.
*   **Parameters:** `prefab` (string) — the name of the prefab to be constructed.
*   **Returns:** Nothing.

### `SetOnStartConstructionFn(fn)`
*   **Description:** Registers a callback invoked when construction begins.
*   **Parameters:** `fn` (function) — function of signature `fn(inst, doer)`.
*   **Returns:** Nothing.

### `SetOnStopConstructionFn(fn)`
*   **Description:** Registers a callback invoked when construction stops.
*   **Parameters:** `fn` (function) — function of signature `fn(inst, doer)`.
*   **Returns:** Nothing.

### `SetOnConstructedFn(fn)`
*   **Description:** Registers a callback invoked when construction completes.
*   **Parameters:** `fn` (function) — function of signature `fn(inst, doer)`.
*   **Returns:** Nothing.

### `OnStartConstruction(doer)`
*   **Description:** Records the builder and invokes the `onstartconstructionfn` callback.
*   **Parameters:** `doer` (entity) — the entity starting construction (typically a player).
*   **Returns:** Nothing.

### `OnStopConstruction(doer)`
*   **Description:** Clears the builder reference and invokes the `onstopconstructionfn` callback.
*   **Parameters:** `doer` (entity) — the entity stopping construction.
*   **Returns:** Nothing.

### `OnConstruct(doer, items)`
*   **Description:** Processes completed construction. Consumes required materials from `items`, returns overfilled items to the builder if possible, and fires the `onconstructedfn` callback.
*   **Parameters:**  
  `doer` (entity) — the entity triggering completion.  
  `items` (table) — list of item entities used in construction.
*   **Returns:** Nothing.

### `HasBuilder()`
*   **Description:** Checks if a builder is currently assigned to this site.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if a builder is assigned, otherwise `false`.

### `IsBuilder(guy)`
*   **Description:** Checks if a specific entity is the current builder.
*   **Parameters:** `guy` (entity or `nil`) — the entity to check.
*   **Returns:** `boolean` — `true` if `guy` is the assigned builder.

### `AddMaterial(prefab, num)`
*   **Description:** Attempts to add up to `num` units of `prefab` to the site's material inventory. Uses `CONSTRUCTION_PLANS` to validate and distribute across slots.
*   **Parameters:**  
  `prefab` (string) — name of the item prefab.  
  `num` (number) — quantity to add.
*   **Returns:** `number` — amount of `prefab` that could not be consumed (remainder).

### `RemoveMaterial(prefab, num)`
*   **Description:** Removes up to `num` units of `prefab` from the material inventory.
*   **Parameters:**  
  `prefab` (string) — name of the item prefab.  
  `num` (number? — defaults to `1`) — quantity to remove.
*   **Returns:** `number` — amount actually removed.

### `DropAllMaterials(drop_pos)`
*   **Description:** Spawns individual item entities for all materials stored at this site and drops them at `drop_pos`.
*   **Parameters:** `drop_pos` (Vec3 or `nil`) — position to drop items at. If `nil`, drops at current site position.
*   **Returns:** Nothing.

### `GetMaterialCount(prefab)`
*   **Description:** Returns the current count of a specific material stored.
*   **Parameters:** `prefab` (string) — the item prefab name.
*   **Returns:** `number` — count of stored material.

### `GetSlotCount(slot)`
*   **Description:** Returns the count of material stored in a specific construction slot (by index), based on `CONSTRUCTION_PLANS`.
*   **Parameters:** `slot` (number) — index into `CONSTRUCTION_PLANS`.
*   **Returns:** `number` — count of material in that slot.

### `IsComplete()`
*   **Description:** Checks if all required materials in `CONSTRUCTION_PLANS` for the current `constructionprefab` are present.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if all materials meet required amounts.

### `ForceCompletion(doer)`
*   **Description:** Instantly fulfills all missing material requirements and triggers `OnConstruct()` with an empty item list.
*   **Parameters:** `doer` (entity) — entity completing the construction.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Returns serialization data for the material inventory.
*   **Parameters:** None.
*   **Returns:** `{ materials = { [prefab] = amount, ... } }` or `nil` if no materials are stored.

### `OnLoad(data)`
*   **Description:** Restores material inventory from saved data.
*   **Parameters:** `data` (table) — contains `data.materials` mapping prefabs to amounts.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a human-readable string listing builder and per-slot material progress.
*   **Parameters:** None.
*   **Returns:** `string` — debug representation.

## Events & listeners
- **Listens to:** `onremove` (via `ConstructionSite.OnRemoveFromEntity = ForceStopConstruction`) — triggers `ForceStopConstruction()` on site removal.
- **Pushes:** `stacksizechange` (via `stackable:SetStackSize`) — emitted when excess items are returned to builder.
- **Pushes:** `stopconstruction` (via `ConstructionBuilder:StopConstruction()`) — fired when a builder stops construction.
- **Pushes:** Custom events `onstartconstructionfn`, `onstopconstructionfn`, `onconstructedfn` callbacks — invoked during construction lifecycle.
