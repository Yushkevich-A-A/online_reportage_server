module.exports = {
  eventSubscription: {
    data: [],
    add: function(item) {
      this.data.push(item);
      this.handlers.forEach(h => h(item));
    },
    handlers: [],
    listen: function(handler) {
      this.handlers.push(handler);
    },
    getAllData: function() {
      this.handlers.forEach(h => h({status: 'init', data: this.data}));
    }
  },
  matchEvents: {
    data: [
      {type: 'goal', message:'Отличный удар! И Г-О-О-О-Л!'},
      {type: 'freekick', message:'Нарушение правил, будет штрафной удар'},
      {type: null, message:'Идет перемещение мяча по полю, игроки и той, и другой команды активно пытаются атаковать'}
    ]
  }
}