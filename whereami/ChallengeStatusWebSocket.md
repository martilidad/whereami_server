# how do the clients share their status with each other?


## serverside
* server simply registers clients: publish/subscribe system to a specific challenge_id
* new/lost connections cause new sync timestamp

## clientside

page/script (listener):
* creates or reuses worker for corresponding challenge_id
* sets status on worker when possible
* receives message from worker when statuslist changes
* displays corresponding data for statuslist and/or starts challenge etc.


shared worker:
* one shared worker for each challenge_id
* shared worker receives current status from open page e.g. on invite page
* each worker sends their current status when requested to sync
* shared worker handles connection to server
* messages from server update statuslist
* new client updates(messages from server) trigger message to listeners after timeout




