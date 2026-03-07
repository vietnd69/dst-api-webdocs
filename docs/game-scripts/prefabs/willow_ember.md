---
id: willow_ember
title: Willow Ember
description: A consumable item component that manages Willow's pyromancy spellcasting system, including spell selection, fuel consumption, and reticule targeting.
tags: [inventory, spellcasting, pyromancy, willow]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0e4ead31
system_scope: inventory
---

# Willow Ember

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `willow_ember` component implements a hybrid inventory item and spellbook that serves as Willow's primary pyromancy tool. It dynamically populates a spellbook interface based on the owner's skilltree skills, handles spell casting with cooldown tracking, manages ember fuel consumption via stack operations, and coordinates targeting via AOETargeting and reticule mechanics. It functions both as a portable spell container (when in inventory/pocket) and as a ground-based spell launcher (when dropped). Client-side spellbook updates are synchronized via network events when the item is held by the local player.

## Usage example
```lua
-- Create and configure an ember instance
local ember = SpawnPrefab("willow_ember")
ember.components.inventoryitem.canbepickedup = true
ember.components.stackable:SetStackSize(5)
-- The spellbook is auto-populated when placed in an owner's inventory via onputininventory listener
```

## Dependencies & tags
**Components used:** `spellbook`, `aoetargeting`, `aoespell`, `inventoryitem`, `stackable`, `fuel`, `clientpickupsoundsuppressor`, `locomotor`, `inspectable`, `debuff` (via `buff_firefrenzy` prefab), `skilltreeupdater` (via owner), `spellbookcooldowns` (via owner), `channelcaster` (via owner), `burnable` (via targets), `freezable` (via targets), `fueled` (via targets), `rider` (via owner).  
**Tags:** `nosteal`, `NOCLICK`, `willow_ember` (added to instance), `firefrenzy` (added to target via debuff).  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scale` | number | `0.8` | Scale applied to the entity's animation state. |
| `SPELLCOSTS` | table | `table` | Maps spell names (e.g., `"firethrow"`) to their ember consumption cost from `TUNING`. |
| `SKILLTREE_SPELL_DEFS` | table | `table` | Spell definitions for the spellbook UI, including animations, labels, and spell function references. |
| `SKILLTREE_SPELL_ORDER` | table | `table` | Ordered list of skill keys that determines the display order of spells in the UI. |
| `_owner` | Entity? | `nil` | The entity currently holding the ember; used for skill refresh events. |
| `_updatespells` | net_event | `nil` | Network event used to trigger client-side spellbook updates. |
| `_onskillrefresh_server` | function | `nil` | Server-side callback for when skills change on the owner. |
| `_onskillrefresh_client` | function | `nil` | Client-side callback for when skills change on the owner. |

## Main functions
### `CheckStackSize(inst, doer, spell)`
* **Description:** Verifies whether the `doer` has at least `SPELLCOSTS[spell]` embers in their inventory to cast the spell.  
* **Parameters:** `inst` (Entity) – the ember instance; `doer` (Entity) – the player attempting to cast; `spell` (string) – spell key (e.g., `"firethrow"`).  
* **Returns:** `true` if the required stack size is available in inventory; `false` otherwise.  

### `ConsumeEmbers(inst, doer, amount)`
* **Description:** Deducts `amount` embers from the owner's inventory, handling stack splitting and deferred removal to support repeat casting. Prioritizes the active slot and attempts to swap the spent stack with another stack for continued casting.  
* **Parameters:** `inst` (Entity) – the ember instance being cast; `doer` (Entity) – the owner; `amount` (number) – number of embers to consume.  
* **Returns:** Nothing. Stack sizes are modified in-place and spent items may be removed.  

### `OnOpenSpellBook(inst)`
* **Description:** Switches the ember's inventory image to its open variant and plays the open sound.  
* **Parameters:** `inst` (Entity) – the ember instance.  
* **Returns:** Nothing.  

### `OnCloseSpellBook(inst)`
* **Description:** Reverts the inventory image and stops the open sound.  
* **Parameters:** `inst` (Entity) – the ember instance.  
* **Returns:** Nothing.  

### `TryThrowFire(inst, doer, pos)`
* **Description:** Spawns a `willow_throw_flame` at `pos` and ignites burnable/fuelable entities within a radius.  
* **Parameters:** `inst` (Entity) – the ember instance; `doer` (Entity) – the caster; `pos` (Vector3) – target position.  
* **Returns:** `true` if an ember was consumed and fire was thrown; `false` otherwise (checked via `CheckStackSize`).  

### `TryBurstFire(inst, doer, pos)`
* **Description:** Casts Fire Burst: schedules ignite/damage events on multiple nearby entities (via `willow_ember_common.GetBurstTargets`).  
* **Parameters:** `inst` (Entity); `doer` (Entity); `pos` (Vector3).  
* **Returns:** `true` if targets were found and scheduled; `false` otherwise.  

### `TryBallFire(inst, doer, pos)`
* **Description:** Spawns a static `emberlight` entity at `pos` to emit light and ignite targets.  
* **Parameters:** `inst` (Entity); `doer` (Entity); `pos` (Vector3).  
* **Returns:** `true`.  

### `TryLunarFire(inst, doer, pos)`
* **Description:** Initiates Lunar Fire channeling via `channelcaster` and a `flamethrower_fx` entity. Enforces cooldown, mounted checks, and fuels the channel for `TUNING.WILLOW_LUNAR_FIRE_TIME`.  
* **Parameters:** `inst` (Entity); `doer` (Entity); `pos` (Vector3).  
* **Returns:** `true` if channeling started; `false` if conditions failed or channeling initialization failed.  

### `TryShadowFire(inst, doer, pos)`
* **Description:** Casts Shadow Fire: spawns 5 `willow_shadow_flame` instances in a circle around the doer. Checks cooldown before spawning.  
* **Parameters:** `inst` (Entity); `doer` (Entity); `pos` (Vector3).  
* **Returns:** `true` if embers consumed and embers spawned; `false` otherwise.  

### `TryFireFrenzy(inst, doer, pos)`
* **Description:** Applies the `buff_firefrenzy` debuff to the `doer` (spawns a `willow_frenzy` entity).  
* **Parameters:** `inst` (Entity); `doer` (Entity); `pos` (Vector3).  
* **Returns:** `true` if debuff applied; `false` otherwise.  

### `FireThrowSpellFn(inst, doer, pos)`
* **Description:** Main spell function for Fire Throw: validates ember cost, calls `TryThrowFire`, and consumes embers on success.  
* **Parameters:** `inst` (Entity); `doer` (Entity); `pos` (Vector3).  
* **Returns:** `{true}` on success; `{false, "NOT_ENOUGH_EMBERS"}` or `{false, "NO_TARGETS"}` on failure.  

### `FireBurstSpellFn(inst, doer, pos)`
* **Description:** Main spell function for Fire Burst: validates cost, calls `TryBurstFire`, consumes embers.  
* **Returns:** `{true}` on success; `{false, "NOT_ENOUGH_EMBERS"}` or `{false, "NO_TARGETS"}` on failure.  

### `FireBallSpellFn(inst, doer, pos)`
* **Description:** Main spell function for Fire Ball.  
* **Returns:** Same as above.  

### `LunarFireSpellFn(inst, doer, pos)`
* **Description:** Main spell function for Lunar Fire: checks cooldown, mounted state, cost, and calls `TryLunarFire`.  
* **Returns:** `{true}` on success; `{false, "SPELL_ON_COOLDOWN"}`, `{false, "CANT_SPELL_MOUNTED"}`, or `{false, "NOT_ENOUGH_EMBERS"}` on failure.  

### `ShadowFireSpellFn(inst, doer, pos)`
* **Description:** Main spell function for Shadow Fire: checks cooldown and cost.  
* **Returns:** `{true}` on success; `{false, "SPELL_ON_COOLDOWN"}` or `{false, "NOT_ENOUGH_EMBERS"}` on failure.  

### `FireFrenzySpellFn(inst, doer, pos)`
* **Description:** Main spell function for Fire Frenzy.  
* **Returns:** `{true}` on success; `{false, "NOT_ENOUGH_EMBERS"}` on failure.  

### `updatespells(inst, owner)`
* **Description:** (Server) Builds the spellbook item list based on `SKILLTREE_SPELL_ORDER` and the owner’s activated skills, then sets `spellbook.items`.  
* **Parameters:** `inst` (Entity); `owner` (Entity).  
* **Returns:** Nothing.  

### `DoClientUpdateSpells(inst, force)`
* **Description:** (Client) Updates the spellbook for the local player when the ember is held or its skill state changes. Calls `updatespells` and manages skill refresh listeners.  
* **Parameters:** `inst` (Entity); `force` (boolean) – forces an update even if owner hasn’t changed.  
* **Returns:** Nothing.  

## Events & listeners
- **Listens to:**  
  - `animover` – removes the ember instance when animation finishes (used in `KillEmber`).  
  - `onputininventory` – triggers `topocket` (enables persistence and cancels auto-removal).  
  - `ondropped` – triggers `toground` (disables persistence and schedules removal).  
  - `onactivateskill_server` / `ondeactivateskill_server` – fires `inst._onskillrefresh_server` on the owner (server).  
  - `onactivateskill_client` / `ondeactivateskill_client` – fires `inst._onskillrefresh_client` on the owner (client).  
  - `willow_ember._updatespells` (network event) – triggers `OnUpdateSpellsDirty` on the client.  
  - `death` – stops the `buff_firefrenzy` debuff when the target dies.  
  - `stopchannelcast` – cancels Lunar Fire channel and kills `flamethrower_fx` on channel interruption.  
- **Pushes:**  
  - None directly; delegates to component events (`inventoryitem.imagechange`, `stacksizechange`, etc.) and spellbook events.