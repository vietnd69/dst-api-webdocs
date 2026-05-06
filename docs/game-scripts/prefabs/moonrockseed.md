---
id: moonrockseed
title: Moonrockseed
description: Celestial orb prefab that functions as a portable prototyper with light effects, inventory tracking, and minimap icon integration.
tags: [prefab, celestial, prototyper, inventory]
sidebar_position: 10

last_updated: 2026-04-27
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 568c23f8
system_scope: entity
---

# Moonrockseed

> Based on game build **722832** | Last updated: 2026-04-27

## Overview
`moonrockseed.lua` registers two spawnable entities: the main celestial orb (`moonrockseed`) and its minimap icon (`moonrockseed_icon`). The orb functions as a portable prototyper with dynamic light effects that fade based on activation state. It tracks inventory ownership, plays ambient sounds when active, and spawns visual FX on activation. The prefab is referenced by name `"moonrockseed"` and instantiated with `SpawnPrefab("moonrockseed")`.

## Usage example
```lua
-- Spawn the moonrockseed at world origin:
local inst = SpawnPrefab("moonrockseed")
inst.Transform:SetPosition(0, 0, 0)

-- Reference assets at load time:
local assets = {
    Asset("ANIM", "anim/moonrock_seed.zip"),
}

-- Upgrade the orb (server-only):
if TheWorld.ismastersim then
    inst:DoUpgrade()
end
```

## Dependencies & tags
**External dependencies:**
- `easing` -- animation easing functions for blink effect

**Components used:**
- `inspectable` -- allows players to examine the entity
- `inventoryitem` -- enables carrying in inventory, with nobounce and sink behavior
- `prototyper` -- provides crafting station functionality with onturnon/onturnoff/onactivate hooks
- `light` -- dynamic light source with fade effects
- `soundemitter` -- plays ambient and activation sounds
- `minimapentity` -- icon entity displays on minimap

**Tags:**
- `irreplaceable` -- added in fn() to prevent replacement
- `nonpotatable` -- added in fn() to prevent drinking
- `celestial_station` -- added in fn() for celestial-related targeting
- `FX` -- added to spawned FX entities
- `CLASSIFIED` -- added to icon entity to hide from certain queries

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `assets` | table | --- | Array of `Asset(...)` entries for moonrockseed animation files. |
| `assets_icon` | table | --- | Array of `Asset(...)` entries for minimap icon image. |
| `prefabs` | table | `{"moonrockseed_icon"}` | Dependent prefab names loaded with moonrockseed. |
| `prefabs_icon` | table | `{"globalmapicon"}` | Dependent prefab names loaded with moonrockseed_icon. |
| `UPGRADED_LIGHT_RADIUS` | constant (local) | `2.5` | Maximum light radius when orb is upgraded. |
| `_tasks` | table | `{}` | Stores scheduled task references for drop sounds and light updates. |
| `_light` | number | `0` | Current light override value (0 to 1). |
| `_targetlight` | number | `0` | Target light value for fading interpolation. |
| `_owner` | entity | `nil` | Current owner entity (player or container grand owner). |
| `_container` | entity | `nil` | Container entity holding this item. |
| `_upgraded` | boolean | `false` | Whether the orb has been upgraded to MOONORB_UPGRADED tier. |
| `_fx` | net_event | --- | Networked event trigger for spawning FX entities. |
| `icon` | entity | `nil` | Reference to spawned minimap icon entity. |
| `_blinktask` | task | `nil` | Periodic task reference for blink animation effect. |

## Main functions
### `fn()`
* **Description:** Client-side prefab constructor for the main moonrockseed entity. Creates the entity, builds physics, attaches AnimState/SoundEmitter/Light components, sets default animation, and adds tags. On master sim, attaches gameplay components (inspectable, inventoryitem, prototyper), sets up event listeners for inventory tracking, and initializes instance variables. Client-side returns pristine entity early; master-side continues with full component initialization and callback setup. Returns inst for prefab framework registration.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** None — runs on every host (client and server).

### `iconfn()`
* **Description:** Client-side prefab constructor for the minimap icon entity. Creates a classified entity with MiniMapEntity component, sets icon image and priority, and tracks the parent moonrockseed entity. Server-side initialization spawns the `globalmapicon` prefab and sets up tracking. Returns `inst` for framework handling.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** None — runs on every host (client and server).

### `updatelight(inst)` (local)
* **Description:** **Periodic task callback.** Interpolates `_light` toward `_targetlight` using fixed step values (+0.04 when increasing, -0.02 when decreasing). Updates AnimState light override and Light radius proportionally. Cancels the task when `_light` reaches `_targetlight`.
* **Parameters:** `inst` -- moonrockseed entity instance
* **Returns:** None
* **Error states:** None — task reference is only cancelled when the condition confirms it exists.

### `fadelight(inst, target, instant)` (local)
* **Description:** Sets target light value and schedules fade animation. If `instant` is true, immediately sets light values and cancels any existing task. If `instant` is false and no task exists, starts periodic `updatelight` task. Cancels existing task if target equals current light.
* **Parameters:**
  - `inst` -- moonrockseed entity instance
  - `target` -- target light value (0 to 1)
  - `instant` -- boolean to skip interpolation
* **Returns:** None
* **Error states:** None — all task references are nil-checked before cancellation.

### `cancelblink(inst)` (local)
* **Description:** Cancels any active blink animation task and clears `_blinktask` reference.
* **Parameters:** `inst` -- moonrockseed entity instance
* **Returns:** None
* **Error states:** None — task reference is nil-checked before cancellation.

### `updateblink(inst, data)` (local)
* **Description:** **Periodic task callback.** Applies easing function to blink alpha value and sets AnimState add colour. Decrements `data.blink` by 0.05 per frame until reaching 0, then cancels the task.
* **Parameters:**
  - `inst` -- moonrockseed entity instance
  - `data` -- table with `blink` field (0 to 1)
* **Returns:** None
* **Error states:** None — blink task is initialized in blink() before updateblink is called, and cancellation is guarded by data.blink > 0 check.

### `blink(inst)` (local)
* **Description:** Initiates blink animation effect by creating blink data table and starting periodic `updateblink` task. Immediately calls `updateblink` once for instant visual feedback.
* **Parameters:** `inst` -- moonrockseed entity instance
* **Returns:** None
* **Error states:** None — cancels existing blink task before creating new one.

### `dodropsound(inst, taskid, volume)` (local)
* **Description:** **Task callback.** Plays drop sound at specified volume and removes task reference from `_tasks` table.
* **Parameters:**
  - `inst` -- moonrockseed entity instance
  - `taskid` -- integer key in `_tasks` table
  - `volume` -- sound volume multiplier
* **Returns:** None
* **Error states:** None — task reference is cleared after sound plays.

### `canceldropsounds(inst)` (local)
* **Description:** Cancels all scheduled drop sound tasks by iterating through `_tasks` table and clearing entries.
* **Parameters:** `inst` -- moonrockseed entity instance
* **Returns:** None
* **Error states:** None — uses `next()` iterator which handles empty tables gracefully.

### `scheduledropsounds(inst)` (local)
* **Description:** Schedules three drop sound effects at 6, 13, and 18 frames with decreasing volumes (1.0, 0.5, 0.15).
* **Parameters:** `inst` -- moonrockseed entity instance
* **Returns:** None
* **Error states:** None — task references stored in `_tasks` table.

### `onturnon(inst)` (local)
* **Description:** Prototyper turn-on handler. Cancels drop sounds, plays proximity animations, enables light if upgraded, and starts light fade to 0.15. Plays ambient idle sound if not already playing.
* **Parameters:** `inst` -- moonrockseed entity instance
* **Returns:** None
* **Error states:** None — SoundEmitter component is guaranteed by fn() setup (inst.entity:AddSoundEmitter()).

### `onturnoff(inst)` (local)
* **Description:** Prototyper turn-off handler. Cancels drop sounds, kills idle sound, disables light. If not held in inventory, plays proximity post animation and schedules drop sounds. If held, plays idle animation and instantly fades light to 0.
* **Parameters:** `inst` -- moonrockseed entity instance
* **Returns:** None
* **Error states:** None — inventoryitem component is guaranteed by fn() setup (inst:AddComponent("inventoryitem")).

### `onactivate(inst)` (local)
* **Description:** Prototyper activate handler. Triggers blink effect, plays activation sound, and pushes FX network event to spawn visual effects.
* **Parameters:** `inst` -- moonrockseed entity instance
* **Returns:** None
* **Error states:** None — _fx net_event is initialized in fn() before mastersim branch and exists on all hosts.

### `storeincontainer(inst, container)` (local)
* **Description:** Stores container reference and listens for container events (onputininventory, ondropped, onremove) to track ownership changes.
* **Parameters:**
  - `inst` -- moonrockseed entity instance
  - `container` -- container entity or nil
* **Returns:** None
* **Error states:** None — container and container.components.container are both nil-checked before access.

### `unstore(inst)` (local)
* **Description:** Removes event listeners from stored container and clears `_container` reference.
* **Parameters:** `inst` -- moonrockseed entity instance
* **Returns:** None
* **Error states:** None — container reference is nil-checked before removing listeners.

### `tostore(inst, owner)` (local)
* **Description:** Updates container and owner tracking. Resolves grand owner if owner has inventoryitem component. Updates icon entity parent to follow owner.
* **Parameters:**
  - `inst` -- moonrockseed entity instance
  - `owner` -- owner entity or container
* **Returns:** None
* **Error states:** None — owner.components.inventoryitem is nil-checked before GetGrandOwner() call; nil return from GetGrandOwner() is expected behavior, not a crash.

### `topocket(inst, owner)` (local)
* **Description:** Handles item being placed in inventory. Cancels blink, turns off prototyper, and updates owner/container tracking.
* **Parameters:**
  - `inst` -- moonrockseed entity instance
  - `owner` -- player entity holding the item
* **Returns:** None
* **Error states:** None — calls local helpers that perform nil checks.

### `toground(inst)` (local)
* **Description:** Handles item being dropped on ground. Turns on prototyper if active, unstores container reference, clears owner, and resets icon parent to self.
* **Parameters:** `inst` -- moonrockseed entity instance
* **Returns:** None
* **Error states:** None — prototyper component is guaranteed by fn() setup (inst:AddComponent("prototyper")).

### `OnFX(inst)` (local)
* **Description:** Spawns non-networked FX entity that plays "use" animation and self-removes on animation complete. Only spawns if entity is not in limbo.
* **Parameters:** `inst` -- moonrockseed entity instance
* **Returns:** None
* **Error states:** None — guarded by `HasTag("INLIMBO")` check before spawning.

### `OnSpawned(inst)`
* **Description:** Spawn initialization handler. If not active prototyper and not held, cancels drop sounds, schedules drop sounds, and plays proximity post animation.
* **Parameters:** `inst` -- moonrockseed entity instance
* **Returns:** None
* **Error states:** None — prototyper and inventoryitem components are guaranteed by fn() setup.

### `OnRemoveEntity(inst)`
* **Description:** Cleanup handler called when entity is removed. Removes icon entity if it exists.
* **Parameters:** `inst` -- moonrockseed entity instance
* **Returns:** None
* **Error states:** None — icon reference is nil-checked before removal.

### `ondropped(inst)` (local)
* **Description:** Inventory item drop handler. Disables light emitter.
* **Parameters:** `inst` -- moonrockseed entity instance
* **Returns:** None
* **Error states:** None — Light component should always exist per fn() setup.

### `DoUpgrade(inst)`
* **Description:** Upgrades the orb to MOONORB_UPGRADED prototyper tier and sets `_upgraded` flag. Called on load if upgrade state was saved.
* **Parameters:** `inst` -- moonrockseed entity instance
* **Returns:** None
* **Error states:** None — prototyper component is guaranteed by fn() setup (inst:AddComponent("prototyper")).

### `OnSave(inst, data)`
* **Description:** Save state handler. Stores `_upgraded` flag in save data table.
* **Parameters:**
  - `inst` -- moonrockseed entity instance
  - `data` -- table to populate with save state
* **Returns:** None
* **Error states:** None — directly assigns to data table.

### `OnLoad(inst, data)`
* **Description:** Load state handler. Calls `DoUpgrade()` if `_upgraded` flag exists in load data.
* **Parameters:**
  - `inst` -- moonrockseed entity instance
  - `data` -- table containing saved state
* **Returns:** None
* **Error states:** None — data and `_upgraded` field are nil-checked before use.

### `icon_init(inst)` (local)
* **Description:** Delayed initialization for icon entity. Spawns `globalmapicon` prefab, sets minimap priority, and starts tracking the parent moonrockseed entity.
* **Parameters:** `inst` -- moonrockseed_icon entity instance
* **Returns:** None
* **Error states:** None — icon entity is spawned from globalmapicon prefab which always includes MiniMapEntity component per iconfn() definition.

## Events & listeners
- **Listens to (client):** `moonrockseed._fx` -- triggers `OnFX()` to spawn visual effects.
- **Listens to (master):** `onputininventory` -- triggers `topocket()` when placed in inventory.
- **Listens to (master):** `ondropped` -- triggers `toground()` when dropped on ground.
- **Listens to (master, on container):** `onputininventory`, `ondropped`, `onremove` -- triggers owner/container tracking updates.
- **Pushes:** `moonrockseed._fx` -- networked event fired on activation to spawn FX on all clients.