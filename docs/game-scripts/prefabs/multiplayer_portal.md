---
id: multiplayer_portal
title: Multiplayer Portal
description: Implements the logic for construction, activation, and player teleportation through multiplayer portals in Don't Starve Together.
tags: [crafting, portal, entity]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 10a925b1
system_scope: world
---

# Multiplayer Portal

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `multiplayer_portal` prefab defines the behavior of multiplayer portals — structures used to transport players between worlds (e.g., Forest to Caves or vice versa). It supports three distinct variants: a basic stone portal (`multiplayer_portal`), a portal under construction (`multiplayer_portal_moonrock_constr`), and a fully built moon rock portal (`multiplayer_portal_moonrock`). The moon rock portal includes advanced features such as player reroll (character re-roll) via moon portal keys.

The component heavily leverages the `constructionsite`, `moontrader`, `hauntable`, and `inspectable` components. It also manages player spawning animations via `playercontroller` and `colourtweener`, and interacts with the world state via `ms_onportalrez` and `ms_newplayercharacterspawned` events.

## Usage example
The prefab itself is instantiated via `MakePortal`, which returns a `Prefab` object. Standard usage is internal to the game and does not require manual instantiation by modders. However, to add a custom portal, you might:

```lua
local MyPortal = MakePortal(
    "my_custom_portal",
    "portal_dst",
    "portal_stone",
    {
        Asset("ANIM", "anim/my_portal.zip"),
        Asset("MINIMAP_IMAGE", "portal_dst"),
    },
    nil,
    function(inst)
        -- Custom common_postinit logic
    end,
    function(inst)
        -- Custom master_postinit logic
    end
)
```

## Dependencies & tags
**Components used:**
- `colourtweener`
- `constructionsite`
- `container`
- `hauntable`
- `inspectable`
- `inventory`
- `leader`
- `moontrader`
- `playercontroller`
- `pointofinterest`

**Tags added or checked:**
- `multiplayer_portal`
- `antlion_sinkhole_blocker`
- `constructionsite`
- `resurrector`
- `moontrader`
- `moonportal`
- `FX`

## Properties
No public properties are exposed at the prefab level. Internal state is stored in `inst.sg.mem` (state graph memory) or `inst._savedata`.

## Main functions
### `MakePortal(name, bank, build, assets, prefabs, common_postinit, master_postinit)`
* **Description:** Factory function that constructs and returns a `Prefab` instance for a portal variant. Handles initialization of transform, animstate, minimap, network, and tags. Registers world-level event listeners for player spawning and portal rezzing.
* **Parameters:**
  - `name` (string) — prefab name (e.g., `"multiplayer_portal_moonrock"`)
  - `bank` (string) — anim bank name
  - `build` (string) — anim build name
  - `assets` (table) — asset list (ANIM, MINIMAP_IMAGE)
  - `prefabs` (table or `nil`) — child prefabs required at construction
  - `common_postinit` (function or `nil`) — runs on both server and client
  - `master_postinit` (function or `nil`) — runs only on server (master sim)
* **Returns:** `Prefab` — a reusable prefab definition.
* **Error states:** None. Gracefully handles client-only vs. master-sim-only logic.

### `OnGetPortalRez(inst, portalrez)`
* **Description:** Conditionally adds/removes the `hauntable` component and `resurrector` tag based on whether the portal is enabled for resurrection (`portalrez`).
* **Parameters:**
  - `inst` (Entity)
  - `portalrez` (boolean) — value from `GetPortalRez()`
* **Returns:** Nothing.
* **Error states:** None.

### `OnRezPlayer(inst)`
* **Description:** Triggers the `"spawn_pre"` state in the portal's state graph when a player spawns near it, unless the portal is currently in construction.
* **Parameters:**
  - `inst` (Entity)
* **Returns:** Nothing.

### `OnStartConstruction(inst)`
* **Description:** Initiates construction state (`"placeconstruction"`) in the portal's state graph.
* **Parameters:**
  - `inst` (Entity)
* **Returns:** Nothing.

### `CalculateConstructionPhase(inst)`
* **Description:** Calculates the current construction phase (1–4) based on materials provided. Single-item materials and stacked materials are weighted differently.
* **Parameters:**
  - `inst` (Entity) — must have `constructionsite` component.
* **Returns:** `number` — phase value between `1` and `4`.
* **Error states:** Returns `1` as fallback if construction plan is missing or invalid.

### `OnConstructed(inst, doer)`
* **Description:** Handles transition after construction completes. Decides whether to jump to `"constructed"` or `"constructionphase4"` depending on target and current phases.
* **Parameters:**
  - `inst` (Entity) — portal instance.
  - `doer` (Entity) — player who constructed it.
* **Returns:** Nothing.

### `construction_onload(inst)`
* **Description:** Sets up visual and state graph state during world load for a construction portal (fixes animation stages and transitions).
* **Parameters:**
  - `inst` (Entity)
* **Returns:** Nothing.

### `moonrock_canaccept(inst, item)`
* **Description:** Checks if the moon portal can accept an item (only `moonportalkey` items, and only outside caves).
* **Parameters:**
  - `inst` (Entity)
  - `item` (Entity) — item being offered.
* **Returns:** `boolean` — whether accepted, or `false, "NOMOON"` if in cave.

### `moonrock_onaccept(inst, giver)`
* **Description:** Processes player teleport/reroll via moon portal. Drops inventory, saves reroll data, and despawns the player.
* **Parameters:**
  - `inst` (Entity) — moon portal instance.
  - `giver` (Entity) — player using the portal.
* **Returns:** Nothing.

### `moonrock_onupdate(inst, instant)`
* **Description:** Periodically scans for players within `8` units bearing the `"moonportalkey"` tag and pushes `"ms_moonportalproximity"` to them.
* **Parameters:**
  - `inst` (Entity) — moon portal instance.
  - `instant` (boolean) — whether to skip delay on effect.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `"ms_onportalrez"` (TheWorld) — updates resurrection capability.
  - `"ms_newplayercharacterspawned"` (TheWorld) — handles screen fade-in for newly spawned players.
  - `"rez_player"` (inst) — triggers spawn animation on player approach.
  - `"onstartconstruction"` (inst) — starts construction state.
  - `"ms_newplayerspawned"` (TheWorld) — loads saved player data for reroll.
  - `"ms_playerjoined"` (TheWorld) — cleans up pending reroll data for new players.

- **Pushes:**
  - `"colourtweener_start"` — via `colourtweener` on completion of fade-in sequence.
  - `"ms_moonportalproximity"` — on players near a moon portal.
  - `"ms_playerreroll"` — triggers character reroll UI.
  - `"ms_playerdespawnanddelete"` — final step in moon portal teleport.
