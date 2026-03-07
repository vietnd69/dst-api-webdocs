---
id: inkable
title: Inkable
description: Tracks and manages temporary ink status on players affected by squid attacks.
tags: [combat, debuff, player]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 59acd2ec
system_scope: player
---

# Inkable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Inkable` manages the temporary "inked" debuff applied to players when struck by squid attacks. When a player is inked, a visual effect (`squid_ink_player_fx`) is applied, and the component tracks a 2-second duration before removing the debuff and resetting state. It also supports component transfer during entity reparenting (e.g., when a player respawns).

## Usage example
```lua
local inst = TheEnt
inst:AddComponent("inkable")
inst.components.inkable:Ink()
-- Later, if needed:
if inst.components.inkable.inked then
    print("Player is currently inked for " .. inst.components.inkable.inktime .. " more seconds")
end
```

## Dependencies & tags
**Components used:** `player_classified` (accessed via `self.inst.player_classified.inked`), `debuff` (via `AddDebuff`/`RemoveDebuff`)
**Tags:** Adds `squid_ink_player_fx` debuff tag; does not add/remove entity tags directly.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inked` | boolean or `nil` | `nil` | Whether the entity is currently inked (`true`) or not (`nil`). |
| `inktime` | number | `0` | Remaining time (in seconds) until the ink effect expires. |

## Main functions
### `Ink()`
* **Description:** Activates the inked state for 2 seconds, applying the visual debuff effect and starting updates.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** If called multiple times rapidly, `inktime` resets to `2`, but overlapping calls do not stack.

### `OnUpdate(dt)`
* **Description:** Decrements the remaining ink duration each frame; when time expires, removes the debuff, stops updating, and fires the `deinked` event.
* **Parameters:** `dt` (number) — elapsed time since the last update.
* **Returns:** Nothing.

### `TransferComponent(newinst)`
* **Description:** Transfers the inked state to a new entity instance (e.g., on player death/respawn). If currently inked, applies the ink state to the new entity and preserves remaining time.
* **Parameters:** `newinst` (Entity) — the target entity instance.
* **Returns:** Nothing.

## Events & listeners
- **Pushes:** `deinked` — fired when the ink effect expires (via `self.inst:PushEvent("deinked")`).
- **Listens to:** `self.inst.player_classified.inked:push()` — an event stream used to notify the network of ink state changes (client-server sync via `player_classified` component).
