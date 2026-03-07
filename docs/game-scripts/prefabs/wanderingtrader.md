---
id: wanderingtrader
title: Wanderingtrader
description: Manages the wandering trader's shop inventory, movement routing, and hide/show states in Don't Starve Together.
tags: [locomotion, inventory, ai, world, entity]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 791501e7
system_scope: world
---

# Wanderingtrader

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `wanderingtrader` prefab implements a mobile shopkeeper that travels along procedurally generated routes, offering seasonal and random trades. It manages shop inventory via a `craftingstation` component, dynamically updates its route based on world topology or random walks, and responds to player presence and lunar hailing events. The entity toggles between visible and hidden states, pauses movement while trading or hiding, and integrates with the `worldroutes` and `worldroutefollower` systems for navigation.

## Usage example
```lua
-- Typically instantiated by the engine via Prefab("wanderingtrader", fn, assets, prefabs)
-- Modders interact with its components after spawning:
local inst = SpawnPrefab("wanderingtrader")
inst.components.craftingstation:LearnItem("flint", "wanderingtradershop_flint")
inst:SetRevealed(true)
inst:RerollWares()
```

## Dependencies & tags
**Components used:** `craftingstation`, `inspectable`, `locomotor`, `stuckdetection`, `worldroutefollower`, `teleportedoverride`, `timer`, `talker`, `brain`, `stategraph`, `transform`, `animstate`, `soundemitter`, `dynamicshadow`, `network`, `physics`, `prototyper` (conditional)
**Tags:** `revealed` (added/removed to control visibility and prototyper activation)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `WARES` | table | `WARES` (defined globally) | Nested tables defining stock tiers: `STARTER`, `ALWAYS`, `RANDOM_UNCOMMONS`, `RANDOM_RARES`, `SEASONAL`, `SPECIAL`. Each entry maps prefab names to recipe data (`recipe`, `min`, `max`, `limit`). |
| `FORGETABLE_RECIPES` | table | `{}` | Keys are recipe names without a `limit` flag; used by `RerollWares` to clear old stock. |
| `islunarhailing` | boolean | `false` | Tracks if lunar hailing is active; adds special `moonglass` stock when true. |
| `HiddenActionFn` | function or nil | `nil` | Stores deferred actions (e.g., hide/show) executed during `OnEntitySleep`. |

## Main functions
### `DoChatter(inst, name, index, cooldown)`
* **Description:** Triggers one-time NPC chatter with a cooldown timestamp stored in the stategraph memory (`canchattertimestamp`). Does not echo to chat.
* **Parameters:** `name` (string) - chatter set name; `index` (number) - index in the set; `cooldown` (number) - seconds until next chatter allowed.
* **Returns:** Nothing.
* **Error states:** None.

### `CanChatter(inst)`
* **Description:** Checks if the wandering trader can speak again based on `canchattertimestamp`.
* **Parameters:** `inst` (entity instance).
* **Returns:** `true` if no timestamp exists or it's in the past; otherwise `false`.

### `TryChatter(inst, name, index, cooldown)`
* **Description:** Calls `DoChatter` only if `CanChatter` returns `true`.
* **Parameters:** `name`, `index`, `cooldown` (as in `DoChatter`).
* **Returns:** Nothing.

### `HasStock(inst)`
* **Description:** Checks if the trader currently has any tradable items.
* **Parameters:** `inst` (entity instance).
* **Returns:** `true` if `craftingstation:GetRecipes()` returns a non-empty list; otherwise `false`.

### `EnablePrototyper(inst, enabled)`
* **Description:** Adds or removes the `prototyper` component based on `enabled`. When added, configures it to use `OnTurnOn`, `OnTurnOff`, and `OnActivate` callbacks; sets prototype tree to `WANDERINGTRADERSHOP`.
* **Parameters:** `enabled` (boolean) - whether to activate the prototyper.
* **Returns:** Nothing.

### `AddWares(inst, wares)`
* **Description:** Adds a batch of wares to the shop inventory. Calculates new crafting limits (capped at 255), learns the recipe, and updates the limit if the result is greater than the current limit.
* **Parameters:** `wares` (table) - a single-tier entry from `WARES` (e.g., `inst.WARES.ALWAYS[1]`).
* **Returns:** Nothing.

### `RerollWares(inst)`
* **Description:** Clears forgetable recipes, then adds stock from `ALWAYS`, and probabilistically adds `RANDOM_UNCOMMONS`, `RANDOM_RARES`, and `SEASONAL` wares based on tuning values and current season. Finally, calls `EnablePrototyper` if `revealed`.
* **Parameters:** `inst` (entity instance).
* **Returns:** Nothing.

### `OnArrivedFn(inst)`
* **Description:** Callback when the trader finishes moving to a route node. Pauses movement, then starts a timer based on `WANDERINGTRADER_WANDERING_PERIOD` with variance before unpausing.
* **Parameters:** `inst` (entity instance).
* **Returns:** Nothing.

### `OnTurnOn(inst)` / `OnTurnOff(inst)`
* **Description:** Pauses/unpauses route following and `refreshwares` timer, and toggles `trading` flag in stategraph memory.
* **Parameters:** `inst` (entity instance).
* **Returns:** Nothing.

### `OnActivate(inst)`
* **Description:** Called when a player opens the shop. Checks for no-stock condition, disables prototyper if needed, sets `didtrade` flag, and fires `dotrade` event.
* **Parameters:** `inst` (entity instance).
* **Returns:** Nothing.

### `TryToCreateWorldRoute(inst)`
* **Description:** Attempts to create or load the trader's route. First tries `FollowRoute("wanderingtrader")`; if absent, calls `CreateWorldRoute` and then reattempts `FollowRoute`.
* **Parameters:** `inst` (entity instance).
* **Returns:** `true` if a route is successfully created and followed; otherwise `false`.

### `CreateWorldRoute(inst, route)`
* **Description:** Fills `route` table by first trying `TryToCreateRouteFromTopology`; if that yields no points, falls back to `CreateRouteFromRandomWalk`.
* **Parameters:** `inst` (entity instance); `route` (table) - output vector array.
* **Returns:** Nothing.

### `TryToCreateRouteFromTopology(inst, route)`
* **Description:** Finds key world nodes (e.g., portals, pig kings) and computes shortest paths between them using BFS, populating `route`. Sets the route in `worldroutes` if non-empty.
* **Parameters:** `inst` (entity instance); `route` (table) - output vector array.
* **Returns:** Nothing.

### `CreateRouteFromRandomWalk(inst, route)`
* **Description:** Generates a closed circular route around the starting spawn point using random angular offsets and walkability checks. Guarantees at least one point.
* **Parameters:** `inst` (entity instance); `route` (table) - output vector array.
* **Returns:** Nothing.

### `OnTimerDone(inst, data)`
* **Description:** Handles `refreshwares` timer expiration. Reschedules the timer if players are nearby; otherwise calls `RerollWares`.
* **Parameters:** `data` (table) - must contain `name == "refreshwares"`.
* **Returns:** Nothing.

### `SetRevealed(inst, revealed)`
* **Description:** Adds/removes the `revealed` tag and enables/disables the prototyper component (and stock if revealed).
* **Parameters:** `revealed` (boolean).
* **Returns:** Nothing.

### `SetIsLunarHailing(inst, active)`
* **Description:** Enables/disables lunar hailing mode. Adds `moonglass` stock if active.
* **Parameters:** `active` (boolean).
* **Returns:** Nothing.

### `OnWanderingTraderHide(inst)` / `OnWanderingTraderShow(inst)`
* **Description:** Pauses movement and enters `hiding` or `arrive` state. `OnWanderingTraderShow` calls `ReturnToScene`.
* **Parameters:** `inst` (entity instance).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `timerdone` - triggers `OnTimerDone` for `refreshwares` timer completion.
- **Listens to:** `wanderingtrader_hide` - triggers `OnWanderingTraderHide`.
- **Listens to:** `wanderingtrader_show` - triggers `OnWanderingTraderShow`.
- **Pushes:** `dotrade` - fired when the shop is activated; includes `{no_stock = boolean}`.
- **Pushes:** `arrive` - fired after teleportation completes via `PostTeleportFn`.
- **Pushes:** `wanderingtrader_created` - posted on world init after spawn (via `TheWorld:PushEvent`).
- **Listens to world state:** `islunarhailing` - watched via `WatchWorldState` to trigger `SetIsLunarHailing`.