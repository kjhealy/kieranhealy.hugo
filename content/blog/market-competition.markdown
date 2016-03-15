---
title: "The Benefits of a Little Market Competition, ASA Calendar Edition"
date: "2014-07-28"
categories: [Sociology,Nerdery]
---

Last Saturday, while trying to plan my ASA schedule, I got a little irritated at the official [website and calendar](http://convention2.allacademic.com/one/asa/asa14/index.php), which I found quite clunky to navigate and lacking in some basic features. In particular the site wanted me to assemble a 'personal meeting schedule' by adding events to a list stored on the server and accessible only by logging in and clicking through several screens. Like most people attending ASA, (1) I do many other things at the conference besides attend sessions, like meeting people for coffee or dinner, and I want to schedule these as well; and (2) I have my own calendar, on my phone, where I keep those appointments. I don't want to run two calendars, and I don't want to have to retype or copy-and-paste events from one calendar to another. That shouldn't be necessary, because [they have the Internet on computers now](https://www.youtube.com/watch?v=YozC8yFrZKI).

So I scraped the event data from the ASA site, munged it around with Perl and R, and [made a page myself](http://kieranhealy.org/asa2014/) that did what I needed and, I think, presented the information in a quick and easy-to-scan fashion besides. I fixed some bugs yesterday and early this morning. People seemed to like it: it got tweeted and Facebooked around a bit and my server logs told me that several hundred people had already used it to download at least one event to their calendars.

I'll be honest, I did wonder how the ASA were going to feel about it. In the past they have not being fantastically responsive to requests from members for functionality of this sort, especially when it comes to web or other IT services that would make things easier for attendees. I think their instinct is to protect or wall-off the information people want (e.g., in the past they have in my view been needlessly protective of the room locations of sessions at the conference), rather than make it easily available to members. Moreover, I don't think the company that the ASA uses for its conference website, an outfit called [AllAcademic](http://www.allacademic.com), does an especially good job. These two tendencies result in web applications that are not just poorly laid out in aesthetic terms but actively user-hostile.

This morning, being Monday, the ASA was back to work. My calendar pages were tipping along nicely. And I got a pleasant surprise as the ASA twitter account publicized my efforts.

{{% figure src="https://kieranhealy.org/files/misc/asa-ics-tweet-1.png" alt="ASA tweet" caption="Quasi-official endorsement" %}}

Great! That's a lot better than a note saying I should delete my calendar or something. Very encouraging, and if I could favorite a retweet of one of my own tweets, I would. Meanwhile, I took a look in my server logs and found the following line:

{{% figure src="https://kieranhealy.org/files/misc/asa-ics-schedule-log3.png" alt="AllAcademic Ticket" caption="Someone has opened a ticket" %}}

Here we see an employee of AllAcademic, settling down to work just before seven a.m. and taking a look at a support ticket that includes a link to my calendar site. (I've obscured their IP address.) Interesting. A little later, this happens:

{{% figure src="https://kieranhealy.org/files/misc/asa-ics-schedule-log2.png" alt="AllAcademic Ticket" caption="Resolving the ticket" %}}

They go away and have a cup of coffee, returning at 7:25am. They take another look at my site. They download a calendar event file (`ASA-Sunday-1.ics`), then they idly look at this site's [front page](http://kieranhealy.org/) and my [publications page](http://kieranhealy.org/publications/) before clicking back to the calendar page just before 8:00 Pacific Time or 11:00 Eastern. (My host's server is on PST, and hence so are the log files.) Then, at 12:35pm Eastern, [ASANews tweets out the happy result](https://twitter.com/ASAnews/status/493796943987220480).


{{% figure src="https://kieranhealy.org/files/misc/asa-ics-schedule-tweet.png" alt="AllAcademic Ticket" caption=".ics Functionality added in less than three hours." %}}

Boom! Feature request added, ticket closed. And thus we see that having an alternative available can result in a quick move toward feature-parity. In this case, it took a PHP developer out in Oregon a cup of coffee and two hours work to push out the change. You are still welcome to use [my page](http://kieranhealy.org/asa2014/). I think it's simpler and looks nicer. On the other hand, because the ASA’s site is backed by a proper database that the webpage can query, it can easily do things that I cannot, like bundle all the events associated with or chosen by a particular user into a single `.ics` file. But now you have a choice, and members who log in to the official site can do the natural thing and add events to their own calendars if they want. Thanks to the ASA for resolving this particular issue so quickly. 


