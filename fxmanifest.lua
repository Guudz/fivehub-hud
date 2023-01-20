fx_version 'adamant'

game 'gta5'

description 'FH Store [HUD]'
authors 'Apolo & snaildev (store.fivehub.es)'
webpage 'store.fivehub.es'
version '0.0.3'

shared_scripts {
    'config/main.lua'
}

client_scripts {
    'client/*.lua'
}

server_scripts {
    'server/*.lua'
}

ui_page 'nui/index.html'

files {
    'nui/index.html',
    'nui/css/style.css',
    'nui/js/app.js'
}