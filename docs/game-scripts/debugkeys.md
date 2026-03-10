---
id: debugkeys
title: Debugkeys
description: Provides debug key bindings and mouse input handlers to control game state, spawn entities, inspect systems, and manipulate entities/components for development and testing.
tags: [debug, input, console, tools]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 7d678f15
system_scope: player
---

# Debugkeys

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `debugkeys` module implements a central debug input system for Don't Starve Together. It registers keyboard and mouse handlers that modify game state, spawn or remove entities, manipulate components (e.g., health, sanity, growth), inspect tile data, trigger world events, and support development workflows like reloading scripts and teleports. These debug commands are only active during development or modded environments and are not intended for production play. The system uses both global and game-contextual key handlers, with support for modifier keys (CTRL, SHIFT, ALT) to vary behavior, and correctly routes actions across client and master simulation.

## Usage example
```lua
-- Register a new debug key to toggle player godmode
AddGameDebugKey("G", function()
    local player = ThePlayer
    if player and player.components.health then
        player.components.health.isgodmode = not player.components.health.isgodmode
        print("Godmode: " .. tostring(player.components.health.isgodmode))
    end
end, true)

-- Trigger a debug right-click to spawn selected entity at mouse position
DebugRMB(TheInput:GetWorldPosition())

-- Force reload debug scripts for live iteration
DoReload()
```

## Dependencies & tags
**Components used:**
- `cooldown` (`LongUpdate`, `cooldown_duration`)
- `domesticatable` (`BecomeDomesticated`, `BecomeFeral`, `IsDomesticated`, `tendencies`)
- `farming_manager` (`AddTileNutrients`, `GetTileNutrients`)
- `fueled` (`SetPercent`)
- `growable` (`DoGrowth`)
- `harvestable` (`Grow`)
- `health` (`DoDelta`, `Kill`, `maxhealth`)
- `herd` (`members`)
- `herdmember` (`herd`)
- `hounded` (`ForceNextWave`)
- `hunger` (`DoDelta`)
- `inventory` (`DropEverything`, `Equip`)
- `inventoryitem` (`SetLanded`)
- `knownlocations` (`GetLocation`)
- `locomotor` (no methods used)
- `mood` (`SetIsInMood`)
- `periodicspawner` (`TrySpawn`)
- `perishable` (`Perish`)
- `pickable` (`Pick`, `Regen`)
- `pinnable` (`Stick`, `Unstick`, `IsStuck`)
- `sanity` (`DoDelta`, `SetPercent`)
- `setter` (`SetSetTime`, `StartSetting`)
- `skilltreeupdater` (no methods used)
- `temperature` (`DoDelta`)
- `walkableplatform` (no methods used)

**Tags:**
- `player`
- `boatbumper`
- `FX`
- `NOCLICK`
- `DECOR`
- `INLIMBO`
- `_inventoryitem`
- `Chester_Eyebone`
- `withered`
- `wall`
- `withered`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `self.inst` | `entity` | N/A | The entity instance that owns this component (here, the debug module itself is not a standard component; `self` refers to the debug keys module). |
| `CAN_USE_DBUI` | `boolean` | N/A | Conditional flag used to enable DBUI-based debug panels. |
| `TheInput` | `TheInput` | N/A | Global input system used for key/mouse state. |
| `ThePlayer` | `player entity` | N/A | The local player entity when in-game. |
| `TheWorld` | `World` | N/A | The global world instance. |
| `TheSim` | `TheSim` | N/A | Global simulation control object. |
| `TheFrontEnd` | `FrontEnd` | N/A | Frontend UI state manager. |

## Main functions
### `dumpvariabletostr(var)`
* **Description:** Converts any Lua variable to a human-readable string suitable for debugging output (e.g., console, log). Handles `nil`, `boolean`, `number`, `string`, `table`, `function`, and `userdata` types.
* **Parameters:** `var` — any Lua value.
* **Returns:** `string` — formatted representation of `var`.

### `d_c_spawn(prefab, count, dontselect)`
* **Description:** Spawns `count` instances of the given `prefab`. Handles client–server replication: dispatches remotely if not on master simulation; otherwise calls `c_spawn` directly.
* **Parameters:**  
  - `prefab` — string, name of the prefab to spawn.  
  - `count` — number, number of instances.  
  - `dontselect` — boolean, if `true`, do not auto-select the first spawned entity.  
* **Returns:** `nil`.

### `d_c_give(prefab, count, dontselect)`
* **Description:** Gives `count` instances of `prefab` to the player (via `c_give`). Handles client–server replication similar to `d_c_spawn`.
* **Parameters:** Same as `d_c_spawn`.
* **Returns:** `nil`.

### `d_c_remove(entity)`
* **Description:** Removes a single entity: the one under the mouse cursor if `entity` is omitted; otherwise removes the provided `entity`. Replicated across networks if needed.
* **Parameters:** `entity` — optional entity to remove.
* **Returns:** `nil`.

### `d_c_removeall(entity)`
* **Description:** Removes all entities matching the prefab of `entity` (or the mouse entity if omitted), useful for clearing clutter.
* **Parameters:** `entity` — optional entity to define the prefab to remove.
* **Returns:** `nil`.

### `DebugKeyPlayer()`
* **Description:** Returns the player entity used for debug key actions, but only on master simulation. Otherwise returns `nil`.
* **Parameters:** None.
* **Returns:** `player entity` or `nil`.

### `DoDebugKey(key, down)`
* **Description:** Invokes registered handlers for the given `key`, passing whether the event is key-down or key-up.
* **Parameters:**  
  - `key` — string, identifier for the key.  
  - `down` — boolean, `true` for key press, `false` for release.  
* **Returns:** `true` if any handler returns `true`; otherwise `nil`.

### `AddGameDebugKey(key, fn, down)`
* **Description:** Registers a debug handler that only executes when `inGamePlay` is `true`. Commonly used for gameplay-specific debug features.
* **Parameters:**  
  - `key` — string, key identifier.  
  - `fn` — function, callback executed when `key` is pressed/released.  
  - `down` — boolean (default `true`), whether to trigger on key down (`true`) or key up (`false`).  
* **Returns:** `nil`.

### `AddGlobalDebugKey(key, fn, down)`
* **Description:** Registers a debug handler that runs regardless of current game state (e.g., menu, loading, gameplay).
* **Parameters:** Same as `AddGameDebugKey`, but no `inGamePlay` check is enforced.
* **Returns:** `nil`.

### `SimBreakPoint()`
* **Description:** Toggles debug pause mode on or off. Only toggles if not already paused.
* **Parameters:** None.
* **Returns:** `nil`.

### `DoReload()`
* **Description:** Forces a reload of `scripts/reload.lua` by removing it from `package.loaded` and re-`require`-ing. Enables hot-reloading development scripts.
* **Parameters:** None.
* **Returns:** `nil`.

### `BindKeys(bindings)`
* **Description:** Registers multiple debug key bindings at once. Each binding must contain `binding` (e.g., `"G"` or `"GALT"`), `name`, and `fn`. Checks modifier keys before calling the handler.
* **Parameters:** `bindings` — array of binding objects.
* **Returns:** `nil`.

### `try_boat_teleport(boat, x, y, z)`
* **Description:** Teleports a boat and all attached players/items to new world coordinates. Snaps player cameras to the boat and moves entities using `Vector3`.
* **Parameters:**  
  - `boat` — entity, the boat to teleport.  
  - `x`, `y`, `z` — numbers, target world coordinates.  
* **Returns:** `true` on success; `false` otherwise.

### `d_addemotekeys()`
* **Description:** Registers Numpad key bindings (e.g., `KEY_KP1`–`KEY_KP0`) for emote commands by invoking `UserCommands.RunUserCommand`.
* **Parameters:** None.
* **Returns:** `nil`.

### `d_gettiles()`
* **Description:** Iterates over an 11×11 grid centered on the player, finds all `WORLD_TILES.FARMING_SOIL` tiles, and logs their world coordinates using `dumptable`.
* **Parameters:** None.
* **Returns:** `nil`.

### `DebugRMB(x, y)`
* **Description:** Handles debug right-click: depending on modifiers and selection state, may spawn, remove, or teleport entities, compute distance/angle, or set a debug entity.
* **Parameters:**  
  - `x`, `y` — numbers, world coordinates from `TheInput:GetWorldPosition()`.  
* **Returns:** `nil`.

### `DebugLMB(x, y)`
* **Description:** On left-click during debug pause, sets the selected debug entity to the entity under the mouse.
* **Parameters:** Same as `DebugRMB`.
* **Returns:** `nil`.

### `DoDebugMouse(button, down, x, y)`
* **Description:** Entry point for debug mouse handling. Routes to `DebugRMB` or `DebugLMB` only when `down` is `true`.
* **Parameters:**  
  - `button` — `MOUSEBUTTON_RIGHT` or `MOUSEBUTTON_LEFT`.  
  - `down` — boolean, only processes when `true`.  
  - `x`, `y` — numbers, world coordinates.  
* **Returns:** `false` if `not down`; otherwise result of handler.

## Events & listeners
- **Pushes `"domesticated"`** — by `Domesticatable:BecomeDomesticated()`.
- **Pushes `"healthdelta"`** — by `Health:DoDelta()` and `Health:Kill()`.
- **Pushes `"perished"`** — by `Perishable:Perish()`.
- **Pushes `"picked"`** — by `Pickable:Pick()`.
- **Pushes `"sanitydelta"`** — by `Sanity:DoDelta()`.
- **Pushes `"goinsane"` / `"gosane"` / `"goenlightened"`** — by `Sanity:DoDelta()` on state change.
- **Pushes `"on_no_longer_landed"` / `"on_landed"`** — by `InventoryItem:SetLanded()` on landing state change.
- **World events** (via `TheWorld:PushEvent` in debug handlers):
  - `"ms_nextnightmarephase"`
  - `"ms_nextphase"`
  - `"ms_advanceseason"`
  - `"ms_retreatseason"`
  - `"ms_deltawetness"`
  - `"ms_deltamoisture"`
  - `"ms_setsnowlevel"`
  - `"ms_sendlightningstrike"`
  - `"ms_setseasonlength"`
  - `"spawnnewboatleak"`
  - `"boatcollision"`