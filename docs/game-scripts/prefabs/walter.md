---
id: walter
title: Walter
description: Character-specific component for Walter, managing Woby integration, mounted command wheel, sanity mechanics, storytelling, and sprint trail effects.
tags: [player, character, combat, ai, network]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4d12310f
system_scope: player
---

# Walter

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`walter.lua` defines the character prefab and shared logic for Walter in DST. It integrates Woby (a controllable companion) as Walter’s exclusive pet, implements a mounted command wheel (spellbook-based), manages sanity tied to tree proximity and damage taken, supports campfire storytelling, and handles Woby courier features (chest tracking, trail FX/sounds). The logic is split between `common_postinit` (client/server agnostic) and `master_postinit` (server-only), using component hooks and event listeners for synchronization and gameplay behaviors.

## Usage example
```lua
local Walter = require("prefabs/walter")
local walter_prefab = Walter[1]

-- Spawn Walter with default stats and components
local inst = walter_prefab()
inst:AddTag("player")
inst:AddComponent("player_controller")
inst:AddComponent("health")
inst:AddComponent("sanity")
-- Use inst.components.wobycourier, inst.components.spellbook, etc., as needed
```

## Dependencies & tags
**Components used:** `builder`, `colourtweener`, `eater`, `focalpoint`, `foodaffinity`, `fueled`, `health`, `hunger`, `petleash`, `playeractionpicker`, `playercontroller`, `rideable`, `rider`, `sanity`, `sanityaura`, `skilltreeupdater`, `sleepingbaguser`, `spellbook`, `storyteller`, `temperature`, `timer`, `updatelooper`, `wobycourier`.

**Tags added:** `expertchef`, `pebblemaker`, `pinetreepioneer`, `allergictobees`, `slingshot_sharpshooter`, `dogrider`, `nowormholesanityloss`, `storyteller`, `NOBLOCK`, `FX`, `NOCLICK`, `CLASSIFIED`, `globalmapicon`, `quagmire_shopper` (Quagmire mode only).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `woby` | entity or nil | `nil` | Reference to Walter’s current Woby pet instance. |
| `has_sprint_trail` | net_bool | `false` | Networked boolean controlling sprint trail rendering. |
| `_wobybuck_damage` | number | `0` | Cumulative damage taken while mounted on Woby before triggering a buck. |
| `_sanity_damage_protection` | SourceModifierList | (created) | Modifier list to scale sanity damage taken (e.g., from damage events). |
| `_tree_sanity_gain` | number | `0` | Bonus sanity gain rate based on nearby trees (threshold-based). |
| `_spells` | table | `{}` | Dynamic spell list for the mounted command wheel. |
| `_story_proxy` | entity or nil | `nil` | Proxy entity used during campfire storytelling. |
| `woby_commands_classified` | WobyCourier (component ref) | (via component) | Reference to WobyCourier component for courier and command logic. |
| `showchestbanner` | boolean or nil | `nil` | Flag to trigger a world-space banner/ping on chest location update. |
| `_tempfocus` | entity or nil | `nil` | Temporary focus source entity for client-only camera focus during chest recall. |
| `baglock` | any or nil | `nil` | Saved baglock state for Woby when stored/despawned. |
| `_sprinttrailsfx` | entity or nil | `nil` | Current sprint trail sound FX instance. |

## Main functions
### `GetDoubleClickActions(inst, pos, dir, target)`
* **Description:** Provides double-click/dash action when the “walter_woby_dash” skill is active and Woby is mounted. Returns `{ACTIONS.DASH}` and the dash target position.
* **Parameters:** `pos` (vec2 or nil), `dir` (vec2 or nil), `target` (entity or nil) — See comments for details on usage context.
* **Returns:** `{ actions = table, pos2 = vec3? }` — Either `{}` or `{DASH} + pos2`.
* **Error states:** Returns `EMPTY_TABLE` if skill not unlocked, no mount, or mount is not Woby.

### `GetPointSpecialActions(inst, pos, useitem, right, usereticulepos)`
* **Description:** Adds a whistle action when `right` click is used, controller attached, and whistle is valid (Woby is out of range or in special state).
* **Parameters:** As per playeractionpicker signature.
* **Returns:** `{}` or `{ACTIONS.WHISTLE}`.
* **Error states:** Returns `{}` if conditions not met.

### `EnableMountedCommands(inst, enable)`
* **Description:** Enables or disables the mounted command wheel (spellbook items) based on mount status.
* **Parameters:** `enable` (boolean) — `true` sets spell items; `false` clears items and closes wheel if open.
* **Returns:** Nothing.

### `CreateWobyCourierBanner()`
* **Description:** Creates a non-networked banner FX entity for chest pings.
* **Parameters:** None.
* **Returns:** `inst` — Banner entity with “FX” and “NOCLICK” tags.

### `RefreshSpells(inst)`
* **Description:** Rebuilds `inst._spells` based on active skill tree skills, inserting blank spells and spacers to ensure correct wheel layout.
* **Parameters:** `inst` — Walter entity.
* **Returns:** Nothing. Modifies `inst._spells` in-place.

### `StoryToTellFn(inst, story_prop)`
* **Description:** Chooses a campfire story if it is night and a campfire has fuel; otherwise returns rejection strings.
* **Parameters:** `inst` — Walter entity; `story_prop` — potential campfire entity.
* **Returns:** `nil`, rejection strings (`"NOT_NIGHT"`, `"NO_FIRE"`), or `{ style = "CAMPFIRE", id = string, lines = ... }`.

### `CustomSanityFn(inst, dt)`
* **Description:** Custom sanity rate function combining tree-based gain and health-based drain.
* **Parameters:** `inst` — Walter entity; `dt` — delta time.
* **Returns:** number — net sanity delta per second.

### `UpdateTreeSanityGain(inst)`
* **Description:** Counts trees within `TUNING.WALTER_TREE_SANITY_RADIUS` and sets `_tree_sanity_gain` if threshold met.
* **Parameters:** `inst` — Walter entity.
* **Returns:** Nothing.

### `OnHealthDelta(inst, data)`
* **Description:** Converts incoming health loss into sanity loss using `WALTER_SANITY_DAMAGE_RATE` or `WALTER_SANITY_DAMAGE_OVERTIME_RATE`, scaled by damage protection.
* **Parameters:** `data.amount` (number), `data.overtime` (boolean?).
* **Returns:** Nothing.

### `OnAttacked(inst, data)`
* **Description:** Accumulates damage while riding Woby. Triggers Woby buck if `WALTER_WOBYBUCK_DAMAGE_MAX` is reached.
* **Parameters:** `data.damage` (number).
* **Returns:** Nothing.

### `OnMounted(inst, data)`
* **Description:** Enables mounted command wheel and sets temperature insulation when mounting Woby.
* **Parameters:** `data.target` — mounted entity.
* **Returns:** Nothing.

### `OnDismounted(inst, data)`
* **Description:** Disables mounted commands, resets insulation, and removes sanity modifier from Woby.
* **Parameters:** `data.target` — dismounted entity.
* **Returns:** Nothing.

### `SetupMountedCommandWheel(inst)`
* **Description:** Initializes `spellbook` component with Woby command wheel layout, sounds, and skill-based visibility.
* **Parameters:** `inst` — Walter entity.
* **Returns:** Nothing.

### `EnableWobySprintTrail_Server(inst, enable)`
* **Description:** (Server) Enables/disables sprint trail FX/sound via `has_sprint_trail` net_bool. Handles delayed disable logic.
* **Parameters:** `enable` (boolean).
* **Returns:** Nothing.

### `OnUpdateSprintTrail(inst, dt)`
* **Description:** (Client/server) Spawns/updates sprint trail FX and sound when Woby sprint/dash anims are active.
* **Parameters:** `dt` — delta time.
* **Returns:** Nothing.

### `OnSave(inst, data)`
* **Description:** Saves Woby (if alive), buck damage, and WobyCourier state.
* **Parameters:** `data` — save table to modify.
* **Returns:** Nothing.

### `OnLoad(inst, data)`
* **Description:** Loads Woby (if saved), restores buck damage and WobyCourier state.
* **Parameters:** `data` — saved table.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `healthdelta` — triggers sanity loss proportional to health damage.
  - `attacked` — manages Woby buck timer if mounted.
  - `mounted` / `dismounted` — toggles mounted commands and temperature insulation.
  - `setowner` — hooks player action picker double-click and point-special actions.
  - `ms_skilltreeinitialized` / `skilltreeinitialized_client` — refreshes spell wheel after skill tree readiness.
  - `onactivateskill_server` / `ondeactivateskill_server` — refreshes spells (server).
  - `onactivateskill_client` / `ondeactivateskill_client` — refreshes spells (client).
  - `isridingdirty` — updates mounted commands on client.
  - `has_sprint_trail_dirty` — syncs sprint trail state on client.
  - `enablemovementprediction` — cleans prediction state.
  - `ms_playerreroll` — handles reroll Woby cleanup.
  - `onremove` — cleans up proxy, Woby, and story state.
  - `entitysleep` / `entitywake` — enables/disables sprint trail update loop (server).
  - `updatewobycourierchesticon` — triggers chest icon update/ping.
- **Pushes:** None directly (relies on components and prefabs for event propagation).