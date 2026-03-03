---
id: wisecracker
title: Wisecracker
description: Manages contextual voice lines and announcements for entities based on game events, states, and interactions.
tags: [ai, dialogue, audio]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 9181b19a
system_scope: entity
---

# Wisecracker

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Wisecracker` is a component responsible for triggering context-aware dialogue (voice lines or text announcements) for an entity in response to specific gameplay events, state changes, or interactions. It operates by listening to a wide range of events—such as eating, entering darkness, gaining food buffs, or encountering world hazards—and calling `inst.components.talker:Say()` with the appropriate localization key. This component is commonly added to player characters (e.g., Wortox) and some special NPCs to enrich the game’s narrative feedback.

It integrates with several core systems: `talker` for speech output, `edible` and `perishable` for food-related commentary, `eater` for stomach immunity checks, `foodaffinity` and `foodmemory` for food preferences and repetition tracking, `sittable`, `burnable`, `inventory`, and others. It is not a gameplay-affecting component, but a purely decorative/feedback layer.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("player")
inst:AddComponent("wisecracker")
-- Default behavior activates upon events like eating, entering darkness, etc.
-- Custom event handling can be extended by adding more listeners as needed.
```

## Dependencies & tags
**Components used:** `talker`, `edible`, `perishable`, `eater`, `foodaffinity`, `foodmemory`, `inventory`, `burnable`, `sittable`, `copier` (indirectly via Quagmire integration), `health`, `revivablecorpse`, `sleeper`, `LightWatcher`, `inventory`.

**Tags checked:** `player`, `playerghost`, `masterchef`, `soulstealer`, `dogrider`, `monstermeat`, `fresh`, `stale`, `spoiled`, `preparedfood`, `masterfood`, `degraded_with_spoilage`.

**Tags added:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity reference | `nil` | Reference to the entity instance that owns this component. |
| `time_in_lightstate` | number | `0` | Tracks cumulative time spent in light (unused in current code). |
| `inlight` | boolean | `true` | Tracks whether the entity is currently in light (updated in `OnUpdate`). |
| `foodbuffname` | string or `nil` | `nil` | Name of the currently active food buff to announce (set via `foodbuffattached` event). |
| `foodbuffpriority` | number or `nil` | `nil` | Priority level of the active food buff (higher values override lower ones). |
| `_repeltime` | number or `nil` | `nil` | Internal timer to debounce repeller announcements. |

Note: The following are used internally but not as instance properties:
- `fishbuffname` / `fishbuffpriority`
- `last_*_time` / `*_task` variables are captured via closure in event listeners.

## Main functions

### `OnUpdate(dt)`
*   **Description:** Per-frame update function that checks for transitions into or out of light/darkness and announces them. Also announces active food/fish buffs if they exist and the talker is idle.
*   **Parameters:** `dt` (number) — delta time in seconds.
*   **Returns:** Nothing.
*   **Error states:** No effect if `inst.components.talker` is missing or `inst:HasTag("playerghost")` is true (blocks dark/light entry announcements). Skips announcements if `is_talker_busy` (i.e., a previous announcement just occurred in this frame).

## Events & listeners
- **Listens to:**
    - `oneat` — announces when food is eaten (same old, raw, cooked, spoiled, stale, etc.), with specialization for masterchefs.
    - `itemranout`, `accomplishment`, `accomplishment_done` — announces item exhaustion or task milestones.
    - `attacked` — announces boomerang hits.
    - `snared`, `repelled`, `insufficientfertilizer`, `heargrue`, `attackedbygrue`, `resistedgrue` — announces environmental/hazard interactions.
    - `thorns`, `burnt` — announces self-harm or environmental damage.
    - `hungerdelta`, `ghostdelta` — announces when hunger/sanity drops below thresholds.
    - `startfreezing`, `startoverheating` — announces extreme temperature exposure.
    - `inventoryfull` — announces full inventory (only if `inventory:IsFull()`).
    - `coveredinbees`, `wormholespit`, `townportalteleport`, `huntlosttrail`, `huntbeastnearby`, `huntstartfork`, `huntsuccessfulfork`, `huntwrongfork`, `huntavoidfork`, `lightningdamageavoided`, `mountwounded`, `pickdiseasing`, `onpresink`, `onprefallinvoid`, `on_standing_on_new_leak`, `digdiseasing`, `encumberedwalking`, `hungrybuild`, `tooltooweak`, `weapontooweak` — miscellaneous environmental/situation alerts.
    - `soulempty`, `soultoofew`, `soultoomany`, `souloverloadwarning`, `souloverloadavoided`, `wortox_panflute_playing_active`, `wortox_panflute_playing_used`, `wortox_reviver_failteleport`, `on_halloweenmoonpotion_failed` — Wortox-specific soul mechanics.
    - `foodbuffattached`, `foodbuffdetached` — stores/updates food buff announcement.
    - `sittableonfire` — announces if sitting on a burning chair (with delay).
    - `otterboaterosion_begin` — announces boat erosion cause (shallow/deep water or den broken).
    - `fishbuffattached`, `fishbuffdetached` — stores/updates fish buff announcement.
    - `exit_gelblob` — announces after delay exiting a gel blob.
    - `bit_by_shadowthrall_stealth`, `yoth_oncooldown`, `yoth_oncooldown_cancel` — monster-specific alerts with cooldowns.
    - `treatwoby`, `praisewoby`, `tellwobysit`, etc. — Woby (dog rider) command prompts.
    - `vault_teleporter_does_nothing`, `see_lightsout_shadowhand` — adventure/mystery alerts.
    - Quagmire-specific events (added via `AddQuagmireEventListeners`).

- **Pushes:** None identified. The component only triggers talker events; it does not fire custom events.

Note: All announcements use `GetString(inst, "KEY")`, where `KEY` is a localization string key defined in language files. Delayed announcements (e.g., gel blob, shadowthrall stealth) are implemented using `inst:DoTaskInTime()`. Debouncing and coalescing (e.g., for `yoth_oncooldown` and `repelled`) uses time-based globals in closures.
