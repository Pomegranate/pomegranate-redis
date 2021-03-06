/**
 * @file index
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate-redis
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
var redis = require('redis');
var client;
/**
 *
 * @module index
 */

exports.options = {
  host: 'localhost',
  port: '6379',
  password: null,
  clientOptions: {}
};

exports.metadata = {
  name: 'RedisCore',
  type: 'service',
  param: 'Redis'
}

exports.plugin = {
  load: function(inject, loaded) {
    var self = this;
    var serverHost = this.options.host;
    var serverPort = this.options.port;
    var clientOptions = this.options.clientOptions;
    client = redis.createClient(serverPort, serverHost, clientOptions);
    client.on('error', function(err){
      self.lateError(err)
    })
    client.on('ready', function(){
      loaded(null, client);
    })
  },
  start: function(done) {
    if(client.connected){
      return done()
    }
    return done(new Error('Redis client not connected'));
  },
  stop: function(done) {
    var self = this;
    client.on('end', function(){
      done(null)
    })
    client.quit();
  }
}