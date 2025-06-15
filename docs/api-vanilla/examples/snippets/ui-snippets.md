---
id: ui-snippets
title: UI Snippets
sidebar_position: 4
last_updated: 2023-07-06
---

# UI Snippets

This page provides reusable code snippets for creating and manipulating UI elements in Don't Starve Together mods.

## Basic UI Elements

### Creating a Simple Screen

```lua
-- Define a simple screen
local MyScreen = Class(Screen, function(self, title)
    Screen._ctor(self, "MyScreen")
    self.title = title or "My Screen"
    
    -- Create root widget
    self.root = self:AddChild(Widget("ROOT"))
    self.root:SetVAnchor(ANCHOR_MIDDLE)
    self.root:SetHAnchor(ANCHOR_MIDDLE)
    self.root:SetPosition(0, 0, 0)
    self.root:SetScaleMode(SCALEMODE_PROPORTIONAL)
    
    -- Add background
    self.bg = self.root:AddChild(Image("images/ui.xml", "bg_plain.tex"))
    self.bg:SetSize(400, 300)
    self.bg:SetTint(1, 1, 1, 0.8)
    
    -- Add title text
    self.title_text = self.root:AddChild(Text(TITLEFONT, 30))
    self.title_text:SetPosition(0, 120, 0)
    self.title_text:SetString(self.title)
    
    -- Add close button
    self.close_button = self.root:AddChild(TextButton())
    self.close_button:SetPosition(0, -120, 0)
    self.close_button:SetText("Close")
    self.close_button:SetOnClick(function() self:Close() end)
    self.close_button:SetFont(BUTTONFONT)
    self.close_button:SetTextSize(30)
end)

-- Handle closing the screen
function MyScreen:Close()
    TheFrontEnd:PopScreen(self)
end

-- Handle input
function MyScreen:OnControl(control, down)
    if MyScreen._base.OnControl(self, control, down) then return true end
    
    if not down and control == CONTROL_CANCEL then
        self:Close()
        return true
    end
    
    return false
end

-- Usage:
-- TheFrontEnd:PushScreen(MyScreen("Example Title"))
```

### Creating a Button

```lua
-- Function to create a button
local function MakeButton(parent, text, position, onclick)
    local button = parent:AddChild(TextButton())
    button:SetPosition(position:Get())
    button:SetText(text)
    button:SetOnClick(onclick)
    button:SetFont(BUTTONFONT)
    button:SetTextSize(30)
    
    return button
end

-- Usage:
-- local my_button = MakeButton(self.root, "Click Me", Vector3(0, -50, 0), function() print("Button clicked!") end)
```

### Creating a Checkbox

```lua
-- Function to create a checkbox
local function MakeCheckbox(parent, text, position, initial_value, onchange)
    local checkbox_root = parent:AddChild(Widget("checkbox_root"))
    checkbox_root:SetPosition(position:Get())
    
    -- Add checkbox
    local checkbox = checkbox_root:AddChild(ImageButton("images/ui.xml", "checkbox_off.tex", "checkbox_on.tex", "checkbox_disabled.tex"))
    checkbox:SetPosition(-10, 0, 0)
    checkbox.checked = initial_value or false
    checkbox:SetOnClick(function()
        checkbox.checked = not checkbox.checked
        checkbox:SetImageNormal(checkbox.checked and "checkbox_on.tex" or "checkbox_off.tex")
        if onchange then
            onchange(checkbox.checked)
        end
    end)
    
    -- Set initial state
    checkbox:SetImageNormal(checkbox.checked and "checkbox_on.tex" or "checkbox_off.tex")
    
    -- Add label
    local label = checkbox_root:AddChild(Text(BUTTONFONT, 25))
    label:SetPosition(80, 0, 0)
    label:SetString(text)
    label:SetHAlign(ANCHOR_LEFT)
    
    return checkbox
end

-- Usage:
-- local my_checkbox = MakeCheckbox(self.root, "Enable Feature", Vector3(0, 0, 0), false, function(checked) 
--     print("Checkbox state: " .. tostring(checked)) 
-- end)
```

### Creating a Slider

```lua
-- Function to create a slider
local function MakeSlider(parent, text, position, min_val, max_val, initial_val, onchange)
    local slider_root = parent:AddChild(Widget("slider_root"))
    slider_root:SetPosition(position:Get())
    
    -- Add label
    local label = slider_root:AddChild(Text(BUTTONFONT, 25))
    label:SetPosition(0, 30, 0)
    label:SetString(text)
    
    -- Add slider
    local slider = slider_root:AddChild(Slider("small", 200, min_val, max_val, initial_val))
    slider:SetPosition(0, 0, 0)
    
    -- Add value text
    local value_text = slider_root:AddChild(Text(NUMBERFONT, 25))
    value_text:SetPosition(0, -30, 0)
    value_text:SetString(tostring(initial_val))
    
    -- Set callback
    slider.OnChanged = function(_, value)
        local rounded_value = math.floor(value * 100) / 100 -- Round to 2 decimal places
        value_text:SetString(tostring(rounded_value))
        
        if onchange then
            onchange(rounded_value)
        end
    end
    
    return slider
end

-- Usage:
-- local my_slider = MakeSlider(self.root, "Volume", Vector3(0, 0, 0), 0, 1, 0.5, function(value) 
--     print("Slider value: " .. tostring(value)) 
-- end)
```

### Creating a Text Input Field

```lua
-- Function to create a text input field
local function MakeTextInput(parent, text, position, initial_text, onchange, max_length)
    local input_root = parent:AddChild(Widget("input_root"))
    input_root:SetPosition(position:Get())
    
    -- Add label
    local label = input_root:AddChild(Text(BUTTONFONT, 25))
    label:SetPosition(0, 30, 0)
    label:SetString(text)
    
    -- Add text edit box
    local text_edit = input_root:AddChild(TextEdit(CHATFONT, 25, initial_text or ""))
    text_edit:SetPosition(0, 0, 0)
    text_edit:SetRegionSize(200, 40)
    text_edit:SetHAlign(ANCHOR_LEFT)
    text_edit:SetFocusedImage("images/textboxes.xml", "textbox_long.tex", "textbox_long_over.tex")
    text_edit:SetUnfocusedImage("images/textboxes.xml", "textbox_long.tex", "textbox_long_over.tex")
    text_edit:SetTextLengthLimit(max_length or 50)
    text_edit:SetForceEdit(true)
    
    -- Set callback
    text_edit.OnTextEntered = function()
        if onchange then
            onchange(text_edit:GetString())
        end
    end
    
    -- Add background for better visibility
    local bg = input_root:AddChild(Image("images/textboxes.xml", "textbox_long.tex"))
    bg:SetPosition(0, 0, 0)
    bg:SetSize(200, 40)
    bg:MoveToBack()
    
    return text_edit
end

-- Usage:
-- local my_input = MakeTextInput(self.root, "Name", Vector3(0, 0, 0), "Player", function(text) 
--     print("Input text: " .. text) 
-- end, 20)
```

## Advanced UI Components

### Creating a Dropdown Menu

```lua
-- Function to create a dropdown menu
local function MakeDropdown(parent, text, position, options, initial_selection, onselect)
    local dropdown_root = parent:AddChild(Widget("dropdown_root"))
    dropdown_root:SetPosition(position:Get())
    
    -- Add label
    local label = dropdown_root:AddChild(Text(BUTTONFONT, 25))
    label:SetPosition(0, 30, 0)
    label:SetString(text)
    
    -- Create dropdown button
    local dropdown_button = dropdown_root:AddChild(TextButton())
    dropdown_button:SetPosition(0, 0, 0)
    dropdown_button:SetText(options[initial_selection] or "Select...")
    dropdown_button:SetFont(BUTTONFONT)
    dropdown_button:SetTextSize(25)
    dropdown_button:SetSize(200, 40)
    
    -- Variables for dropdown state
    local is_open = false
    local selection = initial_selection
    local dropdown_items = {}
    local dropdown_menu = nil
    
    -- Function to close dropdown
    local function CloseDropdown()
        if dropdown_menu then
            dropdown_menu:Kill()
            dropdown_menu = nil
        end
        is_open = false
    end
    
    -- Function to open dropdown
    local function OpenDropdown()
        if is_open then
            CloseDropdown()
            return
        end
        
        is_open = true
        
        -- Create dropdown menu
        dropdown_menu = dropdown_root:AddChild(Widget("dropdown_menu"))
        dropdown_menu:SetPosition(0, -20 - (#options * 20), 0)
        
        -- Add background
        local menu_bg = dropdown_menu:AddChild(Image("images/ui.xml", "single_option_bg.tex"))
        menu_bg:SetSize(200, #options * 40)
        menu_bg:SetTint(0.1, 0.1, 0.1, 0.9)
        
        -- Add options
        for i, option_text in ipairs(options) do
            local option = dropdown_menu:AddChild(TextButton())
            option:SetPosition(0, (#options - i) * 40, 0)
            option:SetText(option_text)
            option:SetFont(BUTTONFONT)
            option:SetTextSize(25)
            option:SetSize(200, 40)
            
            option:SetOnClick(function()
                selection = i
                dropdown_button:SetText(option_text)
                CloseDropdown()
                
                if onselect then
                    onselect(i, option_text)
                end
            end)
            
            table.insert(dropdown_items, option)
        end
    end
    
    -- Set click handler for dropdown button
    dropdown_button:SetOnClick(function()
        OpenDropdown()
    end)
    
    -- Add method to get current selection
    dropdown_root.GetSelectedIndex = function()
        return selection
    end
    
    dropdown_root.GetSelectedText = function()
        return options[selection]
    end
    
    return dropdown_root
end

-- Usage:
-- local options = {"Option 1", "Option 2", "Option 3"}
-- local my_dropdown = MakeDropdown(self.root, "Select Option", Vector3(0, 0, 0), options, 1, function(index, text) 
--     print("Selected: " .. text .. " (index: " .. index .. ")") 
-- end)
```

### Creating a Tab System

```lua
-- Function to create a tab system
local function MakeTabSystem(parent, position, width, height, tabs)
    local tab_root = parent:AddChild(Widget("tab_root"))
    tab_root:SetPosition(position:Get())
    
    -- Create tab buttons container
    local tab_buttons = tab_root:AddChild(Widget("tab_buttons"))
    tab_buttons:SetPosition(0, height/2 + 20, 0)
    
    -- Create content area
    local content_area = tab_root:AddChild(Widget("content_area"))
    content_area:SetPosition(0, 0, 0)
    
    -- Add background for content
    local content_bg = content_area:AddChild(Image("images/ui.xml", "bg_plain.tex"))
    content_bg:SetSize(width, height)
    content_bg:SetTint(0.2, 0.2, 0.2, 0.8)
    
    -- Tab content widgets
    local tab_contents = {}
    local active_tab = 1
    
    -- Function to switch tabs
    local function SwitchToTab(index)
        -- Hide all tab contents
        for i, content in ipairs(tab_contents) do
            content:Hide()
        end
        
        -- Show selected tab content
        if tab_contents[index] then
            tab_contents[index]:Show()
            active_tab = index
        end
    end
    
    -- Create tabs
    local tab_width = width / #tabs
    for i, tab_info in ipairs(tabs) do
        -- Create tab button
        local tab_button = tab_buttons:AddChild(TextButton())
        tab_button:SetPosition((i - (#tabs/2)) * tab_width + tab_width/2, 0, 0)
        tab_button:SetText(tab_info.title)
        tab_button:SetFont(BUTTONFONT)
        tab_button:SetTextSize(25)
        tab_button:SetSize(tab_width - 10, 40)
        
        -- Create tab content
        local tab_content = content_area:AddChild(Widget("tab_" .. i))
        tab_content:SetPosition(0, 0, 0)
        
        -- Add content creation function
        if tab_info.build_fn then
            tab_info.build_fn(tab_content)
        end
        
        -- Store content widget
        table.insert(tab_contents, tab_content)
        
        -- Set click handler
        tab_button:SetOnClick(function()
            SwitchToTab(i)
        end)
    end
    
    -- Initialize with first tab active
    SwitchToTab(1)
    
    -- Add method to switch tabs programmatically
    tab_root.SwitchToTab = SwitchToTab
    tab_root.GetActiveTab = function() return active_tab end
    
    return tab_root
end

-- Usage:
-- local tabs = {
--     {title = "General", build_fn = function(parent) 
--         -- Add content for General tab
--         parent:AddChild(Text(BUTTONFONT, 30)):SetString("General Settings")
--     end},
--     {title = "Audio", build_fn = function(parent)
--         -- Add content for Audio tab
--         parent:AddChild(Text(BUTTONFONT, 30)):SetString("Audio Settings")
--     end},
--     {title = "Controls", build_fn = function(parent)
--         -- Add content for Controls tab
--         parent:AddChild(Text(BUTTONFONT, 30)):SetString("Control Settings")
--     end}
-- }
-- local my_tabs = MakeTabSystem(self.root, Vector3(0, 0, 0), 400, 300, tabs)
```

## UI Integration with Game Systems

### Creating a Mod Configuration Screen

```lua
-- Define a mod configuration screen
local ModConfigScreen = Class(Screen, function(self, modname, options)
    Screen._ctor(self, "ModConfigScreen")
    self.modname = modname or "My Mod"
    self.options = options or {}
    
    -- Create root widget
    self.root = self:AddChild(Widget("ROOT"))
    self.root:SetVAnchor(ANCHOR_MIDDLE)
    self.root:SetHAnchor(ANCHOR_MIDDLE)
    self.root:SetPosition(0, 0, 0)
    self.root:SetScaleMode(SCALEMODE_PROPORTIONAL)
    
    -- Add background
    self.bg = self.root:AddChild(Image("images/ui.xml", "bg_plain.tex"))
    self.bg:SetSize(500, 450)
    self.bg:SetTint(0.1, 0.1, 0.1, 0.8)
    
    -- Add title
    self.title = self.root:AddChild(Text(TITLEFONT, 40))
    self.title:SetPosition(0, 180, 0)
    self.title:SetString(self.modname .. " Settings")
    
    -- Add content container
    self.content = self.root:AddChild(Widget("content"))
    self.content:SetPosition(0, 0, 0)
    
    -- Add options based on provided configuration
    self:BuildOptions()
    
    -- Add buttons
    self.save_button = self.root:AddChild(TextButton())
    self.save_button:SetPosition(-100, -180, 0)
    self.save_button:SetText("Save")
    self.save_button:SetOnClick(function() self:Save() end)
    self.save_button:SetFont(BUTTONFONT)
    self.save_button:SetTextSize(30)
    
    self.cancel_button = self.root:AddChild(TextButton())
    self.cancel_button:SetPosition(100, -180, 0)
    self.cancel_button:SetText("Cancel")
    self.cancel_button:SetOnClick(function() self:Cancel() end)
    self.cancel_button:SetFont(BUTTONFONT)
    self.cancel_button:SetTextSize(30)
end)

-- Build UI elements for each option
function ModConfigScreen:BuildOptions()
    local y_offset = 100
    local y_step = 60
    
    for i, option in ipairs(self.options) do
        local y_pos = y_offset - (i-1) * y_step
        
        if option.type == "checkbox" then
            -- Create checkbox option
            local checkbox = self.content:AddChild(ImageButton("images/ui.xml", "checkbox_off.tex", "checkbox_on.tex", "checkbox_disabled.tex"))
            checkbox:SetPosition(-180, y_pos, 0)
            checkbox.checked = option.value or false
            checkbox:SetImageNormal(checkbox.checked and "checkbox_on.tex" or "checkbox_off.tex")
            checkbox:SetOnClick(function()
                checkbox.checked = not checkbox.checked
                checkbox:SetImageNormal(checkbox.checked and "checkbox_on.tex" or "checkbox_off.tex")
                option.value = checkbox.checked
                if option.callback then
                    option.callback(checkbox.checked)
                end
            end)
            
            -- Add label
            local label = self.content:AddChild(Text(BUTTONFONT, 25))
            label:SetPosition(0, y_pos, 0)
            label:SetString(option.name)
            label:SetHAlign(ANCHOR_LEFT)
            
        elseif option.type == "slider" then
            -- Create slider option
            local label = self.content:AddChild(Text(BUTTONFONT, 25))
            label:SetPosition(-180, y_pos, 0)
            label:SetString(option.name)
            label:SetHAlign(ANCHOR_LEFT)
            
            local slider = self.content:AddChild(Slider("small", 200, option.min or 0, option.max or 1, option.value or 0))
            slider:SetPosition(70, y_pos, 0)
            
            local value_text = self.content:AddChild(Text(NUMBERFONT, 25))
            value_text:SetPosition(180, y_pos, 0)
            value_text:SetString(tostring(option.value))
            
            slider.OnChanged = function(_, value)
                local rounded_value = math.floor(value * 100) / 100
                value_text:SetString(tostring(rounded_value))
                option.value = rounded_value
                if option.callback then
                    option.callback(rounded_value)
                end
            end
            
        elseif option.type == "dropdown" then
            -- Create dropdown option
            local label = self.content:AddChild(Text(BUTTONFONT, 25))
            label:SetPosition(-180, y_pos, 0)
            label:SetString(option.name)
            label:SetHAlign(ANCHOR_LEFT)
            
            local dropdown_button = self.content:AddChild(TextButton())
            dropdown_button:SetPosition(70, y_pos, 0)
            dropdown_button:SetText(option.options[option.selected or 1] or "Select...")
            dropdown_button:SetFont(BUTTONFONT)
            dropdown_button:SetTextSize(25)
            dropdown_button:SetSize(200, 40)
            
            -- Variables for dropdown state
            option.dropdown_open = false
            
            dropdown_button:SetOnClick(function()
                if option.dropdown_menu then
                    option.dropdown_menu:Kill()
                    option.dropdown_menu = nil
                    option.dropdown_open = false
                    return
                end
                
                option.dropdown_open = true
                option.dropdown_menu = self.content:AddChild(Widget("dropdown_menu"))
                option.dropdown_menu:SetPosition(70, y_pos - 20 - (#option.options * 20), 0)
                
                -- Add background
                local menu_bg = option.dropdown_menu:AddChild(Image("images/ui.xml", "single_option_bg.tex"))
                menu_bg:SetSize(200, #option.options * 40)
                menu_bg:SetTint(0.1, 0.1, 0.1, 0.9)
                
                -- Add options
                for j, option_text in ipairs(option.options) do
                    local opt = option.dropdown_menu:AddChild(TextButton())
                    opt:SetPosition(0, (#option.options - j) * 40, 0)
                    opt:SetText(option_text)
                    opt:SetFont(BUTTONFONT)
                    opt:SetTextSize(25)
                    opt:SetSize(200, 40)
                    
                    opt:SetOnClick(function()
                        option.selected = j
                        dropdown_button:SetText(option_text)
                        option.dropdown_menu:Kill()
                        option.dropdown_menu = nil
                        option.dropdown_open = false
                        
                        if option.callback then
                            option.callback(j, option_text)
                        end
                    end)
                end
            end)
        end
    end
end

-- Save configuration
function ModConfigScreen:Save()
    -- Here you would typically save to mod settings
    -- For example using TheSim:SetPersistentString
    
    -- Example:
    local config_data = {}
    for _, option in ipairs(self.options) do
        config_data[option.id] = option.value
    end
    
    local config_str = json.encode(config_data)
    TheSim:SetPersistentString(self.modname .. "_config", config_str, false)
    
    -- Close screen
    TheFrontEnd:PopScreen(self)
    
    -- Notify that settings were saved
    if self.onsave then
        self.onsave(config_data)
    end
end

-- Cancel and close
function ModConfigScreen:Cancel()
    TheFrontEnd:PopScreen(self)
end

-- Handle input
function ModConfigScreen:OnControl(control, down)
    if ModConfigScreen._base.OnControl(self, control, down) then return true end
    
    if not down and control == CONTROL_CANCEL then
        self:Cancel()
        return true
    end
    
    return false
end

-- Usage:
-- local options = {
--     {id = "enable_feature", name = "Enable Feature", type = "checkbox", value = true},
--     {id = "difficulty", name = "Difficulty", type = "slider", min = 0, max = 1, value = 0.5},
--     {id = "character", name = "Character", type = "dropdown", options = {"Wilson", "Willow", "Wolfgang"}, selected = 1}
-- }
-- 
-- local config_screen = ModConfigScreen("My Cool Mod", options)
-- config_screen.onsave = function(data)
--     print("Settings saved!")
-- end
-- 
-- TheFrontEnd:PushScreen(config_screen)
```

### Creating an In-Game HUD Element

```lua
-- Define a custom HUD element
local CustomHUD = Class(Widget, function(self)
    Widget._ctor(self, "CustomHUD")
    
    -- Set anchor to top-right corner
    self:SetVAnchor(ANCHOR_TOP)
    self:SetHAnchor(ANCHOR_RIGHT)
    self:SetScaleMode(SCALEMODE_PROPORTIONAL)
    self:SetPosition(-150, -100, 0)
    
    -- Create background
    self.bg = self:AddChild(Image("images/ui.xml", "single_option_bg.tex"))
    self.bg:SetSize(250, 120)
    self.bg:SetTint(0.1, 0.1, 0.1, 0.7)
    
    -- Add title
    self.title = self:AddChild(Text(BUTTONFONT, 30))
    self.title:SetPosition(0, 40, 0)
    self.title:SetString("Custom HUD")
    
    -- Add value display
    self.value_text = self:AddChild(Text(NUMBERFONT, 40))
    self.value_text:SetPosition(0, 0, 0)
    self.value_text:SetString("0")
    
    -- Add button
    self.button = self:AddChild(TextButton())
    self.button:SetPosition(0, -40, 0)
    self.button:SetText("Action")
    self.button:SetOnClick(function() self:DoAction() end)
    self.button:SetFont(BUTTONFONT)
    self.button:SetTextSize(25)
    
    -- Initialize value
    self.value = 0
    
    -- Start update task
    self:StartUpdating()
end)

-- Update function called every frame
function CustomHUD:OnUpdate(dt)
    -- Example: Update based on player state
    local player = ThePlayer
    if player and player.components.health then
        local health_percent = player.components.health:GetPercent()
        self.value_text:SetString(string.format("%.0f%%", health_percent * 100))
        
        -- Change color based on health
        if health_percent < 0.25 then
            self.value_text:SetColour(1, 0, 0, 1) -- Red for low health
        elseif health_percent < 0.5 then
            self.value_text:SetColour(1, 1, 0, 1) -- Yellow for medium health
        else
            self.value_text:SetColour(0, 1, 0, 1) -- Green for high health
        end
    end
end

-- Custom action function
function CustomHUD:DoAction()
    local player = ThePlayer
    if player then
        -- Example action: Heal player a bit
        if player.components.health then
            player.components.health:DoDelta(10)
        end
    end
end

-- Show the HUD
function CustomHUD:Show()
    self:StartUpdating()
    self:SetClickable(true)
    self:Show()
end

-- Hide the HUD
function CustomHUD:Hide()
    self:StopUpdating()
    self:SetClickable(false)
    self:Hide()
end

-- Usage in a mod:
-- local function AddCustomHUD()
--     local hud = CustomHUD()
--     TheFrontEnd:GetHUD():AddChild(hud)
--     return hud
-- end
-- 
-- -- Add when player spawns
-- AddPlayerPostInit(function(player)
--     if player == ThePlayer then
--         player:DoTaskInTime(1, function()
--             AddCustomHUD()
--         end)
--     end
-- end)
```

## UI Animation and Styling

### Creating Animated UI Elements

```lua
-- Function to create a pulsing icon
local function MakePulsingIcon(parent, atlas, texture, position, size)
    local icon = parent:AddChild(Image(atlas, texture))
    icon:SetPosition(position:Get())
    icon:SetSize(size, size)
    
    -- Animation variables
    icon.pulse_time = 0
    icon.pulse_speed = 1
    icon.pulse_min = 0.8
    icon.pulse_max = 1.2
    
    -- Start updating for animation
    icon:StartUpdating()
    
    -- Update function for pulsing effect
    icon.OnUpdate = function(self, dt)
        self.pulse_time = self.pulse_time + dt * self.pulse_speed
        local scale = self.pulse_min + (math.sin(self.pulse_time) + 1) * 0.5 * (self.pulse_max - self.pulse_min)
        self:SetScale(scale, scale, 1)
    end
    
    return icon
end

-- Function to create a spinning icon
local function MakeSpinningIcon(parent, atlas, texture, position, size)
    local icon = parent:AddChild(Image(atlas, texture))
    icon:SetPosition(position:Get())
    icon:SetSize(size, size)
    
    -- Animation variables
    icon.spin_time = 0
    icon.spin_speed = 1 -- rotations per second
    
    -- Start updating for animation
    icon:StartUpdating()
    
    -- Update function for spinning effect
    icon.OnUpdate = function(self, dt)
        self.spin_time = self.spin_time + dt * self.spin_speed
        local angle = self.spin_time * 360 % 360
        self:SetRotation(angle)
    end
    
    return icon
end

-- Function to create a fading icon
local function MakeFadingIcon(parent, atlas, texture, position, size)
    local icon = parent:AddChild(Image(atlas, texture))
    icon:SetPosition(position:Get())
    icon:SetSize(size, size)
    
    -- Animation variables
    icon.fade_time = 0
    icon.fade_speed = 0.5
    icon.fade_min = 0.3
    icon.fade_max = 1.0
    
    -- Start updating for animation
    icon:StartUpdating()
    
    -- Update function for fading effect
    icon.OnUpdate = function(self, dt)
        self.fade_time = self.fade_time + dt * self.fade_speed
        local alpha = self.fade_min + (math.sin(self.fade_time) + 1) * 0.5 * (self.fade_max - self.fade_min)
        self:SetTint(1, 1, 1, alpha)
    end
    
    return icon
end

-- Usage:
-- local pulsing_icon = MakePulsingIcon(self.root, "images/inventoryimages.xml", "hammer.tex", Vector3(0, 0, 0), 64)
-- local spinning_icon = MakeSpinningIcon(self.root, "images/inventoryimages.xml", "compass.tex", Vector3(100, 0, 0), 64)
-- local fading_icon = MakeFadingIcon(self.root, "images/inventoryimages.xml", "torch.tex", Vector3(-100, 0, 0), 64)
```

### Creating Styled UI Elements

```lua
-- Function to create a styled button
local function MakeStyledButton(parent, text, position, onclick, style)
    style = style or "default"
    
    local button = parent:AddChild(Widget("styled_button"))
    button:SetPosition(position:Get())
    
    -- Add background based on style
    local bg = nil
    if style == "default" then
        bg = button:AddChild(Image("images/ui.xml", "button.tex"))
        bg:SetSize(200, 60)
        bg:SetTint(0.7, 0.7, 0.7, 1)
    elseif style == "red" then
        bg = button:AddChild(Image("images/ui.xml", "button.tex"))
        bg:SetSize(200, 60)
        bg:SetTint(0.8, 0.3, 0.3, 1)
    elseif style == "green" then
        bg = button:AddChild(Image("images/ui.xml", "button.tex"))
        bg:SetSize(200, 60)
        bg:SetTint(0.3, 0.8, 0.3, 1)
    elseif style == "blue" then
        bg = button:AddChild(Image("images/ui.xml", "button.tex"))
        bg:SetSize(200, 60)
        bg:SetTint(0.3, 0.3, 0.8, 1)
    elseif style == "gold" then
        bg = button:AddChild(Image("images/ui.xml", "button.tex"))
        bg:SetSize(200, 60)
        bg:SetTint(0.8, 0.8, 0.2, 1)
    end
    
    -- Add text
    local label = button:AddChild(Text(BUTTONFONT, 30))
    label:SetPosition(0, 0, 0)
    label:SetString(text)
    
    -- Add hover effect
    button.OnGainFocus = function()
        bg:SetScale(1.1, 1.1, 1)
        label:SetScale(1.1, 1.1, 1)
    end
    
    button.OnLoseFocus = function()
        bg:SetScale(1, 1, 1)
        label:SetScale(1, 1, 1)
    end
    
    -- Make clickable
    button:SetOnClick(onclick)
    
    return button
end

-- Function to create a panel with border
local function MakeBorderedPanel(parent, position, width, height, title)
    local panel = parent:AddChild(Widget("bordered_panel"))
    panel:SetPosition(position:Get())
    
    -- Add background
    local bg = panel:AddChild(Image("images/ui.xml", "bg_plain.tex"))
    bg:SetSize(width, height)
    bg:SetTint(0.2, 0.2, 0.2, 0.8)
    
    -- Add border
    local border_size = 4
    
    -- Top border
    local top_border = panel:AddChild(Image("images/ui.xml", "white.tex"))
    top_border:SetSize(width, border_size)
    top_border:SetPosition(0, height/2 - border_size/2, 0)
    top_border:SetTint(0.8, 0.8, 0.8, 1)
    
    -- Bottom border
    local bottom_border = panel:AddChild(Image("images/ui.xml", "white.tex"))
    bottom_border:SetSize(width, border_size)
    bottom_border:SetPosition(0, -height/2 + border_size/2, 0)
    bottom_border:SetTint(0.8, 0.8, 0.8, 1)
    
    -- Left border
    local left_border = panel:AddChild(Image("images/ui.xml", "white.tex"))
    left_border:SetSize(border_size, height)
    left_border:SetPosition(-width/2 + border_size/2, 0, 0)
    left_border:SetTint(0.8, 0.8, 0.8, 1)
    
    -- Right border
    local right_border = panel:AddChild(Image("images/ui.xml", "white.tex"))
    right_border:SetSize(border_size, height)
    right_border:SetPosition(width/2 - border_size/2, 0, 0)
    right_border:SetTint(0.8, 0.8, 0.8, 1)
    
    -- Add title if provided
    if title then
        local title_bg = panel:AddChild(Image("images/ui.xml", "single_option_bg.tex"))
        title_bg:SetSize(width * 0.6, 40)
        title_bg:SetPosition(0, height/2 + 20, 0)
        title_bg:SetTint(0.3, 0.3, 0.3, 0.9)
        
        local title_text = panel:AddChild(Text(TITLEFONT, 30))
        title_text:SetPosition(0, height/2 + 20, 0)
        title_text:SetString(title)
    end
    
    -- Add content container
    panel.content = panel:AddChild(Widget("content"))
    panel.content:SetPosition(0, 0, 0)
    
    return panel
end

-- Function to create a tooltip
local function MakeTooltip(text, position)
    local tooltip = Widget("tooltip")
    tooltip:SetPosition(position:Get())
    
    -- Add background
    local bg = tooltip:AddChild(Image("images/ui.xml", "single_option_bg.tex"))
    
    -- Add text
    local tooltip_text = tooltip:AddChild(Text(BODYTEXTFONT, 20))
    tooltip_text:SetPosition(0, 0, 0)
    tooltip_text:SetString(text)
    tooltip_text:SetVAlign(ANCHOR_MIDDLE)
    tooltip_text:SetHAlign(ANCHOR_MIDDLE)
    tooltip_text:SetRegionSize(300, 100)
    
    -- Size background based on text
    local w, h = tooltip_text:GetRegionSize()
    bg:SetSize(w + 20, h + 20)
    
    return tooltip
end

-- Function to add a tooltip to a widget
local function AddTooltipToWidget(widget, tooltip_text)
    widget.tooltip = nil
    
    widget.OnGainFocus = function(self)
        if self.tooltip then
            self.tooltip:Kill()
        end
        
        self.tooltip = self:AddChild(MakeTooltip(tooltip_text, Vector3(0, -50, 0)))
    end
    
    widget.OnLoseFocus = function(self)
        if self.tooltip then
            self.tooltip:Kill()
            self.tooltip = nil
        end
    end
end

-- Usage:
-- local styled_button = MakeStyledButton(self.root, "Click Me", Vector3(0, 0, 0), function() print("Clicked!") end, "green")
-- local panel = MakeBorderedPanel(self.root, Vector3(0, 0, 0), 300, 200, "My Panel")
-- AddTooltipToWidget(styled_button, "This is a helpful tooltip that explains what this button does")
``` 
