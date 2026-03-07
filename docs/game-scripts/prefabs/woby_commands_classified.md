---
id: woby_commands_classified
title: Woby Commands Classified
description: Manages command dispatch, state synchronization, and behavior control for Woby (Walter's pet) in both server and client contexts, including courier delivery logic, bag locking, and skill-based action toggling.
tags: [player, ai, locomotion, network, inventory]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e21275fd
system_scope: entity
---

# Woby Commands Classified

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`woby_commands_classified` is a classified component responsible for handling command execution, state propagation, and runtime behavior for Woby — Walter’s configurable pet. It acts as the central hub for skill-based toggle states (e.g., pickup, sitting, sprinting), bag locking, courier delivery routing, and network-synced preview states. The component supports both server-side logic (e.g., skill activation, memory Chest location storage, courier movement) and client-side command routing (e.g., buffered actions, preview state management). It is attached to a dedicated classified entity and binds to a Woby pet entity and its owner (a player) during lifecycle transitions.

## Usage example
```lua
local woby = spawn_prefab("walter_woby")
local classified = SpawnPrefab("woby_commands_classified")
classified.components.woby_commands_classified:InitializePetInst(woby)
classified.components.woby_commands_classified:AttachClassifiedToPetOwner(woby, player)
classified.components.woby_commands_classified:ExecuteCommand("sit")
```

## Dependencies & tags
**Components used:**  
`follower`, `locomotor`, `playercontroller`, `skilltreeupdater`, `spawnfader`, `talker`, `wobycourier`

**Tags:**  
Adds `"CLASSIFIED"`; controls `"NOCLICK"` via `spawnfader:FadeIn/Out`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `sit` | `net_bool` | `false` | Server-authoritative "sitting" state; synced via `"isdirty"` event. |
| `pickup` | `net_bool` | `false` | Skill-activated pickup toggle; synced via `"isdirty"` event. |
| `foraging` | `net_bool` | `false` | Skill-activated foraging toggle; synced via `"isdirty"` event. |
| `working` | `net_bool` | `false` | Skill-activated working toggle; synced via `"isdirty"` event. |
| `sprinting` | `net_bool` | `false` | Skill-activated sprinting toggle; synced via `"sprintingdirty"` event. |
| `shadowdash` | `net_bool` | `false` | Skill-activated shadow dash toggle; synced via `"isdirty"` event. |
| `outfordelivery` | `net_bool` | `false` | Whether Woby is currently delivering. |
| `chest_posx`, `chest_posz` | `net_float` | `WOBYCOURIER_NO_CHEST_COORD` | Networked coordinates of remembered chest. |
| `chest_pos_failed` | `net_event` | — | Event fired when chest memory fails. |
| `baglock` | `net_bool` | `true` | Bag lock state; synced via `"baglockdirty"` event. |
| `isnewspawn` | `net_bool` | `true` | Marked `true` at spawn for initialization behaviors. |
| `hasbaglockusercmd` | boolean | `false` | Tracks whether user commands `"lockwoby"`/`"unlockwoby"` are registered. |
| `_preview` | table | `{}` | Client-side preview map used during command batching. |
| `_task` | Task or `nil` | `nil` | Current static or periodic task (e.g., preview timeout). |
| `_parent` | Entity (player) or `nil` | — | Player entity (Walter) that owns this classified. |
| `_pet` | Entity (Woby) or `nil` | — | Current pet entity. |
| `courierdata` | table or `nil` | — | Courier delivery state (start, current, dest positions, teleport flags). |
| `couriertask` | Task or `nil` | `nil` | Periodic task handling courier movement. |
| `wobyicon` | Entity (`globalmapicon`) or `nil` | — | Minimap icon tracking Woby when sitting or delivering. |

## Main functions
### `ExecuteCommand(cmd)`
* **Description:** Dispatches a Woby command (`cmd`), routing to client or server implementations depending on context. Handles skill toggles, bag locking, courier recall, remember chest, and pet commands.
* **Parameters:** `cmd` (string) — A Woby command constant (e.g., `"SIT"`, `"LOCKBAG"`, `"REMEMBERCHEST"`).
* **Returns:** `true` on successful dispatch; `false` otherwise.
* **Error states:** Logs unsupported commands to console.

### `InitializePetInst(pet)`
* **Description:** Binds the classified to a Woby pet entity, sets up parent if missing, disables leashing when sitting, and creates a minimap icon.
* **Parameters:** `pet` (Entity) — The pet (typically `"walter_woby"`).
* **Returns:** Nothing.

### `AttachClassifiedToPetOwner(inst, player)`
* **Description:** Attaches the classified entity to its owner (player), registers event callbacks for skill activation/deactivation, and initializes bag lock state from the player.
* **Parameters:** `player` (Entity) — Player entity.
* **Returns:** Nothing.

### `SendCourierWoby(data)`
* **Description:** Starts or cancels courier delivery routing. On start, disables leashing, sets sit state, creates a minimap icon, clears brain actions, and schedules periodic courier ticks.
* **Parameters:** `data` (table or `nil`) — Courier data including destination (`destpos`). `nil` cancels.
* **Returns:** Nothing.

### `CourierWobyTick(inst)`
* **Description:** Periodic tick (1s) handling courier movement: calculates distance to destination, handles fading/teleportation, detects stuck behavior, and manages delivery completion.
* **Parameters:** `inst` (Component instance) — Passed implicitly.
* **Returns:** Nothing.

### `MakeMinimapIcon(inst)` / `ClearMinimapIcon(inst)`
* **Description:** Spawns or removes a `globalmapicon` that tracks Woby when sitting or delivering.
* **Parameters:** `inst` (Component instance) — Passed implicitly.
* **Returns:** Nothing.

### `GetValue(name)`
* **Description:** Returns current or preview state for a named property (`sit`, `pickup`, etc.). Prioritizes client-side preview over networked state.
* **Parameters:** `name` (string) — Property key (e.g., `"pickup"`, `"baglock"`).
* **Returns:** `boolean` — State value.

### `ShouldSit`, `ShouldPickup`, `ShouldForage`, `ShouldWork`, `ShouldSprint`, `ShouldShadowDash`, `ShouldLockBag`, `IsOutForDelivery`
* **Description:** Convenience getters that delegate to `GetValue`.
* **Parameters:** None (per method).
* **Returns:** `boolean`.

### `RecallWoby(silent)`
* **Description:** Forces Woby to recall, clears courier state, sets sit to false, re-enables leashing, and optionally pushes `"callwoby"` to the owner.
* **Parameters:** `silent` (boolean) — Suppresses the `"callwoby"` event.
* **Returns:** Nothing.

### `IsBusy_Server()` / `IsBusy_Client()`
* **Description:** Indicates if Woby is currently executing or previewing a command. Checks pending tasks, owner handshake state, and delivery status.
* **Parameters:** None.
* **Returns:** `boolean`.

### `NotifyWheelIsOpen(open)`
* **Description:** Server/client method to notify of spell wheel open/close events. Used to prevent auto-recall and manage container restriction timing.
* **Parameters:** `open` (boolean).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"isdirty"` — Resets client preview state (`ResetPreview`).  
  - `"sprintingdirty"` — Resets preview and cancels turbo sprint on sprinting off (`OnSprintingDirty`).  
  - `"baglockdirty"` — Updates bag lock UI and user commands (`OnBagLockDirty`).  
  - `"wobydirty"` — Refreshes client command wheel referrers (`OnWobyDirty`).  
  - `"chest_posdirty"` — Updates chest minimap icon (`OnWobyCourierChestDirty`).  
  - `"woby_commands.chest_pos_failed"` — Cancels temporary chest focus UI (`OnWobyCourierChestFailed`).  
  - `"onremove"` (pet) — Detaches classified and cleans up (`OnRemovePet`).  
  - `"riderchanged"` — Forces recall (`OnRiderChanged`).  
  - `"onremove"` (player) — Clears classification and reattaches to pet (`OnRemovePlayer`).  
  - `"onactivateskill_server"`, `"ondeactivateskill_server"` — Syncs skill states (`OnActivateSkill`, `OnDeactivateSkill`).  
  - `"ms_skilltreeinitialized"` — One-time sync after skill tree initialization.

- **Pushes:**  
  - `"tellwobysit"` / `"tellwobyfollow"` — Notifies owner of sit/follow state changes.  
  - `"callwoby"` — Signals recall intent.  
  - `"tellwobycourier"` — Notifies owner of courier start.  
  - `"updatewobycourierchesticon"` — Requests minimap chest icon update.  
  - `"woby_commands.chest_pos_failed"` — Client-side chest memory failure.  
  - `"isdirty"` (net event) — Signals preview/state change for client sync.