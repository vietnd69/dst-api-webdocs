---
id: flotsamgenerator
title: Flotsamgenerator
description: Manages the spawning, tracking, and sinking of flotsam objects in the ocean world.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: mod_component

source_hash: 21ec6175
---

## Overview

The `flotsamgenerator` component (typically attached to a `world` or `server`-side entity) handles **scheduled flotsam spawning**, including both random and guaranteed flotsam, per-player. It tracks all flotsam instances, ensures proper lifetime management (sinking), and supports persistence across saves.

### Key Responsibilities

- **Scheduled spawner**: Spawns flotsam at intervals per player (based on `_minspawndelay`, `_maxspawndelay`, `_maxflotsam`).
- **Guaranteed spawner**: Ensures at least one flotsam per player (based on `guaranteed_presets`).
- **Flotsam tracking**: Keeps an internal registry (`_flotsam`) to manage entities until they sink.
- **Sinking behavior**: Removes flotsam after a configurable lifetime, using a timer and fallback fallback sink logic.
- **Saving & loading**: Persists flotsam timers, tags, and presence across game saves.

---

## Public API

### `self:ToggleUpdate(force: boolean?) → void`
Manages the spawning loop:
- If `_maxflotsam > 0`, starts or restarts spawning for all active players.
- If `_maxflotsam ≤ 0`, cancels all active timers.
- `force = true` cancels and restarts all timers.

### `self:SetSpawnTimes(delay: table)` → void *(deprecated)*
> ⚠️ Deprecated: Use `birdattractor.spawnmodifier` instead.

### `self:SpawnFlotsam(spawnpoint: Entity, prefab: string?, notrealflotsam: boolean?) → Entity`
Spawns a flotsam entity:
- If `prefab` is omitted, uses `weighted_random_choice(flotsam_prefabs)`.
- `notrealflotsam = true` skips adding the `"flotsam"` tag (useful for deco items).
- Applies rotation, position, and sinking timer.

### `self:SetInstToFlotsam(inst: Entity, time: number?, notag: boolean?) → void`
Assigns flotsam behavior to an entity:
- Adds `"flotsam"` tag unless `notag = true`.
- Sets a sink timer using `"flotsamgenerator_sink"`.
- Registers event handlers for:
  - `timerdone` → sink logic (`OnTimerDone`)
  - `onpickup` / `onremove` → cleanup (`clearflotsamtimer`)
- Registers `rememberflotsam(inst)`.

### `self:ScheduleGuaranteedSpawn(player: Entity, preset: table, override_time: number?) → void`
Schedules guaranteed flotsam for `player` based on `preset` (e.g., `"shipwreck"`, `"driftwood"`).
- Calls `SpawnGuaranteedFlotsam()` after a delay.
- If spawn fails (`flotsam == nil`), reschedules for retry (via `GUARANTEED_FLOTSAM_REATTEMPT_DELAY`).

---

## Event Callbacks

| Event | Handler | Notes |
|-------|---------|-------|
| `"ms_playerjoined"` | `OnPlayerJoined(src, player)` | Adds player to `_activeplayers`, spawns flotsam and guaranteed items. |
| `"ms_playerleft"` | `OnPlayerLeft(src, player)` | Cancels tasks and removes player. |
| `"timerdone"` | `OnTimerDone(inst, data)` | Triggers sinking when timer expires. |
| `"entitysleep"` | `OnTargetSleep(target)` | Schedules auto-removal when target goes to sleep (via `AutoRemoveTarget`). |
| `"onpickup"` / `"onremove"` | `clearflotsamtimer(inst)` | Cancels sink timer on pickup or removal. |

---

## Internal State Variables

| Variable | Type | Purpose |
|---------|------|---------|
| `_activeplayers` | `table<Entity>` | List of currently active players. |
| `_flotsam` | `table<Entity → bool>` | Tracks spawned flotsam (key: entity, value: persists state). |
| `_guaranteed_spawn_tasks` | `table<Entity → table<preset → Task>>` | Per-player scheduled guaranteed spawns. |
| `_updating` | `boolean` | Is the spawn loop active? |
| `_maxflotsam` | `number` | Maximum flotsam to keep spawned. |
| `_minspawndelay`, `_maxspawndelay` | `number` | Spawn interval range (deprecated). |

---

## Persistence (Save/Load)

### `self:OnSave() → data, ents`
Returns:
- `data`: `maxflotsam`, delays, and tables for:
  - `flotsam`: GUIDs of tracked entities.
  - `time`: Remaining sink time.
  - `flotsamtag`: Whether `"flotsam"` tag was present.
- `ents`: list of all flotsam GUIDs for entity lookup.

### `self:OnLoad(data)`
Restores `_maxflotsam`, delays, and calls `ToggleUpdate(true)` to resume.

### `self:LoadPostPass(newents, savedata)`
Re-attaches flotsam behavior to saved entities:
- Uses `newents[v].entity` to locate entity.
- Applies correct `time` and `notag` based on saved data.

---

## Utility Hooks & Helpers

| Function | Description |
|----------|-------------|
| `StartGuaranteedSpawn(player)` | Starts scheduled guaranteed spawns for a player. |
| `PickFlotsam(spawnpoint)` | Returns a random flotsam prefab via weighted choice. |
| `rememberflotsam(inst)`, `forgetflotsam(inst)` | Add/remove from `_flotsam`. |
| `AutoRemoveTarget(inst, target)` | Removes sleeping flotsam after a brief delay. |
| `clearflotsamtimer(inst)` | Cancels sink timer and untracks. |
| `OnTargetSleep(target)` | Listens for sleep to auto-remove. |

---

## Sinking Behavior

When the `"flotsamgenerator_sink"` timer expires:
1. `forgetflotsam(inst)` → removes from internal tracking.
2. If `inst.overrideflotsamsinkfn` exists, call it.
3. Else: spawns `"splash_sink"` prefab at position, and `inst:Remove()`.

---

## Debug & Observability

| Function | Description |
|---------|-------------|
| `self:GetDebugString()` | Returns `"flotsam:X/Y"` where X = tracked count, Y = `_maxflotsam`. |

---

## Example Usage (Modding)

```lua
-- Spawn a custom flotsam for testing
local flotsam = worldentity.components.flotsamgenerator:SpawnFlotsam(
    player:GetPosition(),
    "my_custom_driftwood"
)

-- Schedule a guaranteed flotsam for player
worldentity.components.flotsamgenerator:ScheduleGuaranteedSpawn(
    player,
    {prefabs={"driftwood_bundle"}, rate=30, variance=10}
)
```

---

## Notes & Best Practices

- **Always use `SpawnFlotsam` for new flotsam** — it sets up timers and tracking automatically.
- **Don’t manually `inst:Remove()`** flotsam without calling `clearflotsamtimer`, or tracking gets out of sync.
- `_flotsam` is *not* persisted directly — only metadata is saved. Entities are re-tracked on load.
- Avoid `SetSpawnTimes()` — use `"birdattractor"`'s modifier system instead.
- `"flotsam"` tag matters: removal from the registry only happens on sink (or pickup), regardless of tag. But *not* tagging (`notrealflotsam=true`) allows more overlap in spawn count.

---

Let me know if you want:
- A visual state diagram of spawn/sink logic,
- Example `guaranteed_presets` schema,
- How to integrate this with `birdattractor` or `seagull`,
- Or a test/mod example for custom flotsam logic.