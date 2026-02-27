---
id: maxhealer
title: Maxhealer
description: A consumable component that heals a target entity by reducing their health penalty and is consumed upon use.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: inventory
source_hash: 089cca79
---

# Maxhealer

## Overview
The `Maxhealer` component enables an entity (typically a consumable item like a Maxillae or similar) to restore a target’s health by reducing their accumulated health penalty. It is designed for single-use: after healing a target, the item is removed from the game world or stack.

## Dependencies & Tags
- Relies on the `health` component being present on the target entity.
- May interact with the `stackable` component if the item is stackable.
- No tags are added or removed by this component.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity to which this component is attached. |
| `healamount` | `number` | `TUNING.MAX_HEALING_NORMAL` | The amount of health penalty (as a raw value or percentage factor) to remove from the target upon healing. Not a health *value*, but a *penalty reduction* amount. |

## Main Functions

### `SetHealthAmount(health)`
* **Description:** Sets the amount of health penalty to be removed during the next heal operation. The comment clarifies this is a factor tied to the number of revives, not raw HP.
* **Parameters:**
  - `health` (number): The new penalty reduction amount to apply.

### `Heal(target)`
* **Description:** Applies healing to the specified target entity by reducing its health penalty. After successful healing, consumes the item (removes it from the stack or deletes it entirely).
* **Parameters:**
  - `target` (Entity): The entity to heal. Must have a `health` component.
* **Returns:** `true` if healing was applied (i.e., `target.components.health` existed and `DeltaPenalty` was called); otherwise returns `nil`.

## Events & Listeners
None identified.