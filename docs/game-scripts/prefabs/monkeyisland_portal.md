---
id: monkeyisland_portal
title: Monkeyisland Portal
description: Manages spontaneous and event-triggered loot spewing from a monkey island portal, including trading logic, looting behavior, and event sequencing.
tags: [loot, event, npc, trading, world]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 089bd93f
system_scope: world
---

# Monkeyisland Portal

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `monkeyisland_portal` prefab acts as a dynamic loot spawner and trading hub on Monkey Island maps. It periodically spawns random loot items via a timed loop, responds to nearby players by accelerating event timers, accepts `moonstorm_spark` items to trigger a large-scale event sequence (the "Portal Event"), and manages loot persistence across world saves. It integrates with several components—especially `lootdropper`, `playerprox`, `trader`, and `timer`—to orchestrate spewing, event timing, and player-triggered behaviors.

## Usage example
```lua
-- Portal is automatically instantiated by the worldgen and cannot be manually created as a standalone entity.
-- Modders typically interact with its public test methods for debugging or customization:
local portal = GetActiveWorldEntity().components.portal or nil -- hypothetical usage
if portal and portal.Test then
    portal.Test() -- force a loot spawn for testing
end
```

## Dependencies & tags
**Components used:**  
- `lootdropper` (for item velocity and positioning)  
- `playerprox` (to detect players and accelerate spew timers)  
- `trader` (for accepting trade items and initiating events)  
- `timer` (for scheduled looting and event phases)  

**Tags added by instance:**  
- `ignorewalkableplatforms`  
- `NOBLOCK`  

**FX-specific tags (on `monkeyisland_portal_lootfollowfx`):**  
- `FX`, `NOBLOCK`, `NOCLICK`  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_loot` | table of entities | `{}` | Array of currently active loot entities spawned by the portal. |
| `_event_is_busy` | boolean | `false` | Prevents new trading or event triggers while a Portal Event is running. |

## Main functions
### `portal_on_near(inst, player)`
* **Description:** Called when a player enters the proximity zone. If a start-timer for a Portal Event is pending and has more than 3 seconds remaining, it shortens the timer to `EVENT_TRIGGER_TIME`.
* **Parameters:**  
  - `inst` (entity) — the portal instance.  
  - `player` (entity) — the player who triggered proximity.  
* **Returns:** Nothing.

### `try_portal_spawn(inst)`
* **Description:** Spawns either real loot (based on weighted `PORTAL_LOOT_PREFABS`) or FX-only loot if loot count or capacity limits are exceeded. Cleans up invalid or distant loot first.
* **Parameters:**  
  - `inst` (entity) — the portal instance.  
* **Returns:** Nothing.

### `start_portal_event(inst)`
* **Description:** Attempts to trigger the Portal Event. Only fires if `MONKEYISLAND_PORTAL_ENABLED`, at least one player is within distance (`< 20 units²`), and no event is already running. Clears any pending start timer, plays buildup sound, and starts a 3-second countdown before `fire_portal_event`.
* **Parameters:**  
  - `inst` (entity) — the portal instance.  
* **Returns:** Nothing.

### `fire_portal_event(inst)`
* **Description:** Executes the Portal Event by sequentially spawning a randomized list of `portal_event_spawns` (e.g., cutgrass, rocks, powder_monkey) with 10-frame delays. After spawning, it enables trading via `enable_trading`.
* **Parameters:**  
  - `inst` (entity) — the portal instance.  
* **Returns:** Nothing.

### `able_to_accept_trade_test(inst, item, giver)`
* **Description:** Implements the trader test function. Returns `false` if the portal is currently busy in an event or if the item lacks `moonstorm_spark`. Returns `true` otherwise.
* **Parameters:**  
  - `inst` (entity) — the portal instance.  
  - `item` (entity) — the item being offered.  
  - `giver` (entity) — the player offering the item.  
* **Returns:** `false, "BUSY"` or `false, "GENERIC"` or `true`.

### `on_accept_item(inst, giver, item)`
* **Description:** Callback for successful trade. Immediately calls `start_portal_event`.
* **Parameters:**  
  - `inst` (entity) — the portal instance.  
  - `giver` (entity) — the player.  
  - `item` (entity) — the `moonstorm_spark` item.  
* **Returns:** Nothing.

### `on_timer_done(inst, data)`
* **Description:** Handles all timer events: looting loop (`PORTALLOOT_TIMER_NAME`), delayed event start (`STARTEVENT_TIMER_NAME`), and event firing (`FIREEVENT_TIMER_NAME`). The looting timer restarts itself for periodic behavior.
* **Parameters:**  
  - `inst` (entity) — the portal instance.  
  - `data.name` (string) — the timer name that completed.  
* **Returns:** Nothing.

### `fling_portal_loot(inst, loot_to_drop)`
* **Description:** Spawns loot with a vertical offset and optional hop behavior (e.g., for entities with `embarker`). Plays spew sound and, if the loot has a stategraph, pushes it to `"portal_spawn"`.
* **Parameters:**  
  - `inst` (entity) — the portal instance.  
  - `loot_to_drop` (entity) — the spawned loot prefab.  
* **Returns:** Nothing.

### `spawn_real_loot(inst)`
* **Description:** Selects a random loot prefab using weighted probabilities (respecting Tuning values like `"MONKEYISLAND_PORTAL_POWDERMONKEYWEIGHT"`), spawns it, adds it to `_loot`, and calls `fling_portal_loot`.
* **Parameters:**  
  - `inst` (entity) — the portal instance.  
* **Returns:** The spawned loot entity (or `nil` if spawning fails).

### `spawn_fx_loot(inst)`
* **Description:** Spawns a `monkeyisland_portal_fxloot` prefab and flings it as visual decoration.
* **Parameters:**  
  - `inst` (entity) — the portal instance.  
* **Returns:** The spawned FX loot entity.

### `attach_light_fx(attach_target)`
* **Description:** Spawns `monkeyisland_portal_lootfollowfx`, attaches it to the target loot as a child, and manages light override and `"outofreach"` tag via a delayed cleanup task.
* **Parameters:**  
  - `attach_target` (entity) — the loot to attach FX to.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"timerdone"` (handled by `on_timer_done`) — triggers timed behaviors.  
  - `"cycles"` watched via `WatchWorldState` (handled by `on_cycles_changed`) — starts the event timer at dawn if enabled.  
- **Pushes:**  
  - `"ms_register_monkeyisland_portal"` — broadcasts the portal instance on spawn (internal use).  

> **Note:** Public test functions (`inst.Test`, `inst._TestPortalEvent`) are exposed for debugging but not part of the standard API.