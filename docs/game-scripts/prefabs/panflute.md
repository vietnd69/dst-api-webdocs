---
id: panflute
title: Panflute
description: A musical instrument that induces sleep, grogginess, or other effects in nearby entities and can summon Wortox souls when played.
tags: [audio, player, tool, effect, item]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f25ba458
system_scope: player
---

# Panflute

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`panflute` is a prefab item representing a musical instrument that applies status effects (primarily sleepiness, but also grogginess or soul summoning) to nearby entities when played. It implements the `instrument` component to handle music-related behavior, and uses `tool`, `finiteuses`, and `inventoryitem` components for gameplay integration. When played by Wortox (or similar), it triggers conditions based on the player’s skill tree and deactivation of temporary buffs. Its behavior varies depending on the target's components (e.g., `sleeper`, `grogginess`, `farmplanttendable`, or `rider`), and it supports special functionality like summoning souls via the `wortox_panflute_soulcaller` skill.

## Usage example
```lua
local panflute = SpawnPrefab("panflute")
panflute.Transform:SetPosition(x, y, z)
-- The panflute becomes usable as a tool, e.g., via player action:
-- player.components.tool:PerformAction(ACTIONS.PLAY, panflute)
```

## Dependencies & tags
**Components used:**  
`instrument`, `tool`, `finiteuses`, `inventoryitem`, `inspectable`, `freezable`, `pinnable`, `fossilizable`, `rider`, `sleeper`, `grogginess`, `farmplanttendable`, `combat`, `skilltreeupdater`, `sanity`

**Tags:**  
`flute`, `tool`, `usesdepleted` (added on finite uses exhaustion), `groggy` (on target via grogginess component)

## Properties
No public properties are initialized or exposed directly on the `panflute` instance. Temporarily used local variables like `panflute_sleeptime` and `panflute_wortox_forget_debuff` are set as fields on `inst` during `OnPlayed`, but these are internal state placeholders, not API surface.

## Main functions
Not applicable — this is a prefab definition (not a component). Core logic resides in the `instrument` callbacks (`OnPlayed`, `HearPanFlute`, `OnFinishedPlaying`) and the `UseModifier` function for finite usage consumption.

## Events & listeners
- **Listens to:**  
  `floater_startfloating` — triggers `idle` → `float` animation transition on float start  
  `floater_stopfloating` — triggers `float` → `idle` animation on float stop  

- **Pushes (via other components or event propagation):**  
  - `ridersleep` — fired on mount when a sleeper-based target is played upon (via `rider` → `mount:PushEvent(...)`)  
  - `knockedout` — fired directly on target if it has no `sleeper`, `grogginess`, or `farmplanttendable` components  
  - `sanitydelta` — triggered on musician if `wortox_panflute_buff` is removed (via `sanity:DoDelta(...)`)  
  - Debuffs like `wortox_forget_debuff` may be added on target if conditions are met (via `AddDebuff`)  
