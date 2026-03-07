---
id: miniflare
title: Miniflare
description: A portable throwable flare item that ignites, emits light, triggers visual/audio effects, and notifies nearby players upon detonation.
tags: [item, light, event, audio, fx]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 23f5b607
system_scope: environment
---

# Miniflare

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `miniflare` prefab is a throwable inventory item that, when ignited, spawns a short-lived explosive light/fx effect, plays sound, updates the minimap with a temporary icon, triggers a HUD overlay for nearby players, and broadcasts a speech notification to nearby players. It is not persistent and does not save to world data.

The item is implemented as two separate prefabs:
- `miniflare`: The held/dropped inventory item.
- `miniflare_minimap`: A client-side visual marker for the explosion effect (visible only on the minimap).

Key interactions include integration with the `burnable` component (to trigger ignition), `talker` component (to announce detonation), and the minimap/HUD systems.

## Usage example
```lua
-- As a modder, to spawn a miniflare item in a player's inventory:
local flare = SpawnPrefab("miniflare")
player:AddItem(flare)

-- To ignite it programmatically (e.g., via an event or action):
flare:PushEvent("onignite", { source = some_source, doer = player })
```

## Dependencies & tags
**Components used:** `burnable`, `propagator`, `talker`, `inventoryitem`, `tradable`, `inspectable`, `hauntablelaunch`  
**Tags added:** `donotautopick` (to prevent automatic pickup by AI)  
**Tags checked:** None (only checks for tags on other entities in `on_ignite` via `AllPlayers`)

## Properties
No public properties are defined or documented in the constructor. Internally used variables include `_small_minimap` (client-side index) and `flare_igniter`, but these are not exposed or intended for modder access.

## Main functions
### `flare_fn()`
* **Description:** Constructor for the `miniflare` inventory item prefab. Initializes visuals, physics, animations, and components required for inventory behavior, ignition, and hauntable properties.
* **Parameters:** None.
* **Returns:** `inst` (Entity) — a fully configured entity instance ready for use as an item.
* **Error states:** Returns early on clients without `TheWorld.ismastersim` before adding server-side logic.

### `flare_minimap()`
* **Description:** Constructor for the client-side minimap icon entity that appears during detonation.
* **Parameters:** None.
* **Returns:** `inst` (Entity) — a minimap-only entity with a global map icon for visibility across clients.

### `on_ignite(inst, source, doer)`
* **Description:** Callback triggered when the `burnable` component ignites the item. Plays launch sound, switches animation to fire, and schedules detonation via `animover` event.
* **Parameters:**  
  `inst` (Entity) — the miniflare instance.  
  `source` (Entity) — the igniting source (e.g., a fire, torch, or player).  
  `doer` (Entity) — the actor that ignited the item (may equal `source`).  
* **Returns:** Nothing.
* **Error states:** Sets `inst.persists = false` and `inst.entity:SetCanSleep(false)` to prevent saving; stores `flare_igniter` for post-detonation event data.

### `on_ignite_over(inst)`
* **Description:** Handles detonation logic: calculates random explosion position, spawns minimap effect entity, notifies nearby players via `Talker`, and dispatches the `miniflare_detonated` world event.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.
* **Error states:** Removes the `miniflare` entity at the end; speech announcement is skipped for players within `SPEECH_MIN_DISTANCE_SQ`.

### `show_flare_hud(inst)`
* **Description:** Client-side function. Shows or schedules a HUD indicator (avatar icon) based on player proximity, and triggers explosion sound with dynamic volume scaling.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.
* **Error states:** Early return if `ThePlayer` or `ThePlayer.HUD` is `nil`.

### `show_flare_minimap(inst)`
* **Description:** Client-side function. Spawns a `globalmapicon` and periodically swaps the minimap icon texture (1 of 3 variations) during detonation.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `do_flare_minimap_swap(inst)`
* **Description:** Periodic task callback. Randomly selects a new minimap icon (ensuring alternation) and updates both `inst.MiniMapEntity` and `inst.icon.MiniMapEntity`.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `on_dropped(inst)`
* **Description:** Animation handler called when the item is dropped. Plays the "place" animation followed by a non-looping "idle" transition.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `animover` — triggers detonation (`on_ignite_over`) after fire animation ends.  
  - `ondropped` — plays "place" animation (`on_dropped`).  
  - `floater_startfloating` / `floater_stopfloating` — switches between "float" and "idle" animations when floating.  
  - `onremove` — cancels pending HUD indicator removal (`RemoveHudIndicator`).

- **Pushes:**  
  - `startflareoverlay` — client-side event to activate the flare visual overlay (via HUD).  
  - `miniflare_detonated` — world event with `{ sourcept, pt, igniter }` data for world reaction (e.g., lights, FX, triggers).