---
id: miasmawatcher
title: MiasmaWatcher
description: Tracks miasma presence for an entity and applies movement speed penalties when exposed to miasma clouds.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: f7c61b40
---

# MiasmaWatcher

## Overview
The `MiasmaWatcher` component monitors whether the entity (typically a player) is inside a miasma cloud by tracking active miasma sources. When miasma exposure is detected, it applies a movement speed penalty and manages associated debuffs and vision-based speed adjustments. It only functions on the master simulation (server-side).

## Dependencies & Tags
- **Component dependencies:**  
  - `self.inst.player_classified.isinmiasma` (accessed conditionally)  
  - `inst.components.playervision` (used for `HasGoggleVision()`, `HasGhostVision()`)  
  - `inst.components.rider` (used for `IsRiding()`)  
  - `inst.components.locomotor` (used to apply/remove `miasma` speed multiplier)  
- **Debuff management:**  
  - Adds `miasmadebuff` when entering miasma  
  - Removes `miasmadebuff` when exiting miasma  
- **No explicit tags added/removed** by this component.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (passed to constructor) | Reference to the entity this component is attached to. |
| `enabled` | `boolean` | `false` | Whether the component is currently active (i.e., miasma clouds exist in the world and the entity was exposed at registration time). |
| `miasmaspeedmult` | `number` | `TUNING.MIASMA_SPEED_MOD` | Speed multiplier applied when moving through miasma. Clamped to [0, 1]. |
| `hasmiasmasource` | `SourceModifierList` | `SourceModifierList(inst, false, boolean)` | Tracks active miasma sources (e.g., clouds overlapping the entity). |

## Main Functions

### `AddMiasmaSource(src)`
* **Description:** Registers a new miasma source for the entity. If this is the first source, enables miasma debuff and applies speed penalty.
* **Parameters:**  
  - `src`: A unique identifier for the miasma source (e.g., cloud instance or ID).

### `RemoveMiasmaSource(src)`
* **Description:** Removes a miasma source. If no sources remain, disables miasma debuff and removes the speed penalty.
* **Parameters:**  
  - `src`: The same unique identifier passed to `AddMiasmaSource`.

### `IsInMiasma()`
* **Description:** Returns whether the entity currently overlaps with at least one miasma source.
* **Parameters:** None  
* **Returns:** `boolean` — `true` if any miasma source is active on this entity.

### `ToggleMiasma(active)`
* **Description:** Enables or disables the component based on global miasma cloud presence (e.g., when the world gains/loses clouds). Only affects listeners and speed penalty logic if `miasmaspeedmult < 1`.
* **Parameters:**  
  - `active`: `boolean` — whether miasma is present in the world.

### `SetMiasmaSpeedMultiplier(mult)`
* **Description:** Updates the speed multiplier applied in miasma. Handles switching between speed-modifying and non-modifying behavior dynamically.
* **Parameters:**  
  - `mult`: `number` — New speed multiplier, clamped to [0, 1].

### `UpdateMiasmaWalkSpeed()`
* **Description:** Applies or removes the miasma speed penalty based on current state (e.g., miasma presence, goggles/ghost vision, or being mounted). Only active if `miasmaspeedmult < 1`.
* **Parameters:** None

## Events & Listeners
- **Listens to:**
  - `"miasmacloudexists"` (on `TheWorld`) — triggers `ToggleMiasma` when global miasma cloud count changes.
  - `"gogglevision"` (on `inst`) — triggers walk speed update.
  - `"ghostvision"` (on `inst`) — triggers walk speed update.
  - `"mounted"` (on `inst`) — triggers walk speed update.
  - `"dismounted"` (on `inst`) — triggers walk speed update.

- **Pushes events:**
  - None identified.