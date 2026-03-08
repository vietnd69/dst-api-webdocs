---
id: skinspuppet
title: Skinspuppet
description: Manages character appearance and animation playback for skin customization UI, including idle emotes, clothing changes, and skin-specific animations.
tags: [ui, skin, animation, character]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: ebc68964
system_scope: ui
---

# Skinspuppet

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SkinsPuppet` is a UI widget used in the character skin selection screen to preview character appearances, animations, and clothing. It extends `Button` and manages a `UIAnim` instance to display character idle and emote animations, handle skin switching, and support character-specific behaviors (e.g., Wolfgang's skin modes, Willow/Woodie's held items). It integrates with the `skinner` component indirectly via `GetSkinData`, `SetSkinsOnAnim`, and `GetSkinModes`, but does not directly attach or reference any components via `inst.components`.

## Usage example
```lua
local puppet = SkinsPuppet(emote_min_time, emote_max_time)
puppet:SetCharacter("wilson")
puppet:SetSkins("wilson", "wilson_none", { body = "body_cloth", hand = "hand_none", legs = "legs_cloth", feet = "feet_boots" })
puppet:DoEmote("emote_hat")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Does not add or manage tags directly.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `emote_min_time` | number | `6` (from `emote_min_time`) | Minimum time (in seconds) between automatic idle emotes. |
| `emote_max_time` | number | `12` (from `emote_max_time`) | Maximum time (in seconds) between automatic idle emotes. |
| `anim` | UIAnim | `nil` | Child animation widget controlling character pose. |
| `animstate` | AnimState | `nil` | Animation state instance used for playing and managing animations. |
| `currentanimbank` | string | `"wilson"` | Current animation bank used for idle and emote animations. |
| `current_idle_anim` | string | `"idle_loop"` | Current idle animation name. |
| `default_build` | string | `"wilson"` | Default character build used initially. |
| `last_skins` | table | `{ prefabname="", base_skin="", ... }` | Stores last-applied skin data to detect changes and trigger change emotes. |
| `enable_idle_emotes` | boolean | `true` | Controls whether idle emotes are triggered automatically. |
| `play_non_idle_emotes` | boolean | `true` | Controls whether non-idle emotes (e.g., clothing change emotes, idle emotes) are played. |
| `sitting` | boolean | `false` | Whether the puppet is currently in a sitting pose. |
| `prefabname` | string | `""` | Currently displayed character's prefab name. |
| `current_skinmode` | table | `nil` | Skin mode table (e.g., `{type="normal_skin", ...}`) used for animations. |
| `queued_change_slot` | string | `""` | Slot to change (e.g., `"base"`, `"body"`) when next triggered; used to delay change emotes. |
| `item_equip` | boolean | `false` | Indicates if an item (e.g., axe, Bernie) is currently equipped for idle animation. |
| `time_to_idle_emote` | number | `-1` | Time remaining until next idle emote (decremented in `EmoteUpdate`). |
| `time_to_change_emote` | number | `-1` | Time remaining until next change emote (e.g., clothing change). |

## Main functions
### `SetCharacter(character)`
*   **Description:** Sets the character build (e.g., `"wilson"`, `"wilson_cane"`) to use for animation states and overrides. Does *not* change skins or clothing; use `SetSkins` for full appearance changes.
*   **Parameters:** `character` (string) — the character build name (e.g., `"wilson"`).
*   **Returns:** Nothing.

### `SetSkins(prefabname, base_item, clothing_names, skip_change_emote, skinmode, monkey_curse)`
*   **Description:** Updates the puppet’s character, base skin, clothing layers, and skin mode. Handles character-specific idle animations, held items, and triggers change emotes when skin layers change. Supports mod characters via the `skinmode` table.
*   **Parameters:**
    *   `prefabname` (string) — character prefab name (e.g., `"wilson"`, `"wilmot"`).
    *   `base_item` (string, optional) — base skin item (defaults to `prefabname .. "_none"`).
    *   `clothing_names` (table) — table with keys `body`, `hand`, `legs`, `feet` representing skin names for each slot.
    *   `skip_change_emote` (boolean) — if `true`, skips scheduling change emotes regardless of skin differences.
    *   `skinmode` (table, optional) — skin mode table (see comment for structure); if `nil`, defaults to first mode from `GetSkinModes(prefabname)`.
    *   `monkey_curse` (any, optional) — monkey curse data (passed to `SetSkinsOnAnim`).
*   **Returns:** Nothing.
*   **Error states:** None documented.

### `DoEmote(emote, loop, force, do_push)`
*   **Description:** Plays a single emote animation (or sequence of animations) on top of the current state, optionally pushing multiple animations. Respects the `sitting` state and whether the current animation is `idle_loop`.
*   **Parameters:**
    *   `emote` (string or table) — animation name, or an array of animation names to play sequentially.
    *   `loop` (boolean, optional) — whether the final animation in the sequence should loop.
    *   `force` (boolean, optional) — if `true`, plays the emote even if not in `idle_loop` animation.
    *   `do_push` (boolean, optional) — if `true`, pushes the first animation onto the queue instead of playing immediately.
*   **Returns:** Nothing.

### `DoIdleEmote()`
*   **Description:** Randomly plays a character-specific idle emote (e.g., `idle_wilson`) or a generic emote (`emoteXL_waving1`, etc.). Handles special cases like Wolfgang’s skin modes, Willow/Woodie’s held items, and character-specific override builds.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `DoChangeEmote()`
*   **Description:** Plays a clothing-slot change emote (e.g., `emote_hat` for base, `emote_strikepose` for body) if `queued_change_slot` is non-empty.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `EmoteUpdate(dt)`
*   **Description:** Called regularly (e.g., every frame in UI loop) to manage timing and cleanup of idle/change emotes. Handles decrementing timers, restarting idle emotes after emotes finish, and clearing override builds.
*   **Parameters:** `dt` (number) — delta time in seconds.
*   **Returns:** Nothing.

### `Sit()`
*   **Description:** Forces the puppet into a sitting animation (`emote_loop_sit2`), darkens the color slightly, and disables idle emotes.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `AddShadow()`
*   **Description:** Adds a static shadow image beneath the puppet.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnGainFocus()`
*   **Description:** Overrides `Button.OnGainFocus`. If `enable_idle_emotes` is true, triggers an immediate idle emote if currently in `idle_loop`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `RemoveEquipped()`
*   **Description:** Called after `item_in` animation finishes to hide the carried item slot (`ARM_carry`) and restore the default arm slot (`ARM_normal`).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetBeard(beard)`
*   **Description:** Applies a beard skin override to the character’s beard symbol using the `beard` and `beard_length` state.
*   **Parameters:** `beard` (string, optional) — beard skin name (e.g., `"beard_default1"`, `"beard_wilson"`).
*   **Returns:** Nothing.

### `SetBeardLength(length)`
*   **Description:** Sets the numeric beard length index and triggers a beard update.
*   **Parameters:** `length` (number) — index (1–3) into beard arrays (e.g., `beards.wilson`).
*   **Returns:** Nothing.

### `_ResetIdleEmoteTimer()`
*   **Description:** Resets `time_to_idle_emote` to a random value between `emote_min_time` and `emote_max_time`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetSkinsOnAnim(...)`
*   **Description:** *Not defined in this file.* Called via `SetSkins(...)` and provided by the external `components/skinner.lua` module.

### `GetSkinData(...)`, `GetSkinModes(...)`, `IsPrefabSkinned(...)`, `Profile:GetLastUsedSkinForItem(...)`
*   **Description:** *Not defined in this file.* These are called via helper functions in `SetSkins(...)`.

## Events & listeners
- **Pushes:** None documented — this widget does not directly fire events via `inst:PushEvent`.
- **Listens to:** `OnGainFocus` — handled via `Button` base class; triggers idle emote if appropriate.
- ** Overrides `Button` behavior** via `OnGainFocus` but registers no custom event listeners in this file.