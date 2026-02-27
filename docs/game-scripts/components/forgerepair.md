---
id: forgerepair
title: Forgerepair
description: Handles item-based repair operations by restoring damaged armor, finite-uses, or fueled components to full durability while consuming the repair item.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: crafting
source_hash: ad4c7423
---

# Forgerepair

## Overview
This component enables an entity (typically a tool or material used for repairs) to restore target entities to full durability by checking for compatible components (`armor`, `finiteuses`, or `fueled`) and applying full repair when possible. It also supports optional cleanup of the repair item upon successful use and executes custom logic via an `onrepaired` callback.

## Dependencies & Tags
- Adds/Removes tags dynamically based on `repairmaterial`: `"forgerepair_"..material`  
- Relies on target entities having at least one of the following components: `armor`, `finiteuses`, or `fueled`.  
- May interact with `finiteuses` or `stackable` on the repair item itself for consumption logic.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `repairmaterial` | `string?` | `nil` | The type of material used for repair; used to assign/remove entity tags. Automatically synced via the `onrepairmaterial` callback when set via `SetRepairMaterial`. |
| `onrepaired` | `function?` | `nil` | Optional callback function invoked after a successful repair. Signature: `fn(repair_item, target, doer)`. |

## Main Functions
### `SetRepairMaterial(material)`
* **Description:** Sets the repair material type, which triggers tag updates on the entity (removing the old `forgerepair_*` tag, if any, and adding a new one based on the material).  
* **Parameters:**  
  * `material` (`string?`): The material identifier. If `nil`, no tag is added.

### `SetOnRepaired(fn)`
* **Description:** Registers a custom callback to be executed after a repair is successfully applied.  
* **Parameters:**  
  * `fn` (`function?`): A function with signature `fn(repair_item, target, doer)`. May be `nil` to clear the callback.

### `OnRepair(target, doer)`
* **Description:** Attempts to fully repair the target entity. It checks for compatible components (`armor`, `finiteuses`, `fueled`) in order; if found and not already at full durability, it sets their durability to 100%. Upon success, it consumes the repair item (via `finiteuses:Use`, `stackable:Get():Remove`, or direct removal) and invokes `onrepaired`.  
* **Parameters:**  
  * `target` (`Entity`): The entity to be repaired.  
  * `doer` (`Entity?`): The entity performing the repair (e.g., the player).  
* **Returns:** `boolean` — `true` if a repair was successfully applied; `false` otherwise.

## Events & Listeners
* Listens for changes to `repairmaterial` via the `onrepairmaterial` function, which updates tags automatically.