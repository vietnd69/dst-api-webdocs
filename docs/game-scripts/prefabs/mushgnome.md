---
id: mushgnome
title: Mushgnome
description: A lunar-aligned tree monster that spores periodically, deals combat damage, and emits a dynamic sanity aura based on enemy proximity.
tags: [combat, ai, boss, environment, lunar]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 41a38678
system_scope: entity
---

# Mushgnome

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `mushgnome` prefab represents a rare lunar-aligned enemy found in the Caves. It functions as a semi-passive tree-like monster that emits light, attacks intruders, periodically spawns `spore_moon` entities, and modifies nearby player sanity. It integrates multiple core components—`combat`, `health`, `locomotor`, `sleeper`, `periodicspawner`, `burnable`, and `sanityaura`—to control its behavior. Its state graph (`SGmushgnome`) and brain (`mushgnomebrain`) handle AI orchestration, while its spawn logic and save/load handlers preserve sleep and hibernation state.

## Usage example
```lua
local inst = Prefabs("mushgnome"):Spawn()
-- No additional setup needed; the prefab is fully initialized on spawn.
-- However, custom behavior can be added:
inst:AddTag("my_custom_tag")
inst:ListenForEvent("custom_event", function(inst) ... end)
```

## Dependencies & tags
**Components used:** `locomotor`, `drownable`, `sanityaura`, `burnable`, `propagator`, `freezable`, `health`, `combat`, `hauntable`, `sleeper`, `lootdropper`, `inspectable`, `periodicspawner`
**Tags:** Adds `moon_spore_protection`, `leif`, `monster`, `tree`, `lunar_aligned`; checks `monster` and `tree` for combat targeting.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `walkspeed` | number | `2.0` | Movement speed set on the `locomotor` component. |
| `attackrange` | number | `15` | Set via `combat:SetRange(15)`, enabling long-range engagement. |
| `hiteffectsymbol` | string | `"body"` | Symbol used for hit effects in combat. |
| `acceptsheat` | boolean | `true` | Whether it accepts heat propagation (set during initialization). |
| `flammability` | number | `TUNING.LEIF_FLAMMABILITY` | Burn sensitivity multiplier from `burnable.flammability`. |
| `resistance` | number | `3` | Sleep resistance (via `sleeper:SetResistance`). |

## Main functions
### `onloadfn(inst, data)`
*   **Description:** Restores sleeper state from saved data (hibernation, sleep time, and sleep status).
*   **Parameters:** `inst` (Entity), `data` (table or `nil`) — saved state containing `hibernate`, `sleep_time`, and `sleeping`.
*   **Returns:** Nothing.
*   **Error states:** Operates safely even when `data` is `nil`.

### `onsavefn(inst, data)`
*   **Description:** Saves current sleeper state for persistence.
*   **Parameters:** `inst` (Entity), `data` (table) — output table populated with `sleeping`, `sleep_time`, and `hibernate`.
*   **Returns:** Nothing.

### `CalcSanityAura(inst)`
*   **Description:** Computes the sanity aura value dynamically based on combat state.
*   **Parameters:** `inst` (Entity).
*   **Returns:** `-TUNING.SANITYAURA_MED` if a target is engaged, else `-TUNING.SANITYAURA_SMALL`.
*   **Error states:** Returns negative values only; no fallback.

### `OnBurnt(inst)`
*   **Description:** Activates heat propagation when the mushgnome burns while alive.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `onspawnfn(inst, spawn)`
*   **Description:** Callback executed when a `spore_moon` is spawned; handles sound playback and positioning offset.
*   **Parameters:** `inst` (Entity — the mushgnome), `spawn` (Entity — the new spore).
*   **Returns:** Nothing.

### `OnAttacked(inst, data)`
*   **Description:** Attacker response handler—sets the entity's combat target.
*   **Parameters:** `inst` (Entity), `data` (table) — expected to contain `attacker`.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `attacked` — fires `OnAttacked` to set combat target on being attacked.
- **Pushes:** No events are pushed by this prefab's top-level functions; event emission is delegated to components (`health`, `combat`, etc.).