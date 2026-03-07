---
id: repairable
title: Repairable
description: Manages repair logic and tags for entities based on their state (health, durability, perishability, uses) and associated repair materials.
tags: [repair, inventory, state, component]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 79d651fc
system_scope: entity
---

# Repairable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Repairable` component enables an entity to be repaired by compatible repair items (via the `repairer` component). It tracks repair eligibility via boolean flags and adds/removes corresponding tags (`healthrepairable`, `workrepairable`, `finiteusesrepairable`, `repairable_<material>`). It also provides logic to detect if repairs are needed and execute repairs using compatible items.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("repairable")
inst.components.repairable:SetHealthRepairable(true)
inst.components.repairable:SetWorkRepairable(false)
inst.components.repairable:SetFiniteUsesRepairable(true)
inst.components.repairable.repairmaterial = "metal"
```

## Dependencies & tags
**Components used:** `health`, `workable`, `perishable`, `finiteuses`, `repairer`, `stackable`  
**Tags:** Adds/removes dynamically:
- `healthrepairable`, `workrepairable`, `finiteusesrepairable`
- `repairable_<material>` (where `<material>` is the current `repairmaterial` value)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `repairmaterial` | string? | `nil` | Repair material type required (e.g., `"metal"`). Controls the `repairable_<material>` tag. |
| `healthrepairable` | boolean? | `nil` | Whether the entity can be repaired by increasing health. Controls the `healthrepairable` tag. |
| `workrepairable` | boolean? | `nil` | Whether the entity can be repaired by restoring work points (e.g., durability). Controls the `workrepairable` tag. |
| `finiteusesrepairable` | boolean? | `nil` | Whether the entity can be repaired by restoring finite uses. Controls the `finiteusesrepairable` tag. |
| `noannounce` | boolean? | `nil` | If set, suppresses repair announcements (not used in this file, but part of the data model). |
| `checkmaterialfn` | function? | `nil` | Optional custom function `(entity, repair_item) -> success, reason` to validate repair compatibility. |
| `testvalidrepairfn` | function? | `nil` | Optional early-rejection function `(entity, repair_item) -> boolean`. |
| `justrunonrepaired` | boolean? | `nil` | If `true`, allows `Repair()` to succeed even if no actual repair was applied. |

## Main functions
### `SetHealthRepairable(repairable)`
* **Description:** Enables or disables health-based repairability and updates the `healthrepairable` tag accordingly.
* **Parameters:** `repairable` (boolean) — whether the entity should be considered health-repairable.
* **Returns:** Nothing.

### `SetWorkRepairable(repairable)`
* **Description:** Enables or disables work-point-based repairability and updates the `workrepairable` tag accordingly.
* **Parameters:** `repairable` (boolean) — whether the entity should be considered work-repairable.
* **Returns:** Nothing.

### `SetFiniteUsesRepairable(repairable)`
* **Description:** Enables or disables finite-uses-based repairability and updates the `finiteusesrepairable` tag accordingly.
* **Parameters:** `repairable` (boolean) — whether the entity should be considered finite-uses-repairable.
* **Returns:** Nothing.

### `NeedsRepairs()`
* **Description:** Determines if the entity requires repairs by checking its current state against a threshold (95% full). Checks health first, then workable, then perishable, then finiteuses.
* **Parameters:** None.
* **Returns:** `true` if any repairable aspect is below the threshold; `false` otherwise.

### `Repair(doer, repair_item)`
* **Description:** Attempts to repair the entity using the given repair item. Validates material compatibility and repair function, then applies repairs incrementally across health, work, perish, and uses.
* **Parameters:**
  - `doer` (entity) — the entity performing the repair.
  - `repair_item` (entity) — the item being used to repair (must have `repairer` component).
* **Returns:**
  - `true` if the repair succeeded (including when `justrunonrepaired` is `true` and no actual change occurred).
  - `false` if the repair failed due to incompatibility or full state.
  - `false, reason` (string) if `checkmaterialfn` fails and returns a reason.
* **Error states:**
  - Returns `false` if `repair_item` lacks a `repairer` component.
  - Returns `false` if `repairmaterial` mismatches.
  - Returns `false` if `testvalidrepairfn` (if present) rejects the repair.
  - Returns `false` if `checkmaterialfn` (if present) returns `false` (optionally with a reason).
  - Returns `false` if the target is already at full capacity for the applicable property.

### `OnRemoveFromEntity()`
* **Description:** Cleans up all repair-related tags when the component is removed from an entity.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None — the constructor (implicitly via `Class` constructor arguments) registers callbacks for property changes (`repairmaterial`, `healthrepairable`, `workrepairable`, `finiteusesrepairable`) to manage tags automatically on updates.
- **Pushes:** `repairable` itself does not push events, but `Repair()` calls `onrepaired(self.inst, doer, repair_item)` if defined as a local closure or assigned externally.
