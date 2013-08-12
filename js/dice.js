/* 
 Project: dice
 File: dice.js
 Author: Alex Kersten
 */


var myDataRef = new Firebase('https://amk-dice.firebaseio.com/');

myDataRef.on('child_added', function(snapshot) {
    if (snapshot.name() === 'diceroll') {
        //Add this roll to the history
        var data = snapshot.val();
        $('dyn-history-list').prepend('<li class="list-group-item fadein-history"><span class="badge">data.time</span><strong>data.user</strong> rolled <strong>data.roll</strong> on <small>data.maxroll</small></li>');
    } else if (snapshot.name() === 'timestamp') {
        var data = snapshot.val();
        $('dyn-history-list').prepend('<li class="list-group-item fadein-history"><span class="badge">data.time</span><strong>data.user</strong> inserted divder</li>');
    }
});


/**
 * Roll a dice up to and including max sides... Since this is just between us,
 * trust that no malicious JS gets injected to fix these rolls - completely
 * trusting the client and this would be awful if it weren't more than just 7
 * of us.. and if you're going to cheat at D&D, well, I can't stop you.
 * 
 * @param int max the maximum roll possible
 * @returns {undefined}
 */
function roll(max) {
   
}

/**
 * Adds an element to the Firebase database that serves as a divider/timestamp
 * in the rolls.
 * 
 * @returns {undefined}
 */
function insertTimestamp() {
    myDataRef.push({name: 'timestamp', data: {time: 'TIME HERE', user: 'USERNAME'}});
}