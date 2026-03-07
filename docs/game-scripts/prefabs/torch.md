---
id: torch
title: Torch
description: Manages the torch item’s lighting, fuel consumption, ignited state, and interaction with Wilson’s skilltree upgrades.
tags: [light, fuel, combat, skill, environment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 502d6891
system_scope: inventory
---

# Torch

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `torch` prefab implements a handheld light source with limited fuel, an attached flame effect, and integration with Wilson’s skill tree. It extends `inventoryitem`, `equippable`, `fueled`, `burnable`, `weapon`, and `complexprojectile` components. When equipped, it ignites and spawns flame FX; when dropped or tossed, it may remain lit and persist in the world. It supports dynamic fuel rate adjustments based on weather and Wilson’s upgrades (`wilson_torch_1` through `wilson_torch_6`), and can ignite other burnable targets via melee attack.

## Usage example
```lua
local torch = Prefab("torch")
-- Example: manually ignite a torch entity
local inst = CreateEntity()
inst:AddComponent("burnable")
inst:AddComponent("fueled")
inst.components.fueled:InitializeFuelLevel(200)
inst.components.burnable:Ignite()
```

## Dependencies & tags
**Components used:** `burnable`, `complexprojectile`, `equippable`, `fueled`, `inventoryitem`, `lighter`, `waterproofer`, `weapon`  
**Tags added:** `wildfireprotected`, `lighter`, `waterproofer`, `weapon`, `projectile`, `complexprojectile`, `special_action_toss`, `keep_equip_toss`, `FX` (temporary)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fires` | table or `nil` | `nil` | List of flame FX entities (`torchfire`) attached while lit and held/tossed. Cleared on extinguish. |
| `_ignitesoundtask` | Task or `nil` | `nil` | Delayed ignite sound task handle. |
| `_extinguishsoundtask` | Task or `nil` | `nil` | Delayed extinguish sound task handle. |
| `_owner` | Entity or `nil` | `nil` | Current owner, used for skill refresh listeners. |
| `_onskillrefresh` | function | `nil` | Handler for skill activation/deactivation events. |
| `_fuelratemult` | number or `nil` | `nil` | Custom fuel rate multiplier (e.g., from skill upgrades). |
| `thrower` | table or `nil` | `nil` | Metadata of the thrower (skill modifiers applied during throw). |

## Main functions
### `SetFuelRateMult(inst, mult)`
* **Description:** Sets a custom fuel rate multiplier (e.g., from Wilson’s skilltree), updating the `fueled` component’s rate based on current weather.
* **Parameters:** `mult` (number) – the multiplier. If `1`, clears the stored multiplier; otherwise stores and applies it.
* **Returns:** Nothing.

### `IgniteTossed(inst)`
* **Description:** Ensures the torch is ignited and spawns flame FX when tossed and landed. Handles skin-specific FX prefabs.
* **Parameters:** `inst` (Entity instance).
* **Returns:** Nothing.

### `RefreshAttunedSkills(inst, owner)`
* **Description:** Applies brightness and fuel rate modifiers derived from Wilson’s active torch skill upgrades (`wilson_torch_1`–`wilson_torch_6`). If no skilltree updater is present, resets modifiers to baseline.
* **Parameters:**  
  `inst` (Entity instance)  
  `owner` (Entity or `nil`) – current owner for skill lookups.
* **Returns:** Nothing.

### `onattack(weapon, attacker, target)`
* **Description:** Melee attack handler that attempts to ignite the target if it is burnable. Checks attacker luck or active skill `willow_controlled_burn_1`.
* **Parameters:**  
  `weapon` (Entity) – the torch instance.  
  `attacker` (Entity) – attacking actor.  
  `target` (Entity or `nil`) – target, may be invalid after damage.
* **Returns:** Nothing.
* **Error states:** Early return if `target` is `nil`/invalid, lacks `burnable` component, or ignition roll fails.

### `onupdatefueledraining(inst)`
* **Description:** Adjusts the `fueled` component’s `rate` based on precipitation and sheltered state of the owner.
* **Parameters:** `inst` (Entity instance).
* **Returns:** Nothing.

### `onfuelchange(newsection, oldsection, inst)`
* **Description:** Called when fuel drops to zero; extinguishes, removes flame FX, and either notifies owner or persists as an extinguished ground item (erodes away).
* **Parameters:**  
  `newsection` (number) – current fuel section index.  
  `oldsection` (number) – previous fuel section index.  
  `inst` (Entity instance).
* **Returns:** Nothing.
* **Error states:** Assumes `inst` has valid `burnable` and `inventoryitem` components; handles cases where item is held, unequipped, or on ground.

### `OnExtinguish(inst)`
* **Description:** Handles external extinguishing (e.g., water balloon, rain) of a stuck/tossed torch; removes FX, cancels projectile state, and resets to idle animation.
* **Parameters:** `inst` (Entity instance).
* **Returns:** Nothing.
* **Error states:** Only acts when torch is not held or empty (i.e., stuck on ground).

### `OnThrown(inst, thrower)`
* **Description:** Triggered when torch is tossed; plays spin loop animation/sound, ignites, spawns FX, and disables pickup.
* **Parameters:**  
  `inst` (Entity instance)  
  `thrower` (Entity) – the tossing actor, for skill modifier capture.
* **Returns:** Nothing.

### `OnPutInInventory(inst, owner)`
* **Description:** Handles torch placement in inventory; extinguishes and removes flame FX.
* **Parameters:**  
  `inst` (Entity instance)  
  `owner` (Entity) – inventory owner.
* **Returns:** Nothing.

### `onequip(inst, owner)`
* **Description:** Called when torch is equipped; ignites, spawns flame FX attached to owner, updates animation, and sets up skill refresh listener.
* **Parameters:**  
  `inst` (Entity instance)  
  `owner` (Entity) – equipped entity.
* **Returns:** Nothing.

### `onunequip(inst, owner)`
* **Description:** Called when torch is unequipped; extinguishes, removes flame FX, resets animation, and clears skill refresh listener.
* **Parameters:**  
  `inst` (Entity instance)  
  `owner` (Entity) – unequipping entity.
* **Returns:** Nothing.

### `onequiptomodel(inst, owner, from_ground)`
* **Description:** Handles torch equipping to a model (e.g., held but not active); extinguishes immediately and removes flame FX.
* **Parameters:**  
  `inst` (Entity instance)  
  `owner` (Entity)  
  `from_ground` (boolean) – unused, present for signature compatibility.
* **Returns:** Nothing.

### `onpocket(inst, owner)`
* **Description:** Called when torch is put in pocket; extinguishes.
* **Parameters:**  
  `inst` (Entity instance)  
  `owner` (Entity).
* **Returns:** Nothing.

### `WatchSkillRefresh(inst, owner)`
* **Description:** Registers/removes listeners for skill activation/deactivation events on the owner to support dynamic brightness/fuel rate updates.
* **Parameters:**  
  `inst` (Entity instance)  
  `owner` (Entity or `nil`).
* **Returns:** Nothing.

### `RemoveThrower(inst)`
* **Description:** Clears the `thrower` metadata when torch is picked up or unequipped after being thrown.
* **Parameters:** `inst` (Entity instance).
* **Returns:** Nothing.

### `OnSave(inst, data)`
* **Description:** Saves torch state for persistence; records whether lit and whether it was thrown (saves `thrower` metadata).
* **Parameters:**  
  `inst` (Entity instance)  
  `data` (table) – save data table.
* **Returns:** Nothing.

### `OnLoad(inst, data)`
* **Description:** Restores torch state on load; re-ignites and re-spawns FX if saved as lit or tossed.
* **Parameters:**  
  `inst` (Entity instance)  
  `data` (table) – loaded save data.
* **Returns:** Nothing.

### `OnRemoveEntity(inst)`
* **Description:** Cleanup helper called on entity removal; cancels pending sound tasks.
* **Parameters:** `inst` (Entity instance).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"onactivateskill_server"` / `"ondeactivateskill_server"` on owner (via `WatchSkillRefresh`) – triggers skill refresh.  
  - `"israining"` world state – triggers fuel rate updates.
- **Pushes:**  
  - `"equipskinneditem"` / `"unequipskinneditem"` – skin notification.  
  - `"itemranout"` – when torch fuel depletes and item is removed while equipped.  
  - `"onignite"` / `"onextinguish"` – via `burnable` component.