"use strict";

var pogo = require("pogobuf");

function login(obj, resolve) {

  obj.provider = obj.provider === "ptc" ? "ptc" : "google";

  var client = new pogo.Client();
  var provider = obj.provider === "ptc" ? new pogo.PTCLogin() : new pogo.GoogleLogin();

  provider.login(obj.username, obj.password).then(function(token) {
    client.setAuthInfo(obj.provider, token);
    return (client.init());
  }).then(function() {
    resolve(client);
  });
};

function processHatchedEggs(player, resp) {
  player.eggs = resp;
};

function processInventory(player, resp) {
  let ii = 0;
  let length = resp.inventory_delta.inventory_items.length;
  let node = null;
  for (; ii < length; ++ii) {
    node = resp.inventory_delta.inventory_items[ii];
    let data = node.inventory_item_data;
    if (data.pokemon_data) {
      let pokemon = data.pokemon_data;
      if (
        pokemon.cp > 0 &&
        pokemon.pokemon_id > 0 &&
        pokemon.pokeball > 0
      ) {
        player.pokemons.push(data.pokemon_data);
      }
    }
    else if (data.item) {
      player.items.push(data.item);
    }
    else if (data.pokedex_entry) {
      player.pokedex.push(data.pokedex_entry);
    }
    else if (data.player_stats) {
      delete data.player_stats.pokemon_caught_by_type;
      for (let key in data.player_stats) {
        if (!player.stats.hasOwnProperty(key)) {
          player.stats[key] = data.player_stats[key];
        }
      };
    }
    else if (data.inventory_upgrades) {
      player.upgrades.push(data.inventory_upgrades);
    }
    else if (data.applied_items) {
      player.active.push(data.applied_items);
    }
    else if (data.egg_incubators) {
      player.incubators.push(data.egg_incubators);
    }
    else if (data.candy) {
      player.candies.push(data.candy);
    }
  };
};

module.exports = function(obj, resolve) {
  login({
    provider: obj.provider,
    username: obj.username,
    password: obj.password
  }, function(client) {
    var player = {
      stats: null,
      eggs: null,
      badges: null,
      currencies: [],
      items: [],
      pokemons: [],
      pokedex: [],
      upgrades: [],
      active: [],
      incubators: [],
      candies: []
    };
    client.getPlayer("3300").then(function(resp) {
      player.stats = resp.player_data;
      client.getInventory(0).then(function(resp) {
        processInventory(player, resp);
        client.getHatchedEggs().then(function(resp) {
          processHatchedEggs(player, resp);
          client.getPlayerProfile(player.stats.username).then(function(resp) {
            player.badges = resp.badges;
            resolve(player);
          });
        });
      });
    });
  });
};