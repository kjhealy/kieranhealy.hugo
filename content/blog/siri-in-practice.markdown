---
#layout: post
title: "Siri in Practice"
date: "2011-10-15"
comments: false
categories: [IT, Nerdery]
---

Some quick comments on using Siri in practice---for things other than
asking it to open the pod bay doors. Siri's voice recognition is very
impressive, and the scope of what it understands is very good given
the difficulty of what it's doing. But it has a lot of trouble with
certain sorts of proper names, and certain kinds of contexts. 

On the first issue, take Irish names, for example, which are
*completely intuitive* to someone with a bit of a
[blas](http://en.wiktionary.org/wiki/blas), but admittedly are often
not spelled in the way a naive English speaker would pronounce
them. For example there are a lot of people in Ireland named
"Aoife". It's a very popular girl's name, and it is of course
pronounced "Eee-fah". As you might expect, Siri can't handle it at
all. That's a difficult case, but there are a lot of other similarly
tricky names in the world, and not just Irish-origin ones. Failure to
recognize names really messes up the ability to ask certain questions
(e.g. about birthdays), tell Siri about network ties (e.g. who is my
daughter), or set appointments with specific people. I doubt users
will long tolerate being forced to systematically mispronounce their
own or their spouse's name in order to set up meetings, for
example.[1]

{{% img src="https://kieranhealy.org/files/misc/siriicon.png" %}}

On the second issue, Siri's handling of contextual meanings is very
strong in some ways, but not in others. Some real world examples, the
good and bad, based on a morning's worth of use:

- My calendar has an appointment named "Duke flu clinic, Student Union
  (walk-in)". I can ask Siri "When is my flu clinic appointment?" and
  it gives me the right answer. Pretty good! As has been documented in
  various reviews, you can also say things like "When is my next
  haircut?" or have Siri follow local temporal contexts like "Make an
  appointment with John for 4:30 next Wednesday", "Make that 5:30".
- But let's say I have a shared calendar with my wife, Laurie—a
  possibility Apple is aware of, given the emphasis on "Send a message
  to my wife" etc. She writes a calendar entry that reads "Kieran
  volunteers at school". If I ask Siri "When do I volunteer at
  school?" it fails, launching a Safari search for "When do I
  volunteer at school?". If I ask "When does Kieran volunteer at
  school?" it fails as well, saying "I found 11 schools nearby, 7 of
  them are fairly close to you". To get the right answer I must ask
  the unnaturally context-free question, "When is 'Kieran volunteers
  at school'?" because it can't deal with the tense changes or
  indexicals. In a similar way if you have an appointment reading
  "Dentist" you can't ask "When is my dental appointment?"
- Some more subtle but telling failures: For joint calendars, you can't
  ask questions like "When does Laurie travel to Boston?" even if
  Laurie has entered an event named "Travel to Boston" in her
  calendar. Worse, the simpler case fails too. If I have an event
  called "Travel to Boston" in my own calendar, asking "When do I
  travel to Boston?" causes Siri to interpret it as an advice-type
  question, and it searches Google for "When do I travel to Boston?".
  Asking "When do I go to Boston?" fails as well. (Result: a map and
  "Here's Boston".)  In this case even speaking the literal title of
  the event fails: "When is 'Travel to Boston'?" results in a Google
  search. "When is my trip to Boston?" will not work either. Only
  "When is my Travel to Boston?" works. If the event is called "Talk
  at Tufts", Siri will not understand "When do I talk at Tufts?", but will
  understand "When is my talk at Tufts?".
  
  
Again, it's basically very impressive. But I guess the question is how
fast Siri will improve at interpretation, and how willing users will
be to take the time to self-censor or carefully craft both event names
and questions about events that they know Siri will understand.

[1] *Update:* [Charles Starrett suggested](https://twitter.com/#!/starrett/status/125250245755011072) using the [phonetic first and last name fields](http://www.ilounge.com/index.php/tips/comments/helping-voice-control-along-with-phonetic-names/) in contacts, which Voice Control can apparently take advantage of. I tried this but it didn't seem to have any effect on Siri.
