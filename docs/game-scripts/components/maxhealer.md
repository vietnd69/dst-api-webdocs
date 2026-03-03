---
id: maxhealer
title: Maxhealer
description: Applies a health penalty reduction to a target entity when consumed, typically used for revive-like consumable items.
tags: [consumable, health, revival, item]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 089cca79
system_scope: entity
---

# Maxhealer

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Maxhealer` is a component that applies a penalty reduction to a target's health by increasing their effective maximum health. It is designed for consumable items (e.g., revival items like Maxmallow) that reduce the current health penalty (i.e., heal the entity by effectively raising their max HP). The component consumes the item after use, either by decrementing stack size (if stackable) or removing the entity entirely.

This component interacts directly with the `health` component (to adjust penalty) and optionally with the `stackable` component (to handle stack consumption).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("maxhealer")
inst:AddComponent("stackable")
inst.components.maxhealer:SetHealthAmount(TUNING.MAX_HEALING_REVIVE)
-- When used:
inst.components.maxhealer:Heal(player_entity)
```

## Dependencies & tags
**Components used:** `health`, `stackable`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `healamount` | number | `TUNING.MAX_HEALING_NORMAL` | The amount of penalty reduction (as a positive value) applied when healing. Represented as a factor (e.g., percentage) of max health, not raw HP. |

## Main functions
### `SetHealthAmount(health)`
*   **Description:** Sets the amount of penalty reduction to apply during healing. This value is used in subsequent calls to `Heal()` and represents the amount to *subtract* from the target’s health penalty.
*   **Parameters:** `health` (number) — the desired penalty reduction amount (positive).
*   **Returns:** Nothing.

### `Heal(target)`
*   **Description:** Applies the configured penalty reduction to the target entity’s health. Consumes the item after successful healing (either by decrementing stack size or destroying the instance). Returns whether the healing was successful.
*   **Parameters:** `target` (Entity) — the entity to heal. Must have a `health` component.
*   **Returns:** `true` if healing was applied (i.e., target has `components.health`); otherwise `nil`.
*   **Error states:** Returns `nil` (no effect) if the target does not have a `health` component. If the item is stackable, only one unit is consumed via `stackable:Get()`, which may return a new entity (if stack size > 1). After healing, the consumed unit (either the original instance or the new one) is removed.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.
