const { eventSubscription, matchEvents } = require('./../db/db');

class NewGame { 
  constructor() {
    this.matchEvents = matchEvents.data;
    this.createNewGame();
  }

  createNewGame() {
    eventSubscription.add({type: null, message:'Игра началась'});

    this.timer = setTimeout(function matchEvent() {
      if (eventSubscription.data.length === 50) {
        eventSubscription.add({type: null, message:'Игра окончена'});
        clearTimeout(this.timer);
        return;
      }

      const percent = Math.round(Math.random() * 10);
      const nextTimer = Math.round(Math.random() * 20) * 1000;
    
      let item = null;
      if (percent >= 5) {
        item = matchEvents.data[2];
      } else if (percent >= 2) {
        item = matchEvents.data[1];
      } else {
        item = matchEvents.data[0];
      }
    
      item.date = Date.now();
      eventSubscription.add(item);
      this.timer = setTimeout(matchEvent, nextTimer);
    }, 5000);
    
  }

  resetGame() {
    setTimeout(() => {
      eventSubscription.lenght = '';
      this.createNewGame();
    })
  }
}

module.exports = {
  NewGame,
}