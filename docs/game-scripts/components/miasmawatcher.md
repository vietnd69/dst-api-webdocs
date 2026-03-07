---
id: miasmawatcher
title: MiasmaWatcher
description: Tracks whether an entity is inside a miasma cloud and applies movement speed penalties accordingly.
tags: [miasma, movement, debuff, environment, player]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: f7c61b40
system_scope: environment
---

# MiasmaWatcher

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`MiasmaWatcher` monitors whether an entity is inside a miasma cloud and manages the associated movement speed penalty. It integrates with the `playervision`, `rider`, and `locomotor` components to dynamically adjust speed based on vision state (goggle/ghost vision), mount status, and presence of miasma sources. It also applies/removes the `miasmadebuff` debuff on the entity.

This component is primarily used by player entities and relies on world-level events (`miasmacloudexists`) to detect miasma presence. When enabled, it adds/removes speed modifiers and event listeners as needed.

## Usage example
```lua
local inst = ThePlayer
inst:AddComponent("miasmawatcher")
inst.components.miasmawatcher:SetMiasmaSpeedMultiplier(0.7)
inst.components.miasmawatcher:AddMiasmaSource("player_walking")
-- Later, remove the source when exiting miasma
inst.components.miasmawatcher:RemoveMiasmaSource("player_walking")
```

## Dependencies & tags
**Components used:** `locomotor`, `playervision`, `rider`, `player_classified` (optional, for network sync), `miasmamanager` (via `TheWorld` events)  
**Tags:** Adds debuff `"miasmadebuff"` when in miasma. No static tags are added/removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `enabled` | boolean | `false` | Whether miasma detection is active (true after `ToggleMiasma(true)`). |
| `miasmaspeedmult` | number | `TUNING.MIASMA_SPEED_MOD` | Speed multiplier applied when in miasma and not masked by vision/mount. Clamped to `[0, 1]`. |
| `hasmiasmasource` | `SourceModifierList` | — | Tracks which sources currently indicate miasma presence (e.g., player movement, item effects). |

## Main functions
### `AddMiasmaSource(src)`
* **Description:** Registers a source indicating the entity is in miasma. If this is the first source, applies `miasmadebuff` and updates speed.
* **Parameters:** `src` (string or hashable) — Unique identifier for the source of miasma presence (e.g., `"player_walking"`, `"item_effect"`).
* **Returns:** Nothing.

### `RemoveMiasmaSource(src)`
* **Description:** Removes a miasma source. If this was the last source, removes `miasmadebuff` and resets speed.
* **Parameters:** `src` (string or hashable) — The source identifier previously passed to `AddMiasmaSource`.
* **Returns:** Nothing.

### `IsInMiasma()`
* **Description:** Returns whether the entity is currently considered to be inside miasma (i.e., has at least one active miasma source).
* **Parameters:** None.
* **Returns:** `boolean` — `true` if any miasma source is active, `false` otherwise.

### `ToggleMiasma(active)`
* **Description:** Enables or disables miasma detection globally for this entity. Activates/deactivates event listeners and speed modifier setup based on `miasmaspeedmult`.
* **Parameters:** `active` (boolean, default `false`) — Whether miasma tracking should be active.
* **Returns:** Nothing.

### `SetMiasmaSpeedMultiplier(mult)`
* **Description:** Sets the speed penalty multiplier for miasma. Clamps value to `[0, 1]`. Updates listeners and speed only if `enabled` is `true`.
* **Parameters:** `mult` (number) — Speed multiplier (e.g., `0.7` for 70% speed). Values outside `[0, 1]` are clamped.
* **Returns:** Nothing.

### `UpdateMiasmaWalkSpeed()`
* **Description:** Recalculates and applies/removes the external speed multiplier based on current miasma presence and state (e.g., goggle/ghost vision, riding status). Only affects speed if `miasmaspeedmult < 1`.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to (world):** `miasmacloudexists` — triggered by `TheWorld` to indicate miasma presence; calls `ToggleMiasma(exists)`.
- **Listens to (entity):** `gogglevision`, `ghostvision`, `mounted`, `dismounted` — triggers `UpdateMiasmaWalkSpeed` when vision or mount status changes.
- **Pushes:** None directly. Indirectly affects debuff state via `inst:AddDebuff("miasmadebuff")` / `inst:RemoveDebuff("miasmadebuff")`.
