---
id: avoidelectricfence
title: Avoidelectricfence
description: A behaviour node that triggers evasive movement when the entity is near or shocked by an electrified fence, calculating a safe flee angle and commanding locomotion to run away.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: behaviour
system_scope: entity
source_hash: d15e4d1e
---

# Avoidelectricfence

## Overview
`AvoidElectricFence` is a behaviour node within the DST behaviour tree system that enables entities to flee from electric fence hazards. It calculates a safe exit direction by averaging the vector directions *away* from all electric fence segments in a shock-affected field, and instructs the entity to run in that direction using the `Locomotor` component. The component is typically used for AI characters or creatures (e.g., Beefalo, Pigs, Wandas) that must avoid damage from electrified fences.

The component integrates with the `Brain` system via `inst.brain:ForceUpdate()` calls to respond immediately to shock events, and registers callbacks for `"startelectrocute"` and `"shocked_by_new_field"` events to dynamically update its flee angle. It depends on the `Combat` and `Locomotor` components to drop targeted entities and execute movement, respectively.

## Dependencies & Tags
- **Components used:**
  - `self.inst.components.combat` — accessed in `Visit()` to call `DropTarget()`
  - `self.inst.components.locomotor` — accessed in `Visit()` to call `RunInDirection(angle)`
- **Tags:**
  - Sets `inst._has_electric_fence_panic_trigger = true` internally for use by `BrainCommon.HasElectricFencePanicTriggerNode`
- **No tags are added/removed via `AddTag` / `RemoveTag`.**

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity instance the behaviour belongs to (assigned in constructor) |
| `run_angle` | `number?` | `nil` | Current flee direction in degrees (0–360), calculated from `GetRunAngle()`. Set when shocked; cleared implicitly on `OnStop()` or new shock event |
| `shocked_by_field` | `function` | — | Event callback handler attached to `"shocked_by_new_field"`; sets `run_angle` and forces a brain update |
| `_has_electric_fence_panic_trigger` | `boolean` | `true` | Internal flag marking the entity as responsive to electric fence panic triggers |

## Main Functions

### `AvoidElectricFence:GetRunAngle(field)`
* **Description:** Computes the direction *opposite* to the average position of all electric fence segments in the given field. The resulting angle is in degrees, normalized to `[0, 360)`. This angle represents the safest direction to flee.
* **Parameters:**
  - `field` (`table`) — A table containing at least `field.fences`, an array of fence entities, each with a `Transform` component providing world position.
* **Returns:** `number` — Flee direction in degrees.

### `AvoidElectricFence:Visit()`
* **Description:** The main behaviour-tree entry point. If `run_angle` is set, it starts the movement, drops the current combat target (if any), and commands locomotion to run in the stored direction. Should be called during behaviour tree evaluation.
* **Parameters:** None.
* **Returns:** `void`.

### `AvoidElectricFence:OnStop()`
* **Description:** Cleans up event listeners when the behaviour node exits or is destroyed to prevent memory leaks or stale callbacks.
* **Parameters:** None.
* **Returns:** `void`.

### `AvoidElectricFence:__tostring()`
* **Description:** Returns a human-readable debug string representation for logging.
* **Parameters:** None.
* **Returns:** `string` — e.g., `"AVOIDELECTRICFENCE, 45.0"`.

## Events & Listeners

- **Listens to:**
  - `"startelectrocute"` → Calls `onelectrocute(inst)` which triggers `inst.brain:ForceUpdate()` to re-evaluate the behaviour.
  - `"shocked_by_new_field"` → Calls `self.shocked_by_field`, which computes a new `run_angle` via `GetRunAngle(field)` and forces a brain update.

- **Pushes:** None.

---