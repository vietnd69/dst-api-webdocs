---
id: wisecracker
title: Wisecracker
description: Manages contextual character dialogue and announcements triggered by game events, status changes, and interactions.
tags: [dialogue, events, character]
sidebar_position: 10
last_updated: 2026-04-17
build_version: 722832
change_status: stable
category_type: components
source_hash: 489b0f29
system_scope: entity
---

# Wisecracker

> Based on game build **722832** | Last updated: 2026-04-17

## Overview
`Wisecracker` is a dialogue management component that listens to various game events and triggers appropriate character announcements. It handles food-related comments, environmental status changes, combat events, and special character interactions. The component integrates with `talker` to display dialogue and tracks buff states for food and fish effects.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("wisecracker")
inst:AddComponent("talker")

-- Component automatically listens to events after being added
-- No manual initialization required

-- OnUpdate is called automatically via StartUpdatingComponent
-- Dialogue triggers based on game events like eating, taking damage, etc.
```

## Dependencies & tags
**External dependencies:**
- `event_server_data` -- loads Quagmire event listeners when game mode matches

**Components used:**
- `talker` -- displays all character announcements via Say()
- `edible` -- checks food health/sanity values and spoilage degradation
- `perishable` -- checks food freshness state (fresh, stale, spoiled)
- `eater` -- checks strongstomach and healthabsorption properties
- `foodaffinity` -- checks prefab affinity for food items
- `foodmemory` -- tracks how many times food has been eaten
- `inventory` -- checks if inventory is full
- `burnable` -- checks if chair is on fire
- `sittable` -- checks if entity is occupying a chair
- `cookable` -- checks if food can be cooked
- `lightwatcher` -- tracks time spent in light vs dark

**Tags:**
- `fresh` -- checked via perishable component
- `stale` -- checked via perishable component
- `spoiled` -- checked via perishable component
- `monstermeat` -- checked for eater strongstomach exception
- `masterchef` -- enables special cooking dialogue
- `masterfood` -- enables tasty food dialogue
- `preparedfood` -- enables prepared food dialogue
- `playerghost` -- suppresses light/dark announcements when ghost
- `soulstealer` -- enables soul-related dialogue (Wortox)
- `dogrider` -- enables Woby interaction dialogue (Wagstaff)
- `cave` -- world tag (commented out in source)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `time_in_lightstate` | number | `0` | Tracks time spent in current light state. |
| `inlight` | boolean | `true` | Whether the entity is currently in light. |
| `foodbuffname` | string/nil | `nil` | Name of the active food buff announcement. |
| `foodbuffpriority` | number/nil | `nil` | Priority level of the active food buff. |
| `fishbuffname` | string/nil | `nil` | Name of the active fish buff announcement. |
| `fishbuffpriority` | number/nil | `nil` | Priority level of the active fish buff. |

## Main functions
### `Wisecracker(inst)`
* **Description:** Constructor that initializes the wisecracker component and registers all event listeners for dialogue triggers. Sets up listeners for eating, combat, environmental changes, and character-specific events.
* **Parameters:**
  - `self` -- the wisecracker component instance
  - `inst` -- the entity instance that owns this component
* **Returns:** Nothing
* **Error states:** None

### `OnUpdate(dt)`
* **Description:** Periodic update function that checks light/dark transitions and processes pending food/fish buff announcements. Called automatically via `StartUpdatingComponent`. Triggers enter light/dark dialogue and clears buff names after announcement.
* **Parameters:**
  - `dt` -- delta time since last update
* **Returns:** Nothing
* **Error states:** Errors if entity lacks lightwatcher component (nil dereference on self.inst.LightWatcher — no guard present in source).

## Events & listeners
**Listens to:**
- `oneat` -- triggers food quality announcements (spoiled, painful, fresh, stale, same food repetition)
- `itemranout` -- announces when item runs out
- `accomplishment` -- announces accomplishment start
- `accomplishment_done` -- announces accomplishment completion
- `attacked` -- announces boomerang self-hit
- `snared` -- announces being trapped
- `repelled` -- announces being repelled (5 second cooldown)
- `insufficientfertilizer` -- announces insufficient fertilizer
- `heargrue` -- announces Charlie hearing
- `attackedbygrue` -- announces Charlie attack
- `resistedgrue` -- announces Charlie attack missed
- `thorns` -- announces thorns damage
- `burnt` -- announces burning damage
- `hungerdelta` -- announces hunger threshold crossed
- `ghostdelta` -- announces ghost drain threshold crossed
- `startfreezing` -- announces freezing start
- `startoverheating` -- announces overheating start
- `inventoryfull` -- announces full inventory
- `coveredinbees` -- announces bee attack
- `wormholespit` -- announces wormhole teleport (same spot or different)
- `townportalteleport` -- announces town portal teleport
- `huntlosttrail` -- announces lost hunt trail (spring or normal)
- `huntbeastnearby` -- announces beast nearby during hunt
- `huntstartfork` -- announces hunt fork start
- `huntsuccessfulfork` -- announces successful hunt fork
- `huntwrongfork` -- announces wrong hunt fork
- `huntavoidfork` -- announces avoided hunt fork
- `lightningdamageavoided` -- announces lightning damage avoided
- `mountwounded` -- announces mount low health
- `pickdiseasing` -- announces disease warning on pick
- `digdiseasing` -- announces disease warning on dig
- `onpresink` -- announces boat sinking
- `onprefallinvoid` -- announces falling into void
- `on_standing_on_new_leak` -- announces boat leak
- `encumberedwalking` -- announces encumbered movement
- `hungrybuild` -- announces hungry fast building
- `tooltooweak` -- announces tool too weak
- `weapontooweak` -- announces weapon too weak
- `soulempty` -- announces empty soul (Wortox, with inclination variants)
- `soultoofew` -- announces too few souls (Wortox, 30 second cooldown, with inclination variants)
- `soultoomany` -- announces too many souls (Wortox, 30 second cooldown, with inclination variants)
- `souloverloadwarning` -- announces soul overload warning
- `souloverloadavoided` -- announces soul overload avoided
- `wortox_panflute_playing_active` -- announces panflute buff active
- `wortox_panflute_playing_used` -- announces panflute buff used
- `wortox_reviver_failteleport` -- announces Wortox reviver teleport fail
- `on_halloweenmoonpotion_failed` -- announces moon potion failure
- `foodbuffattached` -- tracks food buff name and priority
- `foodbuffdetached` -- tracks food buff name and priority
- `fishbuffattached` -- tracks fish buff name and priority
- `fishbuffdetached` -- tracks fish buff name and priority
- `sittableonfire` -- announces chair on fire (0.5 second delay)
- `otterboaterosion_begin` -- announces otterboat erosion (deepwater or den broken)
- `exit_gelblob` -- announces exiting gelblob (1.6 second delay, cancellable)
- `bit_by_shadowthrall_stealth` -- announces shadow thrall stealth bite (10 second cooldown, 2+ random second delay)
- `yoth_oncooldown` -- announces Yoth on cooldown (10 second cooldown, 2+ random second delay)
- `yoth_oncooldown_cancel` -- cancels pending Yoth cooldown announcement
- `treatwoby` -- announces Woby praise (Wagstaff, with cooldowns)
- `praisewoby` -- announces Woby praise (Wagstaff, with cooldowns)
- `tellwobysit` -- announces Woby sit command (Wagstaff)
- `tellwobyfollow` -- announces Woby follow command (Wagstaff)
- `tellwobyforage` -- announces Woby forage command (Wagstaff)
- `tellwobywork` -- announces Woby work command (Wagstaff)
- `tellwobycourier` -- announces Woby courier command (Wagstaff)
- `callwoby` -- announces Woby return call (Wagstaff, 0.7 second delay)
- `vault_teleporter_does_nothing` -- announces vault teleporter failure
- `see_lightsout_shadowhand` -- announces lights out shadow hand (15 second cooldown)
- `ms_maxclockworks` -- announces max clockworks event

**Pushes:**
- None identified