# doweallthinkthesame

## Design decisions:
1. I am keeping it simple and short as a proof of concept
2. Performance, I want it to easily scale well both horizontally and vertically without much effort

## Todo

### Functionality
1. Send questions to clients
2. Send positions to clients
3. Chat -> Seperate server?
4. WebsitePluginStore?

### Performance
1. Disconnect clients if time start slipping
2. Split up rooms over more servers, perhaps client side somehow? Let url define server?
  -> On trying to connect, if full, go to next server, just hardcode servers/ports? KISS
  -> Should rooms be coordinated somehow? How to let clients join the same private room?