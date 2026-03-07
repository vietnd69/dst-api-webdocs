---
id: deerclopseyeball_sentryward
title: Deerclopseyeball Sentryward
description: A deployable structure that spawns cold-ice entities, reveals map area, overrides local temperature, and emits light and effects when an eyeball is inserted.
tags: [environment, structure, temperature, combat]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 25de9c3b
system_scope: environment
---

# Deerclopseyeball Sentryward

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `deerclopseyeball_sentryward` prefab represents a deployable structure that functions as a temperature-manipulating sentry. When an eyeball is inserted, it activates, revealing map area, emitting cold-based environmental effects, spawning ice rocks periodically, overriding local temperature, and emitting light. It responds to hammering and item insertion/removal events via the `workable`, `inventoryitemholder`, and `lootdropper` components. This prefab is typically built using a kit (`deerclopseyeball_sentryward_kit`) and placed via a placer (`deerclopseyeball_sentryward_kit_placer`). Its behavior is split between client and server (e.g., `net_bool` and `net_event` for synchronization), with dedicated server optimization.

## Usage example
```lua
local sentry = SpawnPrefab("deerclopseyeball_sentryward")
sentry.Transform:SetPosition(position)
-- Insert an eyeball to activate it
local eyeball = SpawnPrefab("deerclops_eyeball")
sentry.components.inventoryitemholder:GiveItem(eyeball)
```

## Dependencies & tags
**Components used:** `deployhelper`, `lighttweener`, `temperatureoverrider`, `maprevealer`, `lootdropper`, `inspectable`, `workable`, `inventoryitemholder`, `periodicspawner`, `temperature`, `freezable`, `burnable`, `grogginess`, `health`, `light`, `soundemitter`, `animstate`, `transform`, `minimapentity`, `network`

**Tags added:** `structure`, `maprevealer` (pre-added), `FX` (on child entities), `placer` (helper radius circle)

**Tags checked:** `playerghost`, `INLIMBO`, `flight`, `invisible`, and all `fueled` tags for exclusion; `heatrock`, `freezable`, `fire`, `smolder` for inclusion during ice radius processing

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_active` | `net_bool` | `false` | Tracks whether an eyeball is inserted (networked). Controls light, map reveal, and spawner activation. |
| `_onhit` | `net_event` | N/A | Client-side event trigger for visual hit feedback. |
| `eyeball` | `entity` or `nil` | `nil` | Client-only child entity (eyeball visual) that faces the player. Created when `_active` becomes `true`. |
| `helper` | `entity` or `nil` | `nil` | Client-only visual radius circle created during deployment. Tied to deploy helper state. |
| `ice` | `entity` or `nil` | `nil` | Client-only FX entity (`deerclopseyeball_sentryward_fx`) representing the central ice circle. Created on activation. |
| `icon` | `entity` or `nil` | `nil` | Map global icon used for tracking. Created on activation. |
| `_LIGHT_PARAMS` | `table` | `LIGHT_PARAMS` (local) | Reference to lighting configuration (ON/OFF). Available for modding override. |
| `scrapbook_anim`, `scrapbook_animpercent`, `scrapbook_hide` | Various | `"hit"`, `1`, `{ "eyeball", "crystal_hand_ice" }` | Metadata for scrapbook rendering. |

## Main functions
### `OnEyeballGiven(inst, item, giver)`
*   **Description:** Triggered when an `eyeball` is inserted. Activates the sentry: enables temperature override, starts map reveal and periodic spawner, enables light, shows eyeball visual FX, plays ambient sound, and updates minimap icon.
*   **Parameters:** `item` (entity) - the inserted eyeball; `giver` (entity or `nil`) - entity that gave the item.
*   **Returns:** Nothing.
*   **Error states:** Skips ambient sound on dedicated server if `TheWorld.ismastersim` is true. No side effects if called while already active.

### `OnEyeballTaken(inst, item, taker)`
*   **Description:** Triggered when the `eyeball` is removed. Deactivates the sentry: disables temperature override, stops map reveal and spawner, turns off light, removes FX, kills ambient sound, and resets minimap icon.
*   **Parameters:** `item` (entity) - the removed eyeball; `taker` (entity) - entity that took the item.
*   **Returns:** Nothing.
*   **Error states:** No side effects if called while already inactive.

### `OnActiveDirty(inst)`
*   **Description:** Handles full visual and component state changes when `_active` changes (e.g., light, minimap, FX, symbol bloom, and eyeball creation/removal). Called automatically on state change and when client receives `"activedirty"` event.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** On client, creates `eyeball` only if not `TheNet:IsDedicated()`. Light tween callbacks ensure light is disabled after tween completes.

### `GetStatus(inst)`
*   **Description:** Returns a status string for `inspectable` component. Returns `"NOEYEBALL"` when inactive (no eyeball), or `nil` when active.
*   **Parameters:** None.
*   **Returns:** `"NOEYEBALL"` or `nil`.

### `OnHammered(inst)`
*   **Description:** Callback for the `workable` component when the sentry is fully hammered. Drops loot, spawns collapse FX, removes inventory item if present, and removes the entity.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None.

### `OnHit(inst)`
*   **Description:** Callback for the `workable` component on partial hammer strikes. Triggers hit animation and pushes `_onhit` event for visual feedback.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None.

### `OnBuiltFn(inst)`
*   **Description:** Runs once on build completion. Plays placement sound and animation.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None.

### `CLIENT_CreateEyeball()`
*   **Description:** (Client-only) Creates the eyeball visual child entity that continuously faces the player.
*   **Parameters:** None (uses `inst` closure).
*   **Returns:** Entity - the created eyeball visual.
*   **Error states:** Only instantiated on clients; always returns `nil` on dedicated servers.

### `KillFX(inst)`
*   **Description:** (For `deerclopseyeball_sentryward_fx` child) Stops periodic updates, plays post animation, and schedules entity removal.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No-op if already killed (`inst.killed` is true).

## Events & listeners
- **Listens to:**
  - `"onbuilt"` → `OnBuiltFn`
  - `"activedirty"` (client) → `OnActiveDirty`
  - `"deerclopseyeball_sentryward._onhit"` (client) → `PlayEyeballHitAnim`
  - `"death"` (via `MakeHauntableWork`)
  - `"onremove"` and `"onentitysleep"`/`"onentitywake"` (via internal callbacks)

- **Pushes:**
  - `"activedirty"` (via `inst._active:set(...)` and `inst:OnActiveDirty()`) — triggers `OnActiveDirty`
  - `"deerclopseyeball_sentryward._onhit"` — triggers client hit animation
  - `"entity_droploot"` (via `LootDropper.DropLoot`)
  - `"onextinguish"` (via `Burnable.Extinguish`)
  - `"startfreezing"` / `"stopfreezing"` / `"startoverheating"` / `"stopoverheating"` / `"temperaturedelta"` (via `Temperature.SetTemperature`)
  - `"groggy"` / `"knockout"` (via `Grogginess.AddGrogginess`/`IsKnockedOut`)
