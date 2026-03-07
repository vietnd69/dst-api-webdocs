---
id: pigman
title: Pigman
description: Manages the behavior, state transitions, and interactions of pig-based characters (normal pig, pig guard, and moonpig), including loyalty mechanics, combat, transformation, and trading.
tags: [combat, ai, transformation, npc]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 81a95890
system_scope: entity
---

# Pigman

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `pigman` script defines the prefabs for `pigman`, `pigguard`, and `moonpig`. It establishes the coreEntity Component System (ECS) setup for these characters, including state graphs, components, and behavior logic. Key responsibilities include managing combat, loyalty-based follower relationships, item trading, transformation between normal guard/werepig states, sleep cycles, and sanity effects. It integrates with numerous components (e.g., `combat`, `eater`, `follower`, `werebeast`, `sleeper`, `trader`) and defines state-specific configuration functions (`SetNormalPig`, `SetGuardPig`, `SetWerePig`, `MoonpigRetargetFn`, etc.).

## Usage example
```lua
-- Create a standard pigman (will initialize as normal pig)
local pig = SpawnPrefab("pigman")

-- Force a pig to become a guard
if pig.prefab == "pigman" and not pig:HasTag("guard") then
    pig.components.werebeast:SetOnNormalFn(SetGuardPig)
    SetGuardPig(pig)
end

-- Trigger pig transformation into werepig state
if pig.components.werebeast ~= nil and not pig.components.werebeast:IsInWereState() then
    pig.components.werebeast:TriggerDelta(1)
end
```

## Dependencies & tags
**Components used:** `bloomer`, `combat`, `drownable`, `eater`, `embarker`, `freezable`, `follower`, `health`, `hauntable`, `homeseeker`, `inspectable`, `inventory`, `inventoryitem`, `knownlocations`, `locomotor`, `lootdropper`, `named`, `sanityaura`, `sleeper`, `talker`, `trader`, `werebeast`, `spawnfader`, `entitytracker`.  
**Tags added:** `character`, `pig`, `scarytoprey`, `_named`, `trader` (non-moonpig only), `guard` (pigguard/moonpig only), `werepig` (moonpig only), `moonbeast` (moonpig only), `hostile` (moonpig only).  
**Tags checked:** `player`, `monster`, `merm`, `guard`, `werepig`, `moonbeast`, `shadowthrall_parasite_hosted`, `pigelite`, `pig`, `king`, `campfire`, `fire`, `playerghost`, `INLIMBO`, `NPC_contestant`, `abigail`, `player`, `character`, `wereplayer`.

## Properties
No public properties are exposed or modified directly by external code. Internal state is managed through component methods and event callbacks.

## Main functions
### `common(moonbeast)`
*   **Description:** Common setup routine shared by all three pig prefabs (`pigman`, `pigguard`, `moonpig`). Initializes entity, physics, animations, and core components.
*   **Parameters:** `moonbeast` (boolean) — if true, configures for `moonpig`; otherwise for land-based pig variants.
*   **Returns:** `inst` (Entity) — the fully initialized entity instance.
*   **Error states:** Not applicable. Returns `nil` for non-master simulations on client-only setup.

### `SetNormalPig(inst)`
*   **Description:** Configures the entity to operate as a normal, non-hostile pig (non-guard, non-werepig). Resets combat and sleeper parameters to default values.
*   **Parameters:** `inst` (Entity) — the entity to configure.
*   **Returns:** Nothing.
*   **Error states:** Does not validate presence of components; assumes required components exist.

### `SetGuardPig(inst)`
*   **Description:** Configures the entity as a pig guard — sets it to defend the king or campfire, wakes constantly, and enforces guard-specific behavior.
*   **Parameters:** `inst` (Entity) — the entity to configure.
*   **Returns:** Nothing.
*   **Error states:** Does not validate presence of components; assumes required components exist.

### `SetWerePig(inst)`
*   **Description:** Transforms the entity into a hostile werepig state. Disables trading, clears follower relationships, and sets aggressive combat and movement parameters.
*   **Parameters:** `inst` (Entity) — the entity to configure.
*   **Returns:** Nothing.
*   **Error states:** Does not validate presence of components; assumes required components exist.

### `NormalRetargetFn(inst)`
*   **Description:** Default retarget logic: finds valid targets in light, excluding ghosts, limbo entities, and special contest roles.
*   **Parameters:** `inst` (Entity) — the entity performing the search.
*   **Returns:** `Entity` or `nil` — the nearest valid combat target.
*   **Error states:** Returns `nil` if no valid targets are found or if the entity is in limbo.

### `NormalKeepTargetFn(inst, target)`
*   **Description:** Determines whether the pig should retain its current target (e.g., keeps target only if alive, in light, and not transforming).
*   **Parameters:**  
    - `inst` (Entity) — the pig entity.  
    - `target` (Entity) — the current target.
*   **Returns:** `boolean` — `true` if the target should be kept.
*   **Error states:** Returns `false` if the target is dead, in dark, or currently transforming.

### `GuardRetargetFn(inst)`
*   **Description:** Guard-specific retarget logic: prioritizes defending the king or campfire, then looks for invading entities or light-stealing players at night.
*   **Parameters:** `inst` (Entity) — the guard pig entity.
*   **Returns:** `Entity` or `nil`.
*   **Error states:** Returns `nil` if no valid threat or defense target exists.

### `GuardKeepTargetFn(inst, target)`
*   **Description:** Guard-specific target retention logic: only retains targets near the defended object (king/campfire) or within defend distance.
*   **Parameters:**  
    - `inst` (Entity) — the guard pig entity.  
    - `target` (Entity) — the current target.
*   **Returns:** `boolean` — `true` if target remains in defend zone.
*   **Error states:** Returns `false` if target exits defend range or the guard itself is too far.

### `WerepigRetargetFn(inst)`
*   **Description:** Werepig-specific retarget logic: ignores other werepigs, wereplayers, and transformed entities.
*   **Parameters:** `inst` (Entity) — the werepig entity.
*   **Returns:** `Entity` or `nil`.
*   **Error states:** Returns `nil` if no valid target is found.

### `MoonpigRetargetFn(inst)`
*   **Description:** Moonpig-specific retarget logic: restricts aggro to within moonbase proximity and excludes moonbeasts.
*   **Parameters:** `inst` (Entity) — the moonpig entity.
*   **Returns:** `Entity` or `nil`.
*   **Error states:** Returns `nil` if outside aggro range of moonbase.

### `OnGetItemFromPlayer(inst, giver, item)`
*   **Description:** Handler for items received from players: accepts food (meat/horrible increases loyalty) and hats (equips automatically). Wakes pig if asleep.
*   **Parameters:**  
    - `inst` (Entity) — the pig entity.  
    - `giver` (Entity) — the player giving the item.  
    - `item` (Entity) — the item given.
*   **Returns:** Nothing.
*   **Error states:** Loyalty only increases if the item is not in the inventory (prevents stack merging issues); respects politeness bonuses and max loyalty thresholds.

### `OnRefuseItem(inst, item)`
*   **Description:** Reacts when an item is refused: transitions to "refuse" state and wakes the pig if sleeping.
*   **Parameters:**  
    - `inst` (Entity) — the pig entity.  
    - `item` (Entity) — the refused item.
*   **Returns:** Nothing.

### `OnEat(inst, food)`
*   **Description:** Called after the pig eats food: spawns a poop for veggies; triggers werepig transformation if eating raw monster meat.
*   **Parameters:**  
    - `inst` (Entity) — the pig entity.  
    - `food` (Entity) — the food consumed.
*   **Returns:** Nothing.

### `OnAttacked(inst, data)`
*   **Description:** Shared attack handler: sets aggressor as combat target and shares target with nearby allies based on pig type.
*   **Parameters:**  
    - `inst` (Entity) — the pig entity.  
    - `data` (table) — includes `attacker` and possibly `tree` for root attacks.
*   **Returns:** Nothing.
*   **Error states:** For deciduous_root attacks, delegates to `OnAttackedByDecidRoot`.

### `OnNewTarget(inst, data)`
*   **Description:** Shares new combat target with nearby werepigs.
*   **Parameters:**  
    - `inst` (Entity) — the pig entity.  
    - `data` (table) — includes `target`.
*   **Returns:** Nothing.

### `OnSave(inst, data)`
*   **Description:** Saves pig-specific state: current build and pig token initialization flag.
*   **Parameters:**  
    - `inst` (Entity) — the pig entity.  
    - `data` (table) — output table for save data.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores saved pig state: re-applies build and pig token initialization.
*   **Parameters:**  
    - `inst` (Entity) — the pig entity.  
    - `data` (table) — saved data from `OnSave`.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `attacked` — triggers combat setup and target sharing.  
  - `newcombattarget` — shares target with werepigs.  
  - `itemget` — handles receiving items from players (e.g., hats).  
  - `itemlose` — handles losing the pig token.  
  - `suggest_tree_target` — sets tree target for chopping.  
  - `moonpetrify` (moonpig only) — converts to gargoyle.  
  - `moontransformed` (moonpig only) — restores name and inventory.  
  - `onvacatehome` (non-moonpig only) — manages pig token drop/repawn.

- **Pushes:**  
  - `makefriend` — requests friendship with player.  
  - `gainloyalty` — notifies loyalty gain.  
  - `leaderchanged` — notifies leader change.  
  - `startfollowing` — notifies start of following.  
  - `transformwere` — notifies werepig transformation.  
  - `onwakeup` — notifies waking from sleep.