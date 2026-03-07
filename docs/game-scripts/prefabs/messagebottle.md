---
id: messagebottle
title: Messagebottle
description: Manages message bottle prefabs and their behavior, including throwing mechanics, map revealing, treasure generation, and conversion into gel blob bottles or empty bottles upon interaction.
tags: [inventory, projectile, map, item]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5700cf8f
system_scope: inventory
---

# Messagebottle

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `messagebottle.lua` file defines four core prefabs: `messagebottle`, `messagebottleempty`, `messagebottle_throwable`, and `gelblob_bottle`. It implements logic for handling message bottles in the game world — including floating on water, being thrown as projectiles, revealing map spots, and converting into other items based on context (e.g., upon hitting water, hitting terrain, or being used with a hermit crab). It integrates heavily with components like `bottler`, `complexprojectile`, `equippable`, `mapspotrevealer`, `stackable`, `inventoryitem`, and `waterproofer`.

## Usage example
```lua
-- Spawn a thrown message bottle at player position
local bottle = SpawnPrefab("messagebottle_throwable")
if bottle ~= nil and player ~= nil then
    player.components.inventory:GiveItem(bottle)
end

-- Use message bottle on a hermit crab (triggers bottle logic via Bottler component)
local bottle = SpawnPrefab("messagebottleempty")
bottle.Transform:SetPosition(hermit:GetPosition())
hermit.components.bottler.OnBottle(bottle, hermit, player)
```

## Dependencies & tags
**Components used:**  
`bottler`, `complexprojectile`, `equippable`, `inventoryitem`, `mapspotrevealer`, `stackable`, `waterproofer`, `inspectable`, `talker`, `inventory`

**Tags:**  
Adds/Removes: `waterproofer`, `mapspotrevealer`, `projectile`, `complexprojectile`, `NOCLICK`  
Checks: `mime`, `debuffed` (indirectly via talker)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `canbepickedup` | boolean | `true` (for most prefabs); `false` for splash/floating bottle instances | Controls whether the item can be picked up by players. Set to `false` after throwing or after splash effect. |
| `persists` | boolean | `true` (for stable items); `false` for thrown bottles | Whether the item persists after server restarts. Set to `false` for thrown/floating temporary bottles. |
| `scrapbook_removedeps` | array of strings | `messagebottletreasures_prefabs` | List of prefabs to remove dependencies from when this item is removed in the Scrapbook UI. |

## Main functions
### `commonmakebottle(common_postinit, master_postinit)`
*   **Description:** Generic constructor for base `messagebottle` and `messagebottle_throwable`. Applies common animations, physics, and core components.
*   **Parameters:** `common_postinit` (function or `nil`) — function run before network separation; `master_postinit` (function or `nil`) — function run only on master simulation.
*   **Returns:** `inst` (EntityInstance) — fully configured bottle entity.
*   **Error states:** Returns a minimal entity on the client only (non-master simulation), skipping server-specific setup.

### `messagebottlefn()`
*   **Description:** Constructor for standard sealed message bottle (`messagebottle`). Used for placing in ocean to drift and reveal map spots.
*   **Parameters:** None.
*   **Returns:** `inst` (EntityInstance) — a fully initialized `messagebottle` prefab.

### `emptybottlefn()`
*   **Description:** Constructor for empty message bottle (`messagebottleempty`). Used for giving to Hermit Crab to generate treasures.
*   **Parameters:** None.
*   **Returns:** `inst` (EntityInstance) — an empty bottle with `bottler` and `stackable` components.

### `throwingbottlefn(inst)`
*   **Description:** Constructor for throwable message bottle (`messagebottle_throwable`). Extends `commonmakebottle` with projectile physics and equipping animations.
*   **Parameters:** `inst` (EntityInstance or `nil`) — optional existing instance to initialize.
*   **Returns:** `inst` (EntityInstance) — a bottle suitable for throwing.

### `GelBlobBottle_OnHit(inst, attacker, target)`
*   **Description:** Handles bottle impact when holding gel blob. Creates a `gelblob_small_fx` upon failed splash landing or breaks bottle and releases blob if on land.
*   **Parameters:** `inst` (EntityInstance) — the bottle; `attacker` (EntityInstance or `nil`) — usually `nil` for self-inflicted; `target` (EntityInstance) — the thing hit (e.g., `gelblob_small_fx` or terrain).
*   **Returns:** Side-effect only (no return).
*   **Error states:** Does not return anything meaningful; behavior depends on terrain classification at impact point.

### `prereveal(inst, doer)`
*   **Description:** Called before revealing a map spot. Determines if the bottle contains a note and triggers note reading (e.g., `animover` callback). Converts bottle to empty if a note is found.
*   **Parameters:** `inst` (EntityInstance) — bottle being used; `doer` (EntityInstance) — player using the bottle.
*   **Returns:** `true` (reveal map now), `false` (don't reveal; note animation triggered).
*   **Error states:** Returns early with `true` if `messagebottlemanager` component is missing.

## Events & listeners
- **Listens to:**  
  - `"on_landed"` — triggers `playidleanim` or `playidleanim_empty` depending on bottle state.  
  - `"on_reveal_map_spot_pst"` — calls `turn_empty` to convert bottle to empty after map reveal.  
  - `"ondropped"` / `"ondropped_empty"` — sets idle animation to `idle` or `idle_empty`.  
  - `"animover"` — removes instance after note-reading animation completes; removes floating splash bottle after bob animation.  
  - `"floater_startfloating"` / `"floater_stopfloating"` — switches animations for `gelblob_bottle` when entering/leaving water.

- **Pushes:**  
  - None — this prefab does not push custom events directly. It relies on component events (`mapspotrevealer`, `inventoryitem`, etc.) for internal state changes.