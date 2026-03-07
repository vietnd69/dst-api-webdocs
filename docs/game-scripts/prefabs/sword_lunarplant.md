---
id: sword_lunarplant
title: Sword Lunarplant
description: A reusable prefab that provides a lunar plant-based weapon with set-bonus activation logic, floating fx management, and broken state handling.
tags: [combat, fx, inventory, broken, setbonus]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4ebd3f45
system_scope: combat
---

# Sword Lunarplant

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`sword_lunarplant` is a weapon prefab implementing a two-part weapon system (main weapon and two blade FX entities) with logic for set-bonus activation when paired with the `lunarplanthat` headgear. It manages broken/repaired states, floating fx parenting, highlight syncing, and dynamic damage/planar damage modification via the `planardamage` component. The prefab uses several components (`equippable`, `weapon`, `finiteuses`, `floater`, `planardamage`, `inspectable`, `inventoryitem`, `lunarplant_tentacle_weapon`) to implement full DST-compatible behaviour.

## Usage example
```lua
local inst = SpawnPrefab("sword_lunarplant")
inst.components.weapon:SetDamage(45) -- override base damage
inst.components.finiteuses:SetUses(10)
-- When equipped by a player wearing lunarplanthat, the set bonus automatically activates
```

## Dependencies & tags
**Components used:** `equippable`, `weapon`, `finiteuses`, `floater`, `planardamage`, `inspectable`, `inventoryitem`, `lunarplant_tentacle_weapon`, `highlightchild`, `colouradder`, `damagetypebonus`.  
**Tags added:** `sharp`, `show_broken_ui`, `weapon`, `FX` (on blade prefabs only).  
**Tags removed:** `broken` (on repair).

## Properties
No public properties are defined in this prefab's constructor. All state is held internally (`inst._bonusenabled`, `inst._owner`, `inst._fxowner`, `inst.isbroken`, `inst.base_damage`) or via components.

## Main functions
### `SetBuffEnabled(inst, enabled)`
*   **Description:** Enables or disables the lunar plant set bonus, which modifies weapon damage and planar damage. Called when equipment state changes for the owner or during initial setup.
*   **Parameters:** `enabled` (boolean) — whether the set bonus is active.
*   **Returns:** Nothing.
*   **Error states:** No-op if `inst._bonusenabled` already matches `enabled`.

### `SetBuffOwner(inst, owner)`
*   **Description:** Assigns a new owner and sets up event callbacks to monitor equip/unequip events (especially for headgear). Triggers set bonus on equipping a `lunarplanthat`.
*   **Parameters:** `owner` (entity or `nil`) — the entity that owns the weapon.
*   **Returns:** Nothing.
*   **Error states:** Removes callbacks for previous owner if changed.

### `SetFxOwner(inst, owner)`
*   **Description:** Manages blade FX entity parenting and `colouradder`/`highlightchild` integration. When `owner` is `nil`, blades float independently; when assigned, blades follow owner symbols.
*   **Parameters:** `owner` (entity or `nil`) — the entity whose body the blades attach to.
*   **Returns:** Nothing.

### `OnAttack(inst, attacker, target)`
*   **Description:** Handles post-attack effects. Spawns `hitsparks_fx` at the impact point.
*   **Parameters:** `attacker` (entity), `target` (entity or `nil`) — the entity being attacked.
*   **Returns:** Nothing.

### `SetupComponents(inst)`
*   **Description:** Adds and configures `equippable` and `weapon` components with appropriate callbacks.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `DisableComponents(inst)`
*   **Description:** Removes `equippable` and `weapon` components. Called when the weapon is broken.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetIsBroken(inst, isbroken)`
*   **Description:** Updates the floater configuration and `isbroken` netbool based on broken state. Adjusts scale and swap data for animations.
*   **Parameters:** `isbroken` (boolean) — whether the weapon is broken.
*   **Returns:** Nothing.

### `OnBroken(inst)`
*   **Description:** Applies broken state: disables weapon components, plays broken anim, sets UI override, adds `broken` tag.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnRepaired(inst)`
*   **Description:** Restores the weapon: re-adds components, resets animations, removes `broken` tag and UI override.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `equip` / `unequip` (on owner) — triggers set-bonus enable/disable logic.  
  - `floater_stopfloating` — restores looping idle animation and resets frame on blades.  
  - `isbrokendirty` (client-only) — updates floater and anim state when broken state changes.  
  - `onremove` (on blade entities via `colouradder:AttachChild`) — auto-detaches on removal.
- **Pushes:** None directly. Relies on component events (`equippable`, `weapon`).