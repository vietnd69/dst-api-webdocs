---
id: lighter
title: Lighter
description: Manages the Willow lighter item's behavior, including ignition, fuel consumption, lightning attacks, and skill-based enhancements.
tags: [combat, crafting, inventory, fx, skill]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 04e161c5
system_scope: inventory
---

# Lighter

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `lighter` component is attached to the Willow Lighter prefab and manages its core gameplay behavior: burning fuel, producing light and heat, igniting targets on attack, and absorbing nearby fire/smolder/ember entities when channeling (activated via the *Attuned Lighter* skill). It integrates heavily with the `burnable`, `fueled`, `weapon`, `equippable`, `cooker`, and `channelcastable` components. The component is initialized only on the master simulation and does not require explicit usage by modders — it is automatically added during prefab construction.

## Usage example
Modders do not directly instantiate or manage this component. It is added to the `lighter` prefab by the framework. For reference, here is how the component is attached during construction:
```lua
inst:AddComponent("lighter")
-- Event listeners and skill-refresh logic are set up internally
inst._onskillrefresh = function(owner) RefreshAttunedSkills(inst, owner) end
```

## Dependencies & tags
**Components used:** `burnable`, `fueled`, `equippable`, `inventoryitem`, `weapon`, `cooker`, `channelcastable`, `inspectable`, `skilltreeupdater`, `sheltered`, `rainimmunity`, `health`, `inventory`, `propagator`  
**Tags added:** `dangerouscooker`, `wildfireprotected`, `lighter`, `cooker`, `weapon`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fires` | table or `nil` | `nil` | Stores references to active fire FX prefabs (e.g., lighter fire entities). `nil` when unequipped. |
| `snuff_task` | `DoPeriodicTask` or `nil` | `nil` | Task reference for periodic snuff/absorb scanning during channeling. |
| `snuff_fx` | entity or `nil` | `nil` | FX entity for channeling absorb effect. |
| `_owner` | `ThesimEntity` or `nil` | `nil` | Cached owner entity for skill event registration. |
| `_onskillrefresh` | function | `function(owner)` | Internal callback used to re-evaluate skill effects when skills change. |

## Main functions
The `lighter` component has no public methods — all functionality is wired via callbacks and event handlers.

## Events & listeners
- **Listens to:**  
  - `onactivateskill_server` (on owner) — triggers `RefreshAttunedSkills`  
  - `ondeactivateskill_server` (on owner) — triggers `RefreshAttunedSkills`  
  - `israining` (world state) — triggers `onisraining`  
- **Pushes:** None directly; invokes callbacks on other components (e.g., `onignite`, `onextinguish` via `burnable`; `itemranout` via owner when fuel depletes).

### Callbacks and internal helpers (not public API, but relevant for modding extension)

#### `UpdateSnuff(inst, owner, entity)`
*   **Description:** Scans entities within `ABSORB_RANGE` (2.5 units) for burning, smoldering, or willow_ember entities and extinguishes/smoothers them, spawning FX and optionally returning embers to the inventory. Called periodically during channeling.
*   **Parameters:** `inst` (entity), `owner` (entity), `entity` (not used; passed by task).
*   **Returns:** Nothing.

#### `OnStartChanneling(inst, user)`
*   **Description:** Starts the absorb task and FX when the *Attuned Lighter* channeling begins.
*   **Parameters:** `inst` (lighter entity), `user` (the channeling character).
*   **Returns:** Nothing.

#### `OnStopChanneling(inst, user)`
*   **Description:** Cancels the absorb task and cleans up FX upon channeling stop.
*   **Parameters:** `inst` (lighter entity), `user` (the channeling character).
*   **Returns:** Nothing.

#### `RefreshAttunedSkills(inst, owner)`
*   **Description:** Adds or removes the `channelcastable` component based on the `willow_attuned_lighter` skill activation, and updates light radius via `willow_lightradius_1/2` skills.
*   **Parameters:** `inst` (lighter entity), `owner` (character, or `nil`).
*   **Returns:** Nothing.

#### `onequip(inst, owner)`
*   **Description:** Called when equipped. Lights the lighter, spawns and attaches fire FX, plays sound, and sets up skill watching.
*   **Parameters:** `inst`, `owner`.
*   **Returns:** Nothing.

#### `onunequip(inst, owner)`
*   **Description:** Called when unequipped. Extinguishes the lighter, removes fire FX, updates animations and sound.
*   **Parameters:** `inst`, `owner`.
*   **Returns:** Nothing.

#### `onequiptomodel(inst, owner, from_ground)`
*   **Description:** Called when the item is equipped to a model (e.g., held in inventory view). Extinguishes fire and removes FX.
*   **Parameters:** `inst`, `owner`, `from_ground`.
*   **Returns:** Nothing.

#### `onpocket(inst, owner)`
*   **Description:** Called when pocketed (e.g., moved to inventory). Extinguishes the lighter.
*   **Parameters:** `inst`, `owner`.
*   **Returns:** Nothing.

#### `onattack(weapon, attacker, target)`
*   **Description:** Handles ignite-on-attack logic. Uses `willow_controlled_burn_1` or luck roll against `TUNING.LIGHTER_ATTACK_IGNITE_PERCENT * flammability` to ignite the target.
*   **Parameters:** `weapon` (lighter), `attacker`, `target`.
*   **Returns:** Nothing.

#### `onupdatefueledraining(inst)`
*   **Description:** Dynamically adjusts fuel consumption rate based on sheltered/rain-immune status and precipitation.
*   **Parameters:** `inst`.
*   **Returns:** Nothing.

#### `onisraining(inst, israining)`
*   **Description:** Hooks into world rain state to set/unset dynamic fuel drain rate logic.
*   **Parameters:** `inst`, `israining` (boolean).
*   **Returns:** Nothing.

#### `onfuelchange(newsection, oldsection, inst)`
*   **Description:** Callback for fueled component when fuel reaches zero; extinguishes, notifies owner (`itemranout`), and removes the item.
*   **Parameters:** `newsection`, `oldsection`, `inst`.
*   **Returns:** Nothing.

#### `oncook(inst, product, chef)`
*   **Description:** Handles cooking with the lighter; inflicts fire damage if chef is not an expert.
*   **Parameters:** `inst`, `product`, `chef`.
*   **Returns:** Nothing.

#### `OnRemoveEntity(inst)`
*   **Description:** Cleanup on entity removal; kills channel FX if active.
*   **Parameters:** `inst`.
*   **Returns:** Nothing.

#### `ontakefuel(inst)`
*   **Description:** Plays sound when fuel is added.
*   **Parameters:** `inst`.
*   **Returns:** Nothing.