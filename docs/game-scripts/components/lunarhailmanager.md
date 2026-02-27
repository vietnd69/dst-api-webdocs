---
id: lunarhailmanager
title: Lunarhailmanager
description: Manages spawning, physics, and impact behavior of lunar hail debris during a lunar hail storm in Don't Starve Together.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: environment
source_hash: 907e2dd4
---

# Lunarhailmanager

## Overview
This component handles the lifecycle of lunar hail debris—its spawning, fall physics, ground detection, damage application, and destruction—during active lunar hail storms. It operates exclusively on the master simulation side and coordinates with the world state (`islunarhailing`) to dynamically trigger and manage debris events around players, respecting sheltering mechanics and region-specific debris drop tables.

## Dependencies & Tags
- **Component Usage:** Relies on `combat`, `sheltered`, `inventory`, `inventoryitem`, `farmplantstress`, `farmplanttendable`, `growable`, `lighttweener` components via `HasComponent()` checks on targets.
- **Tags Used:** Applies `"lunarhailprotection"` check on players, and `"lunarhaildebris"` internally; uses `"shadecanopy"`, `"shadecanopysmall"`, `"player"`, `"INLIMBO"`, `"playerghost"`, `"invisible"`, `"epic"`, `"lunar_aligned"`, `"wall"`, `"hive"`, `"houndmound"`, `"farmplantstress"` for filtering and logic.
- **Notable Tags Added:** None—does not mutate tags on entities.

## Properties
No public instance properties are initialized directly on `self`. All state is held in local closure variables (e.g., `_enabled`, `_activeplayers`). The only property directly assigned on `self` is `self.inst`, which holds the component host entity (typically `TheWorld`).

## Main Functions

### `SetDebris(data)`
* **Description:** Sets the global default debris drop table for lunar hail events. Replaces `_debris` with `data` on the master side.
* **Parameters:**
  * `data` (table): An array of debris drop entries, each with `weight` and `loot` keys.

### `SetTagDebris(tile, data)`
* **Description:** Assigns a custom debris drop table for a specific tile/tag (e.g., a terrain type or terrain tag). Stored in `_tagdebris[tile]`.
* **Parameters:**
  * `tile` (string): The tag or identifier to associate the drop table with.
  * `data` (table): A debris drop table with the same structure as used in `SetDebris`.

## Events & Listeners
- **Listens:**
  - `"ms_playerjoined"` on `TheWorld` — triggers `OnPlayerJoined`.
  - `"ms_playerleft"` on `TheWorld` — triggers `OnPlayerLeft`.
  - World state `"islunarhailing"` — triggers `ToggleLunarHail`.
  - `"onremove"` on debris's `warningshadow` — triggers `OnRemoveDebris`.
  - `"enterlimbo"` on debris — triggers `_DebrisOnEnterLimbo`.
- **Triggers:**
  - `"startfalling"` on debris when falling logic begins.
  - `"stopfalling"` on debris when it lands and stabilizes or is exempted from further physics updates.
  - `"GetAttacked"` call on valid targets via `combat:GetAttacked()` (not an event push, but part of impact logic).
  - `PushEvent("startfalling")`, `PushEvent("stopfalling")` — used to notify other systems of debris state changes.