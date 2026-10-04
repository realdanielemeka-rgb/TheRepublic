"""The services hub and the six service pages: copy, search metadata and the case work that proves each one.

Every claim here must be supported by a published case on the site (see CASEFILES in public/assets/app.js
and the five case pages). Keep titles to 60 characters and descriptions to 110-160.
"""

HUB = {
    'path': '/services',
    'title': 'Creative & Advertising Agency Services | The Republic',
    'description': 'Strategy, brand and creative, content and social, integrated campaigns, digital and experiences, from an independent advertising agency in Lagos, Nigeria.',
    'eyebrow': 'What we do · Services',
    'h1': 'A creative and advertising agency, end to end.',
    'lead': ('The Republic is an independent creative and advertising agency in Lagos, Nigeria, working with African and global brands '
             'including Promasidor, Zenith Bank, Prudential Zenith Life, Sanlam Allianz and Dulux. Six disciplines, one team, one standard: '
             'strategy first, and the work must prove it.'),
    'og': 'services',
}

# key, name, address, page title, description, h1, lead, three things it covers, the cases that prove it, share-card image
SERVICES = [
    dict(key='svc-strategy', name='Communication Strategy', path='/services/communication-strategy',
         title='Brand & Communication Strategy Agency, Lagos | The Republic',
         description='Brand and communication strategy from The Republic in Lagos: the human truth, the brand role and the plan behind campaigns for Promasidor and Zenith Bank.',
         h1='Communication strategy that starts with people.',
         lead=('Every campaign we make starts here. We find the one true thing about the people a brand needs to move, then build the plan '
               'around it: the role the brand plays, what it says and where it shows up. That is how our work for Promasidor, '
               'Prudential Zenith Life and Zenith Bank began.'),
         covers=[('Insight and human truth', 'Listening and research that surface the truth a brief depends on, before anyone talks about ideas.'),
                 ('Positioning and platforms', 'A clear role for the brand in people’s lives, and a platform line strong enough to carry it for years.'),
                 ('Communication planning', 'What to say, where, in what order, and how we will know it worked.')],
         cases=['onga', 'youmatter', 'pzl', 'sanlam', 'zenith', 'twisco'], img='onga238371.webp'),
    dict(key='svc-brand', name='Brand & Creative', path='/services/brand-and-creative',
         title='Brand & Creative Agency in Nigeria: Ads & Film | The Republic',
         description='Advertising ideas, TV commercials, launch films and brand identity from The Republic, a creative agency in Lagos for banks, insurers and consumer brands.',
         h1='Brand and creative work people remember.',
         lead=('Ideas, identity and advertising made to earn attention honestly: TV commercials, launch films, campaign visuals and brand '
               'development for banks, insurers and consumer brands in Nigeria.'),
         covers=[('Campaign ideas and advertising', 'One idea, expressed across film, outdoor, print and social so every piece sounds like the same brand.'),
                 ('TV commercials and films', 'Ideas and scripts for TV commercials, launch films and online video.'),
                 ('Visual and brand identity', 'Campaign design and brand development built to hold up across every channel.')],
         cases=['twisco', 'ramadan', 'youmatter', 'iinvest', 'sanlam', 'torrista', 'zenith35', 'heirs'], img='cs-sanlam-2.webp'),
    dict(key='svc-content', name='Content & Social', path='/services/content-and-social',
         title='Social Media & Content Agency in Nigeria | The Republic',
         description='Social media management, creator partnerships and content series from The Republic in Lagos, for brands that want conversation as well as reach.',
         h1='Content and social media that people answer.',
         lead=('Social media management, creator partnerships and always-on content for brands that want conversation, not just reach. '
               'We write for the reply, and build content systems that keep a brand talking week after week. Our Chivita 2.0 campaign won '
               'Best Use of Social Media at the Nigerian Marketing Awards 2024.'),
         covers=[('Social media management', 'Platform-specific content, community management and a steady publishing rhythm.'),
                 ('Creator and influencer partnerships', 'Creators chosen for fit and briefed to tell the story in their own voice.'),
                 ('Series and formats', 'Repeatable formats, from YouTube series to live sessions, that give people a reason to come back.')],
         cases=['chivita2', 'cowbell', 'onga', 'sips', 'chivita12', 'pzlsocial'], img='cs-sips-1.webp'),
    dict(key='svc-integrated', name='Integrated Marketing', path='/services/integrated-marketing',
         title='Integrated Marketing & Advertising Campaigns | The Republic',
         description='Integrated advertising campaigns from The Republic, Lagos: one idea carried through film, outdoor, radio, digital, social and experiences to one next step.',
         h1='Integrated campaigns: one idea, every channel.',
         lead=('When a brand needs to move people at scale, we plan and run the whole campaign: one idea carried through film, outdoor, '
               'radio, digital, social and experiences, with every piece pointing to the same next step. You Matter, our campaign for '
               'Prudential Zenith Life, took second place for Financial Institution of the Year at the Nigerian Marketing Awards 2025.'),
         covers=[('Through-the-line campaigns', 'Above-the-line, digital and on-the-ground activity planned as one system.'),
                 ('Campaign systems', 'Every touchpoint ending in the same action, so the campaign builds on itself.'),
                 ('Launches', 'New products and platforms taken to market with a clear plan, from first teaser to scale.')],
         cases=['pzl', 'youmatter', 'zenith'], img='pz-bakery.webp'),
    dict(key='svc-digital', name='Digital & Performance', path='/services/digital-and-performance',
         title='Digital Marketing Agency in Nigeria | The Republic',
         description='Digital strategy, amplification, paid media and lead capture from The Republic, a digital marketing agency in Lagos, for results brands can measure.',
         h1='Digital marketing built to perform.',
         lead=('Digital strategy, amplification, paid media and lead capture for brands that need results they can measure, '
               'from awareness through to sign-ups.'),
         covers=[('Digital strategy and amplification', 'Plans that decide where a campaign lives online and how it travels.'),
                 ('Paid social and search', 'Paid media, including Google Ads, aimed at the people most likely to act.'),
                 ('Landing pages and lead capture', 'Journeys that turn interest into sign-ups, planned around the campaign.')],
         cases=['onga', 'cowbell', 'spruce', 'youmatter', 'dreams'], img='sp-green.webp'),
    dict(key='svc-experiences', name='Experiences', path='/services/experiences',
         title='Experiential Marketing Agency in Lagos | The Republic',
         description='Brand experiences, installations and activations from The Republic in Lagos, such as the Zenith Bank 35th anniversary Tunnel of Time and the Twisco activation.',
         h1='Experiences people step into.',
         lead=('Brand experiences and activations in Lagos: installations, live moments and events that turn a message into something '
               'people can walk through, taste or take part in.'),
         covers=[('Installations and exhibitions', 'Spaces that tell a brand’s story, like the Tunnel of Time for Zenith Bank’s 35th anniversary.'),
                 ('Activations', 'On-the-ground moments that put the product in people’s hands.'),
                 ('Live and seasonal moments', 'Live shows, challenges and seasonal campaigns people join in with.')],
         cases=['zenith35', 'twisco', 'chivita12'], img='cs-zenith35-1.webp'),
]

# the five flagship cases live on their own pages (CASEFILES covers the other thirteen)
FLAGSHIP = {
    'onga': ('Onga · Promasidor Nigeria', 'Taste of Home', 'A digital platform built from people’s answers to one question: what does home mean to you?'),
    'cowbell': ('Cowbell · Promasidor Nigeria', 'Your First Taste', 'Nigerian digital and social execution of a Ramadan campaign about who cares before the first taste.'),
    'spruce': ('Spruce by Dulux · CAP Plc', 'Show Your True Colours', 'Creators, social distribution and digital visualisation for a paint launch.'),
    'pzl': ('Prudential Zenith Life', 'Empowering Tomorrow', 'An integrated campaign that made the next 40 years personal and planning practical.'),
    'zenith': ('Zenith Bank', 'See Homecoming Differently', 'A strategy and creative platform for Nigerians coming home every December.'),
}

FAQ = [
    ('What kind of agency is The Republic?',
     'An independent creative and advertising agency based in Lagos, Nigeria. We plan and make strategy-led campaigns, content, digital work and brand experiences.'),
    ('Where is The Republic based?', 'At 10 Onisiwo Road, Ikoyi, Lagos, Nigeria.'),
    ('Which brands has The Republic worked with?',
     'Clients include Promasidor (Onga and Cowbell), CHI (Chivita and Hollandia), Prudential Zenith Life Insurance, Zenith Bank, Sanlam Allianz, CAP Plc (Spruce by Dulux), Twisco, Heirs Insurance, i-invest and Sterling Bank.'),
    ('What services does The Republic offer?',
     'Communication strategy, brand and creative, content and social, integrated marketing, digital and performance, and experiences.'),
    ('How does The Republic work?',
     'Strategy first. Every brief starts with questions about people, then moves through five steps: the problem, the human truth, the idea, the system and the evidence.'),
    ('How do I start a project with The Republic?',
     'Write to office@therepublic.agency or use the contact form, and tell us what you are trying to change.'),
]
