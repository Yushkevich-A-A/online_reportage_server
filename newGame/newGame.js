const { eventSubscription, matchEvents } = require('./../db/db');

class NewGame { 
  constructor() {
    this.matchEvents = matchEvents.data;
    this.createNewGame();
  }

  createNewGame() {
    const dateStartGame = +new Date()
    eventSubscription.add({date: dateStartGame, type: null, message:'Игра началась'});
    const timeFirstEvent = Math.round(Math.random() * 300) * 1000;

    this.timer = setTimeout(function matchEvent() {
      if (eventSubscription.data.length === 50) {
        eventSubscription.add({type: null, message:'Игра окончена'});
        clearTimeout(this.timer);
        return;
      }

      const percent = Math.round(Math.random() * 10);
      const nextTimer = Math.round(Math.random() * 300) * 1000;
    
      let item = null;
      if (percent <= 5) {
        item = matchEvents.data[2];
      } else if (percent <= 8) {
        item = matchEvents.data[1];
      } else {
        item = matchEvents.data[0];
      }
      const dateEvent = +new Date();
      item.date = dateEvent;
      eventSubscription.add(item);
      console.log(item)
      this.timer = setTimeout(matchEvent, nextTimer);
    }, timeFirstEvent);
    
  }
}

module.exports = {
  NewGame,
}