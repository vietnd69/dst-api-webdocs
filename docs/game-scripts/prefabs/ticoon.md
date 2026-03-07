---
id: ticoon
title: Ticoon
description: A companion entity that tracks and retrieves hidden Kitcoons for a player leader, with combat and quest management capabilities.
tags: [combat, quest, follower, npc, animal]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ea959805
system_scope: entity
---

# Ticoon

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`ticoon` is a companion prefab that acts as a quest-driven NPC. It is spawned via a `ticoon_builder` and binds to a player as its leader. Once spawned, it tracks down hidden "hiding spots" containing Kitcoons, announces progress, and completes a quest upon retrieval. It supports combat, sleep synchronization with its leader, platform hopping, and loss-of-leader recovery logic.

The component heavily integrates with `questowner`, `follower`, `combat`, `entitytracker`, and `sleeper` components to manage its behavior and state.

## Usage example
```lua
-- Spawn a ticoon for a specific player
local ticoon = SpawnPrefab("ticoon")
ticoon.Transform:SetPosition(x, y, z)
ticoon.components.questowner:BeginQuest(player)
```

## Dependencies & tags
**Components used:** `combat`, `eater`, `embarker`, `entitytracker`, `follower`, `health`, `inspectable`, `locomotor`, `lootdropper`, `questowner`, `sleeper`, `talker`  
**Tags added:** `smallcreature`, `companion`, `animal`, `ticoon`, `NOBLOCK`, `handfed`  
**Tags checked:** `debuffed`, `decoration`, `sleeping` (indirectly), `questcomplete` (via replica)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `status_str` | string | `nil` | Current quest status: `"TRACKING"`, `"SUCCESS"`, `"LOST_TRACK"`, `"NOTHING_TO_TRACK"`, `"ABANDONED"`, `"NEARBY"`. Used for UI/inspection. |
| `persists` | boolean | `true` (initially) | Determines whether the entity is saved during world shutdown. Set to `false` upon quest completion or abandonment. |
| `lost_leader_removal` | Task | `nil` | Delayed task that abandons the quest if the leader is missing for 120 seconds (for client reconnection handling). |
| `hidingspot_onremove` | function | `nil` | Event callback for when the target hiding spot is removed (found, deleted, etc.). |

## Main functions
### `TrackNewKitcoonForPlayer(inst, player)`
* **Description:** Initiates the tracking quest by adding the ticoon as a follower of the player and starting pursuit of the nearest hidden hiding spot. Handles case where no hiding spots are available.
* **Parameters:**  
  `inst` (Entity) — the ticoon instance.  
  `player` (Entity) — the player who will become the leader and quest owner.  
* **Returns:** `true` if a quest was started (follower added), `false` otherwise.

### `hidingspot_onremove(inst, hidingspot, data)`
* **Description:** Handles the completion or loss of a tracking task. Updates status, stops movement, notifies the leader (if applicable), and fires the `ticoon_kitcoonfound` event.
* **Parameters:**  
  `inst` (Entity) — the ticoon instance.  
  `hidingspot` (Entity) — the now-removed hiding spot entity.  
  `data` (table) — event payload, may include `finder`.  
* **Returns:** None.

### `on_abandon_quest(inst)`
* **Description:** Abandons the current quest, cleans up tracking listeners and entities, announces status to the leader, and fires `ticoon_abandoned`.
* **Parameters:**  
  `inst` (Entity) — the ticoon instance.  
* **Returns:** `true` — quest abandonment succeeded.

### `on_complete_quest(inst)`
* **Description:** Marks the quest as completed (status = `"NEARBY"`), notifies the leader, and stops following.
* **Parameters:**  
  `inst` (Entity) — the ticoon instance.  
* **Returns:** None.

## Events & listeners
- **Listens to:**  
  `attacked` — triggers `OnAttacked`, which abandons the quest if the attacker is the leader and sets combat target.  
  `stopleashing` — triggers `on_lost_leader`, which schedules quest abandonment if leader is lost.  
  `onremove` — attached to the target hiding spot, triggers `hidingspot_onremove`.  
  `onhidingspotremoved` — same as above, for alternative trigger.  
  `death` — auto-listened via `Leader:AddFollower` to remove followers when leader dies.  
  `onremove` — auto-listened for follower removal.

- **Pushes:**  
  `ticoon_kitcoonfound` — fired when the target hiding spot is found/removed.  
  `ticoon_abandoned` — fired when quest is explicitly abandoned.  
  `loseloyalty` — fired via `Follower:StopFollowing`.  
  `startfollowing` — fired via `Leader:AddFollower`.