---
id: shadowchanneler
title: Shadowchanneler
description: A non-tangible boss-phase entity that spawns shadow minions and manages their behavior through a commander system, with dynamic sanity aura and transparency.
tags: [combat, boss, ai, sanity, summoning]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 00f41773
system_scope: entity
---

# Shadowchanneler

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`shadowchanneler` is a prefab function that creates a boss-phase entity responsible for channeling shadow minions. It acts as a commander for shadow soldiers, manages its own invulnerability and appearance transitions, and dynamically adjusts its sanity aura based on observer sanity status. It is constructed using core ECS components including `health`, `combat`, `sanityaura`, `entitytracker`, and `savedrotation`, and includes client-side visual effects via `transparentonsanity`.

## Usage example
```lua
-- This prefab is instantiated internally by the game during boss phases.
-- Modders should not manually create it; instead, reference it via prefabs.shadowchanneler

local shadow_channeler = Prefab("shadowchanneler", nil, assets)
-- The prefab includes custom logic in its `fn()` constructor and event handlers.
```

## Dependencies & tags
**Components used:** `health`, `combat`, `sanityaura`, `entitytracker`, `savedrotation`, `transparentonsanity`  
**Tags added:** `shadowcreature`, `monster`, `hostile`, `shadow`, `notraptrigger`, `notarget`, `shadow_aligned`, `NOBLOCK`, `NOCLICK`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `killed` | boolean | `nil` | Internal flag indicating whether the shadow channeler has died; used to prevent duplicate death logic. |
| `persists` | boolean | `true` (initially) | Set to `false` on death to prevent save persistence. |
| `controller_priority_override_is_targeting_player` | boolean | `true` | Gives the channeler high AI targeting priority when determining hostiles near the player. |

## Main functions
### `CalcSanityAura(inst, observer)`
*   **Description:** Computes the radius and magnitude of the sanity aura based on whether the observer is insane.
*   **Parameters:**  
    `inst` (Entity) — the shadow channeler instance.  
    `observer` (Entity) — the entity observing the aura (e.g., a player).  
*   **Returns:** Number — negative value (`-TUNING.SANITYAURA_MED`) if observer is insane, otherwise `0`.  
*   **Error states:** None — relies on `Sanity:IsCrazy()` which is deprecated but functional.

### `KeepTargetFn()`
*   **Description:** Used by the `combat` component to override default target persistence logic.  
*   **Parameters:** None.  
*   **Returns:** `false` — forces the entity to *not* keep its current target, enabling dynamic re-targeting behavior.  
*   **Error states:** None.

### `OnAppear(inst)`
*   **Description:** Initializes visible appearance after the “appear” animation completes, unless the entity was already killed.  
*   **Parameters:** `inst` (Entity) — the shadow channeler instance.  
*   **Returns:** Nothing.  
*   **Error states:** Early exit if `inst.killed` is `true`. Also cleans up animation callbacks and toggles `notarget`/`invincible` flags.

### `OnDeath(inst)`
*   **Description:** Handles death sequence: sets `killed` flag, plays “disappear” animation, marks as non-persistent, removes listeners, and schedules removal after animation ends.  
*   **Parameters:** `inst` (Entity) — the shadow channeler instance.  
*   **Returns:** Nothing.  
*   **Error states:** Early exit if `inst.killed` is already `true`.

### `OnGotCommander(inst, data)`
*   **Description:** Updates the “stalker” entity tracker when a new commander is assigned, replacing stale references.  
*   **Parameters:**  
    `inst` (Entity) — the shadow channeler instance.  
    `data` (table) — event payload containing `commander` (Entity).  
*   **Returns:** Nothing.  
*   **Error states:** Skips update if tracker already has the correct commander.

### `OnLostCommander(inst, data)`
*   **Description:** Removes the “stalker” tracker entry when the commander is lost.  
*   **Parameters:**  
    `inst` (Entity) — the shadow channeler instance.  
    `data` (table) — event payload containing `commander` (Entity).  
*   **Returns:** Nothing.  
*   **Error states:** Skips removal if tracker does not match the lost commander.

### `OnLoadPostPass(inst)`
*   **Description:** After world load, re-registers the channeler as a soldier under its tracked “stalker” (commander), if still valid.  
*   **Parameters:** `inst` (Entity) — the shadow channeler instance.  
*   **Returns:** Nothing.  
*   **Error states:** Skips registration if `stalker` or its `commander` component is missing.

### `nodebrisdmg(inst, amount, overtime, cause, ignore_invincible, afflicter, ignore_absorb)`
*   **Description:** Custom damage redirector for `health` component — blocks all damage *except* from entities tagged `quakedebris`.  
*   **Parameters:**  
    `afflicter` (Entity or `nil`) — source of the damage.  
*   **Returns:** `true` only if `afflicter` has tag `quakedebris`, otherwise `false`.  
*   **Error states:** Returns `false` if `afflicter` is `nil`.

## Events & listeners
- **Listens to:**  
  - `animover` — triggers `OnAppear` after animations complete.  
  - `death` — triggers `OnDeath` upon health reaching zero.  
  - `gotcommander` — updates “stalker” tracker when a commander is assigned.  
  - `lostcommander` — cleans up “stalker” tracker when commander is lost.  
- **Pushes:**  
  - None directly — relies on underlying components (`health`, `commander`) to emit standard DST events.