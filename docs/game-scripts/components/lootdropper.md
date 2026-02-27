---
id: lootdropper
title: Lootdropper
description: This component manages the generation and spawning of loot when an entity is destroyed or processed, supporting static loot, weighted random loot, chance-based drops, and burnt/cooked loot transformations.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: d704937e
---

# Lootdropper

## Overview
The `Lootdropper` component is responsible for determining what items are dropped when an entity (e.g., a structure, creature, or item) is destroyed, hammered, or otherwise processed. It supports multiple loot types: static loot, weighted random loot (with haunted variants), chance-based single-item drops, and recipe-based deconstruction loot. It also handles post-processing such as loot flinging, moisture inheritance, and event-specific loot (e.g., Winters Feast ornaments). The component integrates with tags (e.g., `burnt`, `structure`) and conditions (e.g., `burnable` state) to dynamically adjust loot outcomes.

## Dependencies & Tags
- **Requires**:
  - `inst.components.health` (for tracking cause of death and lucky user in luck-based chance adjustments)
  - `inst.components.workable` (for tracking last worker, used to determine lucky user)
  - `inst.components.burnable` (to detect controlled burning and burnt state)
  - `inst.components.finiteuses` (to apply remaining durability to deconstruction loot)
  - `inst.components.hauntable` (to switch to haunted random loot when applicable)
  - `inst.components.fuel` (indirectly referenced via checks like `burnable.ignorefuel`)
  - `inst.components.inventoryitem` (for moisture inheritance)
  - `inst.components.heavyobstaclephysics` (for physics state adjustment on spawn)
- **Tags relevant to behavior**:
  - `burnt`: Alters dropped loot (e.g., raw → cooked, wood → charcoal/ash)
  - `structure`: Exempts certain entities from being converted to ash on burnout
  - `tree`, `boulder`: Exempt from ash conversion when burnt
  - `hive`: Treated as a structure that *does* convert to ash when burnt

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `numrandomloot` | `number` (int) | `nil` | Number of random loot items to attempt dropping if chance passes. |
| `randomloot` | `table` | `nil` | List of `{prefab, weight}` tables for regular (non-haunted) random loot. |
| `randomhauntedloot` | `table` | `nil` | List of `{prefab, weight}` tables used when entity is haunted (overrides `randomloot`). |
| `totalrandomweight` / `totalhauntedrandomweight` | `number` | `nil` | Sum of weights in respective random loot lists (used for weighted selection). |
| `chancerandomloot` | `number` (float) | `nil` | Probability (0–1) of attempting to drop random loot. Defaults to `1` if `nil`. |
| `chanceloot` | `table` | `nil` | List of `{prefab, chance}` tables for chance-based single-item drops. |
| `chanceloottable` | `string` | `nil` | Name of a shared loot table (from `LootTables`) to pull chance-based drops from. |
| `ifnotchanceloot` | `table` | `nil` | List of `{prefab}` tables that drop only if *no* chance-based loot (`chanceloot`) was dropped. |
| `droppingchanceloot` | `boolean` | `false` | Flag tracking whether any chance-based loot was successfully dropped. |
| `loot` | `table` | `nil` | List of static loot prefabs to drop unconditionally. |
| `lootsetupfn` / `self.lootsetupfn` | `function` | `nil` | Optional callback function invoked before loot generation (e.g., for dynamic setup). |
| `trappable` | `boolean` | `true` | Indicates whether the loot dropper can be trapped (used externally; no logic in this file). |
| `droprecipeloot` | `boolean` | `true` | Whether to drop deconstruction loot based on the entity’s recipe. |
| `min_speed`, `max_speed`, `y_speed`, `y_speed_variance` | `number` | `0`, `2`, `8`, `4` | Physical fling parameters used in `FlingItem`. |
| `flingtargetpos` | `Vector3?` | `nil` | Target position for loots to be flung toward (overrides random direction). |
| `flingtargetvariance` | `number` | `0` | Angular variance (in degrees) applied when flinging toward target. |
| `droprecipeloot` | `boolean` | `true` | Flag enabling/disabling recipe-based deconstruction loot. |

## Main Functions

### `SetChanceLootTable(name)`
* **Description:** Sets the name of a shared loot table (registered via `SetSharedLootTable`) to be used for chance-based loot entries.
* **Parameters:**
  * `name` (`string`): Key in `LootTables` table containing a list of `{prefab, chance}` entries.

### `SetLoot(loots)`
* **Description:** Assigns static loot prefabs (dropped unconditionally). Clears random and chance loot entries.
* **Parameters:**
  * `loots` (`table`): Array of prefab strings to drop.

### `SetLootSetupFn(fn)`
* **Description:** Assigns a callback function to run *before* `GenerateLoot()` computes the final loot list (e.g., for dynamic configuration).
* **Parameters:**
  * `fn` (`function`): A function accepting `self` (the `Lootdropper` instance) as its argument.

### `AddRandomLoot(prefab, weight)`
* **Description:** Adds a weighted random loot entry to the standard (non-haunted) pool.
* **Parameters:**
  * `prefab` (`string`): Prefab name to drop if selected.
  * `weight` (`number`): Relative weight determining selection probability.

### `ClearRandomLoot()`
* **Description:** Removes all weighted random loot entries and resets weight totals.

### `AddRandomHauntedLoot(prefab, weight)`
* **Description:** Adds a weighted random loot entry to the *haunted* pool, which overrides standard random loot when the entity is haunted (per `hauntable` component).
* **Parameters:**
  * `prefab` (`string`)
  * `weight` (`number`)

### `AddChanceLoot(prefab, chance)`
* **Description:** Adds a single-item drop with a given probability (0–1 or >1 for guaranteed).
* **Parameters:**
  * `prefab` (`string`)
  * `chance` (`number`): Drop probability. Values ≥1 guarantee drop.

### `AddIfNotChanceLoot(prefab)`
* **Description:** Adds an item to be dropped *only if no chance-based loot was successfully dropped* (i.e., if `droppingchanceloot` remains `false`).
* **Parameters:**
  * `prefab` (`string`)

### `GetRandomLootTable()`
* **Description:** Returns the active random loot table: haunted if applicable, otherwise standard.
* **Returns:** `table?` — The relevant loot table (`randomhauntedloot` or `randomloot`), or `nil`.

### `PickRandomLoot()`
* **Description:** Selects one random loot prefab based on weight. Does not apply chance adjustments.
* **Returns:** `string?` — The selected prefab name, or `nil` if no loot available.

### `GetFullRecipeLoot(recipe)`
* **Description:** Recursively extracts *all* base ingredients from a recipe (e.g., for crafting/debug), including deconstructed sub-recipes.
* **Parameters:**
  * `recipe` (`table`): A recipe object with an `ingredients` array.
* **Returns:** `table` — A flat list of ingredient prefab names.

### `GetRecipeLoot(recipe)`
* **Description:** Computes loot gained from *deconstructing* an entity using a hammer. Applies `HAMMER_LOOT_PERCENT` or `BURNT_HAMMER_LOOT_PERCENT`, and current durability (`finiteuses`), with burnt status reducing yield.
* **Parameters:**
  * `recipe` (`table`)
* **Returns:** `table` — A list of ingredient prefabs (deconstructed and processed).

### `GetLuckyUser()`
* **Description:** Determines the "lucky user" to apply luck modifiers to drop chances. Prioritizes cause of death, then last worker.
* **Returns:** `Entity?` — The valid `inst` of the user, or `nil`.

### `GetChance(chance)`
* **Description:** Applies luck-based chance scaling to a base probability. Returns `chance` unchanged if `chance ≥ 1`.
* **Parameters:**
  * `chance` (`number`): Base probability (0–1).
* **Returns:** `number` — Adjusted probability.

### `GenerateLoot()`
* **Description:** Constructs and returns the final loot list. Executes `lootsetupfn`, then processes random, chance, and static loot according to rules (including haunted, `ifnotchanceloot`, and recipe deconstruction). Marks `droppingchanceloot` if any chance-based loot drops.
* **Returns:** `table` — List of prefab names to drop.

### `GetAllPossibleLoot(setuploot)`
* **Description:** Returns a *set-like* table of *all possible* loot prefabs (keys = `true`) without running chance logic or setup functions (unless `setuploot` is true). Includes Winters Feast ornament loot if applicable.
* **Parameters:**
  * `setuploot` (`boolean`): If true, runs `lootsetupfn` (used for debugging/encyclopedia).
* **Returns:** `table` — Table mapping prefabs to `true`.

### `SetFlingTarget(pos, variance)`
* **Description:** Sets the target position and angular variance for loot flinging behavior.
* **Parameters:**
  * `pos` (`Vector3`): Target point in world space.
  * `variance` (`number`): Angular variance (degrees).

### `FlingItem(loot, pt)`
* **Description:** Applies physics velocity to a spawned loot entity. Uses fling target if set, otherwise random direction.
* **Parameters:**
  * `loot` (`Entity`): The spawned loot instance.
  * `pt` (`Vector3?`): Spawn position. Defaults to `inst:GetPosition()`.

### `SpawnLootPrefab(lootprefab, pt, linked_skinname, skin_id, userid)`
* **Description:** Spawns a loot entity, inherits moisture/wetness, flings it, sets events, and handles smoldering if parent was in controlled burn.
* **Parameters:**
  * `lootprefab` (`string`)
  * `pt` (`Vector3?`)
  * `linked_skinname` (`string?`)
  * `skin_id` (`string?`)
  * `userid` (`string?`)
* **Returns:** `Entity?` — The spawned entity, or `nil`.

### `DropLoot(pt, prefabs)`
* **Description:** Executes the full drop sequence: applies burnt loot overrides (raw→cooked/charcoal/ash), spawns each loot prefab via `SpawnLootPrefab`, and appends Winters Feast loot if active.
* **Parameters:**
  * `pt` (`Vector3?`): Drop position. Defaults to `inst:GetPosition()`.
  * `prefabs` (`table?`): Loot list. Defaults to `GenerateLoot()`.

## Events & Listeners
- **Emits on `self.inst`**:
  - `"ifnotchanceloot"`: Pushed when `ifnotchanceloot` items are triggered (only if no chance loot dropped).
  - `"loot_prefab_spawned"`: Pushed after each loot item spawns (includes `{loot = entity}`).
- **Global event emitted**:
  - `"entity_droploot"`: Pushed to `TheWorld` with `{ inst = self.inst }` at end of `DropLoot`.