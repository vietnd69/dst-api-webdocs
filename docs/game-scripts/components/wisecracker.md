---
id: wisecracker
title: Wisecracker
description: A speech and reaction component that triggers character-specific dialogue in response to gameplay events, status changes, and interactions.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 9181b19a
---

# Wisecracker

## Overview
The `Wisecracker` component manages in-game dialogue and commentary for an entity—primarily used for characters like Wortox—by listening to gameplay events and responding with appropriate localized speech lines via the `talker` component. It handles contextual reactions to eating, environmental changes (e.g., entering light/dark), combat encounters, item usage, and specialized mechanics (e.g., soul management for Wortox, Woby commands for dogrider characters). It also supports conditional, rate-limited, or delayed announcements to avoid repetition or overlap.

## Dependencies & Tags
- Requires `inst.components.talker` to be present for speech output.
- Conditionally relies on:
  - `foodmemory`, `eater`, `edible`, `perishable`, `foodaffinity` (for eating-related logic).
  - `LightWatcher` (for light/dark transition detection).
  - `inventory` (for inventory full check).
  - `sittable`, `burnable` (for chair-on-fire detection).
- Adds no new tags.
- Uses `"soulstealer"` and `"dogrider"` tags to gate specialized event listeners.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity this component belongs to. |
| `time_in_lightstate` | number | `0` | *Deprecated; not used in current logic.* |
| `inlight` | boolean | `true` | Tracks whether the entity is currently in light; used to detect transitions. |
| `foodbuffname` | string or `nil` | `nil` | Stores the name of the highest-priority active food buff announcement. |
| `foodbuffpriority` | number or `nil` | `nil` | Stores the priority of the current food buff announcement. |
| `fishbuffname` | string or `nil` | `nil` | Stores the name of the highest-priority active fish buff announcement. |
| `fishbuffpriority` | number or `nil` | `nil` | Stores the priority of the current fish buff announcement. |

> Note: No explicit `fishbuffname`/`fishbuffpriority` fields are initialized in `_ctor`, but they are populated by the `fishbuff` event listeners and used in `OnUpdate`.

## Main Functions
### `OnUpdate(dt)`
* **Description:** Called periodically by `StartUpdatingComponent`. Handles dynamic state-based speech (e.g., announcements when entering light/dark), and triggers food/fish buff announcements when the buff data arrives via events.
* **Parameters:**
  - `dt` (number): Time elapsed since last update.

## Events & Listeners
- `oneat`: Triggers commentary on eating (e.g., spoiled, painful, same food repeated, masterchef reactions).
- `itemranout`: Announces running out of a specific item (via `announce` string in `data`).
- `accomplishment` / `accomplishment_done`: Announces achievements and completion of milestones.
- `attacked`: Specific line when attacked by a boomerang.
- `snared`: Announces being caught in a snare.
- `repelled`: Announces repelling an enemy (rate-limited: 5-second cooldown).
- `insufficientfertilizer`: Announces failing to fertilize due to low quality.
- `heargrue` / `attackedbygrue` / `resistedgrue`: Announces Charlie-related events (with specific lines).
- `thorns`, `burnt`: Announces damage from thorns or fire.
- `hungerdelta`: Announces entering "Hungry" state.
- `ghostdelta`: Announces entering "Ghost Draining" state.
- `startfreezing`, `startoverheating`: Announces cold/hot extremes.
- `inventoryfull`: Announces when inventory is full.
- `coveredinbees`: Announces bee swarm.
- `wormholespit`: Different line depending on whether the teleport failed due to same-spot issue.
- `townportalteleport`: Announces using the Town Portal.
- `huntlosttrail`, `huntbeastnearby`, `huntstartfork`, `huntsuccessfulfork`, `huntwrongfork`, `huntavoidfork`: Hunt mechanic commentary.
- `lightningdamageavoided`: Announces avoiding lightning damage.
- `mountwounded`: Announces mount with low health.
- `pickdiseasing`, `digdiseasing`: Warning when digging/picking diseasing items.
- `onpresink`, `onprefallinvoid`, `on_standing_on_new_leak`: Announces boat damage/events.
- `encumberedwalking`, `hungrybuild`: Commentary while over-encumbered or while building while hungry.
- `tooltooweak`, `weapontooweak`: Announces failed use due to insufficient tool/weapon quality.
- `soulempty`, `soultoofew`, `soultoomany`, `souloverloadwarning`, `souloverloadavoided`: Wortox-specific soul management events (with variants based on `wortox_inclination`: `"nice"`, `"naughty"`).
- `wortox_panflute_playing_active`, `wortox_panflute_playing_used`: Panflute buff events.
- `wortox_reviver_failteleport`: Fail to teleport when reviving.
- `on_halloweenmoonpotion_failed`: Failing the Moon Potion.
- `foodbuffattached`, `foodbuffdetached`: Triggers announcement of food buff gain/loss; priority-based selection.
- `fishbuffattached`, `fishbuffdetached`: Triggers announcement of fish buff gain/loss; priority-based selection.
- `sittableonfire`: Delayed announcement when sitting on a burning chair (0.5s delay).
- `exit_gelblob`: Delayed announcement (1.6s) when exiting a gel blob.
- `bit_by_shadowthrall_stealth`: Delayed and rate-limited (10s global + 2–3s random) announcement.
- `yoth_oncooldown`, `yoth_oncooldown_cancel`: Rate-limited, delayed announcement for Yoth cooldown.
- `treatwoby`, `praisewoby`, `tellwobysit`, etc. (`"dogrider"` tag required): Woby command/response lines with range, cooldown, and global repetition handling.
- `vault_teleporter_does_nothing`: Vault teleporter failure.
- `see_lightsout_shadowhand`: Rate-limited (15s) announcement when encountering Lights Out shadow hand.
- `quagmire`-specific events: Conditionally added if server mode is `"quagmire"`.