---
id: sentientaxe
title: Sentientaxe
description: Manages sentient behavior and speech for the Lucy (Woodie's axe) entity, including owner interaction, transformation alerts, and conversational triggers.
tags: [combat, npc, inventory, ai, player]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: b623b817
system_scope: entity
---

# Sentientaxe

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Sentientaxe` enables Lucy, Woodie's sentient axe, to react dynamically to gameplay events such as owner changes, chopping actions, carving recipes, and Werebeaver transformations. It manages speech delivery via `lucy_classified` (if present), schedules timed conversations, and responds to proximity-based triggers when the axe is held, equipped, or on the ground. The component relies heavily on the `equippable`, `health`, and `inventoryitem` components to assess context for its behavior.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("sentientaxe")
-- Once assigned an owner (e.g., via `axepossessedbyplayer` event):
inst.components.sentientaxe:SetOwner(player)
-- Conversations and contextual lines are scheduled automatically.
```

## Dependencies & tags
**Components used:** `equippable`, `health`, `inventoryitem`, `lucy_classified` (optional, used conditionally)
**Tags:** Checks `wereplayer`, `playerghost`; uses `transform` state tag via owner's stategraph.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `Entity` or `nil` | `nil` | The current owner of the axe (typically a player). |
| `convo_task` | `Task` or `nil` | `nil` | Scheduled task for the next conversation. |
| `say_task` | `Task` or `nil` | `nil` | Scheduled task for the next speech line. |
| `warnlevel` | number | `0` | Unused in current implementation. |
| `waslow` | boolean | `false` | Unused in current implementation. |
| `_lastcarvingtalks` | table | `{}` | Tracks cooldown timestamps for carving-related speech entries. |

## Main functions
### `SetOwner(owner)`
* **Description:** Assigns a new owner to the axe, updating internal state and attaching/detaching event callbacks based on the previous and new owner. Resets conversation/speech scheduling and clears tracking tables.
* **Parameters:** `owner` (`Entity` or `nil`) – the new owner entity, or `nil` to unset.
* **Returns:** Nothing.
* **Error states:** No operation occurs if the new owner is identical to the current one.

### `Say(list, sound_override, delay)`
* **Description:** Triggers speech delivery using the `lucy_classified` component (if present) and schedules a follow-up conversation if an owner is assigned.
* **Parameters:**  
  - `list` (table of strings) – array of possible speech lines to choose from.  
  - `sound_override` (string or `nil`) – optional custom sound path.  
  - `delay` (number or `nil`) – optional delay (in seconds) before speaking; if provided, scheduling is deferred.
* **Returns:** Nothing.
* **Error states:** If `say_task` is already active, it is cancelled before scheduling a new one.

### `OnBuildItem(recipename)`
* **Description:** Triggers a carving-specific speech line when the owner completes a recipe that matches a configured `STRINGS.LUCY.carve_...` entry, respecting a cooldown defined in `TUNING.LUCY_CARVING_TALK_COOLDOWN`.
* **Parameters:** `recipename` (string or `nil`) – name of the recipe just built; returns early if `nil`.
* **Returns:** Nothing.

### `OnFinishedWork(target, action)`
* **Description:** Triggers speech when the axe (if currently equipped) finishes a work action. Only fires for `ACTIONS.CHOP` actions.
* **Parameters:**  
  - `target` (`Entity`) – the work target.  
  - `action` (`Action`) – the completed action type.
* **Returns:** Nothing.

### `OnWereEaterChanged(old, new, istransforming)`
* **Description:** Alerts the owner when their Werebeaver transformation progress changes (earlier than full transformation). Only speaks on decremented levels and when the axe is held.
* **Parameters:**  
  - `old` (number) – previous werebeaver level.  
  - `new` (number) – current werebeaver level.  
  - `istransforming` (boolean) – whether currently mid-transformation.
* **Returns:** Nothing.
* **Error states:** Returns early if `istransforming`, `new <= old`, or the axe is not held (`inventoryitem:IsHeld()` returns false).

### `OnBecomeHuman()` and `OnBecomeWere()`
* **Description:** Triggers transformation-specific speech when the owner transitions between human and Werebeaver forms, but only if the owner is nearby (`TALK_TO_OWNER_DISTANCE = 15`). Cancels pending speech if the owner is out of range.
* **Parameters:** None.
* **Returns:** Nothing.

### `ShouldMakeConversation()`
* **Description:** Determines whether a conversation line can be safely spoken—e.g., the owner exists and is alive, not transforming, not a ghost.
* **Parameters:** None.
* **Returns:** `boolean` – `true` if conversation is allowed; otherwise `false`.

### `ScheduleConversation(delay)`
* **Description:** Schedules the next generic conversation line (e.g., talking about being in backpack, equipped, or on the ground) after a randomized interval.
* **Parameters:** `delay` (number or `nil`) – optional override delay in seconds; defaults to `10 + random * 5`.
* **Returns:** Nothing.

### `MakeConversation()`
* **Description:** Chooses and speaks a context-aware line based on the axe's current state (grounded, equipped, or in container), then reschedules the next conversation.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"axepossessedbyplayer"` – triggers `SetOwner(player)` via external handler.  
  - `"axerejectedowner"` – triggers `Say(STRINGS.LUCY.other_owner)`.  
  - `"axerejectedotheraxe"` – triggers speech and cancels pending speech on the conflicting axe.  
  - `"ondropped"` – triggers ground-based speech.  
  - `"equipped"` – triggers speech upon pickup *if* the owner matches.  
  - `"builditem"` (on owner) – reports carving actions.  
  - `"finishedwork"` (on owner) – reports chopping actions.  
  - `"wereeaterchanged"` (on owner) – warns about transformation progression.  
  - `"startwereplayer"` / `"stopwereplayer"` (on owner) – reports transformation transitions.
- **Pushes:** None directly (uses internal tasks for scheduling; events are dispatched via `inst:PushEvent(...)` only in related handlers outside this component).
