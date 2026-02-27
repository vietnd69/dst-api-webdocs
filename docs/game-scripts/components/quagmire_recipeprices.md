---
id: quagmire_recipeprices
title: Quagmire Recipeprices
description: Manages the queuing, syncing, and local display of recipe appraisal results in Quagmire multiplayer sessions.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: crafting
source_hash: 48b2c48c
---

# Quagmire Recipeprices

## Overview
This component handles the asynchronous appraisal of recipes in Quagmire mode. It queues recipe appraisal requests on the master simulation and synchronizes the results to all clients via networked variables, while also triggering local UI updates and asset loading on non-master instances.

## Dependencies & Tags
- **Component Dependency**: Requires `inst` to support network variable sync (`net_string`, `net_tinybyte`, `net_bool`, `net_smallbyte`) and event system (`inst:ListenForEvent`, `inst:DoTaskInTime`).
- **Tags/Constants**: Uses internal Quagmire constants (`CRAVING_NAMES`, `DISH_NAMES`, `NUM_COIN_TYPES`, `QUEUE_DELAY`) and `_ismastersim` to determine runtime behavior.
- **No explicit tags** added or removed from the entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity the component is attached to (typically the recipe appraiser). |
| `_queue` (master only) | `table` | `{}` | Queue of pending recipe appraisal records on the master simulation. |
| `_secrets` (master only) | `table` | `event_server_data("quagmire", "klump_secrets")` | Map of recipe names to klump cipher keys, sourced from server-side event data. |
| `_task` | `Task?` | `nil` | Reference to the delayed task driving the queue on master or clearing stale recipes on clients. |
| `_recipename` | `net_string` | `""` | Networked variable storing the name of the current appraised recipe. |
| `_klumpkey` | `net_string` | `""` | Networked variable for the klump cipher key used in asset loading. |
| `_dish` | `net_tinybyte` | `0` | Networked index into `DISH_NAMES` (0 = none). |
| `_silverdish` | `net_bool` | `false` | Whether the appraisal used a silver dish. |
| `_maxvalue` | `net_bool` | `true` | Whether the appraisal achieved maximum value. |
| `_matchedcraving` | `net_smallbyte` | `0` | Index into `CRAVING_NAMES` (0 = none). |
| `_snackpenalty` | `net_bool` | `false` | Whether the snack penalty applied to the appraisal. |
| `_coins` | `array of net_smallbyte` | `{0,0,0,0}` | Array of 4 coin type values (coin types 1–4). |

## Main Functions
### `OnRecipeDirty()`
* **Description:** Processes a received recipe appraisal on non-master clients. Prints appraisal details, loads klump assets if enabled, and broadcasts a `"quagmire_recipeappraised"` event with full appraisal metadata.
* **Parameters:** None (called as a network variable listener when `_recipename` changes).

### `ProcessQueue()`
* **Description:** On the master simulation, dequeues and applies the next recipe appraisal record to the network variables and triggers `OnRecipeDirty()` to propagate changes. Recursively schedules itself until the queue is empty.
* **Parameters:** None.

### `ClearRecipe()`
* **Description:** On non-master clients, clears the local `_recipename` after a delay (`QUEUE_DELAY = 3` seconds) if no new appraisal is received. Ensures stale appraisals are cleared in the UI.
* **Parameters:** None.

## Events & Listeners
- **Listens for `"ms_quagmirerecipeappraised"` (on master only):** Triggers `OnRecipeAppraised` to queue a new appraisal record from event data.
- **Listens for `"recipedirty"` (on non-master only):** Triggers `OnRecipeDirty` when networked recipe data is synced.
- **Triggers `"quagmire_recipeappraised"` (on non-master only, inside `OnRecipeDirty`):** Broadcasts full appraisal data (recipe name, dish, coins, etc.) to subscribed listeners (e.g., UI).