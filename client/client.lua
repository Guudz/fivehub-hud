-- Core

ESX = nil

HUD = {}
HUD.Functions = {}

Citizen.CreateThread(function()
    while ESX == nil do
        TriggerEvent(Config.TriggerESX, function(wave) ESX = wave end)
        Citizen.Wait(150)
    end
end)

-- END Core

-- Vars

local _hunger = 50
local _thirst = 50

local _cash = 0

local _showVeh = false
local _voiceSended = false

-- Events

RegisterNetEvent('fivehub-hud:client:getPlayerInfo')
AddEventHandler('fivehub-hud:client:getPlayerInfo', function(money)
    _cash = money

    SendNUIMessage({
        money = _cash
    })
end)

-- END Events

-- Threads

Citizen.CreateThread(function()
    while true do
        Citizen.Wait(2000)

        TriggerServerEvent('fivehub-hud:server:givePlayerInfo')
    end
end)

Citizen.CreateThread(function() -- Loop to send vehicle info to JS
    while true do
        local _wait = 1500

        local _char = PlayerPedId()
        local _charPos = GetEntityCoords(_char)
        local _charId = GetPlayerServerId(PlayerId())
        
        local _charVeh = GetVehiclePedIsIn(_char)

        if IsPedInAnyVehicle(_char) then
            _wait = 100

            local _vehFuel = nil

            if Config.UseLegacyFuel then
                _vehFuel = exports["LegacyFuel"]:GetFuel(_charVeh)
            else
                _vehFuel = GetVehicleFuelLevel(_charVeh)
            end

            local _vehBody = (GetVehicleEngineHealth(_charVeh) / 10)

            if _char then
                if _charVeh and GetPedInVehicleSeat(_charVeh, -1) == _char then
                    local _vehSpeed = GetEntitySpeed(_charVeh)

                    SendNUIMessage({
                        kmh = math.ceil(_vehSpeed * 3.6),
                        fuel = _vehFuel,
                        body = _vehBody,
                        mph = math.ceil(_vehSpeed * 2.236936),
                        playerId = _charId
                    })

                    if not _showVeh then
                        SendNUIMessage({
                            kmh = math.ceil(_vehSpeed * 3.6),
                            fuel = _vehFuel,
                            body = _vehBody,
                            showVeh = true,
                            mph = math.ceil(_vehSpeed * 2.236936),
                            playerId = _charId
                        })

                        _showVeh = true
                    end
                end
            end
        else
            SendNUIMessage({
                playerId = _charId,
                showVeh = false
            })

            _showVeh = false
        end

        Citizen.Wait(_wait)
    end
end)

Citizen.CreateThread(function()
    while true do
        Citizen.Wait(4000)

        TriggerEvent('esx_status:getStatus', 'hunger', function(hunger)
            TriggerEvent('esx_status:getStatus', 'thirst', function(thirst)

                SendNUIMessage({
                    hunger = hunger.getPercent(),
                    drink = thirst.getPercent()
                })
            end)
        end)
    end
end)

Citizen.CreateThread(function()
    while true do
        Citizen.Wait(2500)
        if _hunger <= 20 and not Config.Food['hunger'] then
            if Config.ESXNotification then
                ESX.ShowNotification(Config.Messages['hungry'])
            elseif Config.MythicNotification then
                exports[Config.MythicName]:DoHudText('error', Config.Messages['hungry'])
            else
                print('^1[FH Hud] ^4- You need to change your config and active:^1 Config.ESXNotification^4 or^1 Config.MythicNotification')
            end

            Config.Food['hunger'] = true

            Citizen.SetTimeout(60000, function()
                Config.Food['hunger'] = false
            end)
        end

        if _thirst <= 20 and not Config.Food['thirst'] then
            if Config.ESXNotification then
                ESX.ShowNotification(Config.Messages['thirst'])
            elseif Config.MythicNotification then
                exports[Config.MythicName]:DoHudText('error', Config.Messages['thirst'])
            else
                print('^1[FH Hud] ^4- You need to change your config and active:^1 Config.ESXNotification^4 or^1 Config.MythicNotification')
            end

            Config.Food['thirst'] = true
            Citizen.SetTimeout(60000, function()
                Config.Food['thirst'] = false
            end)
        end
    end
end)

Citizen.CreateThread(function()
    while true do
        Citizen.Wait(500)

        local _chars = GetActivePlayers()
        local _char = PlayerPedId()
        local _charPos = GetEntityCoords(_char)

        for _key, _value in pairs(_chars) do
            local _zones = Config.Zones[GetNameOfZone(_charPos.x, _charPos.y, _charPos.z)]
            local _direction = Config.Directions[math.floor((GetEntityHeading(_char) + 22.5) / 45.0)]
            local _street = GetStreetNameAtCoord(_charPos.x, _charPos.y, _charPos.z, Citizen.ResultAsInteger(), Citizen.ResultAsInteger())

            SendNUIMessage({
                hud = true,
                pauseMenu = IsPauseMenuActive(),
                street = GetStreetNameFromHashKey(_street),
                zone = _zones,
                direction = _direction
            })
        end
    end
end)

-- END Threads