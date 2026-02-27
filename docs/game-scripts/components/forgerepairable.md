---
id: forgerepairable
title: Forgerepairable
description: Enables entities to be repairable via forge-specific repair materials by managing tags and repair logic.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 18e1a2a7
---

# Forgerepairable

## Overview
This component integrates with the Entity Component System to make an entity repairable using forge-compatible repair items. It tracks whether the entity is repairable, which material is used for repairs, and manages the associated `"forgerepairable_<material>"` tag. Repair is initiated through the `Repair()` method, which validates compatibility and executes the repair process.

## Dependencies & Tags
- **Component Dependencies**:  
  - `armor` (used to determine initial `repairable` state if present)  
  - `fueled` (used as fallback to determine initial `repairable` state if `armor` is absent)  
  - `forgerepair` (required on the repair item passed to `Repair()`)
- **Tags**:  
  - Adds `"forgerepairable_<material>"` when `repairable` is `true` and `repairmaterial` is non-`nil`.  
  - Removes the same tag on `SetRepairable(false)` or `OnRemoveFromEntity()`, or when `repairmaterial` changes.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `repairmaterial` | `string` or `nil` | `nil` | The material name (e.g., "gold", "iron") required to repair this entity. Used to generate the repair tag and validate compatible repair items. |
| `repairable` | `boolean` or `nil` | `nil` | Indicates whether the entity is currently in a repairable state. Derived initially from `armor:IsDamaged()` or `fueled:GetPercent() < 1`. |
| `onrepaired` | `function` or `nil` | `nil` | Optional callback invoked after a successful repair; signature: `fn(inst, doer, repair_item)`. |

## Main Functions

### `SetRepairMaterial(material)`
* **Description:** Sets the repair material used by this entity and updates the `"forgerepairable_<material>"` tag based on current `repairable` state.
* **Parameters:**  
  - `material` (`string` or `nil`): The repair material identifier.

### `SetRepairable(repairable)`
* **Description:** Updates whether the entity is currently repairable and ensures the `"forgerepairable_<material>"` tag is correctly added or removed.
* **Parameters:**  
  - `repairable` (`boolean`): Whether the entity is repairable.

### `SetOnRepaired(fn)`
* **Description:** Registers a callback to be executed after a successful repair.
* **Parameters:**  
  - `fn` (`function` or `nil`): Callback function taking `(inst, doer, repair_item)` as arguments.

### `Repair(doer, repair_item)`
* **Description:** Attempts to repair the entity using the provided repair item. Returns `true` if successful, `false` otherwise. Performs checks for material compatibility, current repairable state, and delegates to `repair_item.components.forgerepair:OnRepair()`.
* **Parameters:**  
  - `doer` (`Entity`): The entity performing the repair (e.g., a player).  
  - `repair_item` (`Entity`): The item used for repair; must have a `forgerepair` component with matching `repairmaterial`.

### `OnRemoveFromEntity()`
* **Description:** Cleans up the `"forgerepairable_<material>"` tag when the component is removed from the entity.

## Events & Listeners
- Listens for changes to:
  - `repairmaterial` → calls `onrepairmaterial` to update tags.
  - `repairable` → calls `onrepairable` to update tags.  
- Triggers no events itself, but invokes `self.onrepaired(...)` on successful repair.