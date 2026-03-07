---
id: ruins_shadeling
title: Ruins Shadeling
description: A non-hostile ambient shadow creature that respawns in the Ruins and spawns different loot based on shadow rift presence.
tags: [ambient, shadow, loot, ruins]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 21b727d6
system_scope: entity
---

# Ruins Shadeling

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `ruins_shadeling` prefab represents a non-combative ambient entity in the Ruins. It remains motionless in a seated pose, provides a sanity aura (negative when the player is insane), and drops loot upon despawning or death. Its loot table dynamically switches between `LOOT` (containing `nightmarefuel`) and `LOOT_RIFT` (containing `horrorfuel`) depending on whether a shadow rift is active in the world. It supports seamless removal when off-screen and transitions between states using animation callbacks.

## Usage example
```lua
local shadeling = SpawnPrefab("ruins_shadeling")
shadeling.Transform:SetPosition(x, y, z)
shadeling.Despawn()  -- triggers wake animation and delayed removal
```

## Dependencies & tags
**Components used:** `health`, `combat`, `lootdropper`, `sanityaura`, `transparentonsanity`, `planarentity`, `riftspawner`  
**Tags added:** `shadowcreature`, `monster`, `shadow`, `shadow_aligned`, `gestaltnoloot`, `NOBLOCK`, `NOCLICK`, `notarget` (added conditionally via `DisableCombat`)  
**Tags checked:** None directly by this prefab’s internal logic beyond tag-based API calls.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `sleeptask` | Task | `nil` | Reference to the off-screen removal timer task. |
| `despawned` | boolean | `false` | Flag indicating the shadeling has been marked for despawn but not yet removed. |
| `scrapbook_inspectonseen` | boolean | `true` | Controls whether the scrapbook entry shows on first visual inspection. |
| `scrapbook_anim` | string | `"scrapbook"` | Scrapbook display animation. |
| `scrapbook_overridedata` | table | `{ { "chair", "ruins_chair", "chair" } }` | Scrapbook icon override. |
| `scrapbook_hidesymbol` | table | `{ "shad_parts2_red", "shad_head_white" }` | Symbols hidden in scrapbook view. |
| `scrapbook_thingtype` | string | `"creature"` | Scrapbook display category. |
| `transparentonsanity.most_alpha` | number | `0.7` | Max transparency when sanity-affected (client-side). |
| `transparentonsanity.osc_amp` | number | `0.1` | Oscillation amplitude for transparency flicker (client-side). |
| `components.health.maxhealth` | number | `1` | Max health, fixed at 1. |
| `components.health.nofadeout` | boolean | `true` | Prevents fading out on death. |
| `components.combat.hiteffectsymbol` | string | `"shad_head"` | Symbol used for hit visual FX. |
| `components.sanityaura.aurafn` | function | `CalcSanityAura` | Callback to compute sanity aura strength. |
| `components.lootdropper.loot` | table | Initially `LOOT`, changes to `LOOT_RIFT` if rift active | Loot table used on despawn/death. |

## Main functions
### `Despawn()`
*   **Description:** Marks the shadeling for removal, plays the `"wake"` animation, disables combat targeting, and schedules removal after animation completes.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No-op if already `despawned` or dead (unless it has already been removed via `OnEntitySleep`).

### `OnDeath(inst)`
*   **Description:** Handles post-death logic: removes itself after an animation delay and drops loot.
*   **Parameters:** `inst` (entity) — the dead shadeling.
*   **Returns:** Nothing.
*   **Error states:** Removes itself; no further calls possible after execution.

### `DoDropLoot(inst)`
*   **Description:** Drops loot at the shadeling’s position and triggers the `ruins_shadeling_looted` event. Then marks the instance for removal depending on sleep state.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `DisableCombat(inst)`
*   **Description:** Adds `NOCLICK` and `notarget` tags to prevent interaction.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `TryRemoveOffScreen(inst)`
*   **Description:** Callback run after a short delay when the entity goes to sleep; removes the entity only if it is still off-screen and not about to drop loot.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `CheckRift()`
*   **Description:** Detects whether a shadow rift is active. If active, adds `planarentity`, updates loot to `LOOT_RIFT`, and shows shadow symbols. If inactive, reverts to base `LOOT` and hides shadow symbols.
*   **Parameters:** None (uses `inst` from closure).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `death` (on `inst`) — triggers `OnDeath`.
  - `animover` (on `inst`) — triggers removal after `Despawn`.
  - `ms_riftaddedtopool` (on `TheWorld`) — triggers `CheckRift`.
  - `ms_riftremovedfrompool` (on `TheWorld`) — triggers `CheckRift`.
- **Pushes:**
  - `ruins_shadeling_looted` — fired when loot is dropped.