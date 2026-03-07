---
id: books
title: Books
description: Defines book prefabs and their associated magical spell effects for the Wickerbottom character, including growth spells, weather manipulation, and entity summoning.
tags: [crafting, magic, growth, inventory, entity]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: bf286de6
system_scope: entity
---

# Books

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `books.lua` file defines the prefabs and behaviors for all spellbooks usable by the Wickerbottom character in DST. Each book implements a unique magical effect via `fn` (read function) and `perusefn` (peruse function) callbacks stored in the `book` component. Books are consumable inventory items with limited uses, and they interact extensively with components like `book`, `inventory`, `temperature`, `sleeper`, `growable`, and `commander`. The file also creates supporting FX prefabs for visual effects and manages a hidden spell entity (`book_horticulture_spell`) for persistent target tracking.

## Usage example
```lua
-- Example: spawning and using the gardening book
local book = SpawnPrefab("book_gardening")
if book ~= nil then
    -- Give to a player
    player.components.inventory:GiveItem(book)

    -- Or call its read function manually (e.g., for testing)
    local success, reason = book.def.fn(book, player)
    if not success then
        print("Spell failed:", reason)
    end
end
```

## Dependencies & tags
**Components used:** `book`, `inventory`, `finiteuses`, `fuel`, `burnable`, `propagator`, `hauntable`, `inspectable`, `inventoryitem`, `temperature`, `moisture`, `sleeper`, `growable`, `pickable`, `crop`, `harvestable`, `commander`, `freezable`, `pinnable`, `fossilizable`, `rider`, `talker`, `builder`.

**Tags added on book entities:** `book`, `bookcabinet_item`.

**FX entities:** `FX`.

**State tags checked in listeners:** `INLIMBO`, `FX`, `magicgrowth`, `withered`, `playerghost`, `stump`, `barren`, `leif`, `tree`, `winter_tree`, `silviculture`, `ancienttree`, `player`, `freezable`, `frozen`, `pinnable`, `stuck`, `fossilizable`, `fossilized`, `rider`, `riding`, `magicalbird`, `beequeen`, `fire`, `smolder`, `lighter`, `firepen`, `mushroom_farm`.

## Properties
No public properties. Books are configured at creation time via the `book_defs` table. The component properties (e.g., `uses`, `read_sanity`) are set directly on the `book` and `finiteuses` components by `MakeBook`.

## Main functions
### `do_book_horticulture_spell(x, z, max_targets, maximize)`
* **Description:** Spawns a `book_horticulture_spell` entity to grow up to `max_targets` valid horticultural targets within 30 units. If `maximize` is true, applies extra nutrient consumption and growth effects. Returns success status and a failure string if no valid targets are found.
* **Parameters:**
  * `x`, `z` (number) — World coordinates for the center of the effect.
  * `max_targets` (number) — Maximum number of targets to affect.
  * `maximize` (boolean, optional) — Whether to apply maximizing nutrient consumption and delayed growth.
* **Returns:** `true` on success, `false, "NOHORTICULTURE"` otherwise.
* **Error states:** Fails if no entities in range meet horticulture criteria.

### `trygrowth(inst, maximize)`
* **Description:** Attempts to advance growth state for a single entity using one or more growth systems (`growable`, `pickable`, `crop`, `harvestable`, or special `leif` sleep behavior). Called repeatedly for each target in horticulture and silviculture spells.
* **Parameters:**
  * `inst` (Entity) — The entity to grow.
  * `maximize` (boolean) — Whether to apply full nutrient consumption for farming systems.
* **Returns:** `true` if growth or state change occurred; `false` otherwise.
* **Error states:** Returns `false` early if `inst` is invalid, in limbo, or withered.

### `MakeBook(def)`
* **Description:** Factory function that creates a book prefab instance based on the definition table `def`. Sets up the `book` component callbacks, uses, sanity penalties, and FX, and initializes core components (`finiteuses`, `fuel`, `burnable`, `hauntable`, etc.).
* **Parameters:**
  * `def` (table) — Book definition containing `name`, `uses`, `read_sanity`, `peruse_sanity`, `fx`, `fxmount`, `fn`, `perusefn`, and optional `deps`, `fx_over`, `fx_under`.
* **Returns:** Prefab function that produces a fully configured book entity on call.

### `MakeFX(name, anim, ismount)`
* **Description:** Factory function that creates FX prefabs for book visual effects (e.g., `fx_books_small`, `fx_books_small_mount`). Sets appropriate transform orientation and animation bank.
* **Parameters:**
  * `name` (string) — Base FX name (e.g., `"plants_small"`).
  * `anim` (string) — Animation name (same as base by default).
  * `ismount` (boolean) — If true, appends `_mount` suffix and sets six-faced transform.
* **Returns:** Prefab function producing an FX entity.

## Events & listeners
- **Listens to:** `animover` on FX prefabs to self-remove when animation completes.
- **Pushes:** `ridersleep` (on mounts), `knockedout`, `temperaturedelta`, `moisturedelta`, `ms_sendlightningstrike`, `ms_forcequake`, `ms_forceprecipitation`, `ms_setmoonphase`. Also pushes standard book events via `book` component callbacks (`onread`, `onperuse`).