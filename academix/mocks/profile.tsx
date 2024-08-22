export const statistics = [
  {
    id: "0",
    title: "Projects Completed",
    counter: 12,
    percent: 5.2,
    color: "#AE7AFF",
    parameters: [6, 7, 8, 10, 11, 12],
  },
  {
    id: "1",
    title: "Tasks Pending",
    counter: 34,
    percent: -1.8,
    color: "#98E9AB",
    parameters: [30, 32, 31, 33, 34, 35],
  },
];

export const tasks = [
  {
    id: "0",
    isChecked: true,
    title: "Literature Review",
    comments: 2,
    date: "04 July 2024",
    avatar: "/images/avatars/avatar-1.jpg",
  },
  {
    id: "1",
    isChecked: true,
    title: "Project Proposal Submission",
    comments: 3,
    date: "10 July 2024",
    avatar: "/images/avatars/avatar-2.jpg",
  },
  {
    id: "2",
    isChecked: false,
    title: "Data Collection",
    comments: 5,
    date: "15 July 2024",
    avatar: "/images/avatars/avatar-3.jpg",
  },
  {
    id: "3",
    isChecked: false,
    title: "Data Analysis",
    comments: 4,
    date: "20 July 2024",
    avatar: "/images/avatars/avatar-4.jpg",
  },
  {
    id: "4",
    isChecked: false,
    title: "Draft Report Writing",
    comments: 6,
    date: "25 July 2024",
    avatar: "/images/avatars/avatar-5.jpg",
  },
  {
    id: "5",
    isChecked: false,
    title: "Final Report Submission",
    comments: 1,
    date: "30 July 2024",
    avatar: "/images/avatars/avatar-6.jpg",
  },
  {
    id: "6",
    isChecked: false,
    title: "Prepare HTML & CSS",
    comments: 7,
    date: "30 August 2024",
    avatar: "/images/avatars/avatar-7.jpg",
  },
];

export const tasks2 = [
  {
    id: "0",
    author: "Alice Johnson",
    time: "15 minutes ago",
    avatar: "/images/avatars/avatar-2.jpg",
    content: "Marked 2 tasks as complete",
    tasks: [
      {
        id: "0",
        isChecked: true,
        title: "Literature Review",
        date: "04 July 2024",
      },
      {
        id: "1",
        isChecked: true,
        title: "Project Proposal Submission",
        date: "10 July 2024",
      },
    ],
    comments: 8,
    likes: 25,
  },
  {
    id: "1",
    author: "Alice Johnson",
    time: "4 hours ago",
    avatar: "/images/avatars/avatar-2.jpg",
    content: "Uploaded new project files",
    files: [
      {
        id: "0",
        icon: "doc",
        title: "Proposal.docx",
        progress: 100,
      },
      {
        id: "1",
        icon: "xls",
        title: "Data_Collection.xlsx",
      },
      {
        id: "2",
        icon: "ppt",
        title: "Presentation.pptx",
      },
    ],
    comments: 12,
    likes: 32,
  },
];

export const tasks3 = [
  {
    id: "0",
    author: "Bob Smith",
    time: "3 hours ago",
    avatar: "/images/avatars/avatar-4.jpg",
    content: "Assigned new tasks for data analysis",
    tasks: [
      {
        id: "0",
        isChecked: false,
        title: "Collect Data from Surveys",
        date: "10 July 2024",
      },
      {
        id: "1",
        isChecked: false,
        title: "Analyze Survey Data",
        date: "15 July 2024",
      },
      {
        id: "2",
        isChecked: false,
        title: "Prepare Data Summary",
        date: "20 July 2024",
      },
    ],
    comments: 10,
    likes: 40,
  },
  {
    id: "1",
    author: "Bob Smith",
    time: "15 minutes ago",
    avatar: "/images/avatars/avatar-4.jpg",
    content: "Completed initial data collection",
    tasks: [
      {
        id: "0",
        isChecked: true,
        title: "Collect Data from Surveys",
        date: "25 July 2024",
      },
      {
        id: "1",
        isChecked: true,
        title: "Analyze Survey Data",
        date: "30 July 2024",
      },
    ],
    comments: 18,
    likes: 60,
  },
];

export const experience = [
  {
    id: "0",
    title: "Research Assistant",
    city: "Kuala Lumpur",
    company: "University of Malaya",
    duration: "2022 - Present",
    content: "Assisting in research and data analysis for various projects.",
    image: "/images/um-logo.svg",
  },
  {
    id: "1",
    title: "Intern",
    city: "Singapore",
    company: "Google Inc.",
    duration: "2021 - 2022",
    content: "Worked on a project for optimizing search algorithms.",
    image: "/images/google.svg",
  },
  {
    id: "2",
    title: "Junior Developer",
    city: "London",
    company: "Facebook Inc.",
    duration: "2020 - 2021",
    content: "Developed new features for the internal tools.",
    image: "/images/facebook.svg",
  },
];

export const connections = [
  {
    id: "0",
    man: "Ahmad Nazeri",
    position: "Supervisor",
    company: "Universiti Teknologi Malaysia",
    logo: "/images/utm-logo.svg",
    avatar: "/images/avatars/avatar-14.jpg",
  },
  {
    id: "1",
    man: "Thitiwat Shimma",
    position: "Co-supervisor",
    company: "Asia Pacific University",
    logo: "/images/apu-logo.svg",
    avatar: "/images/avatars/avatar-15.jpg",
  },
  {
    id: "2",
    man: "Xian Zhou",
    position: "Peer Reviewer",
    company: "University of Malaya",
    logo: "/images/um-logo.svg",
    avatar: "/images/avatars/avatar-16.jpg",
  },
  {
    id: "3",
    man: "Njimoluh Ebua",
    position: "Project Partner",
    company: "Taylor's University",
    logo: "/images/taylors-logo.svg",
    avatar: "/images/avatars/avatar-17.jpg",
  },
];

export const detailsAccount = [
  {
    id: "0",
    label: "Full name",
    value: "Henry Richardson",
    fullWide: true,
  },
  {
    id: "1",
    label: "University",
    value: "Asia Pacific University",
    fullWide: true,
  },
  {
    id: "2",
    label: "City",
    value: "Kuala Lumpur",
    fullWide: true,
  },
  {
    id: "3",
    label: "Date of birth",
    value: "January 24, 1998",
    fullWide: false,
  },
  {
    id: "4",
    label: "Gender",
    value: "Male",
    fullWide: false,
  },
  {
    id: "5",
    label: "Email address",
    value: "henry.richardson@gmail.com",
    fullWide: false,
  },
  {
    id: "6",
    label: "Phone number",
    value: "+60 123 456 789",
    fullWide: false,
  },
  {
    id: "7",
    label: "Address",
    value: "No 10, Jalan 1/1, Kuala Lumpur",
    fullWide: true,
  },
];

export const detailsSecurity = [
  {
    id: "0",
    label: "Current password",
    value: "••••••",
    fullWide: true,
  },
  {
    id: "1",
    label: "Security questions",
    value: "Your mother's maiden name",
    fullWide: false,
  },
  {
    id: "2",
    label: "2-Step verification",
    value: "Enabled",
    fullWide: false,
  },
];

export const securityCredentials = [
  {
    id: "0",
    title: "Mac OS Safari 15.1",
    date: "01 Apr 2023 at 06:25PM",
    icon: "desktop",
    currentSession: true,
  },
  {
    id: "1",
    title: "iOS Safari 15.1",
    date: "19 Oct 2023 at 06:30AM",
    icon: "mobile",
    currentSession: false,
  },
];

export const socialProfiles = [
  { id: 1, name: "John Doe", email: "john.doe@example.com", service: "Twitter", status: "Active", profile: "https://twitter.com/johndoe" },
  { id: 2, name: "Jane Smith", email: "jane.smith@example.com", service: "Facebook", status: "Inactive", profile: "https://facebook.com/janesmith" },
  { id: 3, name: "Alice Johnson", email: "alice.johnson@example.com", service: "Instagram", status: "Active", profile: "https://instagram.com/alicejohnson" },
  { id: 4, name: "Bob Jones", email: "bob.jones@example.com", service: "LinkedIn", status: "Inactive", profile: "https://linkedin.com/bobjones" },
  { id: 5, name: "Emily Wang", email: "emily.wang@example.com", service: "Pinterest", status: "Active", profile: "https://pinterest.com/emilywang" },
  { id: 6, name: "Michael Brown", email: "michael.brown@example.com", service: "Snapchat", status: "Inactive", profile: "https://snapchat.com/michaelbrown" },
  { id: 7, name: "Sarah Davis", email: "sarah.davis@example.com", service: "Reddit", status: "Active", profile: "https://reddit.com/sarahdavis" },
  { id: 8, name: "Kevin Miller", email: "kevin.miller@example.com", service: "TikTok", status: "Active", profile: "https://tiktok.com/kevinmiller" },
  { id: 9, name: "Linda White", email: "linda.white@example.com", service: "WhatsApp", status: "Inactive", profile: "https://whatsapp.com/lindawhite" },
  { id: 10, name: "David Thomas", email: "david.thomas@example.com", service: "YouTube", status: "Active", profile: "https://youtube.com/davidthomas" },
];