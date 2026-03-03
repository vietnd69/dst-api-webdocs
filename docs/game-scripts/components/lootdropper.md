---
id: lootdropper
title: Lootdropper
description: Handles the generation, modification, and spawning of loot items dropped by an entity upon destruction or deconstruction.
tags: [loot, inventory, combat]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: d704937e
system_scope: entity
---

# Lootdropper

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Lootdropper` is a utility component responsible for determining and releasing items (loot) associated with an entity when it is destroyed, deconstructed, or otherwise triggers a loot drop. It supports deterministic loot (direct item lists), weighted random loot, chance-based loot, and contextual loot generation based on entity state (e.g., burnt, haunted). It integrates with `burnable`, `finiteuses`, `fueled`, `hauntable`, `health`, `heavyobstaclephysics`, `inventoryitem`, and `workable` components to adjust loot behavior dynamically.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("lootdropper")

-- Set static loot
inst.components.lootdropper:SetLoot({"plank", "nail"})

-- Add weighted random loot
inst.components.lootdropper:AddRandomLoot("slurtle", 5)
inst.components.lootdropper:AddRandomLoot("slurtle_shell", 10)

-- Add chance-based loot
inst.components.lootdropper:AddChanceLoot("gem_pearl", 0.1)

-- Trigger the drop
inst.components.lootdropper:DropLoot()
```

## Dependencies & tags
**Components used:**  
`burnable`, `finiteuses`, `fueled`, `hauntable`, `health`, `heavyobstaclephysics`, `inventoryitem`, `workable`

**Tags:**  
Checks: `burnt`, `structure`, `hive`, `tree`, `boulder`, `monster`, `animal`, `creaturecorpse`, `fireimmune`  
Modifies: none directly (does not add/remove tags)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `entity` | (injected) | Reference to the owning entity instance. |
| `numrandomloot` | `number` | `nil` | Number of items to pick from random loot tables. |
| `randomloot` | `table` | `nil` | List of `{prefab, weight}` pairs for normal random loot. |
| `chancerandomloot` | `number` | `nil` | Chance (0–1) for the random loot block to trigger. |
| `totalrandomweight` | `number` | `nil` | Sum of weights in `randomloot` (computed automatically). |
| `chanceloot` | `table` | `nil` | List of `{prefab, chance}` pairs for chance-based loot. |
| `ifnotchanceloot` | `table` | `nil` | List of `{prefab}` to drop *only if* no chance loot was dropped. |
| `droppingchanceloot` | `boolean` | `false` | Internal flag tracking whether any chance-based loot was successfully dropped. |
| `loot` | `table` | `nil` | Static list of prefabs to drop unconditionally. |
| `chanceloottable` | `string` | `nil` | Name of a shared loot table (via `LootTables[name]`) to draw from. |
| `trappable` | `boolean` | `true` | Whether this entity can be trapped (e.g., by bear traps); unused in logic. |
| `droprecipeloot` | `boolean` | `true` | Whether to generate deconstruction loot from the recipe. |
| `randomhauntedloot` | `table` | `nil` | Random loot list used instead of `randomloot` when the entity is haunted. |
| `totalhauntedrandomweight` | `number` | `nil` | Sum of weights for haunted loot. |
| `lootsetupfn` | `function` | `nil` | Optional callback to run before loot generation. |
| `flingtargetpos` | `Vector3` | `nil` | Target position used to orient fling direction. |
| `flingtargetvariance` | `number` | `nil` | Angular variance (degrees) for fling direction. |

## Main functions
### `SetChanceLootTable(name)`
*   **Description:** Associates this dropper with a named shared loot table (e.g., `"treasure_chest"`). The table must be registered via `SetSharedLootTable`.
*   **Parameters:** `name` (string) – the key in `LootTables`.
*   **Returns:** Nothing.

### `SetLoot(loots)`
*   **Description:** Sets the static list of prefabs to always drop. Clears random and chance loot.
*   **Parameters:** `loots` (table of strings) – prefabs to drop.
*   **Returns:** Nothing.

### `SetLootSetupFn(fn)`
*   **Description:** Registers a callback function called before loot generation starts.
*   **Parameters:** `fn` (function) – signature `fn(self)` where `self` is the `Lootdropper` instance.
*   **Returns:** Nothing.

### `AddRandomLoot(prefab, weight)`
*   **Description:** Adds a weighted random loot option. Higher weight = higher probability.
*   **Parameters:**  
    `prefab` (string) – prefab name to add.  
    `weight` (number) – positive weight for selection.
*   **Returns:** Nothing.

### `ClearRandomLoot()`
*   **Description:** Removes all random loot entries and resets weight totals.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `AddRandomHauntedLoot(prefab, weight)`
*   **Description:** Adds weighted random loot *only used when the entity is haunted*. Overrides `AddRandomLoot` in haunted state.
*   **Parameters:**  
    `prefab` (string) – haunted loot prefab.  
    `weight` (number) – weight.
*   **Returns:** Nothing.

### `AddChanceLoot(prefab, chance)`
*   **Description:** Adds a chance-based loot entry (e.g., 10% drop chance).
*   **Parameters:**  
    `prefab` (string) – prefab name.  
    `chance` (number) – drop chance, 0–1.
*   **Returns:** Nothing.

### `AddIfNotChanceLoot(prefab)`
*   **Description:** Adds a fallback loot item that drops *only if no chance-based loot was triggered*.
*   **Parameters:** `prefab` (string) – fallback prefab.
*   **Returns:** Nothing.

### `GetRandomLootTable()`
*   **Description:** Returns the active random loot table (`randomhauntedloot` or `randomloot`) based on haunt status.
*   **Parameters:** None.
*   **Returns:** (table or `nil`) – current random loot table.

### `PickRandomLoot()`
*   **Description:** Selects a single random loot prefab using weighted probability.
*   **Parameters:** None.
*   **Returns:** (string or `nil`) – selected prefab, or `nil` if no loot available.

### `GetFullRecipeLoot(recipe)`
*   **Description:** Recursively computes the *full* deconstruction output of a recipe (i.e., all original materials), ignoring multiplier reductions.
*   **Parameters:** `recipe` (table) – a recipe from `AllRecipes`.
*   **Returns:** (table of strings) – list of all ingredient prefabs.

### `GetRecipeLoot(recipe)`
*   **Description:** Computes deconstruction loot for a recipe using TUNING constants (`HAMMER_LOOT_PERCENT`, `BURNT_HAMMER_LOOT_PERCENT`). Reduces output based on `finiteuses` current percentage and entity state (`burnt`).
*   **Parameters:** `recipe` (table) – a recipe from `AllRecipes`.
*   **Returns:** (table of strings) – list of deconstructed items.

### `GetLuckyUser()`
*   **Description:** Finds the most relevant player to apply luck modifiers to loot chances. Prioritizes killer over last worker.
*   **Parameters:** None.
*   **Returns:** (`entity` or `nil`) – the player entity responsible (cause of death or last worker).

### `GetChance(chance)`
*   **Description:** Applies luck from the `GetLuckyUser` to a base chance using `GetEntityLuckChance`.
*   **Parameters:** `chance` (number) – base chance (0–1).
*   **Returns:** (number) – adjusted chance.

### `GenerateLoot()`
*   **Description:** Builds and returns the final loot list. Runs setup fn, random, chance, recipe, and burnt loot logic in order.
*   **Parameters:** None.
*   **Returns:** (table of strings) – list of prefabs to drop.

### `GetAllPossibleLoot(setuploot)`
*   **Description:** Returns a *set* (table of `{prefab = true}`) of all possible loot outcomes, ignoring chance thresholds and modifiers. Used for UI/debug (e.g., scrapbook).
*   **Parameters:** `setuploot` (boolean) – if true, run `lootsetupfn`; otherwise skip setup fn to avoid side effects.
*   **Returns:** (table) – set of possible prefab names.

### `SetFlingTarget(pos, variance)`
*   **Description:** Sets a target position and variance used to determine fling direction.
*   **Parameters:**  
    `pos` (`Vector3`) – target point.  
    `variance` (number) – angular variance (degrees).
*   **Returns:** Nothing.

### `FlingItem(loot, pt)`
*   **Description:** Applies physics velocity and initial position to spawned loot, possibly flinging it toward `flingtargetpos`.
*   **Parameters:**  
    `loot` (`entity`) – spawned item entity.  
    `pt` (`Vector3` or `nil`) – spawn position (defaults to owner position).
*   **Returns:** Nothing.

### `SpawnLootPrefab(lootprefab, pt, linked_skinname, skin_id, userid)`
*   **Description:** Spawns a single loot item, applies moisture inheritance, forces physics mode (if `heavyobstaclephysics`), flings it, and fires `on_loot_dropped`/`loot_prefab_spawned` events. Also initiates wildfire propagation if the parent was in controlled burn.
*   **Parameters:**  
    `lootprefab` (string) – prefab to spawn.  
    `pt` (`Vector3` or `nil`) – spawn position.  
    `linked_skinname`, `skin_id`, `userid` – optional parameters passed to `SpawnPrefab`.
*   **Returns:** (`entity` or `nil`) – spawned loot entity, or `nil` if spawn failed.

### `DropLoot(pt, prefabs)`
*   **Description:** Generates (or uses provided) loot, applies burn-based overrides (e.g., "ash" or "_cooked"), spawns all items via `SpawnLootPrefab`, and adds Winters Feast ornament loot if active.
*   **Parameters:**  
    `pt` (`Vector3` or `nil`) – base spawn position.  
    `prefabs` (table or `nil`) – pre-generated loot list; if `nil`, `GenerateLoot()` is called.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** none directly (does not register listeners).
- **Pushes:**  
  - `ifnotchanceloot` – fired before dropping fallback chance loot.  
  - `loot_prefab_spawned` – fired after each item spawn, with `{loot = loot}`.  
  - `entity_droploot` – fired at world level (via `TheWorld:PushEvent`) after all loot is dropped.
