---
id: shadow_battleaxe_classified
title: Shadow Battleaxe Classified
description: Provides classified talk logic for the Shadow Battleaxe weapon, managing string playback and sound synchronization when the weapon is held by the player.
tags: [audio, classified, weapon, talker, network]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0af80e9e
system_scope: audio
---

# Shadow Battleaxe Classified

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`shadow_battleaxe_classified` is a classified (non-persistent) entity that acts as a talk broker for the Shadow Battleaxe weapon. It handles server-side dispatching of dialogue strings and client-side playback synchronization. It is not added to prefabs directly but attached via `AttachClassified` on the parent entity (the Shadow Battleaxe) and is only active when the weapon is equipped by a player.

The component interfaces with the `talker` component of the parent entity to emit dialogue using `Say`, and it uses networked variables (`net_smallbyte`, `net_tinybyte`) to synchronize dialogue state between server and client.

## Usage example
```lua
-- Internally managed by the Shadow Battleaxe prefab during equip/unequip.
-- This component is attached automatically when the weapon is equipped:
--   parent:AttachClassified(inst)
-- and removed when unequipped:
--   parent:DetachClassified(inst)
```

## Dependencies & tags
**Components used:** `talker` (via `inst._parent.components.talker:Say(...)`)
**Tags:** Adds `CLASSIFIED` tag.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `string_list` | `net_smallbyte` | `nil` | Networked ID of the current string list (index into `STRING_LISTS`). |
| `string_id` | `net_smallbyte` | `nil` | Networked ID of the current string within the list. |
| `sound_override` | `net_tinybyte` | `0` | Networked sound override ID; triggers `saydirty` event when > 0. |
| `enabled` | boolean | `false` | Flag indicating whether the classified is active (not used for logic). |
| `timeouttask` | task | `nil` | Server-side delayed task to reset talk state after ~1 second. |
| `hastarget` | boolean | `nil` | Server-side flag indicating whether the current target is the local player. |
| `_parent` | entity | `nil` | Client-side reference to the parent Shadow Battleaxe entity. |

## Main functions
### `Say(inst, string_list, string_id, sound_override)`
* **Description:** (Server only) Triggers a dialogue line on the Shadow Battleaxe. Updates networked variables and schedules a timeout to clear the current line. Must only be called on the master simulation.
* **Parameters:**  
  `string_list` (string) — Key of the string list (e.g., `"starving_l2"`), corresponding to an entry in `STRINGS.SHADOW_BATTLEAXE_TALK`.  
  `string_id` (number) — Index into the selected string list.  
  `sound_override` (string) — Path to the sound override (e.g., `"rifts4/nightmare_axe/lvl2_talk_LP"`). Uses default sound if not found.
* **Returns:** Nothing.
* **Error states:** No-op if `string_list` or `string_id` are invalid or missing.

### `SetTarget(inst, target)`
* **Description:** (Server only) Sets the target entity for dialogue (typically `ThePlayer`). Enables listening to `"saydirty"` events only if the target matches the local player, to avoid unnecessary talk triggers.
* **Parameters:**  
  `target` (entity or `nil`) — The entity to target; `nil` is treated as the local player.
* **Returns:** Nothing.

### `GetTalkSound(inst)`
* **Description:** (Common) Returns the appropriate sound file path based on `sound_override`. Falls back to a random entry from `TALK_SOUNDS`.
* **Parameters:** None.
* **Returns:** string — Sound file path.
* **Error states:** Returns a random sound if `sound_override` ID is invalid.

## Events & listeners
- **Listens to (client):** `saydirty` — Triggers `OnSayDirty`, which decodes and speaks the dialogue line on the client using the parent's `talker` component.
- **Listens to (server):** `saydirty` — No-op; client-side only. Server relies on explicit `Say()` calls.
- **Pushes:** None.