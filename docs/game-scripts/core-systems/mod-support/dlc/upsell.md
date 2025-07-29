---
id: upsell
title: Upsell System
description: Demo version purchase screen and trial time management system
sidebar_position: 4

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Upsell System

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The **Upsell System** manages the demo version experience in Don't Starve Together, handling purchase screen display, trial time limits, and transition from demo to full version. It tracks purchase state and manages timeouts for both demo play time and purchase completion.

## Usage Example

```lua
-- Check if game is purchased
if IsGamePurchased() then
    print("Full version available")
else
    print("Demo version - limited time remaining")
end

-- Update purchase state with callback
UpdateGamePurchasedState(function(is_purchased)
    if is_purchased then
        print("Game purchased successfully!")
    else
        print("Still in demo mode")
    end
end)
```

## Core Functions

### IsGamePurchased() {#is-game-purchased}

**Status:** `stable`

**Description:**
Checks whether the full game has been purchased. Returns true if the game is owned, false if running in demo mode.

**Returns:**
- (boolean): True if game is purchased, false if in demo mode

**Example:**
```lua
local function CheckGameAccess()
    if IsGamePurchased() then
        -- Enable full game features
        EnableFullGameContent()
    else
        -- Restrict to demo features
        ShowDemoLimitations()
    end
end
```

### UpdateGamePurchasedState(complete_callback) {#update-game-purchased-state}

**Status:** `stable`

**Description:**
Updates the current purchase state and executes a callback with the result. Used to refresh purchase status after potential purchases.

**Parameters:**
- `complete_callback` (function): Function called with purchase state result

**Callback Parameters:**
- `is_purchased` (boolean): Current purchase state

**Example:**
```lua
-- Check purchase state after user interaction
UpdateGamePurchasedState(function(is_purchased)
    local active_screen = TheFrontEnd:GetActiveScreen()
    if active_screen and active_screen.Refresh then
        active_screen:Refresh()
    end
    
    if is_purchased then
        UnlockFullVersion()
    end
end)
```

## Upsell Status Functions

### UpsellShowing() {#upsell-showing}

**Status:** `stable`

**Description:**
Returns whether the upsell purchase screen is currently being displayed.

**Returns:**
- (boolean): True if upsell screen is visible

**Example:**
```lua
if UpsellShowing() then
    -- Disable game input while upsell is shown
    DisableGameControls()
end
```

### WaitingForPurchaseState() {#waiting-for-purchase-state}

**Status:** `stable`

**Description:**
Returns whether the system is waiting for purchase completion after user interaction.

**Returns:**
- (boolean): True if waiting for purchase callback

**Example:**
```lua
if WaitingForPurchaseState() then
    -- Show loading indicator
    DisplayPurchaseWaitMessage()
end
```

## Upsell Display Functions

### ShowUpsellScreen(shouldquit) {#show-upsell-screen}

**Status:** `stable`

**Description:**
Displays the purchase upsell screen to the user. Pauses the game and sends UI trigger to show purchase options.

**Parameters:**
- `shouldquit` (boolean): Whether to quit after showing (true for timeout, false for manual trigger)

**Example:**
```lua
-- Manual upsell trigger
local function OnPurchaseButtonClicked()
    ShowUpsellScreen(false)
end

-- Automatic timeout trigger
local function OnDemoTimeExpired()
    ShowUpsellScreen(true)
end
```

### HandleUpsellClose() {#handle-upsell-close}

**Status:** `stable`

**Description:**
Handles cleanup when the upsell screen is closed. Updates purchase state and determines next action based on purchase result and demo time.

**Example:**
```lua
-- Called automatically when upsell UI is dismissed
-- Updates game state and handles post-purchase flow
```

## Timeout Management

### CheckForUpsellTimeout(dt) {#check-for-upsell-timeout}

**Status:** `stable`

**Description:**
Checks for purchase completion timeout. If purchase interaction takes longer than 30 seconds, automatically closes and quits.

**Parameters:**
- `dt` (number): Delta time since last check

**Implementation Details:**
- Timeout duration: 30 seconds
- Only active when in "WAITING" state
- Triggers automatic quit on timeout

**Example:**
```lua
-- Called automatically in WallUpdate
function WallUpdate(dt)
    -- ... other updates ...
    CheckForUpsellTimeout(dt)
end
```

### CheckDemoTimeout() {#check-demo-timeout}

**Status:** `stable`

**Description:**
Checks if demo play time has exceeded the allowed limit. Automatically triggers upsell screen when demo time expires.

**Demo Time Limit:**
- Controlled by `TUNING.DEMO_TIME` constant
- Checked against `GetTimePlaying()` result

**Example:**
```lua
-- Called automatically in main Update loop
function Update(dt)
    -- ... other updates ...
    CheckDemoTimeout()
end
```

## State Management

### Upsell States

The system uses `upsell_status` to track current state:

| State | Description | Next Possible States |
|-------|-------------|---------------------|
| `nil` | Normal gameplay, no upsell active | `"SHOWING"` |
| `"SHOWING"` | Upsell screen is displayed | `"WAITING"` |
| `"WAITING"` | Waiting for purchase completion | `nil`, `"QUITTING"` |
| `"QUITTING"` | Demo timeout, preparing to quit | (terminal state) |

### State Transitions

```lua
-- Normal flow
nil → "SHOWING" → "WAITING" → nil

-- Timeout flow  
nil → "SHOWING" → "WAITING" → "QUITTING"

-- Direct quit flow
nil → "SHOWING" → "QUITTING"
```

## Global Variables

### DEMO_QUITTING {#demo-quitting}

**Type:** `boolean`

**Status:** `stable`

**Description:**
Global flag indicating that the demo is in the process of quitting due to time expiration or purchase completion.

**Example:**
```lua
if DEMO_QUITTING then
    -- Disable new game actions
    PreventNewGameStart()
end
```

## Constants and Configuration

### TUNING.DEMO_TIME

**Description:**
Maximum allowed playtime in demo mode before upsell is triggered.

**Usage:**
```lua
local time_remaining = TUNING.DEMO_TIME - GetTimePlaying()
if time_remaining <= 0 then
    -- Demo time expired
    TriggerUpsell()
end
```

### Purchase Timeout

**Value:** `30` seconds

**Description:**
Maximum time to wait for purchase completion before automatically quitting.

## Integration Points

### Frontend Integration

```lua
-- UI trigger for showing purchase screen
local trigger = json.encode{upsell={timedout=shouldquit}}
TheSim:SendUITrigger(trigger)
```

### Game Pause Integration

```lua
-- Pause game during upsell
SetPause(true, "upsell")

-- Resume after completion
SetPause(false)
```

### Player Events

```lua
-- Trigger quit event
local player = ThePlayer
if player then
    player:PushEvent("quit", {})
end
```

## Common Usage Patterns

### Demo Time Warning

```lua
local function CheckDemoTimeRemaining()
    if not IsGamePurchased() then
        local time_playing = GetTimePlaying()
        local demo_limit = TUNING.DEMO_TIME
        local time_remaining = demo_limit - time_playing
        
        if time_remaining <= 300 then  -- 5 minutes warning
            ShowDemoTimeWarning(time_remaining)
        end
    end
end
```

### Purchase State Monitoring

```lua
local function MonitorPurchaseState()
    if UpsellShowing() then
        -- Show purchase screen overlay
        DisplayPurchaseUI()
    elseif WaitingForPurchaseState() then
        -- Show waiting indicator
        DisplayPurchaseWaiting()
    else
        -- Normal gameplay
        HidePurchaseUI()
    end
end
```

### Demo Feature Restrictions

```lua
local function ApplyDemoRestrictions()
    if not IsGamePurchased() then
        -- Limit available characters
        RestrictCharacterSelection()
        
        -- Disable certain features
        DisablePremiumFeatures()
        
        -- Show demo watermark
        ShowDemoWatermark()
    end
end
```

## Error Handling

### Purchase Timeout Handling

```lua
-- Automatic timeout after 30 seconds
if waitingforpurchasetimeout > 30 then
    print("Upsell callback timed out. Very odd.")
    SetPause(false)
    
    -- Force quit
    local player = ThePlayer
    if player then
        player:PushEvent("quit", {})
    end
end
```

### State Recovery

```lua
-- Reset upsell state on error
local function ResetUpsellState()
    upsell_status = nil
    waitingforpurchasetimeout = 0
    SetPause(false)
end
```

## Performance Considerations

### Timing Checks

- `CheckDemoTimeout()` called once per update frame
- `CheckForUpsellTimeout()` only active during purchase wait
- Purchase state checks are lightweight

### Memory Usage

- Minimal global state (3 variables)
- No persistent storage required
- Callback-based purchase checking

## Related Systems

- [**Update System**](./update.md): Integrates timeout checks into main update loop
- [**Tuning**](./tuning.md): Contains demo time limit configuration
- [**Frontend**](./frontend.md): Handles UI display and user interaction
- [**Main**](./main.md): Provides timing functions like `GetTimePlaying()`

## Security Considerations

- Purchase verification handled at platform level
- Demo time tracking not user-modifiable
- Automatic quit prevents infinite demo play
- Purchase state validated through secure channels
