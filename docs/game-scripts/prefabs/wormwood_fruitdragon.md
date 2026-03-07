---
id: wormwood_fruitdragon
title: Wormwood Fruitdragon
description: A pet-like creature introduced in the "Turn of Tides" update that serves as a temporary combat companion and transforms into dragon fruit upon death or interference.
tags: [combat, pet, boss, lunar, transform]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a23ccf73
system_scope: entity
---

# Wormwood Fruitdragon

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `wormwood_fruitdragon` prefab represents a temporary pet creature spawned during the Turn of Tides event. It functions as a loyal combat ally that follows the player, fights enemies, and regenerates health when injured. Upon natural expiration of its lifetime or if attacked by its owner (via pet leash), it transforms into a `dragonfruit` item. The entity uses a custom brain (`wormwood_fruitdragonbrain`), a dedicated state graph (`SGwormwood_fruitdragon`), and integrates with multiple core components: `health`, `combat`, `locomotor`, `sleeper`, `lootdropper`, and `follower`. It is tagged as a lunar-aligned, non-blockable, soulless creature and ignores fire damage.

## Usage example
```lua
local inst = SpawnPrefab("wormwood_fruitdragon")
inst.Transform:SetPosition(x, y, z)
-- The fruitdragon automatically follows its leader (typically the player)
-- It engages enemies, regenerates health when hurt, and expires after a set time
```

## Dependencies & tags
**Components used:**  
`health`, `combat`, `locomotor`, `sleeper`, `lootdropper`, `drownable`, `follower`, `inspectable`, `timer`, `petleash` (read-only via `IsPet`)

**Tags:**  
`smallcreature`, `animal`, `scarytoprey`, `lunar_aligned`, `NOBLOCK`, `notraptrigger`, `wormwood_pet`, `noauradamage`, `soulless`

## Properties
No public properties are defined or initialized directly in the constructor. All configuration values are sourced from `TUNING` constants.

## Main functions
### `finish_transformed_life(inst)`
*   **Description:** Called when the fruitdragon’s lifetime expires or when attacked by its owner (pet-leashed). Spawns a `dragonfruit` at the fruitdragon’s position, flings it away, spawns a visual FX prefab (`wormwood_lunar_transformation_finish`), and removes the fruitdragon entity.
*   **Parameters:** `inst` (Entity) — the fruitdragon entity instance.
*   **Returns:** Nothing.

### `OnTimerDone(inst, data)`
*   **Description:** Event handler triggered when the `"finish_transformed_life"` timer completes. Invokes `finish_transformed_life(inst)` to perform the transformation.
*   **Parameters:**  
    `inst` (Entity) — the fruitdragon instance;  
    `data` (table) — timer event data, where `data.name == "finish_transformed_life"` indicates this callback.
*   **Returns:** Nothing.

### `OnAttacked(inst, data)`
*   **Description:** Handles the `"attacked"` event. If the attacker is the fruitdragon’s owner (checked via `petleash:IsPet`), the fruitdragon’s lifetime timer is stopped and `finish_transformed_life` is triggered immediately. Otherwise, if the attacker is combat-capable, the fruitdragon targets them.
*   **Parameters:**  
    `inst` (Entity) — the fruitdragon instance;  
    `data` (table) — attack event data, containing `attacker` (Entity or nil).
*   **Returns:** Nothing.

### `OnHealthDelta(inst)`
*   **Description:** Tracks health changes via the `"healthdelta"` event. Starts health regeneration when hurt, stops it when fully healed.
*   **Parameters:** `inst` (Entity) — the fruitdragon instance.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores health state after loading (e.g., world reload). Triggers `OnHealthDelta(inst)` to ensure regeneration state is correctly synchronized.
*   **Parameters:**  
    `inst` (Entity) — the fruitdragon instance;  
    `data` (table) — saved game data (unused).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `"healthdelta"` — to enable/disable health regeneration based on injury status;  
  `"attacked"` — to re-target enemies or abort lifetime if owner attacks;  
  `"timerdone"` — to expire the fruitdragon after its lifetime.

- **Pushes:**  
  None directly — relies on other components to fire standard events (e.g., `combat` fires `"hurt"`, `"death"`, but these are not explicitly handled in this prefab’s script).