var input = []

var poolNumeros = []
var poolSignes = []

var missingNumeros = []
var missingSignes = []

var resultats = []


if (localStorage[new Date().toLocaleDateString()] != undefined) {
    var resultatsTrobats = JSON.parse(localStorage[new Date().toLocaleDateString()]).length
} else {
    var resultatsTrobats = 0
}


$(document).ready(() => {
    $.ajax({
        type: "POST",
        async: true,
        url: `/data`, 
        
        success: function (res) {
            $('#resultatsTotals')[0].innerHTML = res.resultatsTotals
            $('#numero')[0].innerHTML = res.numero

            for (var i = 0; i < res.numeros.length; i++) {
                if (i % 2 == 0) {
                    $('#num1')[0].innerHTML += `<button id='num-d1' onclick="handleNumeroClick('${res.numeros[i]}')" name="${res.numeros[i]}">${res.numeros[i]}</button>`
                } else {
                    $('#num2')[0].innerHTML += `<button id='num-d1' onclick="handleNumeroClick('${res.numeros[i]}')" name="${res.numeros[i]}">${res.numeros[i]}</button>`
                }
            }

            for (var i = 0; i < res.signes.length; i++) {
                if (i % 2 == 0) {
                    $('#sign1')[0].innerHTML += `<button id='signe-d1' onclick="handleSigneClick('${res.signes[i]}')" name="${res.signes[i]}">${res.signes[i]}</button>`
                } else {
                    $('#sign2')[0].innerHTML += `<button id='signe-d1' onclick="handleSigneClick('${res.signes[i]}')" name="${res.signes[i]}">${res.signes[i]}</button>`
                }
            }

            for (var i = 0; i < res.numeros.length + res.signes.length; i++) {
                if (i % 2 == 0) {
                    $('.d2')[0].innerHTML +=  `<div class="input-d2" id="odd-d2" name="${i}"></div>`
                } else {
                    $('.d2')[0].innerHTML +=  `<div class="input-d2" id="even-d2" name="${i}"></div>`
                }                
            }

            
            resultats = res.resultats

            poolNumeros = res.numeros
            poolSignes = res.signes

            $('.d2')[0].innerHTML += '<h2>=</h2>'

            revisarButtons()
            recarregarTrobats()
        }
    });    
    //for (var i = 0; i < input.length)
})

function handleNumeroClick(numero) {
    if (input.length >= $('.input-d2').length) { return false }
    if (input.length % 2 == 0) {
        $(`div[name=${input.length}]`)[0].innerHTML = numero
        input[input.length] = numero
        revisarButtons()
        calcularTotal()

        for (var i = 0; i < poolNumeros.length; i++) {
            if (poolNumeros[i] == numero) {
                missingNumeros.push(poolNumeros[i])
                poolNumeros.splice(i, 1)                
            }
        }
    }
}

function handleSigneClick(signe) {
    if (input.length >= $('.input-d2').length) { return false }
    if (!(input.length % 2 == 0)) {
        $(`div[name=${input.length}]`)[0].innerHTML = signe
        input[input.length] = signe
        revisarButtons()

        for (var i = 0; i < poolSignes.length; i++) {
            if (poolSignes[i] == signe) {
                missingSignes.push(poolSignes[i])
                poolSignes.splice(i, 1)
            }
        }
    }
}

function borrarUltim() {
    if (input.length <= 0) { return false }
    if ((input.length-1) % 2 == 0) {
        for (var i = 0; i < missingNumeros.length; i++) {
            if (input[input.length-1] == missingNumeros[i]) {
                poolNumeros.push(missingNumeros[i])
                missingNumeros.splice(i, 1)
            }
        }
    } else {
        for (var i = 0; i < missingSignes.length; i++) {
            if (input[input.length-1] == missingSignes[i]) {
                poolSignes.push(missingSignes[i])
                missingSignes.splice(i, 1)
            }
        }
    }

    $(`div[name=${input.length-1}]`)[0].innerHTML = ""
    input.splice(input.length-1, 1)
    revisarButtons()
    calcularTotal()
    
}

function revisarButtons() {
    if (input.length == $('.input-d2').length) { 
        for (var i = 0; i < $('.d1 button').length; i++) {
            $('.d1 button')[i].disabled = true
        }
        return false
    }

    if (!(input.length % 2 == 0)) {
        for (var i = 0; i < $('button#num-d1').length; i++) {
            $('button#num-d1')[i].disabled = true
        }
        for (var i = 0; i < $('button#signe-d1').length; i++) {
            $('button#signe-d1')[i].disabled = false
            for (var x = 0; x < missingSignes.length; x++) {
                if ($('button#signe-d1')[i].name == missingSignes[x]) {
                    $('button#signe-d1')[i].disabled = true
                }
            }
        }
    } else {
        for (var i = 0; i < $('button#signe-d1').length; i++) {
            $('button#signe-d1')[i].disabled = true
        }
        for (var i = 0; i < $('button#num-d1').length; i++) {
            $('button#num-d1')[i].disabled = false
            for (var x = 0; x < missingNumeros.length; x++) {
                if ($('button#num-d1')[i].name == missingNumeros[x]) {
                    $('button#num-d1')[i].disabled = true
                }
            }
        }
    }
}

function parseResultat(num1, sim, num2) {
	if (sim == "+") {
		return num1 + num2
	} else if (sim == "*") {
		return num1 * num2
	} else if (sim == "/") {
		return num1 / num2
	} else if (sim == "-") {
		return num1 - num2
	} else if (sim == "^") {
		return Math.pow(num1, num2)
	}
}

function calcularTotal() {
    var tmp = 0
    for (var i = 0; i < input.length-2; i = i+2) {
        if (i == 0) { 
            tmp = parseResultat(parseInt(input[i]), input[i+1], parseInt(input[i+2]))
        } else {
            tmp = parseResultat(tmp, input[i+1], parseInt(input[i+2]))
        }
    }
    if (input.length == 1) {
        $('#resultat')[0].innerHTML = input[0]
        return false
    }
    $('#resultat')[0].innerHTML = tmp
}

function verificarResultat() {
    if (input.length != $('.d1 button').length) {
        console.log("No has omplert totes les caselles")    
        return false
    }
    
    /*var numeros = []
    var signes = []

    for (var i = 0; i < input.length; i++) {
        if (i % 2 == 0) {
            numeros.push(input[i])
        } else {
            signes.push(input[i])
        }
    }

    for (var i = 0; i < resultats.length; i++) {
        si = true
        
        for (var x = 0; x < resultats[i][0].length; x++) {
            if (!(resultats[i][0][x] == numeros[x])) {
                si = false
            }
        }

        for (var x = 0; x < resultats[i][1][x]; x++) {
            if (!(resultats[i][1][x] == signes[x])) {
                si = false
            }
        }

        if (si) {
            if (localStorage[new Date().toLocaleDateString()] != undefined) {
                var data = JSON.parse(localStorage[new Date().toLocaleDateString()])
                for (var x = 0; x < data.length)
                
                data.push([numeros, signes])
                localStorage[new Date().toLocaleDateString()] = JSON.stringify(data)
            } else {
                localStorage[new Date().toLocaleDateString()] = JSON.stringify([[numeros, signes]])
            }

            return true
        }
    } 

    console.log(numeros, signes)*/

    if (parseFloat($('#resultat')[0].innerHTML) == parseFloat($('#numero')[0].innerHTML)) {
        if (localStorage[new Date().toLocaleDateString()] != undefined) {
            var data = JSON.parse(localStorage[new Date().toLocaleDateString()])
            
            for (var i = 0; i < data.length; i++) {
                if (input.toString() == data[i].toString()) {
                    console.log("Ja hi és")
                    return false
                } else {
                    data.push(input)
                    localStorage[new Date().toLocaleDateString()] = JSON.stringify(data)
                    resultatsTrobats++
                    recarregarTrobats()
                    console.log("Molt bé!")
                }
            }

            
        } else {
            localStorage[new Date().toLocaleDateString()] = JSON.stringify([input])
            console.log("Molt bé!")
        }
    } else {
        console.log("L'operació no dóna el nombre cercat")
    }
}

function recarregarTrobats() {
    $('#resultatsTrobats')[0].innerHTML = resultatsTrobats
}