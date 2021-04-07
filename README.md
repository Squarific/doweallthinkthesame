# doweallthinkthesame
No.

Small web app that allows sharing your opinion with the other people on the page.

## Goal
Give people the opportunity to think and communicate about their opinions.

## Hivemind gamemode
Stay close to the hivemind or die.

## Design decisions:
1. I am keeping it simple and short as a proof of concept
2. Performance, I want it to easily scale well both horizontally and vertically without much effort
3. Classes have public methods that define the contract and private methods that actually execute, this way it is easy to extend the private behavior on public calls.

## Todo

### Functionality
1. Chat -> Seperate server?
2. WebsitePluginStore?
3. Timer
4. Reveil after a while?
5. balls and only name on hover
6. 

### Performance
1. Disconnect clients if time start slipping
2. Split up rooms over more servers, perhaps client side somehow? Let url define server?
  -> On trying to connect, if full, go to next server, just hardcode servers/ports? KISS
  -> Should rooms be coordinated somehow? How to let clients join the same private room?
3. Stress test to see how many clients can be connected

