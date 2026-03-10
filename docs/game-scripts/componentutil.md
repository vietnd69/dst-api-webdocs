---
id: componentutil
title: Componentutil
description: A utility library providing helper functions for entity state, death, combat, world tiles, bridge placement, close inspection, item handling, and luck mechanics.
tags: [utility, entity, combat, world, inventory, luck]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 78c2d24e
system_scope: entity
---

# Componentutil

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`componentutil.lua` is a shared utility module containing numerous standalone functions that support entity state management, death processing, combat interactions, tile management (ocean/void), item placement (e.g., bridges), close inspection, inventory item handling, and luck-based mechanics. It does not implement a component class itself, but rather aggregates helper logic used across many components and prefabs. It interfaces heavily with other core components (e.g., `health`, `burnable`, `inventory`, `edible`, `luckuser`, `setbonus`, `corpsepersistmanager`) and TheWorld map APIs.

## Usage example
```lua
local ComponentUtil = require "componentutil"

-- Check if an entity can become a corpse
if ComponentUtil.CanEntityBecomeCorpse(inst) then
    ComponentUtil.TryEntityToCorpse(inst, "corpse_generic")
end

-- Safely perform a luck-modified chance roll
local is_lucky = ComponentUtil.TryLuckRoll(inst, 0.25, LuckFormulas.Standard)
if is_lucky then
    -- Trigger lucky event
end

-- Get a valid action passability test for current location
local passable_fn, is_special = ComponentUtil.GetActionPassableTestFn(inst)
if passable_fn(inst:GetPosition().x, inst:GetPosition().y, inst:GetPosition().z) then
    -- Allow movement or action
end
```

## Dependencies & tags
**Components used:**
- `amphibiouscreature` (`in_water`)
- `burnable` (`Ignite`, `IsBurning`, `canlight`)
- `combat` (`GetAttacked`)
- `container`
- `corpsepersistmanager` (`ShouldRetainCreatureAsCorpse`)
- `drownable`
- `edible` (`foodtype`)
- `health` (`DoDelta`)
- `inventory` (`EquipHasTag`, `IsInsulated`, `equipslots`)
- `inventoryitem` (`GetGrandOwner`, `InheritWorldWetnessAtXZ`, `OnDropped`, `SetLanded`, `owner`)
- `joustsource`
- `locomotor`
- `luckuser` (`GetLuck`)
- `pickable` (`product`)
- `playerspawner` (`GetAnySpawnPoint`)
- `raindome`
- `rider` (`IsRiding`)
- `riftspawner`
- `roseinspectableuser`
- `setbonus` (`setname`)
- `skilltreeupdater`
- `temperatureoverrider`
- `vinebridgemanager`
- `walkableplatform` (`platform_radius`)
- `worldmigrator` (`ActivatedByOther`, `id`)

**Tags:**
`"electricdamageimmune"`, `"playerghost"`, `"player"`, `"INLIMBO"`, `"ignorewalkableplatforms"`, `"activeprojectile"`, `"flying"`, `"FX"`, `"DECOR"`, `"herd"`, `"walkableplatform"`, `"structure"`, `"wall"`, `"balloon"`, `"groundspike"`, `"smashable"`, `"veggie"`, `"deck_of_cards"`, `"soulless"`, `"chess"`, `"shadow"`, `"shadowcreature"`, `"shadowminion"`, `"shadowchesspiece"`, `"ignorewalkableplatformdrowning"`, `"smallcreature"`, `"epic"`, `"epiccorpse"`, `"largecreature"`, `"largecreaturecorpse"`, `"large"`, `"lightningblocker"`, `"wagpunkarena"`, `"teeteringplatform"`, `"player_damagescale"`, `"forcefield"`, `"sanity"`, `"lunarplant"`, `"dreadstone"`, `"metal"`, `"marble"`, `"shell"`, `"wood"`, `"grass"`, `"fur"`, `"cloth"`, `"clay"`, `"mound"`, `"hive"`, `"eyeturret"`, `"houndmound"`, `"ghost"`, `"insect"`, `"spider"`, `"mech"`, `"brightmare"`, `"brightmareboss"`, `"tree"`, `"wooden"`, `"hedge"`, `"rocky"`, `"fossil"`, `"gestaltprotection"`, `"blocker"`, `"grass"`, `"stone"`, `"marble"`, `"fence_electric"`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| None | — | — | This file does not define any component properties. |

## Main functions
### `IsEntityDead(inst, require_health)`
* **Description:** Checks whether an entity is dead, optionally requiring a health replica to consider it dead.
* **Parameters:** 
  * `inst` — the entity instance.
  * `require_health` — boolean; if true and the entity lacks a health replica, treats it as dead.
* **Returns:** `true` if dead (or meets dead criteria); otherwise `false`.

### `IsEntityDeadOrGhost(inst, require_health)`
* **Description:** Checks if entity is dead or is a player ghost.
* **Parameters:** 
  * `inst` — the entity instance.
  * `require_health` — passed to `IsEntityDead`.
* **Returns:** `true` if ghost or dead; otherwise `false`.

### `IsEntityElectricImmune(inst)`
* **Description:** Checks if an entity is immune to electric damage via tag or insulated equipment.
* **Parameters:** 
  * `inst` — the entity instance.
* **Returns:** `true` if immune (has `"electricdamageimmune"` tag or inventory with `IsInsulated()` true); otherwise `false`.

### `GetStackSize(inst)`
* **Description:** Gets the stack size of an item via its replica; returns 1 if not stackable.
* **Parameters:** 
  * `inst` — the entity instance.
* **Returns:** Integer stack size or 1.

### `HandleDugGround(dug_ground, x, y, z)`
* **Description:** Spawns a turf prefab if the dug ground maps to a known turf type, otherwise spawns a random sinkhole FX.
* **Parameters:** 
  * `dug_ground` — tile type string/name used to look up turf.
  * `x, y, z` — world position to spawn at.
* **Returns:** None.

### `FindVirtualOceanEntity(x, y, z, r)`
* **Description:** Searches for a virtual ocean entity within radius `r` (default `MAX_PHYSICS_RADIUS`) that contains the given point within its radius.
* **Parameters:** 
  * `x, y, z` — point to test.
  * `r` — search radius.
* **Returns:** The entity if found, otherwise `nil`.

### `PushAwayItemsOnBoatPlace(inst)`
* **Description:** Launches nearby items away when a boat is placed, to avoid collision.
* **Parameters:** 
  * `inst` — the boat/walkableplatform instance.
* **Returns:** None.

### `TempTile_HandleTileChange_Ocean(x, y, z)`
* **Description:** Handles drowning/falling logic for entities on an ocean tile being replaced (e.g., broken boat).
* **Parameters:** 
  * `x, y, z` — coordinates of the changed tile.
* **Returns:** None.

### `TempTile_HandleTileChange_Ocean_Warn(x, y, z)`
* **Description:** Pushes `"abandon_ship"`/`"onpresink"` events to entities on a sinking ocean tile before removal.
* **Parameters:** 
  * `x, y, z` — coordinates of the changed tile.
* **Returns:** None.

### `TempTile_HandleTileChange_Void(x, y, z)`
* **Description:** Handles falling into the void for entities on an invalid tile (void).
* **Parameters:** 
  * `x, y, z` — coordinates of the changed tile.
* **Returns:** None.

### `TempTile_HandleTileChange_Void_Warn(x, y, z)`
* **Description:** Pushes `"onprefallinvoid"` event to entities before void tile removal.
* **Parameters:** 
  * `x, y, z` — coordinates of the changed tile.
* **Returns:** None.

### `TempTile_HandleTileChange(x, y, z, tile)`
* **Description:** Dispatches to appropriate ocean or void handler based on tile type.
* **Parameters:** 
  * `x, y, z`, `tile` — tile position and type.
* **Returns:** None.

### `TempTile_HandleTileChange_Warn(x, y, z, tile)`
* **Description:** Dispatches to appropriate warning handler (e.g., abandon_ship) based on tile type.
* **Parameters:** 
  * `x, y, z`, `tile` — tile position and type.
* **Returns:** None.

### `Bridge_DeployCheck_Helper(inst, pt, options)`
* **Description:** Helper for bridge/rope/vine placement logic — checks if a bridge can be placed starting from a point, returning valid spots or `false`.
* **Parameters:** 
  * `inst` — placer instance (e.g., vine bridge item).
  * `pt` — placement point (Point/Vector3-like).
  * `options` — optional overrides for validation and placement rules.
* **Returns:** `{success, spots}` where `spots` is list of points with `.direction` metadata, or `false`.

### `DecayCharlieResidueAndGoOnCooldownIfItExists(inst)`
* **Description:** Forces decay of charlie residue and sets cooldown if `roseinspectableuser` component exists.
* **Parameters:** 
  * `inst` — the instance.
* **Returns:** None.

### `DecayCharlieResidueIfItExists(inst)`
* **Description:** Forces decay of charlie residue without setting cooldown, if `roseinspectableuser` component exists.
* **Parameters:** 
  * `inst` — the instance.
* **Returns:** None.

### `MakeRoseTarget_CreateFuel(inst)`
* **Description:** Adds `roseinspectable` component and configures residue activation to spawn nightmare fuel (or horror fuel with upgrade).
* **Parameters:** 
  * `inst` — the instance.
* **Returns:** None.

### `MakeRoseTarget_CreateFuel_IncreasedHorror(inst)`
* **Description:** Like `MakeRoseTarget_CreateFuel`, but uses increased upgrade chance.
* **Parameters:** 
  * `inst` — the instance.
* **Returns:** None.

### `ROSEPOINT_CONFIGURATIONS`
* **Description:** Array of configurations for `roseinspectable`-based close-inspector interactions. Currently only contains vine bridge logic.
* **Parameters:** None (data structure).
* **Returns:** None.

### `CLOSEINSPECTORUTIL.IsValidTarget(doer, target)`
* **Description:** Checks if a target is valid for close inspection (excludes physics objects, locomotors, inventory items, and characters).
* **Parameters:** 
  * `doer` — the inspector.
  * `target` — the target entity.
* **Returns:** `true` if target is suitable for inspection; otherwise `false`.

### `CLOSEINSPECTORUTIL.IsValidPos(doer, pos)`
* **Description:** Checks if a position is valid for close inspection based on cooldowns and configuration callbacks.
* **Parameters:** 
  * `doer` — the inspector.
  * `pos` — point (Vector3 or x,y,z) to inspect.
* **Returns:** `true` if valid position for inspection; otherwise `false`.

### `CLOSEINSPECTORUTIL.CanCloseInspect(doer, targetorpos)`
* **Description:** Global check whether close inspection can be performed (equipment + not riding + valid target/position).
* **Parameters:** 
  * `doer` — the inspector.
  * `targetorpos` — either entity or position to inspect.
* **Returns:** `true` if close inspection is allowed; otherwise `false`.

### `HasMeatInInventoryFor_Checker(item)`
* **Description:** Predicate checking if an item is meat (edible + foodtype = MEAT) and not a small creature.
* **Parameters:** 
  * `item` — the item entity.
* **Returns:** `true` if meat; otherwise `false`.

### `HasMeatInInventoryFor(inst)`
* **Description:** Checks if an entity’s inventory contains any valid meat item, respecting `"hidesmeats"` tag.
* **Parameters:** 
  * `inst` — the entity.
* **Returns:** `true` if meat found in inventory (and not hidden); otherwise `false`.

### `SetDesiredMaxTakeCountFunction(prefab, callback)`
* **Description:** Registers a custom callback to override max items taken from inventory.
* **Parameters:** 
  * `prefab` — prefab name.
  * `callback` — function to call.
* **Returns:** None.

### `GetDesiredMaxTakeCountFunction(prefab)`
* **Description:** Gets the registered callback for a prefab, or `nil`.
* **Parameters:** 
  * `prefab` — prefab name.
* **Returns:** Callback function or `nil`.

### `IsFoodSourcePickable(inst)`
* **Description:** Checks if an entity is a pickable item that yields a known food product.
* **Parameters:** 
  * `inst` — the entity.
* **Returns:** `true` if `pickable.product` is in `PICKABLE_FOOD_PRODUCTS`; otherwise `false`.

### `GetWobyCourierChestPosition(inst)`
* **Description:** Retrieves chest coordinates from `woby_commands_classified` if set and valid.
* **Parameters:** 
  * `inst` — the entity (typically the woby courier chest owner).
* **Returns:** `x, z` if coordinates found and not sentinel values; otherwise `nil, nil`.

### `UpdateAxisAlignmentValues(intervals)`
* **Description:** Updates axis-aligned placement tuning and notifies player UI.
* **Parameters:** 
  * `intervals` — numeric interval size.
* **Returns:** None.

### `CycleAxisAlignmentValues()`
* **Description:** Cycles through axis alignment values (halftile, tile, etc.).
* **Parameters:** None.
* **Returns:** None.

### `ClearSpotForRequiredPrefabAtXZ(x, z, r)`
* **Description:** Destroys overlapping entities (excluding tags in `CLEARSPOT_CANT_TAGS`) around a point to clear space.
* **Parameters:** 
  * `x, z` — ground coordinates.
  * `r` — radius tolerance around the point.
* **Returns:** None.

### `GetCombatFxSize(ent)`
* **Description:** Determines visual size/radius/height for combat effects (e.g., electrocute, melee).
* **Parameters:** 
  * `ent` — the entity.
* **Returns:** `radius, size, height` (strings/numbers).

### `GetElectrocuteFxAnim(sz, ht)`
* **Description:** Constructs animation name string for electrocute effects.
* **Parameters:** 
  * `sz` — size string.
  * `ht` — height string (optional).
* **Returns:** Animation name string, e.g., `"shock_small"` or `"shock_small_low"`.

### `CanEntityBeElectrocuted(inst)`
* **Description:** Checks if an entity has any electrocute-related state defined, regardless of current state.
* **Parameters:** 
  * `inst` — the entity.
* **Returns:** `true` if stategraph supports electrocute (including burn_on_electrocute); otherwise `false`.

### `CalcEntityElectrocuteDuration(inst, override)`
* **Description:** Computes electrocute duration based on entity tuning, burn flag, override, and default.
* **Parameters:** 
  * `inst` — the entity.
  * `override` — optional override duration value.
* **Returns:** `number` duration in seconds.

### `SpawnElectricHitSparks(inst, target, flash)`
* **Description:** Spawns electric hit sparks FX, with immunity-aware prefab.
* **Parameters:** 
  * `inst` — source instance.
  * `target` — hit target.
  * `flash` — boolean for visual flash.
* **Returns:** None.

### `LightningStrikeAttack(inst)`
* **Description:** Applies lightning damage and triggers electrocute event.
* **Parameters:** 
  * `inst` — the struck entity.
* **Returns:** `true` if struck (not immune); otherwise `false`.

### `StrikeLightningAtPoint(strike_prefab, hit_player, x, y, z)`
* **Description:** Triggers AOE lightning effect at point, damaging/electrocuting entities and igniting flammable ones.
* **Parameters:** 
  * `strike_prefab` — e.g., `"lightning"` (moon vs earth distinction).
  * `hit_player` — boolean; skips player damage if true.
  * `x, y, z` — strike point.
* **Returns:** None.

### `GetMigrationPortalFromMigrationData(migrationdata)`
* **Description:** Finds a portal entity matching world ID and portal ID from migration data.
* **Parameters:** 
  * `migrationdata` — table with `worldid`, `portalid`.
* **Returns:** Portal entity or `nil`.

### `GetMigrationPortalLocation(ent, migrationdata, portaloverride)`
* **Description:** Determines spawn location after migration (portal offset, explicit coords, or default).
* **Parameters:** 
  * `ent` — entity migrating.
  * `migrationdata` — migration context.
  * `portaloverride` — optional portal to use.
* **Returns:** `{x, y, z}` location tuple.

### `GetActionPassableTestFnAt(x, y, z)`
* **Description:** Returns an appropriate passability-check function for given location (default, arena, vault, or teetering platform).
* **Parameters:** 
  * `x, y, z` — coordinates.
* **Returns:** Function `(x, y, z) -> boolean` and `true` if special; otherwise `nil`.

### `GetActionPassableTestFn(inst)`
* **Description:** Convenience wrapper around `GetActionPassableTestFnAt` using entity position.
* **Parameters:** 
  * `inst` — entity.
* **Returns:** Passable function and flag.

### `EntityHasCorpse(inst)`
* **Description:** Checks if entity currently has a corpse state.
* **Parameters:** 
  * `inst` — entity.
* **Returns:** `true` if corpse state exists and not excluded via `nocorpse`; otherwise `false`.

### `CanEntityBecomeCorpse(inst)`
* **Description:** Determines whether a given entity instance can become a corpse based on game rules (e.g., already has corpse, burn state, persist manager rules, lunar mutation eligibility).
* **Parameters:** 
  * `inst` — entity instance.
* **Returns:** Boolean `true` if corpse conditions are met, `false` otherwise. May return `nil` if none of the conditional branches return explicitly.

### `TryEntityToCorpse(inst, corpseprefab)`
* **Description:** Attempts to convert `inst` into a corpse prefab, preserving position, rotation, scale, animations, loot, and special data; handles burnable removal and lunar mutation flags.
* **Parameters:** 
  * `inst` — entity to convert.
  * `corpseprefab` — string name of the corpse prefab to spawn.
* **Returns:** Corpse entity instance if successful, `nil` otherwise.

### `CanEntityBeGestaltMutated(inst)`
* **Description:** Checks if entity is eligible for gestalt (rift) mutation.
* **Parameters:** 
  * `inst` — entity.
* **Returns:** `true` if eligible (has correct state, not excluded, tuning exists); otherwise `false`.

### `CanEntityBeNonGestaltMutated(inst)`
* **Description:** Checks if entity is eligible for pre-rift lunar mutation.
* **Parameters:** 
  * `inst` — entity.
* **Returns:** `true` if eligible; otherwise `false`.

### `GetLunarPreRiftMutationChance(inst)`
* **Description:** Calculates mutation chance with lunacy modifier.
* **Parameters:** 
  * `inst` — entity.
* **Returns:** `number` mutation chance.

### `GetLunarRiftMutationChance(inst)`
* **Description:** Returns gestalt possession chance (default 1).
* **Parameters:** 
  * `inst` — entity.
* **Returns:** `number` (typically 1).

### `CanLunarPreRiftMutateFromCorpse(inst)`
* **Description:** Checks all conditions and computes probability for pre-rift mutation from corpse.
* **Parameters:** 
  * `inst` — corpse entity.
* **Returns:** `true` or `false`.

### `CanLunarRiftMutateFromCorpse(inst)`
* **Description:** Checks all conditions and computes probability for gestalt mutation from corpse in active rift.
* **Parameters:** 
  * `inst` — corpse entity.
* **Returns:** `true` or `false`.

### `CanApplyPlayerDamageMod(target)`
* **Description:** Checks if damage modification for players applies to the given target.
* **Parameters:** 
  * `target` — entity to check.
* **Returns:** Boolean `true` if `target` is a player or has `"player_damagescale"` tag, otherwise `false`.

### `PlayerDamageMod(target, damage, mod)`
* **Description:** Applies a damage multiplier only when `CanApplyPlayerDamageMod(target)` is `true`.
* **Parameters:** 
  * `target` — entity receiving damage.
  * `damage` — numeric base damage.
  * `mod` — numeric multiplier.
* **Returns:** `damage * mod` if modifier applies, else `damage`.

### `GetArmorImpactSound(inventory, weaponmod)`
* **Description:** Returns a full sound path string for armor impact based on armor tags (priority-ordered) and weapon modifier.
* **Parameters:** 
  * `inventory` — inventory component instance.
  * `weaponmod` — string suffix (default `"dull"`).
* **Returns:** Full sound path string (e.g., `"dontstarve/impacts/impact_metal_armour_dull"`), or `nil` if no matching armor tag.

### `GetWallImpactSound(inst, weaponmod)`
* **Description:** Returns wall impact sound based on instance tags.
* **Parameters:** 
  * `inst` — wall or barrier entity.
  * `weaponmod` — string suffix (default `"dull"`).
* **Returns:** Full sound path string or defaults to `"wood_wall_dull"` if no matching tag.

### `GetObjectImpactSound(inst, weaponmod)`
* **Description:** Returns object impact sound based on instance tags.
* **Parameters:** 
  * `inst` — object entity.
  * `weaponmod` — string suffix (default `"dull"`).
* **Returns:** Full sound path string or defaults to `"object_dull"` if no matching tag.

### `GetCreatureImpactSound(inst, weaponmod)`
* **Description:** Returns creature impact sound based on tags, size, wetness, and override.
* **Parameters:** 
  * `inst` — creature entity.
  * `weaponmod` — string suffix (default `"dull"`).
* **Returns:** Full sound path string (e.g., `"flesh_med_dull"`, `"insect_sml_dull"`) or defaults; respects wetness for `flesh_wet_` case.

### `SplitTopologyId(s)`
* **Description:** Splits a topology ID string (e.g., `"TaskName/LayoutIndex/RoomID"`) into an array by `/:` delimiters.
* **Parameters:** 
  * `s` — string ID.
* **Returns:** Table of substrings (e.g., `{ "TaskName", "LayoutIndex", "RoomID" }`).

### `ConvertTopologyIdToData(idname)`
* **Description:** Parses topology ID into structured data table (e.g., `{ task_id, index_id, room_id }` or `{ layout_id }`).
* **Parameters:** 
  * `idname` — topology ID string or `"START"`.
* **Returns:** Table with keys like `task_id`, `index_id`, `room_id`, or `layout_id`; empty table if `idname == nil`.

### `GetPlayerDeathDescription(inst, viewer)`
* **Description:** Generates a death description string for player corpses, handling killer name, cause strings (including special logic for `moose`, `unknown`, `nil`), and gender-specific strings.
* **Parameters:** 
  * `inst` — corpse instance with `char`, `playername`, `pkname`, and `cause` fields.
  * `viewer` — entity viewing the description (for temporary string translations).
* **Returns:** Formatted description string using `string.format(desc, name, cause)`. Returns `nil` if `inst.char == nil` or `viewer:HasTag("playerghost")`.

### `GetTopologyDataAtPoint(x, y, z)`
* **Description:** Gets topology data for a world position using map API and `ConvertTopologyIdToData`. Supports Vector3, (x,z), or (x,y,z) input.
* **Parameters:** 
  * `x, y, z` — coordinates (or `Vector3`, or `(x, z)` with `y=0`).
* **Returns:** Table from `ConvertTopologyIdToData(id)`.

### `GetTopologyDataAtInst(inst)`
* **Description:** Convenience wrapper for `GetTopologyDataAtPoint(inst.Transform:GetWorldPosition())`.

### `MakeComponentAnInventoryItemSource(cmp, owner)`
* **Description:** Attaches lifecycle hooks to `cmp` so it can track when its associated item moves between inventory/container/ground. Sets up callbacks for `onputininventory`, `ondropped`, `onremove`.
* **Parameters:** 
  * `cmp` — component to enhance.
  * `owner` — optional entity (defaults to `cmp.inst`).
* **Returns:** `nil` (modifies `cmp` in place).

### `RemoveComponentInventoryItemSource(cmp, owner)`
* **Description:** Removes all event listeners and clears state fields set by `MakeComponentAnInventoryItemSource`.
* **Parameters:** 
  * `cmp` — component to clean up.
  * `owner` — owner passed during setup.
* **Returns:** `nil`.

### `GetHermitCrabOccupiedGrid(x, z)`
* **Description:** Computes a grid of tiles (up to `MAX_TILES`) the hermit crab occupies for decoration scoring, using shoreline detection and BFS expansion.
* **Parameters:** 
  * `x, z` — world coordinates (tile space).
* **Returns:** `DataGrid(w, h)` with `true` for occupied tiles.

### `IsInValidHermitCrabDecorArea(inst)`
* **Description:** Checks if `inst` is in an area suitable for hermit crab decoration, excluding Hermit Island, Monkey Island, and Moon Island.
* **Parameters:** 
  * `inst` — entity to test.
* **Returns:** Boolean `true` if valid, `false` otherwise.

### `IsEntityGestaltProtected(inst)`
* **Description:** Checks if entity is protected from gestalt mechanics (via `"gestaltprotection"` tag or debuff).
* **Parameters:** 
  * `inst` — entity instance.
* **Returns:** Boolean `true` if protected, `false` otherwise.

### `IsPointCoveredByBlocker(x, y, z, extra_radius)`
* **Description:** Checks if a point is inside any entity tagged `"blocker"` within radius.
* **Parameters:** 
  * `x, y, z` — coordinates.
  * `extra_radius` — additional radius to add to blockers.
* **Returns:** `true` if covered, `nil` if not.

### `EntityHasSetBonus(inst, setname)`
* **Description:** Checks whether `inst` has both head and body items equipped that share the specified `setname`.
* **Parameters:** 
  * `inst` — entity instance.
  * `setname` — string name of set (e.g., `"lunar"`).
* **Returns:** Boolean `true` if both head and body have matching `setbonus.setname`, else `false`.

### `CreatingJoustingData(inst)`
* **Description:** Constructs jousting data table for `inst`, including direction and joust source item.
* **Parameters:** 
  * `inst` — entity performing joust.
* **Returns:** Table `{ dir, source? }` where `dir` is numeric angle (radians), and `source` is valid joust source item if any.

### `GetEntityLuck(inst)`
* **Description:** Gets current luck value from `inst.components.luckuser`, or `0` if not present.
* **Parameters:** 
  * `inst` — entity instance.
* **Returns:** Numeric luck value (can be negative).

### `GetLuckChance(luck, chance, formula)`
* **Description:** Applies a luck formula to a base chance.
* **Parameters:** 
  * `luck` — numeric luck value.
  * `chance` — base probability (0–1).
  * `formula` — function `(inst?, chance, luck) → new_chance?`.
* **Returns:** Modified chance or `chance` if `formula` returns `nil`.

### `GetEntityLuckChance(inst, chance, formula)`
* **Description:** Wrapper: `GetLuckChance(GetEntityLuck(inst), chance, formula)`.

### `GetEntitiesLuckChance(instances, chance, formula)`
* **Description:** Aggregates luck from multiple entities and applies formula.
* **Parameters:** 
  * `instances` — table of entity instances.
  * `chance`, `formula` — as above.
* **Returns:** Modified chance.

### `TryLuckRoll(inst, chance, formula)`
* **Description:** Performs a random roll with luck-modified chance; optionally triggers (commented-out) effect.
* **Parameters:** 
  * `inst` — optional; if provided, luck is applied.
  * `chance`, `formula` — as above.
* **Returns:** Boolean `true` on success, `false` on failure.

### `GetEntityLuckWeightedTable(inst, weighted_table)`
* **Description:** Stub only — no implementation visible.
* **Parameters:** None visible in code.
* **Returns:** Not implemented in this chunk.

### `DoLuckyEffect(inst, is_lucky)`
* **Description:** Triggers a networked "play luck effect" for classified players.
* **Parameters:** 
  * `inst` — entity (must have `player_classified`).
  * `is_lucky` — boolean.
* **Returns:** `nil`.

## Events & listeners
### Events pushed:
- `"healthdelta"` — from `Health:DoDelta`, not called directly in this component.
- `"onignite"` — from `Burnable:Ignite`, not called directly in this component.
- `"onsink"` — in `TempTile_HandleTileChange_Ocean`.
- `"abandon_ship"` — in `TempTile_HandleTileChange_Ocean_Warn`.
- `"onpresink"` — in `TempTile_HandleTileChange_Ocean_Warn` for players.
- `"onfallinvoid"` — in `TempTile_HandleTileChange_Void`.
- `"onprefallinvoid"` — in `TempTile_HandleTileChange_Void_Warn`.
- `"electrocute"` — via `inst:PushEventImmediate("electrocute")` in `LightningStrikeAttack`.
- `"ondropped"` — in `InventoryItem:OnDropped`, not called directly in this component.
- `"onownerdropped"` — in `InventoryItem:OnDropped`, not called directly in this component.
- `"on_landed"` / `"on_no_longer_landed"` — via `InventoryItem:SetLanded`, not called directly in this component.
- `"migration_activate_other"` — via `WorldMigrator:ActivatedByOther`, not called directly in this component.

### Events listened to (internal only for item source tracking):
- `onputininventory` — updates item source owner when item is placed into inventory/container.
- `ondropped` — clears item source owner when item is dropped.
- `onremove` — removes item source owner when item is removed.

