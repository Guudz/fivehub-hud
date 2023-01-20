var hambre = 100
var eatInt, drinkInt, adminServiceInt, haveWeapon, inVehicle, vehicleClass = null, maxNotifications, notifications, notificationQueue, notificationQueueInterval;

const body = $('body');
const achievement = $('.achievement');
const premium = $('.premium');
const fixedtxt = $('.fixedtxt');
const bigNoty = $('.big-noty');
const radio = $('.radio');
const eatIcon = $('.eat i');

function animEat() {
    let normal = 1.25;
    let big = 1.5;

    eatIcon.animate({
        fontSize: `${big}vw`,
        opacity: 0.75,
    }, 1000, () => {});

    eatIcon.animate({
        fontSize: `${normal}vw`,
        opacity: 1,
    }, 1500, () => {});
}

function setEat(value) {
    value = parseInt(value);

    eatIcon.css('background', '-webkit-linear-gradient(90deg, var(--yellow-color) 0%, var(--yellow-color) '+value+'%, rgba(255, 255, 255, 1) '+value+'%)');
    eatIcon.css('-webkit-background-clip', 'text');
    eatIcon.css('-webkit-text-fill-color', 'transparent');

    if (value < 25) if (eatInt == null) eatInt = setInterval(animEat, 3000);
    else {
        if (eatInt != null) {
            clearInterval(eatInt);
            eatInt = null;
        }
    }
}

function animDrink() {
    let normal = 1.25;
    let big = 1.5;

    $('.drink i').show().animate({
        fontSize: `${big}vw`,
        opacity: 0.75,
    }, 1000, () => {});

    $('.drink i').show().animate({
        fontSize: `${normal}vw`,
        opacity: 1,
    }, 1500, () => {});
}

function setDrink(value) {
    value = parseInt(value);

    $('.drink i').css('background', `-webkit-linear-gradient(90deg, var(--blue-color) 0%, var(--blue-color) ${value}%, rgba(255, 255, 255, 1) ${value}%)`
    );
    $('.drink i').css('-webkit-background-clip', 'text');
    $('.drink i').css('-webkit-text-fill-color', 'transparent');

    if (value < 25) if (drinkInt == null) drinkInt = setInterval(animDrink, 3000);
    else {
        if (drinkInt != null) {
            clearInterval(drinkInt);
            drinkInt = null;
        }
    }
}

// Para indicar la id temporal del personaje
function setId(value) {$('.r3 .label p').text(value);}

// Para indicar la dirección
function setDirection(value) {$('.direction p').text(value);}

// Para indicar la zona en la que se encuentra el personaje
function setZone(value) {
    $('.zone').text(value);
}

// Para indicar en la calle que se encuentra el personaje
function setStreet(value) {
    $('.street').text(value);
}

// Para indicar tanto la zona como la calle como la dirección que se encuentra el personaje
function setAddress(direction, zone, street) {
    if (direction != null && zone != null && street != null) {
        setDirection(direction);
        setZone(zone);
        setStreet(street);
    }
}

// Para indicar a la velocidad que va el vehículo
function setSpeed(value) {
    $('.speed .value').text(value);
}

//Para activar el micro en true
function setVoice(bool) {
    let duration, color;

    if (bool) {
        duration = '250ms';
        color = 'var(--green-color)';
    } else {
        duration = '500ms';
        color = 'var(--red-color)';
    }

    $('.voice').css('transition', 'border ' + duration);
    $('.voice i').css('transition', 'color ' + duration);
    $('.voice').css('border-color', color);
    $('.voice i').css('color', color);
}


// Animación para cuando está en adminservicio

const admin = $('.admin');


function animAdminService() {
    admin.animate({opacity: '.25'}, 1500, () => {});
    admin.animate({opacity: '1'}, 1500, () => {});
}

// Para indicar si está en adminservicio
function isAdminService(bool) {
    if (bool) {
        admin.show();
        adminServiceInt = setInterval(animAdminService, 6000);
    } else {
        admin.hide();
        clearInterval(adminServiceInt);
    }
}

function setFuel(type, amount) {
    let color, unit;

    type = parseInt(type);
    amount = parseInt(amount);

    if (type == 0) {
        if (amount <= 20) color = 'var(--red-color)';
        else if (amount > 20) color = 'var(--green-color)';

        unit = 'L';
        $('.fuel i').removeClass('fa-charging-station').addClass('fa-gas-pump');
    } else if (type == 1) {
        if (amount <= 20) color = '#FF0000';
        else if (amount > 20) color = '#009BDB';

        unit = '%';
        $('.fuel i').removeClass('fa-gas-pump').addClass('fa-charging-station');
    }

    $('.fuel .circle-md').css('border-color', color);
    $('.fuel p').text(amount + unit);
}

// Para indicar los km totales del vehículo
function setKm(km) {
    /*km = km
        .toString()
        .split('')
        .reverse()
        .join('')
        .replace(/(?=\d*\.?)(\d{3})/g, '$1.');
    km = km.split('').reverse().join('').replace(/^[\.]/, '');*/
    km = km.toFixed(1);
    $('.km .value').text(km);
}

function showVehicle(bool) {
    let vehicle = $('.vehicle-info');

    if (bool) {
        vehicle.animate({
            marginBottom: '0',
            opacity: '1',
        }, 200, () => {});

        inVehicle = true;
    } else {
        vehicle.animate({
            marginBottom: '-10vh',
            opacity: '0',
        }, 200, () => {});

        inVehicle = false;
    }
}

// Para indicar el daño del vehículo
function setDamage(value) {
    let color, className;

    $('.damage i').removeClass('fa-car fa-car-mechanic fa-car-crash');

    if (value <= 25) {
        color = 'var(color-red)';
        className = 'fa-car-crash';
    }

    if (value > 25 && value < 75) {
        color = '#FF8A00';
        className = 'fa-car-mechanic';
    }

    if (value >= 75) {
        color = '#009BDB'
        className = 'fa-car';
    }

    $('.damage p').text(value.toFixed(0) + '%');
    $('.damage .circle-md').css('border-color', color);
    $('.damage i').addClass(className);
}





isAdminService(true)

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

function setMoney(value) {
    $('.money p').html(formatNumber(value));
}

window.addEventListener('message', function (event) {
    $("#StatusHud #stress").hide()
    let data = event.data
    loadStats = function(){
        $('#shieldval').html(Math.round(data.armour))
        $('#hungerlevel').html(Math.round(data.hunger))
        $('#waterlevel').html(Math.round(data.thirst))
    }
    if(typeof data.fuel == "number"){
        setFuel(0, data.fuel)
    }
    
    if (typeof data.money == "number") {
        setMoney(data.money);
    }

    if(typeof data.body == "number"){
        setDamage(data.body)
    }

    if(typeof data.showVeh == "boolean"){
        showVehicle(data.showVeh)
    }
    if (typeof data.playerId == "number") {  
        setId(data.playerId)
    }


    if (typeof data.hunger == "number" || typeof data.drink == "number") {
        setEat(data.hunger)
        setDrink(data.drink)
        if (data.hunger <= 25) {
            animEat()
        }
        if (data.drink <= 25) {
            animDrink()
        }
    }

    setSpeed(data.kmh)

    if (data.talking == true && typeof data.talking == "boolean"){
        console.log(typeof data.talking)
        setVoice(true)
    }else if (data.talking == "quitar" && typeof data.talking == "string") {
        console.log("DESACTIVADO EN JS")
        setVoice(false)
    }

    setAddress(data.direction, data.street, data.zone)
    
    if (data.hud && data.pauseMenu != 1){
            $("body").show();
            if (data.health != -100){
                $('#healtlevel').html(Math.round(data.health))
                if (data.health < 50 ){
                    $('#healtlevel').addClass('red')
                }else{
                    $('#healtlevel').removeClass('red')
                }
            }else if(data.health == -100){
                $('#healtlevel').html("0")
                $('#healtlevel').addClass('red')
            }
            if(data.hudPosition == 'right'){
                $("#StatusHud").animate({"left": '28vh', "bottom":'3vh'},200 );
                $(".imagen").animate({"right": '28vh', "bottom":'30vh'},500 );
            }else{
                if(data.HaveWeapon == false){
                    $(".imagen").animate({"right": '38vh', "bottom":'0vh'},500 );
                }
                $("#StatusHud").animate({"left": '0.7vh', "bottom":'0.7vh'},350 );
                if(data.HaveWeapon == true){
                    $(".imagen").animate({"right": '28vh', "bottom":'-3.65vh'},500 );
                    $(".imagen").animate({"left": '92.9%', "bottom":'-3.65vh'},500 );
                }
            }
            loadStats();
    }else{
        //$("body").hide()
    }
});
