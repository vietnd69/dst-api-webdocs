---
id: expertsailor
title: Expertsailor
description: Provides configurable boat-rowing and sail mechanics parameters for entities (typically players) using sails and anchors.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 6815d302
---

# Expertsailor

## Overview
This component stores and exposes configurable multipliers and speed/strength parameters for boat-rowing and sail operations (e.g., force applied during rowing, extra velocity bonus, anchor raising speed, and lower sail strength). It does not directly control gameplay logic but acts as a data container for tuning and modifying how sailing mechanics behave on a per-entity basis.

## Dependencies & Tags
None identified.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `row_force_mult` | number | `nil` (unset until assigned) | Multiplier applied to rowing force; used to scale rowing power. |
| `extra_max_velocity` | number | `nil` (unset until assigned) | Additional velocity bonus added to the entity's maximum speed while sailing. |
| `anchor_raise_speed` | number | `nil` (unset until assigned) | Speed factor for raising the anchor; higher values raise the anchor faster. |
| `lower_sail_strength` | number | `nil` (unset until assigned) | Strength or effectiveness factor applied when lowering sails (e.g., impact on sail control or durability). |

## Main Functions

### `GetRowForceMultiplier()`
* **Description:** Returns the current rowing force multiplier.
* **Parameters:** None.

### `SetRowForceMultiplier(force)`
* **Description:** Sets the rowing force multiplier to the specified value.
* **Parameters:**
  * `force` (number): The multiplier to apply to rowing force.

### `GetRowExtraMaxVelocity()`
* **Description:** Returns the current extra maximum velocity bonus for sailing.
* **Parameters:** None.

### `SetRowExtraMaxVelocity(vel)`
* **Description:** Sets the extra maximum velocity bonus for sailing.
* **Parameters:**
  * `vel` (number): The additional velocity to add to the entity's max sailing speed.

### `GetAnchorRaisingSpeed()`
* **Description:** Returns the current anchor raising speed factor.
* **Parameters:** None.

### `SetAnchorRaisingSpeed(speed)`
* **Description:** Sets the anchor raising speed factor.
* **Parameters:**
  * `speed` (number): The factor controlling how quickly the anchor is raised.

### `GetLowerSailStrength()`
* **Description:** Returns the current lower sail strength parameter.
* **Parameters:** None.

### `SetLowerSailStrength(strength)`
* **Description:** Sets the lower sail strength parameter.
* **Parameters:**
  * `strength` (number): A multiplier or modifier applied to the effectiveness or behavior when lowering sails.