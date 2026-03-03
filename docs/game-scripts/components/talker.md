---
id: talker
title: Talker
description: Manages speech and chatter functionality for entities, including text display, network replication, and interaction with AI states like death and sleep.
tags: [ai, speech, network, combat]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 87967613
system_scope: entity
---
# Talker

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Talker` component enables an entity to produce spoken dialogue and periodic "chatter" sounds. It handles text display via the `FollowText` widget, network broadcasting via `TheNet:Talker`, and state-aware suppression of speech (e.g., when dead or asleep). It integrates closely with the `health`, `revivablecorpse`, and `sleeper` components to respect entity states, and supports client-server replication for multiplayer chatter events. It is typically added to NPCs, bosses, and other speaking characters.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("talker")
inst.components.talker:SetOffsetFn(function() return Vector3(0, -500, 0) end)
inst.components.talker:Say("Hello, traveler!", 3, false, false)
```

## Dependencies & tags
**Components used:** `health`, `revivablecorpse`, `sleeper`  
**Tags:** Adds `ignoretalking` (when ignoring all talk); checks `monkey`, `wonkey`, `debuffed` (via `health:IsDead()`), `isasleep` (via `sleeper:IsAsleep()`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance to which this component is attached. |
| `task` | `Task?` | `nil` | Current speech task handle; `nil` when not speaking. |
| `ignoring` | `table?` | `nil` | Map of sources to ignore; `true` keys represent active ignore sources. |
| `mod_str_fn` | `function?` | `nil` | Optional function to modify message strings before display. |
| `offset` | `Vector3?` | `nil` | Fixed offset for follow text widget. |
| `offset_fn` | `function?` | `nil` | Optional function returning dynamic offset (takes `inst` as argument). |
| `disablefollowtext` | `boolean?` | `nil` | If `true`, prevents creation of follow text widget. |
| `resolvechatterfn` | `function?` | `nil` | Optional custom function to resolve chatter strings (replaces default `STRINGS` lookup logic). |
| `widget` | `FollowText?` | `nil` | Active follow text widget instance (client-only). |
| `chatter` | `table?` | `nil` | Chatter state table with net variables (`strtbl`, `strid`, `strtime`, `forcetext`, `echotochatpriority`, `task`). |

## Main functions
### `SetOffsetFn(fn)`
* **Description:** Sets a function to compute the dynamic offset of the follow text widget relative to the entity.
* **Parameters:** `fn` (function) — a function taking `inst` and returning a `Vector3`.
* **Returns:** Nothing.

### `MakeChatter()`
* **Description:** Initializes the chatter system for NPC dialogue. Creates replicated net variables and registers event listeners for chatter updates on non-master clients.
* **Parameters:** None.
* **Returns:** Nothing.

### `Chatter(strtbl, strid, time, forcetext, echotochatpriority)`
* **Description:** Triggers a chatter event by setting the chatter state. Automatically calls `Say` internally after resolving the string. Supports network replication for synchronized client-side speech.
* **Parameters:**
  * `strtbl` (string) — String table path (e.g., `"STRINGS.CHARACTERS.WOODIE.SPEECH"`).
  * `strid` (number) — Index or 0 for direct table entry lookup.
  * `time` (number) — Optional duration in seconds for speech display.
  * `forcetext` (boolean) — If `true`, forces speech to play even during states like sleep.
  * `echotochatpriority` (number) — Priority level (`CHATPRIORITIES.LOW`, `NOCHAT`, etc.); if >0, echoes text to nearby player chat.
* **Returns:** Nothing.
* **Error states:** No effect if not master simulation or if chatter is not initialized.

### `Say(script, time, noanim, force, nobroadcast, colour, text_filter_context, original_author_netid, onfinishedlinesfn, sgparam)`
* **Description:** Plays speech lines. Accepts either a string or an array of `Line` objects. Displays follow text, broadcasts over network (unless `nobroadcast`), and fires events. Respects entity states (dead, sleeping) unless `force=true`.
* **Parameters:**
  * `script` (string or table) — A string or an array of `Line` objects.
  * `time` (number) — Duration in seconds for single-line speech.
  * `noanim` (boolean) — If `true`, disables animation during speech.
  * `force` (boolean) — If `true`, bypasses state checks (`ignoring`, `IsDead`, `IsAsleep`).
  * `nobroadcast` (boolean) — If `true`, suppresses network broadcast.
  * `colour` (table) — RGBA color table (`{r, g, b, a}`).
  * `text_filter_context` (number) — Context for word filtering (e.g., `TEXT_FILTER_CTX_GAME`).
  * `original_author_netid` (number) — Net ID of original author (for filtering and modding).
  * `onfinishedlinesfn` (function) — Callback called when all lines finish.
  * `sgparam` (any) — Additional stategraph parameter passed in `ontalk` event.
* **Returns:** `nil` if speech is disabled globally (`TheWorld.speechdisabled`) or blocked by state.
* **Error states:** Returns early if entity is dead or asleep (unless `force=true`) or if `TheWorld.speechdisabled` is true.

### `ShutUp()`
* **Description:** Immediately stops all active speech and clears follow text widget. Resets chatter task and clears string table.
* **Parameters:** None.
* **Returns:** Nothing.

### `IgnoreAll(source)`
* **Description:** Adds a source to the ignore list. Prevents speech unless `force=true` in `Say`. Adds the `ignoretalking` tag on master simulation.
* **Parameters:** `source` (any) — Optional source identifier; defaults to `self` if `nil`.
* **Returns:** Nothing.

### `StopIgnoringAll(source)`
* **Description:** Removes a source from the ignore list. If ignore list is empty, removes the `ignoretalking` tag on master simulation.
* **Parameters:** `source` (any) — Optional source identifier; defaults to `self` if `nil`.
* **Returns:** Nothing.

### `OnRemoveFromEntity()`
* **Description:** Cleanup handler called when component is removed. Cancels chatter events and stops any active speech.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `chatterdirty` — triggers `OnChatterDirty` to process pending chatter and initiate speech.
- **Pushes:** `ontalk` — fired at start of each line with `{ noanim = boolean, duration = number, sgparam = any }`.
- **Pushes:** `donetalking` — fired when all speech lines complete.
