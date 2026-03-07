---
id: willow
title: Willow
description: Willow is a player character prefab that specializes in fire-based mechanics, with abilities tied to burning entities, ember spawning on death, and resistance to temperature extremes.
tags: [player, combat, fire, temperature, skilltree]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: de638e47
system_scope: player
---

# Willow

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`willow.lua` defines the `Willow` player character prefab, a fire-specialist character in DST. It extends `MakePlayerCharacter` and integrates with multiple core systems: temperature regulation (with unique resistance to freezing and overheating), sanity gain near burning objects, fire-based combat multipliers (e.g., via `firefrenzy`), and ember spawning upon entity death (via the `willow_embers` skill). Willow benefits from fueling campfires and other fire structures, and has a custom idle animation that activates when holding `bernie_inactive`. The prefab also includes server-specific logic for `lavaarena` and `quagmire` game modes.

## Usage example
```lua
-- Willow is instantiated as a playable character prefab via `MakePlayerCharacter`.
-- To add Willow-related components to a custom entity:
local inst = CreateEntity()
inst:AddComponent("health")
inst.components.health:SetMaxHealth(150)
inst.components.health.fire_damage_scale = 0.5

inst:AddComponent("temperature")
inst.components.temperature.inherentinsulation = -TUNING.INSULATION_TINY
inst.components.temperature:SetFreezingHurtRate(150 / 20) -- Example rate
inst.components.temperature:SetOverheatHurtRate(150 / 20)

-- Willow-specific sanity aura near fires (simplified)
inst:AddComponent("sanity")
inst.components.sanity.custom_rate_fn = function(inst)
    -- [custom logic would be added here]
    return 0
end
```

## Dependencies & tags
**Components used:** `health`, `hunger`, `sanity`, `temperature`, `foodaffinity`, `combat`, `fuelmaster`, `freezable`, `inventory`, `skilltreeupdater`, `lootdropper`, `stackable`, `burnable`, `pethealthbar` (in `lavaarena`).
**Tags added by Willow (in `common_postinit`):** `pyromaniac`, `expertchef`, `bernieowner`, `heatresistant`.
**Tags conditionally added in `master_postinit`:**
- `bernie_reviver` (in `lavaarena` mode)
- `quagmire_shopper` (in `quagmire` mode)

## Properties
No public properties are initialized directly in this file’s constructor. Willow is configured primarily through component assignments and function overrides in `common_postinit` and `master_postinit`. Internal state includes:
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_onentitydroplootfn` | function | `nil` | Internal callback for `entity_droploot` events. |
| `_onentitydeathfn` | function | `nil` | Internal callback for `entity_death` events. |
| `refusestobowtoroyalty` | boolean | `true` | Prevents Willow from bowing to royalty (server-specific). |

## Main functions
### `customidleanimfn(inst)`
*   **Description:** Returns the animation name for idle state when Willow holds `bernie_inactive`. Otherwise returns `nil`.
*   **Parameters:** `inst` (Entity) — the Willow entity.
*   **Returns:** String `"idle_willow"` if holding `bernie_inactive`, else `nil`.

### `sanityfn(inst)`
*   **Description:** Computes the per-frame sanity delta based on nearby burning entities. Provides a sanity gain up to `TUNING.SANITYAURA_LARGE` when near active fires; returns a large *sanity loss* if freezing (via `temperature:IsFreezing()`).
*   **Parameters:** `inst` (Entity) — the Willow entity.
*   **Returns:** Number — current sanity delta (positive for gain, negative for loss).
*   **Error states:** Uses distance-squared capping (`distsq >= 1`) to avoid division by zero.

### `GetFuelMasterBonus(inst, item, target)`
*   **Description:** Returns a fuel bonus multiplier when Willow fuels compatible fire structures.
*   **Parameters:**  
  - `inst` (Entity) — the Willow entity.  
  - `item` — (unused in logic, may be `nil` or item being used).  
  - `target` (Entity) — the fuelable object (e.g., campfire, nightlight, or custom `firefuellight`).  
*   **Returns:** `TUNING.WILLOW_CAMPFIRE_FUEL_MULT` if `target` has tags `"firefuellight"`, `"campfire"`, or is `"nightlight"`; otherwise `1`.

### `IsValidVictim(victim, explosive)`
*   **Description:** Checks if `victim` is eligible for ember spawning on death.
*   **Parameters:**  
  - `victim` (Entity) — the entity that died.  
  - `explosive` (boolean) — if `true`, ignores `health:IsDead()` check.  
*   **Returns:** `true` if `victim` has embers and either is dead or `explosive` is `true`.

### `OnEntityDropLoot(inst, data)`
*   **Description:** Spawns embers on eligible corpses if Willow’s `willow_embers` skill is activated and within range. Marks victims to prevent duplicate spawning by multipleWillows.
*   **Parameters:**  
  - `inst` (Entity) — Willow.  
  - `data` (table) — event data containing `inst` (victim) and `explosive`.  
*   **Returns:** Nothing.
*   **Error states:** Skips spawning if `victim.noembertask` exists, `victim` is invalid, or Willow is dead and `victim` is not Willow.

### `OnEntityDeath(inst, data)`
*   **Description:** Hooks into `entity_death` to mark victims and trigger ember spawning via `OnEntityDropLoot`.
*   **Parameters:** Same as `OnEntityDropLoot`.
*   **Returns:** Nothing.

### `OnRespawnedFromGhost(inst)`
*   **Description:** Updates Willow’s freezing resistance and registers global event listeners for `entity_droploot` and `entity_death` if not already registered.
*   **Parameters:** `inst` (Entity) — the respawned Willow.
*   **Returns:** Nothing.

### `TryToOnRespawnedFromGhost(inst)`
*   **Description:** Safely invokes `OnRespawnedFromGhost` after a brief delay to ensure health and tags are loaded.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.
*   **Error states:** Early returns if `inst` is dead or currently a ghost.

### `OnBecameGhost(inst)`
*   **Description:** Cleans up global event listeners when Willow becomes a ghost.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `CustomCombatDamage(inst, target, weapon, multiplier, mount)`
*   **Description:** Applies combat damage multiplier when target is burning and Willow has the `firefrenzy` tag.
*   **Parameters:** Same signature as `combat.customdamagemultfn`.
*   **Returns:** `TUNING.WILLOW_FIREFRENZY_MULT` if conditions met; otherwise `nil` (no multiplier applied).

## Events & listeners
- **Listens to:**  
  - `ms_becameghost` → `OnBecameGhost`  
  - `ms_respawnedfromghost` → `OnRespawnedFromGhost`  
  - `entity_droploot` (on `TheWorld`) → `OnEntityDropLoot`  
  - `entity_death` (on `TheWorld`) → `OnEntityDeath`  
- **Pushes:** No events are explicitly pushed by this component.