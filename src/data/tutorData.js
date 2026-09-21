export const INITIAL_COURSES = [
  { id: "c1", code: "MATH 151", description: "Algebra and Trigonometry. Covering fundamental concepts for engineering students.", students: 12, sessions: 24 },
  { id: "c2", code: "COE 157", description: "Introduction to Information Technology. Basic computing and architecture.", students: 8, sessions: 16 },
];

export const INITIAL_SLOTS = [
  { id: "s1", day: "Monday", start: "10:00 AM", end: "12:00 PM", type: "1-on-1" },
  { id: "s2", day: "Wednesday", start: "2:00 PM", end: "4:00 PM", type: "group", maxSpots: 5 },
  { id: "s3", day: "Friday", start: "1:00 PM", end: "3:00 PM", type: "group", maxSpots: 3 },
  { id: "s4", day: "Saturday", start: "9:00 AM", end: "11:00 AM", type: "1-on-1" },
];

export const INITIAL_INCOMING_REQUESTS = [
  {
    id: "ir1",
    studentName: "Sarah Jenkins",
    studentPhone: "0244998877",
    course: "CS 312: Data Structures",
    when: "Tomorrow, 2:00 PM - 3:30 PM",
    duration: "1.5 hours",
    location: "Virtual Session",
    message: "Need help understanding Binary Search Trees before the mid-sem next week.",
    avatarColor: "#8B5CF6",
    status: "pending",
  },
  {
    id: "ir2",
    studentName: "David Osei",
    studentPhone: "0209988776",
    course: "CS 201: Programming I",
    when: "Friday, 10:00 AM - 11:00 AM",
    duration: "1 hour",
    location: "Library Group Study Rm",
    message: null,
    avatarColor: "#0E7490",
    status: "pending",
  },
];