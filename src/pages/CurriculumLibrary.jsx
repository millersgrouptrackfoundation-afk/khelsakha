import { useState } from "react"

const BOOKS = [
  { id:"c1", label:"Class 1", subtitle:"Age 6–7 · Foundation Movement", color:"#f97316", bg:"#fff7ed", icon:"🏃" },
  { id:"c2", label:"Class 2", subtitle:"Age 7–8 · Movement Confidence", color:"#eab308", bg:"#fefce8", icon:"🤸" },
  { id:"c3", label:"Class 3", subtitle:"Age 8–9 · Skill Building", color:"#22c55e", bg:"#f0fdf4", icon:"⚽" },
  { id:"c4", label:"Class 4", subtitle:"Age 9–10 · Game Application", color:"#3b82f6", bg:"#eff6ff", icon:"🏀" },
  { id:"c5", label:"Class 5", subtitle:"Age 10–11 · Sport Introduction", color:"#8b5cf6", bg:"#f5f3ff", icon:"🏆" },
  { id:"basketball", label:"Basketball", subtitle:"Middle School · Single Discipline", color:"#f97316", bg:"#fff7ed", icon:"🏀" },
  { id:"volleyball", label:"Volleyball", subtitle:"Middle School · Single Discipline", color:"#3b82f6", bg:"#eff6ff", icon:"🏐" },
  { id:"football", label:"Football", subtitle:"Middle School · Single Discipline", color:"#22c55e", bg:"#f0fdf4", icon:"⚽" },
  { id:"cricket", label:"Cricket", subtitle:"Middle School · Single Discipline", color:"#0ea5e9", bg:"#f0f9ff", icon:"🏏" },
  { id:"kabaddi", label:"Kabaddi", subtitle:"Indigenous Games", color:"#dc2626", bg:"#fef2f2", icon:"💪" },
  { id:"athletics", label:"Athletics", subtitle:"Track & Field", color:"#d97706", bg:"#fffbeb", icon:"🏅" },
  { id:"yoga", label:"Yoga", subtitle:"Wellness & Flexibility", color:"#8b5cf6", bg:"#f5f3ff", icon:"🧘" },
]

const WARMUP_GAMES = [
  { code:"WG1", name:"Cups and Cones", duration:"4–6 min", players:"Whole class", equipment:["25–30 coloured cones"],
    setup:"Scatter 25–30 cones — half right-side up (cups), half upside down (cones). Divide class into Cup Team and Cone Team. On GO, each team flips cones to their shape. After 30 seconds, count scores. Play three rounds.",
    variations:["Change movement: hop, skip, or side-step","Reduce to 20 seconds for intensity","Increase cone count for larger classes"],
    safetyTip:"Look where you are going — no collisions. No diving for cones.",
    nutritionTip:"A nutritious breakfast gives your body energy to move fast and think quickly during games.",
    lifeskill:"Teamwork — every flip counts. One person cannot win this game alone." },
  { code:"WG2", name:"Body Part Touch", duration:"4–6 min", players:"Whole class", equipment:["None — open area"],
    setup:"Children spread across the area. Mentor calls two body parts e.g. elbow to knee. Children touch that part and hold. On whistle, jog freely until next call. Speed up gradually.",
    variations:["Call partner combinations: your knee to your partner's back","Call a number then body part: groups of three, shoulder to shoulder!","Use animals: move like a crab! before the next call"],
    safetyTip:"Ensure enough personal space so children do not bump into each other.",
    nutritionTip:"Carbohydrates from rice, bread, and roti give your muscles the fuel to keep moving.",
    lifeskill:"Listening Skills — this game only works when you listen carefully." },
  { code:"WG3", name:"Island Rescue", duration:"4–6 min", players:"Whole class", equipment:["15–20 hoops"],
    setup:"Spread 15–20 hoops as islands. One child is the Crocodile. Swimmers jog freely — jump into a hoop (max 2 per hoop) to be safe. Tagged swimmers become Crocodiles. Remove one hoop every 60 seconds.",
    variations:["Limit islands to one child only for more competition","Add a second Crocodile for pace","Skip or hop instead of jogging"],
    safetyTip:"Step into hoops carefully — do not jump from height. Check hoops are flat.",
    nutritionTip:"Water is your body's most important fuel. Drink a small amount before activity.",
    lifeskill:"Quick Decision Making — when the Crocodile is close, think and act fast." },
  { code:"WG4", name:"Number Sprint", duration:"4–6 min", players:"Whole class", equipment:["4 hoops","Central hoop","20 bean bags"],
    setup:"Four equal teams sit in lines. Number each player. Place bean bags in a central hoop. Call a number — that player from each team sprints to centre, collects one bean bag, returns to team hoop. First team to collect 5 wins.",
    variations:["Call two numbers — both go together and cooperate","Call a maths sum instead: 2 plus 3 — number 5 runs","Hop or skip to centre instead of sprint"],
    safetyTip:"Central hoop must be far enough from bases so players do not collide at speed.",
    nutritionTip:"Protein from eggs, lentils, and milk helps muscles recover and grow stronger after exercise.",
    lifeskill:"Focus — the moment your number is called, there is no time to hesitate." },
  { code:"WG5", name:"Tail Chase", duration:"4–6 min", players:"Whole class", equipment:["One bib per child"],
    setup:"Give each child a bib tucked into their waistband. Everyone tries to snatch others tails. If your tail is taken, tuck it back in before rejoining. After two minutes, count who collected the most.",
    variations:["Work in pairs — protect each other's tails while hunting others","Hopping only for added challenge","Designate a 5-second safe zone"],
    safetyTip:"Tails must be tucked loosely. No grabbing clothing or body parts — only the tail.",
    nutritionTip:"A banana or handful of nuts before activity provides natural energy that lasts through the session.",
    lifeskill:"Spatial Awareness — watch what is happening in front, behind, and to the sides, all at once." },
  { code:"WG6", name:"Morning Rush", duration:"4–6 min", players:"Whole class", equipment:["None — open area"],
    setup:"Children act out a morning story narrated by the mentor: Wake up and stretch... run to the bathroom... brush your teeth... grab your bag... run to the school gate — just made it! Build speed as the story progresses.",
    variations:["Let a child volunteer to narrate their own version","Add obstacles: jump over a puddle, duck under a branch","Use a different story each week"],
    safetyTip:"Space must be clear of obstacles. Children need room to move without colliding.",
    nutritionTip:"A healthy breakfast — milk, fruit, and a grain — gives the brain and body everything needed for a great day.",
    lifeskill:"Imagination and Creativity — a creative mind makes a better athlete and a better teammate." },
]

const COOLDOWN_GAMES = [
  { code:"CD1", name:"Slow Motion Replay", duration:"4–6 min",
    setup:"Children replay the session main activity in slow motion. Mentor narrates in a slow, calm voice. Gradually reduce pace until children are walking, then standing, then breathing slowly.",
    safetyTip:"Keep movement slow and controlled. No sudden bursts of speed.",
    nutritionTip:"After exercise, your muscles need water and gentle food to start recovering.",
    lifeskill:"Mindfulness — slowing down deliberately is a skill that helps in high-pressure moments." },
  { code:"CD2", name:"Statue Garden", duration:"4–6 min",
    setup:"Children move slowly around the space. When the mentor calls a number (1, 2, or 3), they freeze in a shape: 1=small shape, 2=tall shape, 3=wide shape. Hold for 10 seconds, then move again.",
    safetyTip:"Ensure enough space between children so statues do not collide.",
    nutritionTip:"Eating a piece of fruit after exercise helps replenish the sugars your muscles used.",
    lifeskill:"Self-control — choosing to slow down and be still is a form of strength." },
  { code:"CD3", name:"Cloud Float", duration:"4–6 min",
    setup:"Children walk slowly with arms out as if floating on clouds. Mentor guides a breathing exercise: breathe in for 4 steps, out for 4 steps. End seated with eyes closed, listening to one sound in the environment.",
    safetyTip:"Keep movement calm. End with seated stretching, not lying down.",
    nutritionTip:"Drinking water after exercise is essential — your body lost water through sweat and needs it replaced.",
    lifeskill:"Relaxation — the ability to calm your body and mind after effort is a critical athletic skill." },
]

const CLASS1_SKILLS = [
  { id:"skipping", name:"Skipping", code:"K1", icon:"🦘", color:"#f97316",
    whatIsIt:"A locomotor movement combining a step and a hop on the same foot, immediately followed by a step and hop on the opposite foot. Requires bilateral coordination.",
    whyTeach:["Develops bilateral coordination — using both sides of the body in coordinated, alternating patterns","Builds rhythm and timing — foundational for athletics, dance, and most team sports","Strengthens lower body muscles: quadriceps, calves, and glutes","Improves cardiovascular fitness when performed continuously","Reliable indicator of overall motor development progress"],
    stages:[
      { stage:"Stage 1 — Initial", color:"#ef4444", bg:"#fef2f2", signs:["One-footed skip — uncoordinated step-hop pattern","Double hopping or double stepping on same foot frequently","Arms held rigidly or waving without purpose","Rhythm inconsistent, pattern lost quickly"] },
      { stage:"Stage 2 — Transition", color:"#f59e0b", bg:"#fffbeb", signs:["Effective coordination of step-hop pattern, but rhythm inconsistent","Arms begin to swing rhythmically — sometimes exaggerated","Landing is flat-footed rather than toe-first","Can maintain skipping for short distances"] },
      { stage:"Stage 3 — Mature", color:"#22c55e", bg:"#f0fdf4", signs:["Rhythmic weight transfer throughout","Arms swing in light, natural opposing motion","Landing is toe-first — efficient and reduces joint impact","Can skip continuously, change direction, and vary speed"] },
    ],
    activities:[
      { code:"K1.1", name:"Skip Like A...", type:"Imaginative Expression", duration:"10–15 min", players:"Whole class", equipment:["Open area"],
        description:"Children skip freely around the space. Call out a character or creature and they change skipping style to match: Skip like a giant — slow, heavy, stomping steps. Skip like a sparrow — fast, light, tiny steps with fluttering arms. Skip like a clown — exaggerated, wobbly, arms out wide.",
        variations:["One child is Leader and class copies their style","Use drum or clap to set rhythm","Call direction along with character: Skip like a giant going backward!"],
        safetyTip:"Ensure enough space — exaggerated movements need room.",
        nutritionTip:"Eating a light snack 30 minutes before exercise gives the body ready energy.",
        lifeskill:"Creativity — expressing yourself through movement is a form of confidence." },
      { code:"K1.2", name:"Musical Hoops Skip", type:"Musical Game", duration:"10–15 min", players:"Whole class", equipment:["Hoops (one fewer than children)","Music or drum"],
        description:"Scatter hoops around the playing area — one fewer than the number of children. Play music and children skip around the space. When music stops, every child must step into a hoop. Child without a hoop joins the helper team.",
        variations:["Allow two children per hoop — cooperative version","Children must skip a full circuit before entering a hoop"],
        safetyTip:"Children must step in hoops carefully — not jump in from a distance.",
        nutritionTip:"Calcium from milk, curd, and paneer builds strong bones that support every jump and hop.",
        lifeskill:"Inclusion — no one is out. Everyone stays active as a helper." },
      { code:"K1.3", name:"Skip the River", type:"Challenge Course", duration:"10–15 min", players:"Groups of 4–6", equipment:["Two lengths of rope","Flat cones","Open area"],
        description:"Lay two parallel ropes approximately 30 cm apart — the river. Children line up at one end. One at a time, each skips toward the river and leaps over it landing on two feet. After each successful crossing, widen the river by 10 cm.",
        variations:["Add a one-hop approach for children needing momentum","Create two rivers of different widths"],
        safetyTip:"Landing area must be clear and flat. Children wait behind a starting cone.",
        nutritionTip:"Calcium from milk, curd, and paneer builds the strong bones needed to land safely.",
        lifeskill:"Sportsmanship — cheering for others, especially when they struggle, is the mark of a true sportsperson." },
      { code:"K1.4", name:"Skip and Freeze", type:"Stop-Start Game", duration:"10–15 min", players:"Whole class", equipment:["Whistle","Open area"],
        description:"Children skip freely around the space. On the whistle, they freeze immediately in the best balance position they can hold. Mentor checks each child balance. On second whistle, they begin skipping again.",
        variations:["Call a shape to freeze in: freeze like a tree, freeze like a bridge","Children must freeze on one leg"],
        safetyTip:"No running into others during freeze. Children must stop within their personal space.",
        nutritionTip:"Your brain needs water just as much as your muscles.",
        lifeskill:"Self-Control — the ability to stop instantly on a signal is a discipline that transfers to every area of life." },
      { code:"K1.5", name:"Shadow Skip", type:"Partner Mirroring", duration:"10–15 min", players:"Pairs", equipment:["Open area"],
        description:"Partners stand facing each other about one metre apart. One is the Leader, one is the Shadow. Leader skips — Shadow mirrors every movement in real time. After 45 seconds, swap roles. Progress to Mirror Round: neither is the official Leader.",
        variations:["Restrict to upper body first, then add lower body","Groups of three: one Leader, two Shadows"],
        safetyTip:"All movement must be at controlled pace.",
        nutritionTip:"Healthy fats from groundnuts and sesame seeds support brain function.",
        lifeskill:"Empathy and Observation — truly watching someone else teaches you to understand and respond to others." },
      { code:"K1.6", name:"Jump the River", type:"Progressive Challenge", duration:"10–15 min", players:"Whole class", equipment:["Two lengths of rope","Cones","Measuring tape"],
        description:"Lay two parallel ropes 30 cm apart — this is the river. Children line up and take turns skipping toward the river and leaping over, landing on two feet. After everyone crosses, widen the river by 10 cm.",
        variations:["Add a one-hop approach for children needing momentum","Stepping stone cone in the middle for two-jump challenge"],
        safetyTip:"Landing area must be clear and flat. No crowding near jump zone.",
        nutritionTip:"Calcium from milk, curd, and paneer builds the strong bones needed to land safely.",
        lifeskill:"Sportsmanship — cheering for others is the mark of a true sportsperson." },
      { code:"K1.7", name:"Collect and Skip", type:"Relay Game", duration:"10–15 min", players:"Groups of 5", equipment:["One hoop per group at each end","20–24 bean bags"],
        description:"Groups of five. One hoop at each end per group. Each starting hoop contains four bean bags. On GO, first pupil skips to opposite hoop, picks up one bean bag, skips back and places it in their home hoop. Next pupil goes.",
        variations:["Change locomotor skill each round: run, side-step, hop","Add obstacles between hoops"],
        safetyTip:"Groups must have clearly marked lanes so pupils do not cross each other paths.",
        nutritionTip:"Growing children need more vitamin C, calcium, and iron than adults.",
        lifeskill:"Focus — never lose sight of your goal." },
      { code:"K1.8", name:"Shape Makers", type:"Literacy Integration", duration:"10–15 min", players:"Pairs then groups of 4", equipment:["Open area","Whistle"],
        description:"Pairs skip in opposite directions around the space. When mentor calls a letter, number, or shape, both partners find each other and form that shape together on the ground. Hold for five seconds. Progress to groups of four.",
        variations:["Call sport-related words: GOAL, BALL, WIN","Larger groups form longer words"],
        safetyTip:"Pause activity at intervals to discuss skipping technique.",
        nutritionTip:"A balanced breakfast with protein, carbohydrate, and healthy fat gives the brain and body everything needed.",
        lifeskill:"Goal Setting — set your target, work toward it systematically, and celebrate every step forward." },
    ]
  },
  { id:"throwing", name:"Throwing", code:"T1", icon:"🎯", color:"#3b82f6",
    whatIsIt:"Projecting an object away from the body using one or both hands. Class 1 focuses on the underarm throw (accuracy, short distance) and the overarm throw (distance and power).",
    whyTeach:["Develops full-body coordination — legs, core, arm, and wrist in a linked sequence","Builds upper body strength — shoulder, arm, and wrist","Improves spatial awareness — judging distance, angle, and release point","Foundational for cricket, athletics, basketball, kabaddi, and handball"],
    stages:[
      { stage:"Stage 1 — Initial", color:"#ef4444", bg:"#fef2f2", signs:["Throw resembles a push — movement limited to front of body","Only elbow used to push object forward","Both legs remain stationary throughout","Ball travels short distance and lacks power"] },
      { stage:"Stage 2 — Transition", color:"#f59e0b", bg:"#fffbeb", signs:["Throwing arm swings to approximately head level","Body begins to rotate slightly toward throwing side","Foot on same side as throwing arm steps forward","Partial follow-through"] },
      { stage:"Stage 3 — Mature", color:"#22c55e", bg:"#f0fdf4", signs:["Full arm swing backward and upward in wide arc","Elbow moves close to ear level — leads throw forward","Forward step with foot opposite the throwing arm","Full follow-through — throwing arm reaches forward and down across body"] },
    ],
    activities:[
      { code:"T1.1", name:"Partner Roll and Throw", type:"Progressive Partner", duration:"10–15 min", players:"Pairs", equipment:["One ball per pair","Optional: bean bags, cones"],
        description:"Pairs with one ball, at least 3 metres apart. Begin rolling back and forth with both hands, then one hand. Progress to bouncing, then underarm throwing, then overarm throw. Challenge: ten throws without dropping.",
        variations:["Increase distance one step back after every five successful throws","Vary the object: small foam ball, large ball, bean bag"],
        safetyTip:"Pairs need clear lanes. No overarm throwing toward the face.",
        nutritionTip:"Eating breakfast — even just a banana and a glass of milk — kick-starts the body.",
        lifeskill:"Endurance — every throw that misses is just information. Adjust, try again, and keep going." },
      { code:"T1.2", name:"Basket Raid", type:"Team Game", duration:"10–15 min", players:"Groups of 4–6", equipment:["4 hoops","20 bean bags"],
        description:"Two teams. Each team has a home hoop filled with bean bags and a target hoop across the playing area. Players throw bean bags into the opposing team target hoop. Both teams throw simultaneously. After one minute, count bean bags in each target hoop.",
        variations:["Underarm only round, then overarm only round","Move target hoops to different distances"],
        safetyTip:"No throwing at other children — only at the hoops.",
        nutritionTip:"Iron from foods like spinach, lentils, and eggs helps your blood carry oxygen to muscles.",
        lifeskill:"Strategy — where you aim and how hard you throw are choices. Good athletes think, then act." },
      { code:"T1.3", name:"Clean Your Side", type:"Team Relay", duration:"10–15 min", players:"Two teams", equipment:["20–30 bean bags or balls","Rope or cones to divide court"],
        description:"Divide the area with a rope or line of cones. Each team starts with equal bean bags on their side. On GO, players throw bean bags to the other side as fast as possible. On STOP, count bean bags on each side. Team with fewer on their side wins.",
        variations:["Underarm only for accuracy focus","Overarm only for power focus"],
        safetyTip:"No throwing at other children. All throws must go over the dividing line.",
        nutritionTip:"Your body is mostly water. Sweating during activity means you lose water fast — replace it regularly.",
        lifeskill:"Urgency — sometimes the goal requires you to move as fast as possible with total commitment." },
      { code:"T1.4", name:"Through the Gate", type:"Accuracy Challenge", duration:"10–15 min", players:"Groups of 3–4", equipment:["2 tall cones per group","5 bean bags per child"],
        description:"Set two tall cones approximately 1 metre apart — this is the gate. Children stand behind a throwing line and throw bean bags through the gate. If successful, take one step back. Record personal best distance for each child.",
        variations:["Narrow the gate as children improve","Place gate at different heights"],
        safetyTip:"Only one child throws at a time. Others stand behind the throwing line.",
        nutritionTip:"Protein from lentils, eggs, chicken, or tofu helps repair and build the muscles you are working hard.",
        lifeskill:"Precision — power without accuracy is just effort." },
      { code:"T1.5", name:"Distance Challenge", type:"Personal Best", duration:"10–15 min", players:"Pairs", equipment:["One bean bag per pair","Chalk","Cones for throwing line"],
        description:"Pairs line up along a throwing line. Child A throws overarm as far as possible. Mark the spot with initials. Child B repeats. Five throws each. Circle the furthest mark — personal best for today.",
        variations:["Set scoring zones with cones","Allow a run-up after practising the standing throw"],
        safetyTip:"All children must wait behind the throwing line until signal to retrieve.",
        nutritionTip:"Eating a balanced breakfast with protein fuels concentration, coordination, and performance.",
        lifeskill:"Keep Learning — no matter how far you throw today, never stop learning." },
      { code:"T1.6", name:"Bounce Pass Challenge", type:"Partner Game", duration:"10–15 min", players:"Pairs then groups of 4", equipment:["One ball per pair","One hoop per pair"],
        description:"Partners place a hoop flat midway between them. Child A bounces ball into the hoop so it rises to Child B who catches it. Count consecutive successful bounce-and-catches. Target: five in a row, then ten.",
        variations:["Increase or decrease distance between partners","Vary ball type — large foam, small rubber, tennis ball"],
        safetyTip:"Groups spaced far enough apart so balls do not collide across lanes.",
        nutritionTip:"Try not to eat too many fried foods, sweets, or sugary drinks daily.",
        lifeskill:"Knowing Your Limits — the trick is not just pushing yourself hard, but also knowing when to stop and rest." },
      { code:"T1.7", name:"Target Throw", type:"Accuracy Self-Challenge", duration:"10–15 min", players:"Groups of 4", equipment:["One hoop per group","One bean bag per child"],
        description:"Group places hoop flat on the ground as a target. Each child stands one metre from the hoop and throws their bean bag in. If successful, take one step back and throw again. Children continue stepping back to find their maximum accurate throwing distance.",
        variations:["Pairs for more throwing turns per session","Place hoop upright against wall — throw through it rather than into it"],
        safetyTip:"No child may move forward to retrieve their bean bag until all children in the group have completed their throw.",
        nutritionTip:"Carbohydrates from rice, roti, bread, and bananas are the primary fuel for muscles.",
        lifeskill:"Respect — how you treat others defines your character far more than how far you can throw." },
      { code:"T1.8", name:"Pinball Alley", type:"Accuracy Team Game", duration:"10–15 min", players:"Groups of 4", equipment:["One ball per group","5–7 skittle targets"],
        description:"Two pairs facing each other approximately 15 metres apart. Place five to seven skittle targets in the middle. One pair at a time rolls or throws toward the skittles. If a skittle is knocked down, that pair claims it. Most skittles wins.",
        variations:["Throw overarm instead of rolling","Two balls at once — two children throw simultaneously"],
        safetyTip:"All throws must be aimed at skittles — not at other children.",
        nutritionTip:"A variety of nuts — groundnuts, almonds, cashews — provides protein, healthy fats, and vitamins.",
        lifeskill:"Goal Setting — set your target literally and figuratively. Know what you want to achieve." },
    ]
  },
]

function GameCard({ game, accentColor }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{borderTop:`3px solid ${accentColor}`}}>
      <div onClick={() => setExpanded(e => !e)} className="p-4 cursor-pointer flex justify-between items-center hover:bg-gray-50">
        <div>
          <div className="font-bold text-sm text-[#1A3B2E]">{game.code} — {game.name}</div>
          <div className="text-xs text-gray-400 mt-1">{game.duration} · {game.players}</div>
        </div>
        <span className="text-gray-400 text-xs">{expanded?"▲":"▼"}</span>
      </div>
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <p className="text-sm text-gray-700 leading-relaxed mt-3 mb-3">{game.setup}</p>
          {game.variations && (
            <div className="mb-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Variations</p>
              {game.variations.map((v,i) => <p key={i} className="text-xs text-gray-600 mb-1">→ {v}</p>)}
            </div>
          )}
          <div className="grid grid-cols-3 gap-2">
            {[
              {label:"⚠ Safety", text:game.safetyTip, color:"#ef4444"},
              {label:"🥑 Nutrition", text:game.nutritionTip, color:"#22c55e"},
              {label:"💡 Life Skill", text:game.lifeskill, color:"#8b5cf6"}
            ].map(tip => (
              <div key={tip.label} className="bg-gray-50 rounded-xl p-2.5" style={{borderTop:`2px solid ${tip.color}`}}>
                <div className="text-xs font-bold mb-1" style={{color:tip.color}}>{tip.label}</div>
                <div className="text-xs text-gray-600 leading-relaxed">{tip.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ActivityCard({ activity, skill, onSelect }) {
  return (
    <div onClick={() => onSelect(activity)} className="bg-white rounded-2xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
      style={{borderLeft:`4px solid ${skill.color}`}}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{background:skill.color+"18",color:skill.color}}>{activity.code}</span>
        <span className="text-xs text-gray-400">{activity.duration}</span>
      </div>
      <div className="font-bold text-sm text-[#1A3B2E] mb-1">{activity.name}</div>
      <div className="text-xs text-gray-400 mb-2">{activity.type} · {activity.players}</div>
      <div className="text-xs text-gray-500 line-clamp-2">{activity.description}</div>
      {activity.equipment?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {activity.equipment.slice(0,3).map((e,i) => <span key={i} className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{e}</span>)}
        </div>
      )}
    </div>
  )
}

export default function CurriculumLibrary() {
  const [view, setView] = useState("shelf")
  const [selectedBook, setSelectedBook] = useState(null)
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [libraryTab, setLibraryTab] = useState("activities")

  function goBack() {
    if (view === "activity") { setView("chapter"); setSelectedActivity(null) }
    else if (view === "chapter") { setView("book"); setSelectedSkill(null) }
    else if (view === "book") { setView("shelf"); setSelectedBook(null) }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1A3B2E]" style={{fontFamily:"Playfair Display,serif"}}>Curriculum Library</h1>
        <p className="text-gray-600 mt-1">MGTF · Khelo · Seekho · Badho</p>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 flex-wrap">
        <span className="cursor-pointer font-semibold hover:text-[#1A3B2E]" onClick={() => { setView("shelf"); setSelectedBook(null); setSelectedSkill(null); setSelectedActivity(null) }}>Library</span>
        {selectedBook && <><span>›</span><span className="cursor-pointer font-semibold hover:text-[#1A3B2E]" onClick={() => { setView("book"); setSelectedSkill(null); setSelectedActivity(null) }}>{selectedBook.label}</span></>}
        {selectedSkill && <><span>›</span><span className="cursor-pointer font-semibold hover:text-[#1A3B2E]" onClick={() => { setView("chapter"); setSelectedActivity(null) }}>{selectedSkill.name}</span></>}
        {selectedActivity && <><span>›</span><span className="font-semibold text-[#1A3B2E]">{selectedActivity.code}</span></>}
      </div>

      {view === "shelf" && (
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Primary School — Class Books</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {BOOKS.filter(b => b.id.startsWith("c")).map(book => (
              <div key={book.id} onClick={() => { setSelectedBook(book); setView("book") }}
                className="bg-white rounded-2xl p-5 cursor-pointer hover:shadow-md transition-all"
                style={{borderLeft:`5px solid ${book.color}`}}>
                <div className="text-3xl mb-3">{book.icon}</div>
                <div className="font-bold text-[#1A3B2E]">{book.label}</div>
                <div className="text-xs text-gray-400 mt-1">{book.subtitle}</div>
                {book.id === "c1" && <div className="mt-2 text-xs font-bold px-2 py-0.5 rounded-full inline-block" style={{background:book.color+"20",color:book.color}}>Full Content</div>}
              </div>
            ))}
          </div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Middle School — Single Discipline</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {BOOKS.filter(b => !b.id.startsWith("c")).map(book => (
              <div key={book.id} onClick={() => { setSelectedBook(book); setView("book") }}
                className="bg-white rounded-2xl p-4 cursor-pointer hover:shadow-md transition-all"
                style={{borderLeft:`5px solid ${book.color}`}}>
                <div className="text-2xl mb-2">{book.icon}</div>
                <div className="font-bold text-sm text-[#1A3B2E]">{book.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{book.subtitle}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "book" && selectedBook && (
        <div>
          <button onClick={goBack} className="mb-5 px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">← Back</button>
          <div className="rounded-2xl p-5 text-white mb-6" style={{background:`linear-gradient(135deg,${selectedBook.color},${selectedBook.color}aa)`}}>
            <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">KhelSakha Curriculum</div>
            <div className="font-black text-2xl">{selectedBook.label}</div>
            <div className="text-sm opacity-85 mt-1">{selectedBook.subtitle}</div>
          </div>

          {selectedBook.id === "c1" ? (
            <>
              <div className="flex gap-2 mb-6">
                {[{id:"activities",label:"🎮 Skill Chapters"},{id:"warmup",label:"🔥 Warm-up Games"},{id:"cooldown",label:"🌙 Cool-down Games"}].map(t => (
                  <button key={t.id} onClick={() => setLibraryTab(t.id)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${libraryTab===t.id?"bg-[#1A3B2E] text-white":"bg-white text-gray-500 border border-gray-200"}`}>
                    {t.label}
                  </button>
                ))}
              </div>

              {libraryTab === "activities" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {CLASS1_SKILLS.map(skill => (
                    <div key={skill.id} onClick={() => { setSelectedSkill(skill); setView("chapter") }}
                      className="bg-white rounded-2xl p-5 cursor-pointer hover:shadow-md transition-all border border-gray-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{background:skill.color+"18"}}>{skill.icon}</div>
                        <div>
                          <div className="font-bold text-[#1A3B2E]">{skill.name}</div>
                          <div className="text-xs text-gray-400">{skill.code} · Chapter {CLASS1_SKILLS.indexOf(skill)+1}</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{background:skill.color+"18",color:skill.color}}>{skill.activities.length} Activities</span>
                        <span className="text-xs text-gray-400">3 stages</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {libraryTab === "warmup" && (
                <div className="space-y-3">
                  {WARMUP_GAMES.map(game => <GameCard key={game.code} game={game} accentColor="#f97316" />)}
                </div>
              )}

              {libraryTab === "cooldown" && (
                <div className="space-y-3">
                  {COOLDOWN_GAMES.map(game => <GameCard key={game.code} game={game} accentColor="#8b5cf6" />)}
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border-2 border-dashed border-gray-200">
              <div className="text-5xl mb-4">{selectedBook.icon}</div>
              <div className="font-bold text-lg text-gray-500 mb-2">{selectedBook.label} Curriculum</div>
              <div className="text-sm">Full content for this book is being added. Class 1 is fully loaded. Upload remaining books to populate this section.</div>
            </div>
          )}
        </div>
      )}

      {view === "chapter" && selectedSkill && (
        <div>
          <button onClick={goBack} className="mb-5 px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">← Back</button>
          <div className="rounded-2xl p-5 text-white mb-6" style={{background:selectedSkill.color}}>
            <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Class 1 · Skill Chapter</div>
            <div className="font-black text-2xl flex items-center gap-3"><span className="text-3xl">{selectedSkill.icon}</span>{selectedSkill.name}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="font-bold text-xs uppercase tracking-wider mb-3" style={{color:selectedSkill.color}}>What Is {selectedSkill.name}?</div>
              <p className="text-sm text-gray-700 leading-relaxed">{selectedSkill.whatIsIt}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="font-bold text-xs uppercase tracking-wider mb-3" style={{color:selectedSkill.color}}>Why Teach It?</div>
              {selectedSkill.whyTeach.map((w,i) => (
                <div key={i} className="flex gap-2 mb-2 text-sm"><span className="text-green-500 font-bold flex-shrink-0">→</span><span className="text-gray-700">{w}</span></div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
            <div className="font-bold text-xs uppercase tracking-wider mb-4" style={{color:selectedSkill.color}}>Development Stages</div>
            <div className="grid grid-cols-3 gap-3">
              {selectedSkill.stages.map((s,i) => (
                <div key={i} className="rounded-xl p-4" style={{background:s.bg, borderTop:`3px solid ${s.color}`}}>
                  <div className="font-bold text-xs mb-3" style={{color:s.color}}>{s.stage}</div>
                  {s.signs.map((sign,j) => (
                    <div key={j} className="flex gap-2 mb-1.5 text-xs text-gray-700"><span style={{color:s.color}}>•</span>{sign}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="font-bold text-[#1A3B2E] mb-4">Activities ({selectedSkill.activities.length})</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedSkill.activities.map(activity => (
              <ActivityCard key={activity.code} activity={activity} skill={selectedSkill} onSelect={a => { setSelectedActivity(a); setView("activity") }} />
            ))}
          </div>
        </div>
      )}

      {view === "activity" && selectedActivity && selectedSkill && (
        <div>
          <button onClick={goBack} className="mb-5 px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">← Back to {selectedSkill.name}</button>
          <div className="rounded-2xl p-6 text-white mb-6" style={{background:`linear-gradient(135deg,${selectedSkill.color},${selectedSkill.color}aa)`}}>
            <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">{selectedActivity.code} · {selectedActivity.type}</div>
            <div className="font-black text-2xl mb-2">{selectedActivity.name}</div>
            <div className="flex gap-4 text-sm opacity-90"><span>⏱ {selectedActivity.duration}</span><span>👥 {selectedActivity.players}</span></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="font-bold text-xs uppercase tracking-wider mb-3" style={{color:selectedSkill.color}}>Activity Description</div>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedActivity.description}</p>
              </div>
              {selectedActivity.variations?.length > 0 && (
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="font-bold text-xs uppercase tracking-wider mb-3" style={{color:selectedSkill.color}}>Variations</div>
                  {selectedActivity.variations.map((v,i) => (
                    <div key={i} className="flex gap-2 mb-2 text-sm"><span className="font-bold flex-shrink-0" style={{color:selectedSkill.color}}>→</span><span className="text-gray-700">{v}</span></div>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-4">
              {selectedActivity.equipment?.length > 0 && (
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-3">🎒 Equipment</div>
                  {selectedActivity.equipment.map((e,i) => (
                    <div key={i} className="flex gap-2 mb-1.5 text-sm"><span style={{color:selectedSkill.color}}>•</span>{e}</div>
                  ))}
                </div>
              )}
              {[
                {label:"⚠️ Safety Tip", text:selectedActivity.safetyTip, color:"#ef4444"},
                {label:"🥑 Nutrition Tip", text:selectedActivity.nutritionTip, color:"#22c55e"},
                {label:"💡 Life Skill", text:selectedActivity.lifeskill, color:"#8b5cf6"}
              ].map(tip => (
                <div key={tip.label} className="bg-white rounded-2xl p-4 shadow-sm" style={{borderTop:`3px solid ${tip.color}`}}>
                  <div className="font-bold text-xs mb-2" style={{color:tip.color}}>{tip.label}</div>
                  <div className="text-sm text-gray-700 leading-relaxed">{tip.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
