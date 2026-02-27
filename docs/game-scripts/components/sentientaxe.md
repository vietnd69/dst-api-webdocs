---
id: sentientaxe
title: Sentientaxe
description: This component enables an axe to dynamically speak to its owner based on gameplay events such as equipping, chopping, building, and Werebeaver transformation states.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: b623b817
---

# Sentientaxe

## Overview
The `sentientaxe` component imparts personality and contextual awareness to an axe (typically the Woodie Axe), enabling it to vocalize reactions and commentary via the `lucy_classified` component when equipped by or associated with a player. It tracks ownership, schedules periodic conversational prompts, and responds to player actions and state changes (e.g., chopping, carving,Werebeaver transformation).

## Dependencies & Tags
**Component Dependencies:**
- `inst.components.equippable` (for equip/hold status checks)
- `inst.components.inventoryitem` (for ownership, held status, and container placement)
- `inst.components.health` (indirectly, to check if owner is dead)
- `inst.lucy_classified` (assumed to be the speech component, used via `.Say()`)
- `inst.sg` (stategraph, used to check transformation state tags)

**Tags:**
- No new tags are added or removed by this component itself.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the axe entity this component is attached to. |
| `owner` | `Entity?` | `nil` | The current player who owns this axe (set via `SetOwner`). |
| `convo_task` | `DoLaterTask?` | `nil` | Scheduled task for next spontaneous conversation. |
| `say_task` | `DoLaterTask?` | `nil` | Scheduled speech task (used for delayed or queued speech). |
| `warnlevel` | `number` | `0` | Unused in current logic (historical or reserved). |
| `waslow` | `boolean` | `false` | Unused in current logic (historical or reserved). |
| `_lastcarvingtalks` | `table<string, number>` | `{}` | Tracks last time each carving action triggered speech, keyed by `"carve_<recipe>"`. |

## Main Functions

### `SetOwner(owner)`
* **Description:** Assigns a new owner to the axe. Removes event listeners from the previous owner and attaches corresponding listeners to the new owner. Resets internal state (e.g., cooldowns, conversation tasks). If a new owner is assigned, it schedules an immediate or delayed conversation based on state.
* **Parameters:**
  - `owner` (`Entity?`): The player entity becoming the new owner. If `nil`, the axe becomes unowned and stops listening for owner-specific events.

### `OnBuildItem(recipename)`
* **Description:** Triggers a contextual remark when the axe’s owner completes crafting a recipe. Only triggers if the recipe has a defined comment string (in `STRINGS.LUCY["carve_<recipe>"]`) and the cooldown (defined by `TUNING.LUCY_CARVING_TALK_COOLDOWN`) has elapsed.
* **Parameters:**
  - `recipename` (`string?`): Name of the recipe just crafted (e.g., "loggy"). Returns early if `nil`.

### `OnFinishedWork(target, action)`
* **Description:** Triggers a comment when the axe finishes a work action. Specifically triggers on `ACTIONS.CHOP` if the axe is currently equipped and has an owner.
* **Parameters:**
  - `target` (`Entity?`): Target entity of the work action (unused in logic).
  - `action` (`string`): Action type (e.g., `"chop"`).

### `OnWereEaterChanged(old, new, istransforming)`
* **Description:** Issues warnings based on Woodie’s werebeaver hunger level (from `wereeater` component). Skips if transforming or if level didn’t decrease. Offers two levels of warnings (early/late) only when the axe is held.
* **Parameters:**
  - `old` (`number`): Previous hunger level.
  - `new` (`number`): New hunger level.
  - `istransforming` (`boolean`): Whether the transformation is currently in progress.

### `OnBecomeHuman()`
* **Description:** Speaks when Woodie reverts to human form (near owner only). Cancels pending speech if not near.
* **Parameters:** None.

### `OnBecomeWere()`
* **Description:** Speaks when Woodie transforms into a werebeaver (near owner only). Cancels pending speech if not near.
* **Parameters:** None.

### `Say(list, sound_override, delay)`
* **Description:** Plays a random line from `list` (array of strings) using `lucy_classified:Say()`, optionally with a custom sound override. Supports delayed speech via `delay`. Cancels any pending speech first. Resets conversation scheduling timer after speech (if owner exists).
* **Parameters:**
  - `list` (`string[]`): List of possible speech lines to choose from.
  - `sound_override` (`string?`): Optional custom sound path.
  - `delay` (`number?`): Optional delay (in seconds or ticks) before speaking.

### `ScheduleConversation(delay)`
* **Description:** Schedules a future spontaneous conversation (e.g., quoting current item state). Cancels any existing conversation task.
* **Parameters:**
  - `delay` (`number?`): Time until next conversation. Defaults to `10 + random(0–5)` if omitted.

### `MakeConversation()`
* **Description:** Evaluates the axe’s current state and owner proximity to select and speak a contextual phrase: ground, equipped, or in container. Always reschedules the next conversation afterward.
* **Parameters:** None.

### `ShouldMakeConversation()`
* **Description:** Helper that determines if the axe *should* speak at this moment. Returns `false` if owner is dead, transforming, or a were/beaver ghost.
* **Parameters:** None.

## Events & Listeners
- Listens for `"axepossessedbyplayer"` → calls `OnAxePossessedByPlayer`.
- Listens for `"axerejectedowner"` → calls `OnAxeRejectedOwner`.
- Listens for `"axerejectedotheraxe"` → calls `OnAxeRejectedOtherAxe`.
- While owned, listens to:
  - `"ondropped"` → calls `toground`.
  - `"equipped"` → calls `onequipped`.
  - `"builditem"` (on owner) → calls `OnBuildItem`.
  - `"finishedwork"` (on owner) → calls `OnFinishedWork`.
  - `"wereeaterchanged"` (on owner) → calls `OnWereEaterChanged`.
  - `"startwereplayer"` (on owner) → calls `OnBecomeHuman`.
  - `"stopwereplayer"` (on owner) → calls `OnBecomeWere`.