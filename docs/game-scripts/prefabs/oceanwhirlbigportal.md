---
id: oceanwhirlbigportal
title: Oceanwhirlbigportal
description: Defines the ocean whirlpool migration portal (entry) and the exit pool prefab, handling world migration, visual effects, wave blocking, and loot distribution.
tags: [prefab, migration, ocean, portal, loot]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 508ae961
system_scope: entity
---

# Oceanwhirlbigportal

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`oceanwhirlbigportal.lua` registers two spawnable entities: `oceanwhirlbigportal` (the active whirlpool entry point) and `oceanwhirlbigportalexit` (the destination pool). The entry portal manages world migration between shards (e.g., Master to Caves), applies environmental protections (watery protection), damages boats, and blocks ocean waves when open. The exit pool collects migrated items in an `itemstore` and allows players to rummage for loot. Both prefabs handle client-side visual synchronization via net events and animation layers.

## Usage example
```lua
-- Spawn the entry portal (whirlpool):
local portal = SpawnPrefab("oceanwhirlbigportal")
portal.Transform:SetPosition(0, 0, 0)

-- Spawn the exit pool (loot destination):
local exit_pool = SpawnPrefab("oceanwhirlbigportalexit")
exit_pool.Transform:SetPosition(10, 0, 10)

-- Trigger opening sequence (server only):
if TheWorld.ismastersim then
    portal:OpenWhirlportal()
end
```

## Dependencies & tags
**External dependencies:**
- `TUNING` -- global balance constants for radius, damage, and protection values
- `GetSinkEntityFXPrefabs`, `SinkEntity` -- global utility functions for entity FX and sinking
- `SpawnPrefab` -- instantiates child entities (map icons, FX)
- `CreateEntity` -- standard entity creation

**Components used:**
- `transform`, `animstate`, `soundemitter`, `minimapentity`, `network` -- base entity components
- `updatelooper` -- client-side post-update tasks for animation sync (client only)
- `wateryprotection` -- applies coldness, wetness, and fire protection to entities
- `oceanwhirlportalphysics` -- handles focal pulling and entity collision logic
- `worldmigrator` -- manages shard migration logic
- `pointofinterest` -- dynamically added for scrapbook/POI system (conditionally added via EnablePOI)
- `inspectable`, `pickable`, `lootdropper`, `itemstore` -- exit pool interaction and loot storage

**Tags:**
- `birdblocker` -- prevents birds from landing
- `ignorewalkableplatforms` -- navigation exclusion
- `oceanwhirlportal`, `oceanwhirlbigportal` -- identification for managers
- `NOCLICK` -- prevents direct mouse interaction
- `FX` -- applied to child visual entities
- `pickable_rummage_str` -- exit pool interaction type

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `assets` | table | `{...}` | Animation and sound assets for the whirlpool and exit pool. |
| `prefabs` | table | `{"wave_med", ...}` | Dependent prefabs loaded with the entry portal. |
| `inst.syncanims` | net_event | --- | Network event to trigger animation sync on clients. |
| `inst.animlayers` | table | `nil` | Array of child animation entities (mid, deep layers). Client only. |
| `inst.focalcooldowns` | table | `{}` | Tracks entities currently on migration cooldown. Server only. |
| `inst.openingwhirlportal` | boolean | `nil` | Flag indicating if the portal is currently opening. Server only. |
| `inst.icon` | entity | `nil` | Map icon entity tracking the portal location. Server only. |
| `inst.highlightoverride` | table | `{0.1, 0.1, 0.3}` | Highlight color override for the portal. |
| `inst.scrapbook_inspectonseen` | boolean | `true` | Enables scrapbook inspection on first seen. |
| `inst.scrapbook_thingtype` | string | `"POI"` | Scrapbook classification type. |
| `inst.scrapbook_ignore` | boolean | `true` | Controls scrapbook visibility; set to true when portal is closed (enable=false), set to nil when open (enable=true). Toggled by `EnablePOI()`. |
| `inst.scrapbook_anim` | string | `"open_loop"` / `"big_idle"` | Animation name for scrapbook display. Set to `"open_loop"` for entry portal, `"big_idle"` for exit pool. |
| `inst.OnFocalCooldownEnd` | function | `OnFocalCooldownEnd` | Callback for focal cooldown expiration. Server only. |
| `inst.GiveLoot` | function | `GiveLoot` | Loot distribution method. Exit pool only. |
| `inst.postupdating` | boolean | `nil` | Flag indicating client-side post-update task is active. Client only. |
| `TUNING.OCEANWHIRLBIGPORTAL_RADIUS` | constant | --- | Radius for wave blocking and deployment spacing. |
| `TUNING.OCEANWHIRLBIGPORTAL_BOAT_PERCENT_DAMAGE_PER_TICK` | constant | --- | Damage percentage applied to boats touching the focal point. |
| `TUNING.OCEAN_SHADER.EFFECT_TINT_AMOUNT` | constant | --- | Ocean shader blend parameter for animation layers. |
| `TUNING.OCEANWHIRLPORTAL_EXTINGUISH_HEAT_PERCENT` | constant | --- | Heat extinguish percentage for watery protection. |
| `TUNING.OCEANWHIRLPORTAL_TEMP_REDUCTION` | constant | --- | Temperature reduction applied by watery protection. |
| `TUNING.OCEANWHIRLPORTAL_PROTECTION_TIME` | constant | --- | Duration of wither protection from watery protection. |
| `TUNING.OCEANWHIRLPORTAL_ADD_COLDNESS` | constant | --- | Coldness value added by watery protection. |
| `TUNING.OCEANWHIRLPORTAL_ADD_WETNESS` | constant | --- | Wetness value added by watery protection. |
| `TUNING.OCEANWHIRLBIGPORTAL_FOCALRADIUS` | constant | --- | Focal radius for oceanwhirlportalphysics component. |
| `TUNING.OCEANWHIRLBIGPORTAL_PULLSTRENGTH` | constant | --- | Pull strength for oceanwhirlportalphysics component. |
| `TUNING.OCEANWHIRLBIGPORTAL_RADIALSTRENGTH` | constant | --- | Radial strength for oceanwhirlportalphysics component. |
| `TUNING.OCEANWHILRBIGPORTALEXIT_ITEMS_TO_MAKE_BIG` | constant | --- | Item count threshold for big animation state on exit pool. |
| `TUNING.OCEANWHILRBIGPORTALEXIT_LOOT_PER_PICK` | constant | --- | Number of items retrieved per pick action on exit pool. |
| `FLOTSAM_SIZES` | table (local) | `{[1]="empty", [2]="small", [3]="big"}` | Maps item count index to animation name strings for exit pool visual states. |

## Main functions
### `fn()`
*   **Description:** Constructor for the `oceanwhirlbigportal` prefab. Sets up base components (anim, sound, minimap), adds tags, and initializes network variables. Branches into client-only or server-only logic based on `TheWorld.ismastersim`.
*   **Parameters:** None
*   **Returns:** `inst` -- entity instance
*   **Error states:** None — CreateEntity() either succeeds or crashes; no recoverable error path exists.

### `fn_exit()`
*   **Description:** Constructor for the `oceanwhirlbigportalexit` prefab. Sets up visual FX (waterfall, mist), interaction components (`pickable`, `itemstore`), and migration target settings (shard "Master").
*   **Parameters:** None
*   **Returns:** `inst` -- entity instance
*   **Error states:** None — CreateEntity() either succeeds or crashes; no recoverable error path exists.

### `OpenWhirlportal(inst)`
*   **Description:** Initiates the opening sequence. Plays pre-open animation and sound, listens for `animover` to finalize, and enables map icon/POI. Idempotent; checks `inst.openingwhirlportal` flag to prevent re-triggering.
*   **Parameters:** `inst` -- portal entity
*   **Returns:** None
*   **Error states:** Server-only function. Does not exist on client instances.

### `OpenWhirlportal_finalize(inst)`
*   **Description:** Finalizes the opening sequence after animation completes. Starts looping open animation, plays loop sound, enables physics and map icon, and registers POI. Removes `animover` listener.
*   **Parameters:** `inst` -- portal entity
*   **Returns:** None
*   **Error states:** Server-only function. Does not exist on client instances.

### `CloseWhirlportal(inst)`
*   **Description:** Initiates the closing sequence. Stops loop sound, plays post-close animation, disables physics and map icon, and removes POI. Cleans up `animover` listener if opening was interrupted.
*   **Parameters:** `inst` -- portal entity
*   **Returns:** None
*   **Error states:** Server-only function. Does not exist on client instances.

### `SplashWhirlportal(inst, data)`
*   **Description:** Spawns visual FX at the position of the migrating entity (doer). Called when `migration_activate` event fires. Extracts doer from data table and spawns sink FX prefabs.
*   **Parameters:**
    - `inst` -- portal entity
    - `data` -- event data table containing `doer` entity
*   **Returns:** None
*   **Error states:** None — SpawnPrefab either succeeds or crashes; no recoverable nil return path exists.

### `OnEntityTouchingFocalFn(inst, ent)`
*   **Description:** Callback for `oceanwhirlportalphysics` when an entity touches the focal point. Applies watery protection. Attempts migration via `worldmigrator`. If migration fails, damages boats or sinks other entities. Sets a 3-second cooldown on successful migration.
*   **Parameters:**
    - `inst` -- portal entity
    - `ent` -- touching entity
*   **Returns:** None
*   **Error states:** Errors if `ent` lacks SoundEmitter component (no nil guard before `ent.SoundEmitter:PlaySoundWithParams` access in boat damage branch). `ent.components.health` and `ent.components.inventoryitem` accesses are guarded.

### `onpickedfn(inst, picker, loot)`
*   **Description:** Callback for `pickable` component on the exit pool. Retrieves items from `itemstore`, updates animation based on remaining count, and distributes loot to the picker via `GiveLoot`.
*   **Parameters:**
    - `inst` -- exit pool entity
    - `picker` -- player entity
    - `loot` -- unused parameter (items come from itemstore)
*   **Returns:** None
*   **Error states:** Server-only function. Does not exist on client instances. Errors if picker lacks inventory component (no nil guard before picker.components.inventory access).

### `GetAnimIndex(inst)` (local)
*   **Description:** Returns animation index (1/2/3) based on item count in `itemstore`. Index 1 = empty, 2 = small (items > 0), 3 = big (items >= TUNING.OCEANWHILRBIGPORTALEXIT_ITEMS_TO_MAKE_BIG).
*   **Parameters:** `inst` -- exit pool entity
*   **Returns:** integer 1-3
*   **Error states:** None

### `GetAnim(inst)` (local)
*   **Description:** Returns animation name string ('empty', 'small', or 'big') based on item count by calling `GetAnimIndex` and mapping to `FLOTSAM_SIZES` table.
*   **Parameters:** `inst` -- exit pool entity
*   **Returns:** string
*   **Error states:** None

### `OnItemStoreChangedCount(inst)`
*   **Description:** Updates exit pool animation and `pickable` interaction state based on the number of items in `itemstore`. Disables interaction if empty.
*   **Parameters:** `inst` -- exit pool entity
*   **Returns:** None
*   **Error states:** Server-only function. Does not exist on client instances.

### `OnSyncAnims(inst)`
*   **Description:** Initiates client-side animation synchronization by setting `inst.postupdating` flag and adding `PostUpdate_Client` to the `updatelooper` component. Triggered by `oceanwhirlbigportal.syncanims` net event.
*   **Parameters:** `inst` -- portal entity
*   **Returns:** None
*   **Error states:** Client-only; `updatelooper` component exists on client instances.

### `PostUpdate_Client(inst)` (local)
*   **Description:** **Task Callback.** Runs every frame on clients while `inst.postupdating` is true. Syncs animation state across all animation layers based on current animation name (`closed`, `open_pst`, `open_loop`, `open_pre`). Toggles wave blocker status. Removes itself from `updatelooper` upon completion.
*   **Parameters:** `inst` -- portal entity
*   **Returns:** None
*   **Error states:** Asserts false if animation state is unrecognized (closed/open_pst/open_loop/open_pre). The updatelooper access is safe — task only registered when component exists.

### `OnRemove_Client(inst)` (local)
*   **Description:** Event listener callback triggered on `onremove` event. Unregisters the portal as a wave blocker with `TheWorld.components.wavemanager` during entity cleanup.
*   **Parameters:** `inst` -- portal entity
*   **Returns:** None
*   **Error states:** Errors if TheWorld.components.wavemanager is nil (no nil guard before access).

### `CheckToggleWaveBlocker(inst)` (local)
*   **Description:** Registers or unregisters the portal as a wave blocker with `TheWorld.components.wavemanager` based on visibility (animation state) and sleep status.
*   **Parameters:** `inst` -- portal entity
*   **Returns:** None
*   **Error states:** None

### `GiveLoot(inst, picker, item)`
*   **Description:** Delivers an item to the picker. If picker's inventory is open, places item directly; otherwise flings item via `lootdropper`.
*   **Parameters:**
    - `inst` -- exit pool entity
    - `picker` -- player entity
    - `item` -- item entity
*   **Returns:** None
*   **Error states:** Errors if picker lacks inventory component (no nil guard before `picker.components.inventory:IsOpenedBy`). `inst.components.lootdropper` access assumes component exists (added unconditionally in fn_exit()).

### `OnRemoveEntity(inst)`
*   **Description:** Assigned to `inst.OnRemoveEntity` on server side. Cleans up sound emitter by killing the "wave" sound on entity removal.
*   **Parameters:** `inst` -- portal entity
*   **Returns:** None
*   **Error states:** None

### `OnFocalCooldownEnd(inst, ent)`
*   **Description:** Clears entity from `focalcooldowns` table after 3-second migration cooldown expires. Called as callback for `DoTaskInTime` scheduled in `OnEntityTouchingFocalFn`.
*   **Parameters:**
    - `inst` -- portal entity
    - `ent` -- entity that completed cooldown
*   **Returns:** None
*   **Error states:** Server-only function.

### `initclientfx(inst)` (local)
*   **Description:** **Task Callback.** Spawns client-side visual FX (waterfall, mist, flotsam) parented to the exit pool. Registers the pool with the grotto sound system via `ms_registergrottopool`.
*   **Parameters:** `inst` -- exit pool entity
*   **Returns:** None
*   **Error states:** None.

### `makewaterfall(proxy)` (local)
*   **Description:** Creates a non-networked FX entity displaying the waterfall animation, parented to the exit pool proxy. Listens for proxy removal to clean up.
*   **Parameters:** `proxy` -- exit pool entity proxy
*   **Returns:** FX entity instance, or `nil` if proxy is nil
*   **Error states:** None -- proxy nil check present at function start.

### `makebigmist(proxy)` (local)
*   **Description:** Creates a non-networked FX entity displaying steam/mist animation, parented to the exit pool proxy with vertical offset. Listens for proxy removal to clean up.
*   **Parameters:** `proxy` -- exit pool entity proxy
*   **Returns:** FX entity instance, or `nil` if proxy is nil
*   **Error states:** None -- proxy nil check present at function start.

### `makeflotsam_pool(proxy)` (local)
*   **Description:** Creates a non-networked FX entity displaying the flotsam puddle animation on ground layer, parented to the exit pool proxy. Listens for proxy removal to clean up.
*   **Parameters:** `proxy` -- exit pool entity proxy
*   **Returns:** FX entity instance, or `nil` if proxy is nil
*   **Error states:** None -- proxy nil check present at function start.

### `EnablePOI(inst, enable)` (local)
*   **Description:** Toggles the `pointofinterest` component and `scrapbook_ignore` flag. Adds component if enabling and missing; removes if disabling.
*   **Parameters:**
    - `inst` -- entity
    - `enable` -- boolean
*   **Returns:** None
*   **Error states:** None

### `AddAnimLayer(inst, layer, height)` (local)
*   **Description:** Creates a child FX entity with AnimState for a specific ocean layer (mid or deep). Sets up transform, animstate, build/bank, layer sorting, and ocean blend params. Hides the opposite layer based on input.
*   **Parameters:**
    - `inst` -- parent portal entity
    - `layer` -- string layer name ("mid" or "deep")
    - `height` -- number vertical offset position
*   **Returns:** FX entity instance
*   **Error states:** None -- all components added within function with no external dependencies.

### `EnableMapIcon(inst, enable)` (local)
*   **Description:** Toggles minimap entity visibility. Spawns or removes a `globalmapiconunderfog` child entity to track the portal on the map.
*   **Parameters:**
    - `inst` -- entity
    - `enable` -- boolean
*   **Returns:** None
*   **Error states:** Errors if inst.MiniMapEntity is nil (no nil guard before inst.MiniMapEntity:SetEnabled access).

### `DoSyncPlayAnim(inst, anim, loop)` (local)
*   **Description:** Iterates over `inst.animlayers` table and calls `PlayAnimation` on each layer's AnimState. Used to synchronize animation playback across all visual layers.
*   **Parameters:**
    - `inst` -- portal entity
    - `anim` -- string animation name
    - `loop` -- boolean whether to loop
*   **Returns:** None
*   **Error states:** Client-only; errors if `inst.animlayers` is nil (not present on dedicated server).

### `DoSyncPushAnim(inst, anim, loop)` (local)
*   **Description:** Iterates over `inst.animlayers` table and calls `PushAnimation` on each layer's AnimState. Used to queue animation after current completes across all visual layers.
*   **Parameters:**
    - `inst` -- portal entity
    - `anim` -- string animation name
    - `loop` -- boolean whether to loop
*   **Returns:** None
*   **Error states:** Client-only; errors if `inst.animlayers` is nil (not present on dedicated server).

### `DoSyncAnimTime(inst, t)` (local)
*   **Description:** Iterates over `inst.animlayers` table and calls `SetTime` on each layer's AnimState. Used to synchronize animation time across all visual layers.
*   **Parameters:**
    - `inst` -- portal entity
    - `t` -- number animation time value
*   **Returns:** None
*   **Error states:** Client-only; errors if `inst.animlayers` is nil (not present on dedicated server).

## Events & listeners
- **Listens to:** `onremove` -- triggers `OnRemove_Client` to unregister wave blocker (client).
- **Listens to:** `entitywake`, `entitysleep` -- triggers `CheckToggleWaveBlocker` to update wave blocking status.
- **Listens to:** `oceanwhirlbigportal.syncanims` -- triggers `OnSyncAnims` to start client-side animation sync task (client).
- **Listens to:** `migration_available` -- triggers `OpenWhirlportal`.
- **Listens to:** `migration_unavailable`, `migration_full` -- triggers `CloseWhirlportal`.
- **Listens to:** `migration_activate` -- triggers `SplashWhirlportal` (spawn FX).
- **Listens to:** `animover` -- triggers `OpenWhirlportal_finalize` during opening sequence.
- **Listens to:** `itemstore_changedcount` -- triggers `OnItemStoreChangedCount` (exit pool).
- **Pushes:** `ms_registergrottopool` -- to `TheWorld` during `initclientfx` (exit pool).
- **Pushes:** `migration_activate` -- via `worldmigrator` component when entity migrates.