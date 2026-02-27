---
id: playerhearing
title: Playerhearing
description: Manages dynamic sound processing (DSP) effects applied to the player based on equipped items with specific tags.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: audio
source_hash: 3972a3ec
---

# Playerhearing

## Overview
This component enables dynamic audio filtering for the player by responding to equipped items (e.g., hats that muffle sound). It monitors inventory changes, tracks which DSP categories are active, and applies or removes audio DSP tables accordingly via game events.

## Dependencies & Tags
- Relies on the player having an `inventory` replica component (`inst.replica.inventory`).
- Listens to: `"equip"`, `"unequip"`, and `"inventoryclosed"` events.
- Applies no tags to the entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the owning entity instance. |
| `dsptables` | `table` | `{}` | Stores currently active DSP configurations, keyed by tag (e.g., `"mufflehat"`). |
| `mufflehat` (etc.) | `boolean` | `false` | Tracks whether the corresponding DSP effect is active, derived from inventory tag presence. |

*Note:* Public properties are initialized dynamically from the `DSP` table during construction.

## Main Functions

### `GetDSPTables()`
* **Description:** Returns the table of currently active DSP configurations.
* **Parameters:** None.

### `UpdateDSPTables()`
* **Description:** Synchronizes `dsptables` with the current state (e.g., `self.mufflehat`) and pushes `"pushdsp"` or `"popdsp"` events for each active/inactive DSP category.
* **Parameters:** None.

## Events & Listeners
- **Listens to:**
  - `"equip"` — Triggers update when an item is equipped.
  - `"unequip"` — Triggers update when an item is unequipped.
  - `"inventoryclosed"` — Client-only; ensures DSP state resets when inventory UI closes (assumes no items equipped).
- **Pushes:**
  - `"pushdsp"` — Sent when a new DSP configuration becomes active.
  - `"popdsp"` — Sent when a DSP configuration is removed.