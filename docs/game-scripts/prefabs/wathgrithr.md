---
id: wathgrithr
title: Wathgrithr
description: Defines Wathgrithr as a playable character with inspiration-based battle singing mechanics, including spirit spawning on kills and song-based buffs.
tags: [player, combat, inspiration, boss]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e0f8cb92
system_scope: player
---

# Wathgrithr

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
This file defines the `wathgrithr` character prefab for DST, leveraging `MakePlayerCharacter` from `player_common.lua`. It configures her unique gameplay identity centered around the `singinginspiration` and `battleborn` components: singing battle songs grants stat buffs (`battleborn`) and the inspiration meter dynamically determines available song slots. Key behaviors include spawning spirits (`wathgrithr_spirit`) on eligible creature deaths (scaled by victim size), and playing background music while riding a beefalo. The character overrides several systems to integrate inspiration-driven combat features directly into the entity interface (e.g., `inst.GetInspiration`, `inst.GetInspirationSong`).

## Usage example
```lua
--Typical usage occurs during character creation via MakePlayerCharacter.
--To add custom behavior, extend using these hooks:
local inst = CreateEntity()
inst:AddPrefab("wathgrithr")

--Later in a mod, you could tap into inspiration:
local percent = inst:GetInspiration() -- Uses inst.components.singinginspiration or legacy networked API
local song = inst:GetInspirationSong(1) -- Get song in slot 1
```

## Dependencies & tags
**Components used:** `singinginspiration`, `battleborn`, `health`, `hunger`, `sanity`, `eater`, `foodaffinity`, `drownable`, `combat`, `skilltreeupdater`, `talker`  
**Tags added:** `valkyrie`, `battlesinger`, `quagmire_butcher`, `quagmire_shopper`  
**Tags removed:** `usesvegetarianequipment`  
**Prefabs referenced:** `wathgrithr_spirit`, `wathgrithr_bloodlustbuff_other`, `wathgrithr_bloodlustbuff_self`, `wathgrithr_sing`, `player_common`, `battlesongdefs`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `GetInspiration` | function | `GetInspiration(inst)` | Helper function attached directly to `inst` to compute current inspiration percentage (0–1), supporting both component-based and legacy networked paths. |
| `GetInspirationSong` | function | `GetInspirationSong(inst, slot)` | Helper function attached to `inst` to retrieve the active battle song in a given slot, handling component and networked states. |
| `CalcAvailableSlotsForInspiration` | function | `CalcAvailableSlotsForInspiration(inst, inspiration_precent)` | Helper attached to `inst` to determine how many song slots are unlocked based on `TUNING.BATTLESONG_THRESHOLDS`. |
| `IsValidVictim` | function | `IsValidVictim(victim)` | Predicate attached to `inst` and passed to `battleborn`/`singinginspiration` to validate valid targets for spirit spawning and song effects. |
| `start_inv` | table | (computed per game mode) | Starting inventory map keyed by game mode (e.g., `"default"`, `"quagmire"`). Populated from `TUNING.GAMEMODE_STARTING_ITEMS`. |

## Main functions
### `IsValidVictim(victim)`
* **Description:** Validates whether a victim qualifies as a valid target for spirit spawning and battleborn effects. Excludes non-hostile prey, non-lifefroms, and companions unless explicitly allowed.
* **Parameters:** `victim` (EntityInstance or `nil`) — the entity being killed.
* **Returns:** `true` if the victim is valid, otherwise `false`.
* **Error states:** Safely returns `false` if `victim` or its `health`/`combat` components are missing.

### `GetInspiration(inst)`
* **Description:** Computes the inspiration percentage (0 to 1) for the character. Supports both live component access and legacy networked state for compatibility across client/server.
* **Parameters:** `inst` (EntityInstance) — the character instance.
* **Returns:** number in `[0, 1]`, or `0` on failure.

### `GetInspirationSong(inst, slot)`
* **Description:** Retrieves the battle song definition for a given slot. Supports both component (`singinginspiration`) and networked (`player_classified`) paths.
* **Parameters:** `inst` (EntityInstance) — the character instance; `slot` (number) — the song slot index (1-based).
* **Returns:** Table (song definition) or `nil` if no song is active in that slot.

### `CalcAvailableSlotsForInspiration(inst, inspiration_precent)`
* **Description:** Calculates how many song slots are available based on current inspiration percentage and `TUNING.BATTLESONG_THRESHOLDS`. Iterates thresholds in descending order to find the highest tier met.
* **Parameters:** `inst` (EntityInstance); `inspiration_precent` (number, optional) — inspiration percentage; defaults to `GetInspiration(inst)`.
* **Returns:** number — number of unlocked song slots (0–`#TUNING.BATTLESONG_THRESHOLDS`).

### `OnTakeDrowningDamage(inst)`
* **Description:** Reset inspiration to zero when drowning, ensuring the character loses buffs upon drowning.
* **Parameters:** `inst` (EntityInstance).
* **Returns:** Nothing.

### `PlayRidingMusic(inst)`
* **Description:** Fires the `"playrideofthevalkyrie"` event to trigger ride music during beefalo mounting.
* **Parameters:** `inst` (EntityInstance).
* **Returns:** Nothing.

### `OnRidingDirty(inst)`
* **Description:** Manages periodic riding music playback when mounted on a beefalo with the `"beefalo"` skill tag. Starts or cancels a periodic task based on riding state.
* **Parameters:** `inst` (EntityInstance).
* **Returns:** Nothing.  
* **Error states:** No-op if `ThePlayer ~= inst`; cancels existing task if conditions change.

## Events & listeners
- **Listens to:** `killed` — triggers `onkilled` to spawn spirits for valid victims.
- **Listens to (client-only):** `isridingdirty` and `wathgrithr._riding_music` — drive `OnRidingDirty` logic for music playback while riding.
- **Pushes:** `playrideofthevalkyrie` — used during periodic music playback on ride.
- **Pushes:** `wathgrithr._riding_music` — internal networked event to synchronize ride music state.