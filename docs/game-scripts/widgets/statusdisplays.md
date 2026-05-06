---
id: statusdisplays
title: Statusdisplays
description: A comprehensive HUD widget that displays and updates player status metrics including health, hunger, sanity, moisture, and character-specific badges.
tags: [widget, ui, hud, status]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: widgets
source_hash: 78180d08
system_scope: ui
---

# Statusdisplays

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`StatusDisplays` is the primary HUD widget responsible for rendering player survival stats. It dynamically constructs child widgets for health, hunger, sanity, moisture, and character-specific mechanics (Werewolf, Battlesong, Mightiness, Pet Hunger). It manages event subscriptions to the owner player entity to update visuals in real-time and handles the transition between alive and ghost states. The widget adjusts its layout based on split-screen status and character tags.

## Usage example
```lua
local StatusDisplays = require("widgets/statusdisplays")

-- Inside a HUD Screen's _ctor:
self.status = self:AddChild(StatusDisplays(ThePlayer))
self.status:SetPosition(0, 0, 0)

-- Toggle numeric overlays:
self.status:ShowStatusNumbers()
self.status:HideStatusNumbers()

-- Force ghost mode (e.g., for preview or debug):
self.status:SetGhostMode(true)
```

## Dependencies & tags
**External dependencies:**
- `widgets/widget` -- Widget base class
- `widgets/sanitybadge` -- Sanity meter child widget
- `widgets/healthbadge` -- Health meter child widget
- `widgets/hungerbadge` -- Hunger meter child widget
- `widgets/werebadge` -- Werewolf transformation meter
- `widgets/moisturemeter` -- Wetness meter
- `widgets/boatmeter` -- Boat durability meter
- `widgets/pethealthbadge` -- Pet health display (Wendy)
- `widgets/pethungerbadge` -- Pet hunger display (Walter)
- `widgets/avengingghostbadge` -- Abigail vengeance timer
- `widgets/inspirationbadge` -- Battlesong inspiration meter
- `widgets/mightybadge` -- Strongman mightiness meter
- `widgets/resurrectbutton` -- Resurrection interaction button
- `widgets/uianim` -- Animation widget for FX
- `prefabs/wobycommon` -- Woby flag constants (inside SetupWobyPetHunger)

**Components used:**
- `attuner` -- Checks resurrection attunement on owner
- `avengingghost` -- Reads vengeance time on owner
- `pethealthbar` -- Reads pet health/skin data on owner
- `skilltreeupdater` -- Checks Walter's Woby skills
- `health` (replica) -- Reads health percent/penalty
- `hunger` (replica) -- Reads hunger percent
- `sanity` (replica) -- Reads sanity percent/penalty

**Tags:**
- `dogrider` -- Enables Pet Hunger badge (Walter)
- `wereness` -- Enables Werewolf badge (Wagstaff)
- `battlesinger` -- Enables Inspiration badge (Wigfrid)
- `strongman` -- Enables Mightiness badge (Wolfgang)
- `cave` -- World tag; affects Woby hunger drain logic

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | Entity | --- | The player entity this widget observes. |
| `brain` | SanityBadge | --- | Child widget displaying sanity. |
| `stomach` | HungerBadge | --- | Child widget displaying hunger. |
| `heart` | HealthBadge | --- | Child widget displaying health. |
| `moisturemeter` | MoistureMeter | --- | Child widget displaying wetness. |
| `boatmeter` | BoatMeter | --- | Child widget displaying boat health (if on platform). |
| `resurrectbutton` | ResurrectButton | --- | Button to trigger resurrection when ghosted. |
| `resurrectbuttonfx` | UIAnim | --- | Animation widget for effigy break FX. |
| `wereness` | WereBadge | `nil` | Created if owner has `"wereness"` tag. |
| `inspirationbadge` | InspirationBadge | `nil` | Created if owner has `"battlesinger"` tag. |
| `mightybadge` | MightyBadge | `nil` | Created if owner has `"strongman"` tag. |
| `pethealthbadge` | PetHealthBadge | `nil` | Created if owner has `pethealthbar` component (Wendy). |
| `pethungerbadge` | PetHungerBadge | `nil` | Created if owner has `"dogrider"` tag (Walter). |
| `avengingghostbadge` | AvengingGhostBadge | `nil` | Created if owner has `avengingghost` component. |
| `isghostmode` | boolean | `true` | Tracks if the owner is currently a ghost. |
| `healthpenalty` | number | `0` | Cached health penalty percentage. |
| `column1`..`column5` | number | varies | Layout X-coordinates; adjusted for split-screen. |
| `modetask` | task | `nil` | Scheduled task for switching between ghost/player modes. |
| `rezbutton_new_task` | task | `nil` | Delayed task to enable resurrection button. |
| `rezbutton_lost_task` | task | `nil` | Delayed task to disable resurrection button. |
| `instantboatmeterclose` | boolean | `true` | Flag to control boat meter close animation timing. |
| `onwerenessdelta` | function | `nil` | Callback set when wereness badge is active. Signature: `fn(owner, data)`. |
| `oninspirationdelta` | function | `nil` | Callback set when inspiration badge is active. Signature: `fn(owner, data)`. |
| `onsanitydelta` | function | `nil` | Callback set for sanity delta events. Signature: `fn(owner, data)`. |
| `onhungerdelta` | function | `nil` | Callback set for hunger delta events. Signature: `fn(owner, data)`. |
| `onmoisturedelta` | function | `nil` | Callback set for moisture delta events. Signature: `fn(owner, data)`. |
| `ongotonplatform` | function | `nil` | Callback set when player boards a platform. Signature: `fn(owner, platform)`. |
| `ongotoffplatform` | function | `nil` | Callback set when player leaves a platform. Signature: `fn(owner, platform)`. |
| `previous_pulse` | number | `nil` | Tracks last mightiness percent for red pulse debounce in `MightinessDelta()`. |
| `onforcehealthpulse` | function | `nil` | Called on force health pulse event. Signature: `fn(owner, data)`. Set internally when player mode is active. |
| `oninspirationsongchanged` | function | `nil` | Called when inspiration song changes. Signature: `fn(owner, data)`. Set internally when inspiration badge is active. |
| `onmightinessdelta` | function | `nil` | Called on mightiness change event. Signature: `fn(owner, data)`. Set internally when mighty badge is active. |
| `onpethealthdirty` | function | `nil` | Called when pet health data changes. Triggers `RefreshPetHealth`. Set internally when pet health badge is active. |
| `onheartbuffdirty` | function | `nil` | Called when health buff data changes. Triggers `RefreshHealthBuff`. Set internally when heart badge is active. |
| `onavengetimedirty` | function | `nil` | Called when avenging ghost timer changes. Triggers `RefreshAvengingGhost`. Set internally when avenging ghost badge is active. |
| `onpetskindirty` | function | `nil` | Called when pet skin changes. Triggers `RefreshPetSkin`. Set internally when pet health badge is active. |
| `onpethungerflags` | function | `nil` | Called when pet hunger flags change. Signature: `fn(owner, flags)`. Set internally when pet hunger badge is active. |
| `onpethungerbuild` | function | `nil` | Called when pet hunger build changes. Signature: `fn(owner, data)`. Set internally when pet hunger badge is active. |
| `onshowpethunger` | function | `nil` | Called when pet hunger visibility changes. Signature: `fn(owner, shown)`. Set internally when pet hunger badge is active. |
| `onwxshielddelta` | function | `nil` | Called when WX-78 shield changes. Signature: `fn(owner, data)`. Set internally when WX-78 shield is active. |
| `onwxcanshieldcharge` | function | `nil` | Called when WX-78 shield charge ability changes. Signature: `fn(owner, canshieldcharge)`. Set internally when WX-78 shield is active. |

## Main functions
### `_ctor(owner)`
*   **Description:** Initialises the widget, calls `Widget._ctor`, creates child badges based on owner tags/components, and sets up initial event listeners. Configures layout columns based on split-screen status.
*   **Parameters:**
    - `owner` -- Player entity instance to observe.
*   **Returns:** nil
*   **Error states:** None — guards against nil owner via Widget base.

### `ShowStatusNumbers()`
*   **Description:** Reveals numeric value labels on all active status badges (health, hunger, sanity, moisture, boat, pet health, wereness).
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None — checks for widget existence before accessing `.num`.

### `HideStatusNumbers()`
*   **Description:** Hides numeric value labels on all active status badges.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None.

### `Layout()`
*   **Description:** Placeholder for layout recalculations. Currently empty.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None.

### `AddWereness()`
*   **Description:** Instantiates the `WereBadge` if not already present. Positions it over the hunger badge and registers `werenessdelta` listener.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None.

### `RemoveWereness()`
*   **Description:** Removes the `WereBadge`, unregisters listeners, and hides the widget.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None.

### `SetWereMode(weremode, nofx)`
*   **Description:** Toggles visibility between hunger badge and wereness badge based on transformation state. Spawns FX unless `nofx` is true.
*   **Parameters:**
    - `weremode` -- boolean true to show werewolf badge.
    - `nofx` -- boolean true to skip transformation FX.
*   **Returns:** nil
*   **Error states:** None — returns early if in ghost mode or badge missing.

### `AddInspiration()`
*   **Description:** Instantiates the `InspirationBadge` for Battlesong characters. Repositions moisture meter to accommodate.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None.

### `AddMightiness()`
*   **Description:** Instantiates the `MightyBadge` for Strongman characters.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None.

### `SetGhostMode(ghostmode)`
*   **Description:** Toggles visibility of all survival stats based on ghost state. Hides stats when ghosted, shows resurrection button. Cancels pending mode tasks and schedules `OnSetGhostMode` or `OnSetPlayerMode`.
*   **Parameters:**
    - `ghostmode` -- boolean true for ghost state.
*   **Returns:** nil
*   **Error states:** None.

### `SetHealthPercent(pct)`
*   **Description:** Updates health badge percentage and penalty. Triggers warning state if percent `<= 0.33`.
*   **Parameters:**
    - `pct` -- number health percentage (0-1).
*   **Returns:** nil
*   **Error states:** None.

### `HealthDelta(data)`
*   **Description:** Handles health change events. Pulses badge green/red and plays sounds based on delta direction and penalty changes. Ignores overtime pulses for penalty changes.
*   **Parameters:**
    - `data` -- table `{newpercent, oldpercent, overtime}`.
*   **Returns:** nil
*   **Error states:** None.

### `ForceHealthPulse(data)`
*   **Description:** Forces a health badge pulse without a delta event. Used for external healing/damage triggers.
*   **Parameters:**
    - `data` -- table `{up=boolean, down=boolean}`.
*   **Returns:** nil
*   **Error states:** None.

### `SetHungerPercent(pct)`
*   **Description:** Updates hunger badge percentage. Triggers warning state if percent `<= 0`.
*   **Parameters:**
    - `pct` -- number hunger percentage (0-1).
*   **Returns:** nil
*   **Error states:** None.

### `HungerDelta(data)`
*   **Description:** Handles hunger change events. Pulses badge and plays sounds.
*   **Parameters:**
    - `data` -- table `{newpercent, oldpercent, overtime}`.
*   **Returns:** nil
*   **Error states:** None.

### `AddPetHunger()`
*   **Description:** Instantiates `PetHungerBadge` for Walter. Hides by default until `show_pet_hunger` event.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None.

### `SetPetHungerPercent(pct, max)`
*   **Description:** Updates pet hunger badge percentage.
*   **Parameters:**
    - `pct` -- number hunger percentage.
    - `max` -- number max hunger value.
*   **Returns:** nil
*   **Error states:** None.

### `PetHungerDelta(data)`
*   **Description:** Handles pet hunger change events.
*   **Parameters:**
    - `data` -- table `{newpercent, oldpercent}`.
*   **Returns:** nil
*   **Error states:** None.

### `SetPetHungerFlags(flags, instant)`
*   **Description:** Updates pet hunger badge flags (e.g., sprint drain, size).
*   **Parameters:**
    - `flags` -- number bitfield.
    - `instant` -- boolean skip animation.
*   **Returns:** nil
*   **Error states:** None.

### `SetPetHungerBuild(build, instant)`
*   **Description:** Updates pet hunger badge build for skins.
*   **Parameters:**
    - `build` -- string build name.
    - `instant` -- boolean skip animation.
*   **Returns:** nil
*   **Error states:** None.

### `SetupWobyPetHunger()`
*   **Description:** Configures Woby-specific hunger meter logic. Overrides `OnFlagsChanged` to switch frames based on Woby state (big/small, lunar/shadow). Overrides `OnBuildChanged` for skins. Sets arrow animation function based on sprint drain and skills.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None — module dependency is resolved at file load time, not function call time.

### `SetSanityPercent(pct)`
*   **Description:** Updates sanity badge percentage and penalty. Triggers warning if insane or enlightened.
*   **Parameters:**
    - `pct` -- number sanity percentage.
*   **Returns:** `oldpenalty`, `newpenalty` -- numbers.
*   **Error states:** None.

### `SanityDelta(data)`
*   **Description:** Handles sanity change events. Pulses badge based on delta and penalty changes.
*   **Parameters:**
    - `data` -- table `{newpercent, oldpercent, overtime}`.
*   **Returns:** nil
*   **Error states:** None.

### `SetWerenessPercent(pct)`
*   **Description:** Updates wereness badge percentage.
*   **Parameters:**
    - `pct` -- number percentage.
*   **Returns:** nil
*   **Error states:** None.

### `WerenessDelta(data)`
*   **Description:** Handles wereness change events. Pulses badge.
*   **Parameters:**
    - `data` -- table `{newpercent, oldpercent, overtime}`.
*   **Returns:** nil
*   **Error states:** None.

### `SetInspiration(pct, slots_available, draining)`
*   **Description:** Updates inspiration badge percentage, slots, and draining state.
*   **Parameters:**
    - `pct` -- number percentage.
    - `slots_available` -- number | nil.
    - `draining` -- boolean.
*   **Returns:** nil
*   **Error states:** None.

### `OnInspirationSongChanged(slot_num, song_name)`
*   **Description:** Updates inspiration badge buff slot with song name.
*   **Parameters:**
    - `slot_num` -- number slot index.
    - `song_name` -- string | nil.
*   **Returns:** nil
*   **Error states:** None.

### `SetMightiness(percent)`
*   **Description:** Updates mightiness badge percentage.
*   **Parameters:**
    - `percent` -- number.
*   **Returns:** nil
*   **Error states:** None.

### `MightinessDelta(data)`
*   **Description:** Handles mightiness change events. Pulses badge with debounce logic for red pulses.
*   **Parameters:**
    - `data` -- table `{newpercent, oldpercent}`.
*   **Returns:** nil
*   **Error states:** None.

### `SetWxShieldPercent(newpercent, oldpercent, maxshield, penetrationthreshold)`
*   **Description:** Forwards shield data to health badge for WX-78.
*   **Parameters:**
    - `newpercent` -- number.
    - `oldpercent` -- number.
    - `maxshield` -- number.
    - `penetrationthreshold` -- number.
*   **Returns:** nil
*   **Error states:** None.

### `SetWxCanShieldCharge(canshieldcharge)`
*   **Description:** Forwards shield charge ability to health badge for WX-78.
*   **Parameters:**
    - `canshieldcharge` -- boolean.
*   **Returns:** nil
*   **Error states:** None.

### `SetMoisturePercent(pct)`
*   **Description:** Updates moisture meter value, max, and rate scale.
*   **Parameters:**
    - `pct` -- number moisture value.
*   **Returns:** nil
*   **Error states:** None.

### `MoistureDelta(data)`
*   **Description:** Handles moisture change events.
*   **Parameters:**
    - `data` -- table `{new}`.
*   **Returns:** nil
*   **Error states:** None.

### `GetResurrectButton()`
*   **Description:** Returns the resurrect button widget if visible.
*   **Parameters:** None
*   **Returns:** ResurrectButton | nil.
*   **Error states:** None.

### `RefreshPetHealth()`
*   **Description:** Syncs pet health badge with `pethealthbar` component data and resets pulse.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** Errors if `owner.components.pethealthbar` is nil.

### `RefreshHealthBuff()`
*   **Description:** Updates health badge buff symbol from owner netvar.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** Errors if `owner._buffsymbol` is nil (no nil guard before `:value()` access).

### `RefreshAvengingGhost()`
*   **Description:** Shows/hides avenging ghost badge based on timer. Updates values if active.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** Errors if `owner.components.avengingghost` is nil.

### `RefreshPetSkin()`
*   **Description:** Updates pet health badge icon skin from inventory data.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** Errors if `owner.components.pethealthbar` is nil.

### `EnableResurrect(enable, effigy_type)`
*   **Description:** Shows/hides resurrection button and effigy indicator. Configures FX bank/build based on effigy type (`"grave"` vs standard).
*   **Parameters:**
    - `enable` -- boolean.
    - `effigy_type` -- string `"grave"` | nil.
*   **Returns:** nil
*   **Error states:** None.

### `OnSetPlayerMode(inst, self)` (local)
*   **Description:** **Callback.** Registers all survival stat event listeners for alive players. Initializes badge percentages. Sets up platform/boat listeners.
*   **Parameters:**
    - `inst` -- Widget entity.
    - `self` -- Widget instance.
*   **Returns:** nil
*   **Error states:** None.

### `OnSetGhostMode(inst, self)` (local)
*   **Description:** **Callback.** Removes all survival stat event listeners for ghosts. Registers avenging ghost listener if applicable. Hides pet hunger.
*   **Parameters:**
    - `inst` -- Widget entity.
    - `self` -- Widget instance.
*   **Returns:** nil
*   **Error states:** None.

### `UpdateRezButton_Enable(inst, self, proxy_is_gravestone)` (local)
*   **Description:** **Task Callback.** Enables resurrection button after delay.
*   **Parameters:**
    - `inst` -- Widget entity.
    - `self` -- Widget instance.
    - `proxy_is_gravestone` -- boolean.
*   **Returns:** nil
*   **Error states:** None.

### `UpdateRezButton_Disable(inst, self, proxy_is_gravestone)` (local)
*   **Description:** **Task Callback.** Disables resurrection button after delay. Plays break FX if button was visible.
*   **Parameters:**
    - `inst` -- Widget entity.
    - `self` -- Widget instance.
    - `proxy_is_gravestone` -- boolean.
*   **Returns:** nil
*   **Error states:** None.

### `OnFinishSeamlessPlayerSwap(owner)` (local)
*   **Description:** **Event Callback.** Cleans up mode task after player swap and re-applies ghost/player mode.
*   **Parameters:**
    - `owner` -- Player entity.
*   **Returns:** nil
*   **Error states:** None.

### `AddBeaverness()` (Deprecated)
*   **Description:** Deprecated. No-op.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None.

### `RemoveBeaverness()` (Deprecated)
*   **Description:** Deprecated. No-op.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None.

### `SetBeaverMode()` (Deprecated)
*   **Description:** Deprecated. No-op.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None.

### `SetBeavernessPercent()` (Deprecated)
*   **Description:** Deprecated. No-op.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None.

### `BeavernessDelta()` (Deprecated)
*   **Description:** Deprecated. No-op.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None.

## Events & listeners
**Listens to:**
- `forcehealthpulse` -- Triggers `ForceHealthPulse`; forces health badge pulse.
- `healthdelta` -- Triggers `HealthDelta`; updates health percent and pulses.
- `hungerdelta` -- Triggers `HungerDelta`; updates hunger percent and pulses.
- `sanitydelta` -- Triggers `SanityDelta`; updates sanity percent and pulses.
- `moisturedelta` -- Triggers `MoistureDelta`; updates moisture value.
- `got_on_platform` -- Triggers `ongotonplatform`; enables boat meter if platform has `healthsyncer`.
- `got_off_platform` -- Triggers `ongotoffplatform`; disables boat meter.
- `werenessdelta` -- Triggers `WerenessDelta`; updates werewolf percent.
- `inspirationdelta` -- Triggers `SetInspiration`; updates battlesong meter.
- `inspirationsongchanged` -- Triggers `OnInspirationSongChanged`; updates song slot.
- `mightinessdelta` -- Triggers `MightinessDelta`; updates strongman meter.
- `clientpethealthdirty` -- Triggers `RefreshPetHealth`; syncs pet health data.
- `clientpethealthsymboldirty` -- Triggers `RefreshPetHealth`.
- `clientpetmaxhealthdirty` -- Triggers `RefreshPetHealth`.
- `clientpethealthstatusdirty` -- Triggers `RefreshPetHealth`.
- `clientpetbonusdirty` -- Triggers `RefreshPetHealth`.
- `clienthealthbuffdirty` -- Triggers `RefreshHealthBuff`; updates health buff icon.
- `clientavengetimedirty` -- Triggers `RefreshAvengingGhost`; updates vengeance timer.
- `clientpetskindirty` -- Triggers `RefreshPetSkin`; updates pet skin icon.
- `pet_hungerdelta` -- Triggers `PetHungerDelta`; updates pet hunger percent.
- `pet_hunger_flags` -- Triggers `SetPetHungerFlags`; updates pet hunger flags.
- `pet_hunger_build` -- Triggers `SetPetHungerBuild`; updates pet hunger build.
- `show_pet_hunger` -- Triggers `onshowpethunger`; shows/hides pet hunger badge.
- `wxshielddelta` -- Triggers `SetWxShieldPercent`; updates WX-78 shield.
- `wx_canshieldcharge` -- Triggers `SetWxCanShieldCharge`; updates shield charge ability.
- `gotnewattunement` -- Triggers delayed `UpdateRezButton_Enable` if attuned to resurrector.
- `attunementlost` -- Triggers delayed `UpdateRezButton_Disable` if no longer attuned.
- `finishseamlessplayerswap` -- Triggers `OnFinishSeamlessPlayerSwap`; resets mode after swap.
- `animover` (on `resurrectbuttonfx`) -- Hides FX widget on animation complete.