---
id: wurt
title: Wurt
description: Implements the Wurt character's unique gameplay mechanics including pathfinding support, wetness-based skill interactions, and Merm King upgrades via debuff-based planar buffs for followers.
tags: [player, skill, buff, quest, networking]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a1ad05b8
system_scope: player
---

# Wurt

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wurt.lua` defines the `Wurt` character prefab in DST, implementing her signature mechanics:  
- **Pathfinder skill**: Periodically scans for nearby non-merm players and grants them increased speed on marsh tiles.  
- **Wetness skill tree**: Uses the `moisture` component and `skilltreeupdater` to apply sanity, healing, and damage mitigation bonuses based on current moisture level.  
- **Merm King upgrades**: Applies debuffs (`mermkingtridentbuff`, `mermkingcrownbuff`, `mermkingpauldronbuff`) to Wurt and her merm followers upon acquiring corresponding Merm King artifacts.  
- **Tentacle warnings**: For non-dedicated servers, spawns visual warnings (`wurt_tentacle_warning`) near nearby shadow/lunar tentacles.  

It integrates with components such as `health`, `hunger`, `sanity`, `moisture`, `locomotor`, `leader`, `combat`, `debuff`, `preserver`, `reader`, `skinner`, and `skilltreeupdater`. The prefab is created via `MakePlayerCharacter`.

## Usage example
The `wurt.lua` file is not meant to be used directly as a component. Instead, it defines the full character prefab, typically instantiated via `SpawnPrefab("wurt")` in scenario or worldgen code. Modders extend or override behavior by listening to events (e.g., `onmermkingcreated_anywhere`) or modifying tuning values.

## Dependencies & tags
**Components used:** `areaaware`, `builder`, `combat`, `debuff`, `eater`, `foodaffinity`, `health`, `hunger`, `leader`, `locomotor`, `mermkingmanager`, `moisture`, `planardamage`, `preserver`, `reader`, `sanity`, `skilltreeupdater`, `skinner`, `talker`, `timer`.

**Tags added on init (`common_postinit`):**  
`playermerm`, `merm`, `mermguard`, `mermfluent`, `merm_builder`, `wet`, `stronggrip`, `reader`, `aspiring_bookworm`.  
Also adds `quagmire_shopper` in Quagmire game mode.

## Properties
No public properties are initialized on the `Wurt` prefab itself. Internal state is stored on `inst`:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `pathfinder_players` | table | `{}` | Tracks players benefiting from the Pathfinder skill. |
| `_active_warnings` | table | `{}` | Maps tentacle entities to warning prefabs (client-only). |
| `pathfindertask` | task | `nil` | Periodic task scanning for nearby players in Pathfinder skill. |
| `tentacle_warning_task` | task | `nil` | Periodic task updating tentacle warnings (client-only). |
| `royal` | boolean | `nil` | True if Wurt has become a Merm King. |
| `health_percent` / `hunger_percent` / `sanity_percent` | number | `nil` | Stored for save/load state restoration. |
| `_onmoisturedelta` / `_onallegiancemarshtile` | function | `nil` | Event handler references used to prevent duplicate listeners. |

## Main functions
### `UpdateStats(inst, maxhealth, maxhunger, maxsanity)`
*   **Description:** Updates max health, hunger, and sanity based on provided values, preserving current percentages for smooth transitions.
*   **Parameters:** `inst` (entity), `maxhealth` (number), `maxhunger` (number), `maxsanity` (number).
*   **Returns:** Nothing.
*   **Error states:** None.

### `RoyalUpgrade(inst, silent)`
*   **Description:** Transforms Wurt into her Merm King form: updates stats, applies `powerup` skin mode (`wurt_stage2`), announces via talker, plays sound, and pushes a stategraph event. If `silent`, skips announcement and sound but updates skin.
*   **Parameters:** `inst` (entity), `silent` (boolean, optional, default `false`).
*   **Returns:** Nothing.
*   **Error states:** No-op if already royal.

### `RoyalDowngrade(inst, silent)`
*   **Description:** Reverts Merm King form: resets stats to base, removes override skin mode, announces, plays sound, and pushes stategraph event. If `silent`, skips announcement and sound.
*   **Parameters:** `inst` (entity), `silent` (boolean, optional, default `false`).
*   **Returns:** Nothing.
*   **Error states:** No-op if not royal.

### `TryRoyalUpgradeTrident(inst, silent)`
*   **Description:** Applies `mermkingtridentbuff` debuff to Wurt and her merm followers if the `wurt_mermkingtrident` skill is activated and the trident is held anywhere in the world. Uses `mermkingmanager:HasTridentAnywhere()`.
*   **Parameters:** `inst` (entity), `silent` (boolean, unused here).
*   **Returns:** Nothing.

### `TryRoyalDowngradeTrident(inst, silent)`
*   **Description:** Removes `mermkingtridentbuff` from Wurt and all followers. Safe to call even if debuff is not present.
*   **Parameters:** `inst` (entity), `silent` (boolean, unused).
*   **Returns:** Nothing.

### `PathFinderScanForPlayers(inst)`
*   **Description:** Scans for non-merm players within `TUNING.WURT_PATHFINDER_RANGE`. For each found player, registers them as a pathfinder beneficiary and applies ground speed modifiers on marsh tiles (`WURT_PATHFINDER_TILES`) via `locomotor:SetFasterOnGroundTile`. Also removes stale entries.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `RefreshWetnessSkills(inst)`
*   **Description:** Central wetness skill manager. Starts/stops listeners on `moisturedelta`, `ms_becameghost`, and area tile events. Manages wetness-based sanity mod, health regen, and damage redirection via `health.deltamodifierfn`. Also manages `marsh_wetness` area tracking for `shadow_marsh` and `lunar_marsh` tiles.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `OnAttached(inst, target)`
*   **Description:** Callback for planar buff (e.g., shadow/lunar merm buff). Called when the debuff is attached to a merm follower. Applies `planardamage` buff, sets `baseDamage`, spawns visual FX, and sets up timer-based expiry.
*   **Parameters:** `inst` (buff debuff instance), `target` (entity).
*   **Returns:** Nothing.

### `OnDetached(inst, target)`
*   **Description:** Callback when the planar buff is removed from a merm follower. Clears `planardamage`, removes visual FX, and cleans up network state (`planarbuffed`).
*   **Parameters:** `inst` (buff debuff instance), `target` (entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to (common_postinit):**
  - `playeractivated` → `EnableTentacleWarning` (client-only).
- **Listens to (master_postinit):**
  - `onmermkingcreated_anywhere` → `RoyalUpgrade`
  - `onmermkingdestroyed_anywhere` → `RoyalDowngrade`
  - `onmermkingtridentadded_anywhere` → `TryRoyalUpgradeTrident`
  - `onmermkingtridentremoved_anywhere` → `TryRoyalDowngradeTrident`
  - `onmermkingcrownadded_anywhere` → `TryRoyalUpgradeCrown`
  - `onmermkingcrownremoved_anywhere` → `TryRoyalDowngradeCrown`
  - `onmermkingpauldronadded_anywhere` → `TryRoyalUpgradePauldron`
  - `onmermkingpauldronremoved_anywhere` → `TryRoyalDowngradePauldron`
  - `onattackother` → `OnAttackOther`
  - `attacked` → `OnAttacked`
  - `ms_playerreroll` → `RemovePathFinderSkill`
  - `ms_respawnedfromghost` → `TryMermKingUpgradesOnRespawn`
- **Listens to (wetness skills, within `RefreshWetnessSkills`):**
  - `moisturedelta` → `OnWetnessChanged`
  - `ms_becameghost` → `RefreshWetnessSkills`
  - `on_LUNAR_MARSH_tile`, `on_SHADOW_MARSH_tile` → `OnAllegianceMarshTile`
- **Listens to (planar buff `wurt_merm_planar`):**
  - `death` (on target) → `inst.components.debuff:Stop`
  - `timerdone` → `inst.components.debuff:Stop`

### Events pushed:
- `moisturedelta` (via `moisture:DoDelta`) triggers `OnWetnessChanged`.
- `playerdeactivated` triggers `DisableTentacleWarning` (client-only).
- Stategraph events `powerup_wurt` (via `sg:PushEvent`) and `powerdown_wurt` on royal state change.
