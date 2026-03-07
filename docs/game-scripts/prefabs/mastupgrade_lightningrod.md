---
id: mastupgrade_lightningrod
title: Mastupgrade Lightningrod
description: A structure component that charges upon lightning strikes and discharges at the end of each day, providing visual and functional upgrade support for masts.
tags: [lightning, structure, upgrade]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a1e24072
system_scope: environment
---

# Mastupgrade Lightningrod

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `mastupgrade_lightningrod` prefab implements a lightning-activated structure upgrade for masts. It consists of three components: a top piece (`mastupgrade_lightningrod_top`), a base piece (`mastupgrade_lightningrod`), and an inventory item (`mastupgrade_lightningrod_item`). When struck by lightning, it begins charging and stores charge across multiple days. At the end of each day, it attempts to discharge, producing sound, visual effects, and animating a sparkle. It interacts with the `lootdropper` and `upgrader` components for crafting and destruction behavior.

## Usage example
This component is not added dynamically; it is part of predefined prefabs. However, as an upgrader, it can be applied to a mast as follows (conceptual):
```lua
-- When attached to a mast, it modifies mast behavior via upgradertype MAST
-- When built, it listens to 'lightningstrike' and 'onbuilt' events
```

## Dependencies & tags
**Components used:** `lootdropper`, `upgrader`, `inventoryitem`, `tradable`, `inspectable`
**Tags added:** `lightningrod`, `DECOR`, `NOCLICK`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `charged` | boolean | `false` | Whether the lightningrod is currently charged and emitting light. |
| `chargeleft` | number | `nil` | Number of days remaining before discharge completes (if any). |
| `zaptask` | task | `nil` | Task used to schedule repeated spark events. |
| `_top` | entity | `nil` | Reference to the top component entity. |
| `_mast` | entity | `nil` | Reference to the parent mast entity. |
| `scrapbook_anim` | string | `"top"` | Animation name shown in scrapbook. |
| `scrapbook_specialinfo` | string | `"MASTUPGRADELIGHTNINGCONDUCTOR"` | Localization key for scrapbook description. |
| `scrapbook_inspectonseen` | boolean | `true` | Whether the scrapbook inspect trigger fires on first observation. |

## Main functions
### `setcharged(inst, charges)`
*   **Description:** Initiates charging state for the lightningrod if not already charged, activates lighting/shimmer effects, and schedules the next zap event. Increases `chargeleft` to at least `charges`.
*   **Parameters:** `inst` (entity), `charges` (number) — number of days of charge to add (e.g., 3).
*   **Returns:** Nothing.
*   **Error states:** Does nothing if already charged (only extends `chargeleft`).

### `discharge(inst)`
*   **Description:** Ends the charged state: disables lighting effects, cancels pending zap tasks, and stops watching the day cycle. Resets internal flags.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.
*   **Error states:** Only acts if `inst.charged` is `true`.

### `dozap(inst)`
*   **Description:** Plays the lightning sound and spawns a lightingrod effect at the base. Schedules a follow-up zap after a random delay (10–40 seconds).
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.
*   **Error states:** Cancels any existing `zaptask` before scheduling a new one.

### `onlightning(inst)`
*   **Description:** Event handler called when a lightning strike occurs. Calls `setcharged(inst, 3)` to add charge.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `ondeconstructstructure(inst, caster)`
*   **Description:** Handles component teardown on structure deconstruction: drops all ingredients via `lootdropper:SpawnLootPrefab`.
*   **Parameters:** `inst` (entity), `caster` (entity) — the player performing deconstruction.
*   **Returns:** Nothing.

### `mast_burnt(inst)`
*   **Description:** Event handler for when the mast burns. Drops loot at the mast's position and spawns a collapse effect at that location.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `ondaycomplete(inst)`
*   **Description:** Event handler for end-of-day. Triggers a zap and reduces `chargeleft` by 1. If `chargeleft <= 1`, calls `discharge(inst)`.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `mast_burnt` — triggers `mast_burnt` handler.
  - `onbuilt` — triggers `onbuilt` handler (plays animations and sound).
  - `lightningstrike` — triggers `onlightning` handler.
  - `onremove` — triggers `onremove` handler (cleans up references to top and mast).
  - `ondeconstructstructure` — triggers `ondeconstructstructure` handler.
- **Pushes:** None directly.
- **WorldState watcher:** Watches `"cycles"` to invoke `ondaycomplete` at end-of-day (removed on discharge).