---
id: piratespawner
title: Piratespawner
description: This component manages spawning, behavior, and loot handling for pirate raids in Don't Starve Together, including ship spawning, crew management, and stash generation.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 5be84724
---

# Piratespawner

## Overview
This component implements the world-scoped logic for pirate raids in Don't Starve Together. It periodically spawns pirate ships (boat_pirate) with captains and crew members based on player progression and proximity, manages pirate behavior during raids, handles loot stashing, and responds to key game events such as megaflare detonations and player state changes. It operates exclusively on the master simulation and is tied to the world instance.

## Dependencies & Tags
- **Required Components (on self.inst):** None explicitly added; `self.inst` is expected to be the world.
- **Uses Components Dynamically:**
  - `TheWorld.components.piratespawner` (self-reference)
  - `player.components.age`, `player.components.health`, `player.components.talker`, `player:GetCurrentPlatform()`, `player.entity:IsVisible()`
  - `inst.components.container`, `inst.components.inventory`, `inst.components.inventoryitem`
  - `boat.components.boatcrew`, `boat.components.vanish_on_sleep`
  - `TheWorld.Map`, `TheWorld.topology`
- **Tags Used:**
  - `"irreplaceable"`, `"personal_possession"`, `"cursed"`, `"pirate"`, `"playerghost"`, `"player"`, `"INLIMBO"`, `"fx"`
  - `"boat"` in entity searches (`MUST_BOAT`)
- **No components are added to `self.inst`**, but the component is attached to the world and must be the sole instance (`TheWorld.components.piratespawner`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GEntity` | `inst` (passed to constructor) | The world entity instance this component is attached to. |
| `_activeplayers` | `table` | `{}` | List of active, non-dead, non-ghost players currently in the world. |
| `_nextpiratechance` | `number` | `getnextmonkeytime()` | Current countdown timer toward the next pirate raid spawn; decremented each tick. |
| `_lasttic_players` | `table` | `{}` | Tracks per-player distance metrics (dist, time) from the Queen for zone weighting and spawn logic. |
| `shipdatas` | `table` | `{}` | List of active pirate ship data records (contains `boat`, `captain`, and `crew` references). |
| `queen` | `GEntity?` | `nil` | Reference to the `monkeyqueen` entity, if present; used to determine proximity for raid spawns. |
| `_current_stash` | `GEntity?` | `nil` | Reference to the currently active `pirate_stash` instance; created on-demand. |
| `_maxpirates` | `number` | `1` | Hardcoded upper bound on concurrent pirate raids (unused in current code logic). |
| `_minspawndelay` / `_maxspawndelay` | `number` | `TUNING.PIRATE_SPAWN_DELAY.min/max` | Saved/loaded configuration values; not actively used for delay calculation. |
| `_timescale` | `number` | `1` | Unused placeholder variable. |
| `zones` | `table` | `{{INNER}, {MID}, {OUTTER}}` | Defines proximity zones around the Queen (max radius, spawn weight, and chance modifier) used in periodic raid spawning. |

## Main Functions

### `self:GetCurrentStash()`
* **Description:** Returns the current pirate loot stash (`pirate_stash`) instance. If no stash exists, it creates one at a random, valid ocean-free location far from players, populates it with generated loot, and stores the reference.
* **Parameters:** None.

### `self:ClearCurrentStash()`
* **Description:** Clears the reference to the current stash (`_current_stash = nil`), allowing a new stash to be created on the next call to `GetCurrentStash()`. Does not destroy the stash entity itself.
* **Parameters:** None.

### `self:SpawnPiratesForPlayer(player, nodelivery, forcedelivery)`
* **Description:** Triggers a new pirate raid targeting a specific player. Spawns a pirate ship with a captain and crew, optionally includes a treasure delivery (message bottle + cannon) based on chance or flags.
* **Parameters:**
  * `player`: The target player entity.
  * `nodelivery`: If `true`, skips treasure delivery logic (e.g., for non-delivery spawns like megaflare triggers).
  * `forcedelivery`: If `true`, forces a delivery spawn regardless of chance.

### `self:SpawnPirates(pt)`
* **Description:** Spawns a pirate ship at an exact world position (`pt`) without player targeting or delivery logic. Used for direct/spontaneous spawns.
* **Parameters:**
  * `pt`: A `Vector3` specifying the spawn location.

### `self:StashLoot(ent)`
* **Description:** Moves all loot from the entity `ent` (container/inventory) into the current pirate stash. Handles items that cannot be stored (e.g., personal_possession, cursed) by destroying them.
* **Parameters:**
  * `ent`: The entity whose items are to be stashed.

### `self:OnUpdate(dt)`
* **Description:** Core update loop (called every frame) that drives periodic raid spawning based on player proximity to the Queen, triggers pirate music cues, and updates player proximity state (`v.piratesnear`). Uses `zones` configuration and `TryLuckRoll` for weighted spawning.
* **Parameters:**
  * `dt`: Delta time in seconds.

### `self:LongUpdate(dt)`
* **Description:** Alias for `OnUpdate(dt)`. Delegates to `self:OnUpdate(dt)`.

### `self:SaveShipData(shipdata)`
* **Description:** Appends the given ship data record (with boat, captain, crew) to the `self.shipdatas` list for persistence and runtime tracking.
* **Parameters:**
  * `shipdata`: A table containing `boat`, `captain`, and `crew` (array) entries.

### `self:RemoveShipData(ship)`
* **Description:** Removes a ship data record from `self.shipdatas` by matching the `boat` entity reference.
* **Parameters:**
  * `ship`: The `boat` entity to remove.

### `self:OnSave()`
* **Description:** Serializes component state for world save. Captures player timer state, current stash GUID, and all active ship data (boat, captain, crew GUIDs).
* **Parameters:** None.
* **Returns:** A `data` table and an `ents` array of referenced GUIDs.

### `self:OnLoad(data)`
* **Description:** Restores numeric and timer state (`_maxpirates`, `_nextpiratechance`) during load.
* **Parameters:**
  * `data`: The component section of the world save data.

### `self:LoadPostPass(newents, savedata)`
* **Description:** Reconstructs ship data records using GUIDs from the save file, reattaching components and reinitializing crew/boat logic.
* **Parameters:**
  * `newents`: Table of GUID→entity mappings from the current world load.
  * `savedata`: The `piratespawner` component save data section.

### `self:FindStashLocation()`
* **Description:** Computes a valid spawn location for a pirate stash in the ocean, ensuring it is distant from players and on solid ground.
* **Parameters:** None.
* **Returns:** A `Vector3` representing the stash position.

### `self:StashLoot(ent)`
* **Description:** Moves all items from the given entity (container or inventory) to the current stash, applying `ShouldRemoveItem` logic first.
* **Parameters:**
  * `ent`: The source entity with items to stash.

## Events & Listeners
- Listens to `"ms_playerjoined"` → triggers `OnPlayerJoined`
- Listens to `"ms_playerleft"` → triggers `OnPlayerLeft`
- Listens to `"megaflare_detonated"` (on `TheWorld`) → triggers `onmegaflaredetonation`
- Listens to `"onremove"` (on `self.queen`) → sets `self.queen = nil`
- Listens to `"spawnnewboatleak"` (on pirate boat) → triggers `HitByCannon`
- Listens to `"victory"` (on pirate captain) — triggered by `Pirate_AnnounceRetreat`
- Listens to `"onremove"` (on each monkey/captain) → triggers `ForgetMonkey`