---
id: wagpunkhat_classified
title: Wagpunkhat Classified
description: Manages networked speech synchronization and talker communication for the Wagpunk Hat classified entity in DST.
tags: [network, audio, speech]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7d73aa4e
system_scope: network
---

# Wagpunkhat Classified

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wagpunkhat_classified` is a classified entity component that synchronizes speech data (string and sound) between server and clients for the Wagpunk Hat. It acts as a bridge between the `talker` component on the parent entity and the networked state, ensuring the correct dialogue line and sound play when triggered. It is not a standalone component attached to player or mob prefabs but a dedicated auxiliary entity managed via `AttachClassified`.

## Usage example
```lua
-- Typically used internally by the Wagpunk Hat prefab
local classified = inst:AttachClassified("wagpunkhat_classified")
classified:SetTarget(player)
classified:Say("WARBIS_STRING_KEY", "rifts3/warbis/talk_LP")
```

## Dependencies & tags
**Components used:** `talker` (via `inst._parent.components.talker:Say` / `:ShutUp`)
**Tags:** Adds `CLASSIFIED` tag to the classified entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `string` | net_smallbyte | `0` | Network variable storing the current string index (maps to `STRINGS.WARBIS`). |
| `sound_override` | net_tinybyte | `0` | Network variable storing the current sound override index; triggers `"saydirty"` event when changed. |
| `enabled` | boolean | `false` | Local flag; unused in current implementation. |
| `timeouttask` | Task or `nil` | `nil` | Server-side delayed task to clear string after 1 second. |
| `istarget` | boolean or `nil` | `nil` | Tracks whether the classified entity is targeting the local player. |

## Main functions
### `Say(inst, string, sound_override)`
* **Description:** Sets the classified string and sound on the server; triggers client-side speech via the `"saydirty"` event. The string will auto-clear after 1 second.
* **Parameters:**
  * `string` (string) — Key in `STRINGS.WARBIS` to speak.
  * `sound_override` (string) — Sound path key in `TALK_SOUNDS`; if missing, defaults to last sound.
* **Returns:** Nothing.
* **Error states:** None — guarantees `string` and `sound_override` indices are set or defaulted.

### `ShutUp(inst)`
* **Description:** Immediately silences the classified entity on the server by clearing `sound_override` to `0`, triggering client shutdown.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetTarget(inst, target)`
* **Description:** Assigns the target entity (usually a player). If the target matches the local player, registers the `"saydirty"` listener to trigger speech; otherwise, unregisters it.
* **Parameters:**
  * `target` (entity or `nil`) — The entity to target. `nil` is treated as local player (`ThePlayer`).
* **Returns:** Nothing.
* **Error states:** Does not validate `target`; silently compares to `ThePlayer` on client.

### `GetTalkSound(inst)`
* **Description:** Returns the current talk sound path (or a random one) for use in sound emission.
* **Parameters:** None.
* **Returns:** string — Sound path, e.g., `"rifts3/warbis/talk_LP"`.

## Events & listeners
- **Listens to:**
  - `"saydirty"` — On clients: triggers `OnSayDirty`, which reads `string` and `sound_override` values and sends dialogue to the parent's `talker`.
  - `"saydirty"` — On server: not directly listened to; handled via `Say()` which internally triggers the event via network replication of `sound_override`.
- **Pushes:** None directly — events are handled internally via callbacks.