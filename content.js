// content.js
// Instructions: Edit the values inside the quotes (" ") to update the website. All images is in the 'images' folder

const siteContent = {
    // 0. Navigation bar 
    navStructure: [
        {
            name: "Home",
            link: "/",
            sections: [
                { name: "Affiliates", id: "affiliates-grid" },
                { name: "Events", id: "event-title" },
                { name: "Newsletter", id: "news-title" },
                { name: "FAQ", id: "faq-q1" }
            ]
        },
        {
            name: "About",
            link: "/about.html",
            sections: [
                { name: "Mission", id: "about-mission-p1" },
                { name: "Representation", id: "about-representation" },
                { name: "Development", id: "about-development" },
            ]
        },
        {
            name: "Committee",
            link: "/committee.html",
            sections: [
                { name: "High Council", id: "high-council-tree" },
                { name: "Departments", id: "dept-roster" }
            ]
        },
        {
            name: "Events",
            link: "/events.html",
            sections: [
                { name: "Upcoming", id: "events-upcoming-container" },
                { name: "Past", id: "events-past-container" }
            ]
        },
        {
            name: "Newsletters",
            link: "/newsletters.html",
            sections: [
                { name: "All Issues", id: "newsletter-list-container" }
            ]
        },
        {
            name: "ALSTAR",
            link: "/alstar.html",
            sections: [
                { name: "About ALSTAR", id: "alstar-logo" },
                { name: "Points Tracker", id: "tracker" },
                { name: "Calender", id: "alstar-calendar-section" }
            ]
        },
        {
            name: "Contact",
            link: "/contact.html",
            sections: []
        }
    ],

    // 1. INDEX PAGE
    index: {
        // --- HERO SECTION ---
        hero: {
            image: "images/index/alsco_group.avif",
            description: "We are the official student committee representing all A-Level students at Sunway College. We bridge the gap between students and administration while organizing events that make your college life memorable.",
            handbook_pdf: "https://1f728d2d-1495-4449-b1c1-3c3cb399d337.filesusr.com/ugd/df559c_8cf96a8d79ea4d09aaacbff7e0d199c5.pdf"
        },

        affiliates: [
            { name: "Malaysian Bioscience Scholars", image: "images/index/mbios.avif" }, // Replace with real logo path
            // To add more, just copy the line above:
            // { name: "New Partner", image: "images/partner_logo.avif" }, 
        ],

        // --- FEATURED EVENT ---
        featuredEvent: {
            //Similar to Events content below, put just 1 event. If no event, don't put anything. Will default to upcoming image and description
            //image: "images/events/upcoming/ALC-AE.avif",
            //title: "A-Level Leadership Camp 2026",
            //description: "A Leadership Camp organised by Leadership Development department that aims to providing A-Level Students an opportunity to explore leadership not as a title, but as a lived experience shaped by communication, empathy and courage.",
            //registration_link: "https://forms.google.com/your-event-form",
            //button_text: "Registration Closed" // Change to "Registration Upcoming" or "Registration Opened" when needed
        },

        // --- LATEST NEWSLETTER ---
        newsletter: {
            image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80",
            title: "January Recap: Fresh Beginnings",
            date: "January 2026", // Displayed implicitly or added to description
            description: "Read about our recent events, student achievements, and important upcoming dates for the semester.",
            pdf_link: "https://drive.google.com/your-newsletter-link"
        },

        // --- FAQ SECTION ---
        faq: [
            {
                question: "How do I join the ALSCO committee?",
                answer: "Nope, no interviews needed! Becoming an ALSTAR is super straightforward—just fill in the registration form on the ALSTAR page. Once you're in, you’ll receive a confirmation email with everything you need, including the link to join the MS Teams group"
            },
            {
                question: "What exactly is the ALSTAR journey like?",
                answer: "Your ALSTAR experience kicks off with your ALSTAR 1st Event. You’ll be grouped with other ALSTARs to plan and execute an event based on a theme—it could be anything from a bake sale to a campaign or even a themed party. Think of it as a hands-on preview of what it’s like to be part of ALSCO. You’ll learn by doing, collaborate with others, and bring ideas to life."
            },
            {
                question: "How do I join ALSCO after being an ALSTAR ?",
                answer: "After completing your ALSTAR 1st Event, you can decide if ALSCO is for you.If you’re interested, you’ll fill in an application form and go through an interview process.From there, selected candidates will be invited to join the next ALSCO committee."
            },
            {
                question: "Is being an ALSTAR worth it ? How much time does it take ?",
                answer: "Definitely worth it.You’ll build real skills—communication, teamwork, leadership, and time management—while meeting new people and gaining meaningful experiences. As for time commitment, it’s flexible.You choose which events to join, so how involved you get is entirely up to you."
            },
            {
                question: "Where can I find the ALSTAR points tracker?",
                answer: "You can check your points on the ALSTAR page of this website. Just enter your Student ID to see your current participation status."
            },
            {
                question: "Can I join other clubs while being an ALSTAR or ALSCO ?",
                answer: "Yes! Being an ALSTAR(or even an ALSCO) doesn’t stop you from joining other clubs.The only restriction is that ALSCO members can’t join other college councils like SCC, and vice versa.Just make sure you manage your time well—your studies should always come first."
            },
            {
                question: "How do I balance A - Levels with ALSCO commitments ?",
                answer: "It’s definitely a challenge—but a manageable one.Staying organised, prioritising tasks, and asking for help when needed can go a long way.Balancing both isn’t just doable—it’s a valuable experience that builds resilience and prepares you for future challenges."
            },
            {
                question: "What happens during ALSTAR General Meetings ?",
                answer: "There are three main meetings: 1st GM(Physical): Introduction to ALSTAR, how everything works, and getting started with your event planning. 2nd GM(Online): You’ll pitch your event ideas and plans. 3rd GM(Online): A post - mortem session where you reflect on your event—what worked, what didn’t, and what you learned."
            },
            {
                question: "What’s the difference between ALSCO and COMSERVE ?",
                answer: "COMSERVE is a branch of ALSCO that focuses specifically on community service.It operates with some independence(like its own projects and platforms), but it’s still part of the larger ALSCO structure."
            },
            {
                question: "Will I receive certificates for participating ?",
                answer: "For ALSTAR, certificates aren’t given per event.Instead, you’ll need to collect points: 5 Participation Points 6 Volunteer Points 5 Talk / Workshop Points.Once you meet these, you’ll earn your ALSTAR certificate.For COMSERVE, certificates depend on the event or follow their Credit Hour System."
            },
            {
                question: "Are there any fees for COMSERVE activities ?",
                answer: "It depends on the event.Some are free, while others—especially those held outside of Sunway—may require a registration fee."
            },
            {
                question: "How can I join the ALSCO committee ?",
                answer: "ALSCO recruitment happens at the start of each semester.Keep an eye on the official Instagram page for updates on applications and interview dates."
            },
            {
                question: "How do I give feedback or raise a concern ?",
                answer: "You can submit feedback through the “Get In Touch” form on the Contact page or drop a DM on Instagram.All feedback is reviewed regularly."
            },
            {
                question: "Where can I check my ALSTAR points ?",
                answer: "You can track your points directly on the ALSTAR page—just enter your Student ID to see your current progress."
            },
            // If want to include more FAQ, just copy and paste and change the text inside ""
        ],
    },

    // 2. ABOUT PAGE
    // Change the text if required
    about: {
        missionp1: "To enhance the student experience by providing essential services, fostering engagement, and ensuring a supportive environment. We serve as an active bridge between students and the college administration. ",
        missionp2: " Through strategic collaboration with various councils and societies, we create inclusive experiences that foster a strong sense of belonging and meaningful community engagement throughout the academic year.",
        representation: "Organizing intake orientations and activities to help students transition smoothly into college life and feel at home within the campus.",
        development: "Guiding students to meet eligibility criteria for the ALSTAR Certificate through active participation and holistic development opportunities.",
        welfare: "Serving as a vital link between the student body and college administration for all concerns, ensuring your voice is always heard clearly."
    },

    // 3. COMMITTEE PAGE
    // Just change the NAME, IMAGE AND QUOTE, NOT the role
    committee: {
        // LEVEL 1: EXECUTIVE (Order matters for the layout!)
        highCouncil: [
            // Row 1: President
            { role: "President", name: "TAY HUI ER", image: "images/committee/high_council/president.avif", quote: "Be the best version of yourself. :)" },

            // Row 2: VPs
            { role: "Vice President of External Affairs", name: "NICHOLAS WONG JUN YEW", image: "images/committee/high_council/vpe.avif", quote: "The only person you need to beat is the person you were yesterday. " },
            { role: "Vice President of Internal Affairs", name: "DANIEL @ HTOO HTET ZAW", image: "images/committee/high_council/vpi.avif", quote: "" },

            // Row 3: Secs & Treasurer
            { role: "Secretary", name: "CHUE RYEE EN", image: "images/committee/high_council/sec1.avif", quote: "If today isn't the due date, tomorrow isn't the- wait..." },
            { role: "Secretary", name: "AUSTIN LAU HONG SHEN", image: "images/committee/high_council/sec2.avif", quote: "" },
            { role: "Treasurer", name: "EVAN YEOH JIN QUAN", image: "images/committee/high_council/treasurer.avif", quote: "Don't settle with a boring college life, be a part of something!" },
        ],

        // LEVEL 2: DEPARTMENTS
        // Copy & paste / delete acocrding to number of members
        departments: [
            {
                name: "Leadership Development",
                leaders: [
                    { role: "Director", name: "LAI ZHENG YI", image: "images/committee/leadership_dev/LDdirector.avif", quote: "Believe in Yourself, but when in doubt, Freestyle" },
                    { role: "Deputy Director", name: "CHLOE LIM JING YAN", image: "images/committee/leadership_dev/LDduputyDirector.avif", quote: "Strategically overthinking so you don’t have to :)" }
                ],
                members: [
                    { role: "General Member", name: "ONG XI WEN", image: "images/committee/leadership_dev/ldmember1.avif", quote: "" },
                    { role: "General Member", name: "EVAN YEOH JIN QUAN", image: "images/committee/leadership_dev/ldmember2.avif", quote: "Don't settle with a boring college life, be a part of something!" },
                    { role: "General Member", name: "TAY HUI ER", image: "images/committee/leadership_dev/ldmember3.avif", quote: "Be the best version of yourself. :)" },
                    { role: "General Member", name: "VINCENT KHOO WEI WEN", image: "images/committee/leadership_dev/ldmember4.avif", quote: "Failure is merely the ink of a life that dared to write" },
                ],
            },
            {
                name: "Community Service",
                leaders: [
                    { role: "Director", name: "EE JING XUAN", image: "images/committee/comserve/CSdirector.avif", quote: "" },
                    { role: "Deputy Director", name: "NYEIN YU SAN", image: "images/committee/comserve/CSdeputyDirector.avif", quote: "Growing while giving back through service" }
                ],
                members: [
                    { role: "General Member", name: "DAKSSHI NATH PILLAY", image: "images/committee/comserve/csmember1.avif", quote: "Why are we here, just to suffer?" },
                    { role: "General Member", name: "NICHOLAS WONG JUN YEW", image: "images/committee/comserve/csmember2.avif", quote: "The only person you need to beat is the person you were yesterday. " },
                    { role: "General Member", name: "TEH SIN HUI", image: "images/committee/comserve/csmember3.avif", quote: "" },
                    { role: "General Member", name: "YAP QIN HUEY", image: "images/committee/comserve/csmember4.avif", quote: "2% battery, 100% commitment" },
                ],
            },
            {
                name: "Public Relations",
                leaders: [
                    { role: "Director", name: "AYSHALYNN SALAHUDDIN", image: "images/committee/public_rel/PRdirector.avif", quote: "The silent lamb but innocent tamed and humble soul." },
                    { role: "Deputy Director", name: "CHONG HUI XIN", image: "images/committee/public_rel/PRdeputyDirector.avif", quote: "Balancing everything almost took me out, but hey…I survived." }
                ],
                members: [
                    { role: "General Member", name: "AUSTIN LAU HONG SHEN", image: "images/committee/public_rel/prmember1.avif", quote: "" },

                ],
            },
            {
                name: "Student Welfare",
                leaders: [
                    { role: "Director", name: "YAP CHERN XI", image: "images/committee/student_wel/SWdirector.avif", quote: "I love eating" },
                    { role: "Deputy Director", name: "SEW SUN LOONG", image: "images/committee/student_wel/SWdeputyDirector.avif", quote: "Tacos" }
                ],
                members: [
                    { role: "General Member", name: "LAW JIA HERNG", image: "images/committee/student_wel/swmember1.avif", quote: "" },
                    { role: "General Member", name: "JOSHUA LEE CHENG AN", image: "images/committee/student_wel/swmember2.avif", quote: "" },
                    { role: "General Member", name: "GOH JAY NING", image: "images/committee/student_wel/swmember3.avif", quote: "Eat well, sleep well, study well. - Mr D. " },
                    { role: "General Member", name: "DANIEL WONG WENG SENG", image: "images/committee/student_wel/swmember4.avif", quote: "" },
                    { role: "General Member", name: "DANIEL @ HTOO HTET ZAW", image: "images/committee/student_wel/swmember5.avif", quote: "" },
                    { role: "General Member", name: "CHUE RYEE EN", image: "images/committee/student_wel/swmember6.avif", quote: "If today isn't the due date, tomorrow isn't the- wait..." },
                ],
            },
            {
                name: "General Member",
                members: [
                    { role: "General Member", name: "EE CHAO JIAN", image: "images/committee/public_rel/prmember2.avif", quote: "" },
                    { role: "General Member", name: "KAY THARI MON ", image: "images/committee/public_rel/prmember3.avif", quote: "" },
                    { role: "General Member", name: "SAN DAR WIN", image: "images/committee/public_rel/prmember4.avif", quote: "" }
                ]
            }
        ],

        //Images for departments. Just change the IMAGE or DESCRIPTION. NOT the ID
        coreStructure: [
            {
                id: "dept-ld",
                title: "Leadership Development",
                image: "images/committee/departmental/LD - FORMAL.avif",
                description: "Leadership Development promotes soft skills and sports to foster interpersonal growth and ensure all A-Level students develop personally and professionally."
            },
            {
                id: "dept-cs",
                title: "Community Service",
                image: "images/committee/departmental/CS - FORMAL.avif",
                description: "Community Service, or COMSERVE for short, organises events for our members that focus on charitable, environmental, or community-orientated work."
            },
            {
                id: "dept-sw",
                title: "Student Welfare",
                image: "images/committee/departmental/SW - FORMAL.avif",
                description: "Student Welfare strives to foster a supportive and holistic environment within the community by curating initiatives that enhance students’ mental, social, and academic well-being."
            },
            {
                id: "dept-pr",
                title: "Public Relations",
                image: "images/committee/departmental/PR - FORMAL.avif",
                description: "Public Relations focuses on creating creative and engaging content to communicate effectively and build a strong, connected A-Level community."
            }
        ]
    },

    // 4. EVENTS PAGE
    eventsPage: {
        default: {
            default_image: "images/events/stay-tuned.avif",
            default_title: "Stay tuned for more from ALSCO!",
            default_description: "",
            default_button: "",
        },
        // SECTION 1: UPCOMING EVENTS
        upcoming: [
            {   // Change the title, date, image, description
                //EXAMPLE
                //  title: "A-Level Leadership Camp",
                //  department: "Leadership Department"
                //  date: "Saturday, 7th February 2026 to Sunday, 8th February 2026",
                //  image: "images/events/upcoming/ALC-AE.avif",
                //  instagram_link:"https://www.instagram.com/p/DWBK7lfEUfH/?img_index=1"
                //  description: "A Leadership Camp organised by Leadership Development department that aims to providing A-Level Students an opportunity to explore leadership not as a title, but as a lived experience shaped by communication, empathy and courage.",
                //  registration_link: "https://forms.google.com/orientation",
                //  button_text: "Closed"
                // For button, include 'open' if registration is open, or else use other text. 
                // Eg. 'Registration Upcoming!!' = Clicking button does nothing
                // Eg. 'Registration Opened!!' = Clicking button opens the registration form (paste the registration link inside the "")
                title: "A-Level Leadership Camp",
                department: "Leadership Department",
                date: "Saturday, 7th February 2026 to Sunday, 8th February 2026",
                image: "images/events/upcoming/ALC-AE.avif",
                instagram_link: "https://www.instagram.com/p/DWBK7lfEUfH/?img_index=1",
                description: "A Leadership Camp organised by Leadership Development department that aims to providing A-Level Students an opportunity to explore leadership not as a title, but as a lived experience shaped by communication, empathy and courage.",
                registration_link: "https://forms.google.com/orientation",
                button_text: "Closed"
            },

            // To add more events, just copy the format above and paste and change the details accordingly.
        ],

        // SECTION 2: PAST EVENTS
        past: [
            {
                title: "A Charity Extravaganze 2026",
                date: "Saturday, 17th January 2026",
                department: "ALSCO",
                instagram_link: "https://www.instagram.com/p/DTpftXIkQLi/?img_index=1",
                description: "Raised RM1000+ through ALSTAR First Event for an Old Folks Home",
                image_folder: "",
                video_path: ""
            },
            {
                title: "July 2025 Installation Night",
                date: "Thrusday, 8th Janaury 2026",
                department: "SST (2 Secretaries & Treasurer)",
                instagram_link: "https://www.instagram.com/p/DTXjonXEc8U/?img_index=1",
                description: "A Formal Night of Installation of the new July 2025 A-Level Student Committee members",
                image_folder: "images/events/past/installation_night/pictures",
                video_path: "images/events/past/installation_night/install_night_vid.mp4"
            }
        ]
    },

    // 5. NEWSLETTERS PAGE 
    newsletterPage: {
        // 1. HERO SECTION BACKGROUND
        heroImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop", // Replace with your image

        // 2. NEWSLETTER CARDS (Top one is "Latest", others are grid)
        newsletters: [
            {
                title: "December Recap: Year End",
                date: "Dec 2025",
                description: "A look back at all our achievements this year, including the charity run results and ALSTAR point summaries.",
                image: "images/newsletters/dec2025_cover.jpg", // Preview image
                pdf_link: "https://drive.google.com/file/d/...", // PDF download link
                button_text: "Read Now"
            },
            {
                title: "November Highlights",
                date: "Nov 2025",
                description: "Deep dive into the Study Skills Workshop and interview with the new Student Council president.",
                image: "images/newsletters/nov2025_cover.jpg",
                pdf_link: "https://drive.google.com/file/d/...",
                button_text: "Read Now"
            },
            {
                title: "October Spooktacular",
                date: "Oct 2025",
                description: "Photos from the Halloween event and upcoming exam schedules.",
                image: "images/newsletters/oct2025_cover.jpg",
                pdf_link: "#",
                button_text: "Coming Soon" // This triggers the disabled state
            }
        ]
    },

    // 6. ALSTAR PAGE
    alstarPage: {
        alstar_logo: "images/alstar/alstar_logo.svg",

        description: "The ALSTAR (A-Level Student Ambassador) program is a prestigious initiative designed to empower students to represent Sunway College. It bridges the gap between the student body and the administration while fostering leadership and soft skills.",

        difference: "While ALSCO is the elected student committee responsible for governance and major events, ALSTARs are selected ambassadors who focus on volunteering, peer support, and representing the college at official functions. ALSCO members are automatically part of the ALSTAR community.",

        // This array generates the 3 pillars automatically
        certificate: [
            { count: 5, label: "Participation Points", desc: "Attend events" },
            { count: 6, label: "Volunteer Points", desc: "Contribute time" },
            { count: 5, label: "Talk / Workshop Points", desc: "Join sessions" }
        ],

        // Need to upate the forms
        forms: {
            participation: "https://forms.google.com/participation-link",
            volunteer: "https://forms.google.com/volunteer-link",
            talk: "https://forms.google.com/talk-link"
        },

        // Links to ALSCO's Alstar calender and Malaysia's Holiday
        calendar: "https://calendar.google.com/calendar/embed?src=e3412a49be9e0175532071aac5b55a0c9e75c009c156104af759df5e184a3b40%40group.calendar.google.com&src=en.malaysia%23holiday%40group.v.calendar.google.com&ctz=Asia%2FKuala_Lumpur"
    },
};