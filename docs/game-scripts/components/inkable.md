---
id: inkable
title: Inkable
description: Applies and manages a temporary squid ink debuff on a player entity that impairs visibility for a short duration.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: 59acd2ec
---

# Inkable

## Overview
This component manages the state and lifecycle of a squid ink effect applied to a player, including setting a fixed duration, applying visual/audio debuffs via the `squid_ink_player_fx` debuff, and broadcasting a `deinked` event upon expiration. It is tied to player entities and integrates with the game's debuff and update systems.

## Dependencies & Tags
- **Components:** Relies on the presence of `player_classified` component (to trigger `inked:push()` on its event queue), `debuffs` component (to apply/remove `"squid_ink_player_fx"`), and standard entity update mechanisms (`StartUpdatingComponent`, `StopUpdatingComponent`).
- **Tags:** None explicitly added or removed by this component.

## Properties

| Property    | Type    | Default Value | Description                                                                 |
|-------------|---------|---------------|-----------------------------------------------------------------------------|
| `inst`      | `Entity`| `nil`         | Reference to the entity this component is attached to.                      |
| `inked`     | `boolean` or `nil` | `nil`   | `true` when ink effect is active; `nil` when inactive.                     |
| `inktime`   | `number`| `0`           | Remaining duration (in seconds) of the ink effect. Initialized to `0`.     |

## Main Functions

### `Ink()`
* **Description:** Activates the ink effect by setting `inktime` to 2 seconds, marking `inked` as `true`, emitting an `inked` event via `player_classified`, adding the `squid_ink_player_fx` debuff, and starting the component's update loop.
* **Parameters:** None.

### `OnUpdate(dt)`
* **Description:** Called every frame while the component is active (after `Ink()`). Decrements `inktime` by `dt`; when it reaches 0 or below, it clears the effect, fires the `deinked` event, removes the debuff, and stops further updates.
* **Parameters:**
  * `dt` (`number`): Delta time in seconds since the last frame.

### `TransferComponent(newinst)`
* **Description:** Transfers the ink effect to another entity (e.g., on respawn or item transfer). If inked, it re-applies the effect on the new entity and preserves the remaining `inktime`.
* **Parameters:**
  * `newinst` (`Entity`): The target entity receiving the component.

## Events & Listeners
- **Listens to:** None.
- **Triggers:**
  - `inked` (via `self.inst.player_classified.inked:push()`) — sent immediately when ink is applied.
  - `deinked` (via `self.inst:PushEvent("deinked")`) — sent when ink duration expires.