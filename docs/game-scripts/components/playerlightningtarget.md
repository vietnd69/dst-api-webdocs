---
id: playerlightningtarget
title: Playerlightningtarget
description: Determines whether and how a player entity is affected when struck by lightning, including chance calculation and strike response logic.
tags: [lightning, player, damage, environment]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 2d6d39ea
system_scope: environment
---

# Playerlightningtarget

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`PlayerLightningTarget` manages how a player entity responds to lightning strikes in the game world. It calculates the effective hit chance using a base value and modifier lists, executes custom strike logic via a configurable callback, and emits a network event upon being targeted. It depends on `health` and `inventory` components to determine vulnerability and insulation status before applying damage.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("playerlightningtarget")
inst.components.playerlightningtarget:SetHitChance(0.25) -- 25% base chance
inst.components.playerlightningtarget:SetOnStrikeFn(function(e)
    -- custom lightning response logic
    e:PushEvent("custom_lightning_handler")
end)
inst.components.playerlightningtarget:DoStrike() -- triggers strike behavior
```

## Dependencies & tags
**Components used:** `health`, `inventory`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `hitchance` | number | `TUNING.PLAYER_LIGHTNING_TARGET_CHANCE` | Base hit chance multiplier before modifiers. |
| `onstrikefn` | function | `DefaultOnStrike` | Callback invoked when a strike occurs; defines the behavior executed on hit. |
| `hitchancemodifiers` | SourceModifierList | instance | Manages source-based modifiers applied to the hit chance. |

## Main functions
### `SetHitChance(chance)`
*   **Description:** Sets the base hit chance multiplier for lightning strikes. This value is combined with modifiers via `GetHitChance`.
*   **Parameters:** `chance` (number) — the new base hit chance (e.g., `0.1` for 10%).
*   **Returns:** Nothing.

### `GetHitChance()`
*   **Description:** Returns the effective hit chance, computed as `hitchance` multiplied by the total modifier value from `hitchancemodifiers`.
*   **Parameters:** None.
*   **Returns:** number — effective hit chance after applying modifiers.

### `SetOnStrikeFn(fn)`
*   **Description:** Overrides the default strike callback with a custom function. The function will be invoked whenever `DoStrike()` is called.
*   **Parameters:** `fn` (function) — a function accepting one argument: the entity instance (`inst`).
*   **Returns:** Nothing.

### `DoStrike()`
*   **Description:** Triggers the strike behavior by invoking `onstrikefn` and then fires the `"playerlightningtargeted"` event.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** `playerlightningtargeted` — fired at the end of `DoStrike()` to notify other systems that the entity has been struck by lightning.
