---
id: shatterfx
title: Shatterfx
description: Manages animated shatter effects for an entity by cycling between pre-defined animation levels based on configured states.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 09ea5df6
---

# Shatterfx

## Overview
This component provides controlled playback of shatter-related animations for an entity. It maintains a set of named animation levels and ensures proper sequencing—including optional pre-animation frames—when transitioning between shatter states (e.g., partial → full destruction).

## Dependencies & Tags
- **Requires:** `AnimState` component (used via `self.inst.AnimState`).
- No explicit components are added or tags set/remediated in the constructor.
- Relies on `self.inst` having a valid `AnimState` component available at runtime.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GObject` | *(passed in)* | Reference to the owning entity instance. |
| `level` | `number?` | `nil` | Current active shatter level (index into `self.levels`), or `nil` if none active. |
| `levels` | `table` | `{}` | Map of valid animation configurations, keyed by level index (e.g., `{ [1] = { pre = "shatter_p0", anim = "shatter_0" } }`). |

## Main Functions

### `SetLevel(level)`
* **Description:** Sets the current shatter animation level, playing the corresponding animation sequence. If a prior level is inactive, it plays an optional `pre` animation before looping the main animation (`anim`) indefinitely. Ensures the requested level does not exceed available levels and prevents redundant re-sets.
* **Parameters:**
  - `level` (`number`): 1-based index specifying the desired shatter state. Internally clamped to `#self.levels`.

## Events & Listeners
None identified.