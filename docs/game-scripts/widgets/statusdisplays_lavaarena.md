---
id: statusdisplays_lavaarena
title: Statusdisplays Lavaarena
description: Manages health and pet health status displays for the Lava Arena minigame, including dynamic UI updates, visibility toggling, and health pulse animations.
tags: [ui, health, boss, minigame]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 90a72a64
system_scope: ui
---

# Statusdisplays Lavaarena

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`StatusDisplays` is a UI widget component specifically for the Lava Arena minigame that displays owner health and optional pet health indicators. It manages visibility toggling based on ghost mode and crafting state, handles health delta animations and sounds, and synchronizes with the `PetHealthBar` component to render pet health visuals and directional arrows.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("statusdisplays_lavaarena")
local status = inst.components.statusdisplays_lavaarena
status:SetGhostMode(true)
status:ToggleCrafting(false)
status:ShowStatusNumbers()
```

## Dependencies & tags
**Components used:** `health`, `pethealthbar` (via `owner.components.pethealthbar`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity instance | `nil` | The entity whose health/pet health is being displayed. |
| `heart` | `HealthBadge` | `nil` | Main health badge widget for the owner. |
| `pet_heart` | `Badge` | `nil` | Pet health badge widget (created on first need). |
| `onhealthdelta` | function | `nil` | Callback registered to the `healthdelta` event. |
| `healthmax` | number | `0` | Current reported max health value. |
| `queuedhealthmax` | number | `0` | Pending max health value, used to batch updates. |
| `healthpenalty` | number | `0` | Penalty percentage applied to health display. |
| `visiblemode` | boolean | `false` | Internal flag tracking current visibility state. |
| `isghostmode` | boolean | `false` | Whether the owner is in ghost mode (affects visibility). |
| `craft_hide` | boolean | `false` | Whether UI should be hidden due to crafting. |

## Main functions
### `AddPet()`
* **Description:** Adds and configures the pet health badge widget if not already present. Initializes arrow animation and positions UI elements.
* **Parameters:** None.
* **Returns:** Nothing.

### `UpdateMode()`
* **Description:** Updates visibility of health and pet health badges based on `isghostmode` and `craft_hide` states. Schedules immediate mode change via `DoTaskInTime`.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetGhostMode(ghostmode)`
* **Description:** Sets the ghost mode state and triggers a UI mode update.
* **Parameters:** `ghostmode` (boolean) — whether the owner is currently a ghost.
* **Returns:** Nothing.

### `ToggleCrafting(hide)`
* **Description:** Sets the crafting-hide state (e.g., when player is crafting) and triggers a UI mode update.
* **Parameters:** `hide` (boolean) — whether the status UI should be hidden due to crafting.
* **Returns:** Nothing.

### `ShowStatusNumbers()`
* **Description:** Ensures health and pet health numeric values are visible.
* **Parameters:** None.
* **Returns:** Nothing.

### `HideStatusNumbers()`
* **Description:** Hides health and pet health numeric values.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetHealthPercent(pct)`
* **Description:** Updates the health badge with the given percentage and max health, calculates penalty, and triggers warning animation if below 30%.
* **Parameters:** `pct` (number) — current health percentage (0.0 to 1.0).
* **Returns:** number — the owner's current max health (from `health:Max()`), used for queuing updates.
* **Error states:** Returns current max health even if `pct` is 0.

### `HealthDelta(data)`
* **Description:** Handles incoming health delta events: updates queued max health, triggers pulse animations and sounds based on delta direction and penalty changes.
* **Parameters:** `data` (table) — event data including `oldpercent`, `newpercent`, `overtime`.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Runs periodically while updating; flushes queued health max changes, plays pulses/sounds for pending health changes, then stops updating.
* **Parameters:** `dt` (number) — time elapsed since last frame.
* **Returns:** Nothing.
* **Error states:** Early return if `TheNet:IsServerPaused()` is true.

### `RefreshPetHealth()`
* **Description:** Refreshes the pet health badge based on `PetHealthBar` component state. Creates the badge if missing, sets visibility, updates symbol, arrow animation, and numeric display.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `healthdelta` — triggers `HealthDelta()` to handle health changes.
- **Listens to:** `clientpethealthdirty` — triggers `RefreshPetHealth()` on pet health updates.
- **Listens to:** `clientpethealthsymboldirty` — triggers `RefreshPetHealth()` on pet symbol updates.
- **Listens to:** `clientpetmaxhealthdirty` — triggers `RefreshPetHealth()` on pet max health updates.
- **Listens to:** `clientpethealthstatusdirty` — triggers `RefreshPetHealth()` on pet status updates.