---
id: statusdisplays
title: Statusdisplays
description: Manages the HUD status display widgets for player stats, pets, and resurrection functionality in Don't Starve Together.
tags: [ui, player, hud]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 060f35a1
system_scope: ui
---

# Statusdisplays

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Statusdisplays` is a HUD widget component responsible for rendering and updating player status indicators including health, sanity, hunger, moisture, werebeast form, inspiration, mightiness, pet health/hunger, avenging ghost timer, and resurrection buttons. It adapts dynamically to player mode (living/ghost) and game context (e.g., platform riding, attunement state). It listens for state changes across multiple components and updates UI widgets accordingly, including handling animation and sound effects for stat changes.

## Usage example
```lua
-- Typically added automatically by the game during player HUD initialization.
-- Manual creation is not standard practice, but for reference:
local owner = TheFrontEnd:GetPlayerEntity()
local status = CreateEntity()
status:AddWidget("statusdisplays", owner)
-- Widgets are added as children; do not call constructor directly.
```

## Dependencies & tags
**Components used:** `attuner`, `avengingghost`, `healthsyncer`, `pethealthbar`, `skilltreeupdater`  
**Tags checked:** `dogrider`, `wereness`, `battlesinger`, `strongman`, `upgrademoduleowner`, `iseffigy`, `gravestone`  
**Tags added:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `nil` | The player entity whose status is displayed. |
| `isghostmode` | boolean | `true` (initial) | Current mode (`true` = ghost, `false` = living). |
| `column1`–`column5` | number | `[-80, -40, 0, 40, -120]` | Horizontal offset positions for widget layout (varies by split-screen mode). |
| `healthpenalty` | number | `0` | Current health penalty percentage used for pulse calculations. |
| ` rezbutton_new_task`, `rezbutton_lost_task`, `modetask` | task | `nil` | Task handles for delayed UI updates (e.g., resurrection buttons, mode switching). |
| `instantboatmeterclose` | boolean | `true` | Controls instant closure of boat meter on dismount. |
| `inst` | widget instance | — | The widget’s UI instance. |
| `heart`, `brain`, `stomach`, `moisturemeter`, `boatmeter`, `resurrectbutton`, `resurrectbuttonfx` | widget | — | Core status display widgets (health, sanity, hunger, moisture, boat, resurrection). |

## Main functions
### `SetGhostMode(ghostmode)`
*   **Description:** Switches the HUD between living and ghost modes, showing/hiding appropriate widgets and updating resurrection button state.
*   **Parameters:** `ghostmode` (boolean) – target mode (`true` = ghost).
*   **Returns:** Nothing.
*   **Error states:** No effect if current mode matches `ghostmode`.

### `SetHealthPercent(pct)`
*   **Description:** Updates the health bar's percentage and triggers visual warnings/pulses based on changes or penalty shifts.
*   **Parameters:** `pct` (number) – new health percentage (`0.0`–`1.0`).
*   **Returns:** Nothing.

### `HealthDelta(data)`
*   **Description:** Handles health changes, including overtime updates, and plays appropriate sounds/pulses.
*   **Parameters:** `data` (table) – contains `newpercent`, `oldpercent`, `overtime`, and `penalty` info.
*   **Returns:** Nothing.

### `SetHungerPercent(pct)`
*   **Description:** Updates the hunger bar’s percentage and manages warning states.
*   **Parameters:** `pct` (number) – new hunger percentage (`0.0`–`1.0`).
*   **Returns:** Nothing.

### `HungerDelta(data)`
*   **Description:** Handles hunger changes and triggers visual/sound feedback.
*   **Parameters:** `data` (table) – contains `newpercent`, `oldpercent`, `overtime`.
*   **Returns:** Nothing.

### `SetSanityPercent(pct)`
*   **Description:** Updates the sanity bar and penalty tracking; triggers warning states for insane/enlightened modes.
*   **Parameters:** `pct` (number) – new sanity percentage.
*   **Returns:** `(oldpenalty, newpenalty)` (numbers) – previous and current sanity penalty percentages.

### `SanityDelta(data)`
*   **Description:** Handles sanity changes and plays appropriate feedback.
*   **Parameters:** `data` (table) – contains `newpercent`, `oldpercent`, `overtime`.
*   **Returns:** Nothing.

### `AddWereness()`, `RemoveWereness()`, `SetWereMode(weremode, nofx)`
*   **Description:** Manages the werebeast status badge display (showing transformation level).
*   **Parameters:**
    *   `weremode` (boolean) – whether werebeast form is active.
    *   `nofx` (boolean, optional) – suppress visual effects if `true`.
*   **Returns:** Nothing.

### `AddInspiration()`, `SetInspiration(pct, slots_available, draining)`, `OnInspirationSongChanged(slot_num, song_name)`
*   **Description:** Manages the inspiration HUD element for the Battlesinger character.
*   **Parameters:**
    *   `pct` (number) – current inspiration percentage.
    *   `slots_available` (number, optional) – available inspiration slots.
    *   `draining` (boolean) – whether inspiration is actively draining.
    *   `slot_num` (number) – slot index (1–3).
    *   `song_name` (string, optional) – current song name.
*   **Returns:** Nothing.

### `AddMightiness()`, `SetMightiness(percent)`, `MightinessDelta(data)`
*   **Description:** Manages the mightiness HUD element for the Strongman character.
*   **Parameters:**
    *   `percent` (number) – current mightiness percentage.
    *   `data` (table) – contains `newpercent`, `oldpercent`.
*   **Returns:** Nothing.

### `SetMoisturePercent(pct)`, `MoistureDelta(data)`
*   **Description:** Updates the moisture meter (wetness) percentage and rate.
*   **Parameters:**
    *   `pct` (number) – current moisture percentage.
    *   `data` (table) – contains `new` moisture value.
*   **Returns:** Nothing.

### `AddPetHunger()`, `SetPetHungerPercent(pct, max)`, `PetHungerDelta(data)`, `SetPetHungerFlags(flags, instant)`, `SetPetHungerBuild(build, instant)`
*   **Description:** Manages the pet hunger HUD for Woby (Walter's pet). Includes skin and build frame switching.
*   **Parameters:**
    *   `pct` (number), `max` (number) – hunger percentage and max.
    *   `data` (table) – `newpercent`, `oldpercent`, `overtime`.
    *   `flags` (number) – bit flags for Woby state (e.g., big, lunar, shadow).
    *   `build` (string) – current skin/build identifier.
    *   `instant` (boolean) – skip animations if `true`.
*   **Returns:** Nothing.

### `RefreshPetHealth()`, `RefreshPetSkin()`, `RefreshHealthBuff()`
*   **Description:** Updates pet health, pet skin icon, and health buff indicator respectively based on latest component data.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `RefreshAvengingGhost()`
*   **Description:** Updates the avenging ghost timer display if the component exists.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `EnableResurrect(enable, effigy_type)`
*   **Description:** Shows/hides the resurrection button and effigy icon based on attunement state.
*   **Parameters:**
    *   `enable` (boolean) – whether resurrection is available.
    *   `effigy_type` (string, optional) – `"grave"` or `nil` (effigy).
*   **Returns:** Nothing.

### `GetResurrectButton()`
*   **Description:** Returns the resurrect button widget if visible, otherwise `nil`.
*   **Parameters:** None.
*   **Returns:** widget (or `nil`).

### `ShowStatusNumbers()`, `HideStatusNumbers()`
*   **Description:** Toggles visibility of numeric values on all status widgets.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Layout()`
*   **Description:** Placeholder; currently does nothing.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
    * `healthdelta`, `hungerdelta`, `sanitydelta`, `moisturedelta`, `werenessdelta`, `inspirationdelta`, `inspirationsongchanged`, `mightinessdelta`, `clientpethealthdirty`, `clientpethealthsymboldirty`, `clientpetmaxhealthdirty`, `clientpethealthpulsedirty`, `clientpethealthstatusdirty`, `clientpetbonusdirty`, `clienthealthbuffdirty`, `clientpetskindirty`, `pet_hungerdelta`, `pet_hunger_flags`, `pet_hunger_build`, `show_pet_hunger`, `gotnewattunement`, `attunementlost`, `got_on_platform`, `got_off_platform`, `clientavengetimedirty`, `finishseamlessplayerswap`
- **Pushes:** No events directly; updates are driven by events from other components.
