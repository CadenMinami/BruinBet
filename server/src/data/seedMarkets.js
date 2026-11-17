// sample markets for npm run seed, add or remove whatever
// category has to be one of the ones in models/Market.js
// closesInHours = how long after seeding it closes
// closesSoon = closes a few min after seeding so we can demo close + settle
const markets = [
    // demo markets
    {
        question: "Will De Neve serve chicken tenders at dinner tonight?",
        category: "Dining",
        outcomes: ["Yes", "No"],
        closesSoon: true,
    },
    {
        question: "Will the IM 3v3 basketball final tonight go to overtime?",
        category: "IM Sports",
        outcomes: ["Yes", "No"],
        closesSoon: true,
    },

    // D1 sports
    {
        question: "Will UCLA football beat USC in the rivalry game?",
        category: "D1 Sports",
        outcomes: ["UCLA", "USC"],
        closesInHours: 8 * 24,
    },
    {
        question: "Will UCLA football score 30+ points in its next game?",
        category: "D1 Sports",
        outcomes: ["Yes", "No"],
        closesInHours: 24,
    },
    {
        question: "How many points will UCLA men's basketball score in its next home game at Pauley?",
        category: "D1 Sports",
        outcomes: ["Under 70", "70-79", "80 or more"],
        closesInHours: 2 * 24,
    },
    {
        question: "Will UCLA women's basketball win its next game by 10+ points?",
        category: "D1 Sports",
        outcomes: ["Yes", "No"],
        closesInHours: 3 * 24,
    },
    {
        question: "Will UCLA women's volleyball win its next home match?",
        category: "D1 Sports",
        outcomes: ["Yes", "No"],
        closesInHours: 4 * 24,
    },
    {
        question: "Will UCLA men's water polo win the NCAA championship this season?",
        category: "D1 Sports",
        outcomes: ["Yes", "No"],
        closesInHours: 21 * 24,
    },
    {
        question: "How far will UCLA women's soccer go in the NCAA tournament?",
        category: "D1 Sports",
        outcomes: ["Out before quarterfinals", "Quarterfinals", "College Cup"],
        closesInHours: 7 * 24,
    },

    // IM sports
    {
        question: "Which hill team wins the IM flag football championship?",
        category: "IM Sports",
        outcomes: ["Hedrick Hustlers", "Sproul Sprinters", "Rieber Raiders", "De Neve Dawgs"],
        closesInHours: 5 * 24,
    },
    {
        question: "Will the co-rec IM soccer final be decided by penalty kicks?",
        category: "IM Sports",
        outcomes: ["Yes", "No"],
        closesInHours: 4 * 24,
    },
    {
        question: "Who wins the co-rec IM volleyball final?",
        category: "IM Sports",
        outcomes: ["Sproul Spikers", "Hedrick Hitters"],
        closesInHours: 10 * 24,
    },
    {
        question: "Who wins the IM dodgeball tournament this Sunday?",
        category: "IM Sports",
        outcomes: ["Engineering", "North Campus", "South Campus"],
        closesInHours: 2 * 24,
    },
    {
        question: "Will the top seed win the IM pickleball doubles bracket?",
        category: "IM Sports",
        outcomes: ["Yes", "No"],
        closesInHours: 3 * 24,
    },

    // dining
    {
        question: "Which dining hall will serve orange chicken first this week?",
        category: "Dining",
        outcomes: ["De Neve", "Bruin Plate", "Epicuria at Covel", "Feast at Rieber"],
        closesInHours: 5 * 24,
    },
    {
        question: "Will Rendezvous have birria tacos on the menu on Monday?",
        category: "Dining",
        outcomes: ["Yes", "No"],
        closesInHours: 2 * 24,
    },
    {
        question: "Will Epicuria have a lamb dish on the dinner menu tomorrow?",
        category: "Dining",
        outcomes: ["Yes", "No"],
        closesInHours: 24,
    },
    {
        question: "Will Bruin Plate serve salmon at dinner this Sunday?",
        category: "Dining",
        outcomes: ["Yes", "No"],
        closesInHours: 2 * 24,
    },
    {
        question: "Will De Neve serve pizza at late night every night of finals week?",
        category: "Dining",
        outcomes: ["Yes", "No"],
        closesInHours: 20 * 24,
    },
    {
        question: "Will Feast at Rieber serve dumplings at dinner this week?",
        category: "Dining",
        outcomes: ["Yes", "No"],
        closesInHours: 6 * 24,
    },
];

export default markets;
