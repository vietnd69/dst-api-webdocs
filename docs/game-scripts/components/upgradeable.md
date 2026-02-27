---
id: upgradeable
title: Upgradeable
description: Manages upgrade progression for an entity through configurable stages and upgrade counts.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 3fcf5ff1
---

# Upgradeable

## Overview
This component enables an entity to track and manage hierarchical upgrade progression across multiple stages, incrementally consuming upgradable items to advance toward higher tiers. It integrates with tags for visual/state representation, supports custom upgrade logic via callbacks, and persists state across saves.

## Dependencies & Tags
- Adds or removes the tag `<upgradetype>_upgradeable` based on `CanUpgrade()` state (e.g., `"furniture_upgradeable"`).
- Does *not* automatically add any components, but expects the `obj` passed to `:Upgrade()` to have a component named `upgrader` (with numeric property `upgradevalue`), and optionally `stackable`.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `upgradetype` | `string` | `UPGRADETYPES.DEFAULT` | Category identifier used to generate dynamic tags and debug output. |
| `stage` | `number` | `1` | Current upgrade stage (1-indexed). |
| `numstages` | `number` | `3` | Total number of stages available for upgrade. |
| `upgradesperstage` | `number` | `5` | Number of upgrade actions required per stage. |
| `numupgrades` | `number` | `0` | Number of upgrades applied in the current stage. |
| `onstageadvancefn` | `function?` | `nil` | Optional callback invoked when advancing to the next stage (`fn(inst)`). |
| `onupgradefn` | `function?` | `nil` | Optional callback invoked after a successful upgrade (`fn(inst, performer, item)`). |
| `canupgradefn` | `function?` | `nil` | Optional callback that determines if upgrade is allowed (`fn(inst) → bool, reason?`). |

## Main Functions

### `AdvanceStage()`
* **Description:** Increments the current stage and resets `numupgrades` to `0`. Optionally invokes the `onstageadvancefn` callback.
* **Parameters:** None.

### `CanUpgrade()`
* **Description:** Returns whether the entity can currently accept another upgrade. Checks both internal stage limits and an optional custom `canupgradefn`.
* **Parameters:** None.  
* **Returns:** `bool` — `true` if upgrade is allowed; otherwise `false`. May return a secondary `reason` string when `canupgradefn` is set.

### `Upgrade(obj, upgrade_performer)`
* **Description:** Processes a single upgrade action using the provided `obj` (an item with an `upgrader` component). Consumes the item and advances the stage if upgrade threshold is met.
* **Parameters:**
  - `obj`: The entity providing the upgrade; must have an `upgrader` component (with `upgradevalue` property).
  - `upgrade_performer`: Entity performing the upgrade (passed to `onupgradefn`).

### `SetOnUpgradeFn(fn)`
* **Description:** Assigns a callback to be invoked each time `Upgrade()` is successfully called.
* **Parameters:**
  - `fn`: Function of the form `function(inst, performer, item)`.

### `SetCanUpgradeFn(fn)`
* **Description:** Assigns a custom predicate to determine if an upgrade is permitted.
* **Parameters:**
  - `fn`: Function of the form `function(inst) → bool, reason?`.

### `GetStage()`
* **Description:** Returns the current upgrade stage number.
* **Parameters:** None.

### `SetStage(num)`
* **Description:** Manually sets the current upgrade stage (e.g., for debugging or scripted events).
* **Parameters:**
  - `num`: Integer stage value.

### `OnSave()`
* **Description:** Returns a data table containing the current `stage` and `numupgrades` for serialization.
* **Parameters:** None.  
* **Returns:** `table` — `{"numupgrades": number, "stage": number}`.

### `OnLoad(data)`
* **Description:** Restores `numupgrades` and `stage` from saved data.
* **Parameters:**
  - `data`: Table containing saved `stage` and `numupgrades`.

### `GetDebugString()`
* **Description:** Returns a formatted string with current upgrade state for debug overlays.
* **Parameters:** None.  
* **Returns:** `string` — Human-readable debug info (e.g., `"Upgrade type: furniture; Current stage: 2 / 3; Upgrade Count: 3 / 5"`).

## Events & Listeners
- Listens for changes to properties `upgradetype`, `stage`, and `numstages` via internal assignment handlers (`onupgradetype`, `onstage`), which automatically update the entity's `<upgradetype>_upgradeable` tag.
- Does *not* explicitly listen to external events via `ListenForEvent`.
- Does *not* push custom events (only triggers callbacks).