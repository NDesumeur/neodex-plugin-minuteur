# Minuteur (Timer)

Several timers at once, each with its own name, an emptying ring and an alarm. They keep their end time: the countdown goes on even if you leave the tab or close NeoDex.

*Version française : [README.md](README.md)*

## Creating a timer

1. In **New timer**, enter hours, minutes and seconds (up to 99 hours), or click a ready-made duration: 1, 3, 5, 10, 15, 25 or 45 minutes, or 1 hour.
2. Give it a name if you like ("Pasta", "Break"…); without a name, it shows its duration.
3. Click **Add timer**: it starts right away.

## Using timers

Each timer has its own card under **My timers**:

- the **ring** empties as time passes, with the remaining time in the centre; the card gets a coloured outline while it runs;
- **Pause** stops it, **Resume** picks up where it left off;
- **↺** resets it, without starting it;
- **✕** deletes it.

## When time is up

When the time runs out, three beeps sound, a "*name*: done!" notification appears and the card blinks. **Restart** runs it again for the same duration.

If the Timer was not on screen at that moment, the card shows as finished when you come back to it.

## Data and sync

Your timers (name, duration, remaining time, end time) are stored by NeoDex, backed up and synced between your PCs when sync is on.

## Install

In NeoDex: **NeoStore → Discover → Minuteur → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
