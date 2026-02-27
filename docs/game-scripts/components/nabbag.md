---
id: nabbag
title: Nabbag
description: A component that implements Wortox's Nabbag ability, enabling area-of-effect net casting and item nabbing within a forward cone.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 2b0860ef
---

# Nabbag

## Overview
This component implements the core logic for Wortox's *Nabbag* skill, allowing her to cast a net or pick up items in a wide forward cone. It provides two main actions: `ReplicateNetFromAct`, which applies the NET action to all valid targets in the cone, and `DoNabFromAct`, which picks up multiple items in the cone while stacking them appropriately and managing finite uses.

## Dependencies & Tags
- Adds tag `"nabbag"` to the entity on initialization.
- Removes tag `"nabbag"` when removed from the entity.
- No explicit component dependencies beyond standard actions (`ACTIONS.NET`, `ACTIONS.PICKUP`) and inventory components (e.g., `finiteuses`, `stackable`, `inventory`).

## Properties
No public instance properties are initialized in `_ctor`. However, the component uses internal mutable state:
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `replicatingnet` | `boolean?` | `nil` | Internal flag used to prevent recursive re-entry during net replication. Set to `true` during `ReplicateNetFromAct`, reset afterward. |

## Main Functions

### `ReplicateNetFromAct(act)`
* **Description:** Applies the NET action to all valid entities within a forward cone around the doer. It loops over entities found within a configurable radius and angle, invoking `ACTIONS.NET.fn(act)` for each valid target. Stops early if the item is consumed.
* **Parameters:**  
  - `act`: The action context table containing fields like `doer`, `target`, `invobject`, `rmb`, etc.

### `DoNabFromAct(act)`
* **Description:** Performs the item-nabbing behavior: first picks up the initially targeted item, then scans a forward cone for additional pick-up-able items (tagged with `"_inventoryitem"`), stacking stackables, and respecting limits on total items and uses. Temporarily overrides the inventory’s `HandleLeftoversFn` to prioritize stacking over dropping.
* **Parameters:**  
  - `act`: The action context table.  
* **Returns:**  
  - `success`: `boolean` — whether the initial pickup succeeded.  
  - `reason`: `string?` — optional reason for failure (currently unused/always `nil` on failure).

## Events & Listeners
None. This component does not register or dispatch any events.