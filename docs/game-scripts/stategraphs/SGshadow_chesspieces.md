---
id: SGshadow_chesspieces
title: Sgshadow Chesspieces
description: Defines reusable state machine logic and event handlers for shadow chess piece entities in Don't Starve Together, including movement, combat states (idle, attack, hit, death), and allied entity coordination.
tags: [stategraph, ai, combat, boss]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 8992b336
system_scope: ai
---

# Sgshadow Chesspieces

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGshadow_chesspieces` provides a collection of reusable state definitions and event handlers for shadow chess piece prefabs. It encapsulates core behavioral patterns such as idle movement, attacking, taking damage, levelling up, dying, and triggering epic effects (e.g., awakening nearby statues or causing fear). It does not instantiate entities itself, but is returned as a module (`ShadowChess`) meant to be imported and extended by individual prefabs (e.g., `shadowchesspiece.lua`). Key behaviors rely on integration with `epicscare`, `health`, `locomotor`, and `lootdropper` components.

## Usage example
```lua
local ShadowChess = require("stategraphs/SGshadow_chesspieces")

local MY_PIECE = Prefab("my_shadow_piece", ...)

MY_PIECE:AddComponent("epicscare")
MY_PIECE:AddComponent("health")
MY_PIECE:AddComponent("locomotor")
MY_PIECE:AddComponent("lootdropper")

MY_PIECE:AddStateGraph(".sg", ShadowChess)
```

## Dependencies & tags
**Components used:**  
- `epicscare` (`inst.components.epicscare:Scare`)  
- `health` (`inst.components.health:IsDead`)  
- `locomotor` (`inst.components.locomotor:StopMoving`)  
- `lootdropper` (`inst.components.lootdropper:DropLoot`)  
- `SoundEmitter`, `AnimState`, `Transform`, `Physics`, `entity`

**Tags:**  
Adds: `"epic"`, `"chess_moonevent"`, `"shadowchesspiece"`, `"NOCLICK"` (transiently in death/despawn states).  
Checks: `"busy"`, `"idle"`, `"canrotate"`, `"hit"`, `"taunt"`, `"levelup"`, `"noattack"`, `"burnt"` (indirectly via loot logic).

## Properties
No public properties — the module returns a table (`ShadowChess`) of functions, events, and state generators.

## Main functions
### `PlayExtendedSound(inst, soundname)`
*   **Description:** Starts playing a sound and registers a delayed cleanup task to remove the sound ID from the state graph memory (`soundcache`) and kill the sound stream after ~10 seconds.
*   **Parameters:**  
  - `inst` (Entity) – The entity playing the sound.  
  - `soundname` (string) – Key into `inst.sounds` for the sound path.
*   **Returns:** Nothing.
*   **Error states:** Assumes `inst.sounds[soundname]` exists and is a valid sound path.

### `ExtendedSoundTimelineEvent(t, soundname)`
*   **Description:** Returns a `TimeEvent` that invokes `PlayExtendedSound` at a specified time offset (`t` in seconds).
*   **Parameters:**  
  - `t` (number) – Time offset in seconds.  
  - `soundname` (string) – Sound key.
*   **Returns:** `TimeEvent` instance.

### `AwakenNearbyStatues(inst)`
*   **Description:** Finds entities within a 15-tile radius that have the `"chess_moonevent"` tag and pushes the `"shadowchessroar"` event to each, waking them up.
*   **Parameters:**  
  - `inst` (Entity) – The initiating chess piece.
*   **Returns:** Nothing.

### `TriggerEpicScare(inst)`
*   **Description:** If the entity has the `"epic"` tag, triggers a scare effect using `epicscare` component with a 5-second duration.
*   **Parameters:**  
  - `inst` (Entity).
*   **Returns:** Nothing.

### `DeathSoundTimelineEvent(t)`
*   **Description:** Returns a `TimeEvent` that plays the `"death"` sound at time `t`.
*   **Parameters:** `t` (number) – Time offset in seconds.
*   **Returns:** `TimeEvent` instance.

### `AwakenNearbyStatues` (function)
*   **Description:** *Alias for* `AwakenNearbyStatues(inst)`; included directly in `ShadowChess.Functions` for ease of external reference.

### `TriggerEpicScare` (function)
*   **Description:** *Alias for* `TriggerEpicScare(inst)`.

### `DeathSoundTimelineEvent` (function)
*   **Description:** *Alias for* `DeathSoundTimelineEvent(t)`.

## Events & listeners
- **Listens to:**  
  - `"animover"` – Used in `OnAnimOverRemoveAfterSounds`, `IdleOnAnimOver`, `AddDeath`, `AddEvolvedDeath`, `AddDespawn`, and `AddHit` states to trigger cleanup or transition.  
  - `"attacked"` – Triggers `"hit"` state (`OnAttacked`).  
  - `"death"` – Triggers `"death"` or `"evolved_death"` state (`OnDeath`).  
  - `"despawn"` – Triggers `"despawn"` state (`OnDespawn`).  
  - `"levelup"` – Triggers `"levelup"` state (`LevelUp`).  
  - `"doattack"` – Triggers `"attack"` state (`DoAttack`).

- **Pushes:**  
  - `"shadowchessroar"` – To nearby `"chess_moonevent"` entities via `AwakenNearbyStatues`.  
  - `"epicscare"` – Via `inst.components.epicscare:Scare`.  
  - `"levelup"` – To nearby allied `"shadowchesspiece"` entities via `LevelUpAlliesTimelineEvent`.

Note: `inst:PushEvent("epicscare", ...)` and `inst:PushEvent("shadowchessroar", ...)` are not defined directly in this file but are invoked via component APIs and event callbacks.