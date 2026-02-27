---
id: pethealthbar
title: Pethealthbar
description: Manages health bar state for pets, including health percentage, max health, bonus health, status indicators (e.g., regen/damage), symbols, and skin, synchronizing data across server and clients via networking.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 9d4a56ca
---

# Pethealthbar

## Overview
This component tracks and synchronizes pet health bar state in Don't Starve Together. It handles health percentage, max health, bonus health (temporary health buffs), status indicators (e.g., regenerating, taking damage, overheating), and visual symbols/skins. The component operates in two modes: on the master simulation (server), it manages pet dependencies and computes status updates; on clients, it listens for network events to update the UI. It integrates closely with pet components like `health`, `hunger`, and debuff/buff events.

## Dependencies & Tags
- Requires `inst` to have an associated pet entity (assigned via `SetPet`)
- Relies on the pet's components:
  - `pet.components.health` (for health delta and status detection)
  - `pet.components.hunger` (for starvation detection)
  - `pet.components.inventory` (for regen-equipped items)
- Adds no tags to the entity.
- On the master simulation: listens for events from the assigned pet, including:
  - `"healthdelta"`, `"startcorrosivedebuff"`, `"starthealthregen"`, `"startsmallhealthregen"`, `"pethealthbar_bonuschange"`
  - `"onremove"` on debuffs for cleanup
- On clients: registers listeners for UI sync events (e.g., `"pethealthsymboldirty"`, `"clientpethealthdirty"`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_symbol` | `net_hash` | `nil` | Networked symbol (visual identifier) for the pet health bar. |
| `_symbol2` | `net_hash` | `nil` | Secondary networked symbol (used for secondary visual indicators). |
| `_status` | `net_tinybyte` | `0` | Status indicator: 0 = none, 1–2 = small/large regen (up), 3 = damage/derangement (down), 4–5 = encoded negative values. |
| `_maxhealth` | `net_ushortint` | `0` | Networked maximum health value. |
| `_pulse` | `net_tinybyte` | `0` | Pulse animation trigger: `0` = reset, `1` = green (healed), `2` = red (damage taken). |
| `_healthpct` | `net_float` | `1.0` | Current health as a fraction of max health. |
| `_maxbonus` | `net_ushortint` | `0` | Bonus health cap (e.g., from temporary buffs). |
| `_bonuspct` | `net_float` | `0.0` | Bonus health percentage. |
| `_petskin` | `net_hash` | `0` | Hashed pet skin identifier. |
| `petskin_str` | `string` | `""` | Raw pet skin name (server-side only). |
| `pet` | `Entity` | `nil` | Currently assigned pet entity (server-side only). |
| `corrosives` / `hots` / `small_hots` | `table` | `{}` | Tracking tables for active debuffs/buffs (server-side only). |
| `task` | `Task` | `nil` | Deferred initialization task (server-side only). |

## Main Functions

### `GetSymbol()`
* **Description:** Returns the current symbol hash used to render the pet health bar icon.
* **Parameters:** None.

### `GetSymbol2()`
* **Description:** Returns the secondary symbol hash (used for additional visual context).
* **Parameters:** None.

### `GetMaxHealth()`
* **Description:** Returns the pet's current maximum health.
* **Parameters:** None.

### `GetMaxBonus()`
* **Description:** Returns the current bonus health cap. Returns `nil` if no bonus health is active.
* **Parameters:** None.

### `GetOverTime()`
* **Description:** Decodes the internal `_status` value into a human-readable status code:  
  `-2` = large down (severe status), `-1` = small down, `0` = none, `1` = small up, `2` = large up.  
  Always returns `0` if `_status` is out of valid range.
* **Parameters:** None.

### `GetPercent()`
* **Description:** Returns the current health percentage (0.0–1.0).
* **Parameters:** None.

### `GetPercentBonus()`
* **Description:** Returns the bonus health percentage (0.0–1.0) if bonus health is active, otherwise `nil`.
* **Parameters:** None.

### `GetPulse()`
* **Description:** Returns the current pulse value (`0`, `1`, or `2`) indicating the type of health change animation.
* **Parameters:** None.

### `ResetPulse()`
* **Description:** Resets the pulse value to `0`, clearing any pending animation trigger.
* **Parameters:** None.

### `SetSymbol(symbol)`
* **Description (server only):** Sets the pet's primary symbol and triggers a client sync if changed.
* **Parameters:**  
  `symbol` (`string` or `number`): Hashable value identifying the symbol.

### `SetSymbol2(symbol)`
* **Description (server only):** Sets the secondary symbol and triggers a client sync if changed.
* **Parameters:**  
  `symbol` (`string` or `number`): Hashable value for the secondary symbol.

### `SetMaxHealth(max_health)`
* **Description (server only):** Updates the pet's max health and notifies clients.
* **Parameters:**  
  `max_health` (`number`): New maximum health value.

### `SetPetSkin(petskin)`
* **Description (server only):** Sets the pet's skin and triggers a sync event.
* **Parameters:**  
  `petskin` (`string` or `nil`): Skin name; `nil` is treated as `0`.

### `SetPet(pet, symbol, maxhealth)`
* **Description (server only):** Assigns a new pet entity and sets up all necessary event listeners and initial state. Updates the health bar to match the pet’s current stats.
* **Parameters:**  
  `pet` (`Entity`): The pet entity to track.  
  `symbol` (`string`/`number`): Initial symbol for the pet.  
  `maxhealth` (`number`): Initial max health value.

### `OnUpdate(dt)`
* **Description (server only):** Calculates and updates the `_status` indicator based on pet conditions (e.g., freezing, overheating, starving, regenerating). Triggers a sync only if the status changed.
* **Parameters:**  
  `dt` (`number`): Time since last update.

### `GetDebugString()`
* **Description:** Returns a formatted debug string showing current health percent, max health, symbol, and status code.
* **Parameters:** None.

## Events & Listeners
### Events This Component Listens To (Master Simulation)
- `"healthdelta"` (on assigned pet) — Triggers health percent updates and pulse logic.
- `"startcorrosivedebuff"` (on assigned pet) — Registers corrosive damage tracking.
- `"starthealthregen"` (on assigned pet) — Registers large health regen tracking.
- `"startsmallhealthregen"` (on assigned pet) — Registers small health regen tracking.
- `"pethealthbar_bonuschange"` (on assigned pet) — Updates bonus health.
- `"onremove"` (on active debuffs) — Cleans up tracking tables.

### Events This Component Listens To (Client)
- `"pethealthsymboldirty"` — Triggers client UI symbol refresh.
- `"pethealthsymbol2dirty"` — Triggers client UI secondary symbol refresh.
- `"pethealthstatusdirty"` — Triggers client status (e.g., arrows) refresh.
- `"pethealthpulsedirty"` — Triggers client pulse animation.
- `"pethealthmaxdirty"` — Updates max health on client.
- `"pethealthpctdirty"` — Updates health percentage on client.
- `"pethealthpetskindirty"` — Updates pet skin on client.
- `"petbonusmaxdirty"` — Updates bonus max health on client.
- `"petbonuspctdirty"` — Updates bonus percentage on client.

### Events This Component Pushes (Master Simulation)
- `"clientpethealthsymboldirty"` — Signals symbol update.
- `"clientpethealthstatusdirty"` — Signals status update.
- `"clientpethealthpulsedirty"` — Signals pulse trigger.
- `"clientpetmaxhealthdirty"` — Signals max health update.
- `"clientpethealthdirty"` — Signals health percent update.
- `"clientpetskindirty"` — Signals pet skin update.
- `"clientpetmaxbonusdirty"` — Signals bonus max health update.
- `"clientpetbonusdirty"` — Signals bonus percent update.