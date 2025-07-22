---
title: "The Sound of Silence"
date: 2025-07-22T07:36:20-04:00
categories: [IT,Sociology]
footnotes: false
htmlwidgets: false
mathjax: false
---

A [GitHub Issue](https://github.com/openai/whisper/discussions/2608) on OpenAI's [Whisper](https://github.com/openai/whisper), which is a good speech-recognition and transcription model with support for a large number of languages. A lot of people use it. The issue: 

> Complete silence is always hallucinated as "ترجمة نانسي قنقر" in Arabic which translates as "Translation by Nancy Qunqar"

In the comments, people note that this class of error has been known for a while and there are equivalents or counterparts in other languages: 

> I found a similar thing happens in German where it says "Untertitelung des ZDF für funk, 2017." 

That would be "Subtitling by ZDF". Although another commenter notes "In german it's 'Vielen Dank' (Thank you very much)". In Romanian,

> i’ve noticed multiple instances where the transcripts ends with “nu uitati sa da-ti like si subscribe” which, as you might easily infer , translates to “don’t forget to like and subscribe”.

You can see what's happening. The model learns that silence is the end of the recording. As [KillerX says](https://github.com/openai/whisper/discussions/2608#discussioncomment-13842561), 

> this seems to be an artifact of the fact that Whisper was trained on (amongst other things) YouTube audio + available subtitles. Often subtitlers add their copyright notice onto the end of the subtitles, and the end of the videos are often credits with music, applause, or silence. Thus whisper learned that silence == 'copyright notice'."

Amusingly, 

> In English there is always applause


