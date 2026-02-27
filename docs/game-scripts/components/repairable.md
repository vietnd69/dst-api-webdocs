---
id: repairable
title: Repairable
description: Provides repair behavior and tagging logic for entities based on their repair properties and current state.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 79d651fc
---

# Repairable

## Overview
The `Repairable` component manages whether and how an entity can be repaired by external repair items. It tracks repair constraints (e.g., material type, health/work/perish/finite-uses state), dynamically manages entity tags to reflect repairability conditions, and executes repair actions when valid repair items are used.

## Dependencies & Tags
**Dependencies:**  
- `inst.components.health` (used if present for health-based repair logic)  
- `inst.components.workable` (used if present for work-based repair logic)  
- `inst.components.perishable` (used if present for perish-time-based repair logic)  
- `inst.components.finiteuses` (used if present for finite-uses-based repair logic)

**Tags added/removed dynamically:**  
- `"repairable_<material>"`, where `<material>` is the value of `self.repairmaterial`  
- `"healthrepairable"` when `self.healthrepairable` is true  
- `"workrepairable"` when `self.workrepairable` is true  
- `"finiteusesrepairable"` when `self.finiteusesrepairable` is true  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `repairmaterial` | `string?` | `nil` | Required material type for repairs; used to tag the entity as compatible with specific repair items. |
| `healthrepairable` | `boolean?` | `nil` | Indicates whether the entity is eligible for health-based repairs (based on current health deficit). |
| `workrepairable` | `boolean?` | `nil` | Indicates whether the entity is eligible for work-based repairs (based on remaining work left). |
| `finiteusesrepairable` | `boolean?` | `nil` | Indicates whether the entity is eligible for finite-uses-based repairs (based on remaining uses). |
| `noannounce` | `boolean?` | `nil` | Reserved; unused in provided code. |
| `checkmaterialfn` | `function?` | `nil` | Optional callback to validate repair materials beyond basic equality. |
| `testvalidrepairfn` | `function?` | `nil` | Optional callback to validate whether a repair attempt is allowed before material checks. |

## Main Functions
### `Repairable:SetHealthRepairable(repairable)`
* **Description:** Sets the `healthrepairable` flag and updates the `"healthrepairable"` tag accordingly.
* **Parameters:**  
  - `repairable` (`boolean`): Whether the entity is currently repairable via health restoration.

### `Repairable:SetWorkRepairable(repairable)`
* **Description:** Sets the `workrepairable` flag and updates the `"workrepairable"` tag accordingly.
* **Parameters:**  
  - `repairable` (`boolean`): Whether the entity is currently repairable via work restoration.

### `Repairable:SetFiniteUsesRepairable(repairable)`
* **Description:** Sets the `finiteusesrepairable` flag and updates the `"finiteusesrepairable"` tag accordingly.
* **Parameters:**  
  - `repairable` (`boolean`): Whether the entity is currently repairable via finite-uses restoration.

### `Repairable:OnRemoveFromEntity()`
* **Description:** Cleans up all repair-related tags when the component is removed from its entity.
* **Parameters:** None.

### `Repairable:NeedsRepairs()`
* **Description:** Determines whether the entity is below a repair threshold (95% health/work/perish/uses) and thus *needs* repairs. Prioritizes health > work > perish > finiteuses.
* **Parameters:** None.  
* **Returns:** `boolean` — `true` if repairs are needed, `false` otherwise.

### `Repairable:Repair(doer, repair_item)`
* **Description:** Executes a repair action on the entity using a given repair item. Validates material compatibility, runs custom checks, applies repair amounts, consumes the repair item, and triggers callbacks.
* **Parameters:**  
  - `doer` (`Entity`): The entity performing the repair (typically a player).  
  - `repair_item` (`Entity`): The item used to perform repairs (e.g., rope, glue, patch).  
* **Returns:** `boolean` — `true` if repair succeeded; `false` otherwise.

## Events & Listeners
- Listens to changes in `repairmaterial` via the `onrepairmaterial` listener (added in `Class()` constructor) → updates `"repairable_<material>"` tag.
- Listens to changes in `healthrepairable` via the `onhealthrepairable` listener → updates `"healthrepairable"` tag.
- Listens to changes in `workrepairable` via the `onworkrepairable` listener → updates `"workrepairable"` tag.
- Listens to changes in `finiteusesrepairable` via the `onfiniteusesrepairable` listener → updates `"finiteusesrepairable"` tag.