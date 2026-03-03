---
id: pethealthbar
title: Pethealthbar
description: Manages network-synchronized pet health visualization and status indicators for companion entities.
tags: [combat, pet, ui, network, status]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 9d4a56ca
system_scope: entity
---

# Pethealthbar

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`PetHealthBar` is a networked component that tracks and synchronizes pet-related health metrics, status effects, and visual symbols for client-side UI rendering. It is attached to entities that act as pets (e.g., beefalos) and mirrors health data from a linked pet entity. The component ensures health percentage, max health, bonus health, status arrows (up/down), and skin data are properly replicated between server and clients, and triggers UI updates via custom events.

It integrates with the `health`, `hunger`, and `inventory` components of the linked pet to determine dynamic status indicators such as freezing, overheating, starvation, fire damage, healing effects (e.g., regen), and equipped regenerative items.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("pethealthbar")

-- Link a pet entity with symbol and max health
local pet = TheWorld.Map:GetPrefab("beefalo"):Spawn()
inst.components.pethealthbar:SetPet(pet, "beefalo", 200)

-- Update pet skin (server only)
if TheWorld.ismastersim then
    inst.components.pethealthbar:SetPetSkin("snow")
end
```

## Dependencies & tags
**Components used:** `health`, `hunger`, `inventory` (accessed via the linked `pet` entity)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_symbol` | net_hash | `0` | Networked hash identifying the pet's visual symbol (e.g., skin/mode). |
| `_symbol2` | net_hash | `0` | Optional secondary symbol hash (used for additional visual states). |
| `_status` | net_tinybyte | `0` | Status indicator: `0` (none), `1` (small up), `2` (large up), `3` (down: e.g., fire/starvation), `4-5` (reserved for overtime scaling). |
| `_maxhealth` | net_ushortint | `0` | Networked base max health of the pet. |
| `_pulse` | net_tinybyte | `0` | Pulse indicator: `0` (none), `1` (green increase), `2` (red decrease). |
| `_healthpct` | net_float | `1.0` | Current health as a fraction of max health (0.0–1.0). |
| `_maxbonus` | net_ushortint | `0` | Bonus health amount (e.g., from gear). |
| `_bonuspct` | net_float | `0.0` | Bonus health as a fraction of max bonus health. |
| `_petskin` | net_hash | `0` | Networked hash of the pet's current skin. |
| `petskin_str` | string | `""` | Client-side string representation of the skin name (master simulation only). |
| `ismastersim` | boolean | `false` | Whether this component instance is on the master simulation. |

## Main functions
### `GetSymbol()`
* **Description:** Returns the current symbol hash (e.g., representing pet skin or variant).
* **Parameters:** None.
* **Returns:** `number` — Symbol hash value.
* **Error states:** None.

### `GetSymbol2()`
* **Description:** Returns the secondary symbol hash.
* **Parameters:** None.
* **Returns:** `number` — Secondary symbol hash value.
* **Error states:** None.

### `GetMaxHealth()`
* **Description:** Returns the base maximum health value.
* **Parameters:** None.
* **Returns:** `number` — Max health value.

### `GetMaxBonus()`
* **Description:** Returns the current bonus health (e.g., from equipped items). Returns `nil` if no bonus is present.
* **Parameters:** None.
* **Returns:** `number` or `nil` — Bonus health value if `> 0`, else `nil`.

### `GetOverTime()`
* **Description:** Interprets the status byte and returns a normalized overtime value for UI or logic use.
* **Parameters:** None.
* **Returns:** `number` — One of: `-2` (large down), `-1` (small down), `0` (none), `1` (small up), `2` (large up).
* **Error states:** Values outside `[0, 5]` are clamped to `0`.

### `GetPercent()`
* **Description:** Returns the current health as a fraction of base max health.
* **Parameters:** None.
* **Returns:** `number` — Health percentage in `[0.0, 1.0]`.

### `GetPercentBonus()`
* **Description:** Returns bonus health as a fraction of max bonus health. Returns `nil` if no bonus exists.
* **Parameters:** None.
* **Returns:** `number` or `nil` — Bonus percentage in `[0.0, 1.0]` if `_maxbonus > 0`, else `nil`.

### `GetPulse()`
* **Description:** Returns the current pulse indicator (`0`, `1`, or `2`).
* **Parameters:** None.
* **Returns:** `number` — Pulse value: `0` (no pulse), `1` (increase), `2` (decrease).

### `ResetPulse()`
* **Description:** Resets the pulse indicator to `0` locally (client-only safe).
* **Parameters:** None.
* **Returns:** Nothing.

### `SetSymbol(symbol)`
* **Description:** (Server-only) Sets the primary symbol hash and broadcasts a dirty event if changed.
* **Parameters:** `symbol` (number) — New symbol hash.
* **Returns:** Nothing.
* **Error states:** No effect if not on master simulation or symbol unchanged.

### `SetMaxHealth(max_health)`
* **Description:** (Server-only) Sets the base max health and broadcasts a dirty event if changed.
* **Parameters:** `max_health` (number) — New max health value.
* **Returns:** Nothing.
* **Error states:** No effect if not on master simulation or value unchanged.

### `SetPetSkin(petskin)`
* **Description:** (Server-only) Sets the pet skin name/hash and broadcasts a dirty event if changed.
* **Parameters:** `petskin` (string or `nil`) — Skin identifier string; `nil` is treated as `0`.
* **Returns:** Nothing.
* **Error states:** No effect if not on master simulation or value unchanged.

### `SetPet(pet, symbol, maxhealth)`
* **Description:** (Server-only) Attaches a pet entity to track and initializes event listeners for health/status updates. Must be called on master simulation.
* **Parameters:**  
  `pet` (Entity) — The pet entity to track (must have a `components.health`).  
  `symbol` (string/number) — Symbol identifier (passed to `SetSymbol`).  
  `maxhealth` (number) — Initial max health (passed to `SetMaxHealth`).  
* **Returns:** Nothing.
* **Error states:** No effect if not on master simulation. Existing listeners and cleanup are handled automatically if a new pet is assigned.

### `OnUpdate(dt)`
* **Description:** (Server-only, auto-called via `StartUpdatingComponent`) Computes and updates the status indicator based on pet state (e.g., freezing, regen, starvation, fire damage, equipped regen items).
* **Parameters:** `dt` (number) — Delta time.
* **Returns:** Nothing.
* **Error states:** No effect if pet is `nil` or not on master simulation.

### `GetDebugString()`
* **Description:** Returns a formatted debug string for console/logging use.
* **Parameters:** None.
* **Returns:** `string` — e.g., `"85.00% of 200, sym: 0x12345678, stat: 1"`.

## Events & listeners
- **Listens to (master sim only):**
  - `healthdelta` — Updates health percentage and pulse on pet health change.
  - `startcorrosivedebuff` / `starthealthregen` / `startsmallhealthregen` — Tracks temporary debuffs/buffs for status determination.
  - `pethealthbar_bonuschange` — Updates bonus health percentage and pulse.
  - `onremove` (on debuffs/buffs) — Cleans up tracking tables.
- **Pushes (client or master):**
  - `clientpethealthsymboldirty`, `clientpethealthsymbol2dirty` — Symbol updated.
  - `clientpethealthstatusdirty` — Status indicator updated.
  - `clientpethealthpulsedirty` — Pulse indicator updated.
  - `clientpetmaxhealthdirty`, `clientpethealthdirty` — Health metrics updated.
  - `clientpetmaxbonusdirty`, `clientpetbonuspctdirty` — Bonus health metrics updated.
  - `clientpetskindirty` — Pet skin updated.
