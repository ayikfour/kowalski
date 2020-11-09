# Kowalski-lite cli
> Kowalski-lite is a CLI tool for summarizing twit with tf-idf method. This project was ported from [kowalski-lite python](https://https://github.com/gitfarhan/kowalski_lite) made by bitxt/@gitfarhan

## Requirements
1. Twitter developer account
2. Minimal node version >=8.0

## Install
Kowalski should be installed globally for better experience.
```bash
npm install -g kowalski-lite
```

## How to use
for the first time using, you will be promted with error saying something like this:
```bash
✖ kowalski found some problem ヽ(`⌒´メ)ノ
Twit config must include `consumer_key` when using user auth.
Twit config must include `consumer_key` when using user auth.
```

now, you need to provide kowalski-with developer token. If you don't have, you can [follow this guide for creating developer account](https://dev.to/sumedhpatkar/beginners-guide-how-to-apply-for-a-twitter-developer-account-1kh7)

then, try to check if your token was recorded:
```bash
kowalski auth
```

### Reconfiguring your tokens
if you, somehow, miss-typed or skipping one of the token you can run reconfig:
```bash
kowalski reconfig
```

# Features
## Timeline
Now, kowalski ready to start! (＠＾◡＾). Give a try:
```bash
kowalski timeline
```
command above will show the most talked topic on you timeline.

## Username
If you want to summarize user, try this command: 
```bash
kowalski --username <username>
```
*username is written without '@'*

## Search
You can search most paired topic with a query. Example, you search "trump", then kowalski will analyze the most used words with trump.

```bash
kowalski --search <keywords>
```
*username is written without '@'*

# Helps
```bash
kowalski [command] <options>
-----
[command]:
--search, -s .............. show most talked word with search query
--timeline, -t ............ show most talked word on the timeline
--username, -u ............ show most talked word from a user
--version, -v ............. show package version
--help, -h ................ show help menu for a command

<options>:
--count, -c ............... set how much tweets to be fetched
```

# That's all! 
If you found some bug reach me on twitter [@paswotnya](https://twitter.com/paswotnya) <(￣︶￣)>	. Last, thanks to [@bitxt](https://twitter.com/bitxt) for the permission to port his kowalski-lite python project!

[check his repo here](https://https://github.com/gitfarhan/kowalski_lite).