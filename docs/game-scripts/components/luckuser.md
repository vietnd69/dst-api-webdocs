---
id: luckuser
title: Luckuser
description: This component manages an entity's luck value through additive modifiers and adjusts hounded target behavior based on whether luck is negative or non-negative.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 2d451c3c
---

# Luckuser

## Overview
The `LuckUser` component is responsible for tracking and updating an entity's luck value via additive modifiers, and dynamically modifying hounded target-related behavior (such as spawning weight and thief sources) when luck drops below zero.

## Dependencies & Tags
- Depends on the `SourceModifierList` utility class.
- Conditionally adds or interacts with the `houndedtarget` component on the same entity when luck is negative.
- Adds no permanent tags; all behavioral changes are handled through component interactions.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (injected) | Reference to the owning entity instance. |
| `luckmodifiers` | `SourceModifierList` | `nil` (initialized in constructor) | Internal modifier list used to compute cumulative luck. Built as additive with initial value 0. |

> Note: The commented-out `self.luck = 0` line indicates a previous implementation attempt; the current logic computes luck dynamically via `self.luckmodifiers:Get()`.

## Main Functions
### `OnRemoveFromEntity()`
* **Description:** Cleans up the component upon removal from the entity by resetting all modifiers and updating the internal luck state.
* **Parameters:** None.

### `GetLuck()`
* **Description:** Returns the current cumulative luck value, computed by summing all active modifiers in `luckmodifiers`.
* **Parameters:** None.

### `:UpdateLuck_Internal()`
* **Description:** Applies or removes hounded target modifications based on the entity's luck value. When luck is negative, it increases hound spawning weight and enables hound-thief behavior proportionally to the deficit.
* **Parameters:** None.

### `SetLuckSource(luck, source)`
* **Description:** Sets or updates a luck modifier for a given source. If `luck` is zero, removes the source instead. Always triggers an internal update after modification.
* **Parameters:**
  * `luck` (*number*): The new modifier value to apply.
  * `source` (*string*): Identifier for the modifier source (used as both key and metadata).

### `RemoveLuckSource(source)`
* **Description:** Removes a luck modifier associated with the specified source and updates hounded target behavior accordingly.
* **Parameters:**
  * `source` (*string*): Identifier of the modifier source to remove.

### `GetDebugString()`
* **Description:** Returns a formatted string of the current luck value for debugging display (e.g., `"luck: -1.50"`).
* **Parameters:** None.

## Events & Listeners
None identified.