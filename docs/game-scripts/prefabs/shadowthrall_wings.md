---
id: shadowthrall_wings
title: Shadowthrall Wings
description: A flying monster entity that serves the Shadow God, equipped with combat, flying locomotion, planar damage, and dynamic visual FX synced via colour change handlers.
tags: [combat, flying, boss, fx, shadow_aligned]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 49175fe2
system_scope: entity
---

# Shadowthrall Wings

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`shadowthrall_wings` is a prefab definition for a flying hostile entity in the DST world. It functions as a flying extension of the Shadowthrall boss faction, utilizing a dedicated brain (`shadowthrall_wings_brain`) and several key components: combat (with retargeting and keep-target logic), flying locomotion (ground speed disabled), health, sanity aura (debuffs nearby players), planar damage (for phase transitions), and loot drops. It dynamically syncs colour changes to visual FX children (`flames`, `fabric`, `cape`) via `colouraddersync`.

## Usage example
This prefab is instantiated automatically by the game engine as part of the Shadowthrall boss encounter and is not typically added manually by modders. However, its structure illustrates standard patterns:
```lua
-- The entity is created via Prefab("shadowthrall_wings", fn, assets, prefabs)
-- and registered in the prefab system; modders would reference it by name.
-- Example of observing its components after spawn:
local wings = TheWorld:FindEntity("shadowthrall_wings")
if wings and wings.components then
    wings.components.combat:SetDefaultDamage(15)  -- adjust damage (advanced)
    wings.components.sanityaura.aura = -TUNING.SANITYAURA_LARGE
end
```

## Dependencies & tags
**Components used:** `colouraddersync`, `combat`, `entitytracker`, `health`, `locomotor`, `lootdropper`, `planardamage`, `sanityaura`  
**Tags added:** `monster`, `hostile`, `scarytoprey`, `flying`, `shadowthrall`, `shadow_aligned`, `FX` (for child entities only)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `highlightchildren` | table | `{flames, fabric, cape}` | Local (client-only) FX entities parented to the shadow thrall; their colour is synced via `colouraddersync` |
| `displaynamefn` | function | `DisplayNameFn` | Returns a custom display name when the player is `player_shadow_aligned` |
| `OnLoadPostPass` | function | `OnLoadPostPass` | Initializes `lastattack` timestamps for coordinated team attacks on load |

## Main functions
### `RetargetFn(inst)`
* **Description:** AI retargeting function used by the `combat` component to select a new target. Skips retargeting if the entity is `appearing` or `invisible`, and prioritizes proximity while maintaining focus on a recently devoured target.  
* **Parameters:** `inst` (Entity) — the shadow thrall wings instance.  
* **Returns:** Entity (Player) — closest player within aggro range, or `nil`.  
* **Error states:** Returns `nil` if no valid target exists or during prohibited state tags.

### `KeepTargetFn(inst, target)`
* **Description:** Determines whether the entity should maintain its current target. Retains the target if it remains within deaggro range or if any allied component (`hands`, `horns`) is nearby.  
* **Parameters:**  
  - `inst` (Entity) — the entity instance.  
  - `target` (Entity) — the current target.  
* **Returns:** `true` if target is kept, `false` otherwise.  
* **Error states:** Returns `false` if the target is no longer valid or out of range, unless allies hold proximity.

### `OnAttacked(inst, data)`
* **Description:** Event handler fired on `attacked`; causes the entity to immediately engage the attacker if not already engaged in combat at attack range.  
* **Parameters:**  
  - `inst` (Entity) — entity instance.  
  - `data` (table) — event data, includes `attacker`.  
* **Returns:** Nothing.

### `OnNewCombatTarget(inst, data)`
* **Description:** Coordinating AI handler; when a new combat target is acquired, suggests that same target to allied `hands` and `horns` components.  
* **Parameters:**  
  - `inst` (Entity) — entity instance.  
  - `data` (table) — event data, includes `oldtarget` and `target`.  
* **Returns:** Nothing.

### `OnLoadPostPass(inst)`
* **Description:** Ensures coordinated attack timing by initializing `lastattack` timestamps for the team (`hands`, `horns`, this entity) on load if missing.  
* **Parameters:** `inst` (Entity) — entity instance.  
* **Returns:** Nothing.

### `DisplayNameFn(inst)`
* **Description:** Returns a custom display name when the local player is aligned with the Shadow God.  
* **Parameters:** `inst` (Entity) — entity instance.  
* **Returns:** String — localized name `STRINGS.NAMES.SHADOWTHRALL_WINGS_ALLEGIANCE`, or `nil`.  

### `GetWintersFeastOrnaments(inst)`
* **Description:** Lootdropper helper that defines Winter's Feast ornament drops. Returns the shadowthralls ornament set only if no allies (`hands`, `horns`) are present.  
* **Parameters:** `inst` (Entity) — entity instance.  
* **Returns:** Table `{ basic = 1, special = "winter_ornament_shadowthralls" }` or `nil`.

### `CreateFlameFx()`, `CreateFabricFx()`, `CreateCapeFx()`
* **Description:** Helper functions that construct client-local non-persistent FX entities for visual flair (flames, fabric飘带, cape). Each is an `FX`-tagged entity with animstate, follower, and parented to this entity.  
* **Parameters:** None.  
* **Returns:** Entity — a local FX instance.  

### `OnColourChanged(inst, r, g, b, a)`
* **Description:** Callback invoked when colour changes (e.g., phase transitions); applies colour offset to all `highlightchildren`.  
* **Parameters:**  
  - `inst` (Entity) — entity instance.  
  - `r`, `g`, `b`, `a` (number) — colour components (0–1).  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `attacked` — triggers `OnAttacked` to re-aggro on damage taken.  
- **Listens to:** `newcombattarget` — triggers `OnNewCombatTarget` to synchronize target suggestion to allies.  
- **Pushes:** None directly; delegates through component events and stategraph messages.