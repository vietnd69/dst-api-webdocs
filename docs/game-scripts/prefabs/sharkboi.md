---
id: sharkboi
title: Sharkboi
description: Manages the behavior, appearance, and state transitions of the Sharkboi boss entity in DST, including combat targeting, trading mechanics, and dynamic visual customization.
tags: [combat, ai, boss, trader, appearance]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: fc3c9916
system_scope: entity
---

# Sharkboi

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`sharkboi.lua` defines the `sharkboi` prefab, a large boss entity with dual movement modes (standing and finned), combat targeting logic, and a trading system. It integrates with multiple components (e.g., `combat`, `health`, `locomotor`, `trader`, `sleeper`, `grouptargeter`) to handle movement, aggression, state changes, appearance (via hue/brightness/brow/ mane), and interaction. It also supports arena-based teleportation, offscreen despawning during sleep, and custom event tracking for music triggers and rewards.

## Usage example
```lua
local sharkboi = SpawnPrefab("sharkboi")
sharkboi.components.health:SetMaxHealth(1000)
sharkboi:StartAggro() -- enter aggressive state
sharkboi.components.combat:SetTarget(target_player)
sharkboi.MakeTrader() -- enable trading if defeated
sharkboi.components.talker:Chatter("SHARKBOI_TALK_GLOAT", 1) -- trigger dialogue
```

## Dependencies & tags
**Components used:** `combat`, `freezable`, `grouptargeter`, `health`, `locomotor`, `lootdropper`, `named`, `sleeper`, `talker`, `timer`, `trader`, `teleportedoverride`, `inspectable`, `explosiveresist`, `weighable`, `unwrappable`, `sharkboimanager`, `sharkboimanagerhelper`.  
**Tags added:** `scarytoprey`, `scarytooceanprey`, `monster`, `animal`, `largecreature`, `shark`, `wet`, `epic`, `noepicmusic`, `_named`, `notarget` (when trading).  
**Tags checked:** `hostile`, `player`, `playerghost`, `busy`, `notalksound`, `digging`, `fin`, `invisible`, `sleeping`, `waking`, ` Cantalk`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `finmode` | `net_bool` | `false` | Whether the Sharkboi is in swimming fin mode (controls physics, facing, shadow, mass, invincibility). |
| `stock` | number | `MAX_TRADES` (5) | Remaining trades available when trading. |
| `pendingreward` | number or `nil` | `nil` | Reward amount pending after receiving an acceptable item. |
| `sketchgiven` | boolean or `nil` | `nil` | Whether the special sketch reward has been given. |
| `hue` | number or `nil` | `0` | Hue value for skin tone (0 to 1). |
| `brightness` | number or `nil` | `1` | Brightness value for skin tone (< 1). |
| `brow` | number or `nil` | `0` | Brow variant (1 to 8); 4–7 are "war paint" styles. |
| `mane` | number or `nil` | `0` | Mane variant (1 or 2). |
| `voicepath` | string | `"meta3/sharkboi/"` | Base sound path for voice lines. |
| `hole` | Entity or `nil` | `nil` | Reference to the fishing hole (e.g., ice hole) this Sharkboi is near. |
| `trading` | boolean | `false` | Whether currently in the trading brain node. |

## Main functions
### `StartAggro(inst)`
* **Description:** Activates aggressive behavior, adds the `hostile` tag, and resets standing dive and torpedo cooldown timers.
* **Parameters:** `inst` (Entity) — the Sharkboi instance.
* **Returns:** Nothing.
* **Error states:** No effect if `hostile` tag already present.

### `StopAggro(inst)`
* **Description:** Deactivates aggression, removes the `hostile` tag, and stops standing dive and torpedo timers.
* **Parameters:** `inst` (Entity) — the Sharkboi instance.
* **Returns:** Nothing.
* **Error states:** No effect if `hostile` tag absent.

### `MakeTrader(inst)`
* **Description:** Adds the `trader` component, registers trade logic callbacks, sets `stock` to `MAX_TRADES`, and adds `notarget` tag. If asleep and not already scheduled, schedules offscreen despawning after `OFFSCREEN_DESPAWN_DELAY` seconds.
* **Parameters:** `inst` (Entity) — the Sharkboi instance.
* **Returns:** Nothing.
* **Error states:** No effect if `trader` component already present.

### `GiveReward(inst, target)`
* **Description:** Grants `pendingreward` number of `bootleg` items to `target`, decrements `stock`, and optionally awards a special reward (sketch or gift) if the traded item was heavy and the sketch hasn’t been given yet.
* **Parameters:** `inst` (Entity) — the Sharkboi instance. `target` (Entity or `nil`) — the player to receive the reward.
* **Returns:** Nothing.
* **Error states:** Does nothing if `pendingreward` is `nil`. Resets `pendingreward` to `nil` afterward.

### `SetIsTradingFlag(inst, flag, timeout)`
* **Description:** Sets or clears the `trading` flag, managing talk suppression during entry/exit from the trading state. Cancels existing tasks as needed.
* **Parameters:** `inst` (Entity), `flag` (boolean), `timeout` (number) — seconds before auto-clearing the flag.
* **Returns:** Nothing.

### `SetHue(inst, hue)`
* **Description:** Sets the skin hue and saturation (and inverted hue/saturation for excluded symbols) for visual customization. Updates the `hue` property.
* **Parameters:** `inst` (Entity), `hue` (number or `nil`) — normalized value in `(0, 1)` or `nil` to reset.
* **Returns:** Nothing.

### `SetBrightness(inst, brightness)`
* **Description:** Sets the skin brightness (and inverted brightness for excluded symbols). Ensures brightness >= `SKINTONE_MIN_BRIGHTNESS`. Updates the `brightness` property.
* **Parameters:** `inst` (Entity), `brightness` (number or `nil`) — normalized value < 1 or `nil` to reset.
* **Returns:** Nothing.

### `SetBrow(inst, brow)`
* **Description:** Sets the brow variant (1–8) via symbol override. Handles special hue/brightness logic for war paint styles (brows 4–7).
* **Parameters:** `inst` (Entity), `brow` (number or `nil`) — integer 1–8 or `nil` to reset.
* **Returns:** Nothing.

### `SetVoice(inst, voice)`
* **Description:** Selects a voice variant (1–3) and sets `voicepath`. Falls back to default path if invalid.
* **Parameters:** `inst` (Entity), `voice` (number) — 0–2 (used as index into `VOICE_PATHS`).
* **Returns:** Nothing.

### `OnSave(inst, data)`
* **Description:** Serializes key state (hue, brightness, brow, mane, voice, aggro, stock, reward, sketchgiven) for saving.
* **Parameters:** `inst` (Entity), `data` (table) — save data table to populate.
* **Returns:** Nothing.

### `OnLoad(inst, data)`
* **Description:** Loads saved state: applies appearance properties, initializes trader if `health <= min`, restores aggro and reward/stock if applicable.
* **Parameters:** `inst` (Entity), `data` (table or `nil`) — saved data.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `finmodedirty` (client) — triggers radius/mass adjustment when fin mode changes.
- **Pushes:** `invincibletoggle` (via `health`) — notifies when invincibility state changes.
- **Pushes:** `wrappeditem` (via `unwrappable`) — fired for each item inside a wrapped gift.
- **Pushes:** `onrefuseitem` — with `{ giver = player, reason = "EMPTY"|"TOO_SMALL"|"NOT_OCEANFISH" }` when trade refused.
- **Pushes:** `triggeredevent` (client) — notifies player to trigger Sharkboi boss music when near or in arena.
- **Listens to:** `newstate` — updates talk suppression and mass/radius based on state tags.
- **Listens to:** `attacked` — initiates aggro and sets attacker as combat target if not already engaged.
- **Listens to:** `killed` — triggers taunt dialog if a player is killed, and sets talk suppression for 3 seconds.