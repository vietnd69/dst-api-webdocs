---
id: telebase_gemsocket
title: Telebase Gemsocket
description: Manages the interaction logic for a telebase socket that accepts a purple gem, transitioning between trading and picking states with associated visual and audio feedback.
tags: [trading, picking, socket, gem, telebase]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 6ac5c8d3
system_scope: entity
---

# Telebase Gemsocket

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `telebase_gemsocket` prefab implements a socket for the Telebase structure that accepts a specific gem (purplegem) and manages state transitions between an empty (trading enabled) and gem-filled (picking enabled) state. It integrates with the `trader`, `pickable`, `hauntable`, and `inspectable` components to handle item exchange, harvest state, haunt behavior, and status reporting. The socket uses sound effects and animation state changes to provide visual and auditory feedback during state transitions.

## Usage example
```lua
-- This prefab is created automatically by the Telebase's socket logic.
-- Typical usage involves interacting with it via the Trader and Pickable components:

-- Place a purplegem into the socket (e.g., via player interaction)
local gem = TheWorld:GetEntityFromGuid(gem_guid)
local socket = TheWorld:GetEntityFromGuid(socket_guid)
if socket ~= nil and socket.components.trader ~= nil and socket.components.pickable ~= nil then
    socket.components.trader:OnAccept(gem, player) -- triggers OnGemGiven
end

-- Remove the gem from the socket (e.g., via player pick action)
socket.components.pickable:Pick() -- triggers OnGemTaken
```

## Dependencies & tags
**Components used:** `trader`, `pickable`, `hauntable`, `inspectable`
**Tags:** Adds `gemsocket` and `trader` tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `DestroyGemFn` | function | `DestroyGem` | Callback function used to destroy/replace the gem socket (typically after a haunt). |

## Main functions
### `OnGemGiven(inst, giver, item)`
* **Description:** Invoked when a purplegem is successfully traded to the socket. Disables trading, enables picking, updates animations, and plays sounds.
* **Parameters:** 
  * `inst` (Entity) - The socket entity.
  * `giver` (Entity) - The entity that placed the gem (player).
  * `item` (Entity) - The gem entity (must be `"purplegem"`).
* **Returns:** Nothing.
* **Error states:** No failure path; precondition is `ItemTradeTest` returning `true`.

### `OnGemTaken(inst)`
* **Description:** Invoked when the gem is picked (harvested) from the socket. Re-enables trading, disables picking, and updates animations.
* **Parameters:** `inst` (Entity) - The socket entity.
* **Returns:** Nothing.

### `ShatterGem(inst)`
* **Description:** Plays the shatter animation and sound for the gem. Called after a delay when destroying a gem (e.g., after a haunt).
* **Parameters:** `inst` (Entity) - The socket entity.
* **Returns:** Nothing.

### `DestroyGem(inst)`
* **Description:** Sets up delayed destruction of the gem socket after a haunt. Re-enables trading and disables picking, then calls `ShatterGem` after a short delay.
* **Parameters:** `inst` (Entity) - The socket entity.
* **Returns:** Nothing.

### `getstatus(inst)`
* **Description:** Returns a status string for the inspectable UI: `"VALID"` if a gem is present and pickable, `"GEMS"` if the socket is empty and accepting gems.
* **Parameters:** `inst` (Entity) - The socket entity.
* **Returns:** `"VALID"` or `"Gems"` (string).

### `onhaunt(inst)`
* **Description:** Determines whether the socket should be haunted (currently disabled in active code). If uncommented, could destroy the socket with small probability.
* **Parameters:** `inst` (Entity) - The socket entity.
* **Returns:** `false` (no haunt occurs in current code).

### `OnLoad(inst, data)`
* **Description:** Restore state after loading from save. Calls `OnGemGiven` or `OnGemTaken` based on the pickable state stored in `caninteractwith`.
* **Parameters:** 
  * `inst` (Entity) - The socket entity.
  * `data` (table) - Saved state data (unused directly; state inferred from `caninteractwith`).
* **Returns:** Nothing.

### `ItemTradeTest(inst, item)`
* **Description:** Validates trade attempts. Returns `true` only for `"purplegem"`; otherwise returns `false` with a reason string.
* **Parameters:** 
  * `inst` (Entity) - The socket entity (unused in this test).
  * `item` (Entity or nil) - The item to be traded.
* **Returns:** 
  * `true` if `item` is `"purplegem"`.
  * `false`, `"NOTGEM"` if `item.prefab` does not end with `"gem"`.
  * `false`, `"WRONGGEM"` if `item.prefab` ends with `"gem"` but is not `"purplegem"`.

## Events & listeners
- **Listens to:** None directly via `inst:ListenForEvent` — state changes are handled through component callbacks (`trader.onaccept`, `pickable.onpickedfn`) and `OnLoad`.
- **Pushes:** None explicitly (does not call `inst:PushEvent`).