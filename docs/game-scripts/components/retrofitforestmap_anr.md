---
id: retrofitforestmap_anr
title: Retrofitforestmap Anr
description: A server-side worldgen component that executes one-time retrofitting procedures to update the forest shard with content, structures, and fixes introduced in recent game updates.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 4fe37dae
---

# Retrofitforestmap Anr

## Overview
This component is a server-only (`ismastersim`) worldgen modifier that runs retroactively populated modifications to the forest world on load, applying missing content (e.g., new setpieces, ocean items, biome-specific prefabs) and applying known fixes (e.g., misplaced objects, tile inconsistencies) that were not present at initial world generation. It uses boolean flags stored in save data to track which retrofits have already been applied and performs them once using helper functions for entity placement and cleanup.

## Dependencies & Tags
- Depends on:
  - `TheWorld.ismastersim`: Asserted at startup; component should not exist on the client.
- Tags used for filtering entities:
  - `structure`, `walkableplatform`, `lava`, `irreplaceable`, `playerghost`, `ghost`, `flying`, `player`, `character`, `animal`, `monster`, `giant`, `watersource`, `thorny`, `sculpture`
- No components are added to `self.inst`.

## Properties
| Property | Type | Default Value | Description |
|---|---|---|---|
| `inst` | `Entity` | `inst` (passed to constructor) | The host entity (the World object) this component belongs to. |
| `retrofit_part1` | `boolean` | `false` (loaded from save) | Flag indicating if part 1 of the A New Reign retrofit is required. |
| `self.retrofit_*` flags (many) | `boolean` | `false` (loaded from save) | Individual boolean flags indicating which specific retrofits need to be applied. All are initialized in `OnLoad` from save data. |

## Main Functions
The core logic resides in `OnPostInit`, which executes a sequence of conditional retrofits based on loaded flags. Helper functions handle placement and cleanup. Key public methods:

### `self:OnPostInit()`
* **Description:** Executes one-time world modifications for content and fixes. Called once per session after world initialization. Checks boolean flags set in `OnLoad`, performs the retrofit, and marks flags as processed (`nil`) or triggers a server restart (`requiresreset`) where needed.
* **Parameters:** None.

### `self:OnSave()`
* **Description:** Returns an empty table, as no state needs to be serialized (flags are handled internally by `OnPostInit` resetting them).
* **Parameters:** None.

### `self:OnLoad(data)`
* **Description:** Loads retrofit flags from `data`, initializing all boolean flags (`retrofit_part1`, `retrofit_artsandcrafts`, `retrofit_turnoftides`, etc.) for later use in `OnPostInit`.
* **Parameters:** `data` (`table?`): Save data table, possibly containing boolean flags for retrofits.

### Helper Functions (not directly exposed, used internally by `OnPostInit`)
- `RetrofitNewContentPrefab(inst, prefab, min_space, dist_from_structures, canplacefn, candidtate_nodes, on_add_prefab)`
  - Attempts up to 50 times to find a valid placement for `prefab` using topology nodes and `TheWorld.Map:CanPlacePrefabFilteredAtPoint`, respecting spacing constraints (`min_space`, `dist_from_structures`) and optional custom `canplacefn` callbacks. Optionally runs `on_add_prefab` on success. Returns `true` if placed.
- `RetrofitNewOceanContentPrefab(...)`, `populate_ocean(...)`, `RemovePrefabs(...)`, `SpawnBoatingSafePrefab(...)`, and others — all used by `OnPostInit` to handle ocean population, cleanup, and object repositioning.
- `RetrofitAgainstTheGrain(area)` — Retrofits a specific biome (`"Oasis"` or `"Badlands"`) with antlion spawners, oasis lakes, sandstorm tags, and cactus conversion.

## Events & Listeners
- **Events Pushed by Component:**
  - `"ms_unlockchesspiece"` with arguments `"pawn"`, `"bishop"`, `"rook"`, `"knight"`, `"muse"`, `"formal"` — triggered in `OnPostInit` for arts & crafts content.
  - `"ms_save"` — pushed as part of world reset sequence.
- **Events Listened For:**
  - None (`inst:ListenForEvent` is not used in this component).