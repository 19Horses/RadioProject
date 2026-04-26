// Run with: node migrate.mjs
// Requires a write token from sanity.io/manage → your project → API → Tokens

import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ASSETS = path.join(__dirname, 'src/assets')

const client = createClient({
  projectId: 'yc1lcir6',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN, // set via: SANITY_TOKEN=xxx node migrate.mjs
})

// Cache uploaded images to avoid re-uploading the same file
const uploadCache = {}

async function uploadImage(relativePath) {
  if (!relativePath) return null
  if (uploadCache[relativePath]) return uploadCache[relativePath]

  const fullPath = path.join(ASSETS, relativePath)
  if (!fs.existsSync(fullPath)) {
    console.warn(`  ⚠ Skipping missing file: ${relativePath}`)
    return null
  }

  const buffer = fs.readFileSync(fullPath)
  const ext = path.extname(fullPath).slice(1).toLowerCase()
  const mimeType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png'

  console.log(`  ↑ Uploading ${relativePath}`)
  const asset = await client.assets.upload('image', buffer, {
    filename: path.basename(fullPath),
    contentType: mimeType,
  })

  const ref = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
  uploadCache[relativePath] = ref
  return ref
}

function key() {
  return Math.random().toString(36).slice(2, 9)
}

// Convert an array of HTML strings (with <b> tags) into Sanity portable text blocks
function htmlToPortableText(input) {
  const strings = Array.isArray(input) ? input : [input]
  return strings
    .filter(Boolean)
    .map((html) => {
      const parts = html.split(/(<b>|<\/b>)/g)
      const children = []
      let isBold = false

      for (const part of parts) {
        if (part === '<b>') { isBold = true; continue }
        if (part === '</b>') { isBold = false; continue }
        if (part) {
          children.push({
            _type: 'span',
            _key: key(),
            text: part,
            marks: isBold ? ['strong'] : [],
          })
        }
      }

      return {
        _type: 'block',
        _key: key(),
        style: 'normal',
        markDefs: [],
        children,
      }
    })
}

function tracklistWithKeys(tracklist) {
  return tracklist.map((item) => ({ ...item, _key: key(), _type: 'tracklistItem' }))
}

function chaptersWithKeys(chapters) {
  return chapters.map((item) => ({ ...item, _key: key(), _type: 'chapter' }))
}

// ─── MIXES ────────────────────────────────────────────────────────────────────

const mixes = [
  {
    _type: 'mix',
    _id: 'mix-edenplus',
    title: 'game arts',
    artistName: 'edenplus',
    artistRole: 'Musician',
    subtitle: 'Mix + Interview',
    slug: { _type: 'slug', current: 'edenplus' },
    genre: 'DIGITAL PUNK',
    coverImagePath: 'rp1/pb.png',
    audioUrl: 'https://d2rmb5ql8vpbx8.cloudfront.net/RP1-ubi.wav',
    tags: ['hyperpop', 'trap', 'electronic', 'idm'],
    hexCodes: ['#FF005A', '#FFFFFF'],
    broadcastDate: '2025-04-05T15:00:00Z',
    releaseDate: '2025-04-05',
    length: '01:26:06',
    description: [
      '<b>edenplus</b> is a <b>DJ, artist and the mind behind event organisation, EXXTRALIFE.</b>',
      'He sits talks with us about his inspirations, video game soundtracks and gives insight into his event organistion, <b>EXXTRALIFE.</b>',
    ],
    chapters: [
      { startTime: 0, title: 'RADIO (a)' },
      { startTime: 1954, title: 'PROJECT' },
      { startTime: 3276, title: 'RADIO (b)' },
    ],
    tracklist: [
      { startTime: '0', title: 'RADIO (a)' },
      { title: 'B Rocka Intro', artist: 'Brandy' },
      { title: 'capsule rmx →', artist: 'CAPSULE' },
      { title: 'What You Waiting For?', artist: 'Gwen Stefani' },
      { title: 'The Enigma', artist: 'Ingrate' },
      { title: '3.14159', artist: 'Lexie Liu' },
      { title: 'Body + Mind', artist: 'Anz' },
      { title: 'Rescue (tasfet_rmx)', artist: 'Tasfet' },
      { title: 'Television', artist: 'A.G. Cook' },
      { title: 'Slide In', artist: 'Goldfrapp' },
      { title: 'Boss', artist: 'Tomoya Ohtani' },
      { title: 'Androgynous Girls', artist: 'Girls Aloud' },
      { title: 'Took a Turn', artist: 'loukeman' },
      { title: "Steppin' Out", artist: 'kaskade' },
      { title: "Sofi Needs a Ladder", artist: 'deadmau5' },
      { title: 'UBER XL', artist: 'BABYXSOSA, POLO PERKS' },
      { title: 'UNRELEASED', artist: 'edenplus' },
      { title: 'Club Stranger (Nguzunguzu Remix)', artist: 'Nguzunguzu, Jhene Aiko' },
      { title: 'TF DUMMY NUMBER ZERO ZERO ZERO ZERO ZERO ZERO ZERO ZERO', artist: 'Elysia Crampton' },
      { title: 'Emiranda (break)', artist: 'Emiranda' },
      { startTime: '1954', title: 'PROJECT' },
      { title: 'CCTV!?' },
      { title: "Autechre's 8 Hour NTS Mix" },
      { title: "Ubi loves Olivia Rodrigo's 'Sour'" },
      { title: "Ecco2K's 'Black Boy' spurred change!?" },
      { title: "Goated Video Game Compilations and OST's" },
      { title: 'French TV has the best music' },
      { title: "Why is 'Mirror's Edge' so hard?" },
      { title: 'Electric + Acoustic = ...yeah?' },
      { title: "Exxtralife (Origins and resident DJ's)" },
      { title: "Ubi's Ideal Railway Redesign" },
      { title: 'Ranking Notorious Evil Organisations' },
      { title: 'Programmed Art' },
      { title: "Ubi's Next Release!" },
      { startTime: '3276', title: 'RADIO (b)' },
      { title: 'X My Heart', artist: 'Regret' },
      { title: 'Wunna', artist: 'Gunna' },
      { title: 'Alura', artist: 'Sweet Trip' },
      { title: 'Ready Set Go', artist: 'Cedric Madden' },
      { title: 'ginger candy', artist: 'NEW YORK' },
      { title: 'Dance Until We Die', artist: 'A.G. Cook' },
      { title: 'People Always Talk About The Weather (Junkie XL Main Mix)', artist: 'Yonderboi' },
      { title: "When It's You", artist: 'benoviolence' },
      { title: 'dead long time', artist: 'Nguzunguzu' },
      { title: 'Overly', artist: 'Playboi Carti' },
      { title: 'Mr. Me Too', artist: 'Clipse' },
      { title: 'The Last One To Remain', artist: 'Pandatone' },
      { title: 'Leonora', artist: 'Toxe' },
      { title: 'cream', artist: 'HIDE' },
      { title: 'edenrepeat [u u u]', artist: 'edenplus' },
    ],
    dontShow: false,
  },
  {
    _type: 'mix',
    _id: 'mix-dvd',
    title: 'BUILD!',
    artistName: 'DVD',
    artistRole: 'Technologist',
    subtitle: 'Mix + Interview',
    slug: { _type: 'slug', current: 'dvd' },
    genre: 'NEO JAZZ-FUNK REVIVAL',
    coverImagePath: 'rp2/pb.png',
    audioUrl: 'https://d2rmb5ql8vpbx8.cloudfront.net/rp2-dvd.wav',
    tags: ['deep house', 'jazz funk', 'disco', 'world'],
    hexCodes: ['#53FCB4', '#192C28'],
    broadcastDate: '2025-04-28T15:00:00Z',
    releaseDate: '2025-04-28',
    length: '01:26:06',
    description: [
      '<b>DVD</b> is a <b>DJ and creative technologist</b> behind notable products like <b>the Handle With Care Lollipop Headphone.</b>',
      'He touches on <b>listening experiences, his introductions into tech, music and DJing,</b> and his many <b>creative design projects.</b>',
    ],
    chapters: [
      { startTime: 0, title: 'RADIO (a)' },
      { startTime: 1837, title: 'PROJECT' },
      { startTime: 3334, title: 'RADIO (b)' },
    ],
    tracklist: [
      { startTime: '0', title: 'RADIO (a)' },
      { title: 'Just A Touch (Jazz Element Mix)', artist: 'Essence' },
      { title: 'Love Will Bring Us Back Together', artist: 'Roy Ayers' },
      { title: 'Babalonia', artist: 'Ricardo Marrero + The Group' },
      { title: 'Rhythm In Your Mind', artist: 'STR4TA, Steve Conry, Takashi Nakazato' },
      { title: 'Love Is Gonna Lift You Up', artist: 'Bobby Womack, Julio Bushmore' },
      { title: 'Tied Up', artist: 'Moon Boots, Steven Klavier, Kenny Dope' },
      { title: 'Standing Right Here', artist: 'Mannix, Dina Vass, John Morales' },
      { title: 'The Calling', artist: 'Ralf Gum, Joseph Junior' },
      { title: 'Truth Don Die', artist: 'Femi Kuti, Kerri Chandler' },
      { title: 'Let the Sun Shine In', artist: 'Sons and Daughters of Life' },
      { startTime: '1837', title: 'PROJECT' },
      { title: 'First Steps in Tech' },
      { title: "DVD's Design Philosophy" },
      { title: 'Handle With Care!' },
      { title: 'Sound-System-Stack-Assembly' },
      { title: 'Searching for Nuts and Bolts' },
      { title: "Don't Forget to Dance" },
      { title: 'KINDRED Listening Station' },
      { startTime: '3334', title: 'RADIO (b)' },
      { title: 'Rise & Shine', artist: 'Esteban Adame' },
      { title: 'Birds, Pt. I', artist: 'Chassol' },
      { title: 'IM SO STUPID IM CLEVER', artist: 'RAZA' },
      { title: 'Love Is Forever', artist: 'Blaze' },
      { title: 'Babalonia', artist: 'Ricardo Marrero + The Group' },
      { title: 'Get You', artist: 'James Curd, Osunlade, Alton Miller' },
      { title: 'Sunlight', artist: 'Infiniti' },
      { title: 'Emberfall', artist: 'Loxodrome' },
      { title: 'Souffles H', artist: 'Kyoto Jazz Massive' },
    ],
    dontShow: false,
  },
  {
    _type: 'mix',
    _id: 'mix-bebeluna',
    title: 'Ghost in the Shell',
    artistName: 'BEBELUNA',
    artistRole: 'Musician',
    subtitle: 'Mix + Interview',
    slug: { _type: 'slug', current: 'bebeluna' },
    genre: 'DIASPORIC BASS',
    coverImagePath: 'rp3/pb.png',
    audioUrl: 'https://d2rmb5ql8vpbx8.cloudfront.net/RP3-BEBE.wav',
    tags: ['experimental', 'jersey club', 'afro-percussion', 'grime'],
    hexCodes: ['#430A2C', '#C6FC50'],
    broadcastDate: '2025-07-25T15:00:00Z',
    releaseDate: '2025-07-25',
    length: '01:26:45',
    description: [
      '<b>BEBELUNA</b> is an <b>artist and DJ</b> that mixes under the psuedonym <b>XYRAK47.</b>',
      'She speaks about <b>her experience as a refugee in London and her love for composition in film and media.</b>',
    ],
    chapters: [
      { startTime: 0, title: 'RADIO (a)' },
      { startTime: 1871, title: 'PROJECT' },
      { startTime: 3306, title: 'RADIO (b)' },
    ],
    tracklist: [
      { startTime: '0', title: 'RADIO (a)' },
      { title: 'Hasta Santiago A Pie (Congas Orientales)', artist: 'Los Hermanos Bravo' },
      { title: 'Part Two (Release of the Moon)', artist: 'Kit Gordon, Isaac Robertson' },
      { title: 'Kulu', artist: "N'Gou Bagayoko" },
      { title: 'Sunset Key Melt', artist: 'Tim Hecker' },
      { title: 'Both Sides Now', artist: 'Joni Mitchell' },
      { title: 'Su Pelo', artist: 'Ray Heredia' },
      { title: 'TDAGB', artist: 'Duval Timothy' },
      { title: 'Esperança', artist: 'Munir Hossn, Ganavya' },
      { startTime: '1871', title: 'PROJECT' },
      { title: 'Life as a Refugee' },
      { title: 'Acoustic Tendencies' },
      { title: 'Vespa Life' },
      { title: "Bebe's Experience Producing for Other Media Forms" },
      { title: 'Favourite Film Comps!?' },
      { title: 'The Cat Is In The Bag' },
      { startTime: '3306', title: 'RADIO (b)' },
      { title: 'No Speaking (Breaka Remix)', artist: 'Juice Menace' },
      { title: 'Burn', artist: 'REA' },
      { title: 'Percussive Brain Cleanse', artist: 'JOETI' },
      { title: 'Butterfly (Kimboclat & Swerv Jersey Edit)', artist: 'Crazy Town' },
      { title: 'Night (Lucent Edit)', artist: 'Benga & Coki' },
      { title: 'Check Up On It (Edit)', artist: 'Lo5ive' },
      { title: '1 Sec (Ali McK & IYZ Hard Re-Drum)', artist: 'Novelist, Mumdance' },
      { title: 'Lean Up', artist: 'Sam Interface' },
      { title: 'Conga Drive', artist: 'Dilater' },
      { title: 'Changes (MOOD$ Flip)', artist: 'MOOD$' },
      { title: 'Monica Belluci', artist: 'Tom Manzarek' },
      { title: 'fatfast', artist: 'sanmallxxs' },
      { title: 'Candy Drop', artist: 'Disco Samir' },
      { title: 'Grace (A.Fruit Remix)', artist: 'Anna Morgan' },
      { title: 'Juke It', artist: 'Constantine, Sauadooble' },
      { title: 'C-Slug', artist: 'Muskila, HEDO HYDR8' },
      { title: 'BANKHEAD (1-800-RAZ Remix)', artist: 'KELELA' },
    ],
    dontShow: false,
  },
  {
    _type: 'mix',
    _id: 'mix-stmichel',
    title: 'Kitbash',
    artistName: 'St. Michel',
    artistRole: '3D Designer',
    subtitle: 'Mix + Interview',
    slug: { _type: 'slug', current: 'stmichel' },
    genre: 'AMBIENT TECHNO',
    coverImagePath: 'rp5/pb.png',
    coverImageDesktopPath: 'rp5/pd.png',
    audioUrl: 'https://d2rmb5ql8vpbx8.cloudfront.net/rp3+total.wav',
    tags: ['electronic', 'ambient', 'techno'],
    hexCodes: ['#5F2A50', '#FEC9DA'],
    releaseDate: '2026-02-05',
    length: '01:22:50',
    description: [
      '<b>St. Michel</b> is a 3D modeller and artist based in London.',
      '<b>RADIO Project</b> spoke with <b>St. Michel</b> about their journey as a 3D artist and how certain artists from the <b>early SoundCloud rap era influenced them.</b>',
    ],
    chapters: [
      { startTime: 0, title: 'RADIO (a)' },
      { startTime: 1672, title: 'PROJECT' },
      { startTime: 3072, title: 'RADIO (b)' },
    ],
    tracklist: [
      { startTime: '0', title: 'RADIO (a)' },
      { title: 'Any God Of Yours', artist: 'Archy Marshall' },
      { title: 'Moderato', artist: 'Astrid Sonne' },
      { title: 'Imposter', artist: 'Oli XL' },
      { title: 'Fullmoon (Motion Graphics Remix)', artist: 'Ryuichi Sakamoto' },
      { title: 'Soul', artist: 'Stanisław Słowiński' },
      { title: 'Helm', artist: 'Axis' },
      { title: 'Merry Go Round', artist: 'Bladee' },
      { title: 'Just a Taste', artist: 'Olivier Palfreyman' },
      { title: 'Falaise', artist: 'Floating Points' },
      { startTime: '1672', title: 'PROJECT' },
      { title: '3D Beginnings' },
      { title: "Analysing: Ash Thorp's McLaren 750S Premiere Video" },
      { title: 'The Marathon Scandal!?' },
      { title: 'The Origins of Whitelands!' },
      { title: 'That Feeling When Your Guitar String Snaps Mid Gig :(' },
      { title: 'We... know each other?' },
      { title: 'Biggest Mix/Production Inspirations' },
      { title: 'How Important The 2016 XXL Freshman Cypher Is/Was' },
      { title: 'Reptillian Club Boyz + The Tale of Hi-C' },
      { startTime: '3072', title: 'RADIO (b)' },
      { title: 'E Like Energy', artist: 'JKS' },
      { title: 'Stay Tonight', artist: 'Kruise Kontrol' },
      { title: 'Reverie', artist: 'DJ Sonnenbrand' },
      { title: 'Fight', artist: 'ADB' },
      { title: 'Dune', artist: 'Lysander' },
      { title: 'Opener', artist: 'Aiden Rudd' },
      { title: 'Retrace', artist: 'The Groove Room' },
      { title: 'Night Division', artist: 'Antigone' },
      { title: 'Agora Mesmo', artist: 'DJ Dextro' },
      { title: 'Burnin', artist: 'mischluft' },
      { title: 'Generated Bounces', artist: 'BXTR' },
      { title: 'Flux', artist: 'Chontane' },
      { title: 'Race Against The Time (MRD Remix)', artist: 'u.r.trax' },
      { title: 'Truth Without Pain', artist: 'Primal' },
    ],
    dontShow: false,
  },
  {
    _type: 'mix',
    _id: 'mix-waaw',
    title: 'Tension + Interplay',
    artistName: 'WAAW',
    artistRole: 'DJs',
    subtitle: 'Mix + Interview with',
    slug: { _type: 'slug', current: 'waaw' },
    genre: 'DIASPORIC DANCE',
    coverImagePath: 'rp4/pb2.png',
    coverImageDesktopPath: 'rp4/pd.png',
    audioUrl: 'https://d2rmb5ql8vpbx8.cloudfront.net/rp4+twins.wav',
    soundcloudLink: 'http://soundcloud.com/radioproject_live/st-michel',
    tags: ['kuduro', 'afrobeats', 'gqom', 'amapiano'],
    hexCodes: ['#192C28', '#98FF9A'],
    releaseDate: '2026-03-05',
    length: '01:19:43',
    description: [
      '<b>WAAW</b> are a twin DJ duo.',
      '<b>WAAW</b> join us to talk about the process of learning to mix, their most memorable gigs and how the <b>Nyege Nyege Festival in Uganda</b> was a pivotal moment for the duo.',
    ],
    chapters: [
      { startTime: 0, title: 'RADIO (a)' },
      { startTime: 1893, title: 'PROJECT' },
      { startTime: 2979, title: 'RADIO (b)' },
    ],
    tracklist: [
      { startTime: '0', title: 'RADIO (a)' },
      { title: "Sweet 'n' Seductive", artist: 'Sevy' },
      { title: 'Dark Tyms', artist: 'Scratchclart, Scotti Dee, European 305' },
      { title: 'Kolomental', artist: 'DEELA' },
      { title: 'Mirror Test', artist: 'Dubbel Dutch' },
      { title: 'Bagarre Riddim', artist: 'Kaval' },
      { title: 'Fallen', artist: 'European 305' },
      { title: "Say I'm Your Number One", artist: 'Princess, Abra' },
      { title: 'Step3', artist: 'Gafacci' },
      { title: 'Abalone Kiss', artist: 'Zora Jones, DJ Polo' },
      { title: 'Loose My Mind', artist: 'DJ Call Me' },
      { title: 'Com as Tropa', artist: 'Helviofox' },
      { title: 'PUNTZ RETURN', artist: '2D0GS' },
      { title: 'Drum Oh!', artist: 'Durban Glom Music Company' },
      { title: 'ITS MY CADILLAC', artist: 'RAW TAKES' },
      { title: 'Step So Clean', artist: 'Byna' },
      { title: 'CEROL NA MÃO', artist: 'Lorkestra, Bronka' },
      { startTime: '1893', title: 'PROJECT' },
      { title: '#DJSCHOOL' },
      { title: 'Familial Mixing' },
      { title: "WAAW's 2X2 Events" },
      { title: 'The Impact of Nyege Nyege Festival' },
      { title: 'Beefing + Bonding Over The Decks' },
      { title: 'Scary Allen + Heath Mixers' },
      { title: 'Keeping Events Grassroot!' },
      { startTime: '2979', title: 'RADIO (b)' },
      { title: 'ATMOS WAV', artist: 'Mpho.wav, Atmos Blaq' },
      { title: 'Gambia', artist: 'Sona Jobarteh' },
      { title: 'War Dance', artist: 'Kokoroko, Hagan' },
      { title: 'Inkunzi', artist: 'STATE OFFF, Kwamzy' },
      { title: 'SHOW YOURSELF', artist: 'Lorkestra' },
      { title: 'All Night', artist: 'ZJ' },
      { title: 'ATL to Lisboa', artist: 'SAYE' },
      { title: 'Saturn Return', artist: 'Fiyahdred' },
      { title: 'Kuyavela Ngalapho', artist: 'DJ Tira, DJ Sox, Mapopo' },
      { title: 'Demolition', artist: 'July Da Deejay' },
      { title: '22', artist: 'Dre Ngozi' },
      { title: 'There They Go', artist: 'Tre Oh Fie' },
      { title: 'Bounce', artist: '3.oh' },
      { title: 'Crank That Baile', artist: 'Soulja Boy, KIRA x SSP' },
      { title: 'Outro Lado', artist: 'Lokowat' },
      { title: 'Scorpio (Halftime)', artist: 'One Bok' },
      { title: 'On The Run', artist: 'Kelela, River Moon, ThugPop' },
      { title: 'Bikini', artist: 'Erika de Casier, BokBok' },
    ],
    dontShow: false,
  },
]

// ─── RADIOGRAMS ───────────────────────────────────────────────────────────────

const radiograms = [
  {
    _type: 'radiogram',
    _id: 'rg-anouk',
    title: 'The Promise of Freedom in the Western Sphere',
    authorName: 'Anouk Losleben',
    authorRole: 'Textile Designer',
    subtitle: 'Essay by',
    slug: { _type: 'slug', current: 'anouk' },
    rpCount: 'RG1',
    coverImagePath: 'rpa1/pb.png',
    coverImageDesktopPath: 'rpa1/pd.png',
    tag: 'Political Philosophy',
    tags: ['political philosophy', 'commentary', 'essay'],
    hexCodes: ['#69e3ae', '#19283a'],
    summary: [
      '<b>Anouk</b> is a textile designer behind the brand, <b>losleben.</b>',
      "She writes that in today's capitalist society, <b>we're made to believe we are free because we can choose things. But in reality, we're trapped in a system that uses consumption to control us.</b>",
    ],
    broadcastDate: '2025-06-18T17:00:00Z',
    releaseDate: '2025-06-18',
    length: '7 Minute Read',
    dontShow: false,
  },
  {
    _type: 'radiogram',
    _id: 'rg-manny',
    title: 'A Conversation with Manny',
    authorName: 'MANNY!',
    authorRole: 'Musician',
    subtitle: 'Responses from',
    slug: { _type: 'slug', current: 'manny' },
    coverImagePath: 'rpa2/pb.png',
    coverImageDesktopPath: 'rpa2/pd.png',
    tag: 'Religious Commentary',
    tags: ['religious commentary', 'q+a', 'commentary'],
    hexCodes: ['#2d2d2d', '#f9d949'],
    summary: [
      '<b>MANNY!</b> is a London-based pop artist + musician.',
      'They spoke about the space he\'s carved in music, defined by <b>honesty, experimentation, and an openness about faith, sexuality, and identity.</b>',
    ],
    broadcastDate: '2025-08-18T17:00:00Z',
    releaseDate: '2025-08-18',
    length: '5 Minute Read',
    dontShow: false,
  },
  {
    _type: 'radiogram',
    _id: 'rg-naja',
    title: 'Proponent',
    authorName: 'Naja',
    authorRole: 'Writer + Curator',
    subtitle: 'Stories from',
    slug: { _type: 'slug', current: 'naja' },
    rpCount: 'RG2',
    coverImagePath: 'rpa4/pb.png',
    coverImageDesktopPath: 'rpa4/pd.png',
    tag: 'creative writing',
    tags: ['creative writing', 'short stories'],
    hexCodes: ['#e557ad', '#ffffff'],
    summary: [
      '<b>Naja</b> is a <b>writer and curator.</b> She founded the publication, <b>run ins,</b> an experimental publication for written visual + live froms.',
      'Her essay, in three recollections, explores her sense of interconnections between <b>belief, death, and conspiracy.</b>',
    ],
    broadcastDate: '2026-02-19T17:00:00Z',
    releaseDate: '2026-02-19',
    length: '15 Minute Read',
    postLink: 'https://www.instagram.com/p/DVJDUp0DPcg/?img_index=1',
    igLink: 'https://www.instagram.com/najasurname/',
    dontShow: false,
  },
  {
    _type: 'radiogram',
    _id: 'rg-andy',
    title: 'Walking Across Object Remains',
    authorName: 'Andy Xianyi Zhang',
    authorRole: 'Director',
    subtitle: 'Essay by',
    slug: { _type: 'slug', current: 'andy' },
    coverImagePath: 'rpa3/pb.png',
    coverImageMobilePath: 'rpa3/pm.png',
    coverImageDesktopPath: 'rpa3/pd.png',
    tag: 'Film Commentary',
    tags: ['film commentary', 'essay'],
    hexCodes: [],
    broadcastDate: '2025-08-18T17:00:00Z',
    releaseDate: '2025-08-18',
    length: '5 Minute Read',
    postLink: 'https://www.instagram.com/p/DNfoIyhsIfG/?img_index=1',
    igLink: 'https://www.instagram.com/pattibobi/',
    dontShow: true,
  },
  {
    _type: 'radiogram',
    _id: 'rg-thenarrator',
    title: 'Love Is a Contact Sport',
    authorName: 'THE NARRATOR',
    authorRole: 'Artist',
    subtitle: 'Stories from',
    slug: { _type: 'slug', current: 'thenarrator' },
    coverImagePath: 'rpa6/p.png',
    coverImageDesktopPath: 'rpa6/pd.png',
    tag: 'storytelling',
    tags: ['storytelling', 'creative writing'],
    hexCodes: [],
    broadcastDate: '2025-08-18T17:00:00Z',
    releaseDate: '2025-08-18',
    length: '5 Minute Read',
    igLink: 'https://www.instagram.com/thenarrator_______/',
    dontShow: true,
  },
  {
    _type: 'radiogram',
    _id: 'rg-ivory',
    title: 'USB City',
    authorName: 'Ivory Pijin',
    authorRole: 'Writer',
    subtitle: 'Essay by',
    slug: { _type: 'slug', current: 'ivory' },
    coverImagePath: 'rpa7/p.png',
    coverImageDesktopPath: 'rpa7/pd.png',
    tag: 'cultural commentary',
    tags: ['digital culture', 'memoir'],
    hexCodes: [],
    broadcastDate: '2025-08-18T17:00:00Z',
    releaseDate: '2025-08-18',
    length: '5 Minute Read',
    igLink: 'https://www.instagram.com/ivorypijin/',
    dontShow: true,
  },
]

// ─── RUN MIGRATION ────────────────────────────────────────────────────────────

async function migrate() {
  if (!process.env.SANITY_TOKEN) {
    console.error('Missing SANITY_TOKEN. Run: SANITY_TOKEN=your_token node migrate.mjs')
    process.exit(1)
  }

  console.log('Starting migration...\n')

  for (const mix of mixes) {
    console.log(`→ Mix: ${mix.artistName}`)
    const { coverImagePath, coverImageDesktopPath, description, tracklist, chapters, ...rest } = mix

    const coverImage = await uploadImage(coverImagePath)
    const coverImageDesktop = await uploadImage(coverImageDesktopPath)

    const doc = {
      ...rest,
      ...(coverImage && { coverImage }),
      ...(coverImageDesktop && { coverImageDesktop }),
      description: htmlToPortableText(description),
      tracklist: tracklistWithKeys(tracklist),
      chapters: chaptersWithKeys(chapters),
    }

    await client.createOrReplace(doc)
    console.log(`  ✓ Created\n`)
  }

  for (const rg of radiograms) {
    console.log(`→ Radiogram: ${rg.authorName}`)
    const { coverImagePath, coverImageMobilePath, coverImageDesktopPath, summary, ...rest } = rg

    const coverImage = await uploadImage(coverImagePath)
    const coverImageMobile = await uploadImage(coverImageMobilePath)
    const coverImageDesktop = await uploadImage(coverImageDesktopPath)

    const doc = {
      ...rest,
      ...(coverImage && { coverImage }),
      ...(coverImageMobile && { coverImageMobile }),
      ...(coverImageDesktop && { coverImageDesktop }),
      summary: htmlToPortableText(summary),
    }

    await client.createOrReplace(doc)
    console.log(`  ✓ Created\n`)
  }

  console.log('Migration complete.')
}

migrate().catch((err) => {
  console.error(err)
  process.exit(1)
})
