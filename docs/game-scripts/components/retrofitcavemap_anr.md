---
id: retrofitcavemap_anr
title: Retrofitcavemap Anr
description: Applies worldgen retrofits for post-release content such as Heart of the Ruins, Return of Them, and Daywalker systems by spawning missing prefabs and updating topology/layout data.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: e6237c75
---

# Retrofitcavemap Anr

## Overview
This component orchestrates late-stage world initialization ("retrofitting") on the server master simulation. It is instantiated only on the server and applies dynamic modifications to an already-generated world—such as inserting missing prefabs (e.g., toadstool_caps, cave_holes, atrium mazes), adjusting topology node data, repositioning entities, and ensuring proper entity respawner populations. It does not own gameplay logic itself but acts as a coordination layer that invokes specialized retrofit functions based on flags stored in the world save data or world state.

## Dependencies & Tags
- **Requirement:** Must be instantiated only on the master simulation (`TheWorld.ismastersim`).
- **Uses internal constants:** `MAX_PLACEMENT_ATTEMPTS = 50`.
- **Uses internal tags:** `STRUCTURE_TAGS`, `ALTAR_TAGS`, `LOCOMOTOR_TAGS`.
- **No explicit component dependencies declared in `_ctor`**, but it heavily relies on `TheWorld`, `TheSim`, `Ents`, and various map/components (e.g., `Transform`, `teleporter`, `objectspawner`) on other entities.

## Properties
The constructor defines a minimal set of public and private state variables:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `self.inst` | `Entity` | (passed in) | Reference to the world entity (`TheWorld`) hosting this component. |
| `retrofit_warts` | `boolean` | `false` | Private flag; true when "Warts and All" retrofit is enabled. |
| `self.requiresreset` | `boolean` | `nil` | Flag indicating whether a server save/restart is required to finalize retrofits. |

No other public properties are initialized in `_ctor`. Other attributes (e.g., `self.retrofit_artsandcrafts`, `self.retrofit_heartoftheruins`) are initialized and read during `OnLoad` and conditionally processed in `OnPostInit`.

## Main Functions

### `RemovePrefabs(prefabs_to_remove, biomes_to_cleanup)`
* **Description:** Removes all instances of specified prefabs (and optionally only those in certain biomes/tiles) from the world.
* **Parameters:**
  - `prefabs_to_remove`: Table of prefab strings to remove.
  - `biomes_to_cleanup`: Optional table; if provided, only removes prefabs in tiles listed in this table.

### `RetrofitNewCaveContentPrefab(inst, prefab, min_space, dist_from_structures, nightmare, searchnodes_override, ignore_terrain)`
* **Description:** Attempts to spawn a given prefab into a valid cave or ruin node. It randomly selects candidate nodes, computes placement points, validates spacing and terrain, and places the prefab if possible. Returns success boolean and spawned entity (if any).
* **Parameters:**
  - `inst`: World entity reference (unused directly, passed for logging context).
  - `prefab`: Name of the prefab to spawn.
  - `min_space`: Minimum radius around the spawn point to be clear of other entities.
  - `dist_from_structures`: If non-nil, ensures no *structures* exist within this radius.
  - `nightmare`: Optional boolean; if true, restricts candidate nodes to those marked with `"Nightmare"` and excludes `"Atrium"`/`"lunacyarea"`/`"RuinedGuarden"` nodes.
  - `searchnodes_override`: Optional array of node indices to restrict searching; otherwise, default node filtering is used.
  - `ignore_terrain`: Optional boolean; if true, skips terrain placement checks.

### `HeartOfTheRuinsAtriumRetrofitting(inst)`
* **Description:** Adds a new AtriumMaze node to the world topology and constructs its interior using predefined mazes. Placed in an unused corner area of the map (if valid) and triggers a world reset upon success.
* **Parameters:**
  - `inst`: World entity reference.

### `AddRuinsRespawner(prefab, spawnerprefab)`
* **Description:** Scans the world for entities of `prefab`, replaces them with respawner instances (e.g., `bishop_nightmare_ruinsrespawner_inst`), and optionally takes ownership of the original entity if the spawner matches the target prefab.
* **Parameters:**
  - `prefab`: Prefab name to scan for (e.g., `"bishop_nightmare"`).
  - `spawnerprefab`: Optional; defaults to `prefab`, used to override the spawner name prefix.

### `HeartOfTheRuinsRuinsRetrofitting(inst)`
* **Description:** Ensures that the Ruins area contains appropriate respawners for specific nightmare and ruins entities (e.g., `bishop_nightmare`, `minotaur`, `monkeybarrel`). Uses a mix of proximity-based respawning near existing targets (e.g., `nightmarelight`) and random global spawning (`RetrofitNewCaveContentPrefab`). Also attempts to place the `atrium_key` if the `minotaur` respawner is missing.

### `HeartOfTheRuinsRuinsRetrofittingRespawnerFix(inst, first_hotr_retrofit)`
* **Description:** Reduces total numbers of certain respawners (e.g., `bishop_nightmare` capped at 10) to expected population caps. Skips if this is the first full HOTR retrofit. Removes excess respawners asynchronously.

### `HeartOfTheRuinsRuinsRetrofittingAltar(inst)`
* **Description:** Ensures every existing Altar node has a respawner for `ancient_altar_broken`, adding one if missing.

### `HeartOfTheRuinsRuinsRetrofittingCaveHoles(inst)`
* **Description:** Ensures at least 8 `cave_hole` prefabs exist in nightmare caves, spawning more via `RetrofitNewCaveContentPrefab` if needed.

### `HeartOfTheRuinsRuinsRetrofitting_RepositionAtriumGate(inst)`
* **Description:** Repositions an `atrium_gate` to a valid location between adjacent `atrium_light` entities. Used for fixing early-generations of atrium mazes.

### `HeartOfTheRuinsRuinsRetrofitting_StatueChessRespawners(inst)`
* **Description:** Adds respawners for `chessjunk`, `ruins_statue_head`, `ruins_statue_mage`, etc., if they are missing.

### `ArchiveDispencerFixup()`
* **Description:** Ensures that archive dispencers have a valid `product_orchestrina` set to one of three required types (`turfcraftingstation`, `archive_resonator_item`, `refined_dust`). Fixes dispencers and lockboxes as needed.

### `self:OnPostInit()`
* **Description:** Main entry point for applying all retrofits based on flags (e.g., `self.retrofit_heartoftheruins`, `self.retrofit_acientarchives`). Iterates through flags and invokes specialized functions. Handles topology fixes, navmesh updates, node tile map repairs, and ultimately triggers a server reset if `self.requiresreset` is true.

### `self:OnSave()`
* **Description:** Returns an empty table. All persistent state is stored in the world’s save data via `OnLoad`.

### `self:OnLoad(data)`
* **Description:** Loads retrofit flags (e.g., `retrofit_warts`, `requiresreset`) from the world save data into local state. Called during world load before `OnPostInit`.

## Events & Listeners
- Listens for internal save/load mechanics (`OnSave`, `OnLoad`), but no `inst:ListenForEvent` calls exist.
- Triggers events: None directly.
- however, if `requiresreset` is true, it schedules:
  - `TheWorld:PushEvent("ms_save")` (5 seconds before rollback)
  - `TheNet:SendWorldRollbackRequestToServer(0)` (after ~45 seconds total)
  - Also uses `TheNet:Announce(...)` with localized retrofit messages.