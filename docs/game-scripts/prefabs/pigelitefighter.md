---
id: pigelitefighter
title: Pigelitefighter
description: Creates a configurable elite pig fighter NPC with combat, following, and timed despawn behavior.
tags: [combat, ai, boss, npc, mob]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8a250b34
system_scope: entity
---

# Pigelitefighter

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`pigelitefighter` is a prefab factory function that generates one of four visual variants (1–4) of elite pig fighters — aggressive, intelligent NPCs with combat capabilities, a follow-leader system, and automatic despawn after a fixed duration. It initializes a complete entity with transform, animations, sound, physics, and multiple components including `combat`, `locomotor`, `follower`, `health`, `sleeper`, and `timer`. It interacts with the world state for full-moon events and uses a dedicated brain (`pigelitefighterbrain`) and stategraph (`SGpigelitefighter`) to drive behavior.

## Usage example
```lua
-- Typical usage within the game's prefabs/pigelitefighter.lua script (as shown)
local pigelite1 = MakePigEliteFighter("1")()
local pigelite2 = MakePigEliteFighter("2")()

-- In a custom mod, instantiate one with a specific variation
local variation3 = MakePigEliteFighter("3")
local inst = variation3.fn()
inst:AddTag("my_custom_pig")
```

## Dependencies & tags
**Components used:** `talker`, `locomotor`, `embarker`, `health`, `combat`, `follower`, `inspectable`, `entitytracker`, `timer`, `sleeper`, `freezable`, `burnable`, `hauntable`.  
**Tags added:** `character`, `pig`, `pigelite`, `scarytoprey`, `noepicmusic`, `ignorewalkableplatformdrowning`.

## Properties
No public properties are exposed directly on the `pigelitefighter` prefab definition itself. All configuration occurs via `TUNING` constants and internal component setters within the factory function.

## Main functions
### `MakePigEliteFighter(variation)`
* **Description:** Factory function that returns a prefab definition for one of four pig elite fighter variants (1–4). Each variant has distinct armor/skin overrides but identical behavior logic.
* **Parameters:** `variation` (string) — must be one of `"1"`, `"2"`, `"3"`, or `"4"`, determining which visual build assets are applied.
* **Returns:** A `Prefab` object (as returned by `Prefab(...)`), with `fn` as its instantiation function.
* **Error states:** Produces no explicit errors, but invalid `variation` values yield no overrides (default visual may appear).

## Events & listeners
- **Listens to:**  
  - `timerdone` — triggers despawn logic when the `despawn_timer` expires.  
  - `newcombattarget` — stops following when a new combat target is assigned or marks for despawn if combat target is lost.  
  - `attacked`, `blocked` — handles retaliation against attackers who were former leaders, or acquires new targets if none exists.  
  - `isfullmoon` — triggers immediate despawn during full moon.  
- **Pushes:** No events directly via `inst:PushEvent(...)`, but its components may fire events (e.g., `droppedtarget`, `loseloyalty`, `haunted`).
