---
id: targetindicator
title: Targetindicator
description: Renders a dynamic UI indicator widget above a target entity, updating position, scale, alpha, and avatar based on distance and character state.
tags: [ui, target,hud]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 13cdb1a4
system_scope: ui
---

# Targetindicator

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`TargetIndicator` is a UI widget component that displays a visual indicator above a specified target entity (typically a player or character). It automatically updates its position relative to the target on each frame, adjusts transparency and scale based on distance, and dynamically loads avatars (including mod character variants and ghost states). It is typically used in contexts like chat highlights, camera focus indicators, or player selection UIs.

## Usage example
```lua
local target = TheWorld.players[1]
local owner = ThePlayer
local indicator = CreateWidget("TargetIndicator", owner, target, { image = "custom_avatar.tex" })
indicator:Show()
-- The indicator will automatically follow the target, fade in/out with distance, and update when the target changes state (e.g., becomes a ghost).
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Does not manage or rely on entity tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `Entity` | `nil` | The entity (usually the local player) whose screen position is used for calculating the indicator's location. |
| `target` | `Entity` | `nil` | The entity being indicated; its position drives the indicator's on-screen placement. |
| `config_data` | table | `{}` | Optional configuration, supports `atlas` and `image` overrides for the avatar texture. |
| `userflags` | number | `0` | Cached network user flags used to detect character state changes (e.g., ghost, mod states). |
| `isGhost` | boolean | `false` | Whether the target is currently a ghost (used to select avatar background). |
| `isCharacterState1`, `isCharacterState2`, `isCharacterState3` | boolean | `false` | Mod character-specific state flags (e.g., for characters with multiple forms or skins). |
| `is_mod_character` | boolean | `false` | Whether the target is a registered mod character (determines avatar loading path). |
| `colour` | `{ r, g, b }` | `nil` | Player-specific color (e.g., from `target.playercolour` or `PORTAL_TEXT_COLOUR`), used for tinting frame, arrow, and label. |
| `startindicatortask` | task handle | `nil` | Delayed task used to defer UI updates until the target is valid. |
| `name_label` | `Text` widget | `nil` | Widget displaying the target's display name; shown on focus. |

## Main functions
### `GetTargetIndicatorAlpha(dist)`
* **Description:** Computes the alpha transparency of the indicator based on the distance `dist` from the owner. Fully opaque within `TUNING.MAX_INDICATOR_RANGE`, fading to `MIN_ALPHA` at `TUNING.MAX_INDICATOR_RANGE*2`.
* **Parameters:** `dist` (number) — Euclidean distance to the target.
* **Returns:** number — Alpha value in `[MIN_ALPHA, 1]`.
* **Error states:** Clamps `dist` to `TUNING.MAX_INDICATOR_RANGE*2` for safety.

### `OnUpdate()`
* **Description:** Main update loop. Reads target position, computes scale and alpha based on distance, updates avatar textures if state changes (e.g., ghosting), and applies tints and scaling. If `TheNet:IsServerPaused()` is true, returns early.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Silently exits if the target is invalid (`not self.target:IsValid()`).

### `UpdatePosition(targX, targZ)`
* **Description:** Calculates and sets the indicator’s screen position using `GetIndicatorLocationAndAngle`, factoring in combined size and current scale.
* **Parameters:**  
  * `targX` (number) — Target’s world X coordinate.  
  * `targZ` (number) — Target’s world Z coordinate.  
* **Returns:** Nothing.  
* **Error states:** None — assumes `GetIndicatorLocationAndAngle` is well-behaved.

### `PositionArrow()`
* **Description:** Positions the scroll arrow widget relative to the indicator’s center and rotation angle.
* **Parameters:** None.
* **Returns:** Nothing.

### `PositionLabel()`
* **Description:** Positions the target name label widget below and behind the arrow.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetAvatarAtlas()`
* **Description:** Returns the texture atlas path for the target’s avatar, prioritizing mod-specific paths for registered mod characters and appending state suffixes (`_1`, `_2`, `_3`) or `avatar_ghost_` if applicable.
* **Parameters:** None.
* **Returns:** string — Path to the avatar XML atlas.

### `GetAvatar()`
* **Description:** Returns the texture filename for the target’s avatar, using `config_data.image` if provided, otherwise constructing a path from prefab name and state flags (or `"avatar_unknown.tex"` on failure).
* **Parameters:** None.
* **Returns:** string — Texture filename (e.g., `"avatar_wilson.tex"`).

### `GetTarget()`
* **Description:** Returns the entity being tracked by this indicator.
* **Parameters:** None.
* **Returns:** `Entity` — The target instance.

### `OnGainFocus()`
* **Description:** Makes the name label visible when the widget receives focus.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnLoseFocus()`
* **Description:** Hides the name label when the widget loses focus.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `OnRemoveEntity` — Assigned to `CancelIndicator`, which cancels pending start tasks and cleans up references.  
- **Pushes:** None identified.