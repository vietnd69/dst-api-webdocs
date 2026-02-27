---
id: playervision
title: Playervision
description: Manages player vision modes (e.g., night, ghost, goggles, nightmare) and dynamically updates colour cube overrides based on equipment and environment.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: ac22089d
---

# Playervision

## Overview
The `playervision` component tracks and controls active visual overlays (like night vision, ghost vision, nightmare vision, and various goggles) for the player entity. It responds to inventory equipment changes and world area transitions, then computes and broadcasts the appropriate colour cube (`cc`) overrides to the rendering system via events.

## Dependencies & Tags
- Listens for `equip` and `unequip` events (to detect equipment changes).
- Listens for `inventoryclosed` events on the client (to handle state when inventory UI is closed).
- Listens for `changearea` events (to detect entry/exit of `Nightmare`-tagged areas).
- Does not add or remove entity tags directly.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the owning entity (typically the player). |
| `ghostvision` | `boolean` | `false` | Whether ghost vision is currently active (toggled by consumables like Ghost Food). |
| `nightmarevision` | `boolean` | `false` | Whether nightmare vision is active (based on being in a `Nightmare` area). |
| `nightvision` | `boolean` | `false` | Whether the player has natural/standard night vision (e.g., from a Nightlight or Mole Hat). |
| `forcenightvision` | `boolean` | `false` | Whether night vision is forcibly overridden by external systems (e.g., flashlight mod, special items). |
| `gogglevision` | `boolean` | `false` | Whether goggles (e.g., Miner Hat) are equipped and active. |
| `forcegogglevision` | `boolean` | `false` | Whether goggle vision is forcibly overridden. |
| `nutrientsvision` | `boolean` | `false` | Whether nutrient-based vision (e.g., from eating Nutrients) is active. |
| `forcenutrientsvision` | `boolean` | `false` | Whether nutrients vision is forcibly overridden. |
| `scrapmonolevision` | `boolean` | `false` | Whether Scrap Monster’s Monole Vision is active (equipped item). |
| `forcescrapmonolevision` | `boolean` | `false` | Whether scrap monole vision is forcibly overridden. |
| `inspectaclesvision` | `boolean` | `false` | Whether Inspectacles (e.g., from Inspectacles) are active. |
| `forceinspectaclesvision` | `boolean` | `false` | Whether inspectacles vision is forcibly overridden. |
| `roseglassesvision` | `boolean` | `false` | Whether Rose Glasses vision is active. |
| `forceroseglassesvision` | `boolean` | `false` | Whether roseglasses vision is forcibly overridden. |
| `overridecctable` | `table?` | `nil` | Custom colour cube override (from `SetCustomCCTable`). |
| `currentcctable` | `table?` | `nil` | Current active colour cube table (used by rendering). |
| `currentccphasefn` | `table?` | `nil` | Current phase function (controls blending based on time/phase). |
| `blendcctable` | `boolean?` | `nil` | Whether the custom colour table should be blended (e.g., for gradual transitions). |
| `forcednightvisionstack` | `table` | `{}` | Stack of priority-based forced night vision sources (sorted by priority descending). |
| `forcednightvisionambienttable` | `table?` | `nil` | Ambient override table for forced night vision. |

## Main Functions

### `HasGhostVision()`
* **Description:** Returns whether ghost vision is currently active (not forcibly overridden).
* **Parameters:** None.

### `HasNightmareVision()`
* **Description:** Returns whether nightmare vision is currently active.
* **Parameters:** None.

### `HasNightVision()`
* **Description:** Returns whether night vision is active, including forced states.
* **Parameters:** None.

### `HasGoggleVision()`
* **Description:** Returns whether goggle vision is active, including forced states.
* **Parameters:** None.

### `HasNutrientsVision()`
* **Description:** Returns whether nutrient-based vision is active, including forced states.
* **Parameters:** None.

### `HasScrapMonoleVision()`
* **Description:** Returns whether Scrap Monster’s Monole Vision is active, including forced states.
* **Parameters:** None.

### `HasInspectaclesVision()`
* **Description:** Returns whether Inspectacles vision is active, including forced states.
* **Parameters:** None.

### `HasRoseGlassesVision()`
* **Description:** Returns whether Rose Glasses vision is active, including forced states.
* **Parameters:** None.

### `UpdateCCTable()`
* **Description:** Computes and updates the current colour cube table (`currentcctable`) and phase function (`currentccphasefn`) based on active vision modes and overrides. Pushes `ccoverrides` and `ccphasefn` events if the table changed.
* **Parameters:** None.

### `SetGhostVision(enabled)`
* **Description:** Enables or disables ghost vision. Updates CCTable and broadcasts `ghostvision` event if state changes.
* **Parameters:**
  * `enabled` (`boolean`): Whether to enable ghost vision.

### `SetNightmareVision(enabled)`
* **Description:** Enables or disables nightmare vision. Updates CCTable and broadcasts `nightmarevision` event if state changes.
* **Parameters:**
  * `enabled` (`boolean`): Whether to enable nightmare vision.

### `ForceNightVision(force)`
* **Description:** Forcibly enables or disables night vision (overrides equipment-based state). Updates CCTable if no natural night vision is active.
* **Parameters:**
  * `force` (`boolean`): Whether to force night vision on (`true`) or off (`false`).

### `PushForcedNightVision(source, priority, customcctable, blend, customambienttable)`
* **Description:** Adds a forced night vision source to the priority stack. Removes any prior source with the same name, inserts the new entry, and re-sorts by priority. Activates forced night vision if this source is now highest priority.
* **Parameters:**
  * `source` (`string|table`): Unique identifier for the forcing source (e.g., item name or mod ID).
  * `priority` (`number`): Priority of this source (higher = takes precedence). Defaults to `0`.
  * `customcctable` (`table?`): Optional custom colour cube table to use instead of default.
  * `blend` (`boolean?`): Whether to blend the custom colour table (passed to `SetCustomCCTable`).
  * `customambienttable` (`table?`): Optional ambient lighting overrides.

### `PopForcedNightVision(source)`
* **Description:** Removes a forced night vision source from the stack. If the stack becomes empty, disables forced night vision. If a different source becomes highest priority, updates overrides accordingly.
* **Parameters:**
  * `source` (`string|table`): The source to remove.

### `SetForcedNightVisionAmbientOverrides(ambienttable)`
* **Description:** Sets or clears ambient lighting overrides used for forced night vision. Triggers `nightvisionambientoverrides` event.
* **Parameters:**
  * `ambienttable` (`table?`): Ambient override table, or `nil` to clear.

### `GetNightVisionAmbientOverrides()`
* **Description:** Returns the currently active ambient override table for forced night vision.
* **Parameters:** None.

### `ForceGoggleVision(force)`
* **Description:** Forcibly enables or disables goggle vision. Broadcasts `gogglevision` event if state changes and no natural goggle vision is active.
* **Parameters:**
  * `force` (`boolean`): Whether to force goggle vision on (`true`) or off (`false`).

### `ForceNutrientVision(force)`
* **Description:** Forcibly enables or disables nutrient vision (server and client-aware for the local player only). Broadcasts `nutrientsvision` event via `TheWorld` if applicable.
* **Parameters:**
  * `force` (`boolean`): Whether to force nutrient vision on (`true`) or off (`false`).

### `ForceScrapMonoleVision(force)`
* **Description:** Forcibly enables or disables Scrap Monster’s Monole Vision. Broadcasts `scrapmonolevision` event if state changes.
* **Parameters:**
  * `force` (`boolean`): Whether to force vision on (`true`) or off (`false`).

### `ForceInspectaclesVision(force)`
* **Description:** Forcibly enables or disables Inspectacles vision. Broadcasts `inspectaclesvision` event if state changes.
* **Parameters:**
  * `force` (`boolean`): Whether to force vision on (`true`) or off (`false`).

### `ForceRoseGlassesVision(force)`
* **Description:** Forcibly enables or disables Rose Glasses vision. Broadcasts `roseglassesvision` event if state changes.
* **Parameters:**
  * `force` (`boolean`): Whether to force vision on (`true`) or off (`false`).

### `SetCustomCCTable(cctable, blend)`
* **Description:** Sets a custom colour cube override (e.g., for mood lighting or special effects). Updates CCTable and may re-blend depending on `blend`.
* **Parameters:**
  * `cctable` (`table?`): Custom colour cube table, or `nil` to clear.
  * `blend` (`boolean?`): Whether to apply blending for transitions.

## Events & Listeners
- **Listens to:**
  - `equip` → Triggers `OnEquipChanged`
  - `unequip` → Triggers `OnEquipChanged`
  - `inventoryclosed` (client-only) → Triggers `OnEquipChanged`
  - `changearea` → Triggers `OnAreaChanged`

- **Pushes:**
  - `nightvision` — Value: `boolean`; sent on night vision state change.
  - `gogglevision` — Value: `{ enabled = boolean }`.
  - `nutrientsvision` — Value: `{ enabled = boolean }` (via `TheWorld` for local player).
  - `scrapmonolevision` — Value: `{ enabled = boolean }`.
  - `inspectaclesvision` — Value: `{ enabled = boolean }`.
  - `roseglassesvision` — Value: `{ enabled = boolean }`.
  - `ghostvision` — Value: `boolean`.
  - `nightmarevision` — Value: `boolean`.
  - `ccoverrides` — Value: colour cube table (e.g., `NIGHTVISION_COLOURCUBES`), sent when CCTable changes.
  - `ccphasefn` — Value: phase function table (e.g., `NIGHTVISION_PHASEFN`), sent when phase function changes.
  - `nightvisionambientoverrides` — Value: ambient override table or `nil`.
  - `nightmarephasechanged` — Not listened to directly; referenced in `NIGHTMARE_PHASEFN` as the expected world event name.