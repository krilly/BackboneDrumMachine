const DrumButton = Backbone.Model.extend({
  defaults: {
    title: 'basic button',
    pressed: false,
    audioId: 'default',
  },
});

const Drums = Backbone.Collection.extend({});
const drums = new Drums();

const DrumButtonView = Backbone.View.extend({
  model: new DrumButton(),
  tagName: 'td',
  initialize: function () {
    this.template = _.template($('.drum-button-template').html());
    this.model.on('change:pressed', () => {
      this.render();
    });
  },
  events: {
    'click .drum-button': 'click',
  },
  click: function () {
    this.model.set({ pressed: !this.model.get('pressed') });
  },
  render: function () {
    this.$el.html(this.template(this.model.toJSON()));
    const sound = $(`#${this.model.get('audioId')}`)[0];
    if (sound && this.model.get('pressed')) {
      sound.currentTime = 0;
      sound.play().then(() => {
        setTimeout(() => {
          this.model.set({ pressed: false });
        }, sound.duration * 1000);
      });
    }
    return this;
  },
});

const DrumTable = Backbone.View.extend({
  model: drums,
  el: $('.drum-machine-table'),
  initialize: function () {
    // not needed at the moment
  },
  render: function () {
    const self = this;
    _.each(this.model.toArray(), function (drum, index) {
      const row = $(`#tr-${Math.floor(index / 3) + 1}`);
      row.append(new DrumButtonView({ model: drum }).render().$el);
    });
    return this;
  },
});

const drumTable = new DrumTable();

$(document).ready(function () {
  for (let i = 0; i < 9; i++) {
    const blog = new DrumButton({
      title: `Button_${i}`,
      audioId: `audio-${i}`,
    });
    drums.add(blog);
  }
  drumTable.render();
});
