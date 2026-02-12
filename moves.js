const moveGroups = [
    {
        name: "Beginners",
        categories: [
            {
                name: "Simple",
                moves: [
                    { name: "Angle Back", semi: false, date: "2025-11-08T12:00:00" },
                    { name: "Angle Suzy", semi: false, date: "2025-11-08T12:00:00" },
                    { name: "Basic", semi: false, date: "2025-10-01T12:00:00" },
                    { name: "Braid", semi: false, date: "2025-11-08T12:00:00" },
                    { name: "Cha Cha Cha Basic", semi: false, date: "2025-12-17T12:00:00" },
                    { name: "Cha Cha Cha Front Double Basic", semi: false, date: "2025-12-17T12:00:00" },
                    { name: "Cord Beat Crossover", semi: false, date: "2025-10-29T12:00:00" },
                    { name: "Double Hunts Point", semi: false, date: "2025-11-25T12:00:00" },
                    { name: "Forward Crossover", semi: false, date: "2025-11-15T12:00:00" },
                    { name: "Four Corners", semi: false, date: "2025-10-22T12:00:00" },
                    { name: "Front Double Basic", semi: false, date: "2025-10-01T12:00:00" },
                    { name: "Hunts Point", semi: false, date: "2025-11-25T12:00:00" },
                    { name: "Hook Step", semi: true, date: "2025-10-04T12:00:00" },
                    { name: "Hot Toe", semi: true, date: "2025-10-04T12:00:00" },
                    { name: "Lateral Cutaway", semi: false, date: "2025-12-20T12:00:00" },
                    { name: "Left Flare", semi: false, date: "2025-11-29T12:00:00" },
                    { name: "Outside Cutaway", semi: false, date: "2025-12-20T12:00:00" },
                    { name: "Reverse Crossover", semi: false, date: "2025-11-18T12:00:00" },
                    { name: "Semi Circle", semi: false, date: "2025-10-15T12:00:00" },
                    { name: "Side Basic", semi: true, date: "2025-10-01T12:00:00" },
                    { name: "Side Basic Plus", semi: false, date: "2025-10-22T12:00:00" },
                    { name: "Side Slide", semi: true, date: "2025-11-19T12:00:00" },
                    { name: "Side Slide Plus", semi: true, date: "2025-11-22T12:00:00" },
                    { name: "Side Triplet", semi: true, date: "2025-11-05T12:00:00" },
                    { name: "Suzy Q", semi: true, date: "2025-10-04T12:00:00" },
                    { name: "Switch Timing", semi: false, date: "2025-10-18T12:00:00" },
                    { name: "Syncopated Front Double Cross", semi: true, date: "2025-12-03T12:00:00" }
                ]
            },

            {
                name: "Simple Combos",
                moves: [
                    { name: "Angle Braid", semi: true, date: "2025-11-08T12:00:00" },
                    { name: "Cha Cha Cha Suzzy Q", semi: false, date: "2025-12-17T12:00:00" },
                    { name: "Double Left Flare", semi: true, date: "2025-11-29T12:00:00" },
                    { name: "Double Tap Crossover Slide", semi: true, date: "2025-11-19T12:00:00" },
                    { name: "Double Tap Crossover Slide Plus", semi: true, date: "2025-11-22T12:00:00" },
                    { name: "Forward Crossover Suzy Q", semi: false, date: "2025-11-15T12:00:00" },
                    { name: "Hot Toe Suzy", semi: true, date: "2025-10-08T12:00:00" },
                    { name: "Hot Toe Combo", semi: false, date: "2025-11-29T12:00:00" },
                    { name: "Reverse Crossover Suzy Q", semi: false, date: "2025-11-18T12:00:00" },
                    { name: "Single Tap Crossover Slide", semi: true, date: "2025-11-19T12:00:00" },
                    { name: "Single Tap Crossover Slide Plus", semi: true, date: "2025-11-22T12:00:00" },
                    { name: "Suzy Cross Suzy", semi: true, date: "2025-10-11T12:00:00" },
                    { name: "Suzy Cross Suzy With A Turn", semi: true, date: "2025-10-25T12:00:00" },
                    { name: "Suzy Q Hook Combo", semi: true, date: "2025-10-08T12:00:00" }
                ]
            },

            {
                name: "Advanced",
                moves: [
                    { name: "Angle Slave", semi: true, date: '2025-11-15T12:00:00' },
                    { name: "Downtown", semi: true, date: '2025-10-11T12:00:00' },
                    { name: "Downtown with a Turn", semi: true, date: '2025-10-25T12:00:00' },
                    { name: "Four Tap V", semi: true, date: '2025-10-29T12:00:00' },
                    { name: "Hook Flick", semi: true, date: '2025-11-04T12:00:00' },
                    { name: "Inverted Suzy Plus", semi: true, date: '2025-10-25T12:00:00' },
                    { name: "Left Front Double Cross", semi: false, date: '2025-11-01T12:00:00' },
                    { name: "Right Front Double Cross", semi: false, date: '2025-11-01T12:00:00' },
                    { name: "Suzy Q Plus", semi: true, date: '2025-10-11T12:00:00' },
                    { name: "Symmetrical Angle Suzy", semi: true, date: '2025-11-15T12:00:00' },
                    { name: "Symmetrical Angle Back", semi: true, date: '2025-11-15T12:00:00' },
                    { name: "Syncopated Angle Back", semi: false, date: '2025-12-06T12:00:00' },
                    { name: "Traveling Side Triplet", semi: false, date: '2025-12-10T12:00:00' },
                    { name: "Traveling Side Triplet Plus", semi: false, date: '2025-12-16T12:00:00' },
                ]
            },

            {
                name: "Advanced Combos",
                moves: [
                    { name: "Cha Cha Cha Suzzy Q Crossover", semi: false, date: '2025-12-17T12:00:00' },
                    { name: "Cord Beat Suzy", semi: false, date: '2025-10-29T12:00:00' },
                    { name: "Double Four Tap V", semi: true, date: '2025-10-29T12:00:00' },
                    { name: "Double Hot Toe Combo", semi: false, date: '2025-12-02T12:00:00' },
                    { name: "Double Hot Toe Combo With Reverse", semi: false, date: '2025-12-02T12:00:00' },
                    { name: "Double Suzy Plus", semi: true, date: '2025-10-22T12:00:00' },
                    { name: "Forward Crossover Left Front Double Cross Suzy Q", semi: false, date: '2025-11-15T12:00:00' },
                    { name: "Left into Right Front Double Cross", semi: true, date: '2025-11-01T12:00:00' },
                    { name: "Quadruple Suzy Plus", semi: false, date: '2025-10-25T12:00:00' },
                    { name: "Reverse Crossover Left Front Double Cross Suzy Q", semi: false, date: '2025-11-18T12:00:00' },
                    { name: "Suzy Q Hook Combo Plus", semi: true, date: '2025-10-22T12:00:00' },
                    { name: "Syncopated Front Double Cross Turn Combo", semi: false, date: '2025-12-03T12:00:00' },
                    { name: "Triple Four Tap V", semi: false, date: '2025-11-01T12:00:00' },
                    { name: "Triple Suzy Plus", semi: false, date: '2025-10-22T12:00:00' },
                    { name: "Turn Combo", semi: true, date: '2025-10-15T12:00:00' },
                    { name: "Ultra Combo", semi: false, date: '2025-10-29T12:00:00' },
                ]
            },

            {
                name: "Women's",
                moves: [
                    { name: "Broken Left Turn", semi: false, date: '2025-11-11T12:00:00' },
                    { name: "Copa", semi: false, date: '2025-12-09T12:00:00' },
                    { name: "Cross Body Lead (F)", semi: false, date: '2025-10-18T12:00:00' },
                    { name: "Inside Left", semi: false, date: '2025-10-25T12:00:00' },
                    { name: "Right Turn", semi: false, date: '2025-10-14T12:00:00' }
                ]
            },

            {
                name: "Men's",
                moves: [
                    { name: "About Face Right Turn", semi: false, date: '2025-11-05T12:00:00' },
                    { name: "Axle Right,Axle Left", semi: false, date: '2025-10-22T12:00:00' },
                    { name: "Back Charge", semi: false, date: '2025-11-11T12:00:00' },
                    { name: "Cross Body Lead (M)", semi: false, date: '2025-10-18T12:00:00' },
                    { name: "Full Axle Right Turn", semi: false, date: '2025-10-22T12:00:00' },
                    { name: "Half Right Half Left", semi: false, date: '2025-10-15T12:00:00' },
                    { name: "Half Left Back Charge", semi: false, date: '2025-11-18T12:00:00' },
                    { name: "Half Right Back Charge", semi: false, date: '2025-11-18T12:00:00' },
                    { name: "Side Charge", semi: false, date: '2025-11-12T12:00:00' },
                    { name: "Walk Around Left Turn", semi: false, date: '2025-10-29T12:00:00' },
                    { name: "3 O'Clock Right Turn", semi: false, date: '2025-10-29T12:00:00' }
                ]
            },

            {
                name: "Partnerwork",
                moves: [
                    { name: "Broken Left (1 detach)", semi: false, date: '2025-11-25T12:00:00' },
                    { name: "Broken Left (1A detatch WAL)", semi: false, date: '2025-11-25T12:00:00' },
                    { name: "Broken Left (2 attached)", semi: false, date: '2025-11-29T12:00:00' },
                    { name: "Broken Left (3 lunge)", semi: false, date: '2025-11-29T12:00:00' },
                    { name: "Broken Left (4 hamerlock)", semi: false, date: '2025-12-06T12:00:00' },
                    { name: "Broken Left (5 hamerlock WAL)", semi: false, date: '2025-12-10T12:00:00' },
                    { name: "CBL (back charge)", semi: false, date: '2025-11-19T12:00:00' },
                    { name: "CBL (double pump)", semi: false, date: '2025-11-08T12:00:00' },
                    { name: "CBL (figure 8)", semi: false, date: '2025-11-05T12:00:00' },
                    { name: "CBL (half right back charge)", semi: false, date: '2025-11-22T12:00:00' },
                    { name: "CBL (inside left)", semi: false, date: '2025-10-25T12:00:00' },
                    { name: "CBL (two hands)", semi: false, date: '2025-11-15T12:00:00' },
                    { name: "Curfew (1 detach)", semi: false, date: '2025-12-17T12:00:00' },
                    { name: "Curfew (1A detatch WAL)", semi: false, date: '2025-12-17T12:00:00' },
                    { name: "Curfew (2 attached)", semi: false, date: '2025-12-17T12:00:00' },
                    { name: "Curfew (3 lunge)", semi: false, date: '2025-12-17T12:00:00' },
                    { name: "Curfew (4 hamerlock)", semi: false, date: '2025-12-17T12:00:00' },
                    { name: "Curfew (5 hamerlock WAL)", semi: false, date: '2025-12-17T12:00:00' },
                ]
            }
        ]
    },

    {
        name: "AB1",
        categories: [
            {
                name: "Shines",
                moves: [
                    { name: "Agua", semi: false, date: '2026-01-03T12:00:00' },
                    { name: "Broken Left (Pencil)", semi: false, date: '2026-01-03T12:00:00' },
                    { name: "Front Double Double", semi: false, date: '2026-01-03T12:00:00' },
                    { name: "Double Left Flare", semi: false, date: '2026-01-06T12:00:00' },
                    { name: "585 Spiral", semi: false, date: '2026-01-06T12:00:00' },
                    { name: "Cross Tap Lunge", semi: false, date: '2026-01-06T12:00:00' },
                    { name: "Syncopated Four Corners", semi: false, date: '2026-01-06T12:00:00' },
                    { name: "Syncopated Hot Toe", semi: false, date: '2026-01-08T12:00:00' },
                    { name: "Descending Trap Turn", semi: false, date: '2026-01-10T12:00:00' },
                    { name: "Angle Slave Freeze", semi: true, date: '2026-01-13T12:00:00' },
                    { name: "Agua,Double Left Flare,585 Spiral,Cross Tap Lunge,Front Double Double,Descending Trap Turn,Broken Left Turn (Pencil),Angle Slave Freeze", semi: false, date: '2026-01-15T12:00:00' },
                    { name: "Reverse Crossover Slide", semi: false, date: '2026-01-15T12:00:00' },
                    { name: "Turn Combo Left", semi: false, date: '2026-01-15T12:00:00' },
                    { name: "Reverse Crossover Slide,Turn Combo Left", semi: false, date: '2026-01-15T12:00:00' },
                    { name: "Reverse Crossover Tap Suzzy,(aka Look Back At It)", semi: false, date: '2026-01-20T12:00:00' },
                    { name: "Mayday", semi: false, date: '2026-01-20T12:00:00' },
                    { name: "Reverse Crossover Tap Suzzy,Mayday", semi: false, date: '2026-01-20T12:00:00' },
                    { name: "Braid Suzy Grape Vine", semi: false, date: '2026-01-22T12:00:00' },
                    { name: "Who's On First", semi: false, date: '2026-01-27T12:00:00' },
                    { name: "Forward Swing (Angry Bird)", semi: false, date: '2026-02-03T12:00:00' },
                    { name: "Two Corner Swing", semi: false, date: '2026-02-03T12:00:00' },
                    { name: "Double Heel Toe", semi: false, date: '2026-02-03T12:00:00' },
                    { name: "Swing Step Right, Left", semi: false, date: '2026-02-05T12:00:00' },
                    { name: "Side Basic Combo (Basic,Plus,Tap)", semi: false, date: '2026-02-05T12:00:00' },
                    { name: "Triple Heel Toe Braid", semi: false, date: '2026-02-07T12:00:00' },
                    { name: "Trap Tap Full Axel Right", semi: false, date: '2026-02-07T12:00:00' },
                    { name: "Four Corner Swing", semi: false, date: '2026-02-10T12:00:00' },
                    { name: "Boggler", semi: false, date: '2026-02-10T12:00:00' },
                    { name: "Short Sailor", semi: false, date: '2026-02-10T12:00:00' },
                ]
            },

            {
                name: "Partnerwork",
                moves: [
                    { name: "Figure-8,Right,(WAL Back Slide),Curfews,Broken Left", semi: false, date: '2026-01-03T12:00:00' },
                    { name: "Figure-8,Catwalk,HL,HL+CBL,CBL,Curfews,Broken Left", semi: false, date: '2026-01-08T12:00:00' },
                    { name: "CBL (Shoulder),Lunge (Shoulder Switch),Broken Left (Shoulder),WAL Check,Curfew,Waist CBL", semi: false, date: '2026-01-13T12:00:00' },
                    { name: "CBL (Shoulder),Lunge (Shoulder Same),Broken Left (Shoulder),WAL Check,Curfew,R Waist CBL", semi: false, date: '2026-01-15T12:00:00' },
                    { name: "CBL (Arm Slide),Foosball,Side Charge,Catwalk HL,Booty-Roll,HL", semi: false, date: '2026-01-20T12:00:00' },
                    { name: "Strong 7", semi: false, date: '2026-01-27T12:00:00' },
                    { name: "CBL (IL),3OR (grab other hand),single heli,CLB (IL) double heli", semi: false, date: '2026-02-03T12:00:00' },
                    { name: "CBL (Shoulder),Lunge,1.5 Right", semi: false, date: '2026-02-10T12:00:00' },
                ]
            }
        ]
    }
];
