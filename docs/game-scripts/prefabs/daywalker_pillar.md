---
id: daywalker_pillar
title: Daywalker Pillar
description: Manages the behavior, visual chains, structural degradation, and prisoner interaction logic for a Daywalker Pillar entity in the game world.
tags: [ boss, combat, environment, fx, network ]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c40d2303
system_scope: environment
---

# Daywalker Pillar

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `daywalker_pillar` component manages a stationary environmental structure used during encounters with the Daywalker boss. It supports dynamic chain rendering that visually connects the pillar to a prisoner (the Daywalker), and handles structural degradation via mining. The component integrates tightly with the `workable`, `lootdropper`, `entitytracker`, and `updatelooper` systems to synchronize visuals, physics, and gameplay logic across clients and servers.

## Usage example
```lua
local pillar = SpawnPrefab("daywalker_pillar")
local prisoner = SpawnPrefab("daywalker")

pillar:SetPrisoner(prisoner)
pillar.components.workable:SetWorkLeft(10) -- Adjust initial health
```

## Dependencies & tags
**Components used:** `inspectable`, `workable`, `lootdropper`, `entitytracker`, `updatelooper`, `transform`, `animstate`, `soundemitter`, `light`, `minimapentity`, `network`, `inventory` (via external calls), `tool` (via external calls)  
**Tags added by prefab:** `daywalker_pillar`, `event_trigger`, `regrowth_blocker`, `NOCLICK`, `FX`, `decor` (on child entities)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `level` | string | `"full"` | Current structural integrity level (`"full"`, `"med"`, `"low"`, `"lowest"`). |
| `prisoner` | `net_entity` proxy | `nil` | Networked reference to the attached Daywalker prisoner. |
| `enablechains` | `net_bool` proxy | `false` | Controls whether chain visual FX should be rendered. |
| `debris` | `net_tinybyte` proxy | `0` | Triggers debris FX; higher values produce larger debris animations. |
| `chains` | table | `nil` | Array of chain link entities (IF spawned). |
| `chainbracket` | Entity | `nil` | Bracket FX entity holding chains on the pillar. |
| `vibratetime` | number | `0` | Accumulator used for vibrating chain animation math. |
| `vibrateamp` | number | `0` | Current vibration amplitude (0 = no vibration, up to ~1.2). |
| `vibratespike` | boolean | `false` | If true, next frame resets amplitude to spike level. |
| `fadelight` | number | `nil` | Used to fade out light intensity when pillar is destroyed. |
| `sleeptask` | Task | `nil` | Delayed removal task for chains when entity goes to sleep. |

## Main functions
### `SetPrisoner(prisoner)`
* **Description:** Attaches or detaches a Daywalker prisoner to the pillar, managing chain visuals and event subscriptions accordingly.
* **Parameters:** `prisoner` (Entity or `nil`) — the entity to chain to, or `nil` to remove.
* **Returns:** Nothing.
* **Error states:** No side effects if `prisoner` equals the current value.

### `EnableChains(enable)`
* **Description:** Enables or disables chain rendering and sets up per-frame updates for visual chain follow logic.
* **Parameters:** `enable` (boolean) — whether to show chains.
* **Returns:** Nothing.
* **Error states:** If on a dedicated server, FX logic is skipped (only affects owner client).

### `IsResonating(inst)`
* **Description:** Helper that checks if the pillar is currently vibrating.
* **Parameters:** `inst` (Entity) — the pillar instance.
* **Returns:** `true` if the current animation is `"pillar_shake"`, otherwise `false`.

### `OnWorked(inst, worker, workleft, numworks)`
* **Description:** Handles partial and full mining progress. Triggers hit animation, debris FX, light color updates, chain vibration (if tool is tough), and appropriate recoil behavior.
* **Parameters:**
  * `inst` (Entity) — the pillar instance.
  * `worker` (Entity or `nil`) — the entity performing the mining.
  * `workleft` (number) — remaining work to finish.
  * `numworks` (number) — work amount applied (not used directly).
* **Returns:** Nothing.
* **Error states:** Does not fire chain vibration if `worker` is absent or tool lacks `CanDoToughWork()`.

### `OnWorkFinished(inst, worker)`
* **Description:** Executes when the pillar is fully destroyed. Drops loot, removes base entities, triggers fall animation, and fades out lights.
* **Parameters:** `inst`, `worker` (see `OnWorked`).
* **Returns:** Nothing.
* **Error states:** Only proceeds if `inst.persists` is `true` (i.e., not a temporary version).

### `SpawnChains(inst)`
* **Description:** Instantiates and attaches chain link entities and bracket; registers per-frame update loop.
* **Parameters:** `inst` (Entity) — the pillar instance.
* **Returns:** Nothing.
* **Error states:** Creates FX only if `inst.chains == nil`; does not double-create.

### `RemoveChains(inst, broken)`
* **Description:** Removes chain entities and cleans up state. Supports normal removal or "broken" state (where chains fall and animate separately).
* **Parameters:**
  * `inst` (Entity)
  * `broken` (boolean) — if `true`, chains are detached and break animated; otherwise removed immediately.
* **Returns:** Nothing.

### `UpdateBuild(inst, workleft)`
* **Description:** Evaluates current `workleft` against thresholds and updates visual symbol overrides (`pillar_low`, `pillar_med`, `pillar_lowest`) and light intensity. Also grants marble loot on level drops.
* **Parameters:**
  * `inst` (Entity)
  * `workleft` (number) — current work remaining.
* **Returns:** `changed` (boolean) — whether a build level changed, and `dlevel` (number) — how many levels dropped.
* **Error states:** Does nothing if `workleft` doesn’t cross threshold.

### `GetPrisoner(inst)`
* **Description:** Returns the currently attached prisoner entity.
* **Parameters:** `inst` (Entity)
* **Returns:** Entity or `nil`.

### `OnEndVibrate(inst)`
* **Description:** Stops chain vibration effects when vibration timer expires.
* **Parameters:** `inst` (Entity)
* **Returns:** Nothing.

### `OnDebrisDirty(inst)`
* **Description:** Triggers small or large debris FX based on the `debris` net value.
* **Parameters:** `inst` (Entity)
* **Returns:** Nothing.

### `ClearNearbyColliders(inst)`
* **Description:** Adjusts pillar position to avoid colliding with blockers (e.g., trees, rocks) spawned at same location (for legacy save compatibility).
* **Parameters:** `inst` (Entity)
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `daywalker_pillar.restartvibrate` — internal event to reset vibration spike.  
  - `daywalkerchainbreak` — fired by prisoner to indicate chain was severed.  
  - `onremove` — on prisoner or self, to clean up chains and state.  
  - `chainsdirty`, `debrisdirty` — networked dirty flags for client-side FX updates.  
- **Pushes:**  
  - `daywalker_pillar.restartvibrate` — triggers vibration spike.  
  - `pillarremoved`, `pillarvibrating` — notifies prisoner when pillar state changes.