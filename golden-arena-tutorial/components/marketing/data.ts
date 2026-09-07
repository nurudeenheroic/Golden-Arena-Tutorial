// Central place for the content used by the landing page.
// Edit the arrays here when you want to change subjects, stats, testimonials, etc.

import {
  Atom,
  Beaker,
  BookOpen,
  Calculator,
  FlaskConical,
  GraduationCap,
  Leaf,
  LibraryBig,
  LineChart,
  MessageCircle,
  NotebookTabs,
  PencilRuler,
  PlayCircle,
  Trophy,
  Users,
} from "lucide-react";

// Replace this with your real WhatsApp community invite link before launch.
// components/marketing/data.ts
export const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/your-group-invite-code";

export const navLinks = [
  { label: "Home", href: "/" },
  {
    label: "UTME",
    href: "/utme",
    dropdown: [
      { label: "JAMB Syllabus", href: "/utme/syllabus" },
      { label: "UTME Practice Tests", href: "/quizzes?category=utme", requiresPaid: false },
      { label: "Subject Combination Guide", href: "/utme/subjects" },
    ],
  },
  {
    label: "Post-UTME",
    href: "/post-utme",
    dropdown: [
      { label: "Select University", href: "/post-utme/universities" },
      { label: "Past CBT Screening Tests", href: "/quizzes?category=post_utme", requiresPaid: true },
    ],
  },
  { label: "Past Questions", href: "/past-questions" },
  { label: "Quizzes", href: "/quizzes" },
  { label: "Study Groups", href: WHATSAPP_GROUP_URL },
  { label: "Pricing", href: "/#pricing" },
  {
    label: "Resources",
    href: "/resources",
    dropdown: [
      { label: "Study Notes", href: "/notes", requiresPaid: true },
      { label: "FAQs & Support", href: "/support" },
    ],
  },
];

export const stats = [
  { value: "15,000+", label: "Students", icon: Users },
  { value: "300+", label: "Video Lessons", icon: BookOpen },
  { value: "10,000+", label: "Past Questions", icon: NotebookTabs },
  { value: "98%", label: "Success Rate", icon: LineChart },
  { value: "24/7", label: "Support", icon: MessageCircle },
];

export const subjects = [
  { name: "Mathematics", questions: "2,450", icon: Calculator, tone: "brown" },
  { name: "Physics", questions: "1,980", icon: Atom, tone: "blue" },
  { name: "Chemistry", questions: "2,100", icon: FlaskConical, tone: "orange" },
  { name: "Biology", questions: "1,950", icon: Leaf, tone: "green" },
  { name: "Further Maths", questions: "1,200", icon: PencilRuler, tone: "purple" },
  { name: "English", questions: "2,300", icon: LibraryBig, tone: "rose" },
];

export const learningSteps = [
  {
    number: "01",
    title: "Sign Up Free",
    description: "Create your account and choose your learning level.",
    icon: Users,
  },
  {
    number: "02",
    title: "Choose Your Plan",
    description: "Access free or premium content that fits your needs.",
    icon: GraduationCap,
  },
  {
    number: "03",
    title: "Learn & Practice",
    description: "Watch lessons, take quizzes and solve past questions.",
    icon: BookOpen,
  },
  {
    number: "04",
    title: "Track Progress",
    description: "Monitor your performance and improve every day.",
    icon: LineChart,
  },
  {
    number: "05",
    title: "Ace Your Exam",
    description: "Go into your exam confident and prepared.",
    icon: Trophy,
  },
];

export const testimonials = [
  {
    quote: "GAT made my UTME preparation so much easier. The past questions and explanations are top-notch.",
    name: "Tunde A.",
    role: "UTME Candidate",
  },
  {
    quote: "I scored 280+ in my Post-UTME thanks to GAT. The mock exams really helped build my confidence.",
    name: "Esther M.",
    role: "Post-UTME Candidate",
  },
  {
    quote: "The platform is easy to use and has everything I need. Highly recommended!",
    name: "David K.",
    role: "UTME Candidate",
  },
{
    name: "Emeka Nwosu",
    role: "Gained Admission to UNILAG (Medicine)",
    quote:
      "The CBT mock exams felt exactly like the actual JAMB hall setting. Practicing under timed conditions boosted my speed and confidence tremendously!",
  },
  {
    name: "Amina Yusuf",
    role: "Scored 312 in 2025 UTME",
    quote:
      "GAT study notes simplified complex Physics and Chemistry topics into digestible bites. I went from scoring 210 in mock tests to 312 in the main exam!",
  },
  {
    name: "Tunde Bakare",
    role: "Admitted to OAU (Computer Engineering)",
    quote:
      "The Post-UTME past question bank was a total game-changer for me. Almost 70% of the question types I practiced appeared in my screening test.",
  },

  // 5 New Testimonials Added Below:
  {
    name: "Blessing Okon",
    role: "Admitted to UNIBEN (Law)",
    quote:
      "The step-by-step answer explanations helped me understand *why* an option was correct rather than just cramming answers. Highly recommended!",
  },
  {
    name: "Chidi Nnamdi",
    role: "Scored 298 in UTME",
    quote:
      "Buying the single ₦500 Mock Exam test gave me the exact reality check I needed two weeks before my exam. Worth every single Naira.",
  },
  {
    name: "Fatima Bello",
    role: "Admitted to ABU Zaria (Pharmacy)",
    quote:
      "The WhatsApp study group kept me accountable every single day. Having tutors answer my quick doubts late at night made all the difference.",
  },
  {
    name: "Kelechi Eze",
    role: "Scored 305 in UTME",
    quote:
      "I used to struggle with Use of English comprehension passages. The practice quizzes on GAT taught me speed-reading strategies that saved me.",
  },
  {
    name: "Zainab Abubakar",
    role: "Admitted to UI (Economics)",
    quote:
      "The smooth mobile interface allowed me to practice 20 quick quiz questions on my phone while traveling. It made studying effortless anywhere.",
  },
];

export const popularPostUtme = [
  { name: "University of Ibadan (UI)", questions: "2,450 Questions" },
  { name: "University of Benin (UNIBEN)", questions: "2,100 Questions" },
  { name: "Covenant University (CU)", questions: "1,960 Questions" },
  { name: "Lagos State University (LASU)", questions: "1,750 Questions" },
  { name: "University of Ilorin (UNILORIN)", questions: "1,650 Questions" },
];

export const recentQuizzes = [
  { name: "Mathematics Quiz 25", progress: 75 },
  { name: "Chemistry Quiz 18", progress: 60 },
  { name: "English Quiz 12", progress: 45 },
  { name: "Physics Quiz 20", progress: 80 },
];
