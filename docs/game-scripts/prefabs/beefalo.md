---
id: beefalo
title: Beefalo
description: Manages the lifecycle, behavior, and interactions of the Beefalo entity, including domestication, tending, riding, and state transitions.
tags: [entity, ai, domestication, combat, locomotion]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4f40f95d
system_scope: entity
---

# Beefalo

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `beefalo` prefab implements the core logic for the Beefalo entity in Don't Starve Together. It integrates multiple components to model animal behaviors such as domestication progression, mood-driven aggression (heat), tending (brushing/shaving), riding mechanics, and herd membership. The prefab defines state-dependent animations, sound behaviors, and dynamic build overrides for body, horns, tail, head, and feet skins. It also handles save/load synchronization and special event integration (e.g., Carrats). Key interactions include being ridden, brushed, shaved, fed, attacked, and hitched to posts.

## Usage example
```lua
local beefalo = Prefabs["beefalo"]()
beefalo.Transform:SetPosition(x, y, z)
beefalo:AddToWorld()

-- Domesticate via feeding
local food = SpawnPrefab("berries")
beefalo.components.eater:Eat(food, player)

-- Brush to gain obedience
beefalo.components.brushable:Brush(player)

-- Set bell owner to bind to a player
local bell = SpawnPrefab("shadowbell")
fns.SetBeefBellOwner(beefalo, bell, player)

-- Check mood status
if beefalo.components.domesticatable.tendencies[TENDENCY.ORNERY] > 0 and beefalo.components.mood and beefalo.components.mood:IsInMood() then
    print("Beefalo is in heat!")
end
```

## Dependencies & tags
**Components used:**  
`planardamage`, `bloomer`, `beard`, `brushable`, `eater`, `combat`, `health`, `lootdropper`, `inspectable`, `knownlocations`, `leader`, `follower`, `periodicspawner`, `rideable`, `trader`, `hunger`, `domesticatable`, `locomotor`, `sleeper`, `timer`, `saltlicker`, `uniqueid`, `beefalometrics`, `drownable`, `colouradder`, `skinner_beefalo`, `named`, `writeable`, `hitchable`, `colourtweener`, `markable_proxy`.

**Tags added/checked:**  
`beefalo`, `animal`, `largecreature`, `bearded`, `trader`, `herdmember`, `saddleable`, `domesticatable`, `saltlicker`, `has_beard`, `HasCarrat`, `scarytoprey`, `deadcreature`, `give_dolongaction`, `NOCLICK`, `companion`, `notraptrigger`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `tendency` | string | `TENDENCY.DEFAULT` | Current behavioral tendency: `DEFAULT`, `ORNERY`, `RIDER`, or `PUDGY`. |
| `_bucktask` | task or `nil` | `nil` | Task reference for automatic bucking while being ridden. |
| ` skins` | table | `{}` | Dynamic skin strings for `base_skin`, `beef_body`, `beef_head`, `beef_horn`, `beef_feet`, `beef_tail`. |
| `_carratcolor` | string or `nil` | `nil` | Color data for Carrat attachment when active. |
| ` _marked_for_despawn` | boolean or `nil` | `nil` | Flag indicating entity is queued for removal (e.g., via bell). |

## Main functions
### `fns.SetBeefBellOwner(inst, bell, bell_user)`
*   **Description:** Binds the Beefalo to a Bell (e.g., Shadow Bell) and assigns a leader, enabling special behaviors like persistent leash and no-charring. Returns `true` if successful, or `false, "ALREADY_USED"` otherwise.
*   **Parameters:**  
    `bell` (entity) — The bell entity to hitch to.  
    `bell_user` (player or `nil`) — The player who initiated the binding.
*   **Returns:** `true` on success; `false, "ALREADY_USED"` if already bound.
*   **Error states:** Fails if the Beefalo already has a leader.

### `fns.ClearBellOwner(inst)`
*   **Description:** Removes the Bell leader assignment, resets domestication flags, restores charring, and prepares the entity for normal despawn.
*   **Parameters:** None.
*   **Returns:** None.

### `fns.OnDespawnRequest(inst)`
*   **Description:** Handles despawning via visual tween effect, typically called when the Bell expires. Plays animation, applies color tween, and schedules removal.
*   **Parameters:** None.
*   **Returns:** None.

### `fns.OnNamedByWriteable(inst, new_name, writer)`
*   **Description:** Sets the named component's value when the Beefalo is written to while being held.
*   **Parameters:**  
    `new_name` (string) — The written name.  
    `writer` (player or `nil`) — The writing player.
*   **Returns:** None.

### `fns.OnWritingEnded(inst)`
*   **Description:** Clears the leader if writing ends without finalizing the name, allowing re-hitching.
*   **Parameters:** None.
*   **Returns:** None.

### `fns.UnSkin(inst)`
*   **Description:** Removes all clothing/skins from the Beefalo. If sleeping, clears instantly; otherwise transitions via `skin_change` state.
*   **Parameters:** None.
*   **Returns:** None.

### `fns.OnRevived(inst, revive)`
*   **Description:** Resets health to full and transitions to `revive` state. Restarts components paused on death.
*   **Parameters:** `revive` (entity or `nil`) — Revival source (unused).
*   **Returns:** None.

### `SetTendency(inst, changedomestication)`
*   **Description:** Computes or sets the Beefalo's behavioral tendency based on domestication stats and triggers associated build and stat updates.
*   **Parameters:**  
    `changedomestication` (string or `nil`) — Either `"domestication"`, `"feral"`, or `nil`. Triggers `customactivatefn`/`customdeactivatefn`.
*   **Returns:** None.

### `UpdateDomestication(inst)`
*   **Description:** Calls `DoDomestication()` or `DoFeral()` depending on current domestication state to update behavior, leader binding, and map visibility.
*   **Parameters:** None.
*   **Returns:** None.

### `DoDomestication(inst)`
*   **Description:** Activates domesticated state: disables herd membership, sets `MiniMapEntity` enabled, and applies domesticated build.
*   **Parameters:** None.
*   **Returns:** None.

### `DoFeral(inst)`
*   **Description:** Activates feral state: enables herd membership, disables `MiniMapEntity`, and resets behavior.
*   **Parameters:** None.
*   **Returns:** None.

## Events & listeners
- **Listens to:**  
  `entermood`, `leavemood`, `newcombattarget`, `attacked`, `domesticated`, `goneferal`, `obediencedelta`, `domesticationdelta`, `beingridden`, `riderchanged`, `riderdoattackother`, `hungerdelta`, `ridersleep`, `hitchto`, `unhitch`, `despawn`, `stopfollowing`, `saltchange`, `onwenthome`, `saddlechanged`, `refusedrider`, `healthdelta`, `death`, `onclothingchanged`, `entitysleep`.  
- **Pushes:**  
  `eat`, `leaderchanged`, `colourtweener_start`, `onwakeup`, `carratboarded`, `mountwounded`, `onclothingchanged`.