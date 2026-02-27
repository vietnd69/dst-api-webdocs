---
id: quagmire_recipebook
title: Quagmire Recipebook
description: Manages the discovery, queuing, and network synchronization of Quagmire recipes in the Quagmire DLC for Don't Starve Together.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: crafting
source_hash: 5b2defe9
---

# Quagmire Recipebook

## Overview
The `quagmire_recipebook` component handles the discovery, queuing, and network synchronization of Quagmire-specific cooking recipes. It acts as a central hub for managing recipe data—including product name, ingredients, cooking station, dish type, and overcooked state—between server (master simulation) and client. On the server, it maintains a queue of discovered recipes; on the client, it triggers UI updates and asset loading upon recipe sync.

## Dependencies & Tags
- Uses `TheWorld` (`TheWorld.ismastersim`) to determine simulation context.
- Relies on `net_string`, `net_tinybyte`, `net_bool`, and `net_smallbyte` for network synchronization.
- Depends on `QUAGMIRE_USE_KLUMP` (global flag) for optional asset loading.
- Calls `event_server_data("quagmire", "klump_secrets")` on the server to load recipe secrets.
- Consumes `LoadKlumpFile` and `LoadKlumpString` for dynamic asset loading (client-side).
- Pushes the custom event `quagmire_recipediscovered` to notify UI or other systems.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity this component is attached to (typically the player's recipebook inventory item). |
| `_queue` | `table` | `{}` (master only) | Queue of pending recipe discovery records on the server. |
| `_secrets` | `table` | `nil` (master only) | Server-side map of recipe names to klump secrets (cipher data), fetched via `event_server_data`. |
| `_task` | `Task` | `nil` | Deferred task used to delay or clear recipe sync state on the client. |
| `_recipename` | `net_string` | `""` | Network variable storing the name of the current/last discovered recipe. |
| `_klumpkey` | `net_string` | `""` | Network variable storing the cipher key for klump asset loading. |
| `_dish` | `net_tinybyte` | `0` | Index into `DISH_NAMES` representing the dish used (e.g., plate or bowl). |
| `_station` | `net_tinybyte` | `0` | Index into `STATION_NAMES` representing the cooking station (e.g., pot, oven, grill). |
| `_overcooked` | `net_bool` | `false` | Network boolean indicating if the recipe was overcooked. |
| `_ingredients` | `array of net_smallbyte` | `{0,0,0,0}` | Array of 4 network variables, each storing an index into `INGREDIENT_NAMES`. |

## Main Functions

### `ClearRecipe()`
* **Description:** Clears the current recipe state on the client by resetting `_task` and the `_recipename` network variable. Triggered after a 3-second delay if no new recipe is synced.
* **Parameters:** None (client-only function).

### `OnRecipeDirty()`
* **Description:** Client-side handler triggered when `_recipename` changes. Parses the received recipe data (ingredients, dish, station, overcooked state), optionally loads klump assets (e.g., images, animations, strings), prints recipe details to console, and emits the `quagmire_recipediscovered` event. Also resets `_task` if a new recipe arrives before the prior delay expires.
* **Parameters:** None.

### `ProcessQueue()`
* **Description:** Server-side function that processes the next recipe record in `_queue`. Copies the record's data into the network variables (`_recipename`, `_klumpkey`, `_dish`, `_station`, `_overcooked`, `_ingredients`), schedules itself to run again after 3 seconds if more records remain, or clears the recipe name if the queue is empty. Calls `OnRecipeDirty()` to immediately notify clients.
* **Parameters:** None.

## Events & Listeners
- Listens for `"ms_quagmirerecipediscovered"` (sent to the world) on the **server** — triggers `OnRecipeDiscovered` to queue the recipe.
- Listens for `"recipedirty"` (local network event) on the **client** — triggers `OnRecipeDirty` to process newly synced recipe data.
- Emits `"quagmire_recipediscovered"` (world event) after a recipe is processed — provides full recipe metadata to listeners (e.g., UI).