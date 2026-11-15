# Story Hunt workflow

Every senior holds one piece of a story, and the story only ends when four of them meet.

The thread that ties it together is **skill → circle → deed**: the skill a senior picks at sign-up decides who they are matched with, the circle solves a story together at a café, and the story ends by passing that shared skill on to the community.

## Full flowchart

```mermaid
flowchart TD
    subgraph A["1. JOIN (app)"]
        A1["Senior installs the app"] --> A2["Chooses language<br/>English, 中文, Melayu, தமிழ், हिन्दी"]
        A2 --> A3["Enters first name"]
        A3 --> A4["Picks skills and interests<br/>cooking, gardening, sewing, teaching a language"]
        A4 --> A5["Links a Story card<br/>by tapping it on a device"]
        A5 --> A6["Is given one of four characters<br/>in The Lion of Singapura"]
    end

    subgraph B["2. READ (app, 1 to 2 days, alone)"]
        B1["Chapter 1: the storm"] --> B2["Chapter 2: the beast on the shore"]
        B2 --> B3["Chapter 3: a new name"]
        B3 --> B4["Each chapter: a page of comic panels, read or listened to,<br/>a choice to make, one memory kept,<br/>one question about the reader's own life"]
        B4 --> B5["Cliffhanger: you are one of four witnesses<br/>and your memory is only one side"]
    end

    subgraph C["3. MATCH (automatic)"]
        C1["System groups four seniors who share a skill<br/>each plays a different character"]
        C1 --> C2{"Circle has four members?"}
        C2 -- "No" --> C3["App shows: finding your three neighbours"]
        C3 --> C2
        C2 -- "Yes" --> C4["App shows: time to meet your circle"]
    end

    subgraph D["4. MEET (partner cafe, 2 to 5 pm)"]
        D1["Senior picks a time slot in the app"] --> D2["Goes to the cafe with their card"]
        D2 --> D3["Taps card on the device"]
        D3 --> D4["Device greets by name and shows 1 of 4, 2 of 4, 3 of 4<br/>Each tap = one verified cafe visit"]
        D4 --> D5{"All four tapped?"}
        D5 -- "No" --> D6["Device waits and lists who is still to come"]
        D6 --> D3
        D5 -- "Yes" --> D7["Device asks the first of three questions"]
    end

    subgraph E["5. BOND (at the cafe)"]
        E1["Four seniors compare what each remembers<br/>Phones show conversation cards about each other"] --> E2["Answer together on the red, yellow, green buttons"]
        E2 --> E3{"Correct?"}
        E3 -- "No" --> E4["Not quite: a hint says whose memory to ask about"]
        E4 --> E1
        E3 -- "Yes, three times" --> E5["Ending letter revealed on the device and in the app"]
        E5 --> E6["Each senior taps again and gives feedback<br/>good, okay, not good"]
        E6 --> E7["+100 points each<br/>Circle becomes friends in the app, with a group chat"]
    end

    subgraph F["6. GIVE BACK (NGO or school)"]
        F1["The ending opens the final chapter<br/>a community event using the shared skill"]
        F1 --> F2["Example: teach a cooking class for children,<br/>teach Chinese, teach stitching"]
        F2 --> F3["Members reply in the app, then attend together for about one hour"]
        F3 --> F4["NGO confirms the visit on the dashboard"]
        F4 --> F5["+200 points each<br/>Story marked complete"]
    end

    subgraph G["7. REWARD AND REPEAT"]
        G1["Points redeemed only on fitness and wellness<br/>tai chi pass, health screening, swimming"]
        G1 --> G2["New story starts with the same circle"]
    end

    A6 --> B1
    B5 --> C1
    C4 --> D1
    D7 --> E1
    E7 --> F1
    F5 --> G1
    G2 -.-> B1
```

## Who is involved at each stage

```mermaid
flowchart LR
    S["Senior"] -- "plays the story" --> APP["Story Hunt app"]
    APP -- "matches four seniors" --> CIRCLE["Circle of four"]
    CIRCLE -- "tap cards, answer three questions" --> CAFE["Partner cafe + device"]
    CAFE -- "ending unlocks final chapter" --> NGO["NGO or school"]
    NGO -- "confirms event, points awarded" --> WELL["Wellness partner rewards"]
    WELL -- "healthier, returns for next story" --> S

    CAFE -. "pays per verified off-peak visit" .-> SH["Story Hunt"]
    WELL -. "funds rewards catalogue" .-> SH
    SH -. "supplies skilled volunteer groups" .-> NGO
```

## Stage by stage

| Stage | What happens | Where | Outcome for the senior | Outcome for partners |
|---|---|---|---|---|
| 1. Join | Account, skills, interests, card linked | App | A character in the story and a card for the café | Skill data for matching and events |
| 2. Read | Three chapters as one of four characters, with a choice and a personal question in each | App, alone | A daily habit and three memories only they hold | None yet |
| 3. Match | Four seniors who share a skill are grouped, one character each | Automatic | Three neighbours to meet | Coordinator sees why they were matched |
| 4. Meet | Pick a slot, go to the café, tap the card | Café device | A low-pressure reason to go out | Café gets a verified off-peak visit |
| 5. Bond | Compare memories, answer three questions, give feedback | Café device | A ready-made conversation, three friends, 100 points | Feedback data per meet-up |
| 6. Give back | Community event using the shared skill | NGO or school | Purpose and recognition, 200 points | NGO gets a skilled volunteer group |
| 7. Reward and repeat | Redeem points, start the next story | App | Fitness and wellness rewards | Wellness partner reaches active seniors |

## How it supports holistic ageing

| Dimension | How Story Hunt addresses it |
|---|---|
| Social | A circle of four who meet in person and stay connected as friends |
| Mental | A daily chapter to read, remember and reason about |
| Purpose | Sharing a lifelong skill with children and the community |
| Physical | Points that can only be spent on fitness and wellness |

## Points

| Action | Points |
|---|---|
| Solving the story together at the café | 100 each |
| Completing the community event | 200 each |

## Status

- **Built and working:** every step above in the app, the browser version of the café device, and the dashboard.
- **Written but untested:** the firmware for the physical ESP32 device.
- **Demo placeholders:** the café, the NGO partners and the rewards are fictional, and the three story days can be played back to back.
- **Not built yet:** unlocking with three when one member does not show up, and a second story.
