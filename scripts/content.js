// content.js
// This is considered the data bank of the whole website, it controls what is shown on the website, the people, images, text, etc.
// Instructions: Edit the values inside the quotes (" ") to update the website. All images is in the 'images' folder. 

const siteContent = {
    //===========================
    // 0. NAVIGATION MENU
    //===========================
    navStructure: [
        {
            name: "Home",
            link: "/",
            sections: [
                { name: "Affiliates", id: "affiliates" },
                { name: "Events", id: "event" },
                { name: "Publications", id: "publications" },
                { name: "FAQ", id: "faq" }
            ]
        },
        {
            name: "About",
            link: "/html_pages/about.html",
            sections: [
                { name: "Mission", id: "about-mission-p1" },
                { name: "Representation", id: "about-representation" },
                { name: "Development", id: "about-development" },
            ]
        },
        {
            name: "Committee",
            link: "/html_pages/committee.html",
            sections: [
                { name: "High Council", id: "high-council-tree" },
                { name: "Members", id: "dept-roster" },
                { name: "Departments", id: "departments-container" }
            ]
        },
        {
            name: "Events",
            link: "/html_pages/events.html",
            sections: [
                { name: "Upcoming", id: "events-upcoming-container" },
                { name: "Past", id: "events-past-container" }
            ]
        },
        {
            name: "Publications",
            link: "/html_pages/publication.html",
            sections: [
                { name: "Monthly Post", id: "publication-list-container" },
                { name: "Newsletter", id: "publication-list-container" },
                { name: "Handbook", id: "handbook" },
            ]
        },
        {
            name: "ALSTAR",
            link: "/html_pages/alstar.html",
            sections: [
                { name: "About ALSTAR", id: "alstar-logo" },
                { name: "Points Tracker", id: "tracker" },
                { name: "Calender", id: "alstar-calendar-section" }
            ]
        },
        {
            name: "Contact",
            link: "/html_pages/contact.html",
            sections: [
                { name: "Instagram", id: "contact_instagram" },
                { name: "Email", id: "contact_instagram" },
                { name: "Tiktok", id: "contact_tiktok" }
            ]
        }
    ],

    //===========================
    // 1. INDEX PAGE
    //===========================
    index: {
        // A. --- HERO SECTION ---
        hero: {
            image: "/images/index/alsco_group.avif",
            description: "We are the official student committee representing all A-Level students at Sunway College. We bridge the gap between students and administration while organising events that make your college life memorable.",
            handbook_pdf: "https://drive.google.com/file/d/1cGKNRWNi1seFKY3j8foU6nxRZ_lQBkga/view?usp=sharing",
            trailer_link: "https://www.instagram.com/p/DTST7w6kYDd/",
        },

        affiliates: [
            { name: "Malaysian Bioscience Scholars", image: "/images/index/mbios.avif" },
            // To add more, just copy the line above:
            // { name: "New Partner", image: "images/partner_logo.avif" }, 
        ],

        // B. --- FAQ SECTION ---
        faq: [
            {
                question: "How do I join the ALSTAR programme?",
                answer: "Nope, no interviews needed! Becoming an ALSTAR is straightforward—just fill in the registration form on the ALSTAR page. Once you're in, you’ll receive a confirmation email with everything you need, including the link to join the MS Teams group."
            },
            {
                question: "What exactly is the ALSTAR journey like?",
                answer: "Your ALSTAR experience kicks off with your ALSTAR First Event. You’ll be grouped with other ALSTARs to plan and execute an event based on a theme. It could be anything; from a sports festival, to a workshop, or even a game show. Think of it as a hands-on preview of what it’s like to be a part of ALSCO. You’ll learn by doing, collaborate with others, and bring ideas to life."
            },
            {
                question: "How do I join ALSCO after being an ALSTAR?",
                answer: "After completing your ALSTAR First Event, you can decide if ALSCO is for you. If you’re interested, you’ll fill in an application form and go through an interview process. From there, selected candidates will be invited to join the next ALSCO committee."
            },
            {
                question: "Is being an ALSTAR worth it? How much time does it take?",
                answer: "Definitely worth it. You’ll build real skills—communication, teamwork, leadership, and time management—while meeting new people and gaining meaningful experiences. As for time commitment, it’s flexible. You choose which events to join, so how involved you get is entirely up to you."
            },
            {
                question: "Where can I find the ALSTAR points tracker?",
                answer: "You can check your points on the ALSTAR page of this website. Just enter your Student ID to see your current participation status."
            },
            {
                question: "Can I join other clubs while being an ALSTAR or ALSCO?",
                answer: "Yes! Being an ALSTAR (or even an ALSCO) doesn’t stop you from joining other clubs. The only restriction is that ALSCO members can’t join other college councils like SCC, and vice versa. Just make sure you manage your time well and always prioritise your studies."
            },
            {
                question: "How do I balance A-Levels with ALSCO commitments?",
                answer: "It’s definitely a challenge, but a manageable one. Staying organised, prioritising tasks, and asking for help when needed can go a long way. Balancing both ALSCO and academics is a valuable experience that builds resilience and prepares you for future challenges."
            },
            {
                question: "What happens during ALSTAR General Meetings?",
                answer: "There are three main meetings. The First General Meeting (Physical): Introduction to ALSTAR, how everything works, and getting started with your event planning. The Second General Meeting (Online): You’ll pitch your event ideas and plans. The Third General Meeting (Online): A post-mortem session where you reflect on your event—what worked, what didn’t, and what you learned."
            },
            {
                question: "What’s the difference between ALSCO and COMSERVE?",
                answer: "COMSERVE is a branch of ALSCO that focuses specifically on community service. It operates with some independence (like its own projects and platforms), but it’s still part of the larger ALSCO structure."
            },
            {
                question: "Will I receive certificates for participating?",
                answer: "For ALSTAR, certificates aren’t given per event. Instead, you’ll need to collect points: 5 Participation Points, 6 Volunteer Points, and 5 Talk/Workshop Points. Once you meet these requirements, you’ll earn your ALSTAR certificate. For COMSERVE, certificates depend on the event or follow their Credit Hour System."
            },
            {
                question: "Are there any fees for COMSERVE activities?",
                answer: "It depends on the event. Some are free, while some events like those held outside of Sunway may require a registration fee."
            },
            {
                question: "How can I join the ALSCO committee?",
                answer: "ALSCO recruitment happens at the start of each semester. Keep an eye on the ALSTAR communication channels for updates on applications and interview dates."
            },
            {
                question: "How do I give feedback or raise a concern?",
                answer: "You can submit feedback through the “Get In Touch” form on the Contact page or drop a DM on Instagram. All feedback is reviewed regularly."
            },
            {
                question: "Where can I check my ALSTAR points?",
                answer: "You can track your points directly on the ALSTAR page by entering your Student ID to see your current progress."
            },
            // If want to include more FAQ, just copy and paste and change the text inside ""
        ],
    },

    //===========================
    // 2. ABOUT PAGE
    //===========================
    // Change the text if required
    about: {
        missionp1: "To enhance the student experience by providing essential services, fostering engagement, and ensuring a supportive environment. We serve as an active bridge between students and the college administration. ",
        missionp2: "Through strategic collaboration with various councils and societies, we create inclusive experiences that foster a strong sense of belonging and meaningful community engagement throughout the academic year.",
        representation: "Organising intake orientations and activities to help students transition smoothly into college life and feel at home within the campus.",
        development: "Guiding students to meet eligibility criteria for the ALSTAR Certificate through active participation and holistic development opportunities.",
        welfare: "Serving as a vital link between the student body and college administration for all concerns, ensuring your voice is always heard clearly."
    },

    //===========================
    // 3. COMMITTEE PAGE
    //===========================
    // Just change the NAME, IMAGE AND QUOTE, don't change the format
    committee: {
        // LEVEL 1: EXECUTIVE (Order matters for the layout!)
        highCouncil: [
            // Row 1: President
            { role: "President", name: "TAY HUI ER", image: "/images/committee/high_council/president.avif", quote: "Be the best version of yourself. :)" },

            // Row 2: VPs
            { role: "Vice President of External Affairs", name: "NICHOLAS WONG JUN YEW", image: "/images/committee/high_council/vpe.avif", quote: "The only person you need to beat is the person you were yesterday. " },
            { role: "Vice President of Internal Affairs", name: "DANIEL @ HTOO HTET ZAW", image: "/images/committee/high_council/vpi.avif", quote: "Believe you can, and you're halfway there!" },

            // Row 3: Secs & Treasurer
            { role: "Secretary", name: "CHUE RYEE EN", image: "/images/committee/high_council/sec1.avif", quote: "If today isn't the due date, tomorrow isn't the- wait..." },
            { role: "Secretary", name: "AUSTIN LAU HONG SHEN", image: "/images/committee/high_council/sec2.avif", quote: "" },
            { role: "Treasurer", name: "EVAN YEOH JIN QUAN", image: "/images/committee/high_council/treasurer.avif", quote: "'Come, let me prove you wrong' - Ms.Careen" },
        ],

        // LEVEL 2: DEPARTMENTS
        // Copy & paste / delete acocrding to number of members
        departments: [
            {
                name: "Leadership Development",
                leaders: [
                    { role: "Director", name: "LAI ZHENG YI", image: "/images/committee/leadership_dev/LDdirector.avif", quote: "Believe in Yourself, but when in doubt, Freestyle" },
                    { role: "Deputy Director", name: "CHLOE LIM JING YAN", image: "/images/committee/leadership_dev/LDduputyDirector.avif", quote: "Strategically overthinking so you don’t have to :)" }
                ],
                members: [
                    { role: "General Member", name: "ONG XI WEN", image: "/images/committee/leadership_dev/ldmember1.avif", quote: "Yep still surviving :))" },
                    { role: "General Member", name: "EVAN YEOH JIN QUAN", image: "/images/committee/leadership_dev/ldmember2.avif", quote: "'Come, let me prove you wrong' - Ms.Careen" },
                    { role: "General Member", name: "TAY HUI ER", image: "/images/committee/leadership_dev/ldmember3.avif", quote: "Be the best version of yourself. :)" },
                    { role: "General Member", name: "VINCENT KHOO WEI WEN", image: "/images/committee/leadership_dev/ldmember4.avif", quote: "Failure is merely the ink of a life that dared to write" },
                ],
            },
            {
                name: "Student Welfare",
                leaders: [
                    { role: "Director", name: "YAP CHERN XI", image: "/images/committee/student_wel/SWdirector.avif", quote: "I love eating" },
                    { role: "Deputy Director", name: "SEW SUN LOONG", image: "/images/committee/student_wel/SWdeputyDirector.avif", quote: "Tacos" }
                ],
                members: [
                    { role: "General Member", name: "LAW JIA HERNG", image: "/images/committee/student_wel/swmember1.avif", quote: "'Your GENIUS Friends ah, 2 plud -6 also don't know' - Dr.Poh" },
                    { role: "General Member", name: "JOSHUA LEE CHENG AN", image: "/images/committee/student_wel/swmember2.avif", quote: "You can't rush greatness" },
                    { role: "General Member", name: "GOH JAY NING", image: "/images/committee/student_wel/swmember3.avif", quote: "Eat well, sleep well, study well. - Mr D. " },
                    { role: "General Member", name: "DANIEL WONG WENG SENG", image: "/images/committee/student_wel/swmember4.avif", quote: "" },
                    { role: "General Member", name: "DANIEL @ HTOO HTET ZAW", image: "/images/committee/student_wel/swmember5.avif", quote: "Believe you can, and you're halfway there!" },
                    { role: "General Member", name: "CHUE RYEE EN", image: "/images/committee/student_wel/swmember6.avif", quote: "If today isn't the due date, tomorrow isn't the- wait..." },
                ],
            },
            {
                name: "Public Relations",
                leaders: [
                    { role: "Director", name: "AYSHALYNN SALAHUDDIN", image: "/images/committee/public_rel/PRdirector.avif", quote: "The silent lamb but innocent tamed and humble soul." },
                    { role: "Deputy Director", name: "CHONG HUI XIN", image: "/images/committee/public_rel/PRdeputyDirector.avif", quote: "Balancing everything almost took me out, but hey…I survived." }
                ],
                members: [
                    { role: "General Member", name: "AUSTIN LAU HONG SHEN", image: "/images/committee/public_rel/prmember1.avif", quote: "The meeting minutes are not done yet." },
                    { role: "General Member", name: "EE CHAO JIAN", image: "/images/committee/public_rel/prmember2.avif", quote: "Have fun!" },

                ],
            },
            {
                name: "Community Service",
                leaders: [
                    { role: "Director", name: "EE JING XUAN", image: "/images/committee/comserve/CSdirector.avif", quote: "But it’s hard to stay mad when there’s so much beauty in the world." },
                    { role: "Deputy Director", name: "NYEIN YU SAN", image: "/images/committee/comserve/CSdeputyDirector.avif", quote: "Growing while giving back through service" }
                ],
                members: [
                    { role: "General Member", name: "DAKSSHI NATH PILLAY", image: "/images/committee/comserve/csmember1.avif", quote: "Why are we here, just to suffer?" },
                    { role: "General Member", name: "NICHOLAS WONG JUN YEW", image: "/images/committee/comserve/csmember2.avif", quote: "The only person you need to beat is the person you were yesterday. " },
                    { role: "General Member", name: "TEH SIN HUI", image: "/images/committee/comserve/csmember3.avif", quote: "" },
                    { role: "General Member", name: "YAP QIN HUEY", image: "/images/committee/comserve/csmember4.avif", quote: "2% battery, 100% commitment" },
                ],
            },


        ],

        // LEVEL 3: DEPARTMENT PHOTOS. Just change the IMAGE or DESCRIPTION. NOT the ID
        coreStructure: [
            {
                id: "dept-ld",
                title: "Leadership Development",
                image: "/images/committee/departmental/LD - FORMAL.avif",
                image_playful: "/images/committee/departmental/LD - INFORMAL.avif",
                ig_link: "https://www.instagram.com/p/DTaF8g5EcvH/?img_index=4",
                description: "Leadership Development promotes soft skills and sports to foster interpersonal growth and ensure all A-Level students develop personally and professionally."
            },
            {
                id: "dept-sw",
                title: "Student Welfare",
                image: "/images/committee/departmental/SW - FORMAL.avif",
                image_playful: "/images/committee/departmental/SW - INFORMAL.avif",
                ig_link: "https://www.instagram.com/p/DTaF8g5EcvH/?img_index=4",
                description: "Student Welfare strives to foster a supportive and holistic environment within the community by curating initiatives that enhance the mental, social, and academic well-being of all A-Level students."
            },
            {
                id: "dept-pr",
                title: "Public Relations",
                image: "/images/committee/departmental/PR - FORMAL.avif",
                image_playful: "/images/committee/departmental/PR - INFORMAL.avif",
                ig_link: "https://www.instagram.com/p/DTaF8g5EcvH/?img_index=4",
                description: "Public Relations focuses on creating creative and engaging content to communicate effectively and build a strong, connected A-Level community."
            },
            {
                id: "dept-cs",
                title: "Community Service",
                image: "/images/committee/departmental/CS - FORMAL.avif",
                image_playful: "/images/committee/departmental/CS - INFORMAL.avif",
                ig_link: "https://www.instagram.com/alevel.comserve/",
                description: "Community Service, or COMSERVE for short, organises events for our members that focuses on charitable, environmental, or community-orientated work."
            },

        ]
    },

    //===========================
    // 4. EVENTS PAGE
    //===========================
    eventsPage: {
        default: {
            default_image: "/images/events/stay-tuned.avif",
            default_title: "Stay tuned for more from ALSCO!",
        },
        // SECTION 1: UPCOMING EVENTS
        upcoming: [
            // To add more events, just copy the format above and paste and change the details accordingly.
            //{
            // title: "A Gift of Learning",
            // department: "ALSTAR G12",
            // event_type: "Actual Event",
            // date: "Friday, 17th April 2026",
            // image: "/images/events/upcoming/g12ae1.avif",
            // details_image: "/images/events/upcoming/g12ae2.avif",
            // ig_link: "https://www.instagram.com/p/DWnXYTrEY8o/?igsh=aTlqcmh3MDl6bWZt",
            // registration_link: "https://docs.google.com/forms/d/e/1FAIpQLSe1BkLQDBg-6j2B0gzViv6qwNiV3XXjT9Gs5IHLyOFN3nJffA/viewform",
            // trailer_link: "https://www.instagram.com/reel/DWp8LpvTaKQ/?igsh=MWRpanpmbXBncmRyZQ==",
            // button_text: "Closed",
            //},
        ],

        // SECTION 2: PAST EVENTS
        past: [
            {
                title: "Lecturer Appreciation Week 2026",
                date: "Thursday, 26th February 2026",
                department: "Student Welfare Department",
                image: "/images/events/past/lxs.avif",
                ig_link: "https://www.instagram.com/p/DWL2I-GEQAE/?img_index=1",
            },
            {
                title: "A-Level Leadership Camp 2026",
                date: "Saturday, 7th February 2026 to Sunday, 8th February 2026",
                department: "Leadership Development Department",
                image: "/images/events/past/alc.avif",
                ig_link: "https://www.instagram.com/p/DWBK7lfEUfH/?img_index=1",
            },
            {
                title: "ALSTAR First General Meeting",
                date: "Tuesday, 27th January 2026",
                department: "ALSCO",
                image: "/images/events/past/jagm.avif",
                ig_link: "https://www.instagram.com/p/DV563smkfkd/?img_index=1",
            },
            {
                title: "January '26 A-Level Orientation",
                date: "Monday, 19th January 2026",
                department: "ALSCO",
                image: "/images/events/past/jot.avif",
                ig_link: "https://www.instagram.com/p/DTure53EcOg/?img_index=1",
            },
            {
                title: " July '25 'A Charity Extravaganza'",
                date: "Saturday, 17th January 2026",
                department: "ALSCO",
                image: "/images/events/past/ace.avif",
                ig_link: "https://www.instagram.com/p/DTpftXIkQLi/?img_index=1",
            },
            {
                title: "July '25 Installation Night",
                date: "Thursday, 8th Janaury 2026",
                department: "SST (2 Secretaries & Treasurer)",
                image: "/images/events/past/jin.avif",
                ig_link: "https://www.instagram.com/p/DTXjonXEc8U/?img_index=1",
            }
        ]
    },

    //===========================
    // 5. PUBLICATION PAGE
    //===========================
    publicationPage: {
        // 1. HERO SECTION BACKGROUND
        heroImage: "/images/publications/publication-bg.avif",

        // 2. PUBLICATION CARDS
        publications: [
            {
                title: "March Monthly Post",
                image: "/images/publications/post3.avif",
                category: "post",
                department: "Student Welfare",
                pdf_link: "https://drive.google.com/file/d/1PbBJVyJJ6wd7IIcJHpzVOTRgmlE23bwq/view?usp=sharing", // PDF download link
                ig_link: "https://www.instagram.com/p/DWS17hTEd64/?img_index=1",
                button_text: "Read Now"
            },
            {
                title: "February Monthly Post",
                image: "/images/publications/post2.avif",
                category: "post",
                department: "Student Welfare",
                pdf_link: "https://drive.google.com/file/d/19uqO8ACZn4Nu4ejvNohxLSyQr35QW0VY/view?usp=sharing", // PDF download link
                ig_link: "https://www.instagram.com/p/DUxxv54EVGe/?img_index=1",
                button_text: "Read Now"
            },
            {
                title: "November Monthly Post",
                image: "/images/publications/post11.avif",
                category: "post",
                department: "Student Welfare",
                pdf_link: "https://drive.google.com/file/d/11ebHERFPt17D0kmnuv0yaoN6s7JsEHcr/view?usp=sharing", // PDF download link
                ig_link: "https://www.instagram.com/p/DTc234xEWFO/?img_index=1",
                button_text: "Read Now"
            },
            {
                title: "October Monthly Post",
                image: "/images/publications/post10.avif",
                category: "post",
                department: "Student Welfare",
                pdf_link: "https://drive.google.com/file/d/1N8ZgCI1DBE07AKba1CZOU5p_GQTKMKpu/view?usp=sharing", // PDF download link
                ig_link: "https://www.instagram.com/p/DQjYDcakYz-/?img_index=1",
                button_text: "Read Now"
            },
            {
                title: "Newsletter Issue 9",
                image: "/images/publications/issue9.avif",
                category: "newsletter",
                department: "Public Relations",
                pdf_link: "https://drive.google.com/file/d/11jMQJpoTxtz_Pj5NLlsBVdmF8M_SMqj6/view?usp=sharing",
                button_text: "Read Now"
            },
            {
                title: "Newsletter Issue 8",
                image: "/images/publications/issue8.avif",
                category: "newsletter",
                department: "Public Relations",
                pdf_link: "https://drive.google.com/file/d/15CzlrJuMN0M_AkndeWXLdhZPzFi0C7-T/view?usp=sharing",
                button_text: "Read Now"
            },
            {
                title: "Newsletter Issue 7",
                image: "/images/publications/issue7.avif",
                category: "newsletter",
                department: "Public Relations",
                pdf_link: "https://drive.google.com/file/d/1wL_zAtEiykwhzWxTYdR08xn-KqPnhQgS/view?usp=sharing",
                button_text: "Read Now"
            }
        ],

        handbook: [
            {
                image: "/images/publications/july25Handbook.avif",
                department: "Student Welfare",
                intake: "July 2025",
                pdf_link: "https://drive.google.com/file/d/1cGKNRWNi1seFKY3j8foU6nxRZ_lQBkga/view?usp=sharing",
                button_text: "Read Now",
            },

        ]
    },

    //===========================
    // 6. ALSTAR PAGE
    //===========================
    alstarPage: {
        alstar_logo: "/images/alstar/alstar_logo.svg",

        description: "The ALSTAR (A-Level Student Ambassador) program is a prestigious initiative designed to empower students to represent Sunway College. It bridges the gap between the student body and the administration while fostering leadership and soft skills.",

        difference: "While ALSCO is the elected student committee responsible for governance and major events, ALSTARs are selected ambassadors who focus on volunteering, peer support, and representing the college at official functions. ALSCO members are automatically part of the ALSTAR community.",

        certificate: [
            { count: 5, label: "Participation Points", desc: "Attend events" },
            { count: 6, label: "Volunteer Points", desc: "Contribute time" },
            { count: 5, label: "Talk / Workshop Points", desc: "Join Talks" }
        ],

        // update forms if got change
        forms: {
            amendment: "https://docs.google.com/forms/d/e/1FAIpQLScyiFYlLV6sNb2XTmwI5h6GVEtDMprkCQjwePBqxFiZNB_z6w/viewform?usp=dialog",
            talk: "https://docs.google.com/forms/d/e/1FAIpQLSdWPzzalwelN3CFRzxZpIqF4StYiGKwacgpTiZzaihuqo9QyA/viewform?usp=dialog"
        },

        // Links to ALSCO's Alstar calender and Malaysia's Holiday
        calendar: "https://calendar.google.com/calendar/embed?src=e3412a49be9e0175532071aac5b55a0c9e75c009c156104af759df5e184a3b40%40group.calendar.google.com&src=en.malaysia%23holiday%40group.v.calendar.google.com&ctz=Asia%2FKuala_Lumpur"
    },

};