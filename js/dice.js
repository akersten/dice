/* 
 Project: dice
 File: dice.js
 Author: Alex Kersten
 */


var myDataRef = new Firebase('https://amk-dice.firebaseio.com/');

/*
 * Set up basic stuff, check for username cookie, if DNE then set to random
 * guest
 */
var rnd = ~~(Math.random() * 20);
$('#dyn-name-field').val('Guest ' + rnd);

myDataRef.child('actionhistory').on('child_added', function(snapshot) {
    var data = snapshot.val();
    if (data.type === 'diceroll') {
        //Add this roll to the history
        $('#dyn-history-list').prepend('<li class="list-group-item fadein-history"><span class="badge">' + data.time + '</span><strong>' + data.user + '</strong> rolled <strong>' + data.roll + '</strong> on <small>' + data.maxroll + '</small></li>');
    } else if (data.type === 'timestamp') {
        //Add a timestamp to the history
        $('#dyn-history-list').prepend('<li class="list-group-item fadein-history"><span class="badge">' + data.time + '</span><strong>' + data.user + '</strong> inserted divder</li>');
    } else if (data.type === 'percentroll') {
        $('#dyn-history-list').prepend('<li class="list-group-item fadein-history"><span class="badge">' + data.time + '</span><strong>' + data.user + '</strong> rolled <strong>' + data.roll + '&percnt;</strong></li>');
    }
});


/**
 * Just use the username in the text field. Yeah, you can fake rolls from other
 * players, but this is just for between friends so...
 * 
 * @returns string The username to use
 */
function getUser() {
    return $('#dyn-name-field').val();
}

/**
 * Returns a current timestamp
 * 
 * @returns string Hour:minute:second
 */
function getTimestamp() {
    var d = new Date();
    return d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes() + ':' + (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();
}

/**
 * Roll a dice up to and including max sides... Since this is just between us,
 * trust that no malicious JS gets injected to fix these rolls - completely
 * trusting the client and this would be awful if it weren't more than just 7
 * of us.. and if you're going to cheat at D&D, well, I can't stop you.
 * 
 * @param int max the maximum roll possible
 */
function roll(max) {
    if (max < 2) {
        alert('That\'s no roll.');
        return;
    }

    //Since it's exclusive top end and inclusive low end, this will do it:
    var roll = ~~(Math.random() * max) + 1;

    $('#dyn-roll-list').html('');
    for (var i = 1; i <= max; i++) {
        $('#dyn-roll-list').append('<li' + (i === roll ? ' class="rolled">' : '>') + i + '</li> ');
    }

    myDataRef.child('actionhistory').push({type: 'diceroll', time: getTimestamp(), user: getUser(), roll: roll, maxroll: max});
}


function rollPercentage() {
    //Since it's exclusive top end and inclusive low end, this will do it:
    var roll = ~~(Math.random() * 100) + 1;

    $('#dyn-roll-list').html('');
    for (var i = 1; i <= 100; i++) {
        $('#dyn-roll-list').append('<li' + (i === roll ? ' class="rolled">' : '>') + i + '&percnt;</li> ');
    }

    myDataRef.child('actionhistory').push({type: 'percentroll', time: getTimestamp(), user: getUser(), roll: roll});
}

/**
 * Adds an element to the Firebase database that serves as a divider/timestamp
 * in the rolls.
 */
function insertTimestamp() {
    myDataRef.child('actionhistory').push({type: 'timestamp', time: getTimestamp(), user: getUser()});
}


function clearActionHistory() {
    myDataRef.child('actionhistory').remove();
}