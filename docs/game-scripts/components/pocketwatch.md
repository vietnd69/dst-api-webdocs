---
id: pocketwatch
title: Pocketwatch
description: A lightweight component that manages an entity's casting state by tracking whether it is inactive and conditionally enabling spell casting.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: fbbba304
---

# Pocketwatch

## Overview
The `PocketWatch` component serves as a flexible spell-casting gatekeeper. It tracks whether an entity is in an *inactive* state (via the `inactive` property) and conditionally allows spell casting—either by default (if `CanCastFn`/`DoCastSpell` functions are assigned externally) or explicitly denied when inactive.

## Dependencies & Tags
* **Tags Added/Removed:** `"pocketwatch_inactive"` (added when `inactive = true`, removed on component removal or when `inactive = false`)
* **Component Dependencies:** None declared. Requires only that the entity (`inst`) supports tag management (`AddOrRemoveTag`, `RemoveTag`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (assigned in constructor) | Reference to the owning entity. |
| `inactive` | `boolean` | `true` | Controls whether the pocketwatch is active. When `true`, casting is blocked unless `CanCastFn`/`DoCastSpell` explicitly allow it. |
| `CanCastFn` | `function` | `nil` | Optional external callback (set externally) that overrides the default cast check. |
| `DoCastSpell` | `function` | `nil` | Optional external callback (set externally) containing the actual spell logic. |

> **Note:** `CanCastFn` and `DoCastSpell` are not initialized in the constructor but are expected to be assigned externally (e.g., by the modder or higher-level logic) to enable full spell functionality.

## Main Functions
### `CanCast(doer, target, pos)`
* **Description:** Determines whether the entity is allowed to cast a spell. Returns `true` only if `inactive = true` *and* either no custom `CanCastFn` is set, or `CanCastFn` returns `true`.
* **Parameters:**
  * `doer`: The entity attempting to cast.
  * `target`: The target entity (if any).
  * `pos`: The target position (if any).

### `CastSpell(doer, target, pos)`
* **Description:** Executes the spell logic *if* `inactive = true` *and* a `DoCastSpell` function has been assigned. Returns `false` if conditions aren’t met; otherwise returns the result of `DoCastSpell`.
* **Parameters:**
  * `doer`: The entity attempting to cast.
  * `target`: The target entity (if any).
  * `pos`: The target position (if any).

## Events & Listeners
* Listens to the `"inactive"` event: Triggers the `oninactive` handler to add/remove the `"pocketwatch_inactive"` tag on the entity when the `"inactive"` event is pushed.